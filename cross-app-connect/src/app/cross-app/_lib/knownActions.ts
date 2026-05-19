/**
 * Registry of well-known ecosystem function calls — VeChain Kit domains,
 * VeBetterDAO governance, ERC-721/1155 transfers, etc. The decoder
 * consults this BEFORE the b32 fallback, so common operations users
 * trigger through our own hooks get a plain-language summary and the
 * transact page can stop firing the "we couldn't double-check this" warning
 * on functionality we ship.
 *
 * Adding a new known action: append an entry below. Either pin it to a
 * specific contract address (via `contractField`, which maps to
 * `appConfig.ts`) or leave the address open for patterns that appear on
 * many contracts (ERC-721 transfers, setApprovalForAll, etc.).
 *
 * The `decode` callback receives the typed args and must return a
 * `KnownAction` describing what the user sees. Keep summaries imperative
 * and free of jargon: "Set your primary VeChain domain", not "Call
 * setName on ReverseRegistrar".
 */
import { decodeFunctionData, parseAbi, formatUnits, type Abi } from 'viem';
import { knownContracts, type KnownContracts } from './appConfig';
import i18n from '../../i18n/config';

const t = i18n.t.bind(i18n);

export type KnownActionCategory =
    | 'domain'
    | 'governance'
    | 'rewards'
    | 'nft'
    | 'token'
    | 'staking'
    | 'swap'
    | 'fee';

/**
 * Structured side-channel that travels alongside the localized summary so
 * batch-level title/subtitle logic in `labels.ts` can read facts about a
 * clause without parsing localized text back out. Populate the fields a
 * given action genuinely produces; leave the rest undefined.
 */
export type KnownActionData = {
    // Domain
    setPrimaryName?: string;
    removePrimary?: boolean;
    // Governance
    voteSupport?: 'for' | 'against' | 'abstain';
    allocationAppCount?: number;
    endorse?: boolean;
    // Rewards
    rewardCycle?: string;
    rewardRound?: string;
    // Token conversion (B3TR ↔ VOT3)
    convertAmount?: string;
    convertFrom?: string;
    convertTo?: string;
    // DEX
    dex?: string;
};

export type KnownAction = {
    summary: string;
    detail?: string;
    category: KnownActionCategory;
    recipient?: string;
    spender?: string;
    data?: KnownActionData;
};

type DecodeContext = {
    self?: string;
};

type Pattern = {
    /** When set, this entry only applies to calls TO this kit-known contract. */
    contractField?: keyof KnownContracts;
    abi: Abi;
    decoders: Record<
        string,
        (args: readonly unknown[], ctx: DecodeContext) => KnownAction | null
    >;
};

// --- VET Domains -----------------------------------------------------------

const reverseRegistrarPattern: Pattern = {
    contractField: 'vetDomainsReverseRegistrarAddress',
    abi: parseAbi(['function setName(string name)']),
    decoders: {
        setName: ([name]) => {
            const v = String(name ?? '');
            if (v === '') {
                return {
                    summary: t('action.domain.removePrimary'),
                    category: 'domain',
                    data: { removePrimary: true },
                };
            }
            return {
                summary: t('action.domain.setPrimary', { name: v }),
                category: 'domain',
                data: { setPrimaryName: v },
            };
        },
    },
};

const publicResolverPattern: Pattern = {
    contractField: 'vetDomainsPublicResolverAddress',
    abi: parseAbi([
        'function setAddr(bytes32 node, address addr)',
        'function setText(bytes32 node, string key, string value)',
    ]),
    decoders: {
        setAddr: ([, addr], ctx) => {
            const a = String(addr ?? '').toLowerCase();
            const self = ctx.self?.toLowerCase();
            if (self && a === self) {
                return {
                    summary: t('action.domain.pointToYou'),
                    category: 'domain',
                };
            }
            return {
                summary: t('action.domain.updateAddress'),
                detail: t('action.domain.newTarget', { addr }),
                category: 'domain',
                recipient: String(addr ?? ''),
            };
        },
        setText: ([, key, value]) => {
            const k = String(key ?? '');
            const v = String(value ?? '');
            const label = friendlyTextRecordKey(k);
            if (v === '') {
                return {
                    summary: t('action.domain.removeRecord', { label }),
                    category: 'domain',
                };
            }
            // Short, readable values (a Twitter handle, a name) inline well
            // in the summary. Opaque identifiers (IPFS hashes, data URLs,
            // long hex) are noise -- "Update avatar" is enough, the raw
            // value is meaningless to a human anyway.
            if (isReadableValue(v)) {
                return {
                    summary: t('action.domain.setRecordTo', { label, value: v }),
                    category: 'domain',
                };
            }
            return {
                summary: t('action.domain.updateRecord', { label }),
                category: 'domain',
            };
        },
    },
};

const subdomainClaimerPattern: Pattern = {
    contractField: 'veWorldSubdomainClaimerContractAddress',
    abi: parseAbi(['function claim(string subdomain, address resolver)']),
    decoders: {
        claim: ([subdomain]) => ({
            summary: t('action.domain.claim', { subdomain: String(subdomain) }),
            category: 'domain',
            // The cascade ends with a setName for the new primary, which
            // already populates setPrimaryName. Subtitle uses that.
        }),
    },
};

// --- VeBetterDAO governance -------------------------------------------------

const governorPattern: Pattern = {
    contractField: 'b3trGovernorAddress',
    abi: parseAbi([
        'function castVote(uint256 proposalId, uint8 support)',
        'function castVoteWithReason(uint256 proposalId, uint8 support, string reason)',
    ]),
    decoders: {
        castVote: ([, support]) => {
            const vote = voteKey(Number(support));
            return {
                summary: t('action.governance.voteOnProposal', {
                    vote: voteLabel(vote),
                }),
                category: 'governance',
                data: { voteSupport: vote },
            };
        },
        castVoteWithReason: ([, support, reason]) => {
            const vote = voteKey(Number(support));
            return {
                summary: t('action.governance.voteOnProposal', {
                    vote: voteLabel(vote),
                }),
                detail: t('action.governance.reason', {
                    reason: String(reason ?? ''),
                }),
                category: 'governance',
                data: { voteSupport: vote },
            };
        },
    },
};

const xAllocationVotingPattern: Pattern = {
    contractField: 'xAllocationVotingContractAddress',
    abi: parseAbi([
        'function castVote(uint256 roundId, bytes32[] appsIds, uint256[] voteWeights)',
    ]),
    decoders: {
        castVote: ([, appsIds]) => {
            const count = Array.isArray(appsIds) ? appsIds.length : 0;
            return {
                summary:
                    count === 1
                        ? t('action.governance.allocateSingle')
                        : t('action.governance.allocateMany', { count }),
                category: 'governance',
                data: { allocationAppCount: count },
            };
        },
    },
};

const x2EarnAppsPattern: Pattern = {
    contractField: 'x2EarnAppsContractAddress',
    abi: parseAbi([
        'function endorseApp(bytes32 appId, uint256 nodeId)',
        'function unendorseApp(bytes32 appId, uint256 nodeId)',
    ]),
    decoders: {
        endorseApp: () => ({
            summary: t('action.governance.endorse'),
            category: 'governance',
            data: { endorse: true },
        }),
        unendorseApp: () => ({
            summary: t('action.governance.unendorse'),
            category: 'governance',
            data: { endorse: true },
        }),
    },
};

// --- B3TR / VOT3 conversion -------------------------------------------------

const vot3Pattern: Pattern = {
    contractField: 'vot3ContractAddress',
    abi: parseAbi([
        // VOT3 wraps B3TR. `convertToVOT3` locks B3TR and mints VOT3;
        // `convertToB3TR` burns VOT3 to release B3TR.
        'function convertToVOT3(uint256 amount)',
        'function convertToB3TR(uint256 amount)',
    ]),
    decoders: {
        convertToVOT3: ([amount]) => {
            const amt = trimUnits(amount as bigint, 18);
            return {
                summary: t('action.token.convertToVot3', { amount: amt }),
                category: 'token',
                data: {
                    convertAmount: amt,
                    convertFrom: 'B3TR',
                    convertTo: 'VOT3',
                },
            };
        },
        convertToB3TR: ([amount]) => {
            const amt = trimUnits(amount as bigint, 18);
            return {
                summary: t('action.token.convertToB3tr', { amount: amt }),
                category: 'token',
                data: {
                    convertAmount: amt,
                    convertFrom: 'VOT3',
                    convertTo: 'B3TR',
                },
            };
        },
    },
};

// --- Rewards ----------------------------------------------------------------

const voterRewardsPattern: Pattern = {
    contractField: 'voterRewardsContractAddress',
    abi: parseAbi(['function claimReward(uint256 cycle, address user)']),
    decoders: {
        claimReward: ([cycle]) => {
            const c = String(cycle);
            return {
                summary: t('action.rewards.voter', { cycle: c }),
                category: 'rewards',
                data: { rewardCycle: c },
            };
        },
    },
};

const xAllocationPoolPattern: Pattern = {
    contractField: 'xAllocationPoolContractAddress',
    abi: parseAbi(['function claim(uint256 roundId, bytes32 appId)']),
    decoders: {
        claim: ([roundId]) => {
            const r = String(roundId);
            return {
                summary: t('action.rewards.allocation', { round: r }),
                category: 'rewards',
                data: { rewardRound: r },
            };
        },
    },
};

// --- DEX routers ----------------------------------------------------------

const DEX_ROUTERS: Array<{
    field: keyof KnownContracts;
    name: string;
}> = [
    { field: 'betterSwapRouterAddress', name: 'BetterSwap' },
    { field: 'veTradeRouterAddress', name: 'VeTrade' },
    { field: 'veTradeCustomRouterAddress', name: 'VeTrade' },
];

export function isDexRouterAddress(address: string): boolean {
    const lower = address.toLowerCase();
    return DEX_ROUTERS.some(({ field }) => {
        const v = knownContracts[field];
        return typeof v === 'string' && v.toLowerCase() === lower;
    });
}

export function dexRouterName(address: string): string | null {
    const lower = address.toLowerCase();
    for (const { field, name } of DEX_ROUTERS) {
        const v = knownContracts[field];
        if (typeof v === 'string' && v.toLowerCase() === lower) return name;
    }
    return null;
}

const UNISWAP_V2_ROUTER_ABI = parseAbi([
    'function swapExactETHForTokens(uint256 amountOutMin, address[] path, address to, uint256 deadline) payable',
    'function swapETHForExactTokens(uint256 amountOut, address[] path, address to, uint256 deadline) payable',
    'function swapExactTokensForETH(uint256 amountIn, uint256 amountOutMin, address[] path, address to, uint256 deadline)',
    'function swapTokensForExactETH(uint256 amountOut, uint256 amountInMax, address[] path, address to, uint256 deadline)',
    'function swapExactTokensForTokens(uint256 amountIn, uint256 amountOutMin, address[] path, address to, uint256 deadline)',
    'function swapTokensForExactTokens(uint256 amountOut, uint256 amountInMax, address[] path, address to, uint256 deadline)',
]);

function uniswapV2RouterPattern(field: keyof KnownContracts): Pattern {
    const swap = (): KnownAction => {
        const dex = routerNameForField(field);
        return {
            summary: t('action.swap.onDex', { dex }),
            category: 'swap',
            data: { dex },
        };
    };
    return {
        contractField: field,
        abi: UNISWAP_V2_ROUTER_ABI,
        decoders: {
            swapExactETHForTokens: swap,
            swapETHForExactTokens: swap,
            swapExactTokensForETH: swap,
            swapTokensForExactETH: swap,
            swapExactTokensForTokens: swap,
            swapTokensForExactTokens: swap,
        },
    };
}

function routerNameForField(field: keyof KnownContracts): string {
    const entry = DEX_ROUTERS.find((d) => d.field === field);
    return entry?.name ?? 'a DEX';
}

// --- Address-bound patterns ------------------------------------------------

const CONTRACT_PATTERNS: Pattern[] = [
    uniswapV2RouterPattern('betterSwapRouterAddress'),
    uniswapV2RouterPattern('veTradeRouterAddress'),
    reverseRegistrarPattern,
    publicResolverPattern,
    subdomainClaimerPattern,
    governorPattern,
    xAllocationVotingPattern,
    x2EarnAppsPattern,
    vot3Pattern,
    voterRewardsPattern,
    xAllocationPoolPattern,
];

// --- Address-agnostic patterns (NFTs etc.) ---------------------------------

const ERC721_TRANSFER_ABI = parseAbi([
    'function safeTransferFrom(address from, address to, uint256 tokenId)',
    'function safeTransferFrom(address from, address to, uint256 tokenId, bytes data)',
    'function transferFrom(address from, address to, uint256 tokenId)',
]);
const ERC1155_TRANSFER_ABI = parseAbi([
    'function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes data)',
    'function safeBatchTransferFrom(address from, address to, uint256[] ids, uint256[] amounts, bytes data)',
]);
const APPROVAL_FOR_ALL_ABI = parseAbi([
    'function setApprovalForAll(address operator, bool approved)',
]);
const ERC20_TRANSFER_FROM_ABI = parseAbi([
    'function transferFrom(address from, address to, uint256 amount)',
]);

const GLOBAL_PATTERNS: Pattern[] = [
    {
        abi: ERC721_TRANSFER_ABI,
        decoders: {
            safeTransferFrom: (args) => {
                const to = String(args[1] ?? '');
                return {
                    summary: t('action.nft.send'),
                    detail: t('action.nft.toDetail', { to }),
                    category: 'nft',
                    recipient: to,
                };
            },
            transferFrom: (args) => {
                const to = String(args[1] ?? '');
                return {
                    summary: t('action.nft.transfer'),
                    detail: t('action.nft.toDetail', { to }),
                    category: 'nft',
                    recipient: to,
                };
            },
        },
    },
    {
        abi: ERC1155_TRANSFER_ABI,
        decoders: {
            safeTransferFrom: (args) => {
                const to = String(args[1] ?? '');
                const amount = args[3] as bigint;
                return {
                    summary:
                        (amount ?? BigInt(0)) > BigInt(1)
                            ? t('action.nft.sendEditions', {
                                  count: Number(amount),
                              })
                            : t('action.nft.send'),
                    detail: t('action.nft.toDetail', { to }),
                    category: 'nft',
                    recipient: to,
                };
            },
            safeBatchTransferFrom: (args) => {
                const to = String(args[1] ?? '');
                const ids = args[2] as readonly unknown[];
                const count = Array.isArray(ids) ? ids.length : 0;
                return {
                    summary: t('action.nft.sendBatch', { count }),
                    detail: t('action.nft.toDetail', { to }),
                    category: 'nft',
                    recipient: to,
                };
            },
        },
    },
    {
        abi: APPROVAL_FOR_ALL_ABI,
        decoders: {
            setApprovalForAll: ([operator, approved]) => {
                const op = String(operator ?? '');
                if (approved) {
                    return {
                        summary: t('action.nft.approveAll'),
                        detail: t('action.nft.operatorDetail', { operator: op }),
                        category: 'nft',
                        spender: op,
                    };
                }
                return {
                    summary: t('action.nft.revokeAll'),
                    detail: t('action.nft.operatorDetail', { operator: op }),
                    category: 'nft',
                    spender: op,
                };
            },
        },
    },
    {
        abi: ERC20_TRANSFER_FROM_ABI,
        decoders: {
            transferFrom: ([, to]) => ({
                summary: t('action.token.pullFrom'),
                detail: t('action.token.recipientDetail', {
                    to: String(to ?? ''),
                }),
                category: 'token',
                recipient: String(to ?? ''),
            }),
        },
    },
];

// --- Recognizer ------------------------------------------------------------

export function recognizeKnownAction(
    to: string,
    data: string,
    ctx: DecodeContext,
): KnownAction | null {
    if (!data || data === '0x' || data.length < 10) return null;
    const lowerTo = to.toLowerCase();

    // Address-bound patterns first — they're authoritative when they match.
    for (const pattern of CONTRACT_PATTERNS) {
        if (!pattern.contractField) continue;
        const expected = knownContracts[pattern.contractField];
        if (typeof expected !== 'string') continue;
        if (expected.toLowerCase() !== lowerTo) continue;
        const hit = tryDecode(pattern, data, ctx);
        if (hit) return hit;
    }

    // Address-agnostic patterns (NFTs etc).
    for (const pattern of GLOBAL_PATTERNS) {
        const hit = tryDecode(pattern, data, ctx);
        if (hit) return hit;
    }

    // DEX router catch-all: if the call targets a known router but the
    // calldata didn't match any Uniswap V2 selector (e.g. VeTrade's custom
    // router has non-standard signatures), we still recognise the intent
    // and surface a meaningful summary instead of "Interact with contract".
    const dex = dexRouterName(to);
    if (dex) {
        return {
            summary: t('action.swap.onDex', { dex }),
            category: 'swap',
            data: { dex },
        };
    }

    return null;
}

function tryDecode(
    pattern: Pattern,
    data: string,
    ctx: DecodeContext,
): KnownAction | null {
    try {
        const decoded = decodeFunctionData({
            abi: pattern.abi,
            data: data as `0x${string}`,
        });
        const fn = pattern.decoders[decoded.functionName];
        if (!fn) return null;
        return fn(decoded.args as readonly unknown[], ctx);
    } catch {
        return null;
    }
}

// --- Helpers ---------------------------------------------------------------

// True if the value is short enough and not an opaque blob (IPFS hash,
// Arweave URI, data URL, raw hex). Used to decide whether to inline a
// `setText` value in the summary or hide it behind the detail line.
function isReadableValue(v: string): boolean {
    if (v.length > 40) return false;
    if (/^(ipfs|ipns|ar|data):/i.test(v)) return false;
    if (/^0x[0-9a-fA-F]{16,}$/.test(v)) return false;
    return true;
}

function friendlyTextRecordKey(key: string): string {
    switch (key) {
        case 'avatar':
            return t('domains.label.avatar');
        case 'description':
            return t('domains.label.description');
        case 'email':
            return t('domains.label.email');
        case 'url':
            return t('domains.label.website');
        case 'com.twitter':
        case 'twitter':
            return t('domains.label.twitter');
        case 'com.github':
        case 'github':
            return t('domains.label.github');
        case 'org.telegram':
        case 'telegram':
            return t('domains.label.telegram');
        default:
            return t('domains.label.fallback', { key });
    }
}

function voteKey(support: number): 'for' | 'against' | 'abstain' {
    switch (support) {
        case 0:
            return 'against';
        case 1:
            return 'for';
        case 2:
            return 'abstain';
        default:
            return 'for';
    }
}

function voteLabel(key: 'for' | 'against' | 'abstain'): string {
    return t(`vote.${key}`);
}

function trimUnits(raw: bigint, decimals: number): string {
    if (raw === undefined || raw === null) return '0';
    const str = formatUnits(raw, decimals);
    if (!str.includes('.')) return str;
    const [whole, frac] = str.split('.');
    const cap = whole === '0' ? 4 : 2;
    const trimmed = frac.replace(/0+$/, '').slice(0, cap);
    return trimmed.length === 0 ? whole : `${whole}.${trimmed}`;
}
