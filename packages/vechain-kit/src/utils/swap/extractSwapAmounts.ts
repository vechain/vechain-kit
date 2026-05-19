import { decodeEventLog, zeroAddress } from 'viem';
import { IERC20__factory } from '@vechain/vechain-contract-types';
import type { TransactionReceipt, Event, Transfer } from '@vechain/sdk-network';

/**
 * Check if address is native VET token
 */
const isVET = (address: string): boolean => {
    return address === '0x' || address === zeroAddress || !address;
};

/**
 * Extract swap amounts from transaction receipt by parsing Transfer events
 * @param receipt Transaction receipt containing events
 * @param userAddress User's wallet address
 * @param fromTokenAddress Address of the token being swapped from
 * @param toTokenAddress Address of the token being swapped to
 * @returns Object containing formatted amounts and symbols, or null if not found
 */
export const extractSwapAmounts = (
    receipt: TransactionReceipt,
    userAddress: string,
    fromTokenAddress: string,
    toTokenAddress: string,
): {
    fromAmount: bigint;
    toAmount: bigint;
} | null => {
    if (!receipt || !userAddress || !fromTokenAddress || !toTokenAddress) {
        return null;
    }

    const userAddressLower = userAddress.toLowerCase();
    const fromTokenAddressLower = fromTokenAddress.toLowerCase();
    const toTokenAddressLower = toTokenAddress.toLowerCase();
    const isFromTokenVET = isVET(fromTokenAddress);
    const isToTokenVET = isVET(toTokenAddress);

    // Get all events and transfers from receipt outputs
    const allEvents: Event[] = [];
    const allTransfers: Transfer[] = [];

    if (receipt.outputs && Array.isArray(receipt.outputs)) {
        for (const output of receipt.outputs) {
            // Events can be direct array or nested - handle both cases
            if (output.events && Array.isArray(output.events)) {
                allEvents.push(...output.events);
            }
            // Collect native VET transfers
            if (output.transfers && Array.isArray(output.transfers)) {
                allTransfers.push(...output.transfers);
            }
        }
    }

    // Get ERC20 ABI for decoding (only needed if we have ERC20 tokens)
    const ERC20Interface = IERC20__factory.createInterface();
    const transferEventAbi = ERC20Interface.getEvent('Transfer');
    const transferEventTopicHash = transferEventAbi?.topicHash.toLowerCase();

    // Filter for Transfer events (only needed for ERC20 tokens)
    const transferEvents = allEvents.filter((event) => {
        // Check if topic[0] matches Transfer event signature
        return (
            event.topics &&
            event.topics.length > 0 &&
            event.topics[0]?.toString().toLowerCase() === transferEventTopicHash
        );
    });

    // Decode transfer events and find relevant ones
    let fromAmount: bigint | null = null;
    let toAmount: bigint | null = null;

    // Handle native VET transfers from transfers array
    if (isFromTokenVET) {
        // Find VET transfer FROM the user
        for (const transfer of allTransfers) {
            if (
                transfer.sender?.toLowerCase() === userAddressLower &&
                transfer.amount &&
                transfer.amount !== '0x0' &&
                transfer.amount !== '0x'
            ) {
                const amount = BigInt(transfer.amount);
                if (amount > 0n) {
                    fromAmount = amount;
                    break; // Take the first matching transfer
                }
            }
        }
    }

    if (isToTokenVET) {
        // Find VET transfer TO the user
        for (const transfer of allTransfers) {
            if (
                transfer.recipient?.toLowerCase() === userAddressLower &&
                transfer.amount &&
                transfer.amount !== '0x0' &&
                transfer.amount !== '0x'
            ) {
                const amount = BigInt(transfer.amount);
                if (amount > 0n) {
                    toAmount = amount;
                    break; // Take the first matching transfer
                }
            }
        }
    }

    // Handle ERC20 token transfers from Transfer events (only if we have ERC20 tokens)
    if (transferEvents.length > 0) {
        for (const event of transferEvents) {
            try {
                const decoded = decodeEventLog({
                    abi: [transferEventAbi],
                    data: event.data.toString() as `0x${string}`,
                    topics: event.topics.map((t: any) => t.toString()) as [
                        `0x${string}`,
                        ...`0x${string}`[],
                    ],
                });

                // Type guard for Transfer event args
                if (
                    !decoded.args ||
                    !('from' in decoded.args) ||
                    !('to' in decoded.args) ||
                    !('value' in decoded.args)
                ) {
                    continue;
                }

                const from = (
                    decoded.args as {
                        from: `0x${string}`;
                        to: `0x${string}`;
                        value: bigint;
                    }
                ).from
                    ?.toString()
                    .toLowerCase();
                const to = (
                    decoded.args as {
                        from: `0x${string}`;
                        to: `0x${string}`;
                        value: bigint;
                    }
                ).to
                    ?.toString()
                    .toLowerCase();
                const value = (
                    decoded.args as {
                        from: `0x${string}`;
                        to: `0x${string}`;
                        value: bigint;
                    }
                ).value as bigint;

                // Get contract address from event
                // Event type from TransactionReceipt has address as string
                const eventContractAddress = event.address.toLowerCase();

                // Check if this is a transfer FROM the user for the fromToken (skip if already found from VET transfers)
                if (
                    !isFromTokenVET &&
                    from === userAddressLower &&
                    eventContractAddress &&
                    eventContractAddress === fromTokenAddressLower &&
                    value > 0n &&
                    fromAmount === null
                ) {
                    fromAmount = value;
                }

                // Check if this is a transfer TO the user for the toToken (skip if already found from VET transfers)
                if (
                    !isToTokenVET &&
                    to === userAddressLower &&
                    eventContractAddress &&
                    eventContractAddress === toTokenAddressLower &&
                    value > 0n &&
                    toAmount === null
                ) {
                    toAmount = value;
                }
            } catch (error) {
                // Skip events that can't be decoded
                console.warn('Failed to decode transfer event:', error);
                continue;
            }
        }
    }

    // Strict matching can miss one side when a swap goes through a smart-
    // account / router intermediation chain: the user is the originator
    // but the actual Transfer-event `from` / `to` is an intermediate
    // contract. Fall back to "the largest non-zero Transfer value on the
    // relevant token contract" — across all routing patterns we see, that
    // movement is the user's net inflow / outflow on that token.
    if (fromAmount === null && !isFromTokenVET) {
        for (const event of transferEvents) {
            try {
                const decoded = decodeEventLog({
                    abi: [transferEventAbi],
                    data: event.data.toString() as `0x${string}`,
                    topics: event.topics.map((t: any) => t.toString()) as [
                        `0x${string}`,
                        ...`0x${string}`[],
                    ],
                });
                if (!decoded.args || !('value' in decoded.args)) continue;
                const value = (decoded.args as { value: bigint }).value;
                if (
                    event.address.toLowerCase() === fromTokenAddressLower &&
                    value > 0n &&
                    (fromAmount === null || value > fromAmount)
                ) {
                    fromAmount = value;
                }
            } catch {
                /* ignore undecodable */
            }
        }
    }
    if (toAmount === null && !isToTokenVET) {
        for (const event of transferEvents) {
            try {
                const decoded = decodeEventLog({
                    abi: [transferEventAbi],
                    data: event.data.toString() as `0x${string}`,
                    topics: event.topics.map((t: any) => t.toString()) as [
                        `0x${string}`,
                        ...`0x${string}`[],
                    ],
                });
                if (!decoded.args || !('value' in decoded.args)) continue;
                const value = (decoded.args as { value: bigint }).value;
                if (
                    event.address.toLowerCase() === toTokenAddressLower &&
                    value > 0n &&
                    (toAmount === null || value > toAmount)
                ) {
                    toAmount = value;
                }
            } catch {
                /* ignore undecodable */
            }
        }
    }

    // Honor the documented contract: signal "couldn't extract" with null
    // rather than returning 0n placeholders that the UI then renders as
    // "swapped 0 B3TR for …". The caller falls back to a generic message.
    if (fromAmount === null || toAmount === null) return null;
    if (fromAmount === 0n || toAmount === 0n) return null;

    return { fromAmount, toAmount };
};
