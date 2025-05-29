import { NETWORK_TYPE } from '@/config/network';
import { convertUriToUrl } from '@/utils';

/**
 * The metadata of an xApp from the xApps metadata base uri
 * @property name - The name of the xApp
 * @property description - The description of the xApp
 * @property external_url - The external url of the xApp
 * @property logo - The logo of the xApp (ipfs uri)
 * @property banner - The banner of the xApp (ipfs uri)
 * @property screenshots - The screenshots of the xApp (ipfs uri)
 * @property social_urls - The social urls of the xApp
 * @property app_urls - The app urls of the xApp
 */
export type XAppMetadata = {
    name: string;
    description: string;
    external_url: string;
    logo: string;
    banner: string;
    logoComponent?: JSX.Element;
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
    const url = convertUriToUrl(uri, networkType);
    if (!url) return undefined;

    const response = await fetch(url);

    if (!response.ok) {
        return undefined;
    }

    return response.json();
};
