import { Interface, namehash } from 'ethers';
import { useCallback } from 'react';
import { UseSendTransactionReturnValue, useSendTransaction } from '@/hooks';
import { TransactionClause } from '@vechain/sdk-core';

const nameInterface = new Interface([
    'function resolver(bytes32 node) returns (address resolverAddress)',
    'function setText(bytes32 node, string key, string value) external',
]);

type UpdateTextRecordVariables = {
    domain: string;
    key: string;
    value: string;
};

type UseUpdateTextRecordProps = {
    onSuccess?: () => void | Promise<void>;
    onError?: (error?: Error) => void | Promise<void>;
    signerAccountAddress?: string;
    resolverAddress?: string;
};

type UseUpdateTextRecordReturnValue = {
    sendTransaction: (params: UpdateTextRecordVariables[]) => Promise<void> | undefined;
    clauses: (params: UpdateTextRecordVariables[]) => TransactionClause[]; // Synchronous!
} & Omit<UseSendTransactionReturnValue, 'sendTransaction'>;

export const buildClauses = (resolverAddress: string, params: UpdateTextRecordVariables[]): TransactionClause[] => {
    const clauses = [];

    for (const { domain, key, value } of params) {
        if (!domain) throw new Error('Domain is required');
        if (!resolverAddress)
            throw new Error('Resolver address is required');

        const node = namehash(domain);

        clauses.push({
            to: resolverAddress,
            data: nameInterface.encodeFunctionData('setText', [
                node,
                key,
                value,
            ]),
            value: '0',
            comment: `Update ${key} record`,
        });
    }
    return clauses;
};

export const useUpdateTextRecord = ({
    onSuccess,
    onError,
    signerAccountAddress,
    resolverAddress,
}: UseUpdateTextRecordProps = {}): UseUpdateTextRecordReturnValue => {
    // Always call useCallback unconditionally - keep it synchronous!
    const buildClausesCallback = useCallback(
        (params: UpdateTextRecordVariables[]) => {
            if (!resolverAddress) {
                throw new Error('Resolver address is required');
            }
            return buildClauses(resolverAddress, params);
        },
        [resolverAddress]
    );

    const result = useSendTransaction({
        signerAccountAddress,
        onTxConfirmed: async () => {
            await onSuccess?.();
        },
        onTxFailedOrCancelled: async () => {
            await onError?.();
        },
        privyUIOptions: {
            title: 'Update Profile Information',
            description:
                'Update the profile information associated with your domain',
            buttonText: 'Sign to continue',
        },
    });

    return {
        ...result,
        clauses: buildClausesCallback, // Return the callback directly
        sendTransaction: async (params: UpdateTextRecordVariables[]) => {
            return result.sendTransaction(buildClausesCallback(params));
        },
    };
};
