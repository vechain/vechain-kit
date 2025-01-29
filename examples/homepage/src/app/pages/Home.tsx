'use client';

import { type ReactElement, useRef } from 'react';
import {
    Container,
    VStack,
    Text,
    Link,
    HStack,
    useColorMode,
    IconButton,
} from '@chakra-ui/react';
import { useWallet, WalletButton } from '@vechain/vechain-kit';
import { UIControls } from '@/app/components/features/UIControls';
import { TransactionExamples } from '@/app/components/features/TransactionExamples';
import { SigningExample } from '@/app/components/features/Signing/SigningExample';
import { Introduction } from '../components/features/Introduction';
import { IoMdMoon } from 'react-icons/io';
import { FaSun, FaHandPointLeft, FaChevronDown } from 'react-icons/fa';
import { FeaturesToTry } from '@/app/components/features/FeaturesToTry/FeaturesToTry';
import { DataReadingExample } from '../components/features/DataReading';

export default function Home(): ReactElement {
    const { account } = useWallet();
    const { colorMode, toggleColorMode } = useColorMode();
    const featuresRef = useRef<HTMLDivElement>(null);

    const scrollToFeatures = () => {
        featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    if (!account) {
        return (
            <Container
                height={'full'}
                maxW="container.lg"
                justifyContent={'center'}
                wordBreak={'break-word'}
            >
                <VStack spacing={10} mt={10} pb={10} alignItems="flex-start">
                    <HStack w={'full'} justifyContent={'space-between'}>
                        <HStack spacing={2} align="center">
                            <WalletButton
                                mobileVariant="iconDomainAndAssets"
                                desktopVariant="iconDomainAndAssets"
                            />
                            <HStack
                                spacing={2}
                                animation="bounce-left 1s infinite"
                                transform="rotate(-10deg)"
                                sx={{
                                    '@keyframes bounce-left': {
                                        '0%, 100%': {
                                            transform:
                                                'rotate(0deg) translateX(0)',
                                        },
                                        '50%': {
                                            transform:
                                                'rotate(0deg) translateX(-5px)',
                                        },
                                    },
                                }}
                            >
                                <FaHandPointLeft
                                    size={24}
                                    color={
                                        colorMode === 'light'
                                            ? 'blackAlpha.600'
                                            : 'whiteAlpha.400'
                                    }
                                    style={{ marginLeft: '8px' }}
                                />
                                <Text
                                    fontSize="sm"
                                    color={
                                        colorMode === 'light'
                                            ? 'blackAlpha.600'
                                            : 'whiteAlpha.400'
                                    }
                                >
                                    Click me!
                                </Text>
                            </HStack>
                        </HStack>
                        <IconButton
                            onClick={toggleColorMode}
                            icon={
                                colorMode === 'light' ? <IoMdMoon /> : <FaSun />
                            }
                            aria-label="Toggle color mode"
                        />
                    </HStack>

                    <Introduction />
                </VStack>
            </Container>
        );
    }

    return (
        <Container
            height={'full'}
            maxW="container.lg"
            justifyContent={'center'}
            wordBreak={'break-word'}
        >
            <VStack spacing={10} mt={10} pb={10} alignItems="flex-start">
                <HStack w={'full'} justifyContent={'space-between'}>
                    <HStack spacing={2} align="center">
                        <WalletButton
                            mobileVariant="iconDomainAndAssets"
                            desktopVariant="iconDomainAndAssets"
                        />
                        <HStack
                            spacing={2}
                            animation="bounce-left 1s infinite"
                            transform="rotate(-10deg)"
                            sx={{
                                '@keyframes bounce-left': {
                                    '0%, 100%': {
                                        transform: 'rotate(0deg) translateX(0)',
                                    },
                                    '50%': {
                                        transform:
                                            'rotate(0deg) translateX(-5px)',
                                    },
                                },
                            }}
                        >
                            <FaHandPointLeft
                                size={24}
                                color={
                                    colorMode === 'light'
                                        ? 'blackAlpha.600'
                                        : 'whiteAlpha.400'
                                }
                                style={{ marginLeft: '8px' }}
                            />
                            <Text
                                fontSize="sm"
                                color={
                                    colorMode === 'light'
                                        ? 'blackAlpha.600'
                                        : 'whiteAlpha.400'
                                }
                            >
                                Click me!
                            </Text>
                        </HStack>
                    </HStack>
                    <IconButton
                        onClick={toggleColorMode}
                        icon={colorMode === 'light' ? <IoMdMoon /> : <FaSun />}
                        aria-label="Toggle color mode"
                    />
                </HStack>

                {account && (
                    <VStack
                        w="full"
                        cursor="pointer"
                        onClick={scrollToFeatures}
                        spacing={2}
                        p={4}
                        bg="whiteAlpha.100"
                        rounded="md"
                    >
                        <Text fontSize="sm" textAlign="center">
                            Scroll down to explore available features
                        </Text>
                        <FaChevronDown
                            size={20}
                            color={
                                colorMode === 'light'
                                    ? 'gray.500'
                                    : 'whiteAlpha.600'
                            }
                        />
                    </VStack>
                )}

                <Introduction />

                <div ref={featuresRef}>
                    <FeaturesToTry />
                </div>

                <UIControls />

                {/* <LanguageSelector /> */}
                <TransactionExamples />
                <SigningExample />
                <DataReadingExample />
                <Text
                    fontSize="sm"
                    color="gray.600"
                    w="full"
                    textAlign="center"
                    mt={4}
                >
                    Found a bug? Please open an issue on{' '}
                    <Link
                        href="https://github.com/vechain/vechain-kit/issues"
                        color="blue.500"
                        isExternal
                    >
                        GitHub
                    </Link>
                </Text>
            </VStack>
        </Container>
    );
}
