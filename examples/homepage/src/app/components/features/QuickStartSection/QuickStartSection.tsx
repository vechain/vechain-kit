'use client';

import {
    VStack,
    Heading,
    Text,
    Card,
    Box,
    HStack,
    IconButton,
    useColorMode,
    useColorModeValue,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LuCopy, LuCheck } from 'react-icons/lu';
import { Icon } from '@chakra-ui/react';

const COMMAND = 'npx create-vechain-dapp@latest';

function TerminalCodeBlock() {
    const { t } = useTranslation();
    const [copied, setCopied] = useState(false);

    const bgColor = useColorModeValue('#1a1a1a', '#0d1117');
    const textColor = useColorModeValue('#c9d1d9', '#c9d1d9');
    const promptColor = useColorModeValue('#58a6ff', '#58a6ff');
    const borderColor = useColorModeValue('#30363d', '#21262d');

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(COMMAND);
            setCopied(true);
            setTimeout(() => {
                setCopied(false);
            }, 2000);
        } catch {
            // Silently fail if clipboard access is not available
        }
    };

    return (
        <Box
            position="relative"
            bg={bgColor}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={borderColor}
            p={6}
            fontFamily="monospace"
            maxW="full"
            overflowX="auto"
        >
            <HStack spacing={4} align="flex-start">
                <Text color={promptColor} fontSize="md" fontWeight="bold">
                    $
                </Text>
                <Text color={textColor} fontSize="md" flex={1} textAlign="left">
                    {COMMAND}
                </Text>
                <IconButton
                    aria-label={t('Copy command')}
                    icon={<Icon as={copied ? LuCheck : LuCopy} />}
                    onClick={handleCopy}
                    size="sm"
                    variant="ghost"
                    color={textColor}
                    _hover={{
                        bg: 'rgba(255, 255, 255, 0.1)',
                    }}
                />
            </HStack>
            <Box mt={4} pt={4} borderTopWidth="1px" borderColor={borderColor}>
                <Text color={promptColor} fontSize="sm" mb={2} textAlign="left">
                    ? Select template ›
                </Text>
                <Text color={textColor} fontSize="sm" ml={4} textAlign="left">
                    ❯ VeChain Kit Next.js Template (Chakra, React Query, SDK)
                </Text>
            </Box>
        </Box>
    );
}

export function QuickStartSection() {
    const { colorMode } = useColorMode();
    const { t } = useTranslation();

    return (
        <Card
            variant="section"
            py={{ base: 16, md: 20 }}
            px={{ base: 4, md: 8 }}
        >
            <VStack
                spacing={8}
                align="center"
                maxW="4xl"
                mx="auto"
                w="full"
                textAlign="center"
            >
                <VStack spacing={4}>
                    <Heading
                        as="h2"
                        fontSize={{ base: '2xl', md: '3xl' }}
                        fontWeight="bold"
                        color={colorMode === 'dark' ? 'white' : 'gray.900'}
                    >
                        {t('Start building your new app now')}
                    </Heading>
                    <Text
                        fontSize={{ base: 'lg', md: 'xl' }}
                        color={colorMode === 'dark' ? 'gray.300' : 'gray.600'}
                        fontWeight="medium"
                    >
                        {t('Only one command to setup')}
                    </Text>
                </VStack>

                <Box w="full" maxW="2xl">
                    <TerminalCodeBlock />
                </Box>

                <Text
                    fontSize={{ base: 'md', md: 'lg' }}
                    color={colorMode === 'dark' ? 'gray.400' : 'gray.500'}
                    maxW="2xl"
                >
                    {t(
                        'Includes VeChain Kit, Chakra UI, React Query, SDK and more',
                    )}
                </Text>
            </VStack>
        </Card>
    );
}
