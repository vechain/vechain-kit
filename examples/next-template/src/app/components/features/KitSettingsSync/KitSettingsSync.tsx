'use client';

import { Box, Heading, VStack, Text, Badge, Code } from '@chakra-ui/react';
import { useVeChainKitConfig } from '@vechain/vechain-kit';
import { useEffect, useState } from 'react';

export function KitSettingsSync() {
    const { currentLanguage, currentCurrency, language, defaultCurrency } =
        useVeChainKitConfig();
    const [updateCount, setUpdateCount] = useState(0);

    // Track when values change to demonstrate reactivity
    useEffect(() => {
        setUpdateCount((prev) => prev + 1);
    }, [currentLanguage, currentCurrency]);

    return (
        <Box>
            <Heading size={'md'} mb={4}>
                <b>Kit Settings Sync Demo</b>
            </Heading>
            <VStack spacing={4} alignItems="flex-start">
                <Text fontSize="sm" color="gray.500">
                    This component demonstrates how host apps can access the
                    current language and currency selected in the kit. Change
                    these values in the kit settings (via WalletButton → Settings
                    → General) and watch them update here automatically.
                </Text>

                <Box w="full" p={4} bg="gray.50" borderRadius="md">
                    <Heading size={'sm'} mb={2}>
                        Language Settings
                    </Heading>
                    <VStack spacing={2} alignItems="flex-start">
                        <Text>
                            <strong>Initial language prop:</strong>{' '}
                            <Code>{language || 'not set'}</Code>
                        </Text>
                        <Text>
                            <strong>Current language (from kit):</strong>{' '}
                            <Badge colorScheme="blue" fontSize="md">
                                {currentLanguage}
                            </Badge>
                        </Text>
                        <Text fontSize="xs" color="gray.600">
                            Change language in kit settings to see this update
                        </Text>
                    </VStack>
                </Box>

                <Box w="full" p={4} bg="gray.50" borderRadius="md">
                    <Heading size={'sm'} mb={2}>
                        Currency Settings
                    </Heading>
                    <VStack spacing={2} alignItems="flex-start">
                        <Text>
                            <strong>Default currency prop:</strong>{' '}
                            <Code>{defaultCurrency || 'usd'}</Code>
                        </Text>
                        <Text>
                            <strong>Current currency (from kit):</strong>{' '}
                            <Badge colorScheme="green" fontSize="md">
                                {currentCurrency.toUpperCase()}
                            </Badge>
                        </Text>
                        <Text fontSize="xs" color="gray.600">
                            Change currency in kit settings to see this update
                        </Text>
                    </VStack>
                </Box>

                <Box w="full" p={3} bg="blue.50" borderRadius="md">
                    <Text fontSize="xs" color="blue.700">
                        <strong>Update count:</strong> {updateCount} (increments
                        when language or currency changes)
                    </Text>
                </Box>
            </VStack>
        </Box>
    );
}

