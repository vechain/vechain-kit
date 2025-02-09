import { Interface, namehash } from 'ethers';
import { useVeChainKitConfig } from '@/providers';
import { getConfig } from '@/config';
import { useCallback } from 'react';
import { useSendTransaction } from '@/hooks/transactions/useSendTransaction';

const nameInterface = new Interface([
    'function resolver(bytes32 node) returns (address resolverAddress)',
    'function setText(bytes32 node, string key, string value) external',
]);

type UseUpdateAvatarRecordProps = {
    onSuccess?: () => void;
    onError?: () => void;
};

export const useUpdateAvatarRecord = ({
    onSuccess,
    onError,
}: UseUpdateAvatarRecordProps) => {
    const { network } = useVeChainKitConfig();
    const nodeUrl = network.nodeUrl ?? getConfig(network.type).nodeUrl;
    const { sendTransaction, txReceipt, error } = useSendTransaction({
        onTxConfirmed: onSuccess,
        onTxFailedOrCancelled: onError,
    });

    const updateAvatar = useCallback(
        async (domain: string, ipfsUri: string) => {
            if (!domain) throw new Error('Domain is required');
            // Remove the IPFS URI validation to allow empty strings, so we can reset the avatar
            // if (!ipfsUri) throw new Error('IPFS URI is required');

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

            // Send transaction to update avatar text record
            const setTextClause = {
                to: resolverAddress,
                data: nameInterface.encodeFunctionData('setText', [
                    node,
                    'avatar',
                    ipfsUri,
                ]),
                value: '0',
                comment: 'Update avatar record',
            };

            await sendTransaction([setTextClause]);
        },
        [network.type, nodeUrl, sendTransaction],
    );

    return {
        updateAvatar,
        txReceipt,
        error,
    };
};
