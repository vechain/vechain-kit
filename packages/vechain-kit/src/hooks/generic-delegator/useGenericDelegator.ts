import {
    Transaction,
    HexUInt,
    Secp256k1,
    Hex,
    TransactionClause
} from '@vechain/sdk-core';
import * as nc_utils from '@noble/curves/abstract/utils';
import { GasTokenType, TransactionSpeed, DepositAccount, EstimationResponse, SUPPORTED_GAS_TOKENS, Wallet } from '@/types';
import { SmartAccountReturnType, useGasTokenSelection, useSmartAccountVersion, useWallet, useSmartAccount, useBuildClauses } from '@/hooks';
import { ERC20__factory } from '@vechain/vechain-contract-types';
import { parseEther } from 'viem';
import { randomTransactionUser } from '@/utils';
import { ThorClient } from '@vechain/sdk-network';
import { getConfig } from '@/config';
import { useVeChainKitConfig } from '@/providers';


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

export const delegateAuthorized = async (rawUnsignedTx: string, origin: string, token: GasTokenType, genericDelegatorUrl: string) => {
    const response = await fetch(genericDelegatorUrl + 'sign/transaction/authorized/' + token.toLowerCase(), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            raw: rawUnsignedTx,
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
    connectedWallet: Wallet,
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

/**
 * Sign the final transaction with the given private key and signature
 * returned by the generic delegator.
 * @param decodedTx The decoded transaction returned by the generic delegator.
 * @param senderPrivateKey The private key of the origin/sender of the transaction.
 * @param gasPayerSignature The signature returned by the generic delegator.
 * @returns The signed final transaction.
 */
export function signVip191Transaction(decodedTx: Transaction, senderPrivateKey: string, gasPayerSignature: string) {
    const txHash = Transaction.of(decodedTx.body).getTransactionHash();
    const convertedPrivateKey = Hex.of(senderPrivateKey).bytes;
    return Transaction.of( 
        decodedTx.body, 
        nc_utils.concatBytes(
            Secp256k1.sign(txHash.bytes, convertedPrivateKey),
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
    const { data: smartAccountVersion } = useSmartAccountVersion(
        smartAccount?.address ?? '',
        connectedWallet?.address ?? '',
    );
    const { preferences } = useGasTokenSelection();
    const ERC20Interface = ERC20__factory.createInterface();
    const { network } = useVeChainKitConfig();
    const { buildClausesWithAuth } = useBuildClauses();
    const thor = ThorClient.at(getConfig(network.type).nodeUrl);

    const sendTransactionUsingGenericDelegator = async ({
        clauses,
        genericDelegatorUrl
    }: {
        clauses: TransactionClause[];
        genericDelegatorUrl: string;
    }): Promise<string> => {
        // Build the clause with authorization to be estimated by the generic delegator
        const clausesWithAuthorization = await buildClausesWithAuth({
            clauses: clauses,
            smartAccount: smartAccount as SmartAccountReturnType,
            version: smartAccountVersion,
        });

        for (let i = 0; i < preferences.availableGasTokens.length; i++) {
            try {
                const gasEstimationResponse: EstimationResponse = await estimateGas(smartAccount?.address ?? '', genericDelegatorUrl, clausesWithAuthorization as TransactionClause[], preferences.availableGasTokens[i], 'medium');

                const depositAccount: DepositAccount = await getDepositAccount(genericDelegatorUrl);

                const transferToGenericDelegatorClause = {
                    to: preferences.availableGasTokens[i] === 'VET' ? depositAccount.depositAccount : SUPPORTED_GAS_TOKENS[preferences.availableGasTokens[i] as GasTokenType].address,
                    value: preferences.availableGasTokens[i] === 'VET' ? parseEther(gasEstimationResponse.transactionCost?.toString() ?? '0').toString() : '0x0',
                    data: preferences.availableGasTokens[i] === 'VET' ? '0x' : ERC20Interface.encodeFunctionData('transfer', [
                        depositAccount.depositAccount,
                        parseEther(gasEstimationResponse.transactionCost?.toString() ?? '0'),
                    ]),
                    comment: `Transfer ${gasEstimationResponse.transactionCost} ${preferences.availableGasTokens[i]} to ${depositAccount.depositAccount}`,
                    abi: preferences.availableGasTokens[i] === 'VET' ? undefined : ERC20Interface.getFunction('transfer'),
                };

                const finalExecuteWithAuthorizationClauses = await buildClausesWithAuth({
                    clauses: [...clauses, transferToGenericDelegatorClause as TransactionClause],
                    smartAccount: smartAccount as SmartAccountReturnType,
                    version: smartAccountVersion,
                });

                const estimatedGas = gasEstimationResponse.estimatedGas ?? 0;

                const txBody = await estimateAndBuildTxBody(
                    finalExecuteWithAuthorizationClauses as TransactionClause[],
                    thor,
                    connectedWallet,
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
                } = await delegateAuthorized(rawUnsignedTx, randomTransactionUser.address, preferences.availableGasTokens[i], genericDelegatorUrl);

                const decodedTx = decodeRawTx(gasPayerResponse.raw, false);

                const finalTxSigned = signVip191Transaction(decodedTx, randomTransactionUser.privateKey, gasPayerResponse.signature);

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
                        console.error(`simulatedTx1[i].vmError: ${simulatedTx1[i].vmError}`);
                        throw new Error(simulatedTx1[i].vmError);
                    }
                }
                // Send the transaction
                const sendTransactionResult = await thor.transactions.sendTransaction(finalTxSigned);

                return sendTransactionResult.id;
            } catch (error) {
                console.error('Error sending transaction using generic delegator', error);
            }
        }
        throw new Error('No gas token found');
    }
    return {
        sendTransactionUsingGenericDelegator,
    };
}
