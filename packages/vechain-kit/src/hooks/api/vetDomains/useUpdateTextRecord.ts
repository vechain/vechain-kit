import { namehash } from '@ethersproject/hash';
import { useCallback } from 'react';
import {
    UseSendTransactionReturnValue,
    useSendTransaction,
} from '@/hooks/transactions/useSendTransaction';
import { useThor } from '@vechain/dapp-kit-react';

// Define the ABI for the resolver functions
const resolverABI = [
    {
        type: 'function',
        name: 'resolver',
        inputs: [{ name: 'node', type: 'bytes32' }],
        outputs: [{ name: 'resolverAddress', type: 'address' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'setText',
        inputs: [
            { name: 'node', type: 'bytes32' },
            { name: 'key', type: 'string' },
            { name: 'value', type: 'string' },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
    },
] as const;

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
    sendTransaction: (params: UpdateTextRecordVariables[]) => Promise<void>;
} & Omit<UseSendTransactionReturnValue, 'sendTransaction'>;

export const useUpdateTextRecord = ({
    onSuccess,
    onError,
    signerAccountAddress,
    resolverAddress,
}: UseUpdateTextRecordProps = {}): UseUpdateTextRecordReturnValue => {
    const thor = useThor();
    const buildClauses = useCallback(
        async (params: UpdateTextRecordVariables[]) => {
            const clauses = [];

            for (const { domain, key, value } of params) {
                if (!domain) throw new Error('Domain is required');
                if (!resolverAddress)
                    throw new Error('Resolver address is required');

                const node = namehash(domain);

                const contract = thor.contracts.load(
                    resolverAddress,
                    resolverABI,
                );

                clauses.push(
                    contract.clause.setText(`0x${node.slice(2)}`, key, value),
                );
            }
            return clauses;
        },
        [resolverAddress, thor],
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
