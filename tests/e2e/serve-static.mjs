#!/usr/bin/env node
// Serves a Next.js static export (`output: 'export'`) with html fallbacks.
// Usage: node serve-static.mjs <dir> <port>
import { createServer } from 'node:http';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';

const [dir = '../../examples/next-template/dist', port = '3000'] =
    process.argv.slice(2);
const root = resolve(dir);
const types = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript',
    '.mjs': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.ico': 'image/x-icon',
    '.woff2': 'font/woff2',
    '.woff': 'font/woff',
    '.txt': 'text/plain',
    '.map': 'application/json',
};

const resolveFile = (urlPath) => {
    const clean = normalize(decodeURIComponent(urlPath.split('?')[0])).replace(
        /^(\.\.[/\\])+/,
        '',
    );
    const candidates = [
        join(root, clean),
        join(root, `${clean}.html`),
        join(root, clean, 'index.html'),
        join(root, 'index.html'),
    ];
    return candidates.find(
        (f) => f.startsWith(root) && existsSync(f) && statSync(f).isFile(),
    );
};

createServer((req, res) => {
    const file = resolveFile(req.url ?? '/');
    if (!file) {
        res.writeHead(404).end('not found');
        return;
    }
    res.writeHead(200, {
        'content-type': types[extname(file)] ?? 'application/octet-stream',
    });
    res.end(readFileSync(file));
}).listen(Number(port), () => {
    console.log(`serving ${root} on http://localhost:${port}`);
});
