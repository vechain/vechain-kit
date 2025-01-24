'use client';

import { SimpleGrid, VStack, Text, Icon, Button, Link } from '@chakra-ui/react';
import { FaWallet } from 'react-icons/fa';
import { RiAppsLine } from 'react-icons/ri';
import { MdAccountCircle } from 'react-icons/md';
import { CollapsibleCard } from '../../ui/CollapsibleCard';

export function ConnectionTypes() {
    return (
        <CollapsibleCard title="Available Connection Types" icon={RiAppsLine}>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                <VStack spacing={4} p={6} borderRadius="md" bg="whiteAlpha.50">
                    <Icon as={MdAccountCircle} boxSize={8} />
                    <Text fontWeight="bold">Privy</Text>
                    <Text fontSize="sm" textAlign="center">
                        Use your own Privy App ID for authentication. Perfect
                        for apps requiring dedicated user management.
                    </Text>
                </VStack>

                <VStack spacing={4} p={6} borderRadius="md" bg="whiteAlpha.50">
                    <Icon as={RiAppsLine} boxSize={8} />
                    <Text fontWeight="bold">Ecosystem Cross-App</Text>
                    <Text fontSize="sm" textAlign="center">
                        Enable social login on your app without paying any
                        subscription fees to Privy by using "Login with
                        VeChain".
                    </Text>
                </VStack>

                <VStack spacing={4} p={6} borderRadius="md" bg="whiteAlpha.50">
                    <Icon as={FaWallet} boxSize={8} />
                    <Text fontWeight="bold">Wallet</Text>
                    <Text fontSize="sm" textAlign="center">
                        Connect directly with VeWorld, Sync2, or via
                        WalletConnect for traditional Web3 authentication.
                    </Text>
                </VStack>
            </SimpleGrid>

            {/* New section for testing login persistence */}
            <VStack
                w={'full'}
                spacing={4}
                mt={10}
                p={6}
                borderRadius="md"
                bg="blue.100"
                _dark={{ bg: 'blue.900' }}
            >
                <Text fontWeight="bold">Try It Out!</Text>
                <Text fontSize="md" textAlign="center">
                    Test your login persistence across the VeChain ecosystem!
                    Visit{' '}
                    <a
                        href="https://vechain.github.io/smart-accounts-factory/"
                        style={{
                            textDecoration: 'underline',
                            fontWeight: 'bold',
                        }}
                    >
                        this website
                    </a>{' '}
                    and log in with the same account - you'll see that your
                    identity remains consistent across different applications.
                </Text>

                <Button>
                    <Link href="https://vechain.github.io/smart-accounts-factory/">
                        Go to website
                    </Link>
                </Button>
            </VStack>
        </CollapsibleCard>
    );
}
