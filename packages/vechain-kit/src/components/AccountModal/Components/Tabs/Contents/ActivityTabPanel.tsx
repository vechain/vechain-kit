import { Icon, Text, VStack } from '@chakra-ui/react';
import { BiTransferAlt } from 'react-icons/bi';
import { useTranslation } from 'react-i18next';

export const ActivityTabPanel = () => {
    const { t } = useTranslation();
    return (
        <VStack spacing={4} align="center" mt={8}>
            <Icon
                as={BiTransferAlt}
                boxSize={12}
                opacity={0.5}
                p={2}
                bg="whiteAlpha.100"
                borderRadius="xl"
            />
            <VStack spacing={1}>
                <Text fontSize="lg" fontWeight="500">
                    {t('Coming soon')}
                </Text>
                <Text fontSize="sm" opacity={0.5} textAlign="center">
                    {t('Stay tuned for our upcoming Activity feature')}
                </Text>
            </VStack>
        </VStack>
    );
};
