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
    ModalFAQButton,
    StickyHeaderContainer,
    VersionFooter,
} from '@/components/common';
import { ConnectModalContentsTypes } from '../ConnectModal';
import React, { useEffect } from 'react';
import { useFetchAppInfo, useWallet } from '@/hooks';
import { VeChainLoginButton } from '../Components/VeChainLoginButton';
import { SocialLoginButtons } from '../Components/SocialLoginButtons';
import { PasskeyLoginButton } from '../Components/PasskeyLoginButton';
import { DappKitButton } from '../Components/DappKitButton';
import { EcosystemButton } from '../Components/EcosystemButton';
import { PrivyButton } from '../Components/PrivyButton';
import { useTranslation } from 'react-i18next';

type Props = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<ConnectModalContentsTypes>
    >;
    onClose: () => void;
};

export const MainContent = ({ setCurrentContent, onClose }: Props) => {
    const { t } = useTranslation();

    const { colorMode } = useColorMode();
    const isDark = colorMode === 'dark';
    const { connection } = useWallet();
    const { loginModalUI, privySocialLoginEnabled, privyEcosystemAppIDS } =
        useVeChainKitConfig();
    // View more login
    const { login: viewMoreLogin } = usePrivy();

    // Load ecosystem apps info, doing it here to avoid loading when opening the modal
    const { data: appsInfo, isLoading: isEcosystemAppsLoading } =
        useFetchAppInfo(privyEcosystemAppIDS);

    useEffect(() => {
        if (connection.isConnected) {
            onClose();
        }
    }, [connection.isConnected, onClose]);

    return (
        <FadeInViewFromBottom>
            <StickyHeaderContainer>
                <ModalFAQButton onClick={() => setCurrentContent('faq')} />
                <ModalHeader
                    fontSize={'md'}
                    fontWeight={'500'}
                    textAlign={'center'}
                    color={isDark ? '#dfdfdd' : '#4d4d4d'}
                >
                    {t('Log in or sign up')}
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
                                {t(loginModalUI?.description)}
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
                                appsInfo={Object.values(appsInfo || {})}
                                isLoading={isEcosystemAppsLoading}
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
