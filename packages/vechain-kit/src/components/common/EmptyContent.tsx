import { VStack, Icon, Text, useToken } from '@chakra-ui/react';
import { ElementType } from 'react';

type Props = {
    title: string;
    description?: string;
    icon: ElementType;
};

export const EmptyContent = ({ title, description, icon }: Props) => {
    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');
    const textPrimary = useToken('colors', 'vechain-kit-text-primary');

    return (
        <VStack spacing={6} align="center" py={8}>
            <Icon as={icon} boxSize={16} color={textSecondary} />
            <VStack spacing={2}>
                <Text
                    fontSize="lg"
                    fontWeight="500"
                    textAlign="center"
                    color={textPrimary}
                >
                    {title}
                </Text>
                <Text
                    fontSize="md"
                    color={textSecondary}
                    textAlign="center"
                    px={4}
                >
                    {description}
                </Text>
            </VStack>
        </VStack>
    );
};
