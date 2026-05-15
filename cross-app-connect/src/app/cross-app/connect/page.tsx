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
    CardHeader,
    Center,
    Container,
    Divider,
    Heading,
    HStack,
    Input,
    PinInput,
    PinInputField,
    Spinner,
    Stack,
    Text,
} from '@chakra-ui/react';
import {
    useLoginWithEmail,
    useLoginWithOAuth,
    usePrivy,
    useWallets,
} from '@privy-io/react-auth';
import { useCrossAppClient } from '../_lib/client';

type ConnectionRequest = ReturnType<
    ReturnType<typeof useCrossAppClient>['getConnectionRequestFromUrlParams']
>;

const OAUTH_PROVIDERS = [
    { id: 'google', label: 'Continue with Google' },
    { id: 'apple', label: 'Continue with Apple' },
    { id: 'twitter', label: 'Continue with X' },
    { id: 'discord', label: 'Continue with Discord' },
] as const;
type OAuthProvider = (typeof OAUTH_PROVIDERS)[number]['id'];

const INTENT_METHODS = [
    'google',
    'apple',
    'twitter',
    'discord',
    'email',
] as const;
type IntentMethod = (typeof INTENT_METHODS)[number];

function isIntent(value: string | null): value is IntentMethod {
    return !!value && (INTENT_METHODS as readonly string[]).includes(value);
}

export default function CrossAppConnectPage() {
    const client = useCrossAppClient();
    const { ready, authenticated, user, getAccessToken } = usePrivy();
    const { wallets } = useWallets();

    const [request, setRequest] = useState<ConnectionRequest | null>(null);
    const [parseError, setParseError] = useState<
        { kind: 'no_params' } | { kind: 'invalid'; message: string } | null
    >(null);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [autoLoginAttempted, setAutoLoginAttempted] = useState(false);

    useEffect(() => {
        const hasRequesterKey =
            typeof window !== 'undefined' &&
            new URL(window.location.href).searchParams.has(
                'requester_public_key',
            );
        if (!hasRequesterKey) {
            setParseError({ kind: 'no_params' });
            return;
        }
        try {
            setRequest(client.getConnectionRequestFromUrlParams());
        } catch (e) {
            setParseError({
                kind: 'invalid',
                message:
                    e instanceof Error
                        ? e.message
                        : 'Invalid connection request',
            });
        }
    }, [client]);

    const intent = useMemo(() => {
        if (typeof window === 'undefined') return null;
        const value = new URL(window.location.href).searchParams.get('intent');
        return isIntent(value) ? value : null;
    }, []);

    const embedded = wallets.find((w) => w.walletClientType === 'privy');

    const onAccept = useCallback(async () => {
        if (!request || !embedded || !user) return;
        setSubmitting(true);
        setSubmitError(null);
        try {
            const accessToken = await getAccessToken();
            if (!accessToken) throw new Error('Missing access token');
            await client.acceptConnection({
                accessToken,
                address: embedded.address,
                userId: user.id,
                connectionRequest: request,
            });
            window.close();
        } catch (e) {
            setSubmitError(
                e instanceof Error ? e.message : 'Failed to accept connection',
            );
        } finally {
            setSubmitting(false);
        }
    }, [client, request, embedded, user, getAccessToken]);

    const onReject = useCallback(async () => {
        if (!request) return;
        setSubmitting(true);
        try {
            const accessToken = await getAccessToken();
            await client.rejectConnection({
                accessToken: accessToken ?? undefined,
                callbackUrl: request.callbackUrl,
            });
        } finally {
            window.close();
        }
    }, [client, request, getAccessToken]);

    if (parseError?.kind === 'no_params') {
        return (
            <PageShell>
                <Card variant="filled">
                    <CardHeader>
                        <Heading size="md">No connection request</Heading>
                    </CardHeader>
                    <CardBody>
                        <Text>
                            This page handles cross-app connection requests
                            from other VeChain dApps. It cannot be opened
                            directly &mdash; the requesting app will open it
                            with the parameters it needs.
                        </Text>
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

    if (!ready || !request) {
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
                <SignInPanel
                    intent={intent}
                    autoLoginAttempted={autoLoginAttempted}
                    setAutoLoginAttempted={setAutoLoginAttempted}
                    onCancel={onReject}
                />
            </PageShell>
        );
    }

    return (
        <PageShell>
            <Card variant="filled">
                <CardHeader>
                    <Heading size="md">Connect to VeChain</Heading>
                </CardHeader>
                <CardBody>
                    <Stack spacing={4}>
                        <Box>
                            <Text fontSize="sm" color="gray.400">
                                Signed in as
                            </Text>
                            <Text fontWeight="semibold">
                                {user?.email?.address ??
                                    user?.google?.email ??
                                    user?.id}
                            </Text>
                        </Box>
                        <Box>
                            <Text fontSize="sm" color="gray.400">
                                Wallet
                            </Text>
                            <Text fontFamily="mono" fontSize="sm">
                                {embedded?.address ?? 'creating...'}
                            </Text>
                        </Box>
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
                                onClick={onAccept}
                                isLoading={submitting}
                                isDisabled={!embedded}
                                flex={1}
                            >
                                Connect
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={onReject}
                                isDisabled={submitting}
                                flex={1}
                            >
                                Cancel
                            </Button>
                        </HStack>
                    </Stack>
                </CardBody>
            </Card>
        </PageShell>
    );
}

function SignInPanel({
    intent,
    autoLoginAttempted,
    setAutoLoginAttempted,
    onCancel,
}: {
    intent: IntentMethod | null;
    autoLoginAttempted: boolean;
    setAutoLoginAttempted: (v: boolean) => void;
    onCancel: () => void;
}) {
    const { initOAuth, loading: oauthLoading } = useLoginWithOAuth({
        onError: (e) => setError(String(e)),
    });
    const {
        state: emailState,
        sendCode,
        loginWithCode,
    } = useLoginWithEmail();

    const [error, setError] = useState<string | null>(null);
    const [showEmail, setShowEmail] = useState<boolean>(intent === 'email');
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');

    // Persist the "already attempted" marker in sessionStorage so the OAuth
    // redirect back from Google (which preserves ?intent=google in the URL)
    // doesn't bounce the user straight back to Google again.
    useEffect(() => {
        if (!intent || intent === 'email') return;
        if (oauthLoading) return;
        if (autoLoginAttempted) return;
        const STORAGE_KEY = 'vk-cross-app-connect:oauth-attempted';
        if (
            typeof sessionStorage !== 'undefined' &&
            sessionStorage.getItem(STORAGE_KEY) === intent
        ) {
            setAutoLoginAttempted(true);
            return;
        }
        if (typeof sessionStorage !== 'undefined') {
            sessionStorage.setItem(STORAGE_KEY, intent);
        }
        setAutoLoginAttempted(true);
        initOAuth({ provider: intent as OAuthProvider }).catch((e) =>
            setError(String(e)),
        );
    }, [
        intent,
        oauthLoading,
        autoLoginAttempted,
        setAutoLoginAttempted,
        initOAuth,
    ]);

    const onOAuth = (provider: OAuthProvider) => {
        setError(null);
        initOAuth({ provider }).catch((e) => setError(String(e)));
    };

    const onSendCode = async () => {
        setError(null);
        try {
            await sendCode({ email });
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to send code');
        }
    };

    const onSubmitCode = async () => {
        setError(null);
        try {
            await loginWithCode({ code });
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to verify code');
        }
    };

    const awaitingCode = emailState.status === 'awaiting-code-input';
    const sendingCode = emailState.status === 'sending-code';
    const submittingCode = emailState.status === 'submitting-code';

    return (
        <Card variant="filled">
            <CardHeader>
                <Heading size="md">Sign in to VeChain</Heading>
            </CardHeader>
            <CardBody>
                <Stack spacing={3}>
                    {error && (
                        <Alert status="error" rounded="md">
                            <AlertIcon />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {!showEmail && (
                        <Stack spacing={2}>
                            {OAUTH_PROVIDERS.map((p) => (
                                <Button
                                    key={p.id}
                                    onClick={() => onOAuth(p.id)}
                                    isDisabled={oauthLoading}
                                    variant="outline"
                                    justifyContent="flex-start"
                                >
                                    {p.label}
                                </Button>
                            ))}
                            <Button
                                onClick={() => setShowEmail(true)}
                                variant="outline"
                                justifyContent="flex-start"
                            >
                                Continue with Email
                            </Button>
                        </Stack>
                    )}

                    {showEmail && !awaitingCode && !submittingCode && (
                        <Stack spacing={2}>
                            <Input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoFocus
                            />
                            <Button
                                colorScheme="blue"
                                onClick={onSendCode}
                                isLoading={sendingCode}
                                isDisabled={!email}
                            >
                                Send code
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setShowEmail(false)}
                            >
                                Back
                            </Button>
                        </Stack>
                    )}

                    {(awaitingCode || submittingCode) && (
                        <Stack spacing={3}>
                            <Text fontSize="sm" color="gray.400">
                                We sent a 6-digit code to{' '}
                                <Text as="span" color="white">
                                    {email}
                                </Text>
                                .
                            </Text>
                            <HStack justify="center">
                                <PinInput
                                    value={code}
                                    onChange={setCode}
                                    onComplete={(v) => {
                                        setCode(v);
                                        loginWithCode({ code: v }).catch((e) =>
                                            setError(String(e)),
                                        );
                                    }}
                                    otp
                                >
                                    <PinInputField />
                                    <PinInputField />
                                    <PinInputField />
                                    <PinInputField />
                                    <PinInputField />
                                    <PinInputField />
                                </PinInput>
                            </HStack>
                            <Button
                                colorScheme="blue"
                                onClick={onSubmitCode}
                                isLoading={submittingCode}
                                isDisabled={code.length !== 6}
                            >
                                Verify
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                    setCode('');
                                    setShowEmail(false);
                                }}
                            >
                                Back
                            </Button>
                        </Stack>
                    )}

                    <Divider />
                    <Button variant="ghost" onClick={onCancel}>
                        Cancel
                    </Button>
                </Stack>
            </CardBody>
        </Card>
    );
}

function PageShell({ children }: { children: React.ReactNode }) {
    return (
        <Container maxW="md" py={12}>
            {children}
        </Container>
    );
}
