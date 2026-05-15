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
    Center,
    Container,
    HStack,
    Icon,
    Image,
    Input,
    PinInput,
    PinInputField,
    Spinner,
    Stack,
    Text,
    Tooltip,
    useColorMode,
} from '@chakra-ui/react';
import { FcGoogle } from 'react-icons/fc';
import { FaApple, FaDiscord, FaGithub, FaLine, FaTiktok } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { SiFarcaster } from 'react-icons/si';
import { LuPhone } from 'react-icons/lu';
import type { IconType } from 'react-icons';
import {
    useLoginWithOAuth,
    useLoginWithSms,
    useLogout,
    usePrivy,
    useWallets,
} from '@privy-io/react-auth';
import {
    useGetAvatarOfAddress,
    useSmartAccount,
    useVechainDomain,
} from '@vechain/vechain-kit';
import { useCrossAppClient } from '../_lib/client';
import { lookupAppByUrl } from '../_lib/app-hub';
import { getRecentProvider, setRecentProvider } from '../_lib/recent';
import { VechainHeader } from '../../components/VechainHeader';

type ConnectionRequest = ReturnType<
    ReturnType<typeof useCrossAppClient>['getConnectionRequestFromUrlParams']
>;

// Providers enabled in VeChain's Privy dashboard that go through Privy's
// headless useLoginWithOAuth. Phone (SMS) and Farcaster (SIWF) are enabled
// too but use different flows: phone has its own inline form; Farcaster
// would need a Warpcast QR/deeplink integration (TODO).
const OAUTH_PROVIDERS = [
    { id: 'google', label: 'Google', Icon: FcGoogle, tier: 'primary' },
    { id: 'apple', label: 'Apple', Icon: FaApple, tier: 'primary' },
    { id: 'twitter', label: 'X', Icon: FaXTwitter, tier: 'primary' },
    { id: 'discord', label: 'Discord', Icon: FaDiscord, tier: 'other' },
    { id: 'github', label: 'GitHub', Icon: FaGithub, tier: 'other' },
    { id: 'tiktok', label: 'TikTok', Icon: FaTiktok, tier: 'other' },
    { id: 'line', label: 'LINE', Icon: FaLine, tier: 'other' },
] as const satisfies ReadonlyArray<{
    id: string;
    label: string;
    Icon: IconType;
    tier: 'primary' | 'other';
}>;
type OAuthProvider = (typeof OAUTH_PROVIDERS)[number]['id'];

// Brand hexes for providers whose glyph reads better in their official
// color rather than the kit's monochrome text color. Discord blurple,
// TikTok pink, LINE green. Phone (not OAuth) uses iMessage-style green.
// Google keeps its own multi-color glyph (FcGoogle is already colored);
// Apple, GitHub, X are intentionally monochrome.
const BRAND_GLYPH_COLOR: Partial<Record<OAuthProvider, string>> = {
    discord: '#5865F2',
    tiktok: '#FE2C55',
    line: '#06C755',
};
const PHONE_GLYPH_COLOR = '#34C759';

const INTENT_METHODS = [
    ...OAUTH_PROVIDERS.map((p) => p.id),
    'phone',
    'farcaster',
] as const;
type IntentMethod = (typeof INTENT_METHODS)[number];

function isIntent(value: string | null): value is IntentMethod {
    return !!value && (INTENT_METHODS as readonly string[]).includes(value);
}

const OAUTH_ATTEMPTED_STORAGE_KEY = 'vk-cross-app-connect:oauth-attempted';

type Phase =
    | 'loading'
    | 'no_params'
    | 'parse_error'
    | 'switching_provider'
    | 'auth_pending'
    | 'show_picker'
    | 'show_connect';

type PrivyUser = ReturnType<typeof usePrivy>['user'];

function hasLinkedProvider(
    user: PrivyUser,
    intent: IntentMethod | null,
): boolean {
    if (!user || !intent) return false;
    if (intent === 'phone') return Boolean(user.phone);
    if (intent === 'farcaster') return Boolean(user.farcaster);
    return Boolean((user as unknown as Record<string, unknown>)[intent]);
}

function isOAuthIntent(value: IntentMethod | null): value is OAuthProvider {
    return !!value && OAUTH_PROVIDERS.some((p) => p.id === value);
}

function truncateAddress(addr?: string): string {
    if (!addr) return '';
    return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
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
    const { data: smartAccount } = useSmartAccount(embedded?.address);

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

    const phase: Phase = useMemo(() => {
        if (parseError?.kind === 'no_params') return 'no_params';
        if (parseError?.kind === 'invalid') return 'parse_error';
        if (!ready || !request) return 'loading';

        // Only OAuth intents auto-redirect. Phone (inline SMS OTP form) and
        // Farcaster (SIWF placeholder) live inside the picker.
        if (intent && isOAuthIntent(intent)) {
            if (!authenticated) return 'auth_pending';
            if (!user) return 'loading';
            return hasLinkedProvider(user, intent)
                ? 'show_connect'
                : 'switching_provider';
        }

        if (!authenticated) return 'show_picker';
        return 'show_connect';
    }, [parseError, ready, request, intent, authenticated, user]);

    const logoutForIntentRef = useRef(false);
    useEffect(() => {
        if (phase !== 'switching_provider') return;
        if (logoutForIntentRef.current) return;
        logoutForIntentRef.current = true;
        logout().catch((e) => console.error('Failed to logout:', e));
    }, [phase, logout]);

    useEffect(() => {
        if (phase !== 'auth_pending') return;
        if (!intent || !isOAuthIntent(intent)) return;
        if (oauthLoading) return;
        if (typeof sessionStorage !== 'undefined') {
            if (
                sessionStorage.getItem(OAUTH_ATTEMPTED_STORAGE_KEY) === intent
            ) {
                return;
            }
            sessionStorage.setItem(OAUTH_ATTEMPTED_STORAGE_KEY, intent);
        }
        setRecentProvider(intent);
        initOAuth({ provider: intent }).catch((e) => setSubmitError(String(e)));
    }, [phase, intent, oauthLoading, initOAuth]);

    const initialAuthRef = useRef<boolean | undefined>(undefined);
    useEffect(() => {
        if (!ready) return;
        if (initialAuthRef.current !== undefined) return;
        initialAuthRef.current = authenticated;
    }, [ready, authenticated]);

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
                <VechainHeader title="VeChain Cross-App Connect" />
                <Card>
                    <CardBody>
                        <Text color="text-muted" textAlign="center">
                            This page handles cross-app connection requests from
                            other VeChain dApps. It can&apos;t be opened
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
                <VechainHeader title="Couldn't load request" />
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
                <VechainHeader
                    title="Log in to VeChain"
                    subtitle="Connecting…"
                    requesterUrl={request?.callbackUrl}
                />
                <Center py={10}>
                    <Spinner color="accent" />
                </Center>
            </PageShell>
        );
    }

    if (phase === 'show_picker') {
        return (
            <PageShell>
                <VechainHeader
                    subtitle="Sign in to grant access to"
                    requesterUrl={request?.callbackUrl}
                />
                <SignInPanel intent={intent} onCancel={onReject} />
            </PageShell>
        );
    }

    const appHubEntry = lookupAppByUrl(request?.callbackUrl);
    const verifiedApp = Boolean(appHubEntry);
    return (
        <PageShell>
            <VechainHeader
                title={
                    appHubEntry
                        ? `Connect to ${appHubEntry.name}`
                        : 'Confirm connection'
                }
                subtitle={
                    appHubEntry
                        ? undefined
                        : 'You haven’t connected here before'
                }
                requesterUrl={request?.callbackUrl}
            />
            <Card>
                <CardBody>
                    <Stack spacing={4}>
                        <IdentityRow
                            walletAddress={smartAccount?.address}
                            user={user}
                        />
                        {!verifiedApp && (
                            <Alert
                                status="warning"
                                rounded="md"
                                variant="left-accent"
                            >
                                <AlertDescription
                                    fontSize="xs"
                                    lineHeight="1.3"
                                >
                                    This app isn’t listed in the VeChain App
                                    Hub, so only continue if you trust the site.
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
                            onClick={onAccept}
                            isLoading={submitting}
                            isDisabled={!embedded}
                            w="full"
                            h="48px"
                        >
                            {verifiedApp ? 'Continue' : 'Continue anyway'}
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
                                Not you?
                            </Text>
                            <Button
                                variant="link"
                                size="sm"
                                onClick={() =>
                                    logout().catch((e) =>
                                        console.error(
                                            'Failed to switch account:',
                                            e,
                                        ),
                                    )
                                }
                            >
                                Use another account
                            </Button>
                        </HStack>
                    </Stack>
                </CardBody>
            </Card>
        </PageShell>
    );
}

type PanelView = 'picker' | 'phone' | 'farcaster';

function SignInPanel({
    intent,
    onCancel,
}: {
    intent: IntentMethod | null;
    onCancel: () => void;
}) {
    const { colorMode } = useColorMode();
    const [error, setError] = useState<string | null>(null);
    const { initOAuth, loading: oauthLoading } = useLoginWithOAuth({
        onError: (e) => setError(String(e)),
    });
    const { state: smsState, sendCode, loginWithCode } = useLoginWithSms();

    const [view, setView] = useState<PanelView>(() =>
        intent === 'phone'
            ? 'phone'
            : intent === 'farcaster'
            ? 'farcaster'
            : 'picker',
    );
    const [showOther, setShowOther] = useState<boolean>(false);
    const [phone, setPhone] = useState('');
    const [code, setCode] = useState('');
    const [recent, setRecent] = useState<string | null>(null);

    useEffect(() => {
        setRecent(getRecentProvider());
    }, []);

    // Build the visible row order. Recent provider (if any) jumps to the top
    // regardless of tier; everything else respects the OAUTH_PROVIDERS array
    // order plus Phone in the primary row and Farcaster in the other group.
    const rows = useMemo(() => {
        const primary = OAUTH_PROVIDERS.filter((p) => p.tier === 'primary');
        const other = OAUTH_PROVIDERS.filter((p) => p.tier === 'other');
        return { primary, other };
    }, []);

    const onOAuth = (provider: OAuthProvider) => {
        setError(null);
        setRecentProvider(provider);
        initOAuth({ provider }).catch((e) => setError(String(e)));
    };

    const onSendCode = async () => {
        setError(null);
        try {
            await sendCode({ phoneNumber: phone });
            setRecentProvider('phone');
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

    const awaitingCode = smsState.status === 'awaiting-code-input';
    const sendingCode = smsState.status === 'sending-code';
    const submittingCode = smsState.status === 'submitting-code';

    const isRecent = (id: string) => recent === id;

    return (
        <Card>
            <CardBody>
                <Stack spacing={3}>
                    {error && (
                        <Alert status="error" rounded="md">
                            <AlertIcon />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {view === 'picker' && (
                        <Stack spacing={2}>
                            {/* Primary row: Google, Apple, X, Phone */}
                            {rows.primary.map((p) => (
                                <ProviderRow
                                    key={p.id}
                                    provider={p}
                                    onClick={() => onOAuth(p.id)}
                                    isDisabled={oauthLoading}
                                    isRecent={isRecent(p.id)}
                                    colorMode={colorMode}
                                />
                            ))}
                            <PhoneRow
                                onClick={() => setView('phone')}
                                isRecent={isRecent('phone')}
                            />
                            {/* Other socials: render either the "show more"
                                link or the expanded list, never both. Avoids
                                the chevron-row inside a button stack pattern. */}
                            {!showOther && rows.other.length > 0 && (
                                <Box pt={1} textAlign="center">
                                    <Button
                                        variant="link"
                                        onClick={() => setShowOther(true)}
                                    >
                                        + {rows.other.length + 1} more options
                                    </Button>
                                </Box>
                            )}
                            {showOther && (
                                <Stack spacing={2}>
                                    {/* Discord, GitHub, TikTok, Farcaster, LINE */}
                                    {rows.other
                                        .filter(
                                            (p) =>
                                                p.id === 'discord' ||
                                                p.id === 'github' ||
                                                p.id === 'tiktok',
                                        )
                                        .map((p) => (
                                            <ProviderRow
                                                key={p.id}
                                                provider={p}
                                                onClick={() => onOAuth(p.id)}
                                                isDisabled={oauthLoading}
                                                isRecent={isRecent(p.id)}
                                                colorMode={colorMode}
                                            />
                                        ))}
                                    <FarcasterRow
                                        onClick={() => setView('farcaster')}
                                        isRecent={isRecent('farcaster')}
                                    />
                                    {rows.other
                                        .filter((p) => p.id === 'line')
                                        .map((p) => (
                                            <ProviderRow
                                                key={p.id}
                                                provider={p}
                                                onClick={() => onOAuth(p.id)}
                                                isDisabled={oauthLoading}
                                                isRecent={isRecent(p.id)}
                                                colorMode={colorMode}
                                            />
                                        ))}
                                </Stack>
                            )}
                        </Stack>
                    )}

                    {view === 'phone' && !awaitingCode && !submittingCode && (
                        <Stack spacing={2}>
                            <Input
                                type="tel"
                                placeholder="+1 555 555 5555"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                autoFocus
                                h="48px"
                                bg="card-bg"
                                borderColor="card-border"
                                color="text-strong"
                                _placeholder={{ color: 'text-subtle' }}
                                _focusVisible={{
                                    borderColor: 'accent',
                                    boxShadow: 'none',
                                }}
                            />
                            <Text fontSize="xs" color="text-subtle">
                                Include the country code, e.g. +1 for US, +44
                                for UK.
                            </Text>
                            <Button
                                variant="brand"
                                onClick={onSendCode}
                                isLoading={sendingCode}
                                isDisabled={!phone}
                                h="48px"
                            >
                                Send code
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setView('picker')}
                            >
                                Back
                            </Button>
                        </Stack>
                    )}

                    {view === 'phone' && (awaitingCode || submittingCode) && (
                        <Stack spacing={3}>
                            <Text fontSize="sm" color="text-muted">
                                We sent a 6-digit code to{' '}
                                <Text as="span" color="text-strong">
                                    {phone}
                                </Text>
                                .
                            </Text>
                            <HStack justify="center">
                                <PinInput
                                    value={code}
                                    onChange={setCode}
                                    onComplete={(v) => {
                                        setCode(v);
                                        loginWithCode({
                                            code: v,
                                        }).catch((e) => setError(String(e)));
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
                                variant="brand"
                                onClick={onSubmitCode}
                                isLoading={submittingCode}
                                isDisabled={code.length !== 6}
                                h="48px"
                            >
                                Verify
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                    setCode('');
                                    setView('picker');
                                }}
                            >
                                Back
                            </Button>
                        </Stack>
                    )}

                    {view === 'farcaster' && (
                        <Stack spacing={3} pt={2}>
                            <Text fontSize="sm" color="text-muted">
                                Farcaster sign-in is coming soon. It uses Sign
                                In With Farcaster (SIWF), which needs a Warpcast
                                scan and isn&apos;t wired up here yet. Please
                                choose another option for now.
                            </Text>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setView('picker')}
                            >
                                Back
                            </Button>
                        </Stack>
                    )}

                    <Button variant="ghost" onClick={onCancel} mt={2}>
                        Cancel
                    </Button>
                </Stack>
            </CardBody>
        </Card>
    );
}

function ProviderRow({
    provider,
    isRecent,
    onClick,
    isDisabled,
    colorMode,
}: {
    provider: (typeof OAUTH_PROVIDERS)[number];
    isRecent?: boolean;
    onClick: () => void;
    isDisabled?: boolean;
    colorMode: 'light' | 'dark';
}) {
    // Apple / GitHub / X are intentionally monochrome -- their wordmarks
    // are black/white by brand. Flip them with the color mode for legibility.
    // Everyone else gets their brand hex so the picker has the same
    // chromatic feel as Privy's hosted UI.
    const brandColor = BRAND_GLYPH_COLOR[provider.id];
    const monoFlip =
        provider.id === 'apple' ||
        provider.id === 'github' ||
        provider.id === 'twitter';
    const iconColor = brandColor
        ? brandColor
        : monoFlip
        ? colorMode === 'dark'
            ? 'white'
            : 'text-strong'
        : undefined;
    return (
        <Button
            variant="row"
            onClick={onClick}
            isDisabled={isDisabled}
            leftIcon={
                <Icon as={provider.Icon} boxSize="22px" color={iconColor} />
            }
            rightIcon={isRecent ? <RecentDot /> : undefined}
        >
            <Text flex={1} textAlign="left">
                Continue with {provider.label}
            </Text>
        </Button>
    );
}

function PhoneRow({
    onClick,
    isRecent,
}: {
    onClick: () => void;
    isRecent?: boolean;
}) {
    return (
        <Button
            variant="row"
            onClick={onClick}
            leftIcon={
                <Icon as={LuPhone} boxSize="22px" color={PHONE_GLYPH_COLOR} />
            }
            rightIcon={isRecent ? <RecentDot /> : undefined}
        >
            <Text flex={1} textAlign="left">
                Continue with Phone
            </Text>
        </Button>
    );
}

function FarcasterRow({
    onClick,
    isRecent,
}: {
    onClick: () => void;
    isRecent?: boolean;
}) {
    return (
        <Button
            variant="row"
            onClick={onClick}
            leftIcon={<Icon as={SiFarcaster} boxSize="22px" color="#8A63D2" />}
            rightIcon={isRecent ? <RecentDot /> : undefined}
        >
            <Text flex={1} textAlign="left">
                Continue with Farcaster
            </Text>
        </Button>
    );
}

/**
 * Quiet "Recent" indicator -- a small green dot with a tooltip. Lets a
 * returning user spot the previously used provider at a glance without a
 * loud chip stealing attention from the recommended path.
 */
function RecentDot() {
    return (
        <Tooltip
            label="Last used"
            placement="left"
            hasArrow
            openDelay={200}
            fontSize="xs"
        >
            <Box
                boxSize="8px"
                rounded="full"
                bg="green.400"
                aria-label="Last used"
                role="img"
            />
        </Tooltip>
    );
}

function IdentityRow({
    walletAddress,
    user,
}: {
    walletAddress?: string;
    user: ReturnType<typeof usePrivy>['user'];
}) {
    const { data: domainInfo } = useVechainDomain(walletAddress);
    const { data: avatar } = useGetAvatarOfAddress(walletAddress);
    const domain = domainInfo?.domain;
    const email = user?.email?.address ?? user?.google?.email ?? user?.id;
    const linked = linkedSocials(user);

    return (
        <HStack
            spacing={3}
            p={3}
            rounded="md"
            bg="card-elevated-bg"
            borderWidth="1px"
            borderColor="card-border"
            align="center"
        >
            {avatar ? (
                <Image
                    src={avatar}
                    alt=""
                    boxSize="44px"
                    rounded="full"
                    draggable={false}
                    fallback={
                        <Box
                            boxSize="44px"
                            rounded="full"
                            bg="login-btn-hover-bg"
                        />
                    }
                />
            ) : (
                <Box boxSize="44px" rounded="full" bg="login-btn-hover-bg" />
            )}
            <Stack spacing={1} flex={1} minW={0}>
                <HStack spacing={2} align="center" minW={0}>
                    <Text
                        fontWeight={600}
                        color="text-strong"
                        lineHeight="1.2"
                        noOfLines={1}
                        title={email ?? undefined}
                    >
                        {email ?? 'Signed in'}
                    </Text>
                    {linked.length > 0 && (
                        <HStack spacing={1} flexShrink={0}>
                            {linked.map((s) => (
                                <Tooltip
                                    key={s.id}
                                    label={s.label}
                                    placement="top"
                                    hasArrow
                                    openDelay={150}
                                    fontSize="xs"
                                >
                                    <span style={{ display: 'inline-flex' }}>
                                        <Icon
                                            as={s.Icon}
                                            boxSize="14px"
                                            color={s.color}
                                            aria-label={s.label}
                                        />
                                    </span>
                                </Tooltip>
                            ))}
                        </HStack>
                    )}
                </HStack>
                {walletAddress ? (
                    <Text
                        fontFamily="mono"
                        fontSize="xs"
                        color="text-subtle"
                        lineHeight="1.2"
                        noOfLines={1}
                    >
                        {domain
                            ? `${domain} · ${truncateAddress(walletAddress)}`
                            : truncateAddress(walletAddress)}
                    </Text>
                ) : (
                    <Text fontSize="xs" color="text-subtle">
                        Creating your VeChain account…
                    </Text>
                )}
            </Stack>
        </HStack>
    );
}

type LinkedSocialBadge = {
    id: string;
    label: string;
    Icon: IconType;
    color?: string;
};

function linkedSocials(
    user: ReturnType<typeof usePrivy>['user'],
): LinkedSocialBadge[] {
    if (!user) return [];
    const u = user as unknown as Record<string, unknown>;
    const badges: LinkedSocialBadge[] = [];
    for (const p of OAUTH_PROVIDERS) {
        if (u[p.id]) {
            badges.push({
                id: p.id,
                label: p.label,
                Icon: p.Icon,
                color: BRAND_GLYPH_COLOR[p.id],
            });
        }
    }
    if (u.phone) {
        badges.push({
            id: 'phone',
            label: 'Phone',
            Icon: LuPhone,
            color: PHONE_GLYPH_COLOR,
        });
    }
    if (u.farcaster) {
        badges.push({
            id: 'farcaster',
            label: 'Farcaster',
            Icon: SiFarcaster,
            color: '#8A63D2',
        });
    }
    return badges;
}

function PageShell({ children }: { children: React.ReactNode }) {
    return (
        <Container maxW="sm" py={8}>
            <Stack spacing={6}>{children}</Stack>
        </Container>
    );
}
