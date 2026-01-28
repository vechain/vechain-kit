import {
    UseSendTransactionReturnValue,
    useSendTransaction,
    useWallet,
} from '@/hooks';
import { useCallback } from 'react';
import {
    VeworldSubdomainClaimer__factory,
    VetDomainsReverseRegistrar__factory,
} from '@vechain/vechain-contract-types';
import { useQueryClient } from '@tanstack/react-query';
import { getConfig } from '@/config';
import { useVeChainKitConfig, VeChainKitConfig } from '@/providers';
import { humanAddress } from '../../../utils';
import { ethers } from 'ethers';
import { useRefreshMetadata } from '../wallet/useRefreshMetadata';
import { invalidateAndRefetchDomainQueries } from './utils/domainQueryUtils';
import type { Wallet } from '../../../types';
import { TransactionClause } from '@vechain/sdk-core';

type useClaimVeWorldSubdomainProps = {
    subdomain: string;
    domain: string;
    onSuccess?: () => void;
    onError?: () => void;
    onSuccessMessageTitle?: number;
    alreadyOwned?: boolean;
};

type useClaimVeWorldSubdomainReturnValue = {
    sendTransaction: () => Promise<void>;
    clauses: () => TransactionClause[];
} & Omit<UseSendTransactionReturnValue, 'sendTransaction'>;

const SubdomainClaimerInterface = VeworldSubdomainClaimer__factory.createInterface();
const ReverseRegistrarInterface = VetDomainsReverseRegistrar__factory.createInterface();

const buildVeWorldSubdomainClauses = (subdomain: string, domain: string, alreadyOwned: boolean, account: Wallet, network: VeChainKitConfig['network']): TransactionClause[] => {
    const clausesArray: any[] = [];

    if (!subdomain) throw new Error('Invalid subdomain');

    const fullDomain = `${subdomain}.${domain}`;

    // Always unset current nickname first
    clausesArray.push({
        to: getConfig(network.type).vetDomainsReverseRegistrarAddress,
        value: '0x0',
        data: ReverseRegistrarInterface.encodeFunctionData('setName', ['']),
        comment: `Unsetting your current VeChain nickname of the account ${humanAddress(
            account?.address ?? '',
            4,
            4,
        )}`,
        abi: ReverseRegistrarInterface.getFunction('setName'),
    });

    if (alreadyOwned) {
        // For already owned domains, set the name in the reverse registrar
        clausesArray.push({
            to: getConfig(network.type).vetDomainsReverseRegistrarAddress,
            value: '0x0',
            data: ReverseRegistrarInterface.encodeFunctionData('setName', [
                fullDomain,
            ]),
            comment: `Setting your VeChain nickname to ${fullDomain}`,
            abi: ReverseRegistrarInterface.getFunction('setName'),
        });

        // Also set the address in the public resolver
        const PublicResolverInterface = new ethers.Interface([
            'function setAddr(bytes32 node, address addr)',
        ]);

        // Calculate the namehash for the domain
        const domainNode = ethers.namehash(fullDomain);

        clausesArray.push({
            to: getConfig(network.type).vetDomainsPublicResolverAddress,
            value: '0x0',
            data: PublicResolverInterface.encodeFunctionData('setAddr', [
                domainNode,
                account?.address || '',
            ]),
            comment: `Setting the address for ${fullDomain} to ${humanAddress(
                account?.address ?? '',
                4,
                4,
            )}`,
            abi: PublicResolverInterface.getFunction('setAddr'),
        });
    } else {
        if (isVeWorldDomain(domain)) {
            // For new domains, claim the subdomain
            clausesArray.push({
                to: getConfig(network.type)
                    .veWorldSubdomainClaimerContractAddress,
                value: '0x0',
                data: SubdomainClaimerInterface.encodeFunctionData(
                    'claim',
                    [
                        subdomain,
                        getConfig(network.type)
                            .vetDomainsPublicResolverAddress,
                    ],
                ),
                comment: `Claim VeChain subdomain: ${subdomain}.${domain}`,
                abi: SubdomainClaimerInterface.getFunction('claim'),
            });

            clausesArray.push({
                to: getConfig(network.type)
                    .vetDomainsReverseRegistrarAddress,
                value: '0x0',
                data: ReverseRegistrarInterface.encodeFunctionData(
                    'setName',
                    [subdomain + '.' + domain],
                ),
                comment: `Set ${subdomain}.${domain} as the VeChain nickname of the account ${humanAddress(
                    account?.address ?? '',
                    4,
                    4,
                )}`,
                abi: ReverseRegistrarInterface.getFunction('setName'),
            });
        } else {
            throw new Error(
                'This hook only supports .veworld.vet subdomains',
            );
        }
    }

    return clausesArray;
};

/**
 * Hook for claiming a .veworld.vet subdomain
 *
 * This hook specializes in handling subdomains in the .veworld.vet domain
 */
export const useClaimVeWorldSubdomain = ({
    subdomain,
    domain,
    onSuccess,
    onError,
    alreadyOwned = false,
}: useClaimVeWorldSubdomainProps): useClaimVeWorldSubdomainReturnValue => {
    const queryClient = useQueryClient();
    const { account } = useWallet();
    const { network } = useVeChainKitConfig();
    const { refresh: refreshMetadata } = useRefreshMetadata(
        subdomain + '.' + domain,
        account?.address ?? '',
    );

    const clauses = useCallback(() => buildVeWorldSubdomainClauses(subdomain, domain, alreadyOwned, account, network), [subdomain, domain, alreadyOwned, account, network]);

    //Refetch queries to update ui after the tx is confirmed
    const handleOnSuccess = useCallback(async () => {
        const fullDomain = `${subdomain}.${domain}`;
        const address = account?.address ?? '';

        await invalidateAndRefetchDomainQueries(
            queryClient,
            address,
            fullDomain,
            subdomain,
            domain,
            network.type,
        );

        // Use the dedicated metadata refresh utility
        refreshMetadata();
        onSuccess?.();
    }, [
        onSuccess,
        subdomain,
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
            description: `Claim ${subdomain}.${domain} as your VeChain nickname`,
            buttonText: 'Sign to continue',
        },
        onTxConfirmed: handleOnSuccess,
        onTxFailedOrCancelled: () => {
            onError?.();
        },
    });

    return {
        ...result,
        clauses,
        sendTransaction: async () => {
            return result.sendTransaction(clauses());
        },
    };
};

const isVeWorldDomain = (domain: string) => {
    return domain.endsWith('veworld.vet');
};
