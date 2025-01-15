'use client';

import React, { createContext, useContext } from 'react';
import {
    useCrossAppAccounts,
    usePrivy,
    useWallets,
    type ConnectedWallet,
} from '@privy-io/react-auth';
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
import { ExecuteWithAuthorizationSignData } from '@/types';
import { useGetChainId, useSmartAccount } from '@/hooks';
import { getConfig } from '@/config';
import { useVeChainKitConfig } from './VeChainKit';

export interface PrivyWalletProviderContextType {
    embeddedWallet?: ConnectedWallet;
    accountFactory: string;
    delegateAllTransactions: boolean;
    sendTransaction: (tx: {
        txClauses: Connex.VM.Clause[];
        title?: string;
        description?: string;
        buttonText?: string;
    }) => Promise<string>;
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
    const { signTypedData, exportWallet, user } = usePrivy();
    const { signTypedData: signTypedDataCrossApp } = useCrossAppAccounts();
    const { wallets } = useWallets();
    const embeddedWallet = wallets.find(
        (wallet) => wallet.walletClientType === 'privy',
    );

    const { network } = useVeChainKitConfig();
    const { data: chainId } = useGetChainId();

    const thor = ThorClient.at(nodeUrl);

    const isCrossAppPrivyAccount = Boolean(
        user?.linkedAccounts?.some((account) => account.type === 'cross_app'),
    );

    const connectedAccount = isCrossAppPrivyAccount
        ? //@ts-ignore
          user?.linkedAccounts?.[0]?.embeddedWallets?.[0]?.address
        : //@ts-ignore
          user?.linkedAccounts?.[0]?.address ?? user?.wallet?.address;

    const { data: smartAccount } = useSmartAccount(connectedAccount);

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
    }: {
        txClauses: Connex.VM.Clause[];
        title?: string;
        description?: string;
        buttonText?: string;
    }): Promise<string> => {
        if (!smartAccount || !embeddedWallet || !connectedAccount) {
            throw new Error('Address or embedded wallet is missing');
        }

        // build the object to be signed, containing all information & instructions
        const dataToSign: ExecuteWithAuthorizationSignData[] = txClauses.map(
            (txData) => ({
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

                if (isCrossAppPrivyAccount) {
                    return signTypedDataCrossApp(data, {
                        address: connectedAccount,
                    });
                } else {
                    const funcData = txClause.data;
                    return (
                        await signTypedData(data, {
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
                }
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
                    [connectedAccount], // set the Privy wallet address as the owner of the smart account
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
            connectedAccount,
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

    return (
        <PrivyWalletProviderContext.Provider
            value={{
                accountFactory: getConfig(network.type).accountFactoryAddress,
                embeddedWallet,
                sendTransaction,
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
