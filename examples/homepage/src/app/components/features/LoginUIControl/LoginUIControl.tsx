'use client';

import { VStack, Text, Box, Grid, Button } from '@chakra-ui/react';
import {
    WalletButton,
    useConnectModal,
    useDAppKitWalletModal,
} from '@vechain/vechain-kit';
import { MdLogin } from 'react-icons/md';
import { CollapsibleCard } from '../../ui/CollapsibleCard';

export const LoginUIControl = () => {
    const { open } = useConnectModal();
    const { open: openWalletModal } = useDAppKitWalletModal();

    return (
        <CollapsibleCard
            title="Login UI Examples"
            icon={MdLogin}
            defaultIsOpen={true}
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
            </VStack>
        </CollapsibleCard>
    );
};
