import { useQuery } from '@tanstack/react-query';
import { useXAppsMetadataBaseUri } from './useXAppsMetadataBaseUri';
import { useXApp } from './useXApp';
import { getXAppMetadata } from '../getXAppMetadata';
import { useVeChainKitConfig } from '@/providers';

export const getXAppMetadataQueryKey = (metadataURI?: string) => [
    'VECHAIN_KIT',
    'xApps',
    metadataURI,
    'metadata',
];

/**
 * Hook to fetch the metadata of an xApp from the xApps metadata base uri
 * @param xAppId - The id of the xApp
 * @returns  The metadata of the xApp
 */
export const useXAppMetadata = (xAppId?: string) => {
    const { data: baseUri } = useXAppsMetadataBaseUri();
    const { data: xApp } = useXApp(xAppId ?? '');
    const { network } = useVeChainKitConfig();

    return useQuery({
        queryKey: getXAppMetadataQueryKey(xApp?.metadataURI || ''),
        queryFn: async () =>
            !(!baseUri && xApp)
                ? await getXAppMetadata(
                      `${baseUri}${xApp?.metadataURI}`,
                      network.type,
                  )
                : null,
        enabled: !!baseUri && !!xApp && !!network.type,
    });
};
