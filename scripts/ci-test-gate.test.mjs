import { describe, expect, it } from 'vitest';
import { decide, isIgnored } from './ci-test-gate.mjs';

describe('ci-test-gate isIgnored', () => {
    it.each([
        'README.md',
        'docs/testing.md',
        'docs/recipes/transak-onramp.md',
        'packages/vechain-kit/README.md',
        '.changeset/fluffy-cats.md',
        'LICENSE',
        'CNAME',
        'examples/homepage/public/logo.png',
        'packages/vechain-kit/src/assets/icon.svg',
        '.github/ISSUE_TEMPLATE/bug.yml',
        '.github/CODEOWNERS',
        '.cursor/rules/x.mdc',
    ])('ignores %s', (file) => {
        expect(isIgnored(file)).toBe(true);
    });

    it.each([
        'packages/vechain-kit/src/index.ts',
        'package.json',
        'yarn.lock',
        '.github/workflows/tests.yaml',
        'scripts/ci-test-gate.mjs',
        'examples/next-template/next.config.js',
        'docs.ts',
        'LICENSE.txt',
        'packages/vechain-kit/src/languages/en.json',
        'thor-solo/docker-compose.yaml',
        'vitest.config.ts',
    ])('runs for %s', (file) => {
        expect(isIgnored(file)).toBe(false);
    });
});

describe('ci-test-gate decide', () => {
    it('always runs on pushes', () => {
        expect(
            decide({ eventName: 'push', changedFiles: ['README.md'] }).run,
        ).toBe(true);
    });

    it('runs when the changed files are unknown or empty', () => {
        expect(
            decide({ eventName: 'pull_request', changedFiles: null }).run,
        ).toBe(true);
        expect(
            decide({ eventName: 'pull_request', changedFiles: [] }).run,
        ).toBe(true);
    });

    it('runs when any changed file is not on the ignore list', () => {
        const result = decide({
            eventName: 'pull_request',
            changedFiles: ['README.md', 'packages/vechain-kit/src/index.ts'],
        });
        expect(result.run).toBe(true);
        expect(result.reason).toContain('packages/vechain-kit/src/index.ts');
    });

    it('skips only when every changed file is docs or assets', () => {
        const result = decide({
            eventName: 'pull_request',
            changedFiles: [
                'README.md',
                'docs/testing.md',
                'examples/homepage/public/a.png',
            ],
        });
        expect(result).toEqual({
            run: false,
            reason: 'all 3 changed file(s) are docs or assets',
        });
    });
});
