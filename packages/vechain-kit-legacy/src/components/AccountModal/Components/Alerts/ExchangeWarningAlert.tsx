import { Alert, AlertIcon, Text, VStack, HStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

export const ExchangeWarningAlert = () => {
    const { t } = useTranslation();

    return (
        <Alert status="warning" fontSize={'xs'} borderRadius={'xl'} p={2}>
            <VStack spacing={1} align="stretch" w="full">
                <HStack spacing={2} align="flex-start">
                    <AlertIcon boxSize={4} mt={'10px'} />
                    <Text w="full">
                        {t(
                            'Sending to OceanX or other exchanges may result in loss of funds.',
                        )}
                    </Text>
                </HStack>
            </VStack>
        </Alert>
    );
};
