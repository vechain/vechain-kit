import { VStack, Icon, Text, useToken } from '@chakra-ui/react';
import { useVeChainKitConfig } from '@/providers';
import { ElementType } from 'react';

type Props = {
    title: string;
    description?: string;
    icon: ElementType;
};

export const EmptyContent = ({ title, description, icon }: Props) => {
    const { darkMode: isDark } = useVeChainKitConfig();
    
    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');

    return (
        <VStack spacing={6} align="center" py={8}>
            <Icon
                as={icon}
                boxSize={16}
                opacity={0.5}
                color={textSecondary}
            />
            <VStack spacing={2}>
                <Text fontSize="lg" fontWeight="500" textAlign="center">
                    {title}
                </Text>
                <Text fontSize="md" opacity={0.7} textAlign="center" px={4}>
                    {description}
                </Text>
            </VStack>
        </VStack>
    );
};
