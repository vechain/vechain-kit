import {
    UseSendTransactionReturnValue,
    useSendTransaction,
    useWallet,
} from '../../';
import { useCallback } from 'react';
import { VetDomainsReverseRegistrar__factory } from '@vechain/vechain-contract-types';
import { useQueryClient } from '@tanstack/react-query';
import { getConfig } from '../../../config';
import { useVeChainKitConfig, VeChainKitConfig } from '../../../providers';
import { humanAddress } from '../../../utils';
import { invalidateAndRefetchDomainQueries } from './utils/domainQueryUtils';
import type { Wallet } from '../../../types';
import { TransactionClause } from '@vechain/sdk-core';

type useUnsetDomainProps = {
    onSuccess?: () => void;
    onError?: () => void;
};

type useUnsetDomainReturnValue = {
    sendTransaction: () => Promise<void>;
    clauses: () => TransactionClause[];
} & Omit<UseSendTransactionReturnValue, 'sendTransaction'>;

const ReverseRegistrarInterface = VetDomainsReverseRegistrar__factory.createInterface();

const buildUnsetDomainClauses = (account: Wallet, network: VeChainKitConfig['network']): TransactionClause[] => {
    const clausesArray: any[] = [];

    // When unsetting domain, we only need to call setName with an empty string
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

    return clausesArray;
};

/**
 * Hook for unsetting any domain name (both .veworld.vet and .vet domains)
 *
 * This hook is a dedicated implementation for the unset functionality
 * that was previously part of the claim hooks.
 */
export const useUnsetDomain = ({
    onSuccess,
    onError,
}: useUnsetDomainProps): useUnsetDomainReturnValue => {
    const queryClient = useQueryClient();
    const { account } = useWallet();
    const { network } = useVeChainKitConfig();

    const clauses = useCallback(() => buildUnsetDomainClauses(account, network), [account, network]);

    // Refetch queries to update UI after the tx is confirmed
    const handleOnSuccess = useCallback(async () => {
        const address = account?.address ?? '';

        // Invalidate all domain-related queries
        await invalidateAndRefetchDomainQueries(
            queryClient,
            address,
            '', // No domain being set
            '', // No subdomain
            '', // No full domain
            network.type,
        );

        onSuccess?.();
    }, [onSuccess, queryClient, account, network.type]);

    const result = useSendTransaction({
        signerAccountAddress: account?.address ?? '',
        privyUIOptions: {
            title: 'Sign to unset your VeChain nickname',
            description: 'Unset your current VeChain nickname',
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
