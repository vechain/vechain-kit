import { Interface, namehash } from 'ethers';
import { useVeChainKitConfig } from '@/providers';
import { getConfig } from '@/config';
import { useCallback, useRef } from 'react';
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
};

type UseUpdateTextRecordReturnValue = {
    sendTransaction: (params: UpdateTextRecordVariables[]) => Promise<void>;
} & Omit<UseSendTransactionReturnValue, 'sendTransaction'>;

export const useUpdateTextRecord = ({
    onSuccess,
    onError,
    signerAccountAddress,
}: UseUpdateTextRecordProps = {}): UseUpdateTextRecordReturnValue => {
    const { network } = useVeChainKitConfig();
    const nodeUrl = network.nodeUrl ?? getConfig(network.type).nodeUrl;

    // Add resolver cache
    // We want to mutate the cache by adding new entries
    // We don't want cache updates to trigger re-renders
    // We want the cache to persist across renders without being reset
    const resolverCache = useRef<Record<string, string>>({});

    const getResolverAddress = useCallback(
        async (domain: string) => {
            const node = namehash(domain);

            // Check cache first
            if (resolverCache.current[node]) {
                return resolverCache.current[node];
            }

            const resolverResponse = await fetch(`${nodeUrl}/accounts/*`, {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({
                    clauses: [
                        {
                            to: getConfig(network.type)
                                .vetDomainsContractAddress,
                            data: nameInterface.encodeFunctionData('resolver', [
                                node,
                            ]),
                        },
                    ],
                }),
            });

            const [{ data: resolverData, reverted: noResolver }] =
                await resolverResponse.json();
            if (noResolver) throw new Error('Failed to get resolver address');

            const { resolverAddress } = nameInterface.decodeFunctionResult(
                'resolver',
                resolverData,
            );

            // Cache the result
            resolverCache.current[node] = resolverAddress;
            return resolverAddress;
        },
        [nodeUrl, network.type],
    );

    const buildClauses = useCallback(
        async (params: UpdateTextRecordVariables[]) => {
            const clauses = [];

            for (const { domain, key, value } of params) {
                if (!domain) throw new Error('Domain is required');
                const node = namehash(domain);

                const resolverAddress = await getResolverAddress(domain);

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
        [getResolverAddress],
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
