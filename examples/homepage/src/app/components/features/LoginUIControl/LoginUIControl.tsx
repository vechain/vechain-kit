'use client';

import { VStack, Text, Box, Grid, Button, Icon } from '@chakra-ui/react';
import {
    WalletButton,
    useConnectModal,
    useDAppKitWalletModal,
    useLoginWithOAuth,
} from '@vechain/vechain-kit';
import { LuLogIn } from 'react-icons/lu';
import { CollapsibleCard } from '../../ui/CollapsibleCard';
import { FcGoogle } from 'react-icons/fc';
import { LuGithub } from 'react-icons/lu';

export const LoginUIControl = () => {
    const { open } = useConnectModal();
    const { open: openWalletModal } = useDAppKitWalletModal();
    const { initOAuth } = useLoginWithOAuth();

    return (
        <CollapsibleCard
            title="Login UI Examples"
            icon={LuLogIn}
            defaultIsOpen={true}
            style={{ bg: 'whiteAlpha.100' }}
        >
            <VStack spacing={6} align="stretch" w={'full'}>
                <Text textAlign="center">
                    VeChain Kit provides multiple ways to customize the login
                    button and how we show the login options. Here are some
                    examples of different login button variants.
                </Text>

                <VStack
                    w={'full'}
                    spacing={6}
                    p={6}
                    borderRadius="md"
                    bg="whiteAlpha.50"
                >
                    <Text fontWeight="bold">Login Button Variants</Text>
                    <Grid
                        templateColumns={{
                            base: '1fr',
                            md: 'repeat(2, 1fr)',
                        }}
                        gap={8}
                        w="full"
                        justifyContent="space-between"
                    >
                        {/* First Column Items */}
                        <VStack alignItems="flex-start" spacing={8}>
                            <VStack alignItems="flex-start" spacing={2}>
                                <Box w={'fit-content'}>
                                    <WalletButton connectionVariant="modal" />
                                </Box>
                                <Text
                                    fontSize="sm"
                                    fontWeight="medium"
                                    color="blue.300"
                                    bg="whiteAlpha.100"
                                    px={3}
                                    py={1}
                                    borderRadius="full"
                                >
                                    variant: "modal"
                                </Text>
                            </VStack>

                            <VStack alignItems="flex-start" spacing={2}>
                                <Box w={'fit-content'}>
                                    <WalletButton
                                        connectionVariant="modal"
                                        buttonStyle={{
                                            border: '2px solid #000000',
                                            boxShadow:
                                                '-2px 2px 3px 1px #00000038',
                                            background: '#f08098',
                                            color: 'white',
                                            _hover: {
                                                background: '#db607a',
                                                border: '1px solid #000000',
                                                boxShadow:
                                                    '-3px 2px 3px 1px #00000038',
                                            },
                                            transition: 'all 0.2s ease',
                                        }}
                                    />
                                </Box>
                                <Text
                                    fontSize="sm"
                                    fontWeight="medium"
                                    color="blue.300"
                                    bg="whiteAlpha.100"
                                    px={3}
                                    py={1}
                                    borderRadius="full"
                                >
                                    variant: "modal" (with custom styling)
                                </Text>
                            </VStack>
                        </VStack>

                        {/* Second Column Items */}
                        <VStack alignItems="flex-start" spacing={8}>
                            <VStack alignItems="flex-start" spacing={2}>
                                <Box w={'fit-content'}>
                                    <WalletButton connectionVariant="popover" />
                                </Box>
                                <Text
                                    fontSize="sm"
                                    fontWeight="medium"
                                    color="blue.300"
                                    bg="whiteAlpha.100"
                                    px={3}
                                    py={1}
                                    borderRadius="full"
                                >
                                    variant: "popover" (desktop only)
                                </Text>
                            </VStack>

                            <VStack alignItems="flex-start" spacing={2}>
                                <Box w={'fit-content'}>
                                    <Button onClick={open}>
                                        Click me to login
                                    </Button>
                                </Box>
                                <Text
                                    fontSize="sm"
                                    fontWeight="medium"
                                    color="blue.300"
                                    bg="whiteAlpha.100"
                                    px={3}
                                    py={1}
                                    borderRadius="full"
                                >
                                    custom button (with onClick)
                                </Text>
                            </VStack>

                            <VStack alignItems="flex-start" spacing={2}>
                                <Box w={'fit-content'}>
                                    <Button onClick={openWalletModal}>
                                        Open only "Connect Wallet"
                                    </Button>
                                </Box>
                                <Text
                                    fontSize="sm"
                                    fontWeight="medium"
                                    color="blue.300"
                                    bg="whiteAlpha.100"
                                    px={3}
                                    py={1}
                                    borderRadius="full"
                                >
                                    aka: dapp-kit connect modal
                                </Text>
                            </VStack>
                        </VStack>
                    </Grid>

                    <Text fontSize="sm" fontWeight="medium" color="blue.300">
                        Note: The modal variant is the default login button
                        variant. You can pass an additional description and
                        Image to the modal when configuring you the
                        VeChainKitProvider.
                    </Text>
                </VStack>

                <VStack
                    w={'full'}
                    spacing={6}
                    p={6}
                    borderRadius="md"
                    bg="whiteAlpha.50"
                >
                    <Text fontWeight="bold">OAuth Login Examples</Text>
                    <Grid
                        templateColumns={{
                            base: '1fr',
                            md: 'repeat(2, 1fr)',
                        }}
                        gap={8}
                        w="full"
                        justifyContent="space-between"
                    >
                        {/* Google OAuth Button */}
                        <VStack alignItems="flex-start" spacing={2}>
                            <Box w={'fit-content'}>
                                <Button
                                    onClick={() =>
                                        initOAuth({ provider: 'google' })
                                    }
                                    leftIcon={
                                        <Icon as={FcGoogle} boxSize="20px" />
                                    }
                                    colorScheme="gray"
                                    variant="outline"
                                    size="md"
                                    _hover={{
                                        bg: 'whiteAlpha.200',
                                        borderColor: 'gray.400',
                                    }}
                                >
                                    Login with Google
                                </Button>
                            </Box>
                            <Text
                                fontSize="sm"
                                fontWeight="medium"
                                color="blue.300"
                                bg="whiteAlpha.100"
                                px={3}
                                py={1}
                                borderRadius="full"
                            >
                                OAuth: Google
                            </Text>
                        </VStack>

                        {/* GitHub OAuth Button */}
                        <VStack alignItems="flex-start" spacing={2}>
                            <Box w={'fit-content'}>
                                <Button
                                    onClick={() =>
                                        initOAuth({ provider: 'github' })
                                    }
                                    leftIcon={
                                        <Icon as={LuGithub} boxSize="20px" />
                                    }
                                    colorScheme="gray"
                                    variant="outline"
                                    size="md"
                                    _hover={{
                                        bg: 'whiteAlpha.200',
                                        borderColor: 'gray.400',
                                    }}
                                >
                                    Login with GitHub
                                </Button>
                            </Box>
                            <Text
                                fontSize="sm"
                                fontWeight="medium"
                                color="blue.300"
                                bg="whiteAlpha.100"
                                px={3}
                                py={1}
                                borderRadius="full"
                            >
                                OAuth: GitHub
                            </Text>
                        </VStack>
                    </Grid>

                    <Text fontSize="sm" fontWeight="medium" color="blue.300">
                        Note: These buttons use the useLoginWithOAuth hook to
                        initiate OAuth authentication flows with social
                        providers. Make sure the providers are configured in
                        your Privy dashboard.
                    </Text>
                </VStack>
            </VStack>
        </CollapsibleCard>
    );
};
