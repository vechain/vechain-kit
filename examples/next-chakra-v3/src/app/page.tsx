'use client';
import {
    Box,
    Button,
    Code,
    HStack,
    Heading,
    Stack,
    Text,
} from '@chakra-ui/react';
import {
    useAccountModal,
    useConnectModal,
    useWallet,
} from '@vechain/vechain-kit';
import { ColorModeButton, useColorMode } from '@/components/ui/color-mode';

const short = (addr?: string) =>
    addr ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : '';

export default function Page() {
    const { open: openConnect } = useConnectModal();
    const { open: openAccount } = useAccountModal();
    const { account, connection, disconnect } = useWallet();
    const { colorMode } = useColorMode();

    const isConnected = connection.isConnected;

    return (
        <Stack gap={6} p={8} maxW="720px" mx="auto">
            <HStack justify="space-between">
                <Heading size="lg">VeChain Kit · Chakra v3 repro</Heading>
                <ColorModeButton />
            </HStack>

            <Text>
                Host is on Chakra v3 + next-themes. Current resolved theme:{' '}
                <Code>{colorMode ?? '—'}</Code>. Toggle the sun/moon icon and
                re-open the modals to inspect theme propagation into the kit.
            </Text>

            <HStack gap={3}>
                {!isConnected ? (
                    <Button colorPalette="blue" onClick={() => openConnect()}>
                        Open connect modal
                    </Button>
                ) : (
                    <>
                        <Button colorPalette="blue" onClick={() => openAccount()}>
                            Open account modal
                        </Button>
                        <Button variant="outline" onClick={() => disconnect()}>
                            Disconnect
                        </Button>
                    </>
                )}
            </HStack>

            {isConnected && (
                <Box
                    p={3}
                    rounded="md"
                    borderWidth="1px"
                    borderColor="border.secondary"
                >
                    <Text fontSize="sm">
                        Connected as <Code>{short(account?.address)}</Code> via{' '}
                        <Code>{connection.source.type}</Code>
                    </Text>
                </Box>
            )}

            <Box
                p={4}
                rounded="md"
                borderWidth="1px"
                borderColor="border.secondary"
                bg="card.subtle"
            >
                <Text fontWeight="bold">Host-rendered card</Text>
                <Text fontSize="sm">
                    This box uses the same Chakra v3 semantic tokens
                    (<Code>bg.primary</Code>, <Code>card.subtle</Code>,
                    <Code> border.secondary</Code>) that are passed into the
                    kit&apos;s theme prop. If everything is working, both kit
                    modals should track theme toggles in real time without a
                    refresh.
                </Text>
            </Box>
        </Stack>
    );
}
