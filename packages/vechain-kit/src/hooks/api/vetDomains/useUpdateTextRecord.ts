import { Interface, namehash } from 'ethers';
import { useVeChainKitConfig } from '@/providers';
import { getConfig } from '@/config';
import { useMutation } from '@tanstack/react-query';
import { useSendTransaction } from '@/hooks/transactions/useSendTransaction';

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
    onSuccess?: () => void;
    onError?: () => void;
};

export const useUpdateTextRecord = ({
    onSuccess,
    onError,
}: UseUpdateTextRecordProps = {}) => {
    const { network } = useVeChainKitConfig();
    const nodeUrl = network.nodeUrl ?? getConfig(network.type).nodeUrl;
    const { sendTransaction } = useSendTransaction({
        onTxConfirmed: onSuccess,
        onTxFailedOrCancelled: onError,
        privyUIOptions: {
            title: 'Update Profile Information',
            description:
                'Update the profile information associated with your domain',
            buttonText: 'Sign to continue',
        },
    });

    return useMutation({
        mutationFn: async ({
            domain,
            key,
            value,
        }: UpdateTextRecordVariables) => {
            if (!domain) throw new Error('Domain is required');
            const node = namehash(domain);

            // Get resolver address
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

            // Update text record
            const setTextClause = {
                to: resolverAddress,
                data: nameInterface.encodeFunctionData('setText', [
                    node,
                    key,
                    value,
                ]),
                value: '0',
                comment: `Update ${key} record`,
            };

            return sendTransaction([setTextClause]);
        },
        onSuccess,
        onError,
    });
};
