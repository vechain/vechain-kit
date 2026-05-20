'use client';

import { useTranslation } from 'react-i18next';
import { IdentityPanel } from '../Identity/IdentityPanel';
import { Text, VStack } from '@chakra-ui/react';

export function AccountInfo() {
    const { t } = useTranslation();

    return (
        <VStack align="stretch" spacing={4}>
            <Text fontSize="sm" opacity={0.7}>
                {t(
                    'Smart accounts are not deployed on login but only after the first action — no gas spent until you need it.',
                )}
            </Text>
            <IdentityPanel />
        </VStack>
    );
}
