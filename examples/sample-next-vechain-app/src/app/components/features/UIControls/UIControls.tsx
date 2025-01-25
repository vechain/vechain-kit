'use client';

import { VStack, Text, Button, Box, HStack } from '@chakra-ui/react';
import { WalletButton, useAccountModal } from '@vechain/vechain-kit';
import { MdBrush } from 'react-icons/md';
import { CollapsibleCard } from '../../ui/CollapsibleCard';
// import { useConnectModal } from '@vechain/vechain-kit';

export function UIControls() {
    const { open } = useAccountModal();
    // const { open: openConnectModal } = useConnectModal();
    return (
        <CollapsibleCard
            title="UI Customization Examples"
            icon={MdBrush}
            defaultIsOpen={true}
        >
            <VStack spacing={6} align="stretch" w={'full'}>
                <Text textAlign="center">
                    VeChain Kit provides multiple ways to customize the UI
                    components. Here are some examples of different button
                    styles and variants.
                </Text>

                <HStack w={'full'} justifyContent={'space-between'}>
                    {/* <VStack
                        w={'full'}
                        spacing={4}
                        p={6}
                        borderRadius="md"
                        bg="whiteAlpha.50"
                    >
                        <Text fontWeight="bold">Login Modal UI</Text>
                        <Text fontSize="sm" textAlign="center" color="gray.400">
                            Login Modal UI is customizable. You can customize
                            the login modal UI by slecting different variants.
                        </Text>
                        <Button onClick={openConnectModal}>
                            Variant "full"
                        </Button>
                    </VStack> */}

                    {/* Mobile Variants */}
                    <HStack w={'full'} justifyContent={'center'}>
                        <VStack
                            w={'fit-content'}
                            spacing={4}
                            p={6}
                            borderRadius="md"
                            bg="whiteAlpha.50"
                        >
                            <Text fontWeight="bold">
                                Account Button Variants
                            </Text>
                            <VStack spacing={4} align="stretch">
                                <Box w={'fit-content'}>
                                    <WalletButton
                                        mobileVariant="icon"
                                        desktopVariant="icon"
                                    />
                                </Box>
                                <Box w={'fit-content'}>
                                    <WalletButton
                                        mobileVariant="iconAndDomain"
                                        desktopVariant="iconAndDomain"
                                    />
                                </Box>
                                <Box w={'fit-content'}>
                                    <WalletButton
                                        mobileVariant="iconDomainAndAddress"
                                        desktopVariant="iconDomainAndAddress"
                                    />
                                </Box>
                                <Box w={'fit-content'}>
                                    <WalletButton
                                        mobileVariant="iconDomainAndAssets"
                                        desktopVariant="iconDomainAndAssets"
                                    />
                                </Box>

                                <Box w={'fit-content'}>
                                    <WalletButton
                                        mobileVariant="iconDomainAndAssets"
                                        desktopVariant="iconDomainAndAssets"
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
                                            // transition: 'all 0.3s ease',
                                        }}
                                    />
                                </Box>
                                <Button onClick={open}>
                                    <Text>This is a custom button</Text>
                                </Button>
                            </VStack>
                            <Text
                                fontSize="sm"
                                textAlign="center"
                                color="gray.400"
                            >
                                Note: Some variants might look different based
                                on connection state and available data.
                            </Text>
                        </VStack>
                    </HStack>
                </HStack>
            </VStack>
        </CollapsibleCard>
    );
}
