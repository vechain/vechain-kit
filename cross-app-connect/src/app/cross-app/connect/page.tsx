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
    Spinner,
    Stack,
    Text,
} from '@chakra-ui/react';
import { useLogin, usePrivy, useWallets } from '@privy-io/react-auth';
import { useCrossAppClient } from '../_lib/client';

type ConnectionRequest = ReturnType<
    ReturnType<typeof useCrossAppClient>['getConnectionRequestFromUrlParams']
>;

const INTENT_METHODS = [
    'google',
    'apple',
    'twitter',
    'email',
    'discord',
] as const;
type IntentMethod = (typeof INTENT_METHODS)[number];

function isIntent(value: string | null): value is IntentMethod {
    return !!value && (INTENT_METHODS as readonly string[]).includes(value);
}

export default function CrossAppConnectPage() {
    const client = useCrossAppClient();
    const { ready, authenticated, user, getAccessToken } = usePrivy();
    const { wallets } = useWallets();
    const { login } = useLogin();

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

    useEffect(() => {
        if (!ready || authenticated || autoLoginAttempted) return;
        if (!intent) return;
        setAutoLoginAttempted(true);
        login({ loginMethods: [intent] });
    }, [ready, authenticated, intent, autoLoginAttempted, login]);

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
                <Card variant="filled">
                    <CardHeader>
                        <Heading size="md">Sign in to continue</Heading>
                    </CardHeader>
                    <CardBody>
                        <Stack spacing={4}>
                            <Text>
                                An app is requesting permission to connect to
                                your VeChain account.
                            </Text>
                            <Button
                                colorScheme="blue"
                                onClick={() => login()}
                                isDisabled={submitting}
                            >
                                Continue
                            </Button>
                            <Divider />
                            <Button variant="ghost" onClick={onReject}>
                                Cancel
                            </Button>
                        </Stack>
                    </CardBody>
                </Card>
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

function PageShell({ children }: { children: React.ReactNode }) {
    return (
        <Container maxW="md" py={12}>
            {children}
        </Container>
    );
}
