'use client';

import {
    VStack,
    Text,
    Button,
    Box,
    HStack,
    Grid,
    useColorMode,
} from '@chakra-ui/react';
import {
    WalletButton,
    useAccountModal,
    ProfileCard,
    useWallet,
} from '@vechain/vechain-kit';
import { MdBrush } from 'react-icons/md';
import { CollapsibleCard } from '../../ui/CollapsibleCard';

export function UIControls() {
    const { open } = useAccountModal();
    const { account } = useWallet();
    const { colorMode } = useColorMode();

    return (
        <CollapsibleCard
            title="UI Customization Examples"
            icon={MdBrush}
            defaultIsOpen={false}
        >
            <VStack spacing={6} align="stretch" w={'full'}>
                <Text textAlign="center">
                    VeChain Kit provides multiple ways to customize the UI
                    components. Here are some examples of different button
                    styles and variants.
                </Text>

                <HStack w={'full'} justifyContent={'space-between'}>
                    {/* Mobile Variants */}
                    <HStack w={'full'} justifyContent={'center'}>
                        <VStack
                            w={'fit-content'}
                            spacing={6}
                            p={6}
                            borderRadius="md"
                            bg="whiteAlpha.50"
                        >
                            <Text fontWeight="bold">
                                Account Button Variants
                            </Text>
                            <Text
                                fontSize="sm"
                                textAlign="center"
                                color="gray.400"
                            >
                                Note: Some variants might look different based
                                on connection state and available data. Eg:
                                "iconDomainAndAssets" will show the assets only
                                if the user has assets. And same for domain
                                name.
                            </Text>
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
                                            <WalletButton
                                                mobileVariant="icon"
                                                desktopVariant="icon"
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
                                            variant: "icon"
                                        </Text>
                                    </VStack>

                                    <VStack alignItems="flex-start" spacing={2}>
                                        <Box w={'fit-content'}>
                                            <WalletButton
                                                mobileVariant="iconAndDomain"
                                                desktopVariant="iconAndDomain"
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
                                            variant: "iconAndDomain"
                                        </Text>
                                    </VStack>

                                    <VStack alignItems="flex-start" spacing={2}>
                                        <Box w={'fit-content'}>
                                            <WalletButton
                                                mobileVariant="iconDomainAndAddress"
                                                desktopVariant="iconDomainAndAddress"
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
                                            variant: "iconDomainAndAddress"
                                        </Text>
                                    </VStack>
                                </VStack>

                                {/* Second Column Items */}
                                <VStack alignItems={'flex-start'} spacing={8}>
                                    <VStack alignItems="flex-start" spacing={2}>
                                        <Box w={'fit-content'}>
                                            <WalletButton
                                                mobileVariant="iconDomainAndAssets"
                                                desktopVariant="iconDomainAndAssets"
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
                                            variant: "iconDomainAndAssets"
                                        </Text>
                                    </VStack>

                                    <VStack alignItems="flex-start" spacing={2}>
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
                                            variant: "iconDomainAndAssets"
                                            (styled)
                                        </Text>
                                    </VStack>

                                    <VStack alignItems="flex-start" spacing={2}>
                                        <Button onClick={open}>
                                            <Text>This is a custom button</Text>
                                        </Button>
                                        <Text
                                            fontSize="sm"
                                            fontWeight="medium"
                                            color="blue.300"
                                            bg="whiteAlpha.100"
                                            px={3}
                                            py={1}
                                            borderRadius="full"
                                        >
                                            no variant, custom button
                                        </Text>
                                    </VStack>
                                </VStack>
                            </Grid>
                        </VStack>
                    </HStack>
                </HStack>
                <VStack
                    w={'full'}
                    justifyContent={'center'}
                    spacing={6}
                    p={6}
                    borderRadius="md"
                    bg="whiteAlpha.50"
                >
                    <Text fontWeight="bold">Profile Cards</Text>
                    <Text fontSize="sm" textAlign="center" color="gray.400">
                        Import the profile card component and use it in your
                        app. You can pass in an address and it will display all
                        the information set by the user. You can decide to hide
                        specific sections. (Customize your profile to see how
                        this card changes)
                    </Text>
                    <Grid
                        templateColumns={['repeat(1, 1fr)', 'repeat(2, 1fr)']}
                        gap={4}
                        w="full"
                    >
                        <ProfileCard
                            address={account?.address ?? ''}
                            showEdit={false}
                            style={{
                                card: {
                                    backgroundColor:
                                        colorMode === 'dark'
                                            ? '#1c1c1b'
                                            : '#f5f5f5',
                                },
                            }}
                        />

                        <ProfileCard
                            address={
                                '0x73D1d7e67B9696Be68F53fb80C7e6e50b314a62f'
                            }
                            showEdit={false}
                            showHeader={false}
                        />
                    </Grid>
                </VStack>
            </VStack>
        </CollapsibleCard>
    );
}
