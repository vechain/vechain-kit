import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { Buffer as BrowserBuffer } from 'buffer';
import { afterEach, vi } from 'vitest';

// jsdom installs its own Uint8Array realm, so Node's Buffer fails `instanceof`
// checks in secp256k1 code. Use the browser polyfill, as a bundled app would.
if (typeof window !== 'undefined') {
    globalThis.Buffer = BrowserBuffer as unknown as typeof globalThis.Buffer;
}

// No test may reach the network: answer 404 and record the attempt.
export const blockedFetches: string[] = [];
const noNetwork = async (input: RequestInfo | URL) => {
    blockedFetches.push(String(input));
    return new Response('{}', {
        status: 404,
        headers: { 'content-type': 'application/json' },
    });
};
vi.stubGlobal('fetch', vi.fn(noNetwork));

// applyDAppKitButtonStyles observes document.body forever; stop observers before
// jsdom tears the document down.
const observers = new Set<MutationObserver>();
if (typeof MutationObserver !== 'undefined') {
    const Native = MutationObserver;
    globalThis.MutationObserver = class extends Native {
        constructor(callback: MutationCallback) {
            super(callback);
            observers.add(this);
        }
    };
}

afterEach(() => {
    cleanup();
    for (const observer of observers) observer.disconnect();
    observers.clear();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.stubGlobal('fetch', vi.fn(noNetwork));
});

if (typeof window !== 'undefined') {
    // jsdom lacks these; Chakra and dapp-kit touch them on mount.
    if (!window.matchMedia) {
        window.matchMedia = (query: string) =>
            ({
                matches: false,
                media: query,
                onchange: null,
                addListener: () => {},
                removeListener: () => {},
                addEventListener: () => {},
                removeEventListener: () => {},
                dispatchEvent: () => false,
            } as MediaQueryList);
    }
    if (!window.ResizeObserver) {
        window.ResizeObserver = class {
            observe() {}
            unobserve() {}
            disconnect() {}
        };
    }
    if (!window.scrollTo) {
        window.scrollTo = () => {};
    }
}
