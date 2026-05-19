/**
 * Translates raw VeChain clauses into plain-language summaries the average
 * (non-crypto) user can understand. Three layers:
 *
 *  1. Native VET transfer (no calldata, value > 0) -> "Send X VET".
 *  2. ERC-20 transfer / approve (4-byte selector match) -> "Send X B3TR",
 *     "Allow up to Y USDC", or "Allow unlimited B3TR spending". Token symbol
 *     and decimals come from the kit's address book (B3TR / VOT3 / VTHO) or
 *     a live Thor read on the token's ERC-20 metadata, whichever resolves
 *     first.
 *  3. Anything else -> b32 lookup at https://b32.vecha.in/ for a human-
 *     readable function name; falls back to "Interact with contract" if
 *     the selector is unknown.
 *
 *  The transact page treats any 'unknown' result as a "couldn't be checked"
 *  warning so equally-loud rows don't make malicious calls look as safe as
 *  benign ones.
 */
import {
    decodeFunctionData,
    formatUnits,
    parseAbi,
    isAddress,
} from 'viem';
import type { ThorClient } from '@vechain/sdk-network';
import { type NETWORK_TYPE, getConfig } from './network-tokens';
import {
    recognizeKnownAction,
    type KnownAction,
    type KnownActionCategory,
    type KnownActionData,
} from './knownActions';
import i18n from '../../i18n/config';

const t = i18n.t.bind(i18n);

const ERC20_ABI = parseAbi([
    'function transfer(address to, uint256 amount)',
    'function approve(address spender, uint256 amount)',
    'function transferFrom(address from, address to, uint256 amount)',
]);

const ERC20_METADATA_ABI = parseAbi([
    'function symbol() view returns (string)',
    'function decimals() view returns (uint8)',
]);

const SELECTOR_TRANSFER = '0xa9059cbb';
const SELECTOR_APPROVE = '0x095ea7b3';
const SELECTOR_TRANSFER_FROM = '0x23b872dd';

// Treat anything above 2^240 as "unlimited" — covers UI tools that send
// 2^256-1, 2^255-1, etc. BigInt() constructor (not the `n` suffix) so the
// kit's ES5 tsconfig target is happy.
const UNLIMITED_THRESHOLD = BigInt(1) << BigInt(240);
const ZERO = BigInt(0);

export type Clause = { to: string; value: string; data: string };

export type TokenInfo = {
    address: string;
    symbol: string;
    decimals: number;
};

export type DecodedClause =
    | {
          kind: 'native_transfer';
          summary: string;
          recipient: string;
          amount: string;
      }
    | {
          kind: 'token_transfer';
          summary: string;
          token: TokenInfo;
          recipient: string;
          amount: string;
      }
    | {
          kind: 'token_approve';
          summary: string;
          token: TokenInfo;
          spender: string;
          amount: string;
          unlimited: boolean;
      }
    | {
          // Ecosystem-recognized call (VeChain Kit domain ops, VeBetterDAO
          // governance, NFT transfers, etc.). Treated as fully understood —
          // no "couldn't double-check" warning fires for these.
          kind: 'known_action';
          summary: string;
          detail?: string;
          category: KnownActionCategory;
          recipient?: string;
          spender?: string;
          /** Structured fields the batch subtitle logic reads instead of
           *  parsing localized summaries. Populated by each known-action
           *  decoder when relevant; see `KnownActionData` in knownActions.ts. */
          data?: KnownActionData;
      }
    | {
          kind: 'unknown';
          summary: string;
          selector?: string;
          functionName?: string;
          signature?: string;
      };

export async function decodeClause(
    clause: Clause,
    thor: ThorClient | null,
    network: NETWORK_TYPE,
    self?: string,
    /** Lowercased address of the generic delegator's deposit account. When
     *  set, clauses transferring VET / VTHO / B3TR / VOT3 to this address
     *  are re-labelled as "Pay transaction fee" instead of an opaque
     *  "Send X VET to 0x86…fa" — the user understands the clause exists
     *  to fund the gas payer, not as a separate transfer. */
    feeDepositAccount?: string,
): Promise<DecodedClause> {
    const data = (clause.data ?? '0x').toLowerCase();
    const value = (() => {
        try {
            return BigInt(clause.value || '0');
        } catch {
            return ZERO;
        }
    })();

    const isFeeDeposit = (recipient: string): boolean =>
        !!feeDepositAccount &&
        recipient.toLowerCase() === feeDepositAccount;

    // 1. Native VET transfer
    if ((data === '0x' || data === '') && value > ZERO) {
        const amount = formatUnits(value, 18);
        if (isFeeDeposit(clause.to)) {
            return {
                kind: 'known_action',
                category: 'fee',
                recipient: clause.to,
                summary: t('action.fee.payTransactionFee'),
                detail: t('action.fee.amount', {
                    amount: trimAmount(amount),
                    symbol: 'VET',
                }),
            };
        }
        return {
            kind: 'native_transfer',
            recipient: clause.to,
            amount,
            summary: t('action.transfer.native', { amount: trimAmount(amount) }),
        };
    }

    // 2. ERC-20 transfer / approve
    if (data.length >= 10 && isAddress(clause.to as `0x${string}`)) {
        const selector = data.slice(0, 10);
        if (
            selector === SELECTOR_TRANSFER ||
            selector === SELECTOR_APPROVE
        ) {
            try {
                const decoded = decodeFunctionData({
                    abi: ERC20_ABI,
                    data: data as `0x${string}`,
                });
                const token = await lookupToken(
                    clause.to,
                    network,
                    thor,
                );
                if (decoded.functionName === 'transfer') {
                    const [recipient, raw] = decoded.args as [
                        string,
                        bigint,
                    ];
                    const amount = formatUnits(raw, token.decimals);
                    if (isFeeDeposit(recipient)) {
                        return {
                            kind: 'known_action',
                            category: 'fee',
                            recipient,
                            summary: t('action.fee.payTransactionFee'),
                            detail: t('action.fee.amount', {
                                amount: trimAmount(amount),
                                symbol: token.symbol,
                            }),
                        };
                    }
                    return {
                        kind: 'token_transfer',
                        recipient,
                        token,
                        amount,
                        summary: t('action.transfer.token', {
                            amount: trimAmount(amount),
                            symbol: token.symbol,
                        }),
                    };
                }
                if (decoded.functionName === 'approve') {
                    const [spender, raw] = decoded.args as [
                        string,
                        bigint,
                    ];
                    const unlimited = raw >= UNLIMITED_THRESHOLD;
                    const amount = unlimited
                        ? 'unlimited'
                        : formatUnits(raw, token.decimals);
                    return {
                        kind: 'token_approve',
                        spender,
                        token,
                        amount,
                        unlimited,
                        summary: unlimited
                            ? t('action.approve.unlimited', {
                                  symbol: token.symbol,
                              })
                            : t('action.approve.upTo', {
                                  amount: trimAmount(amount),
                                  symbol: token.symbol,
                              }),
                    };
                }
            } catch {
                // fall through to unknown / b32 lookup
            }
        }
        if (selector === SELECTOR_TRANSFER_FROM) {
            // Falls through to the known-action recognizer below, which
            // handles ERC-721 transferFrom and ERC-20 pull-style transfers.
        }
    }

    // 3. Ecosystem-recognized calls — VeChain Kit domain ops, VeBetterDAO
    // governance, NFT transfers, etc. Defined in `knownActions.ts`.
    const known = recognizeKnownAction(clause.to, data, { self });
    if (known) {
        return {
            kind: 'known_action',
            summary: known.summary,
            detail: known.detail,
            category: known.category,
            recipient: known.recipient,
            spender: known.spender,
            data: known.data,
        };
    }

    // 4. b32 fallback — at least show the function name when known.
    if (data.length >= 10) {
        const selector = data.slice(0, 10);
        const sig = await fetchB32Signature(selector);
        if (sig) {
            const fnName = sig.split('(')[0];
            return {
                kind: 'unknown',
                selector,
                functionName: fnName,
                signature: sig,
                summary: t('action.unknown.runOn', { fn: humanize(fnName) }),
            };
        }
        return {
            kind: 'unknown',
            selector,
            summary: t('action.unknown.interact'),
        };
    }

    return {
        kind: 'unknown',
        summary: t('action.unknown.interact'),
    };
}

// Strip trailing zeros and excessive decimals: 10.000000000000000000 -> 10,
// 0.123456789012345678 -> 0.123456789012345678 (kept as-is for tokens with
// long fractional parts). Limit to 6 fractional digits for readability.
function trimAmount(amount: string): string {
    if (!amount.includes('.')) return amount;
    const [whole, frac] = amount.split('.');
    const trimmedFrac = frac.replace(/0+$/, '').slice(0, 6);
    return trimmedFrac.length === 0 ? whole : `${whole}.${trimmedFrac}`;
}

function humanize(fnName: string): string {
    // camelCase -> "camel case", then capitalise.
    const spaced = fnName.replace(/([A-Z])/g, ' $1').toLowerCase().trim();
    return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

const b32Cache = new Map<string, string | null>();

async function fetchB32Signature(selector: string): Promise<string | null> {
    if (b32Cache.has(selector)) return b32Cache.get(selector)!;
    try {
        const res = await fetch(`https://b32.vecha.in/q/${selector}.json`, {
            cache: 'force-cache',
        });
        if (!res.ok) {
            b32Cache.set(selector, null);
            return null;
        }
        const json = (await res.json()) as Array<{ name?: string }>;
        const name =
            Array.isArray(json) && json[0]?.name ? json[0].name : null;
        b32Cache.set(selector, name);
        return name;
    } catch {
        b32Cache.set(selector, null);
        return null;
    }
}

const tokenInfoCache = new Map<string, TokenInfo>();

/**
 * Resolve a token's symbol + decimals. Order:
 *   1. Static address book (VET, VTHO, B3TR, VOT3 — instant).
 *   2. In-memory cache from a previous live lookup.
 *   3. Live Thor read of `symbol()` + `decimals()` on the contract.
 *   4. Generic "tokens" / 18-decimals fallback if the contract doesn't
 *      implement the standard interface or Thor is unreachable.
 */
async function lookupToken(
    address: string,
    network: NETWORK_TYPE,
    thor: ThorClient | null,
): Promise<TokenInfo> {
    const lower = address.toLowerCase();
    const known = getConfig(network)[lower];
    if (known) return known;
    const cached = tokenInfoCache.get(lower);
    if (cached) return cached;
    if (!thor) {
        return { address, symbol: t('common.tokens'), decimals: 18 };
    }
    try {
        const contract = thor.contracts.load(address, ERC20_METADATA_ABI);
        const [symbolRes, decimalsRes] = await Promise.all([
            contract.read.symbol(),
            contract.read.decimals(),
        ]);
        const info: TokenInfo = {
            address,
            symbol: String((symbolRes as unknown as [string])[0]),
            decimals: Number((decimalsRes as unknown as [number])[0]),
        };
        tokenInfoCache.set(lower, info);
        return info;
    } catch {
        const fallback: TokenInfo = {
            address,
            symbol: t('common.tokens'),
            decimals: 18,
        };
        tokenInfoCache.set(lower, fallback);
        return fallback;
    }
}
