import { EnhancedClause } from '@/types';
import { GasTokenType, SUPPORTED_GAS_TOKENS } from '@/types/GasToken';
import { Transaction, TransactionBody } from '@vechain/sdk-core';

/**
 * payment clause for gas token payment to the deposit account
 */
export function createPaymentClause(
    gasToken: GasTokenType,
    amount: string,
    depositAccount: string,
): EnhancedClause {
    const tokenInfo = SUPPORTED_GAS_TOKENS[gasToken];

    if (tokenInfo.isNative) {
        // VTHO
        return {
            to: depositAccount,
            value: amount,
            data: '0x',
        };
    } else {
        // ERC20 transfer function signature: transfer(address,uint256)
        const transferFunctionSignature = '0xa9059cbb';
        const paddedAddress = depositAccount.slice(2).padStart(64, '0');

        const amountHex = BigInt(amount).toString(16).padStart(64, '0');

        const data = transferFunctionSignature + paddedAddress + amountHex;

        return {
            to:
                tokenInfo.address ||
                '0x0000000000000000000000000000000000000000',
            value: '0x0',
            data,
        };
    }
}

/**
 * Appends a payment clause to existing transaction clauses
 */
export function appendPaymentClause(
    originalClauses: EnhancedClause[],
    gasToken: GasTokenType,
    amount: string,
    depositAccount: string,
): EnhancedClause[] {
    const paymentClause = createPaymentClause(gasToken, amount, depositAccount);

    return [paymentClause, ...originalClauses];
}

/**
 * Encode transaction body using VeChain SDK Transaction class
 */
export function encodeTransactionBody(
    clauses: EnhancedClause[],
    userAddress: string,
    chainTag: number,
    blockRef: string,
    estimatedGas: number,
): { raw: string; origin: string } {
    const txBody: TransactionBody = {
        chainTag: chainTag,
        blockRef: blockRef,
        expiration: 32,
        clauses: clauses.map((clause) => ({
            to: clause.to,
            value: clause.value || '0',
            data: clause.data || '0x',
        })),
        gasPriceCoef: 0,
        gas: estimatedGas,
        dependsOn: null,
        nonce: Date.now().toString(),
        reserved: {
            features: 1,
        },
    };

    const tx = Transaction.of(txBody);
    // Uint8Array to hex string
    const rawUnsignedTx = '0x' + Buffer.from(tx.encoded).toString('hex');

    return {
        raw: rawUnsignedTx,
        origin: userAddress,
    };
}
