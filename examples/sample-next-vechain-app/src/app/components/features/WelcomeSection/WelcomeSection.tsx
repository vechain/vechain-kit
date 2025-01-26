'use client';

import {
    Container,
    Image,
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

    return (
        <Container alignItems={'center'} justifyContent={'center'}>
            <VStack spacing={10}>
                <Image
                    src={
                        'https://i.ibb.co/ncysMF9/vechain-kit-logo-transparent.png'
                    }
                    maxW={'350px'}
                    maxH={'175px'}
                    alt="logo"
                    animation="bounce 3s infinite"
                    transform="rotate(-10deg)"
                    sx={{
                        '@keyframes bounce': {
                            '0%, 100%': {
                                transform: 'rotate(0deg) translateX(0)',
                            },
                            '50%': {
                                transform: 'rotate(0deg) translateY(5px)',
                            },
                        },
                    }}
                />
                <Text
                    textAlign={'center'}
                    fontSize="xl"
                    fontWeight="bold"
                    className="text-animation"
                    bg="linear-gradient(45deg, #fafae6, #fafae6, #fff)"
                    backgroundClip="text"
                    color="transparent"
                >
                    Hi! I'm VeChain Kit, a new way to access applications on
                    VeChain, and I'm here to show you how to use me.
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
                            animation="bounce-left 1s infinite"
                            transform="rotate(-10deg)"
                            justifyContent="center"
                            alignItems="center"
                            sx={{
                                '@keyframes bounce-left': {
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
