'use client';

import { VStack, Text, SimpleGrid } from '@chakra-ui/react';
import { MdAccountBalance } from 'react-icons/md';
import { CollapsibleCard } from '../../ui/CollapsibleCard';
import {
    useWallet,
    useCurrentAllocationsRoundId,
    useIsPerson,
} from '@vechain/vechain-kit';

export function DaoInfo() {
    const { account } = useWallet();
    const { data: currentAllocationsRoundId } = useCurrentAllocationsRoundId();
    const { data: isValidPassport } = useIsPerson(account?.address);

    return (
        <CollapsibleCard
            title="Contract Interactions"
            icon={MdAccountBalance}
            style={{ bg: 'whiteAlpha.100' }}
        >
            <VStack spacing={6} align="stretch">
                <Text textAlign="center">
                    VeChain Kit provides hooks to easily interact with popular
                    VeChain contracts. Here's how to use them in your
                    application.
                </Text>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    {/* Current Implementation */}
                    <VStack
                        spacing={4}
                        p={6}
                        borderRadius="md"
                        bg="whiteAlpha.50"
                    >
                        <Text fontWeight="bold">Live VeBetterDAO Data</Text>
                        <VStack spacing={3} align="start" w="full">
                            <Text>
                                <Text as="span" fontWeight="bold">
                                    Current Round ID:{' '}
                                </Text>
                                {currentAllocationsRoundId}
                            </Text>
                            <Text>
                                <Text as="span" fontWeight="bold">
                                    Valid Passport:{' '}
                                </Text>
                                {isValidPassport?.toString()}
                            </Text>
                        </VStack>
                    </VStack>
                </SimpleGrid>
            </VStack>
        </CollapsibleCard>
    );
}
