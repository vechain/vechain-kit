import { useCallback } from 'react';
import { SimpleAccount__factory } from '@hooks/contracts';
import {
    useSendTransaction,
    UseSendTransactionReturnValue,
    useAccountImplementationAddress,
    useRefreshFactoryQueries,
    useRefreshSmartAccountQueries,
} from '@/hooks';
import { humanAddress, isValidAddress } from '@/utils';
import { TransactionClause } from '@vechain/sdk-core';

type UseUpgradeSmartAccountVersionProps = {
    smartAccountAddress: string;
    targetVersion: number;
    onSuccess?: () => void;
    onError?: () => void;
};

type UseUpgradeSmartAccountVersionReturnValue = {
    sendTransaction: () => Promise<void>;
} & Omit<UseSendTransactionReturnValue, 'sendTransaction'>;

const simpleAccountInterface = SimpleAccount__factory.createInterface();

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
                data: simpleAccountInterface.encodeFunctionData(
                    'upgradeToAndCall',
                    [newImplementationAddress, '0x'],
                ),
                comment: `Upgrade account to version ${targetVersion}`,
                abi: simpleAccountInterface
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
