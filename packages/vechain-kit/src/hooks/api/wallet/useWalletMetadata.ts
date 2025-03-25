import { NETWORK_TYPE } from '@/config/network';
import {
    useVechainDomain,
    useGetTextRecords,
    useGetAvatar,
} from '../vetDomains';
import { convertUriToUrl, getPicassoImage } from '@/utils';
import { ENSRecords } from '@/types';

export const useWalletMetadata = (
    address: string,
    networkType: NETWORK_TYPE,
) => {
    const { data: domain, isLoading: isLoadingVechainDomain } =
        useVechainDomain(address ?? '');
    const { data: avatar, isLoading: isLoadingMetadata } = useGetAvatar(
        domain?.domain ?? '',
    );
    const { data: textRecords, isLoading: isLoadingRecords } =
        useGetTextRecords(domain?.domain ?? '');
    const headerUrl = textRecords?.header
        ? convertUriToUrl(textRecords.header, networkType)
        : null;

    return {
        domain: domain?.domain,
        image: avatar ?? getPicassoImage(address ?? ''),
        records: {
            ...textRecords,
            header: headerUrl,
        } as ENSRecords,
        isLoading:
            isLoadingVechainDomain || isLoadingMetadata || isLoadingRecords,
    };
};
