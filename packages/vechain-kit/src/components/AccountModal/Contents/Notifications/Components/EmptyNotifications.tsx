import { VStack, Icon, Text } from '@chakra-ui/react';
import { BiBell, BiArchive } from 'react-icons/bi';
import { useTranslation } from 'react-i18next';
import { useVeChainKitConfig } from '@/providers';

type Props = {
    showArchived: boolean;
};

export const EmptyNotifications = ({ showArchived }: Props) => {
    const { t } = useTranslation();
    const { darkMode: isDark } = useVeChainKitConfig();

    return (
        <VStack spacing={6} align="center" py={8}>
            <Icon
                as={showArchived ? BiArchive : BiBell}
                boxSize={16}
                opacity={0.5}
                color={isDark ? 'whiteAlpha.800' : 'gray.600'}
            />
            <VStack spacing={2}>
                <Text fontSize="lg" fontWeight="500" textAlign="center">
                    {showArchived
                        ? t('No archived notifications')
                        : t('No notifications')}
                </Text>
                <Text fontSize="md" opacity={0.7} textAlign="center" px={4}>
                    {showArchived
                        ? t('Cleared notifications will appear here')
                        : t(
                              'When you have notifications, they will appear here',
                          )}
                </Text>
            </VStack>
        </VStack>
    );
};
