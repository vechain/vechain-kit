import { SignTypedDataParameters } from "@wagmi/core";
import { encodeFunctionData } from "viem";
import { ethers } from "ethers";
import { EnhancedClause, ExecuteWithAuthorizationSignData, ExecuteBatchWithAuthorizationSignData } from "@/types";
import { Clause, Address, ABIContract, TransactionClause } from '@vechain/sdk-core';
import { SimpleAccountFactoryABI, SimpleAccountABI } from '@/assets';
import { getConfig } from '@/config';
import { usePrivy } from '@privy-io/react-auth';
import { NETWORK_TYPE } from '@/config/network';
import { usePrivyCrossAppSdk } from '@/providers/PrivyCrossAppProvider';
import { useWallet, SmartAccountReturnType, useGetChainId } from "@/hooks";
import { useVeChainKitConfig } from "@/providers";

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
                    ABIContract.ofAbi(SimpleAccountFactoryABI).getFunction(
                        'createAccount',
                    ),
                    [connectedWallet?.address ?? ''], // set the Privy wallet address as the owner of the smart account
                ),
            );
        }
    
        dataToSign.forEach((data, index) => {
            resultClauses.push(
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
                    ABIContract.ofAbi(SimpleAccountFactoryABI).getFunction(
                        'createAccount',
                    ),
                    [connectedWallet?.address ?? ''],
                ),
            );
        }
    
        // Now the single batch execution call
        resultClauses.push(
            Clause.callFunction(
                Address.of(smartAccount.address ?? ''),
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
        return resultClauses;
    }
    return {
        buildClausesWithAuth,
    };
};
