import {
    Transaction,
    HexUInt,
    TransactionClause
} from '@vechain/sdk-core';
import * as nc_utils from '@noble/curves/abstract/utils';
import { GasTokenType, TransactionSpeed, DepositAccount, EstimationResponse, Wallet } from '@/types';
import { SmartAccountReturnType, useGasTokenSelection, useWallet, useSmartAccount, useBuildClauses, useGetAccountVersion } from '@/hooks';
import { ERC20__factory } from '@hooks/contracts';
import { parseEther } from 'viem';
import { randomTransactionUser, SUPPORTED_GAS_TOKENS } from '@/utils';
import { ThorClient } from '@vechain/sdk-network';
import { getConfig } from '@/config';
import { useVeChainKitConfig } from '@/providers';
import { useCallback } from 'react';

export const estimateGas = async (signerAddress: string, genericDelegatorUrl: string, clauses: any[], token: GasTokenType, speed: TransactionSpeed) => {
    const response = await fetch(genericDelegatorUrl + 'estimate/clauses/' + token.toLowerCase() + '?type=smartaccount&speed=' + speed, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            clauses: clauses,
            signer: signerAddress,
        }),
    });
    const data = await response.json();
    return data;
}

export const getDepositAccount = async (genericDelegatorUrl: string): Promise<DepositAccount> => {
    const response = await fetch(genericDelegatorUrl + 'deposit/account', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const data = await response.json();
    return data;
}

export const delegateAuthorized = async (encodedSignedTx: string, origin: string, token: GasTokenType, genericDelegatorUrl: string) => {
    const response = await fetch(genericDelegatorUrl + 'sign/transaction/authorized/' + token.toLowerCase(), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            raw: encodedSignedTx,
            origin: origin,
            token: token.toLowerCase()
        }),
    });
    const data = await response.json();
    return data;
}

// Helper to estimate gas and build transaction body
export const estimateAndBuildTxBody = async (
    clauses: TransactionClause[],
    thor: ThorClient,
    randomTransactionUser: Wallet,
    isDelegated: boolean
) => {
    const gasResult = await thor.gas.estimateGas(
        clauses,
        randomTransactionUser?.address ?? '',
    );
    const parsedGasLimit = Math.max(
        gasResult.totalGas,
        0,
    );

    return await thor.transactions.buildTransactionBody(
        clauses,
        parsedGasLimit,
        { isDelegated: isDelegated }
    );
};

/**
 * Sign the final transaction with the given private key and signature
 * returned by the generic delegator.
 * @param decodedTx The decoded transaction returned by the generic delegator.
 * @param gasPayerSignature The signature returned by the generic delegator.
 * @returns The signed final transaction.
 */
export function signVip191Transaction(decodedTx: Transaction, gasPayerSignature: string) {
    return Transaction.of(
        decodedTx.body,
        nc_utils.concatBytes(
            decodedTx.signature ?? new Uint8Array(),
            HexUInt.of(gasPayerSignature.slice(2)).bytes
        )
    )
}

export function decodeRawTx(raw: any, isSigned: boolean) {
    return Transaction.decode(
        HexUInt.of(raw.slice(2)).bytes,
        isSigned
    );
}

/**
 * This function is used to send a transaction using the generic delegator.
 * It will build the necessary clauses, estimate the gas, and send the transaction.
 * @param clauses The clauses to send in the transaction.
 * @param genericDelegatorUrl The URL of the generic delegator.
 * @returns
 */
export const useGenericDelegator = () => {
    const { connectedWallet } = useWallet();
    const { data: smartAccount } = useSmartAccount(
        connectedWallet?.address ?? '',
    );
    const { data: smartAccountVersion } = useGetAccountVersion(
        smartAccount?.address ?? '',
        connectedWallet?.address ?? '',
    );
    const { preferences } = useGasTokenSelection();
    const ERC20Interface = ERC20__factory.createInterface();
    const { network } = useVeChainKitConfig();
    const { buildClausesWithAuth } = useBuildClauses();
    const thor = ThorClient.at(getConfig(network.type).nodeUrl);

    const sendTransactionUsingGenericDelegator = useCallback(async ({
        clauses,
        genericDelegatorUrl
    }: {
        clauses: TransactionClause[];
        genericDelegatorUrl: string;
    }): Promise<string> => {
        try {
            const gasToken = preferences.gasTokenToUse;
            const gasEstimationResponse: EstimationResponse = await estimateGas(smartAccount?.address ?? '', genericDelegatorUrl, clauses as TransactionClause[], gasToken, 'medium');

            const depositAccount: DepositAccount = await getDepositAccount(genericDelegatorUrl);

            const transferToGenericDelegatorClause = {
                to: gasToken === 'VET' ? depositAccount.depositAccount : SUPPORTED_GAS_TOKENS[gasToken as GasTokenType].address,
                value: gasToken === 'VET' ? parseEther(gasEstimationResponse.transactionCost?.toString() ?? '0').toString() : '0x0',
                data: gasToken === 'VET' ? '0x' : ERC20Interface.encodeFunctionData('transfer', [
                    depositAccount.depositAccount,
                    parseEther(gasEstimationResponse.transactionCost?.toString() ?? '0'),
                ]),
                comment: `Transfer ${gasEstimationResponse.transactionCost} ${gasToken} to ${depositAccount.depositAccount}`,
                abi: gasToken === 'VET' ? undefined : ERC20Interface.getFunction('transfer'),
            };

            const finalExecuteWithAuthorizationClauses = await buildClausesWithAuth({
                clauses: [...clauses, transferToGenericDelegatorClause as TransactionClause],
                smartAccount: smartAccount as SmartAccountReturnType,
                version: smartAccountVersion?.version ?? 0,
            });

            const txBody = await estimateAndBuildTxBody(
                finalExecuteWithAuthorizationClauses as TransactionClause[],
                thor,
                randomTransactionUser,
                true
            );

            const rawSignedTx = await Transaction.of(txBody).signAsSender(HexUInt.of(randomTransactionUser.privateKey).bytes);

            const encodedSignedTx = HexUInt.of(rawSignedTx.encoded).toString()

            const gasPayerResponse: {
                signature: string;
                address: string;
                raw: string;
                origin: string;
            } = await delegateAuthorized(encodedSignedTx, randomTransactionUser.address, gasToken, genericDelegatorUrl);

            const finalTxSigned = signVip191Transaction(rawSignedTx, gasPayerResponse.signature);

            const simulatedTransaction = {
                clauses: finalExecuteWithAuthorizationClauses as TransactionClause[],
                simulateTransactionOptions: {
                    caller: randomTransactionUser.address ?? '',
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
        } catch (error) {
            console.error('Error sending transaction using generic delegator', error);
        }
        throw new Error('Failed to send transaction using generic delegator, no gas tokens have sufficient balance or are enabled in Gas Token Preferences');
    }, [
        preferences,
        smartAccount,
        smartAccountVersion,
        buildClausesWithAuth,
        thor,
        randomTransactionUser,
    ]);
    return {
        sendTransactionUsingGenericDelegator,
    };
}
