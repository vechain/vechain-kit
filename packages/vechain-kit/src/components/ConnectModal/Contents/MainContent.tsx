import {
    Grid,
    HStack,
    Image,
    ModalBody,
    ModalCloseButton,
    ModalFooter,
    ModalHeader,
    Stack,
    Text,
    useColorMode,
} from '@chakra-ui/react';
import { usePrivy } from '@privy-io/react-auth';
import { useVeChainKitConfig } from '@/providers';
import {
    FadeInViewFromBottom,
    StickyHeaderContainer,
    VersionFooter,
} from '@/components/common';
import { ConnectModalContents } from '../ConnectModal';
import React, { useEffect } from 'react';
import { useWallet } from '@/hooks';
import { VeChainLoginButton } from '../Components/VeChainLoginButton';
import { SocialLoginButtons } from '../Components/SocialLoginButtons';
import { PasskeyLoginButton } from '../Components/PasskeyLoginButton';
import { DappKitButton } from '../Components/DappKitButton';
import { EcosystemButton } from '../Components/EcosystemButton';
import { PrivyButton } from '../Components/PrivyButton';

type Props = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<ConnectModalContents>
    >;
    onClose: () => void;
};

export const MainContent = ({ onClose }: Props) => {
    const { colorMode } = useColorMode();
    const isDark = colorMode === 'dark';
    const { connection } = useWallet();
    const { loginModalUI, privySocialLoginEnabled } = useVeChainKitConfig();
    // View more login
    const { login: viewMoreLogin } = usePrivy();

    useEffect(() => {
        if (connection.isConnected) {
            onClose();
        }
    }, [connection.isConnected, onClose]);

    return (
        <FadeInViewFromBottom>
            <StickyHeaderContainer>
                <ModalHeader
                    fontSize={'md'}
                    fontWeight={'500'}
                    textAlign={'center'}
                    color={isDark ? '#dfdfdd' : '#4d4d4d'}
                >
                    {'Log in or sign up'}
                </ModalHeader>
                <ModalCloseButton mt={'5px'} />
            </StickyHeaderContainer>

            {loginModalUI?.logo && (
                <FadeInViewFromBottom>
                    <HStack justify={'center'}>
                        <Image
                            src={loginModalUI.logo || '/images/favicon.png'}
                            maxW={'180px'}
                            maxH={'90px'}
                            m={10}
                            alt="logo"
                        />
                    </HStack>
                </FadeInViewFromBottom>
            )}

            <FadeInViewFromBottom>
                <ModalBody>
                    {loginModalUI?.description && (
                        <HStack
                            spacing={4}
                            w={'full'}
                            justify={'center'}
                            mb={'24px'}
                        >
                            <Text
                                color={isDark ? '#dfdfdd' : '#4d4d4d'}
                                fontSize={'xs'}
                                fontWeight={'200'}
                                textAlign={'center'}
                            >
                                {loginModalUI?.description}
                            </Text>
                        </HStack>
                    )}

                    <Stack spacing={4} w={'full'} align={'center'}>
                        <Grid
                            templateColumns="repeat(4, 1fr)"
                            gap={2}
                            w={'full'}
                        >
                            {privySocialLoginEnabled && (
                                <SocialLoginButtons
                                    isDark={isDark}
                                    loginModalUI={loginModalUI}
                                />
                            )}

                            <VeChainLoginButton isDark={isDark} />

                            {privySocialLoginEnabled && (
                                <PasskeyLoginButton isDark={isDark} />
                            )}

                            <DappKitButton
                                isDark={isDark}
                                privySocialLoginEnabled={
                                    privySocialLoginEnabled
                                }
                            />

                            <EcosystemButton
                                isDark={isDark}
                                privySocialLoginEnabled={
                                    privySocialLoginEnabled
                                }
                            />

                            {privySocialLoginEnabled && (
                                <PrivyButton
                                    isDark={isDark}
                                    onViewMoreLogin={viewMoreLogin}
                                />
                            )}
                        </Grid>
                    </Stack>
                </ModalBody>

                <ModalFooter>
                    <VersionFooter />
                </ModalFooter>
            </FadeInViewFromBottom>
        </FadeInViewFromBottom>
    );
};
