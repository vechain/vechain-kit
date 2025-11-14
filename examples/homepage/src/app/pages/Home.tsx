'use client';

import { type ReactElement, useRef, useState } from 'react';
import {
    Container,
    VStack,
    Text,
    Link,
    HStack,
    useColorMode,
    IconButton,
    useMediaQuery,
    Flex,
} from '@chakra-ui/react';
import { useWallet, WalletButton } from '@vechain/vechain-kit';
import { UIControls } from '@/app/components/features/UIControls';
import { TransactionExamples } from '@/app/components/features/TransactionExamples';
import { SigningExample } from '@/app/components/features/Signing/SigningExample';
import { Introduction } from '../components/features/Introduction';
import { FAQSection } from '../components/features/FAQSection';
import { IoMdMoon } from 'react-icons/io';
import { FaSun, FaHandPointLeft, FaChevronDown } from 'react-icons/fa';
import { FeaturesToTry } from '@/app/components/features/FeaturesToTry/FeaturesToTry';
import { DataReadingExample } from '../components/features/DataReading';
import { VechainLogo } from '@vechain/vechain-kit/assets';
import { LoginUIControl } from '../components/features/LoginUIControl/LoginUIControl';
import { LoginToContinueBox } from '../components/features/LoginToContinueBox';

export default function Home(): ReactElement {
    const { account } = useWallet();
    const { colorMode, toggleColorMode } = useColorMode();
    const featuresRef = useRef<HTMLDivElement>(null);
    const [hasScrolled, setHasScrolled] = useState(false);
    const [isDesktop] = useMediaQuery('(min-width: 768px)');

    const scrollToFeatures = () => {
        featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
        setHasScrolled(true);
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
                            borderRadius="xl"
                        />
                    </HStack>

                    <Introduction />

                    <LoginUIControl />

                    <FAQSection />

                    <LoginToContinueBox />

                    <Logo />
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
                    <WalletButton
                        mobileVariant="iconDomainAndAssets"
                        desktopVariant="iconDomainAndAssets"
                    />

                    <IconButton
                        onClick={toggleColorMode}
                        icon={colorMode === 'light' ? <IoMdMoon /> : <FaSun />}
                        aria-label="Toggle color mode"
                        borderRadius="xl"
                    />
                </HStack>

                {account && !hasScrolled && !isDesktop && (
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
                                    ? 'blackAlpha.400'
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

                <TransactionExamples />
                <SigningExample />
                <DataReadingExample />
                <FAQSection />
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

                <Logo />
            </VStack>
        </Container>
    );
}

const Logo = () => {
    const { colorMode } = useColorMode();
    return (
        <HStack
            onClick={() => window.open('https://vechain.org', '_blank')}
            pt={10}
            justify={'center'}
            w={'full'}
            cursor={'pointer'}
            _hover={{
                opacity: 0.8,
                transition: 'opacity 0.2s ease-in-out',
            }}
        >
            <Flex
                direction={{ base: 'column', md: 'row' }}
                align="center"
                wrap="wrap"
                justify="center"
                gap={2}
            >
                <Text fontSize="md" fontWeight="bold">
                    Made by
                </Text>
                <VechainLogo
                    maxW="200px"
                    isDark={colorMode === 'dark'}
                    w="200px"
                    h="auto"
                    ml={{ base: 0, sm: -6 }}
                    mt={{ base: -6, md: 0 }}
                />
            </Flex>
        </HStack>
    );
};
