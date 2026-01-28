import {
    UseSendTransactionReturnValue,
    useSendTransaction,
    useWallet,
} from '../../';
import { useRefreshMetadata } from '../wallet/useRefreshMetadata';
import { useCallback } from 'react';
import { VetDomainsReverseRegistrar__factory } from '@vechain/vechain-contract-types';
import { useQueryClient } from '@tanstack/react-query';
import { getConfig } from '../../../config';
import { useVeChainKitConfig, VeChainKitConfig } from '../../../providers/VeChainKitProvider';
import { ethers } from 'ethers';
import { invalidateAndRefetchDomainQueries } from './utils/domainQueryUtils';
import { humanAddress } from '../../../utils';
import type { Wallet } from '../../../types';
import { TransactionClause } from '@vechain/sdk-core';

type useClaimVetDomainProps = {
    domain: string;
    onSuccess?: () => void;
    onError?: () => void;
    onSuccessMessageTitle?: number;
    alreadyOwned?: boolean;
};

type useClaimVetDomainReturnValue = {
    sendTransaction: () => Promise<void>;
    clauses: () => TransactionClause[];
} & Omit<UseSendTransactionReturnValue, 'sendTransaction'>;

const ReverseRegistrarInterface = VetDomainsReverseRegistrar__factory.createInterface();

export const buildVetDomainClauses = (
    domain: string,
    alreadyOwned: boolean,
    account: Wallet,
    network: VeChainKitConfig['network'],
): TransactionClause[] => {
    const clausesArray: any[] = [];

    if (!domain) throw new Error('Invalid domain');

    if (alreadyOwned) {
        // For already owned domains, set the name in the reverse registrar
        clausesArray.push({
            to: getConfig(network.type).vetDomainsReverseRegistrarAddress,
            value: '0x0',
            data: ReverseRegistrarInterface.encodeFunctionData('setName', [
                domain,
            ]),
            comment: `Setting your VeChain nickname to ${domain}`,
            abi: ReverseRegistrarInterface.getFunction('setName'),
        });

        // Also set the address in the public resolver
        const PublicResolverInterface = new ethers.Interface([
            'function setAddr(bytes32 node, address addr)',
        ]);

        // Calculate the namehash for the domain
        const domainNode = ethers.namehash(domain);

        clausesArray.push({
            to: getConfig(network.type).vetDomainsPublicResolverAddress,
            value: '0x0',
            data: PublicResolverInterface.encodeFunctionData('setAddr', [
                domainNode,
                account?.address || '',
            ]),
            comment: `Setting the address for ${domain} to ${humanAddress(
                account?.address ?? '',
                4,
                4,
            )}`,
            abi: PublicResolverInterface.getFunction('setAddr'),
        });
    } else {
        throw new Error('Primary .vet domains are not supported yet');
    }

    return clausesArray;
};

/**
 * Hook for claiming a .vet domain
 *
 * This hook specializes in handling primary .vet domains
 */
export const useClaimVetDomain = ({
    domain,
    onSuccess,
    onError,
    alreadyOwned = false,
}: useClaimVetDomainProps): useClaimVetDomainReturnValue => {
    const { network } = useVeChainKitConfig();
    const queryClient = useQueryClient();
    const { account } = useWallet();

    const { refresh: refreshMetadata } = useRefreshMetadata(
        domain,
        account?.address ?? '',
    );

    const clauses = useCallback(
        () => buildVetDomainClauses(domain, alreadyOwned, account, network),
        [domain, alreadyOwned, account, network],
    );

    // Refetch queries to update UI after the tx is confirmed
    const handleOnSuccess = useCallback(async () => {
        const address = account?.address ?? '';

        await invalidateAndRefetchDomainQueries(
            queryClient,
            address,
            domain,
            '', // No subdomain for primary domains
            domain.endsWith('.vet') ? domain : `${domain}.vet`,
            network.type,
        );

        // Use the dedicated metadata refresh utility
        refreshMetadata();

        onSuccess?.();
    }, [
        onSuccess,
        domain,
        queryClient,
        account,
        network.type,
        refreshMetadata,
    ]);

    const result = useSendTransaction({
        signerAccountAddress: account?.address ?? '',
        privyUIOptions: {
            title: 'Sign to claim your VeChain nickname',
            description: `Claim ${domain} as your VeChain nickname`,
            buttonText: 'Sign to continue',
        },
        onTxConfirmed: handleOnSuccess,
        onTxFailedOrCancelled: onError,
    });

    return {
        ...result,
        clauses,
        sendTransaction: async () => {
            return result.sendTransaction(clauses());
        },
    };
};
