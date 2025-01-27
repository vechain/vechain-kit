'use client';

import {
    Box,
    Heading,
    Text,
    VStack,
    Icon,
    Alert,
    AlertIcon,
    AlertDescription,
    SimpleGrid,
} from '@chakra-ui/react';
import { useWallet } from '@vechain/vechain-kit';
import { RiWalletLine } from 'react-icons/ri';
import { MdAccountBalanceWallet } from 'react-icons/md';

export function AccountInfo() {
    const { smartAccount, connectedWallet, connection } = useWallet();

    return (
        <Box
            p={8}
            borderRadius="lg"
            boxShadow="xl"
            bg="whiteAlpha.100"
            backdropFilter="blur(10px)"
        >
            <VStack spacing={6} align="stretch">
                <Heading size="lg" textAlign="left">
                    Your Account Details
                </Heading>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    {smartAccount.address && (
                        <VStack
                            spacing={4}
                            p={6}
                            borderRadius="md"
                            bg="whiteAlpha.50"
                        >
                            <Icon as={MdAccountBalanceWallet} boxSize={8} />
                            <Text fontWeight="bold">Smart Account</Text>
                            <VStack spacing={3} align="start">
                                <Text>
                                    <Text as="span" fontWeight="bold">
                                        Address:{' '}
                                    </Text>
                                    {smartAccount.address}
                                </Text>
                                <Text>
                                    <Text as="span" fontWeight="bold">
                                        Deployed:{' '}
                                    </Text>
                                    {smartAccount.isDeployed.toString()}
                                </Text>
                            </VStack>
                        </VStack>
                    )}

                    <VStack
                        spacing={4}
                        p={6}
                        borderRadius="md"
                        bg="whiteAlpha.50"
                    >
                        <Icon as={RiWalletLine} boxSize={8} />
                        <Text fontWeight="bold">
                            {connection.isConnectedWithPrivy
                                ? 'Embedded Wallet'
                                : 'Wallet'}
                        </Text>
                        <Text>
                            <Text as="span" fontWeight="bold">
                                Address:{' '}
                            </Text>
                            {connectedWallet?.address}
                        </Text>
                    </VStack>
                </SimpleGrid>

                <Alert status="info" bg="whiteAlpha.200">
                    <AlertIcon />
                    <AlertDescription fontSize="xs">
                        Smart accounts are not immediately deployed on login but
                        only after first action done by the user, avoiding
                        unnecessary money spent on gas.
                    </AlertDescription>
                </Alert>
            </VStack>
        </Box>
    );
}
