# VeChain Kit — Transactions, smart accounts, and blockchain access

Transaction construction and submission, clauses, receipts, gas estimation, transfers, smart-account lifecycle, blocks, accounts, logs, and contract reads.

> Generated from the VeChain Kit repository. File paths are preserved so answers can cite the source.
> VeChain Kit commit: `f8f32209bf76b08a0e459f534c9fb488a9e5fd00`. VeChain AI Skills commit: `b0d8b8f0dbb97cf4224840f7ee7a2eaadea677f2`.

## Source: `packages/vechain-kit/src/hooks/thor/accounts/useAccountBalance.ts`

````typescript
import { useQuery } from '@tanstack/react-query';
import { useThor } from '@vechain/dapp-kit-react';
import { Address } from '@vechain/sdk-core';
import { ThorClient } from '@vechain/sdk-network';
import { formatEther } from 'viem';
import { VECHAIN_KIT_QUERY_KEYS } from '@/constants/queryKeys';

export const getAccountBalance = async (thor: ThorClient, address?: string) => {
    if (!address) throw new Error('Address is required');
    const account = await thor.accounts.getAccount(Address.of(address));

    return {
        balance: formatEther(BigInt(account.balance)).toString(),
        energy: formatEther(BigInt(account.energy)).toString(),
    };
};
export const getAccountBalanceQueryKey = (address?: string) =>
    VECHAIN_KIT_QUERY_KEYS.balance.native(address);

/**
 *  Get the account balance for the given address
 * @param address  The address of the account to get the balance for
 * @returns  The account balance
 */
export const useAccountBalance = (address?: string) => {
    const thor = useThor();
    return useQuery({
        queryKey: getAccountBalanceQueryKey(address),
        queryFn: () => getAccountBalance(thor, address),
        enabled: !!address && Address.isValid(address),
        refetchInterval: 10000,
    });
};
````

## Source: `packages/vechain-kit/src/hooks/thor/blocks/useCurrentBlock.ts`

````typescript
import { TIME } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { useThor } from '@vechain/dapp-kit-react';

export const currentBlockQueryKey = () => ['VECHAIN_KIT', 'CURRENT_BLOCK'];

const REFETCH_INTERVAL = 10 * TIME.SECOND;

/**
 * Fetches the current block from the blockchain. The block is refetched every 10 seconds.
 * @returns the current block
 */
export const useCurrentBlock = () => {
    const thor = useThor();

    return useQuery({
        queryKey: currentBlockQueryKey(),
        queryFn: async () => {
            const response = await thor.blocks.getBestBlockExpanded();
            if (!response) throw new Error('Failed to fetch current block');
            return response;
        },
        staleTime: 1000 * 60,
        refetchInterval: REFETCH_INTERVAL,
    });
};
````

## Source: `packages/vechain-kit/src/hooks/thor/blocks/useGetChainId.ts`

````typescript
import { useQuery } from '@tanstack/react-query';
import { ThorClient } from '@vechain/sdk-network';
import { useThor } from '@vechain/dapp-kit-react';

export const getChainId = async (thor: ThorClient) => {
    const genesisBlock = await thor.blocks.getGenesisBlock();
    if (!genesisBlock) throw new Error('Genesis block not found');
    const chainId = genesisBlock.id;

    return chainId;
};
export const getChainIdQueryKey = () => ['VECHAIN_KIT_CHAIN_ID'];

/**
 *  Get the chain id
 * @returns The chain id
 */
export const useGetChainId = () => {
    const thor = useThor();

    return useQuery({
        queryKey: getChainIdQueryKey(),
        queryFn: () => getChainId(thor),
        enabled: !!thor,
    });
};
````

## Source: `packages/vechain-kit/src/hooks/thor/logs/logUtils.ts`

````typescript
import {
    EventLogs,
    FilterEventLogsOptions,
    ThorClient,
} from '@vechain/sdk-network';

const MAX_EVENTS_PER_QUERY = 1000;
/**
 * Params for getEvents function
 * @param nodeUrl the node url
 * @param thor the thor client
 * @param auctionId  the auction id to get the events
 * @param order  the order of the events (asc or desc)
 * @param offset  the offset of the events
 * @param limit  the limit of the events (max 256)
 * @param from  the block number to start from
 * @param filterCriteria  the filter criteria for the events
 * @returns  the encoded events
 */
export type GetEventsProps = {
    nodeUrl: string;
    thor: ThorClient;
    order?: 'asc' | 'desc';
    offset?: number;
    limit?: number;
    from?: number;
    to?: number;
    filterCriteria: FilterEventLogsOptions['criteriaSet'];
};
/**
 * Get events from blockchain (auction created, auction successful, auction cancelled)
 * @param order
 * @param offset
 * @param limit
 * @param from block parse start from
 */
export const getEventLogs = async ({
    thor,
    order = 'asc',
    offset = 0,
    limit = MAX_EVENTS_PER_QUERY,
    from = 0,
    to = thor.blocks.getHeadBlock()?.number,
    filterCriteria,
}: GetEventsProps) => {
    const response = await thor.logs.filterEventLogs({
        range: {
            from,
            to,
            unit: 'block',
        },
        options: {
            offset,
            limit,
        },
        order,
        criteriaSet: filterCriteria,
    });

    if (!response) throw new Error('Failed to fetch events');

    return response;
};

/**
 *  call getEvents iteratively to get all the events
 * @param nodeUrl the node url
 * @param thor the thor client
 * @param order the order of the events (asc or desc)
 * @param from the block number to start from
 * @param filterCriteria the filter criteria for the events
 * @returns all the events from the blockchain
 */
export const getAllEventLogs = async ({
    nodeUrl,
    thor,
    order = 'asc',
    from = 0,
    to,
    filterCriteria,
}: Omit<GetEventsProps, 'offset' | 'limit'>) => {
    const allEvents: EventLogs[] = [];
    let offset = 0;
    //return from the function only when we get all the events
    // TODO: check this can be improved, possible infinite loop here
    while (true) {
        const events = await getEventLogs({
            nodeUrl,
            thor,
            filterCriteria,
            from,
            to: to ?? Number.MAX_SAFE_INTEGER,
            limit: MAX_EVENTS_PER_QUERY,
            order,
            offset,
        });
        allEvents.push(...events);
        if (events.length < MAX_EVENTS_PER_QUERY) {
            return allEvents;
        }
        offset += MAX_EVENTS_PER_QUERY;
    }
};
````

## Source: `packages/vechain-kit/src/hooks/thor/smartAccounts/useAccountImplementationAddress.ts`

````typescript
import { getConfig } from '@/config';
import { NETWORK_TYPE } from '@/config/network';
import { useVeChainKitConfig } from '@/providers';
import { SocialLoginSmartAccountFactory__factory } from '@vechain/vechain-contract-types';
import { useQuery } from '@tanstack/react-query';
import { useThor } from '@vechain/dapp-kit-react';
import { ThorClient } from '@vechain/sdk-network';

export const getAccountImplementationAddress = async (
    thor: ThorClient,
    version?: number,
    networkType?: NETWORK_TYPE,
): Promise<string> => {
    if (!networkType) throw new Error('Network type is required');
    if (!version) throw new Error('Version is required');

    const contract = thor.contracts.load(
        getConfig(networkType).accountFactoryAddress,
        SocialLoginSmartAccountFactory__factory.abi,
    );

    let implementationAddressPromise:
        | ReturnType<typeof contract.read.accountImplementationV1>
        | ReturnType<typeof contract.read.accountImplementationV3>;

    switch (version) {
        case 1:
        case 2:
            implementationAddressPromise =
                contract.read.accountImplementationV1();
            break;

        case 3:
            implementationAddressPromise =
                contract.read.accountImplementationV3();
            break;
        default:
            throw new Error('Invalid version, must be between 1 and 3');
    }

    const res = await implementationAddressPromise;

    if (!res) throw new Error('Failed to get account implementation address');

    return res[0].toString();
};

export const getAccountImplementationAddressQueryKey = (
    version?: number,
    networkType?: NETWORK_TYPE,
) => [
    'VECHAIN_KIT',
    'SMART_ACCOUNT',
    'FACTORY',
    'IMPLEMENTATION_ADDRESS',
    version,
    networkType,
];

/**
 * Get the address of a smart account implementation for a given version
 * @param version - The version of the smart account implementation
 * @returns The address of the smart account implementation
 */
export const useAccountImplementationAddress = (version?: number) => {
    const thor = useThor();
    const { network } = useVeChainKitConfig();

    return useQuery({
        queryKey: getAccountImplementationAddressQueryKey(
            version,
            network.type,
        ),
        queryFn: async () =>
            getAccountImplementationAddress(thor, version, network.type),
        enabled: !!thor && !!version && !!network,
    });
};
````

## Source: `packages/vechain-kit/src/hooks/thor/smartAccounts/useCurrentAccountImplementationVersion.ts`

````typescript
import { getConfig } from '@/config';
import { NETWORK_TYPE } from '@/config/network';
import { useVeChainKitConfig } from '@/providers';
import { SocialLoginSmartAccountFactory__factory } from '@vechain/vechain-contract-types';
import { useQuery } from '@tanstack/react-query';
import { useThor } from '@vechain/dapp-kit-react';
import { ThorClient } from '@vechain/sdk-network';

export const getCurrentAccountImplementationVersion = async (
    thor: ThorClient,
    networkType?: NETWORK_TYPE,
): Promise<number> => {
    if (!networkType) throw new Error('Network type is required');

    const res = await thor.contracts
        .load(
            getConfig(networkType).accountFactoryAddress,
            SocialLoginSmartAccountFactory__factory.abi,
        )
        .read.currentAccountImplementationVersion();

    if (!res)
        throw new Error('Failed to get current account implementation version');

    return parseInt(res[0].toString());
};

export const getCurrentAccountImplementationVersionQueryKey = (
    networkType?: NETWORK_TYPE,
) => [
    'VECHAIN_KIT',
    'SMART_ACCOUNT',
    'FACTORY',
    'CURRENT_ACCOUNT_IMPLEMENTATION_VERSION',
    networkType,
];

/**
 * Get the current account implementation version used by the smart account factory
 * @returns The current account implementation version
 */
export const useCurrentAccountImplementationVersion = () => {
    const thor = useThor();
    const { network } = useVeChainKitConfig();

    return useQuery({
        queryKey: getCurrentAccountImplementationVersionQueryKey(network.type),
        queryFn: async () =>
            getCurrentAccountImplementationVersion(thor, network.type),
        enabled: !!thor && !!network,
    });
};
````

## Source: `packages/vechain-kit/src/hooks/thor/smartAccounts/useGetAccountAddress.ts`

````typescript
import { useQuery } from '@tanstack/react-query';
import { SocialLoginSmartAccountFactory__factory } from '@vechain/vechain-contract-types';
import { useThor } from '@vechain/dapp-kit-react';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';
import { getConfig } from '@/config';
import { ThorClient } from '@vechain/sdk-network';

export const getAccountAddress = async (
    thor: ThorClient,
    ownerAddress?: string,
    networkType?: NETWORK_TYPE,
): Promise<string> => {
    if (!ownerAddress) throw new Error('Owner address is required');
    if (!networkType) throw new Error('Network type is required');

    const res = await thor.contracts
        .load(
            getConfig(networkType).accountFactoryAddress,
            SocialLoginSmartAccountFactory__factory.abi,
        )
        .read.getAccountAddress(ownerAddress);

    if (!res)
        throw new Error(`Failed to get account address of ${ownerAddress}`);

    return res[0].toString();
};

export const getAccountAddressQueryKey = (
    ownerAddress?: string,
    networkType?: NETWORK_TYPE,
) => [
    'VECHAIN_KIT',
    'SMART_ACCOUNT',
    'FACTORY',
    'ADDRESS',
    ownerAddress,
    networkType,
];

/**
 * Get the address of a smart account
 * @param ownerAddress - The address of the owner of the smart account
 * @returns The address of the smart account
 */
export const useGetAccountAddress = (ownerAddress?: string) => {
    const thor = useThor();
    const { network } = useVeChainKitConfig();

    return useQuery({
        queryKey: getAccountAddressQueryKey(ownerAddress, network.type),
        queryFn: async () =>
            getAccountAddress(thor, ownerAddress, network.type),
        enabled: !!thor && !!ownerAddress && !!network,
    });
};
````

## Source: `packages/vechain-kit/src/hooks/thor/smartAccounts/useGetAccountVersion.ts`

````typescript
import { SocialLoginSmartAccountFactory__factory } from '@vechain/vechain-contract-types';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';
import { getConfig } from '@/config';
import { getCallClauseQueryKeyWithArgs, useCallClause } from '@/hooks';

const abi = SocialLoginSmartAccountFactory__factory.abi;

export const getAccountVersionQueryKey = (
    accountAddress: string,
    ownerAddress: string,
    networkType: NETWORK_TYPE,
) =>
    getCallClauseQueryKeyWithArgs({
        abi,
        address: getConfig(networkType).accountFactoryAddress,
        method: 'getAccountVersion',
        args: [accountAddress as `0x${string}`, ownerAddress as `0x${string}`],
    });

/**
 * Check if a smart account has a v1 smart account
 * @param accountAddress - The address of the smart account
 * @param ownerAddress - The address of the owner of the smart account
 * @returns The version of the smart account
 */
export const useGetAccountVersion = (
    accountAddress: string,
    ownerAddress: string,
) => {
    const { network } = useVeChainKitConfig();

    return useCallClause({
        address: getConfig(network.type).accountFactoryAddress,
        abi,
        method: 'getAccountVersion',
        args: [accountAddress as `0x${string}`, ownerAddress as `0x${string}`],
        queryOptions: {
            select: (data) => {
                return {
                    version: parseInt(data[0].toString()),
                    isDeployed: data[1],
                };
            },
            enabled: !!accountAddress && !!ownerAddress,
        },
    });
};
````

## Source: `packages/vechain-kit/src/hooks/thor/smartAccounts/useHasV1SmartAccount.ts`

````typescript
import { useQuery } from '@tanstack/react-query';
import { SocialLoginSmartAccountFactory__factory } from '@vechain/vechain-contract-types';
import { useThor } from '@vechain/dapp-kit-react';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';
import { getConfig } from '@/config';
import { ThorClient } from '@vechain/sdk-network';
import { executeCallClause } from '@/utils/thorUtils';

const abi = SocialLoginSmartAccountFactory__factory.abi;
const method = 'hasLegacyAccount' as const;

export const getHasV1SmartAccount = async (
    thor: ThorClient,
    ownerAddress?: string,
    networkType?: NETWORK_TYPE,
): Promise<boolean> => {
    if (!ownerAddress) throw new Error('Owner address is required');
    if (!networkType) throw new Error('Network type is required');

    const [hasLegacyAccount] = await executeCallClause({
        thor,
        abi,
        contractAddress: getConfig(networkType).accountFactoryAddress,
        method,
        args: [ownerAddress as `0x${string}`],
    });

    return hasLegacyAccount;
};

export const getHasV1SmartAccountQueryKey = (
    ownerAddress?: string,
    networkType?: NETWORK_TYPE,
) => [
    'VECHAIN_KIT',
    'SMART_ACCOUNT',
    'HAS_V1_SMART_ACCOUNT',
    ownerAddress,
    networkType,
];

/**
 * Check if a smart account has a v1 smart account
 * @param ownerAddress - The address of the owner of the smart account
 * @returns True if the smart account has a v1 smart account, false otherwise
 */
export const useHasV1SmartAccount = (ownerAddress?: string) => {
    const thor = useThor();
    const { network } = useVeChainKitConfig();

    return useQuery({
        queryKey: getHasV1SmartAccountQueryKey(ownerAddress, network.type),
        queryFn: async () =>
            getHasV1SmartAccount(thor, ownerAddress, network.type),
        enabled: !!thor && !!ownerAddress && !!network,
    });
};
````

## Source: `packages/vechain-kit/src/hooks/thor/smartAccounts/useIsSmartAccountDeployed.ts`

````typescript
import { useQuery } from '@tanstack/react-query';
import { useGetNodeUrl } from '@/hooks';
import { ThorClient } from '@vechain/sdk-network';
import { Address } from '@vechain/sdk-core';

export const getIsDeployed = async (
    thor: ThorClient,
    accountAddress?: string,
): Promise<boolean> => {
    if (!accountAddress) throw new Error('Account address is required');

    const res = await thor.accounts.getAccount(
        Address.of(String(accountAddress)),
    );

    if (!res) throw new Error('Account not found');

    return res.hasCode;
};

export const getIsDeployedQueryKey = (contractAddress?: string) => [
    'VECHAIN_KIT',
    'SMART_ACCOUNT',
    'IS_DEPLOYED',
    contractAddress,
];

/**
 * Check if a smart account is deployed
 * @returns True if the smart account is deployed, false otherwise
 */
export const useIsSmartAccountDeployed = (accountAddress?: string) => {
    const nodeUrl = useGetNodeUrl();
    const thor = ThorClient.at(nodeUrl);

    return useQuery({
        queryKey: getIsDeployedQueryKey(accountAddress),
        queryFn: async () => getIsDeployed(thor, accountAddress),
        enabled: !!thor && !!accountAddress,
    });
};
````

## Source: `packages/vechain-kit/src/hooks/thor/smartAccounts/useRefreshFactoryQueries.ts`

````typescript
import { useQueryClient } from '@tanstack/react-query';
import { useWallet } from '../../api/wallet/useWallet';
import {
    getAccountVersionQueryKey,
    getUpgradeRequiredQueryKey,
    getUpgradeRequiredForAccountQueryKey,
    getCurrentAccountImplementationVersionQueryKey,
    getAccountImplementationAddressQueryKey,
    getHasV1SmartAccountQueryKey,
    getAccountAddressQueryKey,
} from '@/hooks';
import { useVeChainKitConfig } from '@/providers';

/**
 * Hook to refresh smart account factory-related queries
 * @returns Object with refresh function
 */
export const useRefreshFactoryQueries = () => {
    const queryClient = useQueryClient();
    const { connectedWallet, smartAccount } = useWallet();
    const { network } = useVeChainKitConfig();

    const refresh = async () => {
        const ownerAddress = connectedWallet?.address ?? '';
        const smartAccountAddress = smartAccount?.address ?? '';

        // First cancel all queries
        await Promise.all([
            // Factory related queries
            queryClient.cancelQueries({
                queryKey: getAccountAddressQueryKey(ownerAddress, network.type),
            }),
            queryClient.cancelQueries({
                queryKey: getAccountVersionQueryKey(
                    smartAccountAddress,
                    ownerAddress,
                    network.type,
                ),
            }),
            queryClient.cancelQueries({
                queryKey: getHasV1SmartAccountQueryKey(
                    ownerAddress,
                    network.type,
                ),
            }),
            queryClient.cancelQueries({
                queryKey: getCurrentAccountImplementationVersionQueryKey(
                    network.type,
                ),
            }),

            // Upgrade related queries - using current version 3 as default
            queryClient.cancelQueries({
                queryKey: getUpgradeRequiredQueryKey(
                    smartAccountAddress,
                    ownerAddress,
                    3,
                    network.type,
                ),
            }),
            queryClient.cancelQueries({
                queryKey: getUpgradeRequiredForAccountQueryKey(
                    smartAccountAddress,
                    3,
                    network.type,
                ),
            }),
            queryClient.cancelQueries({
                queryKey: getAccountImplementationAddressQueryKey(
                    3,
                    network.type,
                ),
            }),
        ]);

        // Then refetch all queries
        await Promise.all([
            // Factory related queries
            queryClient.refetchQueries({
                queryKey: getAccountAddressQueryKey(ownerAddress, network.type),
            }),
            queryClient.refetchQueries({
                queryKey: getAccountVersionQueryKey(
                    smartAccountAddress,
                    ownerAddress,
                    network.type,
                ),
            }),
            queryClient.refetchQueries({
                queryKey: getHasV1SmartAccountQueryKey(
                    ownerAddress,
                    network.type,
                ),
            }),
            queryClient.refetchQueries({
                queryKey: getCurrentAccountImplementationVersionQueryKey(
                    network.type,
                ),
            }),

            // Upgrade related queries - using current version 3 as default
            queryClient.refetchQueries({
                queryKey: getUpgradeRequiredQueryKey(
                    smartAccountAddress,
                    ownerAddress,
                    3,
                    network.type,
                ),
            }),
            queryClient.refetchQueries({
                queryKey: getUpgradeRequiredForAccountQueryKey(
                    smartAccountAddress,
                    3,
                    network.type,
                ),
            }),
            queryClient.refetchQueries({
                queryKey: getAccountImplementationAddressQueryKey(
                    3,
                    network.type,
                ),
            }),
        ]);
    };

    return { refresh };
};
````

## Source: `packages/vechain-kit/src/hooks/thor/smartAccounts/useRefreshSmartAccountQueries.ts`

````typescript
import { useQueryClient } from '@tanstack/react-query';
import { useWallet } from '../../api/wallet/useWallet';
import {
    getSmartAccountQueryKey,
    getIsDeployedQueryKey,
} from '@/hooks';

/**
 * Hook to refresh smart account-related queries
 * @returns Object with refresh function
 */
export const useRefreshSmartAccountQueries = () => {
    const queryClient = useQueryClient();
    const { smartAccount } = useWallet();

    const refresh = async () => {
        const smartAccountAddress = smartAccount?.address ?? '';

        // First cancel all queries
        await Promise.all([
            // Smart account basic info
            queryClient.cancelQueries({
                queryKey: getSmartAccountQueryKey(smartAccountAddress),
            }),
            queryClient.cancelQueries({
                queryKey: getIsDeployedQueryKey(smartAccountAddress),
            }),
        ]);

        // Then refetch all queries
        await Promise.all([
            // Smart account basic info
            queryClient.refetchQueries({
                queryKey: getSmartAccountQueryKey(smartAccountAddress),
            }),
            queryClient.refetchQueries({
                queryKey: getIsDeployedQueryKey(smartAccountAddress),
            }),
        ]);
    };

    return { refresh };
};
````

## Source: `packages/vechain-kit/src/hooks/thor/smartAccounts/useSmartAccount.ts`

````typescript
import { useQuery } from '@tanstack/react-query';
import { Address } from '@vechain/sdk-core';
import { ThorClient } from '@vechain/sdk-network';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';
import { getConfig } from '@/config';
import { SocialLoginSmartAccountFactory__factory } from '@vechain/vechain-contract-types';
import { useThor } from '@vechain/dapp-kit-react';

export interface SmartAccountReturnType {
    address: string | undefined;
    isDeployed: boolean;
}
export const getSmartAccount = async (
    thor: ThorClient,
    network: NETWORK_TYPE,
    ownerAddress?: string,
) => {
    if (!ownerAddress) {
        return { address: undefined };
    }

    const res = await thor.contracts
        .load(
            getConfig(network).accountFactoryAddress,
            SocialLoginSmartAccountFactory__factory.abi,
        )
        .read.getAccountAddress(ownerAddress);

    if (!res) {
        throw new Error(`Failed to get account address of ${ownerAddress}`);
    }

    const accountAddress = Address.of(res[0].toString());
    const accountDetail = await thor.accounts.getAccount(accountAddress);

    if (!accountDetail) {
        throw new Error(`Failed to get account detail of ${accountAddress}`);
    }

    return {
        address: accountAddress.toString(),
        isDeployed: accountDetail.hasCode,
    };
};

export const getSmartAccountQueryKey = (ownerAddress?: string) => {
    return ['VECHAIN_KIT_SMART_ACCOUNT', ownerAddress];
};

export const useSmartAccount = (ownerAddress?: string) => {
    const { network } = useVeChainKitConfig();
    const thor = useThor();

    return useQuery({
        queryKey: getSmartAccountQueryKey(ownerAddress),
        queryFn: () => getSmartAccount(thor, network.type, ownerAddress),
        enabled: !!ownerAddress && !!network.type && !!thor,
    });
};
````

## Source: `packages/vechain-kit/src/hooks/thor/smartAccounts/useUpgradeRequired.ts`

````typescript
import { useQuery } from '@tanstack/react-query';
import { SocialLoginSmartAccountFactory__factory } from '@vechain/vechain-contract-types';
import { useThor } from '@vechain/dapp-kit-react';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';
import { getConfig } from '@/config';
import { ThorClient } from '@vechain/sdk-network';

export const getUpgradeRequired = async (
    thor: ThorClient,
    accountAddress: string,
    ownerAddress: string,
    targetVersion: number,
    networkType: NETWORK_TYPE,
): Promise<boolean> => {
    const res = await thor.contracts
        .load(
            getConfig(networkType).accountFactoryAddress,
            SocialLoginSmartAccountFactory__factory.abi,
        )
        .read.upgradeRequired(
            accountAddress as `0x${string}`,
            ownerAddress as `0x${string}`,
            BigInt(targetVersion),
        );

    if (!res)
        throw new Error(
            `Failed to get upgrade required of contract address ${
                getConfig(networkType).accountFactoryAddress
            }`,
        );

    return res[0] as boolean;
};

export const getUpgradeRequiredQueryKey = (
    accountAddress: string,
    ownerAddress: string,
    targetVersion: number,
    networkType: NETWORK_TYPE,
) => [
    'VECHAIN_KIT',
    'SMART_ACCOUNT',
    'FACTORY',
    'UPGRADE_REQUIRED',
    accountAddress,
    ownerAddress,
    targetVersion,
    networkType,
];

/**
 * Check if a smart account needs an upgrade (even if it's not yet deployed)
 * @param accountAddress - The address of the smart account
 * @param ownerAddress - The address of the owner of the smart account
 * @param targetVersion - The version of the smart account to check for
 * @returns True if the smart account needs an upgrade, false otherwise
 */
export const useUpgradeRequired = (
    accountAddress: string,
    ownerAddress: string,
    targetVersion: number,
) => {
    const thor = useThor();
    const { network } = useVeChainKitConfig();

    return useQuery({
        queryKey: getUpgradeRequiredQueryKey(
            accountAddress,
            ownerAddress,
            targetVersion,
            network.type,
        ),
        queryFn: async () =>
            getUpgradeRequired(
                thor,
                accountAddress,
                ownerAddress,
                targetVersion,
                network.type,
            ),
        enabled: !!thor && !!accountAddress && !!ownerAddress && !!network.type,
    });
};
````

## Source: `packages/vechain-kit/src/hooks/thor/smartAccounts/useUpgradeRequiredForAccount.ts`

````typescript
import { useQuery } from '@tanstack/react-query';
import { SocialLoginSmartAccountFactory__factory } from '@vechain/vechain-contract-types';
import { useThor } from '@vechain/dapp-kit-react';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';
import { getConfig } from '@/config';
import { ThorClient } from '@vechain/sdk-network';

export const getUpgradeRequiredForAccount = async (
    thor: ThorClient,
    contractAddress: string,
    targetVersion: number,
    networkType: NETWORK_TYPE,
): Promise<boolean> => {
    const res = await thor.contracts
        .load(
            getConfig(networkType).accountFactoryAddress,
            SocialLoginSmartAccountFactory__factory.abi,
        )
        .read.upgradeRequiredForAccount(contractAddress, BigInt(targetVersion));

    if (!res)
        throw new Error(
            `Failed to get upgrade required for contract address ${contractAddress}`,
        );

    return res[0] as boolean;
};

export const getUpgradeRequiredForAccountQueryKey = (
    contractAddress: string,
    targetVersion: number,
    networkType: NETWORK_TYPE,
) => [
    'VECHAIN_KIT',
    'SMART_ACCOUNT',
    'FACTORY',
    'NEEDS_UPGRADE_FOR_ACCOUNT',
    contractAddress,
    targetVersion,
    networkType,
];

/**
 * Check if a smart account needs an upgrade
 * @param contractAddress - The address of the smart account
 * @param targetVersion - The target version of the smart account
 * @returns True if the smart account needs an upgrade, false otherwise
 */
export const useUpgradeRequiredForAccount = (
    contractAddress: string,
    targetVersion: number,
) => {
    const thor = useThor();
    const { network } = useVeChainKitConfig();

    return useQuery({
        queryKey: getUpgradeRequiredForAccountQueryKey(
            contractAddress,
            targetVersion,
            network.type,
        ),
        queryFn: async () =>
            getUpgradeRequiredForAccount(
                thor,
                contractAddress,
                targetVersion,
                network.type,
            ),
        enabled:
            !!thor &&
            !!network &&
            !!contractAddress &&
            !!targetVersion &&
            contractAddress !== '',
    });
};
````

## Source: `packages/vechain-kit/src/hooks/thor/smartAccounts/useUpgradeSmartAccount.ts`

````typescript
import { useAccountImplementationAddress, useRefreshFactoryQueries, useRefreshSmartAccountQueries, useSendTransaction, UseSendTransactionReturnValue } from '@/hooks';
import { humanAddress, isValidAddress } from '@/utils';
import { SocialLoginSmartAccount__factory } from '@vechain/vechain-contract-types';
import { TransactionClause } from '@vechain/sdk-core';
import { useCallback } from 'react';

type UseUpgradeSmartAccountVersionProps = {
    smartAccountAddress: string;
    targetVersion: number;
    onSuccess?: () => void;
    onError?: () => void;
};

type UseUpgradeSmartAccountVersionReturnValue = {
    sendTransaction: () => Promise<void>;
} & Omit<UseSendTransactionReturnValue, 'sendTransaction'>;

const socialLoginSmartAccountInterface = SocialLoginSmartAccount__factory.createInterface();

export const useUpgradeSmartAccount = ({
    smartAccountAddress,
    targetVersion,
    onSuccess,
    onError,
}: UseUpgradeSmartAccountVersionProps): UseUpgradeSmartAccountVersionReturnValue => {
    const { refresh: refreshFactoryQueries } = useRefreshFactoryQueries();
    const { refresh: refreshSmartAccountQueries } =
        useRefreshSmartAccountQueries();

    // Fetch the new implementation address for the requested version
    const { data: newImplementationAddress } =
        useAccountImplementationAddress(targetVersion);

    const buildClauses = useCallback(async () => {
        if (!smartAccountAddress || !isValidAddress(smartAccountAddress)) {
            throw new Error('Invalid smart account address');
        }

        if (!newImplementationAddress) {
            throw new Error(
                `Unable to fetch implementation address for version ${targetVersion}`,
            );
        }

        return [
            {
                to: smartAccountAddress,
                value: '0x0',
                data: socialLoginSmartAccountInterface.encodeFunctionData(
                    'upgradeToAndCall',
                    [newImplementationAddress, '0x'],
                ),
                comment: `Upgrade account to version ${targetVersion}`,
                abi: socialLoginSmartAccountInterface
                    .getFunction('upgradeToAndCall')
                    .format('json'),
            },
        ] as TransactionClause[];
    }, [smartAccountAddress, newImplementationAddress, targetVersion]);

    const handleOnSuccess = async () => {
        // Refresh all relevant queries
        await Promise.all([
            refreshFactoryQueries(),
            refreshSmartAccountQueries(),
        ]);
        onSuccess?.();
    };

    const result = useSendTransaction({
        privyUIOptions: {
            title: 'Upgrade Smart Account',
            description: `Upgrading your account at ${humanAddress(
                smartAccountAddress,
            )} to version ${targetVersion}`,
            buttonText: 'Sign to continue',
        },
        onTxConfirmed: handleOnSuccess,
        onTxFailedOrCancelled: async () => {
            onError?.();
        },
    });

    return {
        ...result,
        sendTransaction: async () => {
            return result.sendTransaction(await buildClauses());
        },
    };
};
````

## Source: `packages/vechain-kit/src/hooks/thor/transactions/useBuildTransaction.ts`

````typescript
import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useWallet } from '@/hooks';
import { useSendTransaction } from './useSendTransaction';
import { TransactionClause } from '@vechain/sdk-core';

export type BuildTransactionProps<ClausesParams> = {
    clauseBuilder: (props: ClausesParams) => TransactionClause[];
    refetchQueryKeys?: (string | undefined)[][];
    onSuccess?: () => void;
    invalidateCache?: boolean;
    suggestedMaxGas?: number;
    gasPadding?: number;
    onFailure?: () => void;
    delegationUrl?: string;
};

/**
 * Custom hook for building and sending transactions.
 * @param clauseBuilder - A function that builds an array of enhanced clauses based on the provided parameters.
 * @param refetchQueryKeys - An optional array of query keys to refetch after the transaction is sent.
 * @param invalidateCache - A flag indicating whether to invalidate the cache and refetch queries after the transaction is sent.
 * @param onSuccess - An optional callback function to be called after the transaction is successfully sent.
 * @param onFailure - An optional callback function to be called after the transaction is failed or cancelled.
 * @param suggestedMaxGas - The suggested maximum gas for the transaction.
 * @param gasPadding - The padding to add to the suggested maximum gas.
 * @param delegationUrl - The dApp sponsored delegator url.
 * @returns An object containing the result of the `useSendTransaction` hook and a `sendTransaction` function.
 */
export const useBuildTransaction = <ClausesParams>({
    clauseBuilder,
    refetchQueryKeys,
    invalidateCache = true,
    onSuccess,
    onFailure,
    suggestedMaxGas,
    gasPadding,
    delegationUrl,
}: BuildTransactionProps<ClausesParams>) => {
    const { account } = useWallet();
    const queryClient = useQueryClient();

    /**
     * Callback function to be called when the transaction is successfully confirmed.
     * It cancels and refetches the specified queries if `invalidateCache` is `true`.
     */
    const handleOnSuccess = useCallback(async () => {
        if (invalidateCache) {
            refetchQueryKeys?.forEach(async (queryKey) => {
                await queryClient.cancelQueries({
                    queryKey,
                });
                await queryClient.refetchQueries({
                    queryKey,
                });
            });
        }

        onSuccess?.();
    }, [invalidateCache, onSuccess, queryClient, refetchQueryKeys]);

    const result = useSendTransaction({
        signerAccountAddress: account?.address,
        onTxConfirmed: handleOnSuccess,
        suggestedMaxGas,
        onTxFailedOrCancelled: onFailure,
        gasPadding,
        delegationUrl,
    });

    /**
     * Function to send a transaction based on the provided parameters.
     * @param props - The parameters to be passed to the `clauseBuilder` function.
     */
    const sendTransaction = useCallback(
        async (props: ClausesParams) => {
            result.sendTransaction(clauseBuilder(props), delegationUrl);
        },
        [clauseBuilder, result, delegationUrl],
    );

    return { ...result, sendTransaction };
};
````

## Source: `packages/vechain-kit/src/hooks/thor/transactions/useGasEstimate.ts`

````typescript
import type { Revision, TransactionClause } from '@vechain/sdk-core';
import type { ThorClient } from '@vechain/sdk-network';

export const useGasEstimate = async (
    thor: ThorClient,
    clauses: TransactionClause[],
    caller: string,
    options?: {
        revision?: Revision;
        gasPadding?: number;
    },
) => {
    const response = await thor.transactions.estimateGas(
        clauses,
        caller,
        options,
    );

    if (response.reverted) throw new Error('Failed to estimate gas');

    let totalGas = response?.totalGas ?? 0;
    // Ensure it covers the case where the gas estimation is not a number
    if (!totalGas || Number.isNaN(totalGas)) {
        totalGas = 0;
    }

    return Math.ceil(totalGas);
};
````

## Source: `packages/vechain-kit/src/hooks/thor/transactions/useSendTransaction.ts`

````typescript
'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    useThor,
    useWallet as useDAppKitWallet,
} from '@vechain/dapp-kit-react';
import { TransactionMessage } from '@vechain/dapp-kit';
import { usePrivyWalletProvider, useVeChainKitConfig } from '@/providers';
import { TransactionStatus, TransactionStatusErrorType } from '@/types';
import { useGetNodeUrl, useTxReceipt, useWallet } from '@/hooks';
import { useGasEstimate } from './useGasEstimate';
import { TransactionReceipt } from '@vechain/sdk-network';
import { Revision, TransactionClause } from '@vechain/sdk-core';

/**
 * Props for the {@link useSendTransaction} hook
 * @param signerAccountAddress the signer account to use
 * @param clauses clauses to send in the transaction
 * @param onTxConfirmed callback to run when the tx is confirmed
 * @param onTxFailedOrCancelled callback to run when the tx fails or is cancelled
 * @param suggestedMaxGas the suggested max gas for the transaction
 * @param privyUIOptions options to pass to the Privy UI
 * @param gasPadding the gas padding to use for the transaction (Eg. 0.1 for 10%)
 * @param delegationUrl the dApp sponsored delegator url.
 */
type UseSendTransactionProps = {
    signerAccountAddress?: string | null;
    clauses?: TransactionClause[];
    onTxConfirmed?: () => void | Promise<void>;
    onTxFailedOrCancelled?: (error?: Error | string) => void | Promise<void>;
    suggestedMaxGas?: number;
    privyUIOptions?: {
        title?: string;
        description?: string;
        buttonText?: string;
    };
    gasPadding?: number;
    delegationUrl?: string;
};

/**
 * Return value of the {@link useSendTransaction} hook
 * @param sendTransaction function to trigger the transaction
 * @param isTransactionPending boolean indicating if the transaction is waiting for the wallet to sign it
 * @param isWaitingForWalletConfirmation boolean indicating if the transaction is waiting for the wallet to confirm it
 * @param txReceipt the transaction receipt
 * @param status the status of the transaction (see {@link TransactionStatus})
 * @param resetStatus function to reset the status to "ready"
 * @param error error that occurred while sending the transaction
 */
export type UseSendTransactionReturnValue = {
    sendTransaction: (
        clauses?: TransactionClause[],
        delegationUrl?: string,
        privyUIOptions?: {
            title?: string;
            description?: string;
            buttonText?: string;
        },
    ) => Promise<void>;
    isTransactionPending: boolean;
    isWaitingForWalletConfirmation: boolean;
    txReceipt: TransactionReceipt | null;
    status: TransactionStatus;
    resetStatus: () => void;
    error?: TransactionStatusErrorType;
};

/**
 * Generic hook to send a transaction using dapp-kit-react.
 * This hook supports both Privy and VeChain wallets.
 *
 * It returns a function to send the transaction and a status to indicate the state
 * of the transaction (together with the transaction id).
 *
 * * ⚠️ IMPORTANT: When using this hook with Privy cross-app connections, ensure all
 * data fetching is done before triggering the transaction. Fetching data after
 * the transaction is triggered may cause browser popup blocking. Pre-fetch any
 * required data and pass it to your transaction building logic.
 *
 * @example
 * ```typescript
 * // ❌ Bad: Fetching during transaction
 * const sendTx = async () => {
 *   const data = await fetchSomeData(); // May cause popup blocking
 *   return sendTransaction(data);
 * };
 *
 * // ✅ Good: Pre-fetch data
 * const { data } = useQuery(['someData'], fetchSomeData);
 * const sendTx = () => sendTransaction(data); // No async operations
 * ```
 *
 * @param signerAccount the signer account to use
 * @param clauses clauses to send in the transaction
 * @param onTxConfirmed callback to run when the tx is confirmed
 * @param onTxFailedOrCancelled callback to run when the tx fails or is cancelled
 * @param suggestedMaxGas the suggested max gas for the transaction
 * @param privyUIOptions options to pass to the Privy UI
 * @param gasPadding the gas padding to use for the transaction (Eg. 0.1 for 10%)
 * @param delegationUrl the dApp sponsored delegator url.
 * @returns see {@link UseSendTransactionReturnValue}
 */
export const useSendTransaction = ({
    signerAccountAddress,
    clauses,
    onTxConfirmed,
    onTxFailedOrCancelled,
    suggestedMaxGas,
    privyUIOptions,
    gasPadding,
    delegationUrl,
}: UseSendTransactionProps): UseSendTransactionReturnValue => {
    const thor = useThor();
    const { signer, requestTransaction } = useDAppKitWallet();
    const { connection } = useWallet();
    const { feeDelegation } = useVeChainKitConfig();
    const nodeUrl = useGetNodeUrl();
    const privyWalletProvider = usePrivyWalletProvider();

    /**
     * Send a transaction with the given clauses (in case you need to pass data to build the clauses to mutate directly)
     * If the wallet is connected with Privy, the smart account provider will be used to send the transaction
     * @returns see {@link UseSendTransactionReturnValue}
     */
    const sendTransaction = useCallback(
        async (
            clauses?:
                | TransactionClause[]
                | (() => TransactionClause[])
                | (() => Promise<TransactionClause[]>),
            delegationUrl?: string,
            privyUIOptions?: {
                title?: string;
                description?: string;
                buttonText?: string;
            },
        ) => {
            const _clauses =
                typeof clauses === 'function' ? await clauses() : clauses ?? [];
            if (connection.isConnectedWithPrivy) {
                return await privyWalletProvider.sendTransaction({
                    txClauses: _clauses,
                    ...privyUIOptions,
                    delegationUrl,
                });
            }

            if (!signerAccountAddress) {
                throw new Error('signerAccountAddress is required');
            }

            let estimatedGas = 0;
            try {
                estimatedGas = await useGasEstimate(
                    thor,
                    [..._clauses],
                    signerAccountAddress,
                    {
                        revision: Revision.NEXT,
                        ...(gasPadding ? { gasPadding } : {}), //If gasPadding is provided, use it, otherwise it will apply only revision
                    },
                );
            } catch (e) {
                console.error('Gas estimation failed', e);
            }

            // Use signerAccountAddress (stored active wallet) as signer when on desktop with dappkit
            // This ensures the extension uses the correct wallet that the user selected
            const signerAddress = connection.isConnectedWithDappKit && !connection.isInAppBrowser && signerAccountAddress
                ? signerAccountAddress
                : signer.address;

            const response = await requestTransaction(
                _clauses as TransactionMessage[],
                {
                    signer: signerAddress,
                    gas: suggestedMaxGas ?? estimatedGas,
                    ...(feeDelegation?.delegateAllTransactions || delegationUrl ? {
                        delegator: {
                            url: delegationUrl ?? feeDelegation?.delegatorUrl ?? '',
                            signer: signerAccountAddress,
                        }
                    } : {}),
                }
            );
            return response.txid;
        },
        [
            signerAccountAddress,
            suggestedMaxGas,
            nodeUrl,
            privyWalletProvider,
            privyUIOptions,
            feeDelegation,
            thor,
            signer,
            gasPadding,
            delegationUrl,
            requestTransaction,
            connection.isConnectedWithDappKit,
            connection.isInAppBrowser,
        ],
    );

    /**
     * Adapter to send the transaction with the clauses passed to the hook or the ones passed to the function,
     * and to store the transaction id and the status of the transaction (pending, success, error).
     */
    const [txHash, setTxHash] = useState<string | null>(null);
    const [sendTransactionPending, setSendTransactionPending] = useState(false);
    const [sendTransactionError, setSendTransactionError] = useState<
        string | null
    >(null);

    const sendTransactionAdapter = useCallback(
        async (_clauses?: TransactionClause[], _delegationUrl?: string): Promise<void> => {
            if (!_clauses && !clauses) throw new Error('clauses are required');
            try {
                setTxHash(null);
                setSendTransactionPending(true);
                setSendTransactionError(null);
                setError(undefined);
                const response = await sendTransaction(_clauses ?? [], _delegationUrl, {
                    ...privyUIOptions,
                });

                setTxHash(response);
            } catch (error) {
                setSendTransactionError(
                    error && typeof error === 'object' && 'message' in error
                        ? (error.message as string)
                        : String(error),
                );
                onTxFailedOrCancelled?.(
                    error instanceof Error ? error : new Error(String(error)),
                );
            } finally {
                setSendTransactionPending(false);
            }
        },
        [sendTransaction, clauses, privyUIOptions, delegationUrl],
    );

    /**
     * Fetch the transaction receipt once the transaction is broadcasted
     */
    const {
        data: txReceipt,
        isLoading: isTxReceiptLoading,
        error: txReceiptError,
    } = useTxReceipt(txHash ?? '');

    /**
     * Explain the revert reason of the transaction
     * @param txReceipt the transaction receipt
     * @returns the revert reason
     */
    const explainTxRevertReason = useCallback(
        async (txReceipt: TransactionReceipt) => {
            if (!txReceipt.reverted || !txReceipt.meta.txID) return;

            return await thor.transactions.getRevertReason(txReceipt.meta.txID);
        },
        [thor],
    );

    /**
     * General error that is set when
     * - unable to send the tx
     * - unable to fetch the receipt
     * - the transaction is reverted
     */
    const [error, setError] = useState<TransactionStatusErrorType>();

    /**
     * The status of the transaction
     */
    const status = useMemo(() => {
        if (sendTransactionPending) return 'pending';

        if (sendTransactionError) {
            return 'error';
        }

        if (txHash) {
            if (isTxReceiptLoading) return 'waitingConfirmation';
            if (txReceiptError) {
                return 'error';
            }
            if (txReceipt) {
                if (txReceipt.reverted) {
                    return 'error';
                }
                return 'success';
            }
        }

        return 'ready';
    }, [
        isTxReceiptLoading,
        sendTransactionError,
        sendTransactionPending,
        txHash,
        txReceipt,
        txReceiptError,
    ]);

    /**
     * If the transaction is successful or in error, explain the revert reason
     */
    useEffect(() => {
        if (status === 'success' || status === 'error') {
            if (sendTransactionError && !error) {
                setError({
                    type: 'UserRejectedError',
                    reason: sendTransactionError,
                });
                return;
            }

            if (txReceipt?.reverted && !error?.type) {
                (async () => {
                    const revertReason = await explainTxRevertReason(txReceipt);

                    setError({
                        type: 'RevertReasonError',
                        reason: revertReason
                            ? 'Transaction reverted with: ' + revertReason
                            : 'Transaction reverted',
                    });
                })();
                return;
            }

            if (txReceipt && !txReceipt.reverted) {
                onTxConfirmed?.();
            }
        }
    }, [
        status,
        txReceipt,
        onTxConfirmed,
        explainTxRevertReason,
        sendTransactionError,
    ]);

    /**
     * Reset the status of the transaction
     */
    const resetStatus = useCallback(() => {
        setTxHash(null);
        setSendTransactionPending(false);
        setSendTransactionError(null);
        setError(undefined);
    }, []);

    /**
     * Check if the transaction is pending
     */
    const isTransactionPending = useMemo(() => {
        return (
            sendTransactionPending ||
            isTxReceiptLoading ||
            status === 'pending' ||
            status === 'waitingConfirmation'
        );
    }, [sendTransactionPending, isTxReceiptLoading, status]);

    const isWaitingForWalletConfirmation = useMemo(() => {
        return status === 'pending';
    }, [sendTransactionPending, status]);

    return {
        sendTransaction: sendTransactionAdapter,
        isTransactionPending,
        isWaitingForWalletConfirmation,
        txReceipt: txReceipt ?? null,
        status,
        resetStatus,
        error,
    };
};
````

## Source: `packages/vechain-kit/src/hooks/thor/transactions/useTransferERC20.ts`

````typescript
import {
    UseSendTransactionReturnValue,
    useRefreshBalances,
    useSendTransaction,
} from '@/hooks';
import { useGetCustomTokenInfo } from '@/hooks/api/wallet/useGetCustomTokenInfo';
import { IERC20__factory } from '@vechain/vechain-contract-types';
import { useMemo } from 'react';
import { humanAddress, isValidAddress } from '@/utils';
import { parseUnits } from 'viem';
import { EnhancedClause } from '@/types';

type useTransferERC20Props = {
    fromAddress: string;
    receiverAddress: string;
    amount: string;
    tokenAddress: string;
    tokenName: string;
    tokenDecimals?: number;
    onSuccess?: () => void;
    onSuccessMessageTitle?: number;
    onError?: (error?: string) => void;
};

type useTransferERC20ReturnValue = {
    sendTransaction: () => Promise<void>;
    clauses: EnhancedClause[];
    isLoadingTokenInfo: boolean;
} & Omit<UseSendTransactionReturnValue, 'sendTransaction'>;

const ERC20Interface = IERC20__factory.createInterface();

export const buildERC20Clauses = (
    receiverAddress: string,
    amount: string,
    tokenAddress: string,
    tokenName: string,
    tokenDecimals: number,
): EnhancedClause[] => {
    if (!receiverAddress || !amount || !isValidAddress(receiverAddress))
        throw new Error('Invalid receiver address or amount');

    const clausesArray: any[] = [];

    clausesArray.push({
        to: tokenAddress,
        value: '0x0',
        data: ERC20Interface.encodeFunctionData('transfer', [
            receiverAddress,
            parseUnits(amount, tokenDecimals),
        ]),
        comment: `Transfer ${amount} ${tokenName} to ${receiverAddress}`,
        abi: ERC20Interface.getFunction('transfer'),
    });
    return clausesArray;
};

export const useTransferERC20 = ({
    fromAddress,
    receiverAddress,
    amount,
    tokenAddress,
    tokenName,
    tokenDecimals,
    onSuccess,
    onError,
}: useTransferERC20Props): useTransferERC20ReturnValue => {
    const { refresh } = useRefreshBalances();
    const {
        data: tokenInfo,
        isLoading: isLoadingTokenInfo,
        error: tokenInfoError,
    } = useGetCustomTokenInfo(tokenDecimals === undefined ? tokenAddress : '');
    const resolvedTokenDecimals = useMemo(() => {
        const decimals = tokenDecimals ?? tokenInfo?.decimals;
        if (decimals == null) return undefined;

        const normalized = Number(decimals);
        return Number.isSafeInteger(normalized) && normalized >= 0
            ? normalized
            : undefined;
    }, [tokenDecimals, tokenInfo?.decimals]);

    const clauses = useMemo(() => {
        if (resolvedTokenDecimals === undefined) {
            return [];
        }

        return buildERC20Clauses(
            receiverAddress,
            amount,
            tokenAddress,
            tokenName,
            resolvedTokenDecimals,
        );
    }, [
        receiverAddress,
        amount,
        tokenAddress,
        tokenName,
        resolvedTokenDecimals,
    ]);

    const result = useSendTransaction({
        signerAccountAddress: fromAddress,
        privyUIOptions: {
            title: 'Confirm Transfer',
            description: `Transfer ${amount} ${tokenName} to ${humanAddress(
                receiverAddress,
            )}`,
            buttonText: 'Sign to continue',
        },
        onTxConfirmed: async () => {
            refresh();
            onSuccess?.();
        },
        onTxFailedOrCancelled: async (error) => {
            onError?.(error instanceof Error ? error.message : String(error));
        },
    });

    return {
        ...result,
        clauses,
        isLoadingTokenInfo,
        sendTransaction: async () => {
            if (resolvedTokenDecimals === undefined) {
                const message = tokenInfoError
                    ? `Failed to load token info: ${tokenInfoError.message}`
                    : 'Token decimals are required';
                onError?.(message);
                return;
            }

            return result.sendTransaction(clauses);
        },
    };
};
````

## Source: `packages/vechain-kit/src/hooks/thor/transactions/useTransferERC721.ts`

````typescript
import { useMemo } from 'react';
import { Interface } from 'ethers';
import { useQueryClient } from '@tanstack/react-query';
import {
    UseSendTransactionReturnValue,
    useRefreshBalances,
    useSendTransaction,
} from '@/hooks';
import { getOwnedNftsQueryKey } from '@/hooks/api/nfts/useOwnedNfts';
import { useVeChainKitConfig } from '@/providers';
import { humanAddress, isValidAddress } from '@/utils';
import { EnhancedClause } from '@/types';

type UseTransferERC721Props = {
    fromAddress: string;
    receiverAddress: string;
    collectionAddress: string;
    tokenId: string;
    collectionName?: string;
    onSuccess?: () => void;
    onError?: (error?: string) => void;
};

type UseTransferERC721ReturnValue = {
    sendTransaction: () => Promise<void>;
    clauses: EnhancedClause[];
} & Omit<UseSendTransactionReturnValue, 'sendTransaction'>;

const ERC721Interface = new Interface([
    'function safeTransferFrom(address from, address to, uint256 tokenId)',
]);

export const buildERC721Clauses = (
    fromAddress: string,
    receiverAddress: string,
    collectionAddress: string,
    tokenId: string,
    collectionName?: string,
): EnhancedClause[] => {
    if (
        !receiverAddress ||
        !isValidAddress(receiverAddress) ||
        !fromAddress ||
        !isValidAddress(fromAddress) ||
        !collectionAddress ||
        !isValidAddress(collectionAddress) ||
        tokenId === ''
    ) {
        throw new Error('Invalid transfer parameters');
    }

    const safeTransferFrom = ERC721Interface.getFunction('safeTransferFrom');
    if (!safeTransferFrom) {
        throw new Error('safeTransferFrom not found in ERC721 interface');
    }

    const clausesArray: any[] = [
        {
            to: collectionAddress,
            value: '0x0',
            data: ERC721Interface.encodeFunctionData('safeTransferFrom', [
                fromAddress,
                receiverAddress,
                BigInt(tokenId),
            ]),
            comment: `Transfer ${
                collectionName ?? 'NFT'
            } #${tokenId} to ${receiverAddress}`,
            abi: safeTransferFrom,
        },
    ];
    return clausesArray;
};

export const useTransferERC721 = ({
    fromAddress,
    receiverAddress,
    collectionAddress,
    tokenId,
    collectionName,
    onSuccess,
    onError,
}: UseTransferERC721Props): UseTransferERC721ReturnValue => {
    const { refresh } = useRefreshBalances();
    const queryClient = useQueryClient();
    const { network } = useVeChainKitConfig();

    const clauses = useMemo(() => {
        try {
            return buildERC721Clauses(
                fromAddress,
                receiverAddress,
                collectionAddress,
                tokenId,
                collectionName,
            );
        } catch {
            return [];
        }
    }, [
        fromAddress,
        receiverAddress,
        collectionAddress,
        tokenId,
        collectionName,
    ]);

    const result = useSendTransaction({
        signerAccountAddress: fromAddress,
        privyUIOptions: {
            title: 'Confirm NFT Transfer',
            description: `Transfer ${
                collectionName ?? 'NFT'
            } #${tokenId} to ${humanAddress(receiverAddress)}`,
            buttonText: 'Sign to continue',
        },
        onTxConfirmed: async () => {
            refresh();
            await queryClient.invalidateQueries({
                queryKey: getOwnedNftsQueryKey(fromAddress, network.type),
            });
            onSuccess?.();
        },
        onTxFailedOrCancelled: async (error) => {
            onError?.(error instanceof Error ? error.message : String(error));
        },
    });

    return {
        ...result,
        clauses,
        sendTransaction: async () => {
            if (!clauses.length) {
                onError?.('Invalid transfer parameters');
                return;
            }
            return result.sendTransaction(clauses);
        },
    };
};
````

## Source: `packages/vechain-kit/src/hooks/thor/transactions/useTransferVET.ts`

````typescript
import {
    UseSendTransactionReturnValue,
    useRefreshBalances,
    useSendTransaction,
} from '@/hooks';
import { humanAddress, isValidAddress } from '@/utils';
import { useMemo } from 'react';
import { parseEther } from 'viem';
import { EnhancedClause } from '@/types';

type useTransferVETProps = {
    fromAddress: string;
    receiverAddress: string;
    amount: string;
    onSuccess?: () => void;
    onError?: (error?: string) => void;
};

type useTransferVETReturnValue = {
    sendTransaction: () => Promise<void>;
    clauses: EnhancedClause[];
} & Omit<UseSendTransactionReturnValue, 'sendTransaction'>;

export const buildVETClauses = (receiverAddress: string, amount: string): EnhancedClause[] => {
    if (!receiverAddress || !amount || !isValidAddress(receiverAddress))
        throw new Error('Invalid receiver address or amount');

    // Validate amount is a valid number
    if (isNaN(Number(amount))) {
        throw new Error('Invalid amount');
    }

    const clausesArray: EnhancedClause[] = [];

    try {
        clausesArray.push({
            to: receiverAddress,
            value: parseEther(amount).toString(), // Convert to string
            data: '0x',
            comment: `Transfer ${amount} VET to ${receiverAddress}`,
        });
    } catch (error) {
        console.error('Error building clauses:', error);
        throw new Error('Invalid amount format');
    }

    return clausesArray;
};

export const useTransferVET = ({
    fromAddress,
    receiverAddress,
    amount,
    onSuccess,
    onError,
}: useTransferVETProps): useTransferVETReturnValue => {
    const { refresh } = useRefreshBalances();

    // Memoize the clauses
    const clauses = useMemo(() => buildVETClauses(receiverAddress, amount), [receiverAddress, amount]);

    const result = useSendTransaction({
        signerAccountAddress: fromAddress,
        privyUIOptions: {
            title: 'Confirm Transfer',
            description: `Transfer ${amount} VET to ${humanAddress(
                receiverAddress,
            )}`,
            buttonText: 'Sign to continue',
        },
        onTxConfirmed: async () => {
            refresh();
            onSuccess?.();
        },
        onTxFailedOrCancelled: async (error) => {
            onError?.(error instanceof Error ? error.message : String(error));
        },
    });

    return {
        ...result,
        clauses,
        sendTransaction: async () => {
            return result.sendTransaction(clauses);
        },
    };
};
````

## Source: `packages/vechain-kit/src/hooks/thor/transactions/useTxReceipt.ts`

````typescript
'use client';

import { useThor } from '@vechain/dapp-kit-react';
import { useQuery } from '@tanstack/react-query';
import { TIME } from '@/utils';

const BLOCK_GENERATION_INTERVAL = 10 * TIME.SECOND;

export const txReceiptQueryKey = (txId: string) => [
    'VECHAIN_KIT',
    'TX_RECEIPT',
    txId,
];

/**
 * Retrieve the receipt of a transaction identified by its ID.
 * If the transaction is not found, the response will be null.
 * @param txId The ID of the transaction to retrieve the receipt for
 * @param blockTimeout Optional timeout in milliseconds to stop polling for receipt
 * @returns Query result containing the transaction receipt
 */
export const useTxReceipt = (txId: string, blockTimeout = 5) => {
    const thor = useThor();

    return useQuery({
        queryKey: txReceiptQueryKey(txId),
        queryFn: async () => {
            const response = await thor.transactions.waitForTransaction(txId, {
                timeoutMs: blockTimeout * BLOCK_GENERATION_INTERVAL,
                intervalMs: 3000
            });

            if (!response) throw new Error('Transaction receipt not found');

            return response;
        },
        enabled: !!txId,
    });
};
````

## Source: `packages/vechain-kit/src/hooks/utils/useBuildClauses.ts`

````typescript
import { SignTypedDataParameters } from "@wagmi/core";
import { encodeFunctionData } from "viem";
import { ethers } from "ethers";
import { EnhancedClause, ExecuteWithAuthorizationSignData, ExecuteBatchWithAuthorizationSignData } from "@/types";
import { Clause, Address, ABIContract, TransactionClause } from '@vechain/sdk-core';
import { getConfig } from '@/config';
import { usePrivy } from '@privy-io/react-auth';
import { NETWORK_TYPE } from '@/config/network';
import { usePrivyCrossAppSdk } from '@/providers/PrivyCrossAppProvider';
import { useWallet, SmartAccountReturnType, useGetChainId } from "@/hooks";
import { useVeChainKitConfig } from "@/providers";
import { SocialLoginSmartAccount__factory, SocialLoginSmartAccountFactory__factory } from "@vechain/vechain-contract-types";

export interface BuildClausesParams {
    clauses: EnhancedClause[];
    smartAccount: SmartAccountReturnType;
    version: number | undefined;
    title?: string;
    description?: string;
    buttonText?: string;
}

/**
 * Build the typed data structure for executeBatchWithAuthorization
 * @param clauses - The clauses to sign
 * @param chainId - The chain id
 * @param verifyingContract - The address of the smart account
 * @returns The typed data structure for executeBatchWithAuthorization
 */
export function buildBatchAuthorizationTypedData({
    clauses,
    chainId,
    verifyingContract,
}: {
    clauses: TransactionClause[];
    chainId: number;
    verifyingContract: string;
}): ExecuteBatchWithAuthorizationSignData {
    const toArray: string[] = [];
    const valueArray: string[] = [];
    const dataArray: string[] = [];

    clauses.forEach((clause) => {
        toArray.push(clause.to ?? '');
        valueArray.push(String(clause.value));
        if (typeof clause.data === 'object' && 'abi' in clause.data) {
            dataArray.push(encodeFunctionData(clause.data));
        } else {
            dataArray.push(clause.data || '0x');
        }
    });

    return {
        domain: {
            name: 'Wallet',
            version: '1',
            chainId,
            verifyingContract: verifyingContract,
        },
        types: {
            ExecuteBatchWithAuthorization: [
                { name: 'to', type: 'address[]' },
                { name: 'value', type: 'uint256[]' },
                { name: 'data', type: 'bytes[]' },
                { name: 'validAfter', type: 'uint256' },
                { name: 'validBefore', type: 'uint256' },
                { name: 'nonce', type: 'bytes32' },
            ],
            EIP712Domain: [
                { name: 'name', type: 'string' },
                { name: 'version', type: 'string' },
                { name: 'chainId', type: 'uint256' },
                { name: 'verifyingContract', type: 'address' },
            ],
        },
        primaryType: 'ExecuteBatchWithAuthorization',
        message: {
            to: toArray,
            value: valueArray,
            data: dataArray,
            validAfter: 0,
            validBefore: Math.floor(Date.now() / 1000) + 300, // e.g. 5 minutes from now
            nonce: ethers.hexlify(ethers.randomBytes(32)),
        },
    };
};

/**
 * Build the typed data structure for executeWithAuthorization
 * @param clause - The clause to sign
 * @param chainId - The chain id
 * @param smartAccount - The smart account object
 * @returns The typed data structure for executeWithAuthorization
 */
export function buildSingleAuthorizationTypedData({
    clause,
    chainId,
    smartAccount,
}: {
    clause: TransactionClause;
    chainId: number;
    smartAccount: SmartAccountReturnType;
}): ExecuteWithAuthorizationSignData {
    return {
        domain: {
            name: 'Wallet',
            version: '1',
            chainId: chainId as unknown as number, // convert chainId to a number
            verifyingContract: smartAccount.address ?? '',
        },
        types: {
            ExecuteWithAuthorization: [
                { name: 'to', type: 'address' },
                { name: 'value', type: 'uint256' },
                { name: 'data', type: 'bytes' },
                { name: 'validAfter', type: 'uint256' },
                { name: 'validBefore', type: 'uint256' },
            ],
            EIP712Domain: [
                { name: 'name', type: 'string' },
                { name: 'version', type: 'string' },
                { name: 'chainId', type: 'uint256' },
                { name: 'verifyingContract', type: 'address' },
            ],
        },
        primaryType: 'ExecuteWithAuthorization',
        message: {
            validAfter: 0,
            validBefore: Math.floor(Date.now() / 1000) + 60, // 1 minute
            to: clause.to,
            value: String(clause.value),
            data:
                (typeof clause.data === 'object' && 'abi' in clause.data
                    ? encodeFunctionData(clause.data)
                    : clause.data) || '0x',
        },
    };
};

function setUpBuildClausesParams() {
    const { connection, connectedWallet } = useWallet();
    const { signTypedData: signTypedDataWithCrossApp } = usePrivyCrossAppSdk();
    const { signTypedData: signTypedDataPrivy } = usePrivy();
    const { network } = useVeChainKitConfig();
    const { data: chainId } = useGetChainId();

    return {
        connection,
        connectedWallet,
        signTypedDataWithCrossApp,
        signTypedDataPrivy,
        network,
        chainId,
    };
}

/**
 * Build either executeWithAuthorization or executeBatchWithAuthorization clauses based on smart account version using buildClausesWithAuth
 * @param clauses - Either VET or ERC20 clauses
 * @param smartAccount - The user's smart account object
 * @param version - The smart account version
 * @param title - The title of the transaction
 * @param description - The description of the transaction
 * @param buttonText - The button text of the transaction
 * @returns The clauses for the executeWithAuthorization or executeBatchWithAuthorization function using buildClausesWithAuth
 */
export const useBuildClauses = () => {
    const {
        connection,
        connectedWallet,
        signTypedDataWithCrossApp,
        signTypedDataPrivy,
        network,
        chainId,
    } = setUpBuildClausesParams();

    const buildClausesWithAuth = async (params: BuildClausesParams) => {
        const { version } = params;
        if (version && version < 3) {
            return await buildSingleExecuteWithAuthorizationClauses(params);
        }
        return await buildBatchExecuteWithAuthorizationClauses(params);
    }

    async function buildSingleExecuteWithAuthorizationClauses(params: BuildClausesParams) {
        const {
            clauses: txClauses,
            smartAccount,
            title = 'Sign Transaction',
            description,
            buttonText = 'Sign',
        } = params;

        const resultClauses = [];

        const dataToSign: ExecuteWithAuthorizationSignData[] =
            txClauses.map((txData: EnhancedClause) =>
                buildSingleAuthorizationTypedData({
                    clause: txData,
                    chainId: chainId as unknown as number,
                    smartAccount: smartAccount,
                }),
        );

        // request signatures using privy
        const signatures: string[] = [];
        for (let index = 0; index < dataToSign.length; index++) {
            const data = dataToSign[index];
            const txClause = txClauses[index];
            if (!txClause) {
                throw new Error(
                    `Transaction clause at index ${index} is undefined`,
                );
            }

            if (connection.isConnectedWithCrossApp) {
                const mutableData = {
                    ...data,
                    address: connectedWallet?.address as `0x${string}`,
                    types: Object.fromEntries(
                        Object.entries(data.types).map(([k, v]) => [
                            k,
                            [...v],
                        ]),
                    ),
                } as unknown as SignTypedDataParameters;
                const signature = await signTypedDataWithCrossApp(
                    mutableData,
                );
                signatures.push(signature);
                continue;
            }

            const funcData = txClause.data;
            const signature = (
                await signTypedDataPrivy(data, {
                    uiOptions: {
                        title,
                        description:
                            description ??
                            ((txClauses[index] as EnhancedClause).comment ||
                                (typeof funcData === 'object' &&
                                funcData !== null &&
                                'functionName' in funcData
                                    ? (
                                          funcData as {
                                              functionName: string;
                                          }
                                      ).functionName
                                    : ' ')),
                        buttonText,
                    },
                })
            ).signature;
            signatures.push(signature);
        }
        // if the account smartAccountAddress has no code yet, it's not been deployed/created yet
        if (!smartAccount.isDeployed) {
            resultClauses.push(
                Clause.callFunction(
                    Address.of(
                        getConfig(network.type as NETWORK_TYPE).accountFactoryAddress,
                    ),
                    ABIContract.ofAbi(
                        SocialLoginSmartAccountFactory__factory.abi,
                    ).getFunction('createAccount'),
                    [connectedWallet?.address ?? ''], // set the Privy wallet address as the owner of the smart account
                ),
            );
        }

        dataToSign.forEach((data, index) => {
            resultClauses.push(
                Clause.callFunction(
                    Address.of(smartAccount.address ?? ''),
                    ABIContract.ofAbi(
                        SocialLoginSmartAccount__factory.abi,
                    ).getFunction('executeWithAuthorization'),
                    [
                        data.message.to as `0x${string}`,
                        BigInt(data.message.value),
                        data.message.data as `0x${string}`,
                        BigInt(data.message.validAfter),
                        BigInt(data.message.validBefore),
                        signatures[index] as `0x${string}`,
                    ],
                ),
            );
        });
        return resultClauses;
    }

    async function buildBatchExecuteWithAuthorizationClauses(params: BuildClausesParams) {
        const {
            clauses: txClauses,
            smartAccount,
            title,
            description,
            buttonText = 'Sign',
        } = params;

        const resultClauses = [];

        const typedData = buildBatchAuthorizationTypedData({
            clauses: txClauses,
            chainId: chainId as unknown as number,
            verifyingContract: smartAccount.address ?? '',
        });

        // Sign the typed data (either cross-app or traditional Privy)
        let signature = undefined;
        signature = connection.isConnectedWithCrossApp
            ? await signTypedDataWithCrossApp({
                  ...typedData,
                  address: connectedWallet?.address as `0x${string}`,
              } as SignTypedDataParameters)
            : (
                  await signTypedDataPrivy(typedData, {
                      uiOptions: {
                          title,
                          description,
                          buttonText,
                      },
                  })
              ).signature;
        // If the smart account is not deployed, deploy it first
        if (!smartAccount.isDeployed) {
            resultClauses.push(
                Clause.callFunction(
                    Address.of(
                        getConfig(network.type as NETWORK_TYPE).accountFactoryAddress,
                    ),
                    ABIContract.ofAbi(
                        SocialLoginSmartAccountFactory__factory.abi,
                    ).getFunction('createAccount'),
                    [connectedWallet?.address ?? ''],
                ),
            );
        }

        // Now the single batch execution call
        resultClauses.push(
            Clause.callFunction(
                Address.of(smartAccount.address ?? ''),
                ABIContract.ofAbi(
                    SocialLoginSmartAccount__factory.abi,
                ).getFunction('executeBatchWithAuthorization'),
                [
                    typedData.message.to,
                    typedData.message.value?.map((val) => BigInt(val)) ?? 0,
                    typedData.message.data,
                    BigInt(typedData.message.validAfter),
                    BigInt(typedData.message.validBefore),
                    typedData.message.nonce, // If your contract expects bytes32
                    signature as `0x${string}`,
                ],
            ),
        );
        return resultClauses;
    }
    return {
        buildClausesWithAuth,
    };
};
````

## Source: `packages/vechain-kit/src/hooks/utils/useCallClause.ts`

````typescript
import {
    executeCallClause,
    executeMultipleClausesCall,
    MultipleClausesCallParameters,
    ViewFunctionResult,
} from '@/utils';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useThor } from '@vechain/dapp-kit-react';
import { ThorClient } from '@vechain/sdk-network';
import {
    ExtractAbiFunctionNames,
    AbiParametersToPrimitiveTypes,
} from 'abitype';
import { Abi, ContractFunctionParameters } from 'viem';

export * from '@/utils/thorUtils';

type ExtractViewFunction<
    TAbi extends Abi,
    TMethod extends ExtractAbiFunctionNames<TAbi, 'pure' | 'view'>,
> = Extract<
    TAbi[number],
    { type: 'function'; stateMutability: 'pure' | 'view'; name: TMethod }
>;

export const getCallClauseQueryKey = <
    TAbi extends Abi,
    TMethod extends ExtractAbiFunctionNames<TAbi, 'pure' | 'view'>,
>({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    abi,
    address,
    method,
}: {
    abi: TAbi;
    address: string;
    method: TMethod;
}) => ['callClause', address, method];

/**
 * Serializes args for query key by converting BigInt values to strings
 * This prevents JSON.stringify errors when React Query serializes the query key
 */
const serializeArgsForQueryKey = (args: unknown[]): unknown[] => {
    return args.map((arg) => {
        if (typeof arg === 'bigint') {
            return arg.toString();
        }
        if (Array.isArray(arg)) {
            return serializeArgsForQueryKey(arg);
        }
        if (arg && typeof arg === 'object') {
            return Object.fromEntries(
                Object.entries(arg).map(([key, value]) => [
                    key,
                    typeof value === 'bigint' ? value.toString() : value,
                ]),
            );
        }
        return arg;
    });
};

export const getCallClauseQueryKeyWithArgs = <
    TAbi extends Abi,
    TMethod extends ExtractAbiFunctionNames<TAbi, 'pure' | 'view'>,
>({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    abi,
    address,
    method,
    args,
}: {
    abi: TAbi;
    address: string;
    method: TMethod;
    args?: AbiParametersToPrimitiveTypes<
        ExtractViewFunction<TAbi, TMethod>['inputs'],
        'inputs'
    >;
}) => [
    'callClause',
    address,
    method,
    ...(args?.length ? serializeArgsForQueryKey(args as unknown[]) : []),
];

export const useCallClause = <
    TAbi extends Abi,
    TMethod extends ExtractAbiFunctionNames<TAbi, 'pure' | 'view'>,
    TData = ViewFunctionResult<TAbi, TMethod>,
>({
    address,
    abi,
    method,
    args,
    queryOptions,
}: {
    address: string;
    abi: TAbi;
    method: TMethod;
    args: AbiParametersToPrimitiveTypes<
        ExtractViewFunction<TAbi, TMethod>['inputs'],
        'inputs'
    >;
    queryOptions?: Omit<
        UseQueryOptions<
            ViewFunctionResult<TAbi, TMethod>,
            unknown,
            TData,
            ReturnType<typeof getCallClauseQueryKeyWithArgs<TAbi, TMethod>>
        >,
        'queryKey' | 'queryFn'
    >;
}) => {
    const thor = useThor();

    return useQuery({
        queryKey: getCallClauseQueryKeyWithArgs({
            abi,
            address,
            method,
            args,
        }),
        queryFn: async () =>
            executeCallClause({
                thor,
                contractAddress: address,
                abi,
                method,
                args,
            }),
        ...queryOptions,
    });
};

export const useMultipleClausesCall = <
    contracts extends readonly ContractFunctionParameters[],
    allowFailure extends boolean = false,
>({
    thor,
    calls,
    queryKey,
    enabled = true,
}: {
    thor: ThorClient;
    calls: MultipleClausesCallParameters<contracts, allowFailure>;
    queryKey: string[];
    enabled?: boolean;
}) =>
    useQuery({
        queryKey,
        queryFn: () => executeMultipleClausesCall({ thor, calls }),
        enabled,
    });
````

## Source: `packages/vechain-kit/src/hooks/utils/useEvents.ts`

````typescript
import { useQuery } from '@tanstack/react-query';
import { EventLogs, FilterCriteria } from '@vechain/sdk-network';
import { useCallback, useMemo } from 'react';
import {
    Abi,
    ContractEventName,
    decodeEventLog as viemDecodeEventLog,
    Hex as ViemHex,
} from 'viem';
import { useThor } from '@vechain/dapp-kit-react';
import { getAllEventLogs } from '../thor';

type Topics = [] | [signature: ViemHex, ...args: ViemHex[]];

export const decodeEventLog = <TAbi extends Abi>(
    event: EventLogs,
    abi: TAbi,
): {
    meta: EventLogs['meta'];
    decodedData: ReturnType<typeof viemDecodeEventLog<TAbi>>;
} => {
    const decodedData = viemDecodeEventLog({
        abi,
        data: event.data.toString() as ViemHex,
        topics: event.topics.map((topic) => topic.toString()) as Topics,
    });

    return {
        meta: event.meta,
        decodedData,
    };
};

export type UseEventsParams<
    T extends Abi,
    K extends ContractEventName<T>,
    R,
> = {
    abi: T;
    contractAddress: string;
    eventName: K;
    filterParams?: Record<string, unknown> | unknown[] | undefined;
    mapResponse: ({
        meta,
        decodedData,
    }: {
        meta: EventLogs['meta'];
        decodedData: ReturnType<typeof viemDecodeEventLog<T, K>>;
    }) => R;
    nodeUrl: string;
};

export type GetEventsKeyParams = {
    eventName: string;
    filterParams?: object;
};

export const getEventsKey = ({
    eventName,
    filterParams,
}: GetEventsKeyParams) => {
    return [eventName, filterParams ? JSON.stringify(filterParams) : 'all'];
};

/**
 * Custom hook for fetching contract events.
 */
export const useEvents = <T extends Abi, K extends ContractEventName<T>, R>({
    abi,
    contractAddress,
    eventName,
    filterParams,
    mapResponse,
    nodeUrl,
}: UseEventsParams<T, K, R>) => {
    const thor = useThor();

    const queryFn = useCallback(async () => {
        if (!thor) return [];

        const eventAbi = thor.contracts
            .load(contractAddress, abi)
            .getEventAbi(eventName);
        const topics = eventAbi.encodeFilterTopicsNoNull(filterParams ?? {});

        // Construct filter criteria
        const filterCriteria: FilterCriteria[] = [
            {
                criteria: {
                    address: contractAddress,
                    topic0: topics[0] ?? undefined,
                    topic1: topics[1] ?? undefined,
                    topic2: topics[2] ?? undefined,
                    topic3: topics[3] ?? undefined,
                    topic4: topics[4] ?? undefined,
                },
                eventAbi,
            },
        ];

        const events = (
            await getAllEventLogs({ thor, nodeUrl, filterCriteria })
        ).map((event) => decodeEventLog(event, abi));

        if (
            events.some(
                ({ decodedData }) => decodedData.eventName !== eventName,
            )
        )
            throw new Error(`Unknown event`);

        return events.map((event) =>
            mapResponse({
                meta: event.meta,
                decodedData: event.decodedData as ReturnType<
                    typeof viemDecodeEventLog<T, K>
                >,
            }),
        );
    }, [
        thor,
        contractAddress,
        abi,
        eventName,
        filterParams,
        mapResponse,
        nodeUrl,
    ]);

    const queryKey = useMemo(
        () => getEventsKey({ eventName, filterParams }),
        [eventName, filterParams],
    );

    return useQuery({
        queryFn,
        queryKey,
        enabled: !!thor,
    });
};
````

## Source: `packages/vechain-kit/src/hooks/utils/useGetNodeUrl.ts`

````typescript
import { getConfig } from '@/config';
import { useVeChainKitConfig } from '@/providers';

export const useGetNodeUrl = () => {
    const { network } = useVeChainKitConfig();
    // If user has set a nodeUrl, use it, otherwise use the default nodeUrl for the network
    return network.nodeUrl ?? getConfig(network.type).nodeUrl;
};
````
