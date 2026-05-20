'use client';

import { Heading, Text, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { DemoSection } from '../../components/demo/DemoSection';
import { ConnectGate } from '../../components/demo/ConnectGate';
import { ModalCatalog } from '../../components/features/ModalCatalog';

const MODAL_SNIPPET = `import { useSendTokenModal } from '@vechain/vechain-kit';

function SendButton() {
    const { open } = useSendTokenModal();
    return <Button onClick={() => open()}>Send tokens</Button>;
}
`;

export default function ModalsPage() {
    const { t } = useTranslation();

    return (
        <VStack align="stretch" spacing={6}>
            <VStack align="stretch" spacing={2}>
                <Heading size="lg">{t('Modals')}</Heading>
                <Text opacity={0.7}>
                    {t(
                        'Every feature in the kit ships as both a hook and a modal. Trigger them from your own UI.',
                    )}
                </Text>
            </VStack>

            <ConnectGate feature={t('Modals')}>
                <DemoSection
                    title={t('Modal catalog')}
                    description={t(
                        'Click any card to open the corresponding modal in isolated view. Each card lists the hook that opens it.',
                    )}
                    code={MODAL_SNIPPET}
                >
                    <ModalCatalog />
                </DemoSection>
            </ConnectGate>
        </VStack>
    );
}
