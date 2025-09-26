import {
    Transaction,
    HexUInt,
    TransactionClause,
    Clause, 
    Address,
    VET,
    VTHO,
    Token,
    Units,
} from '@vechain/sdk-core';
import * as nc_utils from '@noble/curves/utils.js';
import { GasTokenType, SUPPORTED_GAS_TOKENS, Wallet } from '@/types';
import { SmartAccountReturnType, useGasTokenSelection, useSmartAccountVersion, useWallet, useSmartAccount, useBuildClauses } from '@/hooks';
import { ERC20__factory } from '@vechain/vechain-contract-types';
import { randomTransactionUser } from '@/utils';
import { ThorClient } from '@vechain/sdk-network';
import { getConfig } from '@/config';
import { useVeChainKitConfig } from '@/providers';

/**
 * Sign the final transaction with the given private key and signature
 * returned by the generic delegator.
 * @param decodedTx The decoded transaction returned by the generic delegator.
 * @param gasPayerSignature The signature returned by the generic delegator.
 * @returns The signed final transaction.
 */
function signVip191Transaction(SignedTx: Transaction, gasPayerSignature: string) {
        return Transaction.of( 
            SignedTx.body, 
            nc_utils.concatBytes(
                SignedTx.signature ?? new Uint8Array(),
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

    class B3trToken extends Token {
        readonly tokenAddress: Address = Address.of(SUPPORTED_GAS_TOKENS[preferences.availableGasTokens[0] as GasTokenType].address ?? '')
        // 18 decimals
        readonly units: Units = Units.wei
        readonly name = 'B3TR'
        constructor(value: bigint) {
            super() // Pass a default value
            this.initialize(value) // Call the initialization method
        }
    }
    const sendTransactionUsingGenericDelegator = async ({
        clauses,
        genericDelegatorUrl,
    }: {
        clauses: TransactionClause[];
        genericDelegatorUrl: string;
    }): Promise<string> => {
        const i = 0
        try {
            const deposit = await callDeposit(genericDelegatorUrl);
            const symbol = preferences.availableGasTokens[0];
            const estimate = await callEstimateClauses(genericDelegatorUrl, clauses, smartAccount?.address ?? '', symbol);

            let extraClause;
            switch (symbol) {
                  case 'VET':
                        extraClause = Clause.transferVET(Address.of(deposit.depositAccount), VET.of(estimate.transactionCost))
                        break;
                  case 'B3TR':
                        const tokenAndAmount = new B3trToken(BigInt(estimate.transactionCost * 10 ** 18))
                        extraClause = Clause.transferToken(Address.of(deposit.depositAccount), tokenAndAmount) // will require '.clause' when upgrading the SDK to ^2.0
                        break;
                  /*case 'VTHO':
                        extraClause = Clause.transferVTHOToken(Address.of(deposit.depositAccount), VTHO.of(estimate.transactionCost)).clause
                        break;*/
              }

              const convertedClauses = await buildClausesWithAuth({
                clauses: clauses.concat(extraClause),
                smartAccount: smartAccount as SmartAccountReturnType,
                version: smartAccountVersion,
              });

              const estimateTransaction = await thor.gas.estimateGas(convertedClauses, randomTransactionUser.address);

              const rawBody = await thor.transactions.buildTransactionBody(convertedClauses, estimateTransaction.totalGas, {isDelegated: true});
              
              const rawSignedTx = await Transaction.of(rawBody).signAsSender(HexUInt.of(randomTransactionUser.privateKey).bytes)
              const encodedSignedTx = HexUInt.of(rawSignedTx.encoded).toString()
              const gasPayerResponse = await callDelegateAuthorized(genericDelegatorUrl, encodedSignedTx, randomTransactionUser.address, symbol);
              
              if (gasPayerResponse.statusCode !== 500) {
                //decodeSignedRawTx(rawSignedTx)
                const validTx = signVip191Transaction(rawSignedTx, gasPayerResponse.signature);
                const sendTransactionResult = await thor.transactions.sendTransaction(validTx);
                const tx = await sendTransactionResult.wait();
                // 👇 short delay to avoid hitting rate limits
                await new Promise((r) => setTimeout(r, 100));

                return tx?.meta?.txID ?? '';
              } else {
                throw new Error('Error from generic delegator: ' + gasPayerResponse.message);
              }

          } catch (error) {
              console.error('Error sending transaction using generic delegator', error);
          }
          return '';
    }
    return {
        sendTransactionUsingGenericDelegator,
    };
}

export async function callEstimateClauses(genericDelegatorUrl: string, clauses: TransactionClause[], signer: string, tokenSymbol: string) {
    
      const requestBody = {
          clauses,
          signer,
      }
    
      const requestOptions = {
          method: "POST",
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(requestBody),
          redirect: 'follow' as RequestRedirect
      };
      
      try {
          const response = await fetch(genericDelegatorUrl + "estimate/clauses/" + tokenSymbol + "?type=smartaccount&speed=medium" , requestOptions);
          return await response.json();
      } catch (error) {
          console.error("Fetch error:", error);
      }
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
    async function callDelegateAuthorized (genericDelegatorUrl: string, rawSignedTx: string, senderAddress: string, tokenSymbol: string) {

      const requestBody = {
          raw: rawSignedTx ,
          origin: senderAddress
      }
    
      const requestOptions = {
          method: "POST",
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(requestBody),
          redirect: 'follow' as RequestRedirect
      };
      
      try {
          const response = await fetch(genericDelegatorUrl + "sign/transaction/authorized/" + tokenSymbol, requestOptions);
          return await response.json();
      } catch (error) {
          console.error("Fetch error:", error);
      }
    }

    async function callDeposit( genericDelegatorUrl: string)  {
      const requestOptions = {
          method: "GET",
          headers: {'Content-Type': 'application/json'},
          redirect: 'follow' as RequestRedirect
      };
      
      try {
          const response = await fetch(genericDelegatorUrl + "deposit/account", requestOptions);
          return await response.json();
      } catch (error) {
          console.error("Fetch error:", error);
      }
      throw new Error("Failed to fetch deposit account");
    }