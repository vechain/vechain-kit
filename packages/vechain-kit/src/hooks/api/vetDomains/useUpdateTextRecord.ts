import { Interface, namehash } from 'ethers';
import { useCallback } from 'react';
import {
    UseSendTransactionReturnValue,
    useSendTransaction,
} from '@/hooks/transactions/useSendTransaction';

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
    onError?: () => void | Promise<void>;
    signerAccountAddress?: string;
    resolverAddress?: string;
};

type UseUpdateTextRecordReturnValue = {
    sendTransaction: (params: UpdateTextRecordVariables[]) => Promise<void>;
} & Omit<UseSendTransactionReturnValue, 'sendTransaction'>;

export const useUpdateTextRecord = ({
    onSuccess,
    onError,
    signerAccountAddress,
    resolverAddress,
}: UseUpdateTextRecordProps = {}): UseUpdateTextRecordReturnValue => {
    const buildClauses = useCallback(
        async (params: UpdateTextRecordVariables[]) => {
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
        },
        [resolverAddress],
    );

    const result = useSendTransaction({
        signerAccountAddress,
        onTxConfirmed: onSuccess,
        onTxFailedOrCancelled: async () => {
            onError?.();
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
        sendTransaction: async (params: UpdateTextRecordVariables[]) => {
            return result.sendTransaction(await buildClauses(params));
        },
    };
};
