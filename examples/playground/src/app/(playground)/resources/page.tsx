'use client';

import { Heading, Text, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { ResourceList } from '../../components/features/Resources/ResourceList';

export default function ResourcesPage() {
    const { t } = useTranslation();

    return (
        <VStack align="stretch" spacing={6}>
            <VStack align="stretch" spacing={2}>
                <Heading size="lg">{t('Resources')}</Heading>
                <Text opacity={0.7}>
                    {t(
                        'Documentation, source code and integrations to go further with VeChain Kit.',
                    )}
                </Text>
            </VStack>

            <ResourceList />
        </VStack>
    );
}
