import { useQuery } from '@tanstack/react-query';
import { ThorClient } from '@vechain/sdk-network';
import { useOptionalThor } from '../../api/dappkit/useOptionalThor';

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
    // Use optional Thor hook that handles missing provider gracefully
    const thor = useOptionalThor();

    return useQuery({
        queryKey: getChainIdQueryKey(),
        queryFn: () => getChainId(thor!),
        enabled: !!thor,
    });
};
