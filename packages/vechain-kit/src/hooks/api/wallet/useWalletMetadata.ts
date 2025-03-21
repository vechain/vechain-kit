import { NETWORK_TYPE } from '@/config/network';
import {
    getTextRecordsQueryKey,
    getVechainDomainQueryKey,
    getAvatarQueryKey,
    getAvatar,
    fetchVechainDomain,
    getTextRecords,
} from '../vetDomains';
import { convertUriToUrl, getPicassoImage } from '@/utils';
import { ENSRecords } from '@/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useConnex } from '@vechain/dapp-kit-react';
import { getConfig } from '@/config';

export const useWalletMetadata = (
    address: string,
    networkType: NETWORK_TYPE,
) => {
    const { thor } = useConnex();
    const queryClient = useQueryClient();

    // Replace multiple useQueries with a single coordinated query
    return useQuery({
        queryKey: ['VECHAIN_KIT', 'WALLET_METADATA', address, networkType],
        queryFn: async () => {
            // First ensure we have the domain data
            const domain = await queryClient.ensureQueryData({
                queryKey: getVechainDomainQueryKey(address || ''),
                queryFn: () =>
                    fetchVechainDomain(thor, networkType, address || ''),
            });

            const domainName = domain?.domain || '';

            // If we have a domain, fetch avatar and text records in parallel
            const [avatar, textRecords] = await Promise.all([
                domainName
                    ? queryClient.ensureQueryData({
                          queryKey: getAvatarQueryKey(domainName, networkType),
                          queryFn: () => getAvatar(domainName, networkType),
                      })
                    : null,
                domainName
                    ? queryClient.ensureQueryData({
                          queryKey: getTextRecordsQueryKey(domainName),
                          queryFn: () =>
                              getTextRecords(
                                  getConfig(networkType).nodeUrl,
                                  networkType,
                                  domainName,
                              ),
                      })
                    : null,
            ]);

            const headerUrl = textRecords?.header
                ? convertUriToUrl(textRecords.header, networkType)
                : null;

            return {
                domain: domainName,
                image: avatar ?? getPicassoImage(address ?? ''),
                records: {
                    ...textRecords,
                    header: headerUrl,
                } as ENSRecords,
            };
        },
        enabled: !!address && !!networkType && !!thor,
    });
};
