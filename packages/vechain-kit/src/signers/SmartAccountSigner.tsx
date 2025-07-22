/* eslint-disable */
import { TransactionClause } from '@vechain/sdk-core';
import { JSONRPCInvalidParams } from '@vechain/sdk-errors';
import {
    type AvailableVeChainProviders,
    type TransactionRequestInput,
    VeChainAbstractSigner,
} from '@vechain/sdk-network';
import { type TypedDataDomain, type TypedDataField } from 'ethers';

/**
 * A VeChain signer implementation for abstract accounts.
 * This signer works with Privy's connected wallet and handles transaction signing
 * through abstract account infrastructure.
 */
class SmartAccountSigner extends VeChainAbstractSigner {
    /**
     * Creates a new AbstractAccountSigner instance.
     *
     * @param smartAccount - The smart account instance to use for signing
     * @param provider - Optional VeChain provider instance
     * @throws {Error} If signTypedDataPrivy is not a function
     */
    constructor(
        private readonly smartAccount: {
            address: string | undefined;
            sendTransaction: ({
                txClauses,
                title,
                description,
                buttonText,
            }: {
                txClauses: TransactionClause[];
                title?: string;
                description?: string;
                buttonText?: string;
            }) => Promise<string>;
        },
        provider?: AvailableVeChainProviders,
    ) {
        // Assert if the transaction can be signed
        if (smartAccount.address === undefined) {
            console.error(
                'SmartAccountSigner.constructor(): smartAccount is required.',
            );
        }

        // Call the parent constructor
        super(provider);
    }

    /**
     * Creates a new instance of this signer connected to the specified provider.
     *
     * @param provider - The VeChain provider to connect to
     * @returns A new signer instance connected to the provider
     */
    connect(provider: AvailableVeChainProviders): this {
        return new SmartAccountSigner(this.smartAccount, provider) as this;
    }

    /**
     * Retrieves the abstract account address for this signer.
     *
     * @returns The abstract account address
     */
    async getAddress(): Promise<string> {
        if (this.smartAccount.address === undefined) {
            throw new Error(
                'SmartAccountSigner.getAddress(): address is required.',
            );
        }

        return this.smartAccount.address;
    }

    /**
     * Sends a transaction to the network through the abstract account infrastructure.
     * Automatically populates any missing transaction fields before sending.
     *
     * @param transactionToSend - The transaction request to send
     * @returns The transaction hash
     * @throws {JSONRPCInvalidParams} If no provider is attached to the signer
     */
    async sendTransaction(
        transactionToSend: TransactionRequestInput,
    ): Promise<string> {
        if (this.provider === undefined) {
            throw new JSONRPCInvalidParams(
                'SmartAccountSigner.sendTransaction()',
                'Thor provider is not found into the signer. Please attach a Provider to your signer instance.',
                { transactionToSend },
            );
        }

        const transaction = await this.populateTransaction(transactionToSend);

        return await this.smartAccount.sendTransaction({
            txClauses: transaction.clauses,
        });
    }

    /**
     * Signs a message according to EIP-191 personal message signing standard.
     *
     * @param message - The message to sign (string or Uint8Array)
     * @returns The signature
     * @throws {Error} Method not implemented
     */
    /* eslint-disable-next-line @typescript-eslint/require-await */
    async signMessage(_message: string | Uint8Array): Promise<string> {
        throw new Error('Method not implemented.');
    }

    /**
     * Signs a transaction without sending it.
     *
     * @param transactionToSign - The transaction to sign
     * @returns The signed transaction
     * @throws {Error} Method not implemented
     */
    /* eslint-disable-next-line @typescript-eslint/require-await */
    async signTransaction(
        _transactionToSign: TransactionRequestInput,
    ): Promise<string> {
        throw new Error('Method not implemented.');
    }

    /**
     * Signs typed data according to EIP-712 standard.
     *
     * @param domain - The domain separator
     * @param types - The type definitions
     * @param value - The data to sign
     * @returns The signature
     * @throws {Error} Method not implemented
     */
    /* eslint-disable-next-line @typescript-eslint/require-await */
    async signTypedData(
        _domain: TypedDataDomain,
        _types: Record<string, TypedDataField[]>,
        _value: Record<string, unknown>,
    ): Promise<string> {
        throw new Error('Method not implemented.');
    }

    signPayload(payload: Uint8Array): Promise<string> {
        throw new Error('Method not implemented.');
    }
}

export { SmartAccountSigner };
