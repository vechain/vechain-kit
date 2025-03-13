'use client';

import {
    Container,
    Spinner,
    Text,
    useColorMode,
    VStack,
} from '@chakra-ui/react';
import { useWallet, WalletButton } from '@vechain/vechain-kit';
import { FaHandPointUp } from 'react-icons/fa';

export function WelcomeSection() {
    const { connection } = useWallet();
    const { colorMode } = useColorMode();
    const isDarkMode = colorMode === 'dark';

    return (
        <Container alignItems={'center'} justifyContent={'center'}>
            <VStack spacing={10}>
                <Text
                    textAlign={'center'}
                    fontSize="xl"
                    fontWeight="bold"
                    className="text-animation"
                    bg={
                        isDarkMode
                            ? 'linear-gradient(45deg, #fafae6, #fafae6, #fff)'
                            : 'linear-gradient(45deg, #2B6CB0, #3182CE, #4299E1)'
                    }
                    backgroundClip="text"
                    color="transparent"
                >
                    Hi! I'm VeChain Kit, a new way to access applications on
                    VeChain, and I'm here to show you my capabilities.
                </Text>
                {connection.isLoading ? (
                    <Spinner />
                ) : (
                    <VStack>
                        <WalletButton
                            mobileVariant="iconDomainAndAssets"
                            desktopVariant="iconDomainAndAssets"
                        />

                        <VStack
                            mt={4}
                            spacing={3}
                            animation="bounce-top 1s infinite"
                            transform="rotate(-10deg)"
                            justifyContent="center"
                            alignItems="center"
                            sx={{
                                '@keyframes bounce-top': {
                                    '0%, 100%': {
                                        transform: 'rotate(0deg) translateY(0)',
                                    },
                                    '50%': {
                                        transform:
                                            'rotate(0deg) translateY(-5px)',
                                    },
                                },
                            }}
                        >
                            <FaHandPointUp
                                size={24}
                                color={
                                    colorMode === 'light'
                                        ? '#4A5568'
                                        : '#A0AEC0'
                                }
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
                        </VStack>
                    </VStack>
                )}
            </VStack>
        </Container>
    );
}
