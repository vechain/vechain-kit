import { Alert, AlertIcon, Text, VStack, HStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

export const DomainRequiredAlert = () => {
    const { t } = useTranslation();

    return (
        <Alert status="warning" fontSize={'xs'} borderRadius={'xl'} p={2}>
            <VStack spacing={1} align="stretch" w="full">
                <HStack spacing={2} align="flex-start">
                    <AlertIcon boxSize={4} mt={'10px'} />
                    <Text w="full">
                        {t(
                            'A .vet domain is required to customize your profile. Choose an account name to get started.',
                        )}
                    </Text>
                </HStack>
            </VStack>
        </Alert>
    );
};
