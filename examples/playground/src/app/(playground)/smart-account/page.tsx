'use client';

import { Button, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import { useUpgradeSmartAccountModal } from '@vechain/vechain-kit';
import { useTranslation } from 'react-i18next';
import { LuRefreshCw } from 'react-icons/lu';
import { DemoSection } from '../../components/demo/DemoSection';
import { ConnectGate } from '../../components/demo/ConnectGate';
import { SmartAccountInfo } from '../../components/features/SmartAccountInfo';

const UPGRADE_SNIPPET = `import { useUpgradeSmartAccountModal } from '@vechain/vechain-kit';

function UpgradeButton() {
    const { open } = useUpgradeSmartAccountModal();
    return <Button onClick={open}>Upgrade smart account</Button>;
}
`;

function UpgradeButtonInline() {
    const { open } = useUpgradeSmartAccountModal();
    const { t } = useTranslation();
    return (
        <HStack>
            <Button leftIcon={<LuRefreshCw />} onClick={open}>
                {t('Open upgrade modal')}
            </Button>
        </HStack>
    );
}

export default function SmartAccountPage() {
    const { t } = useTranslation();

    return (
        <VStack align="stretch" spacing={6}>
            <VStack align="stretch" spacing={2}>
                <Heading size="lg">{t('Smart Account')}</Heading>
                <Text opacity={0.7}>
                    {t(
                        'Automatic smart account for Privy users. Gas-less first action, recoverable, transferable.',
                    )}
                </Text>
            </VStack>

            <DemoSection
                title={t('How smart accounts work')}
                description={t(
                    'A primer on the ownership and recovery model.',
                )}
            >
                <SmartAccountInfo />
            </DemoSection>

            <ConnectGate feature={t('Smart Account')}>
                <DemoSection
                    title={t('Upgrade smart account')}
                    description={t(
                        'Migrate the smart account to the latest version when a new release is published.',
                    )}
                    hooks={['useUpgradeSmartAccountModal']}
                    code={UPGRADE_SNIPPET}
                >
                    <UpgradeButtonInline />
                </DemoSection>
            </ConnectGate>
        </VStack>
    );
}
