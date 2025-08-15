import {
    Transaction,
    HexUInt,
    Secp256k1,
    Hex
} from '@vechain/sdk-core';
import * as nc_utils from '@noble/curves/abstract/utils';
import { GasTokenType, TransactionSpeed } from '@/types';
import { DepositAccount } from '@/types/GasEstimation';

export const estimateGas = async (signerAddress: string, genericDelegatorUrl: string, clauses: any[], token: GasTokenType, speed: TransactionSpeed, smartAccountVersion: number) => {
    const response = await fetch(genericDelegatorUrl + 'estimate/clauses/' + token.toLowerCase() + '?type=smartaccount&speed=' + speed + '&version=' + 'v' + smartAccountVersion, {
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
        }),
    });
    const data = await response.json();
    return data;
}

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
