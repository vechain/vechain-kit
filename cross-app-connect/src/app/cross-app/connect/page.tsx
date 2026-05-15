'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
    Icon,
    Input,
    PinInput,
    PinInputField,
    SimpleGrid,
    Spinner,
    Stack,
    Text,
} from '@chakra-ui/react';
import { FcGoogle } from 'react-icons/fc';
import {
    FaApple,
    FaDiscord,
    FaGithub,
    FaLine,
    FaTiktok,
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import type { IconType } from 'react-icons';
import {
    useLoginWithEmail,
    useLoginWithOAuth,
    useLogout,
    usePrivy,
    useWallets,
} from '@privy-io/react-auth';
import { useCrossAppClient } from '../_lib/client';

type ConnectionRequest = ReturnType<
    ReturnType<typeof useCrossAppClient>['getConnectionRequestFromUrlParams']
>;

// Providers enabled in VeChain's Privy dashboard that go through Privy's
// headless useLoginWithOAuth. Farcaster (SIWF) and WhatsApp (OTP) are also
// enabled in the dashboard but use different login flows and aren't wired
// up here yet.
const OAUTH_PROVIDERS = [
    { id: 'google', label: 'Continue with Google', Icon: FcGoogle },
    { id: 'apple', label: 'Continue with Apple', Icon: FaApple },
    { id: 'twitter', label: 'Continue with X', Icon: FaXTwitter },
    { id: 'discord', label: 'Continue with Discord', Icon: FaDiscord },
    { id: 'github', label: 'Continue with GitHub', Icon: FaGithub },
    { id: 'tiktok', label: 'Continue with TikTok', Icon: FaTiktok },
    { id: 'line', label: 'Continue with LINE', Icon: FaLine },
] as const satisfies ReadonlyArray<{
    id: string;
    label: string;
    Icon: IconType;
}>;
type OAuthProvider = (typeof OAUTH_PROVIDERS)[number]['id'];

const INTENT_METHODS = [
    ...OAUTH_PROVIDERS.map((p) => p.id),
    'email',
] as const;
type IntentMethod = (typeof INTENT_METHODS)[number];

function isIntent(value: string | null): value is IntentMethod {
    return !!value && (INTENT_METHODS as readonly string[]).includes(value);
}

const OAUTH_ATTEMPTED_STORAGE_KEY = 'vk-cross-app-connect:oauth-attempted';

type Phase =
    | 'loading' // waiting on Privy / request / user object
    | 'no_params' // direct hit without URL params
    | 'parse_error' // bad URL params
    | 'switching_provider' // logout in flight (stale session, intent mismatch)
    | 'auth_pending' // OAuth redirect about to happen or in flight
    | 'show_picker' // no intent, no auth -> pick a provider
    | 'show_connect'; // ready to accept the connection request

type PrivyUser = ReturnType<typeof usePrivy>['user'];

function hasLinkedProvider(
    user: PrivyUser,
    intent: IntentMethod | null,
): boolean {
    if (!user || !intent) return false;
    if (intent === 'email') return Boolean(user.email);
    // user.google / user.apple / user.github / etc. are populated when the
    // account is linked. Cast through `unknown` because IntentMethod is a
    // narrower union than the keys typed on User.
    return Boolean((user as unknown as Record<string, unknown>)[intent]);
}

export default function CrossAppConnectPage() {
    const client = useCrossAppClient();
    const { ready, authenticated, user, getAccessToken } = usePrivy();
    const { wallets } = useWallets();
    const { logout } = useLogout();
    const { initOAuth, loading: oauthLoading } = useLoginWithOAuth();

    const [request, setRequest] = useState<ConnectionRequest | null>(null);
    const [parseError, setParseError] = useState<
        { kind: 'no_params' } | { kind: 'invalid'; message: string } | null
    >(null);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

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

    // Single source of truth for what the page should be doing right now.
    // Computed up-front so we can render one unified loading/spinner UI
    // during transitions (logout-then-OAuth, post-OAuth-callback) instead
    // of briefly flashing the wrong panel.
    const phase: Phase = useMemo(() => {
        if (parseError?.kind === 'no_params') return 'no_params';
        if (parseError?.kind === 'invalid') return 'parse_error';
        if (!ready || !request) return 'loading';

        if (intent && intent !== 'email') {
            if (!authenticated) return 'auth_pending';
            if (!user) return 'loading';
            return hasLinkedProvider(user, intent)
                ? 'show_connect'
                : 'switching_provider';
        }

        if (!authenticated) return 'show_picker';
        return 'show_connect';
    }, [parseError, ready, request, intent, authenticated, user]);

    // When the popup loads with an explicit intent and a stale session for a
    // DIFFERENT provider, logout so the requested provider's OAuth flow runs
    // cleanly. Guarded by phase so it fires at most once per stale-session
    // detection (after logout, phase flips to 'auth_pending' and this effect
    // exits).
    const logoutForIntentRef = useRef(false);
    useEffect(() => {
        if (phase !== 'switching_provider') return;
        if (logoutForIntentRef.current) return;
        logoutForIntentRef.current = true;
        logout().catch((e) => console.error('Failed to logout:', e));
    }, [phase, logout]);

    // Auto-trigger the intent's OAuth when phase enters 'auth_pending'
    // (either fresh load with ?intent, or post-logout transition). The
    // sessionStorage marker survives the OAuth redirect so the
    // post-callback page load doesn't re-bounce the user to the provider.
    useEffect(() => {
        if (phase !== 'auth_pending') return;
        if (!intent || intent === 'email') return;
        if (oauthLoading) return;
        if (typeof sessionStorage !== 'undefined') {
            if (
                sessionStorage.getItem(OAUTH_ATTEMPTED_STORAGE_KEY) === intent
            ) {
                return;
            }
            sessionStorage.setItem(OAUTH_ATTEMPTED_STORAGE_KEY, intent);
        }
        initOAuth({ provider: intent as OAuthProvider }).catch((e) =>
            setSubmitError(String(e)),
        );
    }, [phase, intent, oauthLoading, initOAuth]);

    // Capture initial auth state so the no-intent flow can distinguish
    // returning users (who get a manual Connect button) from users who
    // authenticated during this popup session (auto-accept).
    const initialAuthRef = useRef<boolean | undefined>(undefined);
    useEffect(() => {
        if (!ready) return;
        if (initialAuthRef.current !== undefined) return;
        initialAuthRef.current = authenticated;
    }, [ready, authenticated]);

    // Auto-accept only when the user authenticated during this popup
    // session (initialAuth was false). Returning users with a matching
    // provider get the manual Accept button so they can confirm the
    // requester before connecting.
    const autoAcceptedRef = useRef(false);
    useEffect(() => {
        if (autoAcceptedRef.current) return;
        if (phase !== 'show_connect') return;
        if (!embedded || !user) return;
        if (submitting || submitError) return;
        if (initialAuthRef.current !== false) return;
        autoAcceptedRef.current = true;
        onAccept();
    }, [phase, embedded, user, submitting, submitError, onAccept]);

    if (phase === 'no_params') {
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

    if (phase === 'parse_error') {
        return (
            <PageShell>
                <Alert status="error" rounded="md">
                    <AlertIcon />
                    <AlertDescription>
                        {parseError?.kind === 'invalid'
                            ? parseError.message
                            : 'Invalid connection request'}
                    </AlertDescription>
                </Alert>
            </PageShell>
        );
    }

    if (
        phase === 'loading' ||
        phase === 'switching_provider' ||
        phase === 'auth_pending'
    ) {
        return (
            <PageShell>
                <Center py={10}>
                    <Spinner />
                </Center>
            </PageShell>
        );
    }

    if (phase === 'show_picker') {
        return (
            <PageShell>
                <SignInPanel intent={intent} onCancel={onReject} />
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
    onCancel,
}: {
    intent: IntentMethod | null;
    onCancel: () => void;
}) {
    const [error, setError] = useState<string | null>(null);
    const { initOAuth, loading: oauthLoading } = useLoginWithOAuth({
        onError: (e) => setError(String(e)),
    });
    const {
        state: emailState,
        sendCode,
        loginWithCode,
    } = useLoginWithEmail();

    const [showEmail, setShowEmail] = useState<boolean>(intent === 'email');
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');

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
                            <SimpleGrid columns={2} spacing={2}>
                                {OAUTH_PROVIDERS.map((p) => (
                                    <Button
                                        key={p.id}
                                        onClick={() => onOAuth(p.id)}
                                        isDisabled={oauthLoading}
                                        variant="outline"
                                        leftIcon={
                                            <Icon as={p.Icon} boxSize="20px" />
                                        }
                                        justifyContent="flex-start"
                                    >
                                        {p.label.replace(/^Continue with /, '')}
                                    </Button>
                                ))}
                            </SimpleGrid>
                            <Button
                                onClick={() => setShowEmail(true)}
                                variant="outline"
                                justifyContent="center"
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
