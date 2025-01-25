'use client';

import {
    Box,
    Button,
    Text,
    VStack,
    Heading,
    SimpleGrid,
    Icon,
    Image,
    Link,
    HStack,
} from '@chakra-ui/react';
import { FaGithub } from 'react-icons/fa';
import { IoDocumentText } from 'react-icons/io5';
import {
    MdBrush,
    MdCode,
    MdOutlineUpcoming,
    MdConstruction,
} from 'react-icons/md';
import { RiUserSettingsLine } from 'react-icons/ri';
import { SiNpm } from 'react-icons/si';

export function Introduction() {
    return (
        <Box
            p={8}
            borderRadius="lg"
            boxShadow="xl"
            bg="whiteAlpha.100"
            backdropFilter="blur(10px)"
        >
            <VStack spacing={6} align="stretch">
                <HStack justifyContent="center">
                    <Image
                        src={
                            'https://i.ibb.co/ncysMF9/vechain-kit-logo-transparent.png'
                        }
                        maxW={'350px'}
                        maxH={'175px'}
                        alt="logo"
                        animation="bounce 3s infinite"
                        transform="rotate(-10deg)"
                        sx={{
                            '@keyframes bounce': {
                                '0%, 100%': {
                                    transform: 'rotate(0deg) translateX(0)',
                                },
                                '50%': {
                                    transform: 'rotate(0deg) translateY(5px)',
                                },
                            },
                        }}
                    />
                </HStack>
                <Heading as="h1" size="lg" textAlign="center">
                    Welcome to VeChain Kit!
                </Heading>

                <Text textAlign="center">
                    This is a demonstration of VeChain Kit features and
                    capabilities. Learn how to integrate VeChain in your dApp
                    using our resources below.
                </Text>

                <Box
                    display="flex"
                    gap={4}
                    justifyContent="center"
                    flexWrap="wrap"
                >
                    <Button
                        leftIcon={<SiNpm />}
                        as="a"
                        href="https://www.npmjs.com/package/@vechain/vechain-kit"
                        target="_blank"
                        rel="noopener noreferrer"
                        colorScheme="red"
                    >
                        View on NPM
                    </Button>

                    <Button
                        leftIcon={<FaGithub />}
                        as="a"
                        href="https://github.com/vechain/vechain-kit"
                        target="_blank"
                        rel="noopener noreferrer"
                        colorScheme="gray"
                    >
                        Contribute on GitHub
                    </Button>

                    <Button
                        leftIcon={<IoDocumentText />}
                        as="a"
                        href="https://vechain-foundation-san-marino.gitbook.io/vechain-kit"
                        target="_blank"
                        rel="noopener noreferrer"
                        colorScheme="gray"
                    >
                        Documentation
                    </Button>

                    <Button
                        leftIcon={
                            <Image
                                src="https://vechain.github.io/smart-accounts-factory/assets/logo-DnOsqNR_.png"
                                alt="Smart Account Factory"
                                width={8}
                                height={8}
                            />
                        }
                        as="a"
                        href="https://vechain.github.io/smart-accounts-factory/"
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="outline"
                    >
                        Smart Account Factory
                    </Button>
                </Box>
            </VStack>

            <VStack mt={14} spacing={6} align="stretch">
                <Text textAlign="center" fontWeight="bold" fontSize="lg">
                    Key Objectives
                </Text>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    <Box p={4} borderRadius="md" borderWidth="1px">
                        <VStack align="start" spacing={3}>
                            <Icon as={MdCode} boxSize={6} color="blue.400" />
                            <Text fontWeight="bold">Easier Integration</Text>
                            <Text>
                                We provide a standardized "kit" for dApp
                                developers to quickly integrate social login and
                                VeChain Smart Accounts, without the overhead of
                                manual contract deployment and configuration.
                            </Text>
                        </VStack>
                    </Box>

                    <Box p={4} borderRadius="md" borderWidth="1px">
                        <VStack align="start" spacing={3}>
                            <Icon
                                as={RiUserSettingsLine}
                                boxSize={6}
                                color="green.400"
                            />
                            <Text fontWeight="bold">
                                Unified Ecosystem Accounts
                            </Text>
                            <Text>
                                Leverage Privy's Ecosystem feature to enable a
                                single wallet per user across multiple apps,
                                ensuring a consistent and cohesive user identity
                                within the VeChain network.
                            </Text>
                            <Link
                                href="https://vechain.github.io/smart-accounts-factory/"
                                style={{
                                    textDecoration: 'underline',
                                    fontWeight: 'bold',
                                }}
                                target="_blank"
                            >
                                Try it!
                            </Link>
                        </VStack>
                    </Box>

                    <Box p={4} borderRadius="md" borderWidth="1px">
                        <VStack align="start" spacing={3}>
                            <Icon as={MdBrush} boxSize={6} color="purple.400" />
                            <Text fontWeight="bold">Developer Tools</Text>
                            <Text>
                                Hooks to read and write data to the blockchain,
                                UI components for your app, and out of the box
                                wallet and identity management for your users.
                            </Text>
                        </VStack>
                    </Box>

                    <Box
                        p={4}
                        borderRadius="md"
                        borderWidth="1px"
                        bgGradient="linear(to-r, gray.50, gray.100)"
                        position="relative"
                        _dark={{
                            bgGradient: 'linear(to-r, gray.700, gray.800)',
                        }}
                    >
                        <VStack align="start" spacing={3}>
                            <Icon
                                as={MdOutlineUpcoming}
                                boxSize={6}
                                color="orange.400"
                            />
                            <Text fontWeight="bold">More Coming Soon</Text>
                            <Text>
                                Stay tuned for additional features and
                                improvements as we continue to enhance the
                                VeChain Kit ecosystem.
                            </Text>
                            <Box position="absolute" bottom={2} right={2}>
                                <Icon
                                    as={MdConstruction}
                                    boxSize={5}
                                    color="gray.400"
                                />
                            </Box>
                        </VStack>
                    </Box>
                </SimpleGrid>
            </VStack>
        </Box>
    );
}
