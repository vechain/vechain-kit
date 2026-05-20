'use client';

import { Heading, Text, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { DemoSection } from '../../components/demo/DemoSection';
import { ConnectGate } from '../../components/demo/ConnectGate';
import { IdentityPanel } from '../../components/features/Identity/IdentityPanel';
import { ConnectionInfo } from '../../components/features/ConnectionInfo';

const USE_WALLET_SNIPPET = `import { useWallet } from '@vechain/vechain-kit';

function Profile() {
    const { account, smartAccount, connectedWallet, connection } = useWallet();

    if (!account) return <p>Not connected</p>;

    return (
        <div>
            <p>Address: {account.address}</p>
            <p>Domain: {account.domain ?? 'none'}</p>
            <p>Smart account: {smartAccount.address}</p>
            <p>Source: {connection.source.type}</p>
        </div>
    );
}
`;

export default function IdentityPage() {
    const { t } = useTranslation();

    return (
        <VStack align="stretch" spacing={6}>
            <VStack align="stretch" spacing={2}>
                <Heading size="lg">{t('Identity')}</Heading>
                <Text opacity={0.7}>
                    {t(
                        'Inspect the connected account, its smart account, domain and connection source.',
                    )}
                </Text>
            </VStack>

            <ConnectGate feature={t('Identity')}>
                <DemoSection
                    title={t('Account details')}
                    description={t(
                        'Everything useWallet() exposes about the current session.',
                    )}
                    hooks={['useWallet']}
                    code={USE_WALLET_SNIPPET}
                    aiPrompt={t(
                        'Build a "ProfileCard" component that uses useWallet from @vechain/vechain-kit to show the connected user\'s address, VET domain, smart account address (with a "Deployed" tag), and a copy-to-clipboard button on each address. Truncate long addresses like 0x1234…abcd. Use Chakra UI v3.',
                    )}
                    aiSkills={['vechain-kit']}
                >
                    <IdentityPanel />
                </DemoSection>

                <DemoSection
                    title={t('Connection source')}
                    description={t(
                        'How the user is authenticated — direct wallet, Privy, or cross-app.',
                    )}
                    hooks={['useWallet']}
                    aiPrompt={t(
                        'Show a small badge in my app header indicating how the user is connected (Privy, Privy cross-app, or direct wallet). Read connection.source.type from useWallet and pick a color: blue for wallet, purple for privy, pink for cross-app.',
                    )}
                    aiSkills={['vechain-kit']}
                >
                    <ConnectionInfo />
                </DemoSection>
            </ConnectGate>
        </VStack>
    );
}
