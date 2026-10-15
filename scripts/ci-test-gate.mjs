#!/usr/bin/env node
// Decides whether the required "Tests" check can skip its work for this event.
// Fails closed: anything not on the ignore list, or any doubt, runs the tests.
// Env: EVENT_NAME, BASE_REF (PR base branch), GITHUB_OUTPUT, GITHUB_STEP_SUMMARY.

import { execFileSync } from 'node:child_process';
import { appendFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

export const IGNORED_GLOBS = [
    '**/*.md',
    '**/*.mdx',
    'docs/**',
    'LICENSE',
    'CNAME',
    '**/*.png',
    '**/*.jpg',
    '**/*.jpeg',
    '**/*.gif',
    '**/*.svg',
    '**/*.ico',
    '**/*.webp',
    '.github/ISSUE_TEMPLATE/**',
    '.github/PULL_REQUEST_TEMPLATE.md',
    '.github/CODEOWNERS',
    '.cursor/**',
    '.claude/**',
];

const globToRegExp = (glob) =>
    new RegExp(
        '^' +
            glob
                .split('**/')
                .map((part) =>
                    part
                        .replace(/[.+^${}()|[\]\\]/g, '\\$&')
                        .replace(/\*\*/g, '\u0000')
                        .replace(/\*/g, '[^/]*')
                        .replace(/\u0000/g, '.*'),
                )
                .join('(?:.*/)?') +
            '$',
    );

const IGNORED = IGNORED_GLOBS.map(globToRegExp);

export const isIgnored = (file) => IGNORED.some((re) => re.test(file));

export function decide({ eventName, changedFiles }) {
    if (eventName !== 'pull_request') {
        return { run: true, reason: `always runs on ${eventName}` };
    }
    if (!Array.isArray(changedFiles)) {
        return { run: true, reason: 'changed files could not be determined' };
    }
    if (changedFiles.length === 0) {
        return { run: true, reason: 'no changed files reported' };
    }
    const relevant = changedFiles.filter((f) => !isIgnored(f));
    if (relevant.length > 0) {
        return {
            run: true,
            reason: `${relevant.length} changed file(s) can affect tests, e.g. ${relevant[0]}`,
        };
    }
    return {
        run: false,
        reason: `all ${changedFiles.length} changed file(s) are docs or assets`,
    };
}

function changedFilesFromGit(baseRef) {
    const git = (args) =>
        execFileSync('git', args, { encoding: 'utf8' }).trim();
    const base = git(['merge-base', `origin/${baseRef}`, 'HEAD']);
    return git(['diff', '--name-only', base, 'HEAD'])
        .split('\n')
        .map((f) => f.trim())
        .filter(Boolean);
}

function main() {
    const eventName = process.env.EVENT_NAME ?? 'unknown';
    let changedFiles = null;
    if (eventName === 'pull_request' && process.env.BASE_REF) {
        try {
            changedFiles = changedFilesFromGit(process.env.BASE_REF);
        } catch (err) {
            console.error(`could not list changed files: ${err.message}`);
        }
    }
    const { run, reason } = decide({ eventName, changedFiles });
    const line = run ? `Tests run: ${reason}.` : `Tests skipped: ${reason}.`;
    console.log(line);
    if (process.env.GITHUB_OUTPUT) {
        appendFileSync(
            process.env.GITHUB_OUTPUT,
            `run=${run}\nreason=${reason}\n`,
        );
    }
    if (process.env.GITHUB_STEP_SUMMARY) {
        appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${line}\n`);
    }
}

if (
    process.argv[1] &&
    import.meta.url === pathToFileURL(process.argv[1]).href
) {
    main();
}
