'use client';

import React, { createContext, useContext } from 'react';
import { SignTypedDataParams, usePrivy } from '@privy-io/react-auth';
import { encodeFunctionData } from 'viem';
import {
    ABIContract,
    Address,
    Clause,
    TransactionClause,
} from '@vechain/sdk-core';
import {
    ThorClient,
    VeChainProvider,
    ProviderInternalBaseWallet,
    signerUtils,
} from '@vechain/sdk-network';
import { SimpleAccountABI, SimpleAccountFactoryABI } from '../assets';
import { randomTransactionUser } from '../utils';
import {
    ExecuteBatchWithAuthorizationSignData,
    ExecuteWithAuthorizationSignData,
} from '@/types';
import {
    useGetChainId,
    useHasV1SmartAccount,
    useSmartAccount,
    useSmartAccountVersion,
    useWallet,
} from '@/hooks';
import { getConfig } from '@/config';
import { useVeChainKitConfig } from './VeChainKitProvider';
import { usePrivyCrossAppSdk } from './PrivyCrossAppProvider';
import { SignTypedDataParameters } from '@wagmi/core';
import { ethers } from 'ethers';

export interface PrivyWalletProviderContextType {
    accountFactory: string;
    delegateAllTransactions: boolean;
    sendTransaction: (tx: {
        txClauses: TransactionClause[];
        title?: string;
        description?: string;
        buttonText?: string;
        suggestedMaxGas?: number;
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
        connectedWallet?.address ?? '',
    );

    const { data: smartAccountVersion } = useSmartAccountVersion(
        smartAccount?.address ?? '',
    );

    const { data: hasV1SmartAccount } = useHasV1SmartAccount(
        connectedWallet?.address ?? '',
    );

    /**
     * Build the typed data structure for executeBatchWithAuthorization
     * @param clauses - The clauses to sign
     * @param chainId - The chain id
     * @param verifyingContract - The address of the smart account
     * @returns The typed data structure for executeBatchWithAuthorization
     */
    function buildBatchAuthorizationTypedData({
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
                verifyingContract,
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
    }

    /**
     * Build the typed data structure for executeWithAuthorization
     * @param clause - The clause to sign
     * @param chainId - The chain id
     * @param verifyingContract - The address of the smart account
     * @returns The typed data structure for executeWithAuthorization
     */
    function buildSingleAuthorizationTypedData({
        clause,
        chainId,
        verifyingContract,
    }: {
        clause: TransactionClause;
        chainId: number;
        verifyingContract: string;
    }): ExecuteWithAuthorizationSignData {
        return {
            domain: {
                name: 'Wallet',
                version: '1',
                chainId: chainId as unknown as number, // convert chainId to a number
                verifyingContract: verifyingContract,
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
    }

    /**
     * Send a transaction on vechain by asking the privy wallet to sign a typed data content
     * that will allow us the execute the action with his smart account through the executeWithAuthorization
     * function of the smart account.
     *
     * This function will do 3 things:
     * 1) Ask signature to the owner of the smart account (distinguishing between if smart account is v1 or v3)
     * - With v1 we will ask 1 signature request for each clause
     * - With v3 we will ask 1 signature request for the batch execution of all clauses
     * 2) After getting the signatures we rebuild the clauses to be broadcasted to the network
     * - If the smart account is not deployed, we add a clause to deploy it
     * 3) We then estimate the gas fees for the transaction and build the transaction body
     * 4) We sign the transaction with a random transaction user and request the fee delegator to pay the gas fees in the process
     * 5) We broadcast the transaction to the network
     */
    const sendTransaction = async ({
        txClauses = [],
        title = 'Sign Transaction',
        description,
        buttonText = 'Sign',
        suggestedMaxGas,
    }: {
        txClauses: TransactionClause[];
        title?: string;
        description?: string;
        buttonText?: string;
        suggestedMaxGas?: number;
    }): Promise<string> => {
        if (
            !smartAccount ||
            (smartAccount && !smartAccount.address) ||
            !connectedWallet ||
            (connectedWallet && !connectedWallet.address)
        ) {
            throw new Error('Address or embedded wallet is missing');
        }

        // Clauses for the transaction
        const clauses = [];

        // If the smart account was never deployed or the version is >= 3 and we have multiple clauses, we can batch them
        if (
            !hasV1SmartAccount ||
            (smartAccountVersion && smartAccountVersion >= 3)
        ) {
            const typedData = buildBatchAuthorizationTypedData({
                clauses: txClauses,
                chainId: chainId as unknown as number,
                verifyingContract: smartAccount.address,
            });

            // Sign the typed data (either cross-app or traditional Privy)
            const signature = connection.isConnectedWithCrossApp
                ? await signTypedDataWithCrossApp({
                      ...typedData,
                      address: connectedWallet.address as `0x${string}`,
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
                clauses.push(
                    Clause.callFunction(
                        Address.of(
                            getConfig(network.type).accountFactoryAddress,
                        ),
                        ABIContract.ofAbi(SimpleAccountFactoryABI).getFunction(
                            'createAccount',
                        ),
                        [connectedWallet.address ?? ''],
                    ),
                );
            }

            // Now the single batch execution call
            clauses.push(
                Clause.callFunction(
                    Address.of(smartAccount.address),
                    ABIContract.ofAbi(SimpleAccountABI).getFunction(
                        'executeBatchWithAuthorization',
                    ),
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
        } else {
            // Else, if it is a v1 smart account, we need to sign each clause individually
            const dataToSign: ExecuteWithAuthorizationSignData[] =
                txClauses.map((txData) =>
                    buildSingleAuthorizationTypedData({
                        clause: txData,
                        chainId: chainId as unknown as number,
                        verifyingContract: smartAccount.address,
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
                                (txClauses[index].comment ||
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
                clauses.push(
                    Clause.callFunction(
                        Address.of(
                            getConfig(network.type).accountFactoryAddress,
                        ),
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
        }

        // Now we can broadcast the transaction to the network by using our random transaction user

        // estimate the gas fees for the transaction
        const gasResult = await thor.gas.estimateGas(
            clauses,
            connectedWallet.address ?? '',
            {
                gasPadding: 1,
            },
        );

        const parsedGasLimit = Math.max(
            gasResult.totalGas,
            suggestedMaxGas ?? 0,
        );

        // build the transaction in VeChain format, with delegation enabled
        const txBody = await thor.transactions.buildTransactionBody(
            clauses,
            parsedGasLimit,
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
            {
                // TODO: kit-migration check if this is the correct way of passing delegator
                // delegator: {  delegatorUrl }
                gasPayer: { gasPayerServiceUrl: delegatorUrl },
            },
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
