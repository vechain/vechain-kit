'use client';

import React, { createContext, useContext } from 'react';
import { SignTypedDataParams, usePrivy } from '@privy-io/react-auth';
import { encodeFunctionData } from 'viem';
import { ABIContract, Address, Clause } from '@vechain/sdk-core';
import {
    ThorClient,
    VeChainProvider,
    ProviderInternalBaseWallet,
    signerUtils,
} from '@vechain/sdk-network';
import { SimpleAccountABI, SimpleAccountFactoryABI } from '../assets';
import { randomTransactionUser } from '../utils';
import { EnhancedClause, ExecuteWithAuthorizationSignData } from '@/types';
import { useGetChainId, useSmartAccount, useWallet } from '@/hooks';
import { getConfig } from '@/config';
import { useVeChainKitConfig } from './VeChainKit';
import { usePrivyCrossAppSdk } from './PrivyCrossAppProvider';
import { SignTypedDataParameters } from '@wagmi/core';
import { TransactionProgress } from '@/types';

export interface PrivyWalletProviderContextType {
    accountFactory: string;
    delegateAllTransactions: boolean;
    sendTransaction: (tx: {
        txClauses: Connex.VM.Clause[];
        title?: string;
        description?: string;
        buttonText?: string;
        onProgress?: (progress: TransactionProgress) => void;
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
    delegatorUrl,
    delegateAllTransactions,
}: {
    children: React.ReactNode;
    nodeUrl: string;
    delegatorUrl: string;
    delegateAllTransactions: boolean;
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
    const { data: chainId } = useGetChainId();

    const thor = ThorClient.at(nodeUrl);

    const { data: smartAccount } = useSmartAccount(
        connectedWallet.address ?? '',
    );

    /**
     * Send a transaction on vechain by asking the privy wallet to sign a typed data content
     * that will allow us the execute the action with his smart account through the executeWithAuthorization
     * function of the smart account.
     */
    const sendTransaction = async ({
        txClauses = [],
        title = 'Sign Transaction',
        description,
        buttonText = 'Sign',
        onProgress,
    }: {
        txClauses: Connex.VM.Clause[];
        title?: string;
        description?: string;
        buttonText?: string;
        onProgress?: (progress: TransactionProgress) => void;
    }): Promise<string> => {
        if (
            !smartAccount ||
            (smartAccount && !smartAccount.address) ||
            !connectedWallet ||
            (connectedWallet && !connectedWallet.address)
        ) {
            throw new Error('Address or embedded wallet is missing');
        }

        // If using cross-app connection, handle clauses individually
        if (connection.isConnectedWithCrossApp) {
            let lastTxId = '';
            const totalSteps = txClauses.length;

            // Process clauses one by one
            for (let i = 0; i < txClauses.length; i++) {
                const txClause = txClauses[i];

                // Update progress with the comment if it exists
                onProgress?.({
                    currentStep: i + 1,
                    totalSteps,
                    currentStepDescription:
                        (txClause as EnhancedClause).comment ||
                        `Processing transaction ${i + 1} of ${totalSteps}`,
                });

                // Strip the comment before using the clause for the transaction
                const strippedClause = {
                    to: txClause.to,
                    value: txClause.value,
                    data: txClause.data,
                };

                const dataToSign: ExecuteWithAuthorizationSignData = {
                    domain: {
                        name: 'Wallet',
                        version: '1',
                        chainId: chainId as unknown as number,
                        verifyingContract: smartAccount.address,
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
                        validBefore: Math.floor(Date.now() / 1000) + 60,
                        to: strippedClause.to,
                        value: String(strippedClause.value),
                        data:
                            (typeof strippedClause.data === 'object' &&
                            'abi' in strippedClause.data
                                ? encodeFunctionData(strippedClause.data)
                                : strippedClause.data) || '0x',
                    },
                };

                const signature = await signTypedDataWithCrossApp({
                    ...dataToSign,
                    address: connectedWallet.address as `0x${string}`,
                } as SignTypedDataParameters);

                const clauses = [];

                // If smart account not deployed and this is the first clause, add deployment clause
                if (!smartAccount.isDeployed && !lastTxId) {
                    clauses.push(
                        Clause.callFunction(
                            Address.of(
                                getConfig(network.type).accountFactoryAddress,
                            ),
                            ABIContract.ofAbi(
                                SimpleAccountFactoryABI,
                            ).getFunction('createAccount'),
                            [connectedWallet.address ?? ''],
                        ),
                    );
                }

                // Add the execution clause
                clauses.push(
                    Clause.callFunction(
                        Address.of(smartAccount.address ?? ''),
                        ABIContract.ofAbi(SimpleAccountABI).getFunction(
                            'executeWithAuthorization',
                        ),
                        [
                            dataToSign.message.to as `0x${string}`,
                            BigInt(dataToSign.message.value),
                            dataToSign.message.data as `0x${string}`,
                            BigInt(dataToSign.message.validAfter),
                            BigInt(dataToSign.message.validBefore),
                            signature as `0x${string}`,
                        ],
                    ),
                );

                // Handle the transaction for this clause
                const gasResult = await thor.gas.estimateGas(
                    clauses,
                    connectedWallet.address ?? '',
                    {
                        gasPadding: 1,
                    },
                );

                const txBody = await thor.transactions.buildTransactionBody(
                    clauses,
                    gasResult.totalGas,
                    { isDelegated: true },
                );

                const wallet = new ProviderInternalBaseWallet(
                    [
                        {
                            privateKey: Buffer.from(
                                randomTransactionUser.privateKey.slice(2),
                                'hex',
                            ),
                            address: randomTransactionUser.address,
                        },
                    ],
                    { delegator: { delegatorUrl } },
                );

                const providerWithDelegationEnabled = new VeChainProvider(
                    thor,
                    wallet,
                    true,
                );
                const signer = await providerWithDelegationEnabled.getSigner(
                    randomTransactionUser.address,
                );
                const txInput =
                    signerUtils.transactionBodyToTransactionRequestInput(
                        txBody,
                        randomTransactionUser.address,
                    );
                const rawDelegateSigned = await signer!.signTransaction(
                    txInput,
                );

                const { id } = (await fetch(`${nodeUrl}/transactions`, {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json',
                    },
                    body: JSON.stringify({
                        raw: rawDelegateSigned,
                    }),
                }).then((res) => res.json())) as { id: string };

                lastTxId = id;
            }

            return lastTxId;
        }

        // Original code for non-cross-app connections
        const dataToSign: ExecuteWithAuthorizationSignData[] = txClauses.map(
            (txData) => ({
                domain: {
                    name: 'Wallet',
                    version: '1',
                    chainId: chainId as unknown as number, // convert chainId to a number
                    verifyingContract: smartAccount.address,
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
                    to: txData.to,
                    value: String(txData.value),
                    data:
                        (typeof txData.data === 'object' && 'abi' in txData.data
                            ? encodeFunctionData(txData.data)
                            : txData.data) || '0x',
                },
            }),
        );

        // request signatures using privy
        const signatures: string[] = await Promise.all(
            dataToSign.map(async (data, index) => {
                const txClause = txClauses[index];
                if (!txClause) {
                    throw new Error(
                        `Transaction clause at index ${index} is undefined`,
                    );
                }

                if (connection.isConnectedWithCrossApp) {
                    const mutableData = {
                        ...data,
                        address: connectedWallet.address as `0x${string}`,
                        types: Object.fromEntries(
                            Object.entries(data.types).map(([k, v]) => [
                                k,
                                [...v],
                            ]),
                        ),
                    } as unknown as SignTypedDataParameters & {
                        address: `0x${string}`;
                    };
                    return signTypedDataWithCrossApp(mutableData);
                }

                const funcData = txClause.data;
                return (
                    await signTypedDataPrivy(data, {
                        uiOptions: {
                            title,
                            description:
                                description ??
                                (typeof funcData === 'object' &&
                                funcData !== null &&
                                'functionName' in funcData
                                    ? (funcData as { functionName: string })
                                          .functionName
                                    : ' '),
                            buttonText,
                        },
                    })
                ).signature;
            }),
        );

        // start building the clauses for the transaction
        const clauses = [];

        // if the account smartAccountAddress has no code yet, it's not been deployed/created yet
        if (!smartAccount.isDeployed) {
            clauses.push(
                Clause.callFunction(
                    Address.of(getConfig(network.type).accountFactoryAddress),
                    ABIContract.ofAbi(SimpleAccountFactoryABI).getFunction(
                        'createAccount',
                    ),
                    [connectedWallet.address ?? ''], // set the Privy wallet address as the owner of the smart account
                ),
            );
        }

        dataToSign.forEach((data, index) => {
            clauses.push(
                Clause.callFunction(
                    Address.of(smartAccount.address ?? ''),
                    ABIContract.ofAbi(SimpleAccountABI).getFunction(
                        'executeWithAuthorization',
                    ),
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

        // estimate the gas fees for the transaction
        const gasResult = await thor.gas.estimateGas(
            clauses,
            connectedWallet.address ?? '',
            {
                gasPadding: 1,
            },
        );

        // build the transaction in VeChain format, with delegation enabled
        const txBody = await thor.transactions.buildTransactionBody(
            clauses,
            gasResult.totalGas,
            { isDelegated: true },
        );

        // sign the transaction and request the fee delegator to pay the gas fees in the process
        const wallet = new ProviderInternalBaseWallet(
            [
                {
                    privateKey: Buffer.from(
                        randomTransactionUser.privateKey.slice(2),
                        'hex',
                    ),
                    address: randomTransactionUser.address,
                },
            ],
            { delegator: { delegatorUrl } },
        );
        const providerWithDelegationEnabled = new VeChainProvider(
            thor,
            wallet,
            true,
        );
        const signer = await providerWithDelegationEnabled.getSigner(
            randomTransactionUser.address,
        );
        const txInput = signerUtils.transactionBodyToTransactionRequestInput(
            txBody,
            randomTransactionUser.address,
        );
        const rawDelegateSigned = await signer!.signTransaction(txInput);

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
                address: connectedWallet.address as `0x${string}`,
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
