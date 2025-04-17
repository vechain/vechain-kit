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
import { FaGithub, FaDiscord, FaApple } from 'react-icons/fa';
import { IoDocumentText, IoWalletOutline } from 'react-icons/io5';
import { MdBrush, MdCode, MdEmail } from 'react-icons/md';
import { CiLogin } from 'react-icons/ci';
import { SiNpm, SiFarcaster } from 'react-icons/si';
import { FcGoogle } from 'react-icons/fc';
import { FaSquareXTwitter } from 'react-icons/fa6';
import { trackEvent } from '@/app/lib/mixpanelClient';

export function Introduction() {
    const { connection } = useWallet();

    const trackExternalLink = (destination: string) => {
        trackEvent('External Link Click', {
            destination,
            isConnected: connection.isConnected,
            source: 'Introduction',
        });
    };

    const basePath = process.env.basePath ?? '';
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
                                onClick={() =>
                                    trackExternalLink('documentation')
                                }
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
                                onClick={() => trackExternalLink('npm')}
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
                                onClick={() => trackExternalLink('github')}
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
                                onClick={() =>
                                    trackExternalLink('smart-accounts')
                                }
                            >
                                Learn about Smart Accounts
                            </Button>
                        </SimpleGrid>
                    </VStack>
                </Box>
            </VStack>

            {!connection.isConnected && (
                <>
                    <VStack mt={14} spacing={6} align="stretch">
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                            <Box p={4} borderRadius="md" borderWidth="1px">
                                <VStack align="start" spacing={3}>
                                    <Icon
                                        as={CiLogin}
                                        boxSize={6}
                                        color="blue.400"
                                    />
                                    <Text fontWeight="bold">
                                        Wallet Connection Integration
                                    </Text>
                                    <Text>
                                        Easily connect your users to your dApp
                                        with out of the box wallet connection
                                        options. Choose between:
                                    </Text>
                                    <HStack spacing={3} wrap="wrap">
                                        <Icon as={FcGoogle} boxSize={6} />
                                        <Icon
                                            as={FaSquareXTwitter}
                                            boxSize={6}
                                        />
                                        <Icon as={MdEmail} boxSize={6} />
                                        <Icon as={FaDiscord} boxSize={6} />
                                        <Icon as={SiFarcaster} boxSize={6} />
                                        <Icon as={FaApple} boxSize={6} />
                                        <Image
                                            src={`${basePath}/images/veworld-logo.png`}
                                            alt="VeWorld"
                                            height={6}
                                            width="auto"
                                            borderRadius="md"
                                        />
                                        <Image
                                            src={`${basePath}/images/wallet-connect-logo.png`}
                                            alt="WalletConnect"
                                            height={6}
                                            width="auto"
                                            borderRadius="md"
                                        />
                                        <Image
                                            src={`${basePath}/images/rabby-logo.png`}
                                            alt="Rabby Wallet"
                                            height={6}
                                            width="auto"
                                            borderRadius="md"
                                        />
                                        <Image
                                            src={`${basePath}/images/metamask-logo.png`}
                                            alt="MetaMask"
                                            height={6}
                                            width="auto"
                                            borderRadius="md"
                                        />
                                        <Image
                                            src={`${basePath}/images/coinbase-wallet-logo.webp`}
                                            alt="Coinbase Wallet"
                                            height={6}
                                            width="auto"
                                            borderRadius="md"
                                        />
                                        <Image
                                            src={`${basePath}/images/rainbow-logo.webp`}
                                            alt="Rainbow"
                                            height={6}
                                            width="auto"
                                            borderRadius="md"
                                        />
                                        <Text fontSize="sm" color="gray.400">
                                            and more...
                                        </Text>
                                    </HStack>
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
                                        Assets, Profile, and Wallet Management
                                    </Text>
                                    <Text>
                                        Use VeChain Kit to allow your users to
                                        have asset management, profile
                                        management, social login, wallet backup,
                                        mfa, and more. All out of the box, so
                                        you can focus on building your dApp.
                                    </Text>
                                </VStack>
                            </Box>

                            <Box p={4} borderRadius="md" borderWidth="1px">
                                <VStack align="start" spacing={3}>
                                    <Icon
                                        as={MdCode}
                                        boxSize={6}
                                        color="green.400"
                                    />
                                    <Text fontWeight="bold">
                                        Boosted development
                                    </Text>
                                    <Text>
                                        Use our hooks and components to speed up
                                        your development. No need to worry about
                                        the underlying VeChain infrastructure,
                                        we handle it for you.
                                    </Text>
                                </VStack>
                            </Box>

                            <Box p={4} borderRadius="md" borderWidth="1px">
                                <VStack align="start" spacing={3}>
                                    <Icon
                                        as={MdBrush}
                                        boxSize={6}
                                        color="purple.400"
                                    />
                                    <Text fontWeight="bold">
                                        Style customization
                                    </Text>
                                    <Text>
                                        The kit is designed to be customizable
                                        to your needs. Decide what features you
                                        want to use and which ones you don't.
                                        Add call to action buttons to your app
                                        to guide your users to the features they
                                        need.
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
                                    onClick={() =>
                                        trackExternalLink(
                                            `example-app-${app.name.toLowerCase()}`,
                                        )
                                    }
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
                </>
            )}
        </Box>
    );
}
