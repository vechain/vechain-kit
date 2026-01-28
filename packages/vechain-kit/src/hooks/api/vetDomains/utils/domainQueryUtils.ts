import {
    getAvatarOfAddressQueryKey,
    getDomainsOfAddressQueryKey,
    getEnsRecordExistsQueryKey,
    getTextRecordsQueryKey,
    getVechainDomainQueryKey,
    getAvatarQueryKey,
} from '../../../';
import { QueryClient } from '@tanstack/react-query';
import { NETWORK_TYPE } from '../../../../config/network';

/**
 * Invalidates and refetches all domain-related queries
 *
 * @param queryClient - The React Query client
 * @param address - The user's address
 * @param fullDomain - The full domain name (e.g. 'subdomain.veworld.vet')
 * @param subdomain - The subdomain part
 * @param domain - The domain part (e.g. 'veworld.vet')
 * @param networkType - The network type
 */
export const invalidateAndRefetchDomainQueries = async (
    queryClient: QueryClient,
    address: string,
    fullDomain: string,
    subdomain: string,
    domain: string,
    networkType: NETWORK_TYPE,
): Promise<void> => {
    // First invalidate all related queries
    await Promise.all([
        queryClient.invalidateQueries({
            queryKey: getVechainDomainQueryKey(address),
        }),
        queryClient.invalidateQueries({
            queryKey: getVechainDomainQueryKey(fullDomain),
        }),
        queryClient.invalidateQueries({
            queryKey: getEnsRecordExistsQueryKey(subdomain),
        }),
        queryClient.invalidateQueries({
            queryKey: getDomainsOfAddressQueryKey(address, '.vet'),
        }),
        queryClient.invalidateQueries({
            queryKey: getDomainsOfAddressQueryKey(address, '.veworld.vet'),
        }),
        queryClient.invalidateQueries({
            queryKey: getTextRecordsQueryKey(fullDomain),
        }),
    ]);

    // Also ensure domains are properly refetched
    await Promise.all([
        queryClient.refetchQueries({
            queryKey: getVechainDomainQueryKey(address),
        }),
        queryClient.refetchQueries({
            queryKey: getVechainDomainQueryKey(fullDomain),
        }),
        queryClient.refetchQueries({
            queryKey: getDomainsOfAddressQueryKey(address, '.vet'),
        }),
        queryClient.refetchQueries({
            queryKey: getDomainsOfAddressQueryKey(address, '.veworld.vet'),
        }),
        queryClient.refetchQueries({
            queryKey: getAvatarQueryKey(subdomain + '.' + domain, networkType),
        }),
        queryClient.refetchQueries({
            queryKey: getTextRecordsQueryKey(fullDomain),
        }),
        queryClient.refetchQueries({
            queryKey: getEnsRecordExistsQueryKey(subdomain),
        }),
        queryClient.refetchQueries({
            queryKey: getAvatarOfAddressQueryKey(address),
        }),
    ]);
};
