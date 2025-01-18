import { getConfig } from '@/config';
import { NETWORK_TYPE } from '@/config/network';
import { MockENS__factory } from '@/contracts/typechain-types/factories/contracts/mocks/MockENS__factory';
import { useVeChainKitConfig } from '@/providers';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useConnex } from '@vechain/dapp-kit-react';
import { ethers } from 'ethers';

const MockENSInterface = MockENS__factory.createInterface();

const getEnsRecordExists = async (
    thor: Connex.Thor,
    network: NETWORK_TYPE,
    name: string,
): Promise<boolean> => {
    // .veworld.vet
    const hashedNode =
        '0x571e15b4bbf879cf28e5075190137be8e18500e3d38543bf0cbcdb54e00b02cc';

    // First hash the label using keccak256(bytes(name))
    const labelHash = ethers.keccak256(ethers.toUtf8Bytes(name));

    // Then combine node and label exactly as in the contract:
    // bytes32 subnode = keccak256(abi.encodePacked(node, label));
    const subnode = ethers.keccak256(ethers.concat([hashedNode, labelHash]));

    const functionFragment =
        MockENSInterface.getFunction('recordExists').format('json');

    const res = await thor
        .account(getConfig(network).vetDomainsContractAddress)
        .method(JSON.parse(functionFragment))
        .call(subnode);

    if (res.reverted) throw new Error('Reverted');

    return res.decoded[0];
};

export const getEnsRecordExistsQueryKey = (name: string) => [
    'VECHAIN_KIT_ENS_RECORD_VE_WORLD_EXISTS',
    name,
];

export const useEnsRecordExists = (
    name: string,
): UseQueryResult<boolean, Error> => {
    const { thor } = useConnex();
    const { network } = useVeChainKitConfig();

    return useQuery({
        queryKey: getEnsRecordExistsQueryKey(name),
        queryFn: () => getEnsRecordExists(thor, network.type, name),
        enabled: !!name,
    });
};
