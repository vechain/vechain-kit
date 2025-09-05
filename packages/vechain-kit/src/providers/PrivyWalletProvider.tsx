'use client';

import React, { createContext, useContext } from 'react';
import { SignTypedDataParams, usePrivy } from '@privy-io/react-auth';
import { encodeFunctionData, parseEther } from 'viem';
import { Transaction, Hex, HexUInt } from '@vechain/sdk-core';
import {
    ThorClient,
    VeChainProvider,
    ProviderInternalBaseWallet,
    signerUtils,
} from '@vechain/sdk-network';
import { randomTransactionUser } from '../utils';
import {
    EnhancedClause,
    ExecuteBatchWithAuthorizationSignData,
    ExecuteWithAuthorizationSignData,
    GasTokenType,
    TransactionSpeed,
    DepositAccount,
    EstimationResponse,
    SUPPORTED_GAS_TOKENS
} from '@/types';
import {
    useSmartAccount,
    useWallet,
    estimateGas,
    getDepositAccount,
    delegateAuthorized,
    signVip191Transaction,
    useBuildExecWithAuthClauses,
    useHasV1SmartAccount,
} from '@/hooks';
import { getConfig } from '@/config';
import { useVeChainKitConfig } from './VeChainKitProvider';
import { usePrivyCrossAppSdk } from './PrivyCrossAppProvider';
import { SignTypedDataParameters } from '@wagmi/core';
import { ethers } from 'ethers';
import { ERC20__factory } from '@/contracts/typechain-types';
import { buildClauses } from '@/utils/clauseBuilder';
import { useGetChainId, useSmartAccountVersion } from '@/hooks';

export interface PrivyWalletProviderContextType {
    accountFactory: string;
    delegateAllTransactions: boolean;
    sendTransaction: (tx: {
        txClauses: Connex.VM.Clause[];
        title?: string;
        description?: string;
        buttonText?: string;
        suggestedMaxGas?: number;
        currentGasToken?: GasTokenType;
    }) => Promise<string>;
    signTypedData: (data: SignTypedDataParams) => Promise<string>;
    signMessage: (message: string) => Promise<string>;
    exportWallet: () => Promise<void>;
}

const PrivyWalletProviderContext =
    createContext<PrivyWalletProviderContextType | null>(null);


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
    clauses: Connex.VM.Clause[];
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
};

/**
 * Build the typed data structure for executeWithAuthorization
 * @param clause - The clause to sign
 * @param chainId - The chain id
 * @param verifyingContract - The address of the smart account
 * @returns The typed data structure for executeWithAuthorization
 */
export function buildSingleAuthorizationTypedData({
    clause,
    chainId,
    verifyingContract,
}: {
    clause: Connex.VM.Clause;
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
};

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
    const { data: smartAccount } = useSmartAccount(
        connectedWallet?.address ?? '',
    );
    const { data: chainId } = useGetChainId();
    const { data: smartAccountVersion } = useSmartAccountVersion(
        smartAccount?.address ?? '',
        connectedWallet?.address ?? '',
    );
    const { data: hasV1SmartAccount } = useHasV1SmartAccount(
        connectedWallet?.address ?? '',
    );
    const clauseBuilderDeps = useBuildExecWithAuthClauses();

    const thor = ThorClient.at(nodeUrl);

    const ERC20Interface = ERC20__factory.createInterface();

    function decodeRawTx(raw: any, isSigned: boolean) {
        return Transaction.decode(
            HexUInt.of(raw.slice(2)).bytes,
            isSigned
        );
    }

    // Helper to estimate gas and build transaction body
    const estimateAndBuildTxBody = async (
        clauses: any[],
        suggestedMaxGas: number | undefined,
        useGenericDelegator: boolean,
        isDelegated: boolean
    ) => {
        const gasResult = await thor.gas.estimateGas(
            clauses,
            connectedWallet?.address ?? '',
            { gasPadding: 1 }
        );
        const parsedGasLimit = useGenericDelegator ? suggestedMaxGas ?? 0 : Math.max(
            gasResult.totalGas,
            suggestedMaxGas ?? 0,
        );

        if (!isDelegated) {
            return await thor.transactions.buildTransactionBody(
                clauses,
                parsedGasLimit,
            );
        }

        return await thor.transactions.buildTransactionBody(
            clauses,
            parsedGasLimit,
            { isDelegated: isDelegated }
        );
    };

    // Helper to sign and publish transaction
    const signAndPublish = async (
        txBody: any,
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
            { gasPayer: { gasPayerServiceUrl: delegatorUrl } },
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

    const sendTransaction = async ({
        txClauses = [],
        title = 'Sign Transaction',
        description,
        buttonText = 'Sign',
        suggestedMaxGas,
        currentGasToken,
        speed = 'medium',
    }: {
        txClauses: Connex.VM.Clause[];
        title?: string;
        description?: string;
        buttonText?: string;
        suggestedMaxGas?: number;
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

        let clauses = await buildClauses({ // initial transfer to chosen address clause
            clauses: txClauses,
            chainId: chainId as unknown as number,
            verifyingContract: smartAccount.address,
            version: !hasV1SmartAccount ? smartAccountVersion : 1,
            title,
            isEstimation: false,
            description,
            buttonText,
            dependencies: clauseBuilderDeps,
        });

        if (currentGasToken) {
            const gasEstimationResponse: EstimationResponse = await estimateGas(smartAccount.address, delegatorUrl, clauses, currentGasToken, speed);

            const depositAccount: DepositAccount = await getDepositAccount(delegatorUrl);

            const transferToGenericDelegatorClause = {
                to: currentGasToken === 'VET' ? depositAccount.depositAccount : SUPPORTED_GAS_TOKENS[currentGasToken as GasTokenType].address,
                value: currentGasToken === 'VET' ? parseEther(gasEstimationResponse.transactionCost?.toString() ?? '0').toString() : '0x0',
                data: currentGasToken === 'VET' ? '0x' : ERC20Interface.encodeFunctionData('transfer', [
                    depositAccount.depositAccount,
                    parseEther(gasEstimationResponse.transactionCost?.toString() ?? '0'),
                ]),
                comment: `Transfer ${gasEstimationResponse.transactionCost} ${currentGasToken} to ${depositAccount.depositAccount}`,
                abi: currentGasToken === 'VET' ? undefined : ERC20Interface.getFunction('transfer'),
            };

            const finalExecuteWithAuthorizationClauses = await buildClauses({
                clauses: [...txClauses, transferToGenericDelegatorClause as EnhancedClause],
                chainId: chainId as unknown as number,
                verifyingContract: smartAccount.address,
                version: !hasV1SmartAccount ? smartAccountVersion : 1,
                title,
                isEstimation: false,
                dontAddCreateAccountClause: true,
                description,
                buttonText,
                dependencies: clauseBuilderDeps,
            });

            clauses = [...finalExecuteWithAuthorizationClauses];

            const estimatedGas = gasEstimationResponse.estimatedGas ?? 0;

            const txBody = await estimateAndBuildTxBody(
                clauses,
                estimatedGas,
                true,
                true
            );

            const rawUnsignedTx = Hex.of(Transaction.of(txBody).encoded).toString();

            const gasPayerResponse: {
                signature: string;
                address: string;
                raw: string;
                origin: string;
            } = await delegateAuthorized(rawUnsignedTx, randomTransactionUser.address, currentGasToken, delegatorUrl);


            const decodedTx = decodeRawTx(gasPayerResponse.raw, false);

            const finalTxSigned = signVip191Transaction(decodedTx, randomTransactionUser.privateKey, gasPayerResponse.signature);

            const simulatedTransaction = {
                clauses: clauses,
                simulateTransactionOptions: {
                    caller: smartAccount.address,
                    gasPayer: gasPayerResponse.address,
                }
            };

            const simulatedTx1 = await thor.transactions.simulateTransaction(
                simulatedTransaction.clauses,
                {
                    ...simulatedTransaction.simulateTransactionOptions
                }
            );

            for (let i = 0; i < simulatedTx1.length; i++) {
                if (simulatedTx1[i].reverted) {
                    throw new Error(simulatedTx1[i].vmError);
                }
            }
            // Send the transaction
            const sendTransactionResult = await thor.transactions.sendTransaction(finalTxSigned);
    
            return sendTransactionResult.id;
        }

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

        for (let i = 0; i < simulatedTx1.length; i++) {
            if (simulatedTx1[i].reverted) {
                return simulatedTx1[i].vmError;
            }
        }
        
         // For VTHO or no gas token specified
         const txBody = await estimateAndBuildTxBody(
            clauses,
            suggestedMaxGas,
            false,
            true
        );

        return await signAndPublish(
            txBody,
        );
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
