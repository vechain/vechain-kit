import {
    Alert,
    AlertIcon,
    Text,
    Button,
    VStack,
    HStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const ExchangeWarningAlert = () => {
    const { t } = useTranslation();
    const [showFullText, setShowFullText] = useState(false);

    return (
        <Alert status="warning" fontSize={'xs'} borderRadius={'xl'} p={2}>
            <VStack spacing={1} align="stretch" w="full">
                <HStack spacing={2} align="flex-start">
                    <AlertIcon boxSize={4} />
                    <Text w="full">
                        {t(
                            'Sending to OceanX or other exchanges may result in loss of funds.',
                        )}
                        {showFullText &&
                            t('Send the tokens to your VeWorld wallet first.')}
                        <Button
                            variant="link"
                            size="xs"
                            onClick={() => setShowFullText(!showFullText)}
                            color="inherit"
                            pl={6}
                            mt={0}
                        >
                            {t(showFullText ? 'Show Less' : 'Read More')}
                        </Button>
                    </Text>
                </HStack>
            </VStack>
        </Alert>
    );
};
