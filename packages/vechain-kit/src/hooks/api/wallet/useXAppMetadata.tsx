import { getConfig } from '@/config';
import { X2EarnApps__factory } from '@/contracts';
import { useVeChainKitConfig } from '@/providers';
import { useThor } from '@vechain/dapp-kit-react';
import { convertUriToUrl } from '@/utils';
import axios from 'axios';
import { NETWORK_TYPE } from '@/config/network';
import { useQuery } from '@tanstack/react-query';

/**
 * The metadata of an xApp from the xApps metadata base uri
 * @property name - The name of the xApp
 * @property description - The description of the xApp
 * @property distribution_strategy - The B3TR distribution strategy of the xApp
 * @property external_url - The external url of the xApp
 * @property logo - The logo of the xApp (ipfs uri)
 * @property banner - The banner of the xApp (ipfs uri)
 * @property screenshots - The screenshots of the xApp (ipfs uri)
 * @property social_urls - The social urls of the xApp
 * @property app_urls - The app urls of the xApp
 * @property categories - The categories of the xApp
 */
export type XAppMetadata = {
    name: string;
    description: string;
    distribution_strategy?: string;
    external_url: string;
    logo: string;
    banner: string;
    screenshots: string[];
    social_urls: {
        name: string;
        url: string;
    }[];
    app_urls: {
        code: string;
        url: string;
    }[];
    tweets: string[];
    ve_world: {
        banner: string;
    };
    categories: string[];
};
/**
  dapp-kit broke the pre-fetching
   * @param uri  - The uri of the xApps metadata
   * @returns  The metadata of the xApp see {@link XAppMetadata}
   */
export const getXAppMetadata = async (
    uri: string,
    networkType: NETWORK_TYPE,
): Promise<XAppMetadata | undefined> => {
    const metadata = await axios.get<XAppMetadata>(
        convertUriToUrl(uri, networkType) || '',
        { timeout: 20000 },
    );

    return metadata.data;
};

const abi = X2EarnApps__factory.abi;

export const useXAppMetadata = (xAppId: string) => {
    const thor = useThor();
    const { network } = useVeChainKitConfig();

    return useQuery({
        queryKey: ['xAppMetaData', xAppId],
        queryFn: async () => {
            const address = getConfig(network.type).x2EarnAppsContractAddress;
            const contract = thor.contracts.load(address, abi);

            const [app] = await contract.read.app(xAppId);
            const metadataURI = (app as Array<string>)?.[3] || '';

            const [baseUri] = await contract.read.baseURI();

            const metadata = await getXAppMetadata(
                `${baseUri}${metadataURI}`,
                network.type,
            );

            return metadata;
        },
    });
};
