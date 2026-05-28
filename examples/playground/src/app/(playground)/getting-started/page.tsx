'use client';

import {
    Box,
    Heading,
    SimpleGrid,
    Text,
    useColorMode,
    VStack,
    Icon,
    HStack,
} from '@chakra-ui/react';
import {
    LuLogIn,
    LuPenLine,
    LuArrowLeftRight,
    LuDatabase,
    LuPalette,
    LuShield,
    LuSparkles,
    LuArrowRight,
} from 'react-icons/lu';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Hero } from '../../components/demo/Hero';
import { InstallSnippet } from '../../components/demo/InstallSnippet';
import { CodeBlock } from '../../components/demo/CodeBlock';
import { DemoSection } from '../../components/demo/DemoSection';
import { IconType } from 'react-icons';

const PROVIDER_SNIPPET = `import { VeChainKitProvider } from '@vechain/vechain-kit';

export function Providers({ children }) {
    return (
        <VeChainKitProvider
            network={{ type: 'main' }}
            loginMethods={[
                { method: 'vechain', gridColumn: 4 },
                { method: 'dappkit', gridColumn: 4 },
                { method: 'email', gridColumn: 2 },
                { method: 'google', gridColumn: 2 },
            ]}
            dappKit={{
                allowedWallets: ['veworld', 'wallet-connect', 'sync2'],
                walletConnectOptions: {
                    projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID!,
                    metadata: {
                        name: 'My VeChain App',
                        description: 'A dApp built with VeChain Kit',
                        url: 'https://example.com',
                        icons: ['https://example.com/icon.png'],
                    },
                },
            }}
            darkMode
        >
            {children}
        </VeChainKitProvider>
    );
}
`;

interface FeatureProps {
    icon: IconType;
    title: string;
    description: string;
}

function FeatureTile({ icon, title, description }: FeatureProps) {
    const { colorMode } = useColorMode();
    return (
        <VStack
            align="flex-start"
            spacing={2}
            p={4}
            borderRadius="md"
            borderWidth="1px"
            borderColor={
                colorMode === 'light' ? 'gray.200' : 'whiteAlpha.200'
            }
            bg={colorMode === 'light' ? 'white' : 'whiteAlpha.50'}
        >
            <Icon
                as={icon}
                boxSize={5}
                color={colorMode === 'light' ? 'blue.500' : 'blue.300'}
            />
            <Text fontWeight="semibold" fontSize="sm">
                {title}
            </Text>
            <Text fontSize="xs" opacity={0.7}>
                {description}
            </Text>
        </VStack>
    );
}

export default function GettingStartedPage() {
    const { t } = useTranslation();

    return (
        <VStack align="stretch" spacing={8}>
            <Hero />

            <Box>
                <Heading size="md" mb={3}>
                    {t('What you get')}
                </Heading>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={3}>
                    <FeatureTile
                        icon={LuLogIn}
                        title={t('Connect & Auth')}
                        description={t(
                            'VeWorld, WalletConnect, social logins via Privy.',
                        )}
                    />
                    <FeatureTile
                        icon={LuShield}
                        title={t('Smart Account')}
                        description={t(
                            'Gas-less first action, recoverable, transferable.',
                        )}
                    />
                    <FeatureTile
                        icon={LuArrowLeftRight}
                        title={t('Transactions')}
                        description={t(
                            'Single & multi-clause txs with fee delegation.',
                        )}
                    />
                    <FeatureTile
                        icon={LuPenLine}
                        title={t('Signing')}
                        description={t(
                            'Personal messages and EIP-712 typed data.',
                        )}
                    />
                    <FeatureTile
                        icon={LuDatabase}
                        title={t('Reading Data')}
                        description={t(
                            'Balances, prices, VeBetterDAO and more.',
                        )}
                    />
                    <FeatureTile
                        icon={LuPalette}
                        title={t('Theming & i18n')}
                        description={t(
                            'Dark mode, custom themes, 15+ languages.',
                        )}
                    />
                </SimpleGrid>
            </Box>

            <DemoSection
                title={t('🚀 Start a new VeChain dApp')}
                description={t(
                    'The recommended path. Hand this prompt to your coding agent — it will read the VeChain skills and scaffold the entire project, provider included.',
                )}
                status="NEW"
                aiPrompt={t(
                    'Scaffold a new VeChain dApp for me using create-vechain-dapp, with:\n- VeChain Kit pre-wired (Privy social login: Google + email, plus VeWorld and WalletConnect)\n- Chakra UI v3 (with next-themes) and dark mode by default — follow the next-chakra-v3 example in the vechain-kit repo for wiring the kit\'s `theme` prop via `useChakraContext().token.var(...)` so theme tokens stay reactive\n- A landing page that shows the connected user\'s address, B3TR balance, and a "Send B3TR" button\n- A GitHub Pages deploy workflow ready to use\n\nName the project "my-vechain-dapp". When done, run `yarn dev` and tell me the URL.',
                )}
                aiSkills={['create-vechain-dapp', 'vechain-kit']}
            />

            <Box opacity={0.95}>
                <DemoSection
                    title={t('Or: add VeChain Kit to an existing project')}
                    description={t(
                        'Already have a Next.js app? Install the package, then either follow the provider snippet below or use the AI prompt to wire it up automatically.',
                    )}
                    hooks={['VeChainKitProvider']}
                    code={PROVIDER_SNIPPET}
                    aiPrompt={t(
                        'I already have a Next.js app and I want to add VeChain Kit to it.\n\n1. Install @vechain/vechain-kit and any required peer deps.\n2. Find my root layout (app/layout.tsx for App Router or pages/_app.tsx for Pages Router) and wrap it with VeChainKitProvider.\n3. Enable Privy social login (Google + email), VeWorld and WalletConnect.\n4. Read Privy keys from NEXT_PUBLIC_PRIVY_* and the WalletConnect projectId from NEXT_PUBLIC_WC_PROJECT_ID.\n5. Add a <WalletButton /> to my existing header.\n6. Don\'t change my existing Chakra theme.\n\nIf you hit peer-dependency conflicts, stop and tell me before applying any fix.',
                    )}
                    aiSkills={['vechain-kit']}
                >
                    <VStack align="stretch" spacing={4}>
                        <Text fontSize="sm" opacity={0.7}>
                            {t('Install the package manually:')}
                        </Text>
                        <InstallSnippet />
                    </VStack>
                </DemoSection>
            </Box>

            <Link href="/ai-skills" style={{ textDecoration: 'none' }}>
                <Box
                    p={5}
                    borderRadius="lg"
                    borderWidth="1px"
                    borderColor="blue.200"
                    bg="blue.50"
                    _dark={{
                        bg: 'whiteAlpha.50',
                        borderColor: 'whiteAlpha.300',
                    }}
                    _hover={{
                        transform: 'translateY(-2px)',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        shadow: 'md',
                    }}
                    cursor="pointer"
                >
                    <HStack spacing={4} align="flex-start">
                        <Icon
                            as={LuSparkles}
                            boxSize={6}
                            color="blue.500"
                            mt={1}
                            _dark={{ color: 'blue.300' }}
                        />
                        <VStack align="flex-start" spacing={1} flex={1}>
                            <HStack>
                                <Text fontWeight="semibold">
                                    {t('Ship VeChain dApps with AI')}
                                </Text>
                                <Text
                                    fontSize="xs"
                                    fontWeight="bold"
                                    letterSpacing="wider"
                                    textTransform="uppercase"
                                    px={2}
                                    py={0.5}
                                    borderRadius="full"
                                    bg="pink.500"
                                    color="white"
                                >
                                    {t('New')}
                                </Text>
                            </HStack>
                            <Text fontSize="sm" opacity={0.8}>
                                {t(
                                    'Install 11 VeChain skills in Claude Code, Cursor or any agent — domain knowledge for wallet UX, smart contracts, VeBetterDAO and more.',
                                )}
                            </Text>
                        </VStack>
                        <Icon as={LuArrowRight} boxSize={5} mt={1} />
                    </HStack>
                </Box>
            </Link>

            <HStack
                p={4}
                borderRadius="md"
                bg="gray.100"
                color="gray.700"
                _dark={{ bg: 'whiteAlpha.100', color: 'gray.300' }}
                spacing={3}
                align="flex-start"
            >
                <Text fontSize="sm">
                    {t(
                        'Use the sidebar to explore each capability. Pages with the wallet icon need a connection — sign in from the top bar.',
                    )}
                </Text>
            </HStack>
        </VStack>
    );
}
