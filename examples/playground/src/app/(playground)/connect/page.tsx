'use client';

import { Heading, Text, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { DemoSection } from '../../components/demo/DemoSection';
import {
    WalletButtonVariants,
    OAuthGrid,
} from '../../components/features/Connect';

const WALLET_BUTTON_SNIPPET = `import { WalletButton, useConnectModal } from '@vechain/vechain-kit';

// 1. Default modal variant
<WalletButton />

// 2. Popover (desktop only)
<WalletButton connectionVariant="popover" />

// 3. Custom button style
<WalletButton
    buttonStyle={{
        background: '#f08098',
        color: 'white',
        border: '2px solid #000',
    }}
/>

// 4. Fully custom button
const { open } = useConnectModal();
<Button onClick={() => open()}>Sign in</Button>
`;

const OAUTH_SNIPPET = `import { useLoginWithOAuth } from '@vechain/vechain-kit';

function GoogleLogin() {
    const { initOAuth } = useLoginWithOAuth();
    return (
        <Button onClick={() => initOAuth({ provider: 'google' })}>
            Continue with Google
        </Button>
    );
}
`;

export default function ConnectPage() {
    const { t } = useTranslation();

    return (
        <VStack align="stretch" spacing={6}>
            <VStack align="stretch" spacing={2}>
                <Heading size="lg">{t('Connect & Auth')}</Heading>
                <Text opacity={0.7}>
                    {t(
                        'Drop-in wallet UI, plus a hook-first API to roll your own.',
                    )}
                </Text>
            </VStack>

            <DemoSection
                title={t('WalletButton variants')}
                description={t(
                    'One component, multiple presentation modes. Style it freely or replace it with your own button + useConnectModal.',
                )}
                hooks={['WalletButton', 'useConnectModal', 'useDAppKitWalletModal']}
                status="STABLE"
                code={WALLET_BUTTON_SNIPPET}
            >
                <WalletButtonVariants />
            </DemoSection>

            <DemoSection
                title={t('Social login providers')}
                description={t(
                    'OAuth runs through your Privy app, or falls back to the VeChain whitelabel cross-app host out of the box.',
                )}
                hooks={['useLoginWithOAuth']}
                code={OAUTH_SNIPPET}
            >
                <OAuthGrid />
            </DemoSection>
        </VStack>
    );
}
