import { getConfig } from '@/config';
import { GalaxyMember__factory } from '@/contracts';
import { getCallKey } from '@/hooks';
import { useVeChainKitConfig } from '@/providers';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useConnex } from '@vechain/dapp-kit-react';

const contractInterface = GalaxyMember__factory.createInterface();
const method = 'getTokensInfoByOwner';

/**
 * Generates a query key for the getTokensInfoByOwner query.
 * @param owner - The address of the token owner.
 * @param size - The number of tokens to fetch per page.
 * @returns An array representing the query key.
 */
export const getTokensInfoByOwnerQueryKey = (owner?: string | null) =>
    getCallKey({ method, keyArgs: [owner] });

/**
 * Custom hook to fetch token information for a specific owner with infinite scrolling support.
 * @param owner - The address of the token owner.
 * @param size - The number of tokens to fetch per page.
 * @returns An infinite query result containing the token information and pagination controls.
 */
export const useGetTokensInfoByOwner = (
    owner: string | null,
    size: number = 10,
) => {
    const { network } = useVeChainKitConfig();
    const contractAddress = getConfig(network.type).galaxyMemberContractAddress;
    const { thor } = useConnex();

    const fetchTokens = async ({ pageParam = 0 }) => {
        const functionFragment = contractInterface
            .getFunction(method)
            ?.format('json');
        if (!functionFragment) throw new Error(`Method ${method} not found`);

        const res = await thor
            .account(contractAddress)
            .method(JSON.parse(functionFragment))
            .call(owner, pageParam, size);

        if (res.vmError)
            throw new Error(`Method ${method} reverted: ${res.vmError}`);

        const tokenInfoArray = res.decoded[0] as Array<
            [string, string, string, string]
        >;
        const data = tokenInfoArray.map(
            ([tokenId, tokenURI, tokenLevel, b3trToUpgrade]) => ({
                tokenId,
                tokenURI,
                tokenLevel,
                b3trToUpgrade,
            }),
        );

        return { data, nextPage: pageParam + 1 };
    };

    return useInfiniteQuery({
        queryKey: getTokensInfoByOwnerQueryKey(owner),
        queryFn: fetchTokens,
        getNextPageParam: (lastPage) =>
            lastPage.data.length === size ? lastPage.nextPage : undefined,
        enabled: !!owner && !!network.type,
        initialPageParam: 0,
    });
};
