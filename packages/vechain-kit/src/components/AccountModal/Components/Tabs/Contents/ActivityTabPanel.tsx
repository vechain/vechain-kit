import { Icon, Text, VStack } from '@chakra-ui/react';
import { BiTransferAlt } from 'react-icons/bi';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const MotionVStack = motion(VStack);

export const ActivityTabPanel = () => {
    const { t } = useTranslation();
    return (
        <MotionVStack
            spacing={4}
            align="center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            mt={8}
        >
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
        </MotionVStack>
    );
};
