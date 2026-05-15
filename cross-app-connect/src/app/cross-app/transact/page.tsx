'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Alert,
    AlertDescription,
    Box,
    Button,
    Card,
    CardBody,
    Center,
    Code,
    Collapse,
    Container,
    HStack,
    Icon,
    Skeleton,
    Spinner,
    Stack,
    Text,
    useDisclosure,
} from '@chakra-ui/react';
import {
    LuChevronDown,
    LuChevronUp,
    LuShieldAlert,
    LuShieldCheck,
    LuShieldX,
} from 'react-icons/lu';
import type { IconType } from 'react-icons';
import { useLogin, usePrivy, useWallets } from '@privy-io/react-auth';
import {
    useSmartAccount,
    useGetChainId,
    useVeChainKitConfig,
} from '@vechain/vechain-kit';
import { useThor } from '@vechain/dapp-kit-react';
import type { VerifiedTransactionRequest } from '@privy-io/cross-app-provider/connect';
import { useCrossAppClient } from '../_lib/client';
import { VechainHeader } from '../../components/VechainHeader';
import { AddressTag } from '../../components/AddressTag';
import { AccountChip } from '../../components/AccountChip';
import { decodeClause, type DecodedClause } from '../_lib/decoder';
import {
    computeRisk,
    continueLabel,
    humanPrimaryType,
    summarizeActions,
    titleForActions,
    uniqueTokensFromDecoded,
    type Risk,
} from '../_lib/labels';
import type { NETWORK_TYPE } from '../_lib/network-tokens';
import { formatUnits } from 'viem';
import type { AppConfig } from '@vechain/vechain-kit';

const RISK_SHIELD: Record<
    Risk,
    { Icon: IconType; color: string }
> = {
    safe: { Icon: LuShieldCheck, color: 'accent' },
    caution: { Icon: LuShieldAlert, color: 'orange.400' },
    danger: { Icon: LuShieldX, color: 'red.400' },
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

function truncate(addr: string): string {
    if (!addr || addr.length < 12) return addr;
    return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export default function CrossAppTransactPage() {
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
    const { data: smartAccount } = useSmartAccount(embedded?.address);
    const { data: kitChainId } = useGetChainId();
    const { network, appConfig } = useVeChainKitConfig();
    const thor = useThor();

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
    const inspect = useDisclosure();

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
            // wagmi sends params as [message, address]. Some libs reverse
            // them; accept either order by picking the first string-looking
            // entry that isn't a 20-byte address.
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
        // Only the smart-account ExecuteWithAuthorization path is subject to
        // the deep chain-id / verifyingContract safety gates. Plain
        // personal_sign and generic eth_signTypedData_v4 just need the user
        // to recognise what they're signing -- handled at the UI level.
        if (parsed.kind !== 'smart_account') {
            setBlock(null);
            return;
        }
        if (!smartAccount?.address || !kitChainId) {
            setBlock(null);
            return;
        }
        const { typedData } = parsed;
        try {
            if (BigInt(typedData.domain.chainId) !== BigInt(kitChainId)) {
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
    }, [verified, parsed, smartAccount?.address, kitChainId]);

    // Decode each clause to a human-readable summary. Fires once whenever
    // the parsed clauses change. Results cached in module-level Maps inside
    // decoder.ts so a re-render or a returning user doesn't re-fetch b32
    // signatures. Only smart-account requests have clauses to decode.
    useEffect(() => {
        if (parsed?.kind !== 'smart_account') {
            setDecoded(null);
            return;
        }
        let cancelled = false;
        (async () => {
            const results = await Promise.all(
                parsed.clauses.map((c) =>
                    decodeClause(
                        c,
                        thor ?? null,
                        network.type as NETWORK_TYPE,
                    ),
                ),
            );
            if (!cancelled) setDecoded(results);
        })();
        return () => {
            cancelled = true;
        };
    }, [parsed, thor, network.type]);

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
                // swallow; user can still close window manually
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
            <PageShell>
                <VechainHeader title="No transaction request" />
                <Card>
                    <CardBody>
                        <Text color="text-muted" textAlign="center">
                            This page handles cross-app transaction requests
                            from other VeChain dApps. It can&apos;t be opened
                            directly &mdash; the requesting app will open it
                            with the parameters it needs.
                        </Text>
                    </CardBody>
                </Card>
            </PageShell>
        );
    }

    if (!ready) {
        return (
            <PageShell>
                <VechainHeader title="Review transaction" />
                <Center py={10}>
                    <Spinner color="accent" />
                </Center>
            </PageShell>
        );
    }

    if (!authenticated) {
        return (
            <PageShell>
                <VechainHeader
                    title="Sign in to continue"
                    subtitle="A signing request is waiting. Sign in to review it."
                />
                <Card>
                    <CardBody>
                        <Button
                            variant="brand"
                            onClick={() => login()}
                            w="full"
                            h="48px"
                        >
                            Continue
                        </Button>
                    </CardBody>
                </Card>
            </PageShell>
        );
    }

    if (parseError?.kind === 'invalid') {
        return (
            <PageShell>
                <VechainHeader title="Couldn't load request" />
                <Alert status="error" rounded="md" variant="left-accent">
                    <AlertDescription fontSize="xs" lineHeight="1.3">
                        {parseError.message}
                    </AlertDescription>
                </Alert>
            </PageShell>
        );
    }

    if (!verified || !parsed) {
        return (
            <PageShell>
                <VechainHeader title="Review transaction" />
                <Center py={10}>
                    <Spinner color="accent" />
                </Center>
            </PageShell>
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
    const risk: Risk = isSmartAccount
        ? computeRisk(decoded, blocked)
        : 'safe';
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
    const ctaLabel = isSmartAccount
        ? continueLabel(risk)
        : 'Sign';
    const relevantTokens = isSmartAccount
        ? uniqueTokensFromDecoded(decoded)
        : [];
    const accountChipAddress = isSmartAccount
        ? smartAccount?.address
        : embedded?.address;
    const continueDisabled =
        blocked ||
        submitting ||
        (isSmartAccount && (!smartAccount?.address || stillDecoding));

    return (
        <PageShell>
            <VechainHeader
                title={title}
                titleIcon={ShieldIcon}
                titleIconColor={shieldColor}
                subtitle={subtitle}
                requesterUrl={verified.connection.callbackUrl}
            />
            <Card>
                <CardBody>
                    <Stack spacing={4}>
                        {accountChipAddress && (
                            <AccountChip
                                address={accountChipAddress}
                                thor={thor ?? null}
                                relevantTokens={relevantTokens}
                            />
                        )}
                        {parsed.kind === 'smart_account' &&
                            (stillDecoding ? (
                                <Stack spacing={3}>
                                    {parsed.clauses.map((_, i) => (
                                        <ActionRowSkeleton key={i} />
                                    ))}
                                </Stack>
                            ) : (
                                <Stack spacing={3}>
                                    {decoded!.map((d, i) => (
                                        <ActionRow
                                            key={i}
                                            action={d}
                                            appConfig={appConfig}
                                            self={smartAccount?.address}
                                        />
                                    ))}
                                </Stack>
                            ))}
                        {parsed.kind === 'message' && (
                            <MessageView message={parsed.message} />
                        )}
                        {parsed.kind === 'typed_data' && (
                            <TypedDataView typedData={parsed.typedData} />
                        )}

                        {blocked && (
                            <Alert
                                status="error"
                                rounded="md"
                                variant="left-accent"
                            >
                                <AlertDescription
                                    fontSize="xs"
                                    lineHeight="1.3"
                                >
                                    {block}
                                </AlertDescription>
                            </Alert>
                        )}

                        {!blocked && hasUnknown && (
                            <Alert
                                status="warning"
                                rounded="md"
                                variant="left-accent"
                            >
                                <AlertDescription
                                    fontSize="xs"
                                    lineHeight="1.3"
                                >
                                    We couldn’t double-check every step, so
                                    only continue if you trust this app.
                                </AlertDescription>
                            </Alert>
                        )}

                        {!blocked &&
                            !hasUnknown &&
                            hasUnlimitedApprove && (
                                <Alert
                                    status="warning"
                                    rounded="md"
                                    variant="left-accent"
                                >
                                    <AlertDescription
                                        fontSize="xs"
                                        lineHeight="1.3"
                                    >
                                        This app is asking for unlimited
                                        access to one of your tokens — make
                                        sure you trust it.
                                    </AlertDescription>
                                </Alert>
                            )}

                        {submitError && (
                            <Alert
                                status="error"
                                rounded="md"
                                variant="left-accent"
                            >
                                <AlertDescription
                                    fontSize="xs"
                                    lineHeight="1.3"
                                >
                                    {submitError}
                                </AlertDescription>
                            </Alert>
                        )}

                        <Button
                            variant="brand"
                            onClick={onApprove}
                            isLoading={submitting}
                            isDisabled={continueDisabled}
                            w="full"
                            h="48px"
                        >
                            {ctaLabel}
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={onReject}
                            isDisabled={submitting}
                            w="full"
                        >
                            Cancel
                        </Button>

                        <HStack
                            justify="center"
                            align="center"
                            spacing={1}
                            pt={1}
                        >
                            <Text fontSize="xs" color="text-subtle">
                                Want the technical details?
                            </Text>
                            <Button
                                variant="link"
                                size="sm"
                                onClick={inspect.onToggle}
                                rightIcon={
                                    <Icon
                                        as={
                                            inspect.isOpen
                                                ? LuChevronUp
                                                : LuChevronDown
                                        }
                                        boxSize="12px"
                                    />
                                }
                            >
                                {inspect.isOpen ? 'Hide' : 'Inspect'}
                            </Button>
                        </HStack>
                        <Collapse in={inspect.isOpen} animateOpacity>
                            <Stack spacing={3} mt={2}>
                                <DetailRow
                                    label="Your account"
                                    value={
                                        accountChipAddress
                                            ? truncate(accountChipAddress)
                                            : 'resolving…'
                                    }
                                />
                                <DetailRow
                                    label="Network"
                                    value={networkLabel(network.type)}
                                />
                                {parsed.kind === 'smart_account' && (
                                    <>
                                        <DetailRow
                                            label="Type"
                                            value={humanPrimaryType(
                                                parsed.typedData.primaryType,
                                            )}
                                        />
                                        <Stack spacing={2}>
                                            <Text
                                                fontSize="xs"
                                                color="text-subtle"
                                                textTransform="uppercase"
                                                letterSpacing="0.05em"
                                            >
                                                {parsed.clauses.length === 1
                                                    ? 'Clause'
                                                    : `Clauses (${parsed.clauses.length})`}
                                            </Text>
                                            {parsed.clauses.map((c, i) => (
                                                <RawClauseRow
                                                    key={i}
                                                    clause={c}
                                                    index={i}
                                                    total={
                                                        parsed.clauses.length
                                                    }
                                                    appConfig={appConfig}
                                                />
                                            ))}
                                        </Stack>
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
                                                value={
                                                    parsed.typedData.domain
                                                        .name
                                                }
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
                            </Stack>
                        </Collapse>
                    </Stack>
                </CardBody>
            </Card>
        </PageShell>
    );
}

function MessageView({ message }: { message: string }) {
    return (
        <Box
            p={3}
            rounded="md"
            bg="card-elevated-bg"
            borderWidth="1px"
            borderColor="card-border"
        >
            <Text
                fontSize="xs"
                color="text-subtle"
                textTransform="uppercase"
                letterSpacing="0.05em"
                mb={2}
            >
                Message
            </Text>
            <Text
                fontSize="sm"
                color="text-strong"
                whiteSpace="pre-wrap"
                wordBreak="break-word"
            >
                {message || '(empty message)'}
            </Text>
        </Box>
    );
}

function TypedDataView({ typedData }: { typedData: GenericTypedData }) {
    return (
        <Box
            p={3}
            rounded="md"
            bg="card-elevated-bg"
            borderWidth="1px"
            borderColor="card-border"
        >
            <Stack spacing={2}>
                <Text
                    fontSize="xs"
                    color="text-subtle"
                    textTransform="uppercase"
                    letterSpacing="0.05em"
                >
                    {humanPrimaryType(typedData.primaryType)}
                </Text>
                {typedData.domain.name && (
                    <Text fontSize="xs" color="text-muted">
                        From: {typedData.domain.name}
                    </Text>
                )}
                <Code
                    fontSize="xs"
                    bg="transparent"
                    color="text-strong"
                    whiteSpace="pre-wrap"
                    wordBreak="break-word"
                    display="block"
                    p={0}
                >
                    {JSON.stringify(typedData.message, null, 2)}
                </Code>
            </Stack>
        </Box>
    );
}

function RawJsonBlock({ label, value }: { label: string; value: string }) {
    return (
        <Stack spacing={2}>
            <Text
                fontSize="xs"
                color="text-subtle"
                textTransform="uppercase"
                letterSpacing="0.05em"
            >
                {label}
            </Text>
            <Code
                fontSize="xs"
                bg="card-elevated-bg"
                color="text-muted"
                whiteSpace="pre-wrap"
                wordBreak="break-all"
                display="block"
                p={3}
                rounded="md"
                borderWidth="1px"
                borderColor="card-border"
            >
                {value}
            </Code>
        </Stack>
    );
}

function ActionRowSkeleton() {
    return (
        <Stack
            spacing={1}
            pl={3}
            borderLeftWidth="2px"
            borderLeftColor="card-border"
        >
            <Skeleton
                height="16px"
                width="55%"
                rounded="sm"
                startColor="login-btn-hover-bg"
                endColor="card-border"
            />
            <Skeleton
                height="12px"
                width="35%"
                rounded="sm"
                startColor="login-btn-hover-bg"
                endColor="card-border"
            />
        </Stack>
    );
}

function ActionRow({
    action,
    appConfig,
    self,
}: {
    action: DecodedClause;
    appConfig?: AppConfig;
    self?: string;
}) {
    // Strong type carries the action -- no leading icon needed. A subtle
    // left border tinted by risk gives at-a-glance scanning without the
    // round icon container reading as decorative chrome.
    const accent =
        action.kind === 'unknown'
            ? 'orange.400'
            : action.kind === 'token_approve' &&
              (action as { unlimited: boolean }).unlimited
            ? 'orange.400'
            : 'card-border';
    return (
        <Stack
            spacing={0}
            pl={3}
            borderLeftWidth="2px"
            borderLeftColor={accent}
        >
            <Text fontWeight={600} color="text-strong">
                {action.summary}
            </Text>
            <ActionRowDetail
                action={action}
                appConfig={appConfig}
                self={self}
            />
        </Stack>
    );
}

function ActionRowDetail({
    action,
    appConfig,
    self,
}: {
    action: DecodedClause;
    appConfig?: AppConfig;
    self?: string;
}) {
    switch (action.kind) {
        case 'native_transfer':
        case 'token_transfer':
            return (
                <HStack spacing={1.5} fontSize="sm" color="text-muted">
                    <Text>To</Text>
                    <AddressTag
                        address={action.recipient}
                        appConfig={appConfig}
                        self={self}
                        kind="recipient"
                    />
                </HStack>
            );
        case 'token_approve':
            return (
                <HStack spacing={1.5} fontSize="sm" color="text-muted">
                    <Text>Spender:</Text>
                    <AddressTag
                        address={action.spender}
                        appConfig={appConfig}
                        self={self}
                        kind="contract"
                    />
                </HStack>
            );
        case 'unknown':
            if (action.signature) {
                return (
                    <Text fontSize="sm" color="text-muted">
                        Function: {action.signature}
                    </Text>
                );
            }
            if (action.selector) {
                return (
                    <Text fontSize="sm" color="text-muted">
                        Selector: {action.selector}
                    </Text>
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
    appConfig,
}: {
    clause: { to: string; value: string; data: string };
    index: number;
    total: number;
    appConfig?: AppConfig;
}) {
    const showRaw = useDisclosure();
    const valueWei = parseValueOrZero(clause.value);
    const hasValue = valueWei > BigInt(0);
    const hasData = Boolean(clause.data) && clause.data !== '0x';
    return (
        <Box
            p={3}
            rounded="md"
            bg="card-elevated-bg"
            borderWidth="1px"
            borderColor="card-border"
        >
            <Stack spacing={2}>
                <HStack justify="space-between" align="center">
                    <Text fontSize="xs" color="text-subtle">
                        Clause {index + 1} of {total} · to
                    </Text>
                    <AddressTag
                        address={clause.to}
                        appConfig={appConfig}
                    />
                </HStack>
                {hasValue && (
                    <DetailRow
                        label="Value"
                        value={
                            <Text fontSize="xs" color="text-muted">
                                {formatAmount(valueWei, 18)} VET
                            </Text>
                        }
                    />
                )}
                {hasData && (
                    <Box>
                        <Button
                            variant="link"
                            size="sm"
                            onClick={showRaw.onToggle}
                            rightIcon={
                                <Icon
                                    as={
                                        showRaw.isOpen
                                            ? LuChevronUp
                                            : LuChevronDown
                                    }
                                    boxSize="12px"
                                />
                            }
                        >
                            {showRaw.isOpen
                                ? 'Hide raw calldata'
                                : 'Show raw calldata'}
                        </Button>
                        <Collapse in={showRaw.isOpen} animateOpacity>
                            <Code
                                mt={2}
                                fontSize="xs"
                                bg="transparent"
                                color="text-muted"
                                whiteSpace="pre-wrap"
                                wordBreak="break-all"
                                display="block"
                            >
                                {clause.data}
                            </Code>
                        </Collapse>
                    </Box>
                )}
            </Stack>
        </Box>
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
        <HStack justify="space-between" align="center">
            <Text fontSize="xs" color="text-subtle">
                {label}
            </Text>
            {typeof value === 'string' ? (
                <Text fontFamily="mono" fontSize="xs" color="text-muted">
                    {value}
                </Text>
            ) : (
                value
            )}
        </HStack>
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

function PageShell({ children }: { children: React.ReactNode }) {
    return (
        <Container maxW="md" py={8}>
            <Stack spacing={6}>{children}</Stack>
        </Container>
    );
}
