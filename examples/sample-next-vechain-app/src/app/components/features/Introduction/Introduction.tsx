'use client';

import {
    Box,
    Button,
    Text,
    VStack,
    Heading,
    SimpleGrid,
    Icon,
} from '@chakra-ui/react';
import { FaGithub } from 'react-icons/fa';
import { IoDocumentText } from 'react-icons/io5';
import { MdBrush, MdCode } from 'react-icons/md';
import { RiUserSettingsLine } from 'react-icons/ri';

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
                <Heading as="h1" size="lg" textAlign="center">
                    Welcome to VeChain Kit Sample App! 👋
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
                        leftIcon={<FaGithub />}
                        as="a"
                        href="https://github.com/vechain/vechain-kit"
                        target="_blank"
                        rel="noopener noreferrer"
                        colorScheme="gray"
                    >
                        View on GitHub
                    </Button>

                    <Button
                        leftIcon={<IoDocumentText />}
                        as="a"
                        href="https://vechain-foundation-san-marino.gitbook.io/vechain-kit"
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="outline"
                    >
                        Documentation
                    </Button>
                </Box>
            </VStack>

            <VStack mt={14} spacing={6} align="stretch">
                <Text textAlign="center">
                    Beyond social login capabilities, VeChain Kit enhances the
                    users and developer experience with powerful features as:
                    assets management, vet domains claiming, hooks to read and
                    write data from smart contracts, out of the box UI
                    components for transactions and login.
                </Text>

                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                    <VStack
                        spacing={4}
                        p={6}
                        borderRadius="md"
                        bg="whiteAlpha.50"
                    >
                        <Icon as={RiUserSettingsLine} boxSize={8} />
                        <Text fontWeight="bold">Social Login</Text>
                        <Text fontSize="sm" textAlign="center">
                            Seamlessly integrate social authentication with
                            support for multiple providers and cross-app
                            functionality.
                        </Text>
                    </VStack>

                    <VStack
                        spacing={4}
                        p={6}
                        borderRadius="md"
                        bg="whiteAlpha.50"
                    >
                        <Icon as={MdBrush} boxSize={8} />
                        <Text fontWeight="bold">UI Customization</Text>
                        <Text fontSize="sm" textAlign="center">
                            Customize the look and feel of modals, buttons, and
                            components to match your app's design system.
                        </Text>
                    </VStack>

                    <VStack
                        spacing={4}
                        p={6}
                        borderRadius="md"
                        bg="whiteAlpha.50"
                    >
                        <Icon as={MdCode} boxSize={8} />
                        <Text fontWeight="bold">Developer Hooks</Text>
                        <Text fontSize="sm" textAlign="center">
                            Access powerful hooks to interact with smart
                            contracts in a easy way.
                        </Text>
                    </VStack>
                </SimpleGrid>
            </VStack>
        </Box>
    );
}
