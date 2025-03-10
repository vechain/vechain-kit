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
import { useWallet } from '@vechain/vechain-kit';
import { FaGithub } from 'react-icons/fa';
import { IoDocumentText, IoWalletOutline } from 'react-icons/io5';
import { MdBrush, MdCode } from 'react-icons/md';
import { CiLogin } from 'react-icons/ci';
import { SiNpm } from 'react-icons/si';

export function Introduction() {
    const { connection } = useWallet();
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
                    Welcome to VeChain Kit!
                </Heading>

                <Text textAlign="center">
                    VeChain Kit is a comprehensive library, for React and
                    NextJs, designed to make building VeChain applications fast
                    and straightforward. Learn how to integrate VeChain in your
                    dApp using our resources below.
                    {connection.isConnected
                        ? ''
                        : ' Login to view all available features.'}
                </Text>

                <Box
                    display="flex"
                    gap={4}
                    justifyContent="center"
                    flexWrap="wrap"
                >
                    <VStack spacing={4}>
                        <SimpleGrid
                            columns={{ base: 1, md: 1 }}
                            spacing={4}
                            width="100%"
                        >
                            <Button
                                leftIcon={<IoDocumentText />}
                                as={Link}
                                href="https://docs.vechainkit.vechain.org/"
                                isExternal
                                rel="noopener noreferrer"
                                colorScheme="gray"
                                size="lg"
                                width="100%"
                            >
                                Get Started with our Docs
                            </Button>
                        </SimpleGrid>
                        <SimpleGrid
                            columns={{ base: 1, md: 3 }}
                            spacing={4}
                            width="100%"
                        >
                            <Button
                                leftIcon={<SiNpm />}
                                as="a"
                                href="https://www.npmjs.com/package/@vechain/vechain-kit"
                                target="_blank"
                                rel="noopener noreferrer"
                                colorScheme="red"
                                width="100%"
                            >
                                View Package on NPM
                            </Button>
                            <Button
                                leftIcon={<FaGithub />}
                                as="a"
                                href="https://github.com/vechain/vechain-kit"
                                target="_blank"
                                rel="noopener noreferrer"
                                colorScheme="gray"
                                width="100%"
                            >
                                View GitHub Repository
                            </Button>
                            <Button
                                leftIcon={
                                    <Image
                                        src="https://vechain.github.io/smart-accounts/assets/logo-DnOsqNR_.png"
                                        alt="Smart Account Factory"
                                        width={7}
                                        height={7}
                                    />
                                }
                                as="a"
                                href="https://vechain.github.io/smart-accounts/"
                                target="_blank"
                                rel="noopener noreferrer"
                                variant="outline"
                                width="100%"
                            >
                                Learn about Smart Accounts
                            </Button>
                        </SimpleGrid>
                    </VStack>
                </Box>
            </VStack>

            <VStack mt={14} spacing={6} align="stretch">
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    <Box p={4} borderRadius="md" borderWidth="1px">
                        <VStack align="start" spacing={3}>
                            <Icon as={CiLogin} boxSize={6} color="blue.400" />
                            <Text fontWeight="bold">
                                VeChain Wallet Connection
                            </Text>
                            <Text>
                                Easily connect your users to your dApp with out
                                of the box wallet connection options. Choose
                                between: VeWorld, Sync2, Wallet Connect, VeChain
                                social login, Privy social login, and more.
                            </Text>
                        </VStack>
                    </Box>

                    <Box p={4} borderRadius="md" borderWidth="1px">
                        <VStack align="start" spacing={3}>
                            <Icon
                                as={IoWalletOutline}
                                boxSize={6}
                                color="blue.400"
                            />
                            <Text fontWeight="bold">
                                Make your dApp a super dApp
                            </Text>
                            <Text>
                                By using VeChain Kit, your users will have asset
                                management, profile management, transaction
                                signing, and more. All of this is handled for
                                you, so you can focus on building your dApp.
                            </Text>
                        </VStack>
                    </Box>

                    <Box p={4} borderRadius="md" borderWidth="1px">
                        <VStack align="start" spacing={3}>
                            <Icon as={MdCode} boxSize={6} color="green.400" />
                            <Text fontWeight="bold">
                                Speed up your development
                            </Text>
                            <Text>
                                Use our hooks and components to speed up your
                                development. No need to worry about the
                                underlying VeChain infrastructure, we handle it
                                for you.
                            </Text>
                        </VStack>
                    </Box>

                    <Box p={4} borderRadius="md" borderWidth="1px">
                        <VStack align="start" spacing={3}>
                            <Icon as={MdBrush} boxSize={6} color="purple.400" />
                            <Text fontWeight="bold">
                                Customize the kit with your needs
                            </Text>
                            <Text>
                                The kit is designed to be customizable to your
                                needs. Decide what features you want to use and
                                which ones you don't. Add call to action buttons
                                to your app to guide your users to the features
                                they need.
                            </Text>
                        </VStack>
                    </Box>
                </SimpleGrid>
            </VStack>

            <VStack mt={8} spacing={4} align="stretch">
                <Heading size="sm" textAlign="center">
                    Explore some of the apps built with VeChain Kit
                </Heading>
                <Text textAlign="center" fontSize="xs">
                    (This website is built with VeChain Kit as well!)
                </Text>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                    {[
                        {
                            name: 'EatGreen',
                            href: 'https://eatgreen.aworld.org/',
                            logo: 'https://i.ibb.co/zVx7ncgq/download-2.png',
                        },
                        {
                            name: 'ScoopUp',
                            href: 'https://scoopup.vet/',
                            logo: 'https://scoopup.vet/images/logo.webp',
                        },
                        {
                            name: 'VeLottery',
                            href: 'https://velottery.vet/',
                            logo: 'https://velottery.vet/assets/logo.png',
                        },
                    ].map((app) => (
                        <Box
                            key={app.name}
                            p={3}
                            borderRadius="md"
                            borderWidth="1px"
                            role="group"
                            as={Link}
                            href={app.href}
                            isExternal
                        >
                            <HStack
                                align="start"
                                spacing={2}
                                alignItems={'center'}
                            >
                                <Image
                                    src={app.logo}
                                    alt={app.name}
                                    width={'auto'}
                                    height={10}
                                    borderRadius="md"
                                />
                                <Text fontWeight="bold" fontSize="sm">
                                    {app.name}
                                </Text>
                            </HStack>
                        </Box>
                    ))}
                </SimpleGrid>
            </VStack>
        </Box>
    );
}
