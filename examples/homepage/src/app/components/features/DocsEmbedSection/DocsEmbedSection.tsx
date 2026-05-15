'use client';

import {
    Card,
    VStack,
    Heading,
    Text,
    Box,
    useColorMode,
    useColorModeValue,
} from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import { useTranslation } from 'react-i18next';
import { GitBookProvider } from '@gitbook/embed/react';

const GitBookFrame = dynamic(
    () => import('@gitbook/embed/react').then((m) => m.GitBookFrame),
    { ssr: false },
);

export function DocsEmbedSection() {
    const { colorMode } = useColorMode();
    const { t } = useTranslation();
    const frameBg = useColorModeValue('white', '#0d1117');
    const frameBorder = useColorModeValue('#d0d7de', '#30363d');

    return (
        <Card
            variant="section"
            py={{ base: 16, md: 20 }}
            px={{ base: 4, md: 8 }}
        >
            <VStack
                spacing={6}
                align="center"
                maxW="5xl"
                mx="auto"
                w="full"
                textAlign="center"
            >
                <VStack spacing={3}>
                    <Heading
                        as="h2"
                        fontSize={{ base: '2xl', md: '3xl' }}
                        fontWeight="bold"
                        color={colorMode === 'dark' ? 'white' : 'gray.900'}
                    >
                        {t('Ask the docs')}
                    </Heading>
                    <Text
                        fontSize={{ base: 'lg', md: 'xl' }}
                        color={colorMode === 'dark' ? 'gray.300' : 'gray.600'}
                        maxW="2xl"
                    >
                        {t(
                            'Search or chat with the VeChain Kit docs without leaving this page.',
                        )}
                    </Text>
                </VStack>

                <Box
                    w="full"
                    h={{ base: '500px', md: '600px' }}
                    bg={frameBg}
                    borderWidth="1px"
                    borderColor={frameBorder}
                    borderRadius="xl"
                    overflow="hidden"
                    boxShadow={
                        colorMode === 'dark'
                            ? '0 10px 30px rgba(0,0,0,0.4)'
                            : '0 10px 30px rgba(0,0,0,0.08)'
                    }
                >
                    <GitBookProvider siteURL="https://docs.vechainkit.vechain.org">
                        <GitBookFrame tabs={['assistant', 'docs']} />
                    </GitBookProvider>
                </Box>
            </VStack>
        </Card>
    );
}
