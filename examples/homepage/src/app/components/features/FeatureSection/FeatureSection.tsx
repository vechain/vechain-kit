'use client';

import { Card, VStack, Text, Heading, HStack, Icon, useColorMode, Stack } from '@chakra-ui/react';
import { ReactElement } from 'react';

type FeatureVariant = 'purple' | 'blue' | 'beige' | 'green' | 'grey' | 'dark';

interface FeatureSectionProps {
    title: string;
    description: string;
    icon?: React.ElementType;
    variant?: FeatureVariant;
    reverse?: boolean;
}

const variantMap: Record<FeatureVariant, string> = {
    purple: 'featurePurple',
    blue: 'featureBlue',
    beige: 'featureBeige',
    green: 'featureGreen',
    grey: 'featureGrey',
    dark: 'featureDark',
};

export function FeatureSection({
    title,
    description,
    icon,
    variant = 'purple',
    reverse = false,
}: FeatureSectionProps) {
    const { colorMode } = useColorMode();
    const cardVariant = variantMap[variant];

    return (
        <Card variant={cardVariant as any} py={{ base: 12, md: 16 }} px={{ base: 6, md: 12 }}>
            <Stack
                direction={{ base: 'column', md: reverse ? 'row-reverse' : 'row' }}
                spacing={8}
                align={{ base: 'flex-start', md: 'center' }}
            >
                <VStack
                    flex={1}
                    align={{ base: 'flex-start', md: reverse ? 'flex-end' : 'flex-start' }}
                    spacing={4}
                    minW={{ base: '100%', md: '300px' }}
                >
                    {icon && (
                        <Icon
                            as={icon}
                            boxSize={8}
                            color={colorMode === 'dark' ? 'primary.400' : 'primary.600'}
                        />
                    )}
                    <Heading
                        as="h2"
                        fontSize={{ base: 'xl', md: '2xl' }}
                        fontWeight="bold"
                        color={colorMode === 'dark' ? 'white' : 'gray.900'}
                        textAlign={{ base: 'left', md: reverse ? 'right' : 'left' }}
                    >
                        {title}
                    </Heading>
                    <Text
                        fontSize={{ base: 'md', md: 'lg' }}
                        color={colorMode === 'dark' ? 'gray.300' : 'gray.600'}
                        lineHeight="1.6"
                        textAlign={{ base: 'left', md: reverse ? 'right' : 'left' }}
                    >
                        {description}
                    </Text>
                </VStack>
                <VStack flex={1} minW={{ base: '100%', md: '300px' }} align="center">
                    {/* Placeholder for visual content - can be replaced with images or illustrations */}
                </VStack>
            </Stack>
        </Card>
    );
}

