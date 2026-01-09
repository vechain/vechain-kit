import { useQuery } from '@tanstack/react-query';
import { AllowedCategories } from '@/components/AccountModal/Contents/Ecosystem/Components/CategoryLabel';
import { getLocalStorageItem, setLocalStorageItem } from '@/utils/ssrUtils';
import {
    APP_HUB_GITHUB_API_BASE_URL,
    APP_HUB_GITHUB_RAW_REPO_BASE_URL,
} from '@/constants';
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

/**
 * Query key for AppHub apps
 */
export const getAppHubAppsQueryKey = () => ['VECHAIN_KIT', 'appHub', 'apps'];

/**
 * Fetches apps from the VeChain App Hub repository
 * @returns A list of apps from the VeChain App Hub
 */
export const fetchAppHubApps = async (): Promise<AppHubApp[]> => {
    // Check for cached data first (skip during SSR)
    if (typeof window !== 'undefined') {
        try {
            const cachedData = getLocalStorageItem(CACHE_KEY);
            const cacheExpiry = getLocalStorageItem(CACHE_EXPIRY_KEY);

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
    }

    // Fetch fresh data from GitHub
    const appsDirUrl = new URL('contents/apps', APP_HUB_GITHUB_API_BASE_URL);
    const dirResponse = await fetch(appsDirUrl);
    if (!dirResponse.ok) {
        throw new Error('Failed to fetch app directories');
    }

    const directories = await dirResponse.json();

    // Fetch each app's manifest.json
    const appPromises = directories.map(async (dir: any) => {
        if (dir.type !== 'dir') return null;

        const manifestUrl = new URL(
            `master/apps/${dir.name}/manifest.json`,
            APP_HUB_GITHUB_RAW_REPO_BASE_URL,
        );
        const manifestResponse = await fetch(manifestUrl);

        if (!manifestResponse.ok) {
            console.warn(`Failed to fetch manifest for ${dir.name}`);
            return null;
        }

        try {
            const manifest = await manifestResponse.json();
            const logoUrl = new URL(
                `master/apps/${dir.name}/logo.png`,
                APP_HUB_GITHUB_RAW_REPO_BASE_URL,
            );
            return {
                id: dir.name,
                name: manifest.name,
                description: manifest.desc,
                url: manifest.href,
                logo: logoUrl.toString(),
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

    // Cache the valid apps data (skip during SSR)
    if (typeof window !== 'undefined') {
        try {
            setLocalStorageItem(CACHE_KEY, JSON.stringify(validApps));
            setLocalStorageItem(
                CACHE_EXPIRY_KEY,
                (Date.now() + CACHE_EXPIRY_TIME).toString(),
            );
        } catch (e) {
            console.warn('Failed to cache app-hub data:', e);
        }
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
