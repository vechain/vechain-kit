import { useQuery } from '@tanstack/react-query';
import { ThorClient } from '@vechain/sdk-network';
import { useGetNodeUrl } from '@/hooks';

export const getChainId = async (thor: ThorClient) => {
    const genesisBlock = await thor.blocks.getGenesisBlock();
    if (!genesisBlock) throw new Error('Genesis block not found');
    return genesisBlock.id;
};
export const getChainIdQueryKey = () => ['VECHAIN_KIT_CHAIN_ID'];

/**
 *  Get the account balance for the given address
 * @returns  The account balance
 */
export const useGetChainId = () => {
    const nodeUrl = useGetNodeUrl();
    const thor = ThorClient.at(nodeUrl);

    return useQuery({
        queryKey: getChainIdQueryKey(),
        queryFn: () => getChainId(thor),
        enabled: !!thor,
        refetchInterval: 10000,
    });
};
