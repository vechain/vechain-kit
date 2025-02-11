import { useQuery } from '@tanstack/react-query';
import { Interface, namehash } from 'ethers';
import { useVeChainKitConfig } from '@/providers';
import { getConfig } from '@/config';
import { NETWORK_TYPE } from '@/config/network';

const nameInterface = new Interface([
    'function resolver(bytes32 node) returns (address resolverAddress)',
    'function text(bytes32 node, string key) view returns (string)',
]);

export const ENS_TEXT_RECORDS = [
    'display',
    'avatar',
    'description',
    'keywords',
    'email',
    'url',
    'header',
    'notice',
    'location',
    'phone',
    'com.x',
] as const;

export type TextRecords = {
    [K in (typeof ENS_TEXT_RECORDS)[number]]?: string;
};

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
        const resolverResponse = await fetch(`${nodeUrl}/accounts/*`, {
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
        const response = await fetch(`${nodeUrl}/accounts/*`, {
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
    });
};
