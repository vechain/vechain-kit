import { Interface, namehash } from 'ethers';
import { useVeChainKitConfig } from '@/providers';
import { getConfig } from '@/config';
import {
    useSendTransaction,
    UseSendTransactionReturnValue,
} from '@/hooks/transactions/useSendTransaction';
import { useCallback } from 'react';

const nameInterface = new Interface([
    'function resolver(bytes32 node) returns (address resolverAddress)',
    'function setText(bytes32 node, string key, string value) external',
]);

type UpdateAvatarVariables = {
    domain: string;
    ipfsUri: string;
};

type UseUpdateAvatarRecordProps = {
    onSuccess?: () => void | Promise<void>;
    onError?: () => void | Promise<void>;
    signerAccountAddress?: string;
};

type UseUpdateAvatarRecordReturnValue = {
    sendTransaction: (params: UpdateAvatarVariables) => Promise<void>;
} & Omit<UseSendTransactionReturnValue, 'sendTransaction'>;

export const useUpdateAvatarRecord = ({
    onSuccess,
    onError,
    signerAccountAddress,
}: UseUpdateAvatarRecordProps = {}): UseUpdateAvatarRecordReturnValue => {
    const { network } = useVeChainKitConfig();
    const nodeUrl = network.nodeUrl ?? getConfig(network.type).nodeUrl;

    const buildClauses = useCallback(
        async ({ domain, ipfsUri }: UpdateAvatarVariables) => {
            if (!domain) throw new Error('Domain is required');

            const node = namehash(domain);

            // Get resolver address using read-only call
            const resolverResponse = await fetch(`${nodeUrl}/accounts/*`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
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
            if (noResolver) {
                throw new Error('Failed to get resolver address');
            }

            const { resolverAddress } = nameInterface.decodeFunctionResult(
                'resolver',
                resolverData,
            );

            return [
                {
                    to: resolverAddress,
                    data: nameInterface.encodeFunctionData('setText', [
                        node,
                        'avatar',
                        ipfsUri,
                    ]),
                    value: '0',
                    comment: 'Update avatar record',
                },
            ];
        },
        [nodeUrl, network.type],
    );

    const result = useSendTransaction({
        signerAccountAddress,
        onTxConfirmed: onSuccess,
        onTxFailedOrCancelled: onError,
        privyUIOptions: {
            title: 'Update Avatar',
            description: 'Update the avatar associated with your domain',
            buttonText: 'Sign to continue',
        },
    });

    return {
        ...result,
        sendTransaction: async (params: UpdateAvatarVariables) => {
            return result.sendTransaction(await buildClauses(params));
        },
    };
};
