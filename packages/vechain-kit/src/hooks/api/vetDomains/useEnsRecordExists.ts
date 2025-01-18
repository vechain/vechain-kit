import { getConfig } from '@/config';
import { NETWORK_TYPE } from '@/config/network';
import { MockENS__factory } from '@/contracts/typechain-types/factories/contracts/mocks/MockENS__factory';
import { useVeChainKitConfig } from '@/providers';
import { useQuery } from '@tanstack/react-query';
import { useConnex } from '@vechain/dapp-kit-react';
import { ethers } from 'ethers';

interface VeChainDomainResult {
    address?: string;
    domain?: string;
    isValidAddressOrDomain: boolean;
    isLoading: boolean;
}

const MockENSInterface = MockENS__factory.createInterface();

const getEnsRecordExists = async (
    thor: Connex.Thor,
    network: NETWORK_TYPE,
    name: string,
    node: string,
) => {
    const hashedNode = ethers.keccak256(ethers.toUtf8Bytes(node));

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

export const getEnsRecordExistsQueryKey = (name: string, node: string) => [
    'VECHAIN_KIT_ENS_RECORD_EXISTS',

    name,
    node,
];

export const useEnsRecordExists = (name: string, node: string) => {
    const { thor } = useConnex();
    const { network } = useVeChainKitConfig();

    return useQuery<VeChainDomainResult>({
        queryKey: getEnsRecordExistsQueryKey(name, node),
        queryFn: () => getEnsRecordExists(thor, network.type, name, node),
        enabled: !!name && !!node,
    });
};
