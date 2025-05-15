import { useQuery } from '@tanstack/react-query';
import { AllowedCategories } from '@/components/AccountModal/Contents/Ecosystem/Components/CategoryLabel';
export type AppHubApp = {
    id: string;
    name: string;
    description: string;
    url: string;
    logo: string;
    category: AllowedCategories;
    tags: string[];
    isVeWorldSupported: boolean;
    repo?: string;
    contracts?: string[];
    veBetterDaoId?: string;
};

// Cache key for local storage
const CACHE_KEY = 'vechain-kit-app-hub-apps';
const CACHE_EXPIRY_KEY = 'vechain-kit-app-hub-apps-expiry';
const CACHE_EXPIRY_TIME = 24 * 60 * 60 * 1000; // 24 hours

// GitHub API endpoints
const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_RAW_CONTENT_BASE =
    'https://raw.githubusercontent.com/vechain/app-hub/master';

/**
 * Query key for AppHub apps
 */
export const getAppHubAppsQueryKey = () => ['VECHAIN_KIT', 'appHub', 'apps'];

/**
 * Fetches apps from the VeChain App Hub repository
 * @returns A list of apps from the VeChain App Hub
 */
export const fetchAppHubApps = async (): Promise<AppHubApp[]> => {
    // Check for cached data first
    try {
        const cachedData = localStorage.getItem(CACHE_KEY);
        const cacheExpiry = localStorage.getItem(CACHE_EXPIRY_KEY);

        // If we have valid cached data, use it
        if (cachedData && cacheExpiry) {
            const expiryTime = parseInt(cacheExpiry, 10);
            if (Date.now() < expiryTime) {
                return JSON.parse(cachedData);
            }
        }
    } catch {
        // Invalid cache, continue with fetch
        console.warn('Invalid app-hub cache, fetching fresh data');
    }

    // Fetch fresh data from GitHub
    const dirResponse = await fetch(
        `${GITHUB_API_BASE}/repos/vechain/app-hub/contents/apps`,
    );
    if (!dirResponse.ok) {
        throw new Error('Failed to fetch app directories');
    }

    const directories = await dirResponse.json();

    // Fetch each app's manifest.json
    const appPromises = directories.map(async (dir: any) => {
        if (dir.type !== 'dir') return null;

        const manifestUrl = `${GITHUB_RAW_CONTENT_BASE}/apps/${dir.name}/manifest.json`;
        const manifestResponse = await fetch(manifestUrl);

        if (!manifestResponse.ok) {
            console.warn(`Failed to fetch manifest for ${dir.name}`);
            return null;
        }

        try {
            const manifest = await manifestResponse.json();
            return {
                id: dir.name,
                name: manifest.name,
                description: manifest.desc,
                url: manifest.href,
                logo: `${GITHUB_RAW_CONTENT_BASE}/apps/${dir.name}/logo.png`,
                category: manifest.category,
                tags: manifest.tags || [],
                isVeWorldSupported: manifest.isVeWorldSupported || false,
                repo: manifest.repo,
                contracts: manifest.contracts,
                veBetterDaoId: manifest.veBetterDaoId,
            };
        } catch (e) {
            console.warn(`Error parsing manifest for ${dir.name}:`, e);
            return null;
        }
    });

    const appsData = await Promise.all(appPromises);
    const validApps = appsData.filter((app) => app !== null) as AppHubApp[];

    // Cache the valid apps data
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(validApps));
        localStorage.setItem(
            CACHE_EXPIRY_KEY,
            (Date.now() + CACHE_EXPIRY_TIME).toString(),
        );
    } catch (e) {
        console.warn('Failed to cache app-hub data:', e);
    }

    return validApps;
};

/**
 * Hook to fetch apps from the VeChain App Hub repository
 * @returns The query result containing apps from the VeChain App Hub
 *
 * @example
 * ```tsx
 * const { data: apps, isLoading, error } = useAppHubApps();
 *
 * if (isLoading) return <div>Loading...</div>;
 * if (error) return <div>Error loading apps</div>;
 *
 * return (
 *   <div>
 *     {apps?.map(app => (
 *       <AppCard key={app.id} app={app} />
 *     ))}
 *   </div>
 * );
 * ```
 */
export const useAppHubApps = () => {
    return useQuery<AppHubApp[]>({
        queryKey: getAppHubAppsQueryKey(),
        queryFn: async () => {
            try {
                return await fetchAppHubApps();
            } catch (error) {
                // If fetch fails, try to use cached data as fallback
                const cachedData = localStorage.getItem(CACHE_KEY);
                if (cachedData) {
                    return JSON.parse(cachedData);
                }
                // If no cached data, throw the original error
                throw error;
            }
        },
        staleTime: 1000 * 60 * 60, // Cache for 1 hour
        retry: 2,
    });
};
