'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    LuChevronDown,
    LuChevronUp,
    LuShieldAlert,
    LuShieldCheck,
    LuShieldX,
} from 'react-icons/lu';
import type { IconType } from 'react-icons';
import { useLogin, usePrivy, useWallets } from '@privy-io/react-auth';
import type { VerifiedTransactionRequest } from '@privy-io/cross-app-provider/connect';
import { formatUnits } from 'viem';
import { useCrossAppClient } from '../_lib/client';
import { VechainHeader } from '../../components/VechainHeader';
import { AddressTag } from '../../components/AddressTag';
import { IdentityRow } from '../../components/IdentityRow';
import { truncateAddress } from '../_lib/format';
import { decodeClause, type DecodedClause } from '../_lib/decoder';
import {
    computeRisk,
    continueLabel,
    humanPrimaryType,
    summarizeActions,
    titleForActions,
    type Risk,
} from '../_lib/labels';
import {
    getChainId,
    getSmartAccountAddress,
    networkType,
    thor,
    type SmartAccountInfo,
} from '../_lib/thor';
import styles from './transact.module.css';

const RISK_SHIELD: Record<
    Risk,
    { Icon: IconType; color: string }
> = {
    safe: { Icon: LuShieldCheck, color: 'var(--accent)' },
    caution: { Icon: LuShieldAlert, color: 'var(--warn)' },
    danger: { Icon: LuShieldX, color: 'var(--danger)' },
};

const SUPPORTED_METHODS = [
    'eth_signTypedData_v4',
    'personal_sign',
] as const;
const SMART_ACCOUNT_PRIMARY_TYPES = [
    'ExecuteWithAuthorization',
    'ExecuteBatchWithAuthorization',
] as const;

type Clause = {
    to: string;
    value: string;
    data: string;
};

type SmartAccountTypedData = {
    domain: {
        name: string;
        version: string;
        chainId: string | number;
        verifyingContract: string;
    };
    types: Record<string, Array<{ name: string; type: string }>>;
    primaryType: string;
    message: Record<string, unknown> & {
        to: string | string[];
        value: string | string[];
        data: string | string[];
        validAfter: string | number;
        validBefore: string | number;
    };
};

type GenericTypedData = {
    domain: {
        name?: string;
        version?: string;
        chainId?: string | number;
        verifyingContract?: string;
    };
    types: Record<string, Array<{ name: string; type: string }>>;
    primaryType: string;
    message: Record<string, unknown>;
};

type ParsedRequest =
    | {
          kind: 'smart_account';
          typedData: SmartAccountTypedData;
          clauses: Clause[];
      }
    | { kind: 'typed_data'; typedData: GenericTypedData }
    | { kind: 'message'; message: string; raw: string };

// Decode hex-encoded message payloads back to UTF-8 so the user sees the
// actual text being signed, not 0x6f6e6c79... For non-hex strings, pass
// through as-is.
function decodePersonalSignMessage(raw: string): string {
    if (typeof raw !== 'string') return '';
    if (!raw.startsWith('0x')) return raw;
    try {
        const hex = raw.slice(2);
        const bytes = new Uint8Array(
            hex.match(/.{1,2}/g)?.map((b) => parseInt(b, 16)) ?? [],
        );
        return new TextDecoder('utf-8', { fatal: false }).decode(bytes);
    } catch {
        return raw;
    }
}

function parseClauses(typedData: SmartAccountTypedData): Clause[] {
    const { to, value, data } = typedData.message;
    if (Array.isArray(to)) {
        const values = (value as string[]) ?? [];
        const datas = (data as string[]) ?? [];
        return to.map((t, i) => ({
            to: t,
            value: String(values[i] ?? '0'),
            data: datas[i] ?? '0x',
        }));
    }
    return [
        {
            to: to as string,
            value: String(value ?? '0'),
            data: (data as string) ?? '0x',
        },
    ];
}


export function TransactClient() {
    const client = useCrossAppClient();
    const {
        ready,
        authenticated,
        user,
        signTypedData,
        signMessage,
        getAccessToken,
    } = usePrivy();
    const { wallets } = useWallets();
    const { login } = useLogin();
    const embedded = wallets.find((w) => w.walletClientType === 'privy');

    const [smartAccount, setSmartAccount] = useState<SmartAccountInfo | null>(
        null,
    );
    const [chainId, setChainId] = useState<string | null>(null);
    const [verified, setVerified] = useState<VerifiedTransactionRequest | null>(
        null,
    );
    const [parseError, setParseError] = useState<
        { kind: 'no_params' } | { kind: 'invalid'; message: string } | null
    >(null);
    const [block, setBlock] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [decoded, setDecoded] = useState<DecodedClause[] | null>(null);
    const [inspectOpen, setInspectOpen] = useState(false);

    // Smart account lookup once the embedded wallet is available.
    useEffect(() => {
        if (!embedded?.address) return;
        let ignore = false;
        getSmartAccountAddress(embedded.address)
            .then((r) => {
                if (!ignore) setSmartAccount(r);
            })
            .catch(() => {
                /* keep null; UI handles missing smart account */
            });
        return () => {
            ignore = true;
        };
    }, [embedded?.address]);

    // Chain id from the genesis block. Fires once.
    useEffect(() => {
        let ignore = false;
        getChainId()
            .then((id) => {
                if (!ignore) setChainId(id);
            })
            .catch(() => {
                /* keep null */
            });
        return () => {
            ignore = true;
        };
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (!window.location.search) {
            setParseError({ kind: 'no_params' });
        }
    }, []);

    useEffect(() => {
        if (!authenticated || !user?.id) return;
        if (typeof window !== 'undefined' && !window.location.search) return;
        let cancelled = false;
        (async () => {
            try {
                const data = await client.getVerifiedTransactionRequest({
                    userId: user.id,
                });
                if (!cancelled) setVerified(data);
            } catch (e) {
                if (!cancelled)
                    setParseError({
                        kind: 'invalid',
                        message:
                            e instanceof Error
                                ? e.message
                                : 'Failed to read request',
                    });
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [client, authenticated, user?.id]);

    const parsed = useMemo<ParsedRequest | null>(() => {
        if (!verified) return null;
        const { method, params } = verified.request;

        if (method === 'personal_sign') {
            const args = Array.isArray(params) ? params : [];
            const rawMessage = args.find(
                (p) =>
                    typeof p === 'string' &&
                    !/^0x[a-fA-F0-9]{40}$/.test(p),
            );
            if (typeof rawMessage !== 'string') return null;
            return {
                kind: 'message',
                message: decodePersonalSignMessage(rawMessage),
                raw: rawMessage,
            };
        }

        if (method === 'eth_signTypedData_v4') {
            const raw = Array.isArray(params) ? params[1] : undefined;
            const typedData =
                typeof raw === 'string' ? JSON.parse(raw) : raw;
            if (!typedData?.domain || !typedData?.message) return null;
            const primaryType = typedData.primaryType;
            const isSmartAccountAuth =
                SMART_ACCOUNT_PRIMARY_TYPES.includes(
                    primaryType as 'ExecuteWithAuthorization',
                ) &&
                typedData.domain?.name === 'Wallet' &&
                typedData.domain?.version === '1';
            if (isSmartAccountAuth) {
                return {
                    kind: 'smart_account',
                    typedData,
                    clauses: parseClauses(typedData),
                };
            }
            return { kind: 'typed_data', typedData };
        }

        return null;
    }, [verified]);

    useEffect(() => {
        if (!verified) {
            setBlock(null);
            return;
        }
        const method = verified.request?.method;
        if (
            !SUPPORTED_METHODS.includes(
                method as (typeof SUPPORTED_METHODS)[number],
            )
        ) {
            setBlock(`Unsupported method: ${method}`);
            return;
        }
        if (!parsed) {
            setBlock(null);
            return;
        }
        if (parsed.kind !== 'smart_account') {
            setBlock(null);
            return;
        }
        if (!smartAccount?.address || !chainId) {
            setBlock(null);
            return;
        }
        const { typedData } = parsed;
        try {
            if (BigInt(typedData.domain.chainId) !== BigInt(chainId)) {
                setBlock('Chain id mismatch');
                return;
            }
        } catch {
            setBlock('Invalid chain id in request');
            return;
        }
        if (
            typedData.domain.verifyingContract.toLowerCase() !==
            smartAccount.address.toLowerCase()
        ) {
            setBlock(
                'Smart account mismatch: the request is signing for a different smart account.',
            );
            return;
        }
        setBlock(null);
    }, [verified, parsed, smartAccount?.address, chainId]);

    // Decode each clause to a human-readable summary.
    useEffect(() => {
        if (parsed?.kind !== 'smart_account') {
            setDecoded(null);
            return;
        }
        const selfAddress = smartAccount?.address;
        let cancelled = false;
        (async () => {
            const results = await Promise.all(
                parsed.clauses.map((c) =>
                    decodeClause(c, thor, networkType, selfAddress),
                ),
            );
            if (!cancelled) setDecoded(results);
        })();
        return () => {
            cancelled = true;
        };
    }, [parsed, smartAccount?.address]);

    const onApprove = useCallback(async () => {
        if (!verified || !parsed) return;
        setSubmitting(true);
        setSubmitError(null);
        try {
            let signature: string;
            if (parsed.kind === 'message') {
                const result = await signMessage(
                    { message: parsed.message },
                    {
                        uiOptions: {
                            title: 'Sign message',
                            buttonText: 'Sign',
                        },
                    },
                );
                signature = result.signature;
            } else {
                const result = await signTypedData(
                    parsed.typedData as Parameters<typeof signTypedData>[0],
                    {
                        uiOptions: {
                            title:
                                parsed.kind === 'smart_account'
                                    ? 'Approve VeChain transaction'
                                    : 'Sign structured data',
                            buttonText: 'Sign',
                        },
                    },
                );
                signature = result.signature;
            }
            const accessToken = await getAccessToken();
            await client.handleRequestResult({
                accessToken: accessToken ?? undefined,
                result: signature,
                connection: verified.connection,
            });
            window.close();
        } catch (e) {
            const message =
                e instanceof Error ? e.message : 'Failed to sign request';
            setSubmitError(message);
            try {
                const accessToken = await getAccessToken();
                await client.handleError({
                    accessToken: accessToken ?? undefined,
                    error: e instanceof Error ? e : new Error(message),
                    callbackUrl: verified.connection.callbackUrl,
                    errorCode: 4001,
                });
            } catch {
                /* swallow; user can still close window manually */
            }
        } finally {
            setSubmitting(false);
        }
    }, [
        client,
        verified,
        parsed,
        signMessage,
        signTypedData,
        getAccessToken,
    ]);

    const onReject = useCallback(async () => {
        if (!verified) {
            window.close();
            return;
        }
        setSubmitting(true);
        try {
            const accessToken = await getAccessToken();
            await client.rejectRequest({
                accessToken: accessToken ?? undefined,
                callbackUrl: verified.connection.callbackUrl,
            });
        } finally {
            window.close();
        }
    }, [client, verified, getAccessToken]);

    if (parseError?.kind === 'no_params') {
        return (
            <>
                <VechainHeader title="No transaction request" />
                <div className={styles.card}>
                    <p className={styles.fallbackText}>
                        This page handles cross-app transaction requests from
                        other VeChain dApps. It can&apos;t be opened directly
                        &mdash; the requesting app will open it with the
                        parameters it needs.
                    </p>
                </div>
            </>
        );
    }

    if (!ready) {
        return (
            <>
                <VechainHeader title="Reviewing transaction" />
                <div className={styles.center}>
                    <div className={styles.spinner} />
                </div>
            </>
        );
    }

    if (!authenticated) {
        return (
            <>
                <VechainHeader
                    title="Sign in to continue"
                    subtitle="A signing request is waiting. Sign in to review it."
                />
                <div className={styles.card}>
                    <button
                        type="button"
                        className={styles.btnBrand}
                        onClick={() => login()}
                    >
                        Continue
                    </button>
                </div>
            </>
        );
    }

    if (parseError?.kind === 'invalid') {
        return (
            <>
                <VechainHeader title="Couldn't load request" />
                <div className={`${styles.alert} ${styles.alertError}`}>
                    {parseError.message}
                </div>
            </>
        );
    }

    // Keep the loading shell until *all* account info is ready: the
    // verified cross-app request, the parsed clause shape, AND the user's
    // smart-account address. Without the smart account we'd render a card
    // with a hole where the IdentityRow goes, then pop it in -- jarring.
    // Better to spin a beat longer and reveal the full UI in one frame.
    if (!verified || !parsed || !smartAccount?.address) {
        return (
            <>
                <VechainHeader title="Reviewing transaction" />
                <div className={styles.center}>
                    <div className={styles.spinner} />
                </div>
            </>
        );
    }

    const blocked = block !== null;
    const isSmartAccount = parsed.kind === 'smart_account';
    const stillDecoding = isSmartAccount && decoded === null;
    const hasUnknown =
        isSmartAccount && (decoded?.some((d) => d.kind === 'unknown') ?? false);
    const hasUnlimitedApprove =
        isSmartAccount &&
        (decoded?.some(
            (d) => d.kind === 'token_approve' && d.unlimited,
        ) ?? false);
    const risk: Risk = isSmartAccount ? computeRisk(decoded, blocked) : 'safe';
    const { Icon: ShieldIcon, color: shieldColor } = RISK_SHIELD[risk];
    const title = isSmartAccount
        ? titleForActions(decoded, blocked)
        : parsed.kind === 'message'
        ? 'Sign a message'
        : 'Sign data';
    const subtitle = isSmartAccount
        ? decoded
            ? summarizeActions(decoded)
            : 'Checking what this does…'
        : parsed.kind === 'message'
        ? 'Review the message this app wants you to sign.'
        : 'Review the data this app wants you to sign.';
    const ctaLabel = isSmartAccount ? continueLabel(risk) : 'Sign';
    // Always surface the smart account as "your account" -- it's the address
    // apps see on-chain and where the user's identity sits. The embedded EOA
    // is an implementation detail; for personal_sign / generic typed data
    // the signature comes from it, but the user thinks in terms of their
    // VeChain identity. We render the chip only once the smart account
    // resolves so we don't flash the embedded address first.
    const accountChipAddress = smartAccount?.address;
    const continueDisabled =
        blocked ||
        submitting ||
        (isSmartAccount && (!smartAccount?.address || stillDecoding));

    return (
        <>
            <VechainHeader
                title={title}
                titleIcon={ShieldIcon}
                titleIconColor={shieldColor}
                subtitle={subtitle}
                requesterUrl={verified.connection.callbackUrl}
            />
            <div className={styles.card}>
                <div className={styles.cardBody}>
                    {accountChipAddress && (
                        <IdentityRow
                            walletAddress={accountChipAddress}
                            user={user}
                        />
                    )}
                    {parsed.kind === 'smart_account' && (
                        <div className={styles.section}>
                            <p className={styles.sectionHeader}>
                                Actions to approve
                            </p>
                            {stillDecoding ? (
                                <div className={styles.actionList}>
                                    {parsed.clauses.map((_, i) => (
                                        <ActionRowSkeleton key={i} />
                                    ))}
                                </div>
                            ) : (
                                <div className={styles.actionList}>
                                    {decoded!.map((d, i) => (
                                        <ActionRow
                                            key={i}
                                            action={d}
                                            self={smartAccount?.address}
                                            index={
                                                decoded!.length > 1
                                                    ? i + 1
                                                    : undefined
                                            }
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                    {parsed.kind === 'message' && (
                        <MessageView message={parsed.message} />
                    )}
                    {parsed.kind === 'typed_data' && (
                        <TypedDataView typedData={parsed.typedData} />
                    )}

                    {blocked && (
                        <div className={`${styles.alert} ${styles.alertError}`}>
                            {block}
                        </div>
                    )}

                    {!blocked && hasUnknown && (
                        <div className={`${styles.alert} ${styles.alertWarn}`}>
                            We couldn&rsquo;t double-check every step, so only
                            continue if you trust this app.
                        </div>
                    )}

                    {!blocked && !hasUnknown && hasUnlimitedApprove && (
                        <div className={`${styles.alert} ${styles.alertWarn}`}>
                            This app is asking for unlimited access to one of
                            your tokens — make sure you trust it.
                        </div>
                    )}

                    {submitError && (
                        <div className={`${styles.alert} ${styles.alertError}`}>
                            {submitError}
                        </div>
                    )}

                    <button
                        type="button"
                        className={styles.btnBrand}
                        onClick={onApprove}
                        disabled={continueDisabled}
                    >
                        {submitting ? 'Signing…' : ctaLabel}
                    </button>
                    <button
                        type="button"
                        className={styles.btnGhost}
                        onClick={onReject}
                        disabled={submitting}
                    >
                        Cancel
                    </button>

                    <div className={styles.inspectRow}>
                        <span className={styles.muted}>
                            Want the technical details?
                        </span>
                        <button
                            type="button"
                            className={styles.linkBtn}
                            onClick={() => setInspectOpen((s) => !s)}
                        >
                            {inspectOpen ? 'Hide' : 'Inspect'}
                            {inspectOpen ? (
                                <LuChevronUp size={12} />
                            ) : (
                                <LuChevronDown size={12} />
                            )}
                        </button>
                    </div>
                    <div
                        className={`${styles.collapse} ${
                            inspectOpen
                                ? styles.collapseOpen
                                : styles.collapseClosed
                        }`}
                    >
                        <div className={styles.detailsList}>
                            <DetailRow
                                label="Your account"
                                value={
                                    accountChipAddress
                                        ? truncateAddress(accountChipAddress)
                                        : 'resolving…'
                                }
                            />
                            <DetailRow
                                label="Network"
                                value={networkLabel(networkType)}
                            />
                            {parsed.kind === 'smart_account' && (
                                <>
                                    <DetailRow
                                        label="Type"
                                        value={humanPrimaryType(
                                            parsed.typedData.primaryType,
                                        )}
                                    />
                                    <div className={styles.clauseStack}>
                                        <p className={styles.typedHead}>
                                            {parsed.clauses.length === 1
                                                ? 'Clause'
                                                : `Clauses (${parsed.clauses.length})`}
                                        </p>
                                        {parsed.clauses.map((c, i) => (
                                            <RawClauseRow
                                                key={i}
                                                clause={c}
                                                index={i}
                                                total={parsed.clauses.length}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                            {parsed.kind === 'typed_data' && (
                                <>
                                    <DetailRow
                                        label="Type"
                                        value={humanPrimaryType(
                                            parsed.typedData.primaryType,
                                        )}
                                    />
                                    {parsed.typedData.domain.name && (
                                        <DetailRow
                                            label="Domain"
                                            value={parsed.typedData.domain.name}
                                        />
                                    )}
                                    <RawJsonBlock
                                        label="Raw data"
                                        value={JSON.stringify(
                                            parsed.typedData,
                                            null,
                                            2,
                                        )}
                                    />
                                </>
                            )}
                            {parsed.kind === 'message' && (
                                <RawJsonBlock
                                    label="Raw hex"
                                    value={parsed.raw}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

function MessageView({ message }: { message: string }) {
    return (
        <div className={styles.subPanel}>
            <p className={styles.subPanelLabel}>Message</p>
            <p className={styles.messageBody}>{message || '(empty message)'}</p>
        </div>
    );
}

function TypedDataView({ typedData }: { typedData: GenericTypedData }) {
    return (
        <div className={styles.subPanel}>
            <p className={styles.typedHead}>
                {humanPrimaryType(typedData.primaryType)}
            </p>
            {typedData.domain.name && (
                <p className={styles.typedFrom}>From: {typedData.domain.name}</p>
            )}
            <pre className={styles.code}>
                {JSON.stringify(typedData.message, null, 2)}
            </pre>
        </div>
    );
}

function RawJsonBlock({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p className={styles.typedHead}>{label}</p>
            <pre className={styles.codeBlock}>{value}</pre>
        </div>
    );
}

function ActionRowSkeleton() {
    return (
        <div className={styles.skeletonStack}>
            <div className={`${styles.skeletonBar} ${styles.skeletonBarLg}`} />
            <div className={`${styles.skeletonBar} ${styles.skeletonBarSm}`} />
        </div>
    );
}

function ActionRow({
    action,
    self,
    index,
}: {
    action: DecodedClause;
    self?: string;
    /** When set, renders a small numbered chip before the title. Used to
     *  visually frame multi-step batches as a sequence. */
    index?: number;
}) {
    const warn =
        action.kind === 'unknown' ||
        (action.kind === 'token_approve' &&
            (action as { unlimited: boolean }).unlimited);
    return (
        <div
            className={`${styles.actionRow} ${warn ? styles.actionRowWarn : ''}`}
        >
            {index !== undefined && (
                <span className={styles.actionStep}>{index}</span>
            )}
            <div className={styles.actionBody}>
                <p className={styles.actionTitle}>{action.summary}</p>
                <ActionRowDetail action={action} self={self} />
            </div>
        </div>
    );
}

function ActionRowDetail({
    action,
    self,
}: {
    action: DecodedClause;
    self?: string;
}) {
    switch (action.kind) {
        case 'native_transfer':
        case 'token_transfer':
            return (
                <p className={styles.actionDetail}>
                    <span className={styles.actionDetailLabel}>To</span>
                    <AddressTag
                        address={action.recipient}
                        self={self}
                        kind="recipient"
                    />
                </p>
            );
        case 'token_approve':
            return (
                <p className={styles.actionDetail}>
                    <span className={styles.actionDetailLabel}>Spender</span>
                    <AddressTag
                        address={action.spender}
                        self={self}
                        kind="contract"
                    />
                </p>
            );
        case 'known_action':
            if (action.recipient) {
                return (
                    <p className={styles.actionDetail}>
                        <span className={styles.actionDetailLabel}>To</span>
                        <AddressTag
                            address={action.recipient}
                            self={self}
                            kind="recipient"
                        />
                    </p>
                );
            }
            if (action.spender) {
                return (
                    <p className={styles.actionDetail}>
                        <span className={styles.actionDetailLabel}>Operator</span>
                        <AddressTag
                            address={action.spender}
                            self={self}
                            kind="contract"
                        />
                    </p>
                );
            }
            if (action.detail) {
                return (
                    <p className={styles.actionDetail}>{action.detail}</p>
                );
            }
            return null;
        case 'unknown':
            if (action.signature) {
                return (
                    <p className={styles.actionDetail}>
                        Function: {action.signature}
                    </p>
                );
            }
            if (action.selector) {
                return (
                    <p className={styles.actionDetail}>
                        Selector: {action.selector}
                    </p>
                );
            }
            return null;
        default:
            return null;
    }
}

function formatAmount(raw: bigint, decimals: number): string {
    const str = formatUnits(raw, decimals);
    if (!str.includes('.')) return str;
    const [whole, frac] = str.split('.');
    const trimmed = frac.replace(/0+$/, '').slice(0, 4);
    return trimmed.length === 0 ? whole : `${whole}.${trimmed}`;
}

function parseValueOrZero(value: string): bigint {
    if (!value) return BigInt(0);
    try {
        return BigInt(value);
    } catch {
        return BigInt(0);
    }
}

function RawClauseRow({
    clause,
    index,
    total,
}: {
    clause: { to: string; value: string; data: string };
    index: number;
    total: number;
}) {
    const [showRaw, setShowRaw] = useState(false);
    const valueWei = parseValueOrZero(clause.value);
    const hasValue = valueWei > BigInt(0);
    const hasData = Boolean(clause.data) && clause.data !== '0x';
    return (
        <div className={styles.subPanel}>
            <div className={styles.clauseHeader}>
                <span className={styles.detailLabel}>
                    Clause {index + 1} of {total} · to
                </span>
                <AddressTag address={clause.to} />
            </div>
            {hasValue && (
                <DetailRow
                    label="Value"
                    value={`${formatAmount(valueWei, 18)} VET`}
                />
            )}
            {hasData && (
                <div>
                    <button
                        type="button"
                        className={styles.linkBtn}
                        onClick={() => setShowRaw((s) => !s)}
                    >
                        {showRaw ? 'Hide raw calldata' : 'Show raw calldata'}
                        {showRaw ? (
                            <LuChevronUp size={12} />
                        ) : (
                            <LuChevronDown size={12} />
                        )}
                    </button>
                    <div
                        className={`${styles.collapse} ${
                            showRaw
                                ? styles.collapseOpen
                                : styles.collapseClosed
                        }`}
                    >
                        <pre className={styles.code}>{clause.data}</pre>
                    </div>
                </div>
            )}
        </div>
    );
}

function DetailRow({
    label,
    value,
}: {
    label: string;
    value: React.ReactNode;
}) {
    return (
        <div className={styles.detailRow}>
            <span className={styles.detailLabel}>{label}</span>
            {typeof value === 'string' ? (
                <span className={styles.detailValue}>{value}</span>
            ) : (
                value
            )}
        </div>
    );
}

function networkLabel(type: string): string {
    switch (type) {
        case 'main':
            return 'VeChain Mainnet';
        case 'test':
            return 'VeChain Testnet';
        case 'solo':
            return 'Local Thor Solo';
        default:
            return type;
    }
}
