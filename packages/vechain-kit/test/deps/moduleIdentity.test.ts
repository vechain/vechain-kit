// @vitest-environment node
import { existsSync, readFileSync, realpathSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

// Packages whose module-level state (stores, contexts) must be shared between
// the listed consumers; the kit joins only where it imports the package itself.
// Two copies build fine but crash on load: the "valtio 1 vs 2" incident.
const SHARED: Array<{
    pkg: string;
    consumers: string[];
    kitImports?: boolean;
}> = [
    {
        pkg: 'valtio',
        consumers: ['@vechain/dapp-kit', '@vechain/dapp-kit-react'],
        kitImports: false,
    },
    {
        pkg: 'react',
        consumers: ['@vechain/dapp-kit-react', '@privy-io/react-auth', 'wagmi'],
    },
    {
        pkg: 'react-dom',
        consumers: ['@vechain/dapp-kit-react', '@privy-io/react-auth'],
    },
    {
        pkg: '@tanstack/react-query',
        consumers: ['@vechain/dapp-kit-react', 'wagmi'],
    },
];

const kitDir = resolve(__dirname, '../..');

// Node's package lookup without the `exports` map, which some packages close.
const findPackageDir = (fromDir: string, pkg: string): string | null => {
    let dir = fromDir;
    for (;;) {
        const candidate = join(dir, 'node_modules', pkg);
        if (existsSync(join(candidate, 'package.json')))
            return realpathSync(candidate);
        const parent = dirname(dir);
        if (parent === dir) return null;
        dir = parent;
    }
};

const version = (dir: string) =>
    JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8')).version;

describe('dependency tree', () => {
    it.each(SHARED)(
        'resolves a single copy of $pkg across $consumers',
        ({ pkg, consumers, kitImports = true }) => {
            const copies = consumers.map((consumer) => {
                const consumerDir = findPackageDir(kitDir, consumer);
                expect(consumerDir).not.toBeNull();
                return {
                    consumer,
                    copy: findPackageDir(consumerDir as string, pkg),
                };
            });
            if (kitImports)
                copies.push({
                    consumer: 'vechain-kit',
                    copy: findPackageDir(kitDir, pkg),
                });
            const reference = copies[0].copy;
            expect(reference).not.toBeNull();
            for (const { consumer, copy } of copies) {
                expect({ consumer, pkg, copy }).toEqual({
                    consumer,
                    pkg,
                    copy: reference,
                });
            }
        },
    );

    it('gives dapp-kit the valtio version it pins', () => {
        const dappKit = findPackageDir(kitDir, '@vechain/dapp-kit') as string;
        const pinned = JSON.parse(
            readFileSync(join(dappKit, 'package.json'), 'utf8'),
        ).dependencies.valtio as string;
        expect(version(findPackageDir(dappKit, 'valtio') as string)).toBe(
            pinned.replace(/^[\^~]/, ''),
        );
    });
});
