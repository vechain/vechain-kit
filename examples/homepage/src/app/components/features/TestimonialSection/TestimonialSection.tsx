'use client';

import { Card, Text, VStack, useColorMode } from '@chakra-ui/react';
import { LuQuote } from 'react-icons/lu';
import { Icon } from '@chakra-ui/react';

interface TestimonialSectionProps {
    quote: string;
    author?: string;
    mt?: number;
}

export function TestimonialSection({
    quote,
    author,
    mt,
}: TestimonialSectionProps) {
    const { colorMode } = useColorMode();

    return (
        <Card
            variant="section"
            py={{ base: 16, md: 20 }}
            px={{ base: 4, md: 8 }}
            mt={mt}
        >
            <VStack
                spacing={6}
                align="center"
                maxW="4xl"
                mx="auto"
                textAlign="center"
            >
                <Icon
                    as={LuQuote}
                    boxSize={12}
                    color={colorMode === 'dark' ? 'gray.400' : 'gray.300'}
                />
                <Text
                    fontSize={{ base: 'xl', md: '2xl' }}
                    fontWeight="medium"
                    color={colorMode === 'dark' ? 'gray.200' : 'gray.700'}
                    fontStyle="italic"
                    lineHeight="1.6"
                >
                    {quote}
                </Text>
                {author && (
                    <Text
                        fontSize="md"
                        color={colorMode === 'dark' ? 'gray.400' : 'gray.500'}
                    >
                        — {author}
                    </Text>
                )}
            </VStack>
        </Card>
    );
}
