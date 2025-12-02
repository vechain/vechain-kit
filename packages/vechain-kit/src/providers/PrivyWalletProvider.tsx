'use client';

import React, { createContext, useContext, useCallback } from 'react';
import { SignTypedDataParams, usePrivy } from '@privy-io/react-auth';
import { TransactionBody, TransactionClause } from '@vechain/sdk-core';
import {
    ThorClient,
    VeChainProvider,
    ProviderInternalBaseWallet,
    signerUtils,
} from '@vechain/sdk-network';
import { getGenericDelegatorUrl, randomTransactionUser } from '../utils';
import {
    GasTokenType,
    TransactionSpeed,
} from '@/types';
import {
    useSmartAccount,
    useWallet,
    useGenericDelegator,
    useHasV1SmartAccount,
    SmartAccountReturnType,
    estimateAndBuildTxBody,
    useBuildClauses,
    useGetAccountVersion,
} from '@/hooks';
import { getConfig } from '@/config';
import { useVeChainKitConfig } from './VeChainKitProvider';
import { usePrivyCrossAppSdk } from './PrivyCrossAppProvider';
import { SignTypedDataParameters } from '@wagmi/core';

export interface PrivyWalletProviderContextType {
    accountFactory: string;
    delegateAllTransactions: boolean;
    sendTransaction: (tx: {
        txClauses: TransactionClause[];
        title?: string;
        description?: string;
        buttonText?: string;
        currentGasToken?: GasTokenType;
        dAppSponsoredUrl?: string;
    }) => Promise<string>;
    signTypedData: (data: SignTypedDataParams) => Promise<string>;
    signMessage: (message: string) => Promise<string>;
    exportWallet: () => Promise<void>;
}

const PrivyWalletProviderContext =
    createContext<PrivyWalletProviderContextType | null>(null);

/**
 * This provider is responsible for retrieving the smart account address
 * of a Privy wallet and providing the necessary context for the smart account.
 * Upon initialization this provider will execute a few useEffect hooks to:
 * - retrieve the smart account address of the embedded wallet
 * - retrieve the chain id
 * - check if the smart account is deployed
 *
 * It also provides a function to send transactions on vechain by asking the privy wallet
 * to sign the transaction and then forwarding the transaction to the node api.
 * When sending a transaction this provider will check if the smart account is deployed and if not,
 * it will deploy it.
 */
export const PrivyWalletProvider = ({
    children,
    nodeUrl,
    delegatorUrl = getGenericDelegatorUrl(),
    delegateAllTransactions,
    genericDelegator,
}: {
    children: React.ReactNode;
    nodeUrl: string;
    delegatorUrl?: string;
    delegateAllTransactions: boolean;
    genericDelegator?: boolean;
}) => {
    const {
        signTypedData: signTypedDataPrivy,
        exportWallet,
        signMessage: signMessagePrivy,
    } = usePrivy();
    const {
        signTypedData: signTypedDataWithCrossApp,
        signMessage: signMessageWithCrossApp,
    } = usePrivyCrossAppSdk();
    const { connection, connectedWallet } = useWallet();
    const { network } = useVeChainKitConfig();
    const { data: smartAccount } = useSmartAccount(
        connectedWallet?.address ?? '',
    );
    const { data: smartAccountVersion } = useGetAccountVersion(
        smartAccount?.address ?? '',
        connectedWallet?.address ?? '',
    );
    const { data: hasV1SmartAccount } = useHasV1SmartAccount(
        connectedWallet?.address ?? '',
    );
    const { buildClausesWithAuth } = useBuildClauses();
    const { sendTransactionUsingGenericDelegator } = useGenericDelegator();

    const thor = ThorClient.at(nodeUrl);

    // Helper to sign and send transaction for regular fee delegation transactions
    const signAndSend = async (
        txBody: TransactionBody,
        dAppSponsoredUrl?: string,
        walletOverride?: any,
        signerOverride?: any
    ) => {
        if (!smartAccount?.address) {
            throw new Error('Smart account address is not set');
        }

        const walletToUse = walletOverride ?? new ProviderInternalBaseWallet(
            [
                {
                    privateKey: Buffer.from(
                        randomTransactionUser.privateKey.slice(2),
                        'hex',
                    ),
                    address: randomTransactionUser.address,
                },
            ],
            { gasPayer: { gasPayerServiceUrl: dAppSponsoredUrl ?? delegatorUrl } },
        );
        const provider = new VeChainProvider(
            thor,
            walletToUse,
            true
        );
        const signer = signerOverride ?? await provider.getSigner(
            randomTransactionUser.address,
        );
        const txInput = signerUtils.transactionBodyToTransactionRequestInput(
            txBody,
            randomTransactionUser.address,
        );
        const rawDelegateSigned = await signer.signTransaction(txInput);

        // publish the hexlified signed transaction directly on the node api
        const { id } = (await fetch(`${nodeUrl}/transactions`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                raw: rawDelegateSigned,
            }),
        }).then((res) => res.json())) as { id: string };

        return id;
    };

    /**
     * Sends a transaction on behalf of a smart account using either feeDelegation or genericDelegator
     * @param txClauses - The clauses to send in the transaction
     * @param title - The title of the transaction (used for the UI)
     * @param description - The description of the transaction
     * @param buttonText - The button text of the transaction (used for the UI)
     * @param currentGasToken - The current gas token for the transaction
     * @param speed - The speed of the transaction
     * @returns The id of the transaction
     **/

    const sendTransaction = useCallback(async ({
        txClauses = [],
        title = 'Sign Transaction',
        description,
        buttonText = 'Sign',
        dAppSponsoredUrl,
    }: {
        txClauses: TransactionClause[];
        title?: string;
        description?: string;
        buttonText?: string;
        dAppSponsoredUrl?: string;
        currentGasToken?: GasTokenType;
        speed?: TransactionSpeed;
    }): Promise<string> => {
        if (
            !smartAccount ||
            (smartAccount && !smartAccount.address) ||
            !connectedWallet ||
            (connectedWallet && !connectedWallet.address)
        ) {
            throw new Error('Address or embedded wallet is missing');
        }

        // if using generic delegator, use the useGenericDelegator hook, build the clauses, estimate the gas, build the tx body, sign and send, if dAppSponsored is undefined use the generic delegator
        if (genericDelegator && !dAppSponsoredUrl) {
            return await sendTransactionUsingGenericDelegator({
                clauses: txClauses,
                genericDelegatorUrl: delegatorUrl ?? '',
            });
        }

        // else send a regular delegated transaction using the feeDelegationUrl, default to v3 if no version is found so we build the executeBatchWithAuthorization clauses, else we build the executeWithAuthorization clauses for v1 smart accounts
        const clauses = await buildClausesWithAuth({
            clauses: txClauses,
            smartAccount: smartAccount as SmartAccountReturnType,
            version: !hasV1SmartAccount ? (smartAccountVersion?.version ?? 3) : 1,
            title,
            description,
            buttonText,
        });

        // set the simulated transaction options
        const simulatedTransaction = {
            clauses: clauses,
            simulateTransactionOptions: {
                caller:  randomTransactionUser.address
            }
        };

        const simulatedTx1 = await thor.transactions.simulateTransaction(
            simulatedTransaction.clauses,
            {
                ...simulatedTransaction.simulateTransactionOptions
            }
        );

        // check if the simulated transaction reverted
        for (let i = 0; i < simulatedTx1.length; i++) {
            if (simulatedTx1[i].reverted) {
                console.error(`simulatedTx1[i].vmError: ${simulatedTx1[i].vmError}`);
                return simulatedTx1[i].vmError;
            }
        }
        
         const txBody = await estimateAndBuildTxBody(
            clauses,
            thor,
            randomTransactionUser,
            true
        );

        return await signAndSend(
            txBody,
            dAppSponsoredUrl,
        );
    }, [
        sendTransactionUsingGenericDelegator,
        genericDelegator,
        smartAccount,
        connectedWallet,
        delegatorUrl,
        buildClausesWithAuth,
        hasV1SmartAccount,
        smartAccountVersion,
        thor,
    ]);

    /**
     * Sign a message using the VechainKit wallet
     * @param message - The message to sign
     * @returns The signature of the message
     */
    const signMessage = async (message: string): Promise<string> => {
        if (connection.isConnectedWithCrossApp) {
            return await signMessageWithCrossApp(message);
        }

        return (
            await signMessagePrivy({
                message,
            })
        ).signature;
    };

    /**
     * Sign a typed data using the VechainKit wallet
     * @param data - The typed data to sign
     * @returns The signature of the typed data
     */
    const signTypedData = async (
        data: SignTypedDataParams,
    ): Promise<string> => {
        if (connection.isConnectedWithCrossApp) {
            const mutableData = {
                ...data,
                address: connectedWallet?.address as `0x${string}`,
                types: Object.fromEntries(
                    Object.entries(data.types).map(([k, v]) => [k, [...v]]),
                ),
            } as unknown as SignTypedDataParameters & {
                address: `0x${string}`;
            };
            return await signTypedDataWithCrossApp(mutableData);
        }

        return (await signTypedDataPrivy(data)).signature;
    };

    return (
        <PrivyWalletProviderContext.Provider
            value={{
                accountFactory: getConfig(network.type).accountFactoryAddress,
                sendTransaction,
                signMessage,
                signTypedData,
                exportWallet,
                delegateAllTransactions,
            }}
        >
            {children}
        </PrivyWalletProviderContext.Provider>
    );
};

export const usePrivyWalletProvider = () => {
    const context = useContext(PrivyWalletProviderContext);
    if (!context) {
        throw new Error(
            'usePrivyWalletProvider must be used within a PrivyWalletProvider',
        );
    }
    return context;
};
