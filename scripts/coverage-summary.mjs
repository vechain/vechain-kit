#!/usr/bin/env node
// Prints coverage/coverage-summary.json as a Markdown table for the job summary.
import { existsSync, readFileSync } from 'node:fs';

const file = process.argv[2] ?? 'coverage/coverage-summary.json';
if (!existsSync(file)) {
    console.log('No coverage report was produced.');
    process.exit(0);
}
const { total } = JSON.parse(readFileSync(file, 'utf8'));
const row = (name) =>
    `| ${name} | ${total[name].pct}% | ${total[name].covered}/${total[name].total} |`;
console.log('### Coverage\n');
console.log('| Metric | Covered | Count |');
console.log('| --- | --- | --- |');
for (const name of ['lines', 'statements', 'functions', 'branches'])
    console.log(row(name));
