'use client';

import React, { createContext, useContext } from 'react';
import { SignTypedDataParams, usePrivy } from '@privy-io/react-auth';
import { encodeFunctionData } from 'viem';
import { Hex, ABIContract, Address, Clause , Secp256k1, HexUInt , networkInfo, TransactionBody, Transaction } from '@vechain/sdk-core';
import * as nc_utils from '@noble/curves/abstract/utils';

import {
    ThorClient,
    VeChainProvider,
    ProviderInternalBaseWallet,
    signerUtils,
} from '@vechain/sdk-network';
import { SimpleAccountABI, SimpleAccountFactoryABI } from '../assets';
import { randomTransactionUser } from '../utils';
import {
    EnhancedClause,
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
import { ERC20_ABI } from '@vechain/sdk-core';

const B3TR_TOKEN_ADDRESS = {
    mainnet: '0x5ef79995FE8a89e0812330E4378eB2660ceDe699',
    testnet: '0xbf64cf86894Ee0877C4e7d03936e35Ee8D8b864F',
    solo: null,
};
const GAS_PRICE_VTHO = 1e-5; // 1 gas = 0,00001 vtho

export interface PrivyWalletProviderContextType {
    accountFactory: string;
    delegateAllTransactions: boolean;
    sendTransaction: (tx: {
        txClauses: Connex.VM.Clause[];
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
    }

    async function buildAugmentedBatchAuthorizationTypedData({
        clauses,
        chainId,
        verifyingContract,
        depositAddress,
        genericDelegatorRates,
    }: {
        clauses: Connex.VM.Clause[];
        chainId: number;
        verifyingContract: string;
        depositAddress: string;
        genericDelegatorRates: { b3trRate: number; serviceFee: number };
    }): Promise<ExecuteBatchWithAuthorizationSignData> {
        const tempClauses = [...clauses];
        tempClauses.push({
            to: "0xbf64cf86894Ee0877C4e7d03936e35Ee8D8b864F",
            value: 0,
            data: encodeFunctionData({
                abi: ERC20_ABI,
                functionName: 'transfer',
                args: [
                    Address.of(depositAddress).toString(), 
                    999999999999999999n
                ],
            }),
        });

        const tempTypedData = buildBatchAuthorizationTypedData({
            clauses: tempClauses,
            chainId,
            verifyingContract,
        });

        tempClauses.push(
            Clause.callFunction(
                Address.of(verifyingContract),
                ABIContract.ofAbi(SimpleAccountABI).getFunction(
                    'executeBatchWithAuthorization',
                ),
                [
                    tempTypedData.message.to,
                    tempTypedData.message.value?.map((val) => BigInt(val)) ?? [],
                    tempTypedData.message.data,
                    BigInt(tempTypedData.message.validAfter),
                    BigInt(tempTypedData.message.validBefore),
                    tempTypedData.message.nonce,
                    `0xf18421b058fed7db78f52fd26723bc6a2b84b915148f08faff985b58efae508245378ebadeaf408c2724280ef39bb07577ec5d43f13b831d8605e0566ff7665e1c`, // dummy signature
                ],
            ),
        );

        const sanitizedTempClauses = tempClauses.map((clause) => ({
            ...clause,
            data: clause.data || '0x', // Default to '0x' if data is undefined
        }));
        const gasResult = await thor.gas.estimateGas(sanitizedTempClauses, depositAddress, 
            {
                gasPadding: genericDelegatorRates.serviceFee,
            },
        );
        const gasInB3tr =
            genericDelegatorRates.b3trRate *
            (1 + genericDelegatorRates.serviceFee) *
            gasResult.totalGas;

        clauses.push({
            to: B3TR_TOKEN_ADDRESS.testnet,
            value: 0,
            data: encodeFunctionData({
                abi: ERC20_ABI,
                functionName: 'transfer',
                args: [depositAddress, BigInt(Math.ceil(gasInB3tr * 1e18 * 1e-5))],
            }),
        });

        return buildBatchAuthorizationTypedData({
            clauses: clauses.map((clause) => ({
                ...clause,
                data: clause.data || '0x', // Default to '0x' if data is undefined
            })),
            chainId,
            verifyingContract,
        });
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
        txClauses: Connex.VM.Clause[];
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
        
        const depositResponse = await callGetDepositAddress();
        if (!depositResponse) {
            throw new Error('Failed to contact the generic delegator.');
        }
        
        const genericDelegatorRates = await callEstimate(txClauses);
        if (!genericDelegatorRates) {
            throw new Error('Failed to contact the generic delegator.');
        }
        
        // If the smart account was never deployed or the version is >= 3 and we have multiple clauses, we can batch them
        if (
            !hasV1SmartAccount ||
            (smartAccountVersion && smartAccountVersion >= 3)
        ) {
            const typedData = await buildAugmentedBatchAuthorizationTypedData({
                clauses: txClauses,
                chainId: chainId as unknown as number,
                verifyingContract: smartAccount.address,
                depositAddress: depositResponse.depositAccount,
                genericDelegatorRates: genericDelegatorRates as EstimateResponse,
            });
            

            // Sign the typed data (either cross-app or traditional Privy)
            const signature = connection.isConnectedWithCrossApp
                ? await signTypedDataWithCrossApp({
                    ...typedData,
                    address: connectedWallet.address as `0x${string}`,
                } as SignTypedDataParameters)
                : (
                      await signTypedDataPrivy(await typedData, {
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
            // TODO: handle this

            // Now the single batch execution call
            clauses.push(
                Clause.callFunction(
                    Address.of(smartAccount.address),
                    ABIContract.ofAbi(SimpleAccountABI).getFunction(
                        'executeBatchWithAuthorization',
                    ),
                    [
                        (await typedData).message.to,
                        (await typedData).message.value?.map((val) => BigInt(val)) ?? 0,
                        (await typedData).message.data,
                        BigInt((await typedData).message.validAfter),
                        BigInt((await typedData).message.validBefore),
                        (await typedData).message.nonce, // If your contract expects bytes32
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
        );

        const parsedGasLimit = Math.max(
            Math.ceil(gasResult.totalGas),
            suggestedMaxGas ?? 0,
        );

        // build the transaction in VeChain format, with delegation enabled
        const txBody = await thor.transactions.buildTransactionBody(
            clauses,
            parsedGasLimit,
            { isDelegated: true },
        );

        // sign the transaction and request the fee delegator to pay the gas fees in the process
        /*const wallet = new ProviderInternalBaseWallet(
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
        */
        const unsignedTx = Transaction.of(txBody);
        
        const gasPayerResponse = await callDelegateAuthorized(Hex.of(unsignedTx.encoded).toString(), randomTransactionUser.address);

        if (gasPayerResponse) {
            // Use the raw value for the next step - TODO take the raw body that was originally sent instead ( to avoid changes in the payload by the gd)
            const tx_body = decodeRawTx(gasPayerResponse.raw);
            
            const validTx = signFinalTransaction(tx_body,randomTransactionUser.privateKey.slice(2),gasPayerResponse.signature);
            
            // send the signed transaction using the SDK
            const txResponse = await (async () => {
                try {
                    const result = await thor.transactions.sendTransaction(validTx);
                    return result; // Assuming `sendTransaction` returns an object with `id`
                } catch (error) {
                    console.error("Error sending the transaction:", error);
                    throw error;
                }
            })();

            console.log("Transaction ID:", txResponse.id);  
            return txResponse.id;  
        } else {
            console.error("No raw field found in response");
            return  "";
        }
        
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

function signFinalTransaction(decodedTx: Transaction, privateKey: string , signature: string) {
    const txHash = Transaction.of(decodedTx.body).getTransactionHash();
    return Transaction.of( 
        decodedTx.body, 
        nc_utils.concatBytes(
            Secp256k1.sign(
                txHash.bytes,
                typeof privateKey === 'string'
                    ? Uint8Array.from(Buffer.from(privateKey, 'hex'))
                    : privateKey
            ),
            HexUInt.of(signature.slice(2)).bytes
        )
    )
}

/**
 * Decodes a raw transaction in the format returned by the generic delegator.
 * @param raw Raw transaction returned by the generic delegator.
 * @returns Decoded transaction.
 */
function decodeRawTx(raw: string) {
    console.log(raw);
    return Transaction.decode(
        HexUInt.of(raw.slice(2)).bytes,
        false
    );
}

const options = {
    maxGasPriceCoef : 0.3,
    expiration : 0,
    dependsOn : null,
    network : "testnet",
    token : {
        symbol : "B3TR",
        address : {
            mainnet: "0x5ef79995FE8a89e0812330E4378eB2660ceDe699",
            testnet: "0xbf64cf86894Ee0877C4e7d03936e35Ee8D8b864F",
            solo: null
        }
    },
    genericDelegatorBaseUrl : "http://localhost:3000/"
    //genericDelegatorBaseUrl : "https://genericdelegator.test.evearn.io/"
};


function getRawUnsignedTx(clauses: Connex.VM.Clause[],options: { maxGasPriceCoef?: number; expiration: any; dependsOn: any; network: any; token?: { symbol: string; address: { mainnet: string; testnet: string; solo: null; }; }; genericDelegatorBaseUrl?: string; }) {
    const body = {
        chainTag: networkInfo[options.network as keyof typeof networkInfo].chainTag,
        blockRef: '0x0000000000000000',
        expiration: options.expiration, 
        clauses,
        gasPriceCoef: 0, // won't be used
        gas: 1, // won't be used
        dependsOn: options.dependsOn,
        nonce: 12345678, // won't be used
        reserved: {
            features: 1 // set the transaction to be delegated
        }
    };

    //  Create the unsigned transaction
    // Ensure all clauses have a valid 'data' property
    const sanitizedClauses = clauses.map((clause) => ({
        ...clause,
        data: clause.data || '0x', // Default to '0x' if data is undefined
    }));

    const unsignedTx = Transaction.of({ ...body, clauses: sanitizedClauses });
    return Hex.of(unsignedTx.encoded).toString() ;    
}

// Request the generic delegator to pay that with B3TR
    /**
     * Send a request to the generic delegator to sponsor the gas cost of a transaction in exchange
     * of a token payment.
     * @param rawUnsignedTx The raw transaction to delegate.
     * @param senderAddress The address of the origin/sender of the transaction.
     * @param tokenSymbol The symbol of the token to use to pay for the gas.
     * @returns The response from the generic delegator (raw, signature, address).
     */
interface DelegateRequestBody {
    raw: string;
    origin: string;
}

interface DelegateResponse {
    raw: string;
    signature: string;
    address: string;
}

async function callDelegate(
    rawUnsignedTx: string,
    senderAddress: string,
    tokenSymbol: string
): Promise<DelegateResponse | undefined> {
    const requestBody: DelegateRequestBody = {
        raw: rawUnsignedTx,
        origin: senderAddress,
    };

    const requestOptions: RequestInit = {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
        redirect: 'follow' as RequestRedirect,
    };

    try {
        const response = await fetch(
            `${options.genericDelegatorBaseUrl}delegator/delegate/${tokenSymbol}`,
            requestOptions
        );
        return await response.json();
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

interface EstimateResponse {
    gasEstimated: number;
    vetCost: number;
    vetRate: number;
    b3trCost: number;
    b3trRate: number;
    serviceFee: number;
}


async function callEstimate(clauses: Connex.VM.Clause[]): Promise<EstimateResponse | undefined> {

    const sanitizedClauses = clauses.map((clause) => ({
        to: clause.to || '0x', // Default to '0x' if to is undefined
        value: clause.value ? clause.value.toString() : 0, // Convert BigInt to string --??
        data: clause.data || '0x', // Default to '0x' if data is undefined
    }));
    const signer = "0x435933c8064b4Ae76bE665428e0307eF2cCFBD68"; // dummy signer address

    const requestOptions: RequestInit = {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clauses: sanitizedClauses, signer: signer }),
        redirect: 'follow' as RequestRedirect,
    };

    try {
        const response = await fetch(
            `${options.genericDelegatorBaseUrl}delegator/estimate`,
            requestOptions
        );
        return await response.json();
    } catch (error) {
        console.error("Fetch error:", error);
    }
    return undefined;
}

async function callGetDepositAddress(): Promise<string | undefined> {
    const requestOptions: RequestInit = {
        method: "GET",
        headers: { 'Content-Type': 'application/json' },
        redirect: 'follow' as RequestRedirect,
    };
    try {
        const response = await fetch(
            `${options.genericDelegatorBaseUrl}delegator/deposit-account`,
            requestOptions
        );
        return await response.json();
    }
    catch (error) {
        console.error("Fetch error:", error);
    }
    return undefined;
}   

// Request the generic delegator to pay that with B3TR
async function callDelegateAuthorized (rawUnsignedTx: string, _senderAddress: string) {

    const requestBody = {
        raw: rawUnsignedTx ,
        origin: _senderAddress
    }

    const requestOptions = {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(requestBody),
        redirect: 'follow' as RequestRedirect
    };
    
    try {
        const response = await fetch(options.genericDelegatorBaseUrl + "delegator/delegate-authorized/" + options.token.symbol , requestOptions);
        return await response.json();
    } catch (error) {
        console.error("Fetch error:", error);
    }
}