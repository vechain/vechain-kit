import { NETWORK_TYPE } from '@/config/network';
import { useGetAvatar, useVechainDomain } from '../vetDomains';
import { convertUriToUrl, getPicassoImage } from '@/utils';

export const useWalletMetadata = (
    address: string | null | undefined,
    networkType: NETWORK_TYPE,
) => {
    const { data: domain } = useVechainDomain(address ?? '');
    const { data: avatar } = useGetAvatar(domain?.domain);
    const avatarUrl = convertUriToUrl(avatar ?? '', networkType);

    return {
        domain: domain?.domain,
        image: avatarUrl ?? getPicassoImage(address ?? ''),
    };
};
