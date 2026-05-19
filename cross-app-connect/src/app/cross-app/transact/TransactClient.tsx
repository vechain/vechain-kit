'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    LuChevronDown,
    LuChevronUp,
    LuShieldAlert,
    LuShieldCheck,
    LuShieldX,
} from 'react-icons/lu';
import type { IconType } from 'react-icons';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import type { VerifiedTransactionRequest } from '@privy-io/cross-app-provider/connect';
import { formatUnits } from 'viem';
import { useCrossAppClient } from '../_lib/client';
import { VechainHeader } from '../../components/VechainHeader';
import { AddressTag } from '../../components/AddressTag';
import { IdentityRow } from '../../components/IdentityRow';
import { truncateAddress } from '../_lib/format';
import { decodeClause, type DecodedClause } from '../_lib/decoder';
import { SignInPanel } from '../_components/SignInPanel';
import {
    getLastIdentity,
    labelFromPrivyUser,
    setLastIdentity,
} from '../_lib/lastIdentity';
import { getRecentProvider } from '../_lib/recent';
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

/**
 * Pull a usable message out of whatever the caught value happens to be.
 * SDK backends sometimes throw Errors with `message: ''`, sometimes plain
 * objects, sometimes strings. Without this helper the alert renders blank
 * and the user gets a dead-end screen with no idea what failed.
 */
function errorMessage(err: unknown, fallback: string): string {
    if (err instanceof Error && err.message.trim()) return err.message;
    if (typeof err === 'string' && err.trim()) return err;
    if (err && typeof err === 'object') {
        const m = (err as { message?: unknown }).message;
        if (typeof m === 'string' && m.trim()) return m;
    }
    return fallback;
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
    const { t } = useTranslation();
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
    const embedded = wallets.find((w) => w.walletClientType === 'privy');

    // Persist a friendly identity label whenever a user is active. Read
    // back on the "session expired" branch below so we can greet the user
    // by name and pre-highlight the right provider on re-login.
    useEffect(() => {
        if (!user) return;
        const label = labelFromPrivyUser(user);
        if (!label) return;
        setLastIdentity({ label, provider: getRecentProvider() ?? undefined });
    }, [user]);

    const [smartAccount, setSmartAccount] = useState<SmartAccountInfo | null>(
        null,
    );
    const [chainId, setChainId] = useState<string | null>(null);
    const [verified, setVerified] = useState<VerifiedTransactionRequest | null>(
        null,
    );
    const [parseError, setParseError] = useState<
        | { kind: 'no_params' }
        | { kind: 'invalid'; message: string }
        | { kind: 'connection_expired' }
        | null
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
                // "No connection found for requester" / "Connection has
                // expired" / "User ID mismatch" → the requester app encrypted
                // this payload with a connection record Privy no longer has
                // for this user. We can't recover inline (a fresh connection
                // would mint new keys that can't decrypt the existing
                // payload). The kit-using app listens for our postMessage
                // and routes the user through a fresh connect flow.
                const msg = errorMessage(e, '');
                const isStaleConnection =
                    /no connection|connection has expired|user id mismatch/i.test(
                        msg,
                    );
                if (isStaleConnection && typeof window !== 'undefined') {
                    try {
                        window.opener?.postMessage(
                            { type: 'vk:cross-app-no-connection' },
                            '*',
                        );
                    } catch {
                        /* opener cross-origin-blocked; ignore */
                    }
                }
                if (!cancelled)
                    setParseError(
                        isStaleConnection
                            ? { kind: 'connection_expired' }
                            : {
                                  kind: 'invalid',
                                  message:
                                      msg || t('transact.error.failedToRead'),
                              },
                    );
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [
        client,
        authenticated,
        user?.id,
        t,
    ]);

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
            setBlock(t('transact.block.unsupportedMethod', { method }));
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
                setBlock(t('transact.block.chainIdMismatch'));
                return;
            }
        } catch {
            setBlock(t('transact.block.invalidChainId'));
            return;
        }
        if (
            typedData.domain.verifyingContract.toLowerCase() !==
            smartAccount.address.toLowerCase()
        ) {
            setBlock(t('transact.block.smartAccountMismatch'));
            return;
        }
        setBlock(null);
    }, [verified, parsed, smartAccount?.address, chainId, t]);

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
                            title: t('transact.privyUi.signMessage'),
                            buttonText: t('transact.privyUi.signButton'),
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
                                    ? t('transact.privyUi.approveVeChainTx')
                                    : t('transact.privyUi.signStructuredData'),
                            buttonText: t('transact.privyUi.signButton'),
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
                e instanceof Error ? e.message : t('transact.error.failedToSign');
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
        // Stale-connection close path: there's no `verified` (decrypt
        // failed), so we have no callbackUrl to do a proper rejectRequest.
        // Instead, post a PRIVY_CROSS_APP_ACTION_ERROR with our marker
        // directly to the opener. Privy's SDK on the kit-using app side
        // listens for this type, rejects the pending sign promise with our
        // error string, and auto-closes this window. The kit then sees
        // "vk:cross-app-no-connection" in the rejection and runs the
        // disconnect + reopen-modal recovery — much more reliable than a
        // custom postMessage that requires our own listener to be live.
        if (parseError?.kind === 'connection_expired') {
            try {
                window.opener?.postMessage(
                    {
                        type: 'PRIVY_CROSS_APP_ACTION_ERROR',
                        error: 'vk:cross-app-no-connection',
                        errorCode: 4002,
                    },
                    '*',
                );
            } catch {
                /* opener gone; fall back to plain close */
            }
            window.close();
            return;
        }
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
    }, [client, verified, getAccessToken, parseError]);

    if (parseError?.kind === 'no_params') {
        return (
            <>
                <VechainHeader title={t('transact.title.noRequest')} />
                <div className={styles.card}>
                    <p className={styles.fallbackText}>
                        {t('transact.noRequestBody')}
                    </p>
                </div>
            </>
        );
    }

    if (!ready) {
        return (
            <>
                <VechainHeader title={t('transact.title.reviewing')} />
                <div className={styles.center}>
                    <div className={styles.spinner} />
                </div>
            </>
        );
    }

    if (!authenticated) {
        // Privy session expired (or first-time visitor). Skip Privy's modal
        // entirely and drive the headless login hooks through our own
        // SignInPanel. If we stashed an identity from a previous session,
        // greet the user with it and pre-highlight the provider they used
        // last — a cold re-login becomes a one-tap.
        const last = getLastIdentity();
        return (
            <>
                <VechainHeader
                    title={
                        last
                            ? t('transact.title.welcomeBack', {
                                  identity: last.label,
                              })
                            : t('transact.title.signIn')
                    }
                    subtitle={t('transact.subtitle.signInWaiting')}
                />
                <SignInPanel
                    intent={null}
                    onCancel={onReject}
                    presetRecent={last?.provider ?? null}
                />
            </>
        );
    }

    if (parseError?.kind === 'connection_expired') {
        // The kit-using app encrypted this payload with a connection that
        // Privy no longer has on file (TTL expired or first-time visitor).
        // Don't expose the raw "No connection found" string — it reads as
        // an internal error. Tell the user what actually happened and what
        // to do next. The parent app has already been notified via
        // postMessage and will re-prompt login on close.
        return (
            <>
                <VechainHeader
                    title={t('transact.title.connectionExpired')}
                    subtitle={t('transact.subtitle.connectionExpired')}
                />
                <div className={styles.card}>
                    <p className={styles.fallbackText}>
                        {t('transact.copy.connectionExpiredBody')}
                    </p>
                </div>
                <button
                    type="button"
                    className={styles.btnGhost}
                    onClick={onReject}
                >
                    {t('common.button.close')}
                </button>
            </>
        );
    }

    if (parseError?.kind === 'invalid') {
        // Two cards: the error alert + a way out. Without the close button
        // the user is stuck — no spinner moves, nothing's clickable, and
        // `window.close()` isn't reachable from anywhere on this screen.
        // `onReject` falls back to plain `window.close()` when there's no
        // verified request to send a reject postMessage to, which is
        // exactly the state we're in here.
        return (
            <>
                <VechainHeader title={t('transact.title.couldNotLoad')} />
                <div className={`${styles.alert} ${styles.alertError}`}>
                    {parseError.message ||
                        t('transact.error.failedToRead')}
                </div>
                <button
                    type="button"
                    className={styles.btnGhost}
                    onClick={onReject}
                >
                    {t('common.button.cancel')}
                </button>
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
                <VechainHeader title={t('transact.title.reviewing')} />
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
        ? t('transact.title.signMessage')
        : t('transact.title.signData');
    const subtitle = isSmartAccount
        ? decoded
            ? summarizeActions(decoded)
            : ''
        : parsed.kind === 'message'
        ? t('transact.subtitle.reviewMessage')
        : t('transact.subtitle.reviewData');
    const ctaLabel = isSmartAccount ? continueLabel(risk) : t('transact.button.sign');
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
                                {t('transact.section.actionsToApprove')}
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
                            {t('transact.alert.unverifiedStep')}
                        </div>
                    )}

                    {!blocked && !hasUnknown && hasUnlimitedApprove && (
                        <div className={`${styles.alert} ${styles.alertWarn}`}>
                            {t('transact.alert.unlimitedApprove')}
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
                        {submitting ? t('transact.button.signing') : ctaLabel}
                    </button>
                    <button
                        type="button"
                        className={styles.btnGhost}
                        onClick={onReject}
                        disabled={submitting}
                    >
                        {t('common.button.cancel')}
                    </button>

                    <div className={styles.inspectRow}>
                        <span className={styles.muted}>
                            {t('transact.inspect.prompt')}
                        </span>
                        <button
                            type="button"
                            className={styles.linkBtn}
                            onClick={() => setInspectOpen((s) => !s)}
                        >
                            {inspectOpen
                                ? t('transact.inspect.hide')
                                : t('transact.inspect.show')}
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
                                label={t('transact.detail.yourAccount')}
                                value={
                                    accountChipAddress
                                        ? truncateAddress(accountChipAddress)
                                        : t('transact.detail.resolving')
                                }
                            />
                            <DetailRow
                                label={t('transact.detail.network')}
                                value={networkLabel(networkType, t)}
                            />
                            {parsed.kind === 'smart_account' && (
                                <>
                                    <DetailRow
                                        label={t('transact.detail.type')}
                                        value={humanPrimaryType(
                                            parsed.typedData.primaryType,
                                        )}
                                    />
                                    <div className={styles.clauseStack}>
                                        <p className={styles.typedHead}>
                                            {parsed.clauses.length === 1
                                                ? t('transact.detail.clauseSingular')
                                                : t('transact.detail.clausePlural', { count: parsed.clauses.length })}
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
                                        label={t('transact.detail.type')}
                                        value={humanPrimaryType(
                                            parsed.typedData.primaryType,
                                        )}
                                    />
                                    {parsed.typedData.domain.name && (
                                        <DetailRow
                                            label={t('transact.detail.domain')}
                                            value={parsed.typedData.domain.name}
                                        />
                                    )}
                                    <RawJsonBlock
                                        label={t('transact.detail.rawData')}
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
                                    label={t('transact.detail.rawHex')}
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
    const { t } = useTranslation();
    return (
        <div className={styles.subPanel}>
            <p className={styles.subPanelLabel}>{t('transact.detail.message')}</p>
            <p className={styles.messageBody}>
                {message || t('transact.detail.emptyMessage')}
            </p>
        </div>
    );
}

/**
 * Render a typed-data message as labelled key/value rows instead of a raw
 * JSON dump. Uses the EIP-712 `types` schema to drive per-field rendering:
 *   - `address` → AddressTag (avatar, domain, truncated hex)
 *   - `bool` → Yes / No
 *   - bytes / numbers → monospace
 *   - nested struct types → recurse with a left-bar indent
 *   - arrays → bullet list
 * The full raw JSON is still available in the Inspect panel below.
 */
function TypedDataView({ typedData }: { typedData: GenericTypedData }) {
    const fields = typedData.types[typedData.primaryType] ?? [];
    return (
        <div className={styles.subPanel}>
            <p className={styles.typedHead}>
                {humanPrimaryType(typedData.primaryType)}
            </p>
            {typedData.domain.name && (
                <p className={styles.typedFrom}>From: {typedData.domain.name}</p>
            )}
            <div className={styles.typedFields}>
                {fields.length > 0 ? (
                    fields.map((f) => (
                        <TypedField
                            key={f.name}
                            label={f.name}
                            type={f.type}
                            value={(typedData.message as Record<string, unknown>)[f.name]}
                            types={typedData.types}
                        />
                    ))
                ) : (
                    // No schema → fall back to JSON so we don't render nothing.
                    <pre className={styles.code}>
                        {JSON.stringify(typedData.message, null, 2)}
                    </pre>
                )}
            </div>
        </div>
    );
}

function TypedField({
    label,
    type,
    value,
    types,
}: {
    label: string;
    type: string;
    value: unknown;
    types: Record<string, Array<{ name: string; type: string }>>;
}) {
    return (
        <div className={styles.typedField}>
            <span className={styles.typedFieldLabel}>
                {humanizeFieldName(label)}
            </span>
            <div className={styles.typedFieldValue}>
                <TypedValue type={type} value={value} types={types} />
            </div>
        </div>
    );
}

function TypedValue({
    type,
    value,
    types,
}: {
    type: string;
    value: unknown;
    types: Record<string, Array<{ name: string; type: string }>>;
}) {
    const { t } = useTranslation();

    // Array type: render each entry recursively.
    if (type.endsWith('[]')) {
        const elemType = type.slice(0, -2);
        const arr = Array.isArray(value) ? value : [];
        if (arr.length === 0) {
            return (
                <span style={{ color: 'var(--text-subtle)' }}>
                    {t('common.empty')}
                </span>
            );
        }
        return (
            <ul className={styles.typedFieldList}>
                {arr.map((entry, i) => (
                    <li key={i}>
                        <TypedValue type={elemType} value={entry} types={types} />
                    </li>
                ))}
            </ul>
        );
    }

    // Nested struct: recurse into its fields with an indented sub-block.
    const nestedFields = types[type];
    if (nestedFields && typeof value === 'object' && value !== null) {
        return (
            <div className={styles.typedFieldNested}>
                {nestedFields.map((f) => (
                    <TypedField
                        key={f.name}
                        label={f.name}
                        type={f.type}
                        value={(value as Record<string, unknown>)[f.name]}
                        types={types}
                    />
                ))}
            </div>
        );
    }

    // Primitives.
    if (type === 'address' && typeof value === 'string') {
        return <AddressTag address={value} kind="recipient" />;
    }
    if (type === 'bool') {
        return <span>{value ? t('common.yes') : t('common.no')}</span>;
    }
    if (type === 'string') {
        return <span>{String(value)}</span>;
    }
    if (
        type.startsWith('bytes') ||
        type.startsWith('uint') ||
        type.startsWith('int')
    ) {
        return (
            <span className={styles.typedFieldMono}>
                {value === undefined || value === null ? '' : String(value)}
            </span>
        );
    }
    // Unknown type — stringify but flag visually.
    return (
        <span className={styles.typedFieldMono}>{JSON.stringify(value)}</span>
    );
}

// "myFieldName" → "My field name". Leaves abbreviations and snake_case alone
// where possible; the goal is to read as a label, not a variable identifier.
function humanizeFieldName(name: string): string {
    if (!name) return '';
    const spaced = name
        .replace(/_/g, ' ')
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .toLowerCase();
    return spaced.charAt(0).toUpperCase() + spaced.slice(1);
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
    const { t } = useTranslation();
    switch (action.kind) {
        case 'native_transfer':
        case 'token_transfer':
            return (
                <p className={styles.actionDetail}>
                    <span className={styles.actionDetailLabel}>
                        {t('transact.detail.to')}
                    </span>
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
                    <span className={styles.actionDetailLabel}>
                        {t('transact.detail.spender')}
                    </span>
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
                        <span className={styles.actionDetailLabel}>
                            {t('transact.detail.to')}
                        </span>
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
                        <span className={styles.actionDetailLabel}>
                            {t('transact.detail.operator')}
                        </span>
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
                        {t('transact.detail.function', { signature: action.signature })}
                    </p>
                );
            }
            if (action.selector) {
                return (
                    <p className={styles.actionDetail}>
                        {t('transact.detail.selector', { selector: action.selector })}
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
    const { t } = useTranslation();
    const [showRaw, setShowRaw] = useState(false);
    const valueWei = parseValueOrZero(clause.value);
    const hasValue = valueWei > BigInt(0);
    const hasData = Boolean(clause.data) && clause.data !== '0x';
    return (
        <div className={styles.subPanel}>
            <div className={styles.clauseHeader}>
                <span className={styles.detailLabel}>
                    {t('transact.detail.clauseLabel', {
                        index: index + 1,
                        total,
                    })}
                </span>
                <AddressTag address={clause.to} />
            </div>
            {hasValue && (
                <DetailRow
                    label={t('transact.detail.value')}
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
                        {showRaw
                            ? t('transact.inspect.hideCalldata')
                            : t('transact.inspect.showCalldata')}
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

function networkLabel(
    type: string,
    t: (key: string) => string,
): string {
    switch (type) {
        case 'main':
            return t('transact.network.mainnet');
        case 'test':
            return t('transact.network.testnet');
        case 'solo':
            return t('transact.network.solo');
        default:
            return type;
    }
}
