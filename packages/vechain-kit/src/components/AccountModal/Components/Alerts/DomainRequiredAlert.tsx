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

export const DomainRequiredAlert = () => {
    const { t } = useTranslation();
    const [showFullText, setShowFullText] = useState(false);

    return (
        <Alert status="warning" fontSize={'xs'} borderRadius={'xl'} p={2}>
            <VStack spacing={1} align="stretch" w="full">
                <HStack spacing={2} align="flex-start">
                    <AlertIcon boxSize={4} />
                    <Text w="full">
                        {t(
                            'A .vet domain is required to customize your profile.',
                        )}
                        {showFullText &&
                            t(
                                'Your profile information will be associated with your domain and visible to other applications.',
                            )}
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
