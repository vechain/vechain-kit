import { Icon, Text, VStack, Button } from '@chakra-ui/react';
import { LuWallet } from 'react-icons/lu';
import { useTranslation } from 'react-i18next';

type Props = {
    onOpenReceiveModal: () => void;
};

export const NFTsTabPanel = ({ onOpenReceiveModal }: Props) => {
    const { t } = useTranslation();
    return (
        <VStack spacing={4} align="center" mt={8}>
            <Icon
                as={LuWallet}
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
                    {t('Stay tuned for our upcoming NFT feature')}
                </Text>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onOpenReceiveModal}
                    mt={2}
                >
                    {t('Receive tokens')}
                </Button>
            </VStack>
        </VStack>
    );
};
