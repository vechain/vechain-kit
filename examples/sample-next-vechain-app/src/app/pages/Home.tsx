'use client';

import { type ReactElement } from 'react';
import {
    Container,
    Spinner,
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
import { WelcomeSection } from '../components/features/WelcomeSection';
import { Introduction } from '../components/features/Introduction';
import { IoMdMoon } from 'react-icons/io';
import { FaSun, FaHandPointLeft } from 'react-icons/fa';

export default function Home(): ReactElement {
    const { account, connection } = useWallet();
    const { colorMode, toggleColorMode } = useColorMode();

    if (!account) {
        return <WelcomeSection />;
    }

    if (connection.isLoading) {
        return (
            <VStack w="full" h="full" justify="center" align="center">
                <Spinner />
            </VStack>
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
                                        ? '#4A5568'
                                        : '#A0AEC0'
                                }
                                style={{ marginLeft: '8px' }}
                            />
                            <Text
                                fontSize="sm"
                                color={
                                    colorMode === 'light'
                                        ? 'gray.600'
                                        : 'gray.400'
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

                <Introduction />

                <UIControls />

                {/* <LanguageSelector /> */}
                <TransactionExamples />
                <SigningExample />
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
