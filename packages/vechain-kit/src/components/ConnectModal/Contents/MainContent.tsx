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
} from '@chakra-ui/react';
import { usePrivy } from '@privy-io/react-auth';
import { useVeChainKitConfig } from '@/providers';
import {
    ModalFAQButton,
    StickyHeaderContainer,
    VersionFooter,
} from '@/components/common';
import { ConnectModalContentsTypes } from '../ConnectModal';
import React, { useEffect } from 'react';
import { useFetchAppInfo, useWallet } from '@/hooks';
import { VeChainLoginButton } from '../Components/VeChainLoginButton';
import { PasskeyLoginButton } from '../Components/PasskeyLoginButton';
import { DappKitButton } from '../Components/DappKitButton';
import { EcosystemButton } from '../Components/EcosystemButton';
import { PrivyButton } from '../Components/PrivyButton';
import { useTranslation } from 'react-i18next';
import {
    EmailLoginButton,
    LoginWithGoogleButton,
    VeChainWithPrivyLoginButton,
} from '../Components';
import { useLoginModalContent } from '@/hooks';

type Props = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<ConnectModalContentsTypes>
    >;
    onClose: () => void;
};

export const MainContent = ({ setCurrentContent, onClose }: Props) => {
    const { t } = useTranslation();

    const { darkMode: isDark } = useVeChainKitConfig();
    const { connection } = useWallet();
    const { loginModalUI, privyEcosystemAppIDS, loginMethods } =
        useVeChainKitConfig();
    // View more login
    const { login: viewMoreLogin } = usePrivy();

    const {
        showGoogleLogin,
        showEmailLogin,
        showPasskey,
        showVeChainLogin,
        showDappKit,
        showEcosystem,
        showMoreLogin,
        isOfficialVeChainApp,
    } = useLoginModalContent();

    // Load ecosystem apps info, doing it here to avoid loading when opening the modal
    const { data: appsInfo, isLoading: isEcosystemAppsLoading } =
        useFetchAppInfo(privyEcosystemAppIDS);

    useEffect(() => {
        if (connection.isConnected) {
            onClose();
        }
    }, [connection.isConnected, onClose]);

    return (
        <>
            <StickyHeaderContainer>
                <ModalFAQButton onClick={() => setCurrentContent('faq')} />
                <ModalHeader
                    fontSize={'md'}
                    fontWeight={'00'}
                    textAlign={'center'}
                    color={isDark ? '#dfdfdd' : '#4d4d4d'}
                >
                    {t('Log in or sign up')}
                </ModalHeader>
                <ModalCloseButton />
            </StickyHeaderContainer>

            {loginModalUI?.logo && (
                <HStack justify={'center'}>
                    <Image
                        src={loginModalUI.logo || '/images/favicon.png'}
                        maxW={'180px'}
                        maxH={'90px'}
                        m={8}
                        alt="logo"
                    />
                </HStack>
            )}

            <ModalBody>
                {loginModalUI?.description && (
                    <HStack
                        spacing={4}
                        w={'full'}
                        justify={'center'}
                        mb={'24px'}
                        px={4}
                    >
                        <Text
                            color={isDark ? '#dfdfdd' : '#4d4d4d'}
                            fontSize={'sm'}
                            textAlign={'center'}
                        >
                            {loginModalUI?.description}
                        </Text>
                    </HStack>
                )}

                <Stack spacing={4} w={'full'} align={'center'}>
                    <Grid templateColumns="repeat(4, 1fr)" gap={2} w={'full'}>
                        {loginMethods?.map(({ method, gridColumn }) => {
                            switch (method) {
                                case 'email':
                                    return (
                                        showEmailLogin && <EmailLoginButton />
                                    );
                                case 'google':
                                    return (
                                        showGoogleLogin && (
                                            <LoginWithGoogleButton
                                                isDark={isDark}
                                                gridColumn={gridColumn}
                                            />
                                        )
                                    );
                                case 'vechain':
                                    return (
                                        showVeChainLogin &&
                                        (isOfficialVeChainApp ? (
                                            <VeChainWithPrivyLoginButton
                                                key="vechain"
                                                isDark={isDark}
                                                gridColumn={gridColumn}
                                            />
                                        ) : (
                                            <VeChainLoginButton
                                                key="vechain"
                                                isDark={isDark}
                                                gridColumn={gridColumn}
                                            />
                                        ))
                                    );
                                case 'passkey':
                                    return (
                                        showPasskey && (
                                            <PasskeyLoginButton
                                                key="passkey"
                                                isDark={isDark}
                                                gridColumn={gridColumn}
                                            />
                                        )
                                    );
                                case 'dappkit':
                                    return (
                                        showDappKit && (
                                            <DappKitButton
                                                key="dappkit"
                                                isDark={isDark}
                                                gridColumn={gridColumn}
                                            />
                                        )
                                    );
                                case 'ecosystem':
                                    return (
                                        showEcosystem && (
                                            <EcosystemButton
                                                key="ecosystem"
                                                isDark={isDark}
                                                appsInfo={Object.values(
                                                    appsInfo || {},
                                                )}
                                                isLoading={
                                                    isEcosystemAppsLoading
                                                }
                                                gridColumn={gridColumn}
                                            />
                                        )
                                    );
                                case 'more':
                                    return (
                                        showMoreLogin && (
                                            <PrivyButton
                                                key="more"
                                                isDark={isDark}
                                                onViewMoreLogin={viewMoreLogin}
                                                gridColumn={gridColumn}
                                            />
                                        )
                                    );
                                default:
                                    return null;
                            }
                        })}
                    </Grid>
                </Stack>
            </ModalBody>

            <ModalFooter>
                <VersionFooter />
            </ModalFooter>
        </>
    );
};
