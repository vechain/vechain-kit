/**
 * Runtime lookup against the snapshot of vechain/app-hub baked at build time.
 * Refresh the snapshot with:
 *
 *   yarn workspace cross-app-connect generate-app-hub
 *
 * (the script lives at cross-app-connect/scripts/fetch-app-hub.mjs).
 */
import data from './app-hub.json';

export type AppHubEntry = {
    slug: string;
    name: string;
    category: string | null;
    href: string;
};

const REGISTRY = data as Record<string, AppHubEntry>;

export function lookupAppByUrl(url: string | undefined): AppHubEntry | null {
    if (!url) return null;
    try {
        const origin = new URL(url).origin;
        return REGISTRY[origin] ?? null;
    } catch {
        return null;
    }
}
