import { useQuery } from '@tanstack/react-query';
import { ThorClient } from '@vechain/sdk-network';
import { useThor } from '@vechain/dapp-kit-react';

export const getChainId = async (thor: ThorClient) => {
    const genesisBlock = await thor.blocks.getGenesisBlock();
    if (!genesisBlock) throw new Error('Genesis block not found');
    const chainId = genesisBlock.id;

    return chainId;
};
export const getChainIdQueryKey = () => ['VECHAIN_KIT_CHAIN_ID'];

/**
 *  Get the chain id
 * @returns The chain id
 */
export const useGetChainId = () => {
    const thor = useThor();

    return useQuery({
        queryKey: getChainIdQueryKey(),
        queryFn: () => getChainId(thor),
        enabled: !!thor,
        refetchInterval: 10000,
    });
};
