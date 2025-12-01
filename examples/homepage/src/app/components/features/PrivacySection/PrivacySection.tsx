'use client';

import { Card, VStack, Heading, HStack, Text, Icon, SimpleGrid, useColorMode } from '@chakra-ui/react';
import { LuShield } from 'react-icons/lu';

interface PrivacyFeature {
    title: string;
    description: string;
    icon?: React.ElementType;
}

interface PrivacySectionProps {
    title?: string;
    features: PrivacyFeature[];
}

export function PrivacySection({
    title = 'Private by design',
    features,
}: PrivacySectionProps) {
    const { colorMode } = useColorMode();

    return (
        <Card variant="section" py={{ base: 16, md: 20 }} px={{ base: 4, md: 8 }}>
            <VStack spacing={12} align="center" maxW="6xl" mx="auto">
                <HStack spacing={4} align="center">
                    <Icon
                        as={LuShield}
                        boxSize={12}
                        color={colorMode === 'dark' ? 'primary.400' : 'primary.600'}
                    />
                    <Heading
                        as="h2"
                        fontSize={{ base: '2xl', md: '3xl' }}
                        fontWeight="bold"
                        color={colorMode === 'dark' ? 'white' : 'gray.900'}
                    >
                        {title}
                    </Heading>
                </HStack>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} w="full">
                    {features.map((feature, index) => (
                        <VStack
                            key={index}
                            spacing={4}
                            align="flex-start"
                            p={6}
                            borderRadius="lg"
                            bg={colorMode === 'dark' ? 'whiteAlpha.50' : 'gray.50'}
                        >
                            {feature.icon && (
                                <Icon
                                    as={feature.icon}
                                    boxSize={6}
                                    color={colorMode === 'dark' ? 'primary.400' : 'primary.600'}
                                />
                            )}
                            <Heading
                                as="h3"
                                fontSize="lg"
                                fontWeight="semibold"
                                color={colorMode === 'dark' ? 'white' : 'gray.900'}
                            >
                                {feature.title}
                            </Heading>
                            <Text
                                fontSize="sm"
                                color={colorMode === 'dark' ? 'gray.300' : 'gray.600'}
                                lineHeight="1.6"
                            >
                                {feature.description}
                            </Text>
                        </VStack>
                    ))}
                </SimpleGrid>
            </VStack>
        </Card>
    );
}

