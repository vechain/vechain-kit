import { useQuery } from '@tanstack/react-query';
import { Interface, namehash } from 'ethers';
import { useVeChainKitConfig } from '@/providers';
import { getConfig } from '../../../config';
import { NETWORK_TYPE } from '../../../config/network';
import { ENS_TEXT_RECORDS } from '../../../types';
import type { TextRecords } from '../../../types';

const nameInterface = new Interface([
    'function resolver(bytes32 node) returns (address resolverAddress)',
    'function text(bytes32 node, string key) view returns (string)',
]);

/**
 * Get text records for a VET domain from the contract
 * @param nodeUrl The node URL to query
 * @param network The network type
 * @param domain The domain to get text records for. If not provided, will return empty object
 * @returns Object containing text records in the form of {@link TextRecords}
 */
export const getTextRecords = async (
    nodeUrl: string,
    network: NETWORK_TYPE,
    domain?: string,
): Promise<TextRecords> => {
    if (!domain) return {};

    const node = namehash(domain);

    try {
        // First get the resolver address
        const accountsUrl = new URL('accounts/*', nodeUrl);
        const resolverResponse = await fetch(accountsUrl, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                clauses: [
                    {
                        to: getConfig(network).vetDomainsContractAddress,
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
            return {};
        }

        const { resolverAddress } = nameInterface.decodeFunctionResult(
            'resolver',
            resolverData,
        );

        // Then get all text records from the resolver
        const response = await fetch(accountsUrl, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                clauses: ENS_TEXT_RECORDS.map((key) => ({
                    to: resolverAddress,
                    data: nameInterface.encodeFunctionData('text', [node, key]),
                })),
            }),
        });

        const results = await response.json();

        return results.reduce(
            (acc: TextRecords, { data, reverted }: any, index: number) => {
                if (!reverted && data && data !== '0x') {
                    try {
                        const value = nameInterface.decodeFunctionResult(
                            'text',
                            data,
                        )[0];
                        if (value) {
                            acc[ENS_TEXT_RECORDS[index]] = value;
                        }
                    } catch (error) {
                        console.error(
                            `Failed to decode text record for ${ENS_TEXT_RECORDS[index]}:`,
                            error,
                        );
                    }
                }

                return acc;
            },
            {},
        );
    } catch (error) {
        console.error('Error fetching text records:', error);
        throw error;
    }
};

export const getTextRecordsQueryKey = (
    domain?: string,
    network?: NETWORK_TYPE,
) => ['VECHAIN_KIT_TEXT_RECORDS', domain, network];

export const useGetTextRecords = (domain?: string) => {
    const { network } = useVeChainKitConfig();
    const nodeUrl = network.nodeUrl ?? getConfig(network.type).nodeUrl;

    return useQuery({
        queryKey: getTextRecordsQueryKey(domain, network.type),
        queryFn: () => getTextRecords(nodeUrl, network.type, domain),
        enabled: !!domain && !!network.type,
        retry: (failureCount, error) => {
            // Don't retry on cancellation errors
            if (error instanceof Error) {
                const errorMessage = error.message.toLowerCase();
                if (errorMessage.includes('cancel') || errorMessage.includes('abort')) {
                    return false;
                }
            }
            // Retry network errors up to 2 times
            return failureCount < 2;
        },
        gcTime: 1000 * 60 * 5, // 5 minutes
        staleTime: 1000 * 60, // 1 minute
    });
};
