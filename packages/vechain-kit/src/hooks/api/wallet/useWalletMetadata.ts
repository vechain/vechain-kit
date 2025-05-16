import { NETWORK_TYPE } from '@/config/network';
import {
    useVechainDomain,
    useGetTextRecords,
    useGetAvatarOfAddress,
} from '@/hooks';
import { convertUriToUrl } from '@/utils';
import { ENSRecords } from '@/types';

export const useWalletMetadata = (
    address: string,
    networkType: NETWORK_TYPE,
) => {
    const { data: domain, isLoading: isLoadingVechainDomain } =
        useVechainDomain(address ?? '');
    const { data: avatar, isLoading: isLoadingMetadata } =
        useGetAvatarOfAddress(address ?? '');
    const { data: textRecords, isLoading: isLoadingRecords } =
        useGetTextRecords(domain?.domain ?? '');
    const headerUrl = textRecords?.header
        ? convertUriToUrl(textRecords.header, networkType)
        : null;

    return {
        domain: domain?.domain,
        image: avatar,
        records: {
            ...textRecords,
            header: headerUrl,
        } as ENSRecords,
        isLoading:
            isLoadingVechainDomain || isLoadingMetadata || isLoadingRecords,
    };
};
