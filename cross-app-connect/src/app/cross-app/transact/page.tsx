'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Alert,
    AlertDescription,
    AlertIcon,
    Badge,
    Box,
    Button,
    Card,
    CardBody,
    CardHeader,
    Center,
    Code,
    Container,
    Divider,
    Heading,
    HStack,
    Spinner,
    Stack,
    Text,
} from '@chakra-ui/react';
import { useLogin, usePrivy, useWallets } from '@privy-io/react-auth';
import { useSmartAccount, useGetChainId } from '@vechain/vechain-kit';
import type { VerifiedTransactionRequest } from '@privy-io/cross-app-provider/connect';
import { useCrossAppClient } from '../_lib/client';

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

    const [verified, setVerified] = useState<VerifiedTransactionRequest | null>(
        null,
    );
    const [parseError, setParseError] = useState<
        { kind: 'no_params' } | { kind: 'invalid'; message: string } | null
    >(null);
    const [block, setBlock] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

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
                <Card variant="filled">
                    <CardHeader>
                        <Heading size="md">No transaction request</Heading>
                    </CardHeader>
                    <CardBody>
                        <Text>
                            This page handles cross-app transaction requests
                            from other VeChain dApps. It cannot be opened
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
                <Center py={10}>
                    <Spinner />
                </Center>
            </PageShell>
        );
    }

    if (!authenticated) {
        return (
            <PageShell>
                <Card variant="filled">
                    <CardHeader>
                        <Heading size="md">Sign in to continue</Heading>
                    </CardHeader>
                    <CardBody>
                        <Stack spacing={4}>
                            <Text>
                                A signing request is waiting. Sign in to
                                review it.
                            </Text>
                            <Button
                                colorScheme="blue"
                                onClick={() => login()}
                            >
                                Continue
                            </Button>
                        </Stack>
                    </CardBody>
                </Card>
            </PageShell>
        );
    }

    if (parseError?.kind === 'invalid') {
        return (
            <PageShell>
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
                <Center py={10}>
                    <Spinner />
                </Center>
            </PageShell>
        );
    }

    const blocked = block !== null;

    return (
        <PageShell>
            <Card variant="filled">
                <CardHeader>
                    <HStack justify="space-between">
                        <Heading size="md">Review transaction</Heading>
                        <Badge colorScheme="purple">
                            {parsed.typedData.primaryType}
                        </Badge>
                    </HStack>
                </CardHeader>
                <CardBody>
                    <Stack spacing={4}>
                        {blocked && (
                            <Alert status="error" rounded="md">
                                <AlertIcon />
                                <AlertDescription>{block}</AlertDescription>
                            </Alert>
                        )}
                        <Box>
                            <Text fontSize="sm" color="gray.400">
                                Smart account
                            </Text>
                            <Text fontFamily="mono" fontSize="sm">
                                {smartAccount?.address ?? 'resolving…'}
                            </Text>
                        </Box>
                        <Divider />
                        <Stack spacing={3}>
                            {parsed.clauses.map((c, i) => (
                                <Box
                                    key={i}
                                    p={3}
                                    rounded="md"
                                    borderWidth="1px"
                                    borderColor="whiteAlpha.200"
                                >
                                    <Stack spacing={1}>
                                        <HStack justify="space-between">
                                            <Text fontSize="sm" color="gray.400">
                                                Clause {i + 1} · to
                                            </Text>
                                            <Code fontSize="xs">
                                                {truncate(c.to)}
                                            </Code>
                                        </HStack>
                                        {c.value && c.value !== '0' && (
                                            <HStack justify="space-between">
                                                <Text
                                                    fontSize="sm"
                                                    color="gray.400"
                                                >
                                                    value
                                                </Text>
                                                <Code fontSize="xs">
                                                    {c.value}
                                                </Code>
                                            </HStack>
                                        )}
                                        {c.data && c.data !== '0x' && (
                                            <Box>
                                                <Text
                                                    fontSize="sm"
                                                    color="gray.400"
                                                >
                                                    data
                                                </Text>
                                                <Code
                                                    fontSize="xs"
                                                    whiteSpace="pre-wrap"
                                                    wordBreak="break-all"
                                                >
                                                    {c.data.length > 80
                                                        ? `${c.data.slice(0, 80)}…`
                                                        : c.data}
                                                </Code>
                                            </Box>
                                        )}
                                    </Stack>
                                </Box>
                            ))}
                        </Stack>
                        {submitError && (
                            <Alert status="error" rounded="md">
                                <AlertIcon />
                                <AlertDescription>
                                    {submitError}
                                </AlertDescription>
                            </Alert>
                        )}
                        <HStack pt={2}>
                            <Button
                                colorScheme="blue"
                                onClick={onApprove}
                                isLoading={submitting}
                                isDisabled={blocked || !smartAccount?.address}
                                flex={1}
                            >
                                Approve
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={onReject}
                                isDisabled={submitting}
                                flex={1}
                            >
                                Reject
                            </Button>
                        </HStack>
                    </Stack>
                </CardBody>
            </Card>
        </PageShell>
    );
}

function PageShell({ children }: { children: React.ReactNode }) {
    return (
        <Container maxW="lg" py={12}>
            {children}
        </Container>
    );
}
