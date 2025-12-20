'use client';

import { HStack, Image, Text, Card } from '@chakra-ui/react';
import { WalletButton } from '@vechain/vechain-kit';
import { LanguageDropdown } from './LanguageDropdown';

const basePath = process.env.basePath ?? '';

export function Header() {
    // const { colorMode } = useColorMode();
    // const [isMobile] = useMediaQuery('(max-width: 768px)');

    return (
        <HStack
            w="full"
            justifyContent="center"
            position="fixed"
            top={0}
            zIndex={1000}
            py={4}
            px={{ base: 4, md: 8 }}
        >
            <Card
                variant="base"
                borderRadius="full"
                px={{ base: 4, md: 6 }}
                py={3}
                maxW="4xl"
                w="full"
                bg={'rgb(255, 255, 255)'}
                boxShadow={'0px 2px 4px 1px rgb(0 0 0 / 10%)'}
            >
                <HStack w="full" justifyContent="space-between" spacing={8}>
                    {/* Logo at start */}
                    <HStack
                        spacing={3}
                        flexShrink={0}
                        cursor="pointer"
                        onClick={() => {
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                    >
                        <Image
                            src={`${basePath}/images/logo.png`}
                            alt="VeChain Kit"
                            height={8}
                            width="auto"
                        />
                        <Text
                            fontSize="lg"
                            fontWeight="bold"
                            color={'gray.900'}
                        >
                            VeKit
                        </Text>
                    </HStack>

                    {/* Navigation links centered */}
                    {/* {!isMobile && (
                        <HStack spacing={2} flex={1} justifyContent="center">
                            <Link
                                href="#features"
                                px={4}
                                py={2}
                                fontSize="sm"
                                fontWeight="medium"
                                color={
                                    colorMode === 'dark'
                                        ? 'gray.200'
                                        : 'gray.700'
                                }
                                borderRadius="md"
                                bg="transparent"
                                _hover={{
                                    bg:
                                        colorMode === 'dark'
                                            ? 'whiteAlpha.100'
                                            : 'gray.100',
                                    color:
                                        colorMode === 'dark'
                                            ? 'white'
                                            : 'gray.900',
                                }}
                                transition="all 0.2s"
                            >
                                Features
                            </Link>
                            <Link
                                href="https://docs.vechainkit.vechain.org/"
                                px={4}
                                py={2}
                                fontSize="sm"
                                fontWeight="medium"
                                color={
                                    colorMode === 'dark'
                                        ? 'gray.200'
                                        : 'gray.700'
                                }
                                borderRadius="md"
                                bg="transparent"
                                _hover={{
                                    bg:
                                        colorMode === 'dark'
                                            ? 'whiteAlpha.100'
                                            : 'gray.100',
                                    color:
                                        colorMode === 'dark'
                                            ? 'white'
                                            : 'gray.900',
                                }}
                                transition="all 0.2s"
                                isExternal
                            >
                                Docs
                            </Link>
                        </HStack>
                    )} */}

                    {/* Language dropdown and WalletButton at end */}
                    <HStack spacing={3} flexShrink={0}>
                        <WalletButton
                            mobileVariant="iconAndDomain"
                            desktopVariant="iconAndDomain"
                            buttonStyle={{
                                bg: 'rgb(243, 243, 243)',
                                rounded: 'full',
                                _hover: {
                                    bg: 'rgba(243, 243, 243, 0.67)',
                                },
                                transition: 'all 0.2s',
                            }}
                        />
                        <LanguageDropdown />
                    </HStack>
                </HStack>
            </Card>
        </HStack>
    );
}
