'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Alert,
    AlertDescription,
    AlertIcon,
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
    Spinner,
    Stack,
    Text,
    useDisclosure,
} from '@chakra-ui/react';
import {
    LuArrowUpRight,
    LuChevronDown,
    LuChevronUp,
    LuCircleAlert,
    LuCircleHelp,
    LuShieldCheck,
} from 'react-icons/lu';
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
import { simulateClauses, type Simulation } from '../_lib/simulate';
import { humanPrimaryType, summarizeActions } from '../_lib/labels';
import type { NETWORK_TYPE } from '../_lib/network-tokens';
import { formatUnits } from 'viem';
import type { AppConfig } from '@vechain/vechain-kit';

const SUPPORTED_METHODS = ['eth_signTypedData_v4'] as const;
const SUPPORTED_PRIMARY_TYPES = [
    'ExecuteWithAuthorization',
    'ExecuteBatchWithAuthorization',
] as const;

type Clause = {
    to: string;
    value: string;
    data: string;
};

type ParsedRequest = {
    typedData: {
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
    clauses: Clause[];
};

function parseClauses(
    typedData: ParsedRequest['typedData'],
): Clause[] {
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
    const { ready, authenticated, user, signTypedData, getAccessToken } =
        usePrivy();
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
    const [simulation, setSimulation] = useState<Simulation | null>(null);
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
        if (!SUPPORTED_METHODS.includes(method as 'eth_signTypedData_v4')) {
            return null;
        }
        const raw = Array.isArray(params) ? params[1] : undefined;
        const typedData =
            typeof raw === 'string' ? JSON.parse(raw) : raw;
        if (!typedData?.domain || !typedData?.message) return null;
        return {
            typedData,
            clauses: parseClauses(typedData),
        };
    }, [verified]);

    useEffect(() => {
        if (!verified || !parsed || !smartAccount?.address || !kitChainId) {
            setBlock(null);
            return;
        }
        const { method } = verified.request;
        if (!SUPPORTED_METHODS.includes(method as 'eth_signTypedData_v4')) {
            setBlock(`Unsupported method: ${method}`);
            return;
        }
        const { typedData } = parsed;
        if (
            !SUPPORTED_PRIMARY_TYPES.includes(
                typedData.primaryType as
                    | 'ExecuteWithAuthorization'
                    | 'ExecuteBatchWithAuthorization',
            )
        ) {
            setBlock(`Unsupported primaryType: ${typedData.primaryType}`);
            return;
        }
        if (
            typedData.domain.name !== 'Wallet' ||
            typedData.domain.version !== '1'
        ) {
            setBlock('Unexpected EIP-712 domain');
            return;
        }
        try {
            if (
                BigInt(typedData.domain.chainId) !== BigInt(kitChainId)
            ) {
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
    // signatures.
    useEffect(() => {
        if (!parsed) {
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

    // Simulate balance changes once we've decoded the clauses and resolved
    // the smart-account address. Async so the UI can show "Checking balance
    // changes..." while the Thor reads are in flight.
    useEffect(() => {
        if (!decoded || !thor || !smartAccount?.address) {
            setSimulation(null);
            return;
        }
        let cancelled = false;
        (async () => {
            const result = await simulateClauses(
                decoded,
                smartAccount.address,
                thor,
            );
            if (!cancelled) setSimulation(result);
        })();
        return () => {
            cancelled = true;
        };
    }, [decoded, thor, smartAccount?.address]);

    const onApprove = useCallback(async () => {
        if (!verified || !parsed) return;
        setSubmitting(true);
        setSubmitError(null);
        try {
            const { signature } = await signTypedData(
                parsed.typedData as Parameters<typeof signTypedData>[0],
                {
                    uiOptions: {
                        title: 'Approve VeChain transaction',
                        buttonText: 'Sign',
                    },
                },
            );
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
    }, [client, verified, parsed, signTypedData, getAccessToken]);

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
                <Alert status="error" rounded="md">
                    <AlertIcon />
                    <AlertDescription>{parseError.message}</AlertDescription>
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
    const stillDecoding = decoded === null;
    const hasUnknown =
        decoded?.some((d) => d.kind === 'unknown') ?? false;
    const hasUnlimitedApprove =
        decoded?.some(
            (d) => d.kind === 'token_approve' && d.unlimited,
        ) ?? false;

    return (
        <PageShell>
            <VechainHeader
                title="Confirm action"
                titleIcon={LuShieldCheck}
                subtitle={
                    decoded
                        ? summarizeActions(decoded)
                        : 'Checking what this does…'
                }
                requesterUrl={verified.connection.callbackUrl}
            />
            <Card>
                <CardBody>
                    <Stack spacing={5}>
                        {smartAccount?.address && (
                            <AccountChip
                                address={smartAccount.address}
                                thor={thor ?? null}
                            />
                        )}
                        {stillDecoding ? (
                            <Center py={6}>
                                <Spinner color="accent" size="sm" />
                            </Center>
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
                        )}

                        {decoded && (
                            <BalanceChangeSection
                                simulation={simulation}
                                hasUnknownAction={hasUnknown}
                            />
                        )}

                        {blocked && (
                            <Alert status="error" rounded="md">
                                <AlertIcon />
                                <AlertDescription>{block}</AlertDescription>
                            </Alert>
                        )}

                        {!blocked && hasUnknown && (
                            <Alert
                                status="warning"
                                rounded="md"
                                variant="left-accent"
                            >
                                <AlertIcon />
                                <AlertDescription fontSize="sm">
                                    We couldn&apos;t double-check every step
                                    here. Only continue if you trust this
                                    app.
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
                                    <AlertIcon />
                                    <AlertDescription fontSize="sm">
                                        This app is asking for unlimited
                                        access to one of your tokens. Make
                                        sure you trust it.
                                    </AlertDescription>
                                </Alert>
                            )}

                        {submitError && (
                            <Alert status="error" rounded="md">
                                <AlertIcon />
                                <AlertDescription>
                                    {submitError}
                                </AlertDescription>
                            </Alert>
                        )}

                        <Button
                            variant="brand"
                            onClick={onApprove}
                            isLoading={submitting}
                            isDisabled={
                                blocked ||
                                !smartAccount?.address ||
                                stillDecoding
                            }
                            w="full"
                        >
                            {hasUnknown ? 'Continue anyway' : 'Continue'}
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={onReject}
                            isDisabled={submitting}
                            w="full"
                        >
                            Cancel
                        </Button>

                        <Box pt={2}>
                            <Button
                                variant="link"
                                onClick={inspect.onToggle}
                                rightIcon={
                                    <Icon
                                        as={
                                            inspect.isOpen
                                                ? LuChevronUp
                                                : LuChevronDown
                                        }
                                        boxSize="14px"
                                    />
                                }
                            >
                                {inspect.isOpen
                                    ? 'Hide details'
                                    : 'Inspect details'}
                            </Button>
                            <Collapse in={inspect.isOpen} animateOpacity>
                                <Stack spacing={3} mt={3}>
                                    <DetailRow
                                        label="Your account"
                                        value={
                                            smartAccount?.address
                                                ? truncate(
                                                      smartAccount.address,
                                                  )
                                                : 'resolving…'
                                        }
                                    />
                                    <DetailRow
                                        label="Network"
                                        value={networkLabel(network.type)}
                                    />
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
                                                total={parsed.clauses.length}
                                                appConfig={appConfig}
                                            />
                                        ))}
                                    </Stack>
                                </Stack>
                            </Collapse>
                        </Box>
                    </Stack>
                </CardBody>
            </Card>
        </PageShell>
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
    const icon =
        action.kind === 'native_transfer' || action.kind === 'token_transfer'
            ? LuArrowUpRight
            : action.kind === 'token_approve'
            ? LuShieldCheck
            : LuCircleHelp;
    const accent =
        action.kind === 'unknown'
            ? 'orange.400'
            : action.kind === 'token_approve' &&
              (action as { unlimited: boolean }).unlimited
            ? 'orange.400'
            : 'text-strong';
    return (
        <HStack spacing={3} align="flex-start">
            <Box
                p={2}
                rounded="full"
                bg="login-btn-hover-bg"
                color={accent}
                mt="2px"
            >
                <Icon as={icon} boxSize="16px" />
            </Box>
            <Stack spacing={0} flex={1} minW={0}>
                <Text fontWeight={600} color="text-strong">
                    {action.summary}
                </Text>
                <ActionRowDetail
                    action={action}
                    appConfig={appConfig}
                    self={self}
                />
            </Stack>
        </HStack>
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

function BalanceChangeSection({
    simulation,
    hasUnknownAction,
}: {
    simulation: Simulation | null;
    hasUnknownAction: boolean;
}) {
    if (!simulation) {
        return (
            <Box
                p={3}
                rounded="md"
                bg="card-elevated-bg"
                borderWidth="1px"
                borderColor="card-border"
            >
                <HStack spacing={2}>
                    <Spinner size="xs" color="accent" />
                    <Text fontSize="sm" color="text-muted">
                        Checking how this affects your balance…
                    </Text>
                </HStack>
            </Box>
        );
    }
    if (simulation.changes.length === 0 && !simulation.unpredictable) {
        // Pure approval / pure read-only call -- nothing to preview.
        return null;
    }
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
                    Your wallet will
                </Text>
                {simulation.changes.length === 0 && (
                    <Text fontSize="sm" color="text-muted">
                        We couldn&apos;t predict what this changes in your
                        wallet. Only continue if you trust this app.
                    </Text>
                )}
                {simulation.changes.map((c) => (
                    <BalanceChangeRow
                        key={c.token.address}
                        change={c}
                    />
                ))}
                {simulation.unpredictable && simulation.changes.length > 0 && (
                    <Text fontSize="xs" color="text-subtle">
                        Other changes are possible — this app called
                        something we couldn&apos;t simulate.
                    </Text>
                )}
                {!hasUnknownAction && (
                    <Text fontSize="xs" color="text-subtle">
                        Network fees are covered for you.
                    </Text>
                )}
            </Stack>
        </Box>
    );
}

function BalanceChangeRow({ change }: { change: Simulation['changes'][number] }) {
    const { token, before, after, delta } = change;
    const sign = delta < BigInt(0) ? '-' : '+';
    const absDelta = delta < BigInt(0) ? -delta : delta;
    const deltaColor = delta < BigInt(0) ? 'red.400' : 'green.400';
    return (
        <HStack justify="space-between" align="center">
            <Text fontSize="sm" fontWeight={600} color="text-strong">
                {token.symbol}
            </Text>
            <HStack spacing={2} color="text-muted">
                <Text fontSize="sm" fontFamily="mono">
                    {formatAmount(before, token.decimals)}
                </Text>
                <Text fontSize="sm" color="text-subtle">
                    →
                </Text>
                <Text fontSize="sm" fontFamily="mono">
                    {formatAmount(after, token.decimals)}
                </Text>
                <Text
                    fontSize="xs"
                    fontWeight={600}
                    color={deltaColor}
                    minW="56px"
                    textAlign="right"
                >
                    {sign}
                    {formatAmount(absDelta, token.decimals)}
                </Text>
            </HStack>
        </HStack>
    );
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
