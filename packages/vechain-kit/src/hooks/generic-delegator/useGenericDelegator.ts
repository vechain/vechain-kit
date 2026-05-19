import {
    Transaction,
    HexUInt,
    TransactionClause
} from '@vechain/sdk-core';
import * as nc_utils from '@noble/curves/abstract/utils';
import { GasTokenType, TransactionSpeed, DepositAccount, EstimationResponse, Wallet } from '@/types';
import { SmartAccountReturnType, useGasTokenSelection, useWallet, useSmartAccount, useBuildClauses, useGetAccountVersion } from '@/hooks';
import { IERC20__factory } from '@vechain/vechain-contract-types';
import { parseEther } from 'viem';
import { randomTransactionUser, SUPPORTED_GAS_TOKENS } from '@/utils';
import { ThorClient } from '@vechain/sdk-network';
import { getConfig } from '@/config';
import { useVeChainKitConfig } from '@/providers';
import { useCallback } from 'react';

/**
 * Safety multiplier applied on top of the locally-estimated gas to absorb
 * variance between simulation and on-chain execution. Mirrors VeWorld
 * mobile's heuristic.
 */
export const GENERIC_DELEGATOR_GAS_SAFETY_MULTIPLIER = 1.1;

/**
 * Fixed gas cost for the extra transfer clause that pays the generic
 * delegator's deposit account. VET transfers are bare value transfers
 * (~21k), ERC-20 transfers (VTHO, B3TR) are ~50-55k depending on the
 * recipient cold/warm state.
 */
export const GENERIC_DELEGATOR_FEE_PAYER_OVERHEAD_GAS: Record<GasTokenType, number> = {
    VET: 21_000,
    VTHO: 55_000,
    B3TR: 55_000,
};

/**
 * Gas overhead added on top of the raw user-clause estimate to account for
 * the smart-account `executeWithAuthorization` / `executeBatchWithAuthorization`
 * wrapper (signature verification, calldata decoding, per-clause dispatch).
 */
export const GENERIC_DELEGATOR_WRAPPER_OVERHEAD_GAS: Record<number, number> = {
    1: 80_000,
    3: 120_000,
};

const getWrapperOverheadGas = (version: number): number =>
    GENERIC_DELEGATOR_WRAPPER_OVERHEAD_GAS[version] ??
    GENERIC_DELEGATOR_WRAPPER_OVERHEAD_GAS[3];

export const estimateGas = async (
    signerAddress: string,
    genericDelegatorUrl: string,
    clauses: any[],
    token: GasTokenType,
    speed: TransactionSpeed,
) => {
    const estimateUrl = new URL(
        `estimate/clauses/${token.toLowerCase()}`,
        genericDelegatorUrl,
    );
    estimateUrl.searchParams.set('type', 'smartaccount');
    estimateUrl.searchParams.set('speed', speed);

    const response = await fetch(estimateUrl, {
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
};

export const getDepositAccount = async (
    genericDelegatorUrl: string,
): Promise<DepositAccount> => {
    const depositAccountUrl = new URL('deposit/account', genericDelegatorUrl);
    const response = await fetch(depositAccountUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const data = await response.json();
    return data;
};

export const delegateAuthorized = async (encodedSignedTx: string, origin: string, token: GasTokenType, genericDelegatorUrl: string) => {
    const delegateAuthorizedUrl = new URL(
        `sign/transaction/authorized/${token.toLowerCase()}`,
        genericDelegatorUrl,
    );
    const response = await fetch(delegateAuthorizedUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            raw: encodedSignedTx,
            origin: origin,
            token: token.toLowerCase(),
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
        { gasPadding: 1 },
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
 * Compute the gas-token amount the smart account must transfer to the
 * generic delegator's deposit account to cover the transaction.
 *
 * The delegator's `/estimate/clauses` endpoint simulates the user's raw
 * clauses as if executed directly by the smart account, with no
 * `executeWithAuthorization` wrapper and no embedded-wallet signature, so
 * it under-estimates (and for NFT-heavy clauses can revert outright). We
 * trust its **rate** information (the gas-token-per-gas ratio is just a
 * market price and doesn't depend on the gas amount) but recompute the
 * gas number locally — including the wrapper overhead, fee-payer overhead,
 * and a 10% safety multiplier — and reapply the rate.
 *
 * @param thor - Thor client used for the local gas estimation
 * @param clauses - The user's raw clauses (NOT the wrapped ones)
 * @param smartAccountAddress - Caller used during simulation
 * @param version - Smart account version (selects the wrapper overhead)
 * @param estimationResponse - The delegator's /estimate/clauses response
 * @param gasToken - The selected gas token (selects the fee-payer overhead)
 * @returns The corrected gas-token amount as a decimal (human-readable)
 */
export const computeCorrectedGasTokenCost = async ({
    thor,
    clauses,
    smartAccountAddress,
    version,
    estimationResponse,
    gasToken,
}: {
    thor: ThorClient;
    clauses: TransactionClause[];
    smartAccountAddress: string;
    version: number;
    estimationResponse: EstimationResponse;
    gasToken: GasTokenType;
}): Promise<number> => {
    const fallbackCost = (estimationResponse.transactionCost ?? 0) * 2;

    let rawGas: number;
    try {
        const rawGasResult = await thor.gas.estimateGas(
            clauses,
            smartAccountAddress,
        );
        rawGas = rawGasResult.totalGas;
    } catch {
        return fallbackCost;
    }

    if (!rawGas || rawGas <= 0) {
        return fallbackCost;
    }

    const wrapperOverhead = getWrapperOverheadGas(version);
    const feePayerOverhead = GENERIC_DELEGATOR_FEE_PAYER_OVERHEAD_GAS[gasToken];

    const totalGas = Math.ceil(
        (rawGas + wrapperOverhead) * GENERIC_DELEGATOR_GAS_SAFETY_MULTIPLIER +
            feePayerOverhead,
    );

    // Derive the gas-token-per-gas rate from the delegator response. The
    // rate is price-driven and independent of the gas amount, so it
    // remains accurate even when the delegator's gas number is wrong.
    let gasTokenPerGas = 0;
    if (
        estimationResponse.transactionCost &&
        estimationResponse.estimatedGas &&
        estimationResponse.estimatedGas > 0
    ) {
        gasTokenPerGas =
            estimationResponse.transactionCost /
            estimationResponse.estimatedGas;
    } else if (estimationResponse.vthoPerGasAtSpeed) {
        const rate = estimationResponse.rate ?? 1;
        const serviceFee = estimationResponse.serviceFee ?? 0;
        gasTokenPerGas =
            estimationResponse.vthoPerGasAtSpeed *
            rate *
            (1 + serviceFee);
    }

    if (!gasTokenPerGas || gasTokenPerGas <= 0) {
        return fallbackCost;
    }

    return totalGas * gasTokenPerGas;
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
    const ERC20Interface = IERC20__factory.createInterface();
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
            const gasEstimationResponse: EstimationResponse = await estimateGas(
                smartAccount?.address ?? '',
                genericDelegatorUrl,
                clauses as TransactionClause[],
                gasToken,
                'medium',
            );

            const depositAccount: DepositAccount = await getDepositAccount(genericDelegatorUrl);

            const correctedTransactionCost = await computeCorrectedGasTokenCost({
                thor,
                clauses,
                smartAccountAddress: smartAccount?.address ?? '',
                version: smartAccountVersion?.version ?? 0,
                estimationResponse: gasEstimationResponse,
                gasToken,
            });

            const transferAmountWei = parseEther(
                correctedTransactionCost.toString(),
            ).toString();

            const transferToGenericDelegatorClause = {
                to: gasToken === 'VET'
                    ? depositAccount.depositAccount
                    : SUPPORTED_GAS_TOKENS[gasToken as GasTokenType].address,
                value: gasToken === 'VET' ? transferAmountWei : '0x0',
                data: gasToken === 'VET'
                    ? '0x'
                    : ERC20Interface.encodeFunctionData('transfer', [
                          depositAccount.depositAccount,
                          transferAmountWei,
                      ]),
                comment: `Transfer ${correctedTransactionCost} ${gasToken} to ${depositAccount.depositAccount}`,
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
