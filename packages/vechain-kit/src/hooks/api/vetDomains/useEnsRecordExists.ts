import { getConfig } from '@/config';
import { NETWORK_TYPE } from '@/config/network';
import { MockENS__factory } from '@/contracts';
import { useVeChainKitConfig } from '@/providers';
import { useQuery } from '@tanstack/react-query';
import { useThor } from '@vechain/dapp-kit-react';
import { ThorClient } from '@vechain/sdk-network';
import { concat, keccak256, toBytes } from 'viem';

const getEnsRecordExists = async (
    thor: ThorClient,
    network: NETWORK_TYPE,
    name: string,
): Promise<boolean> => {
    // .veworld.vet
    const hashedNode =
        '0x571e15b4bbf879cf28e5075190137be8e18500e3d38543bf0cbcdb54e00b02cc';

    // First hash the label using keccak256(bytes(name))
    const labelHash = keccak256(toBytes(name));

    // Then combine node and label exactly as in the contract:
    // bytes32 subnode = keccak256(abi.encodePacked(node, label));
    const subnode = keccak256(concat([hashedNode, labelHash]));

    const res = await thor.contracts
        .load(
            getConfig(network).vetDomainsContractAddress,
            MockENS__factory.abi,
        )
        .read.recordExists(subnode);

    if (!res) throw new Error(`Failed to get ENS record exists for ${name}`);

    // TODO: migration checked it returns as boolean ✅
    return res[0] as boolean;
};

export const getEnsRecordExistsQueryKey = (name: string) => [
    'VECHAIN_KIT_ENS_RECORD_VE_WORLD_EXISTS',
    name,
];

export const useEnsRecordExists = (name: string) => {
    const thor = useThor();
    const { network } = useVeChainKitConfig();

    return useQuery({
        queryKey: getEnsRecordExistsQueryKey(name),
        queryFn: () =>
            getEnsRecordExists(
                thor as unknown as ThorClient,
                network.type,
                name,
            ),
        enabled: !!name,
    });
};
