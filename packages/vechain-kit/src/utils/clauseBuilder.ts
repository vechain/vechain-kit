import { SignTypedDataParameters } from "@wagmi/core";
import { EnhancedClause, ExecuteWithAuthorizationSignData } from "@/types";
import { buildBatchAuthorizationTypedData, buildSingleAuthorizationTypedData } from "@/providers/PrivyWalletProvider";
import { Clause, Address, ABIContract } from '@vechain/sdk-core';
import { SimpleAccountFactoryABI, SimpleAccountABI } from '@/assets';
import { getConfig } from '@/config';
import { SignTypedDataParams } from '@privy-io/react-auth';
import { ClauseBuilderDependencies } from '@/hooks/utils/useBuildExecWithAuthClauses';
import { NETWORK_TYPE } from '@/config/network';

export interface BuildClausesParams {
    clauses: EnhancedClause[];
    chainId: number;
    verifyingContract: string;
    version: number | undefined;
    title?: string;
    description?: string;
    buttonText?: string;
    isEstimation?: boolean;
    dontAddCreateAccountClause?: boolean;
    dependencies: ClauseBuilderDependencies;
}

export async function buildSingleExecuteWithAuthorizationClauses(params: BuildClausesParams) {
    const {
        clauses: txClauses,
        chainId,
        verifyingContract,
        title,
        description,
        buttonText,
        isEstimation = false,
        dontAddCreateAccountClause = false,
        dependencies: {
            connection,
            connectedWallet,
            signTypedDataWithCrossApp,
            signTypedDataPrivy,
            network,
            smartAccount,
        },
    } = params;

    const resultClauses = [];
    
    const dataToSign: ExecuteWithAuthorizationSignData[] =
        txClauses.map((txData: EnhancedClause) =>
            buildSingleAuthorizationTypedData({
                clause: txData,
                chainId: chainId as unknown as number,
                verifyingContract: verifyingContract,
            }),
        );

    // request signatures using privy
    const signatures: string[] = [];
    if (!isEstimation) {
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
                } as unknown as SignTypedDataParameters;
                const signature = await signTypedDataWithCrossApp(
                    mutableData,
                );
                signatures.push(signature);
                continue;
            }

            const funcData = txClause.data;
            const signature = (
                await signTypedDataPrivy(data as unknown as SignTypedDataParams, {
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
    }

    // if the account smartAccountAddress has no code yet, it's not been deployed/created yet
    if (!smartAccount.isDeployed && !dontAddCreateAccountClause) {
        resultClauses.push(
            Clause.callFunction(
                Address.of(
                    getConfig(network.type as NETWORK_TYPE).accountFactoryAddress,
                ),
                ABIContract.ofAbi(SimpleAccountFactoryABI).getFunction(
                    'createAccount',
                ),
                [connectedWallet.address ?? ''], // set the Privy wallet address as the owner of the smart account
            ),
        );
    }

    dataToSign.forEach((data, index) => {
        resultClauses.push(
            Clause.callFunction(
                Address.of(smartAccount.address),
                ABIContract.ofAbi(SimpleAccountABI).getFunction(
                    'executeWithAuthorization',
                ),
                [
                    data.message.to as `0x${string}`,
                    BigInt(data.message.value),
                    data.message.data as `0x${string}`,
                    BigInt(data.message.validAfter),
                    BigInt(data.message.validBefore),
                    isEstimation ? undefined : signatures[index] as `0x${string}`,
                ],
            ),
        );
    });
    return resultClauses;
}

export async function buildBatchExecuteWithAuthorizationClauses(params: BuildClausesParams) {
    const {
        clauses: txClauses,
        chainId,
        verifyingContract,
        title,
        description,
        buttonText,
        isEstimation = false,
        dontAddCreateAccountClause = false,
        dependencies: {
            connection,
            connectedWallet,
            signTypedDataWithCrossApp,
            signTypedDataPrivy,
            network,
            smartAccount,
        },
    } = params;

    const resultClauses = [];

    const typedData = buildBatchAuthorizationTypedData({
        clauses: txClauses,
        chainId: chainId as unknown as number,
        verifyingContract: verifyingContract,
    });

    // Sign the typed data (either cross-app or traditional Privy)
    let signature = undefined;
    if (!isEstimation) {
        signature = connection.isConnectedWithCrossApp
            ? await signTypedDataWithCrossApp({
                ...typedData,
                address: connectedWallet.address as `0x${string}`,
            } as SignTypedDataParameters)
            : (
                await signTypedDataPrivy(typedData as unknown as SignTypedDataParams, {
                    uiOptions: {
                        title,
                        description,
                        buttonText,
                    },
                })
            ).signature;
    }
    // If the smart account is not deployed, deploy it first
    if (!smartAccount.isDeployed && !dontAddCreateAccountClause) {
        resultClauses.push(
            Clause.callFunction(
                Address.of(
                    getConfig(network.type as NETWORK_TYPE).accountFactoryAddress,
                ),
                ABIContract.ofAbi(SimpleAccountFactoryABI).getFunction(
                    'createAccount',
                ),
                [connectedWallet.address ?? ''],
            ),
        );
    }

    // Now the single batch execution call
    resultClauses.push(
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
                isEstimation ? undefined : signature as `0x${string}`,
            ],
        ),
    );
    return resultClauses;
}

export const buildClauses = async ({
    clauses,
    chainId,
    verifyingContract,
    version,
    isEstimation,
    title,
    description,
    buttonText,
    dependencies,
}: BuildClausesParams) => {
    const params = {
        clauses,
        chainId,
        verifyingContract,
        version,
        isEstimation,
        title,
        description,
        buttonText,
        dependencies,
    };

    if (version && version < 3) {
        return await buildSingleExecuteWithAuthorizationClauses(params);
    }
    else {
        return await buildBatchExecuteWithAuthorizationClauses(params);
    }
};