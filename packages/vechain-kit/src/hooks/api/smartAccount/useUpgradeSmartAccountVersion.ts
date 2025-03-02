import { useCallback } from 'react';
import { SimpleAccount__factory } from '@/contracts/typechain-types';
import {
    useSendTransaction,
    UseSendTransactionReturnValue,
    useRefreshBalances,
} from '@/hooks';
import { humanAddress, isValidAddress } from '@/utils';
import { useSmartAccountImplementationAddress } from '@/hooks/api/smartAccount/useSmartAccountImplementationAddress';

type UseUpgradeSmartAccountVersionProps = {
    fromAddress: string;
    smartAccountAddress: string;
    targetVersion: number;
    onSuccess?: () => void;
    onError?: () => void;
};

type UseUpgradeSmartAccountVersionReturnValue = {
    sendTransaction: () => Promise<void>;
} & Omit<UseSendTransactionReturnValue, 'sendTransaction'>;

const simpleAccountInterface = SimpleAccount__factory.createInterface();

export const useUpgradeSmartAccountVersion = ({
    smartAccountAddress,
    targetVersion,
    onSuccess,
    onError,
}: UseUpgradeSmartAccountVersionProps): UseUpgradeSmartAccountVersionReturnValue => {
    const { refresh } = useRefreshBalances();

    // Fetch the new implementation address for the requested version
    const { data: newImplementationAddress } =
        useSmartAccountImplementationAddress(targetVersion);

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
                abi: simpleAccountInterface.getFunction('upgradeToAndCall'),
            },
        ];
    }, [smartAccountAddress, newImplementationAddress, targetVersion]);

    const handleOnSuccess = useCallback(async () => {
        await refresh();
        onSuccess?.();
    }, [refresh, onSuccess]);

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
