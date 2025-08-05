import { useMemo } from 'react';
import { useWallet } from '@/hooks';
import { usePrivyCrossAppSdk } from '@/providers/PrivyCrossAppProvider';
import { usePrivy, SignTypedDataParams } from '@privy-io/react-auth';
import { useVeChainKitConfig } from '@/providers';
import { useSmartAccount } from '@/hooks';
import { SignTypedDataParameters } from '@wagmi/core';

export interface ClauseBuilderDependencies {
    connection: { isConnectedWithCrossApp: boolean };
    connectedWallet: { address: string };
    signTypedDataWithCrossApp: (data: SignTypedDataParameters) => Promise<string>;
    signTypedDataPrivy: (data: SignTypedDataParams, options?: { uiOptions?: { title?: string, description?: string, buttonText?: string } }) => Promise<{ signature: string }>;
    network: { type: string };
    smartAccount: { isDeployed: boolean; address: string };
}

const isValidSmartAccount = (account: any): account is { isDeployed: boolean; address: string } => {
    return account && typeof account.isDeployed === 'boolean' && typeof account.address === 'string';
};

export const useBuildExecWithAuthClauses = (): ClauseBuilderDependencies => {
    const { connection, connectedWallet } = useWallet();
    const { signTypedData: signTypedDataWithCrossApp } = usePrivyCrossAppSdk();
    const { signTypedData: signTypedDataPrivy } = usePrivy();
    const { network } = useVeChainKitConfig();
    const { data: smartAccountData } = useSmartAccount(
        connectedWallet?.address ?? '',
    );

    const defaultSmartAccount: ClauseBuilderDependencies['smartAccount'] = {
        isDeployed: false,
        address: '',
    };

    const smartAccount: ClauseBuilderDependencies['smartAccount'] = 
        isValidSmartAccount(smartAccountData) ? smartAccountData : defaultSmartAccount;

    return useMemo(() => ({
        connection: {
            isConnectedWithCrossApp: connection.isConnectedWithCrossApp,
        },
        connectedWallet: {
            address: connectedWallet?.address ?? '',
        },
        signTypedDataWithCrossApp,
        signTypedDataPrivy: signTypedDataPrivy as unknown as ClauseBuilderDependencies['signTypedDataPrivy'],
        network,
        smartAccount,
    }), [connection.isConnectedWithCrossApp, connectedWallet?.address, signTypedDataWithCrossApp, signTypedDataPrivy, network, smartAccount]);
};

