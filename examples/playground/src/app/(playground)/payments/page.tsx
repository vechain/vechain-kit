'use client';

import { Heading, HStack, Text, VStack } from '@chakra-ui/react';
import { PayWithTransakButton, useTransakCheckout } from '@vechain/vechain-kit';
import { useTranslation } from 'react-i18next';
import { DemoSection } from '../../components/demo/DemoSection';
import { ConnectGate } from '../../components/demo/ConnectGate';

const BUTTON_SNIPPET = `import { PayWithTransakButton } from '@vechain/vechain-kit';

function BuyVetButton() {
    return (
        <PayWithTransakButton
            fiatAmount="30"
            fiatCurrency="USD"
            onSuccess={() => console.log('VET purchased!')}
            onError={(err) => console.error(err)}
        />
    );
}
`;

const HOOK_SNIPPET = `import { useTransakCheckout } from '@vechain/vechain-kit';

function BuyVetCustom() {
    const { open, status, widgetReady } = useTransakCheckout(
        () => console.log('done'),
    );

    return (
        <button onClick={() => open({ fiatAmount: '30', fiatCurrency: 'USD' })}>
            Buy VET
        </button>
        // status/widgetReady drive your own UI -- see TransakCheckoutModal
        // in the vechain-kit source for a full reference implementation.
    );
}
`;

function CustomHookDemo() {
    const { t } = useTranslation();
    const { open, status } = useTransakCheckout();

    return (
        <VStack align="stretch" spacing={3}>
            <Text fontSize="sm">
                {t(
                    'Same top-up rail, driven directly from useTransakCheckout instead of the pre-built button -- use this when you need your own trigger UI.',
                )}
            </Text>
            <HStack>
                <Text fontSize="xs" opacity={0.6}>
                    {t('status')}: {status}
                </Text>
            </HStack>
            <button
                onClick={() => open({ fiatAmount: '30', fiatCurrency: 'USD' })}
                style={{
                    padding: '8px 16px',
                    borderRadius: 8,
                    border: '1px solid rgba(128,128,128,0.3)',
                    cursor: 'pointer',
                }}
            >
                {t('Buy $30 VET (custom trigger)')}
            </button>
        </VStack>
    );
}

export default function PaymentsPage() {
    const { t } = useTranslation();

    return (
        <VStack align="stretch" spacing={6}>
            <VStack align="stretch" spacing={2}>
                <Heading size="lg">{t('Payments')}</Heading>
                <Text opacity={0.7}>
                    {t(
                        'Let users top up their wallet with VET bought via card -- no exchange, no bridging. Powered by Transak.',
                    )}
                </Text>
            </VStack>

            <ConnectGate feature={t('Payments')}>
                <DemoSection
                    title={t('Buy VET')}
                    description={t(
                        'Drop-in button: opens the Transak widget, tracks order status, and closes itself on success.',
                    )}
                    hooks={['PayWithTransakButton', 'useTransakCheckout']}
                    status="NEW"
                    code={BUTTON_SNIPPET}
                    aiPrompt={t(
                        'Add a "Buy VET" button to my Next.js app using PayWithTransakButton from @vechain/vechain-kit. Default to $30 USD, and show a toast on success/error. Requires a `transak.widgetUrlBuilder` configured on VeChainKitProvider that mints a Secure Widget URL from a backend -- see the "Fiat onramp" recipe in the vechain-kit docs for a reference proxy implementation.',
                    )}
                    aiSkills={['vechain-kit']}
                >
                    <PayWithTransakButton fiatAmount="30" fiatCurrency="USD" />
                </DemoSection>

                <DemoSection
                    title={t('Custom trigger')}
                    description={t(
                        'The same flow via the raw hook, for a fully custom button/card instead of the pre-built one.',
                    )}
                    hooks={['useTransakCheckout']}
                    status="NEW"
                    code={HOOK_SNIPPET}
                    aiPrompt={t(
                        'Build a custom "Top up wallet" card in my app using useTransakCheckout from @vechain/vechain-kit directly (not PayWithTransakButton) so I can fully control the trigger UI. Show the live status (idle/processing/success/error) and disable the button while processing.',
                    )}
                    aiSkills={['vechain-kit']}
                >
                    <CustomHookDemo />
                </DemoSection>
            </ConnectGate>
        </VStack>
    );
}
