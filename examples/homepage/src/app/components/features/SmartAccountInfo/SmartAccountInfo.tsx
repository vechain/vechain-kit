'use client';

import { SimpleGrid, VStack, Text, Icon } from '@chakra-ui/react';
import { RiShieldKeyholeLine, RiLockPasswordLine } from 'react-icons/ri';
import { MdSecurity } from 'react-icons/md';
import { CollapsibleCard } from '../../ui/CollapsibleCard';

export function SmartAccountInfo() {
    return (
        <CollapsibleCard
            title="Smart Account Explained"
            icon={RiShieldKeyholeLine}
        >
            <VStack spacing={6} align="stretch">
                <Text textAlign="center">
                    When using Privy authentication (direct or cross-app), a
                    Smart Account is automatically created and linked to your
                    wallet. This account becomes your primary identity on
                    VeChain, offering enhanced security and flexibility.
                </Text>

                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                    <VStack
                        spacing={4}
                        p={6}
                        borderRadius="md"
                        bg="whiteAlpha.50"
                    >
                        <Icon as={RiShieldKeyholeLine} boxSize={8} />
                        <Text fontWeight="bold">Secure Ownership</Text>
                        <Text fontSize="sm" textAlign="center">
                            Exclusively controlled by your Privy-secured wallet
                        </Text>
                    </VStack>

                    <VStack
                        spacing={4}
                        p={6}
                        borderRadius="md"
                        bg="whiteAlpha.50"
                    >
                        <Icon as={RiLockPasswordLine} boxSize={8} />
                        <Text fontWeight="bold">Transferable</Text>
                        <Text fontSize="sm" textAlign="center">
                            Transfer ownership to another wallet anytime
                        </Text>
                    </VStack>

                    <VStack
                        spacing={4}
                        p={6}
                        borderRadius="md"
                        bg="whiteAlpha.50"
                    >
                        <Icon as={MdSecurity} boxSize={8} />
                        <Text fontWeight="bold">Recovery</Text>
                        <Text fontSize="sm" textAlign="center">
                            Secure backup and recovery through Privy
                        </Text>
                    </VStack>
                </SimpleGrid>
            </VStack>
        </CollapsibleCard>
    );
}
