'use client';

import { ReactElement } from 'react';
import {
    VStack,
    Text,
    SimpleGrid,
    Button,
    Code,
    Box,
    Link,
    Heading,
} from '@chakra-ui/react';
import {
    useWallet,
    useTokenBalances,
    useGetTokenUsdPrice,
    useCurrentAllocationsRoundId,
} from '@vechain/vechain-kit';
import { MdDataUsage } from 'react-icons/md';
import { CollapsibleCard } from '../../ui/CollapsibleCard';

export function DataReadingExample(): ReactElement {
    const { account } = useWallet();
    const address = account?.address || '';

    const { data: tokenBalances, loading: isLoadingTokenBalances } =
        useTokenBalances(address);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_vetBalance, _vthoBalance, b3trBalance, vot3Balance] = tokenBalances;

    const { data: vetPrice, isLoading: isLoadingVetPrice } =
        useGetTokenUsdPrice('VET');
    const { data: vbdCurrentRoundId } = useCurrentAllocationsRoundId();

    return (
        <CollapsibleCard
            defaultIsOpen={false}
            title="Reading Blockchain Data"
            icon={MdDataUsage}
        >
            <VStack spacing={6} align="stretch">
                <Text textAlign="center">
                    VeChain Kit provides hooks to easily read data from the
                    blockchain. Here are some examples using built-in hooks.
                </Text>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    {/* Live Data Display */}
                    <VStack
                        spacing={4}
                        p={6}
                        borderRadius="md"
                        bg="whiteAlpha.50"
                    >
                        <Text fontWeight="bold">Live Blockchain Data</Text>
                        <VStack spacing={3} align="start" w="full">
                            <Text>
                                <Text as="span" fontWeight="bold">
                                    B3TR Balance:{' '}
                                </Text>
                                {isLoadingTokenBalances
                                    ? 'Loading...'
                                    : b3trBalance?.balance || '0'}
                            </Text>
                            <Text>
                                <Text as="span" fontWeight="bold">
                                    VOT3 Balance:{' '}
                                </Text>
                                {isLoadingTokenBalances
                                    ? 'Loading...'
                                    : vot3Balance?.balance || '0'}
                            </Text>
                            <Text>
                                <Text as="span" fontWeight="bold">
                                    VET Price:{' '}
                                </Text>
                                {isLoadingVetPrice
                                    ? 'Loading...'
                                    : `$${vetPrice?.toFixed(4) || '0'}`}
                            </Text>
                            <VStack mt={4} align="start" spacing={1}>
                                <Heading size="sm">VeBetterDAO</Heading>
                                <Text fontWeight="bold">
                                    Current round: {vbdCurrentRoundId}
                                </Text>
                            </VStack>
                        </VStack>
                    </VStack>

                    {/* Code Example */}
                    <VStack
                        spacing={4}
                        p={6}
                        borderRadius="md"
                        bg="whiteAlpha.50"
                    >
                        <Text fontWeight="bold">Implementation Example</Text>
                        <Box
                            w="full"
                            p={3}
                            bg="blackAlpha.300"
                            borderRadius="md"
                        >
                            <Code
                                display="block"
                                whiteSpace="pre"
                                p={2}
                                overflowX="auto"
                            >
                                {`// Import hooks
import {
    useGetB3trBalance,
    useGetTokenUsdPrice,
} from '@vechain/vechain-kit';

// Use hooks in your component
const { data: b3trBalance } = 
    useGetB3trBalance(address);
const { data: vetPrice } = 
    useGetTokenUsdPrice('VET');`}
                            </Code>
                        </Box>
                        <Button
                            as={Link}
                            isExternal
                            href="https://docs.vechainkit.vechain.org/vechain-kit/hooks"
                            w="full"
                            variant="outline"
                            rightIcon={<MdDataUsage />}
                        >
                            View Full Documentation
                        </Button>
                    </VStack>
                </SimpleGrid>

                <Text fontSize="sm" textAlign="center" color="gray.400">
                    Note: These hooks use react-query under the hood for
                    efficient data fetching and caching.
                </Text>
            </VStack>
        </CollapsibleCard>
    );
}
