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
} from 'react-icons/lu';
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
                title={t('1. Install')}
                description={t(
                    'Add the package to your React or Next.js app — no global config needed.',
                )}
            >
                <InstallSnippet />
            </DemoSection>

            <DemoSection
                title={t('2. Wrap your app with the provider')}
                description={t(
                    'Configure login methods, network and dapp-kit options once. The provider exposes hooks and modals to the whole tree.',
                )}
                hooks={['VeChainKitProvider']}
                code={PROVIDER_SNIPPET}
            />

            <HStack
                p={4}
                borderRadius="md"
                bg="blue.50"
                color="blue.800"
                _dark={{ bg: 'whiteAlpha.100', color: 'blue.200' }}
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
