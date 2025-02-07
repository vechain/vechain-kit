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
import React, { useEffect, useMemo } from 'react';
import { useFetchAppInfo, useWallet } from '@/hooks';
import { VeChainLoginButton } from '../Components/VeChainLoginButton';
import { SocialLoginButtons } from '../Components/SocialLoginButtons';
import { PasskeyLoginButton } from '../Components/PasskeyLoginButton';
import { DappKitButton } from '../Components/DappKitButton';
import { EcosystemButton } from '../Components/EcosystemButton';
import { PrivyButton } from '../Components/PrivyButton';
import { useTranslation } from 'react-i18next';
import { VeChainWithPrivyLoginButton } from '../Components';
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
        showSocialLogin,
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

    // Calculate grid layout based on visible buttons and order configuration
    const gridLayout = useMemo(() => {
        // If order is specified, use those values
        if (loginMethods?.length) {
            const layout: Record<string, number> = {};

            loginMethods.forEach(({ method, gridColumn }) => {
                switch (method) {
                    case 'email':
                    case 'google':
                        layout.socialLoginColumn = gridColumn || 4;
                        break;
                    case 'vechain':
                        layout.veChainColumn = gridColumn || 4;
                        break;
                    case 'passkey':
                        layout.passkeyColumn = gridColumn || 1;
                        break;
                    case 'dappkit':
                        layout.dappKitColumn = gridColumn || 2;
                        break;
                    case 'ecosystem':
                        layout.ecosystemColumn = gridColumn || 2;
                        break;
                    case 'more':
                        layout.moreLoginColumn = gridColumn || 1;
                        break;
                }
            });

            return layout;
        }

        // Fall back to existing layout logic if no order is specified
        const visibleButtons = {
            socialLogin: showSocialLogin,
            veChainLogin: showVeChainLogin,
            dappKit: showDappKit,
            ecosystem: showEcosystem,
            moreLogin: showMoreLogin,
            passkey: showPasskey,
        };

        // For VeChain + DappKit + Ecosystem layout (vechain self hosted privy)
        if (
            visibleButtons.veChainLogin &&
            visibleButtons.dappKit &&
            visibleButtons.ecosystem &&
            !visibleButtons.socialLogin
        ) {
            return {
                veChainColumn: 4, // Full width
                dappKitColumn: 2, // Half width
                ecosystemColumn: 2, // Half width
            };
        }

        // For cases with social login (self hosted privy)
        if (visibleButtons.socialLogin) {
            return {
                socialLoginColumn: 4,
                veChainColumn: 4,
                dappKitColumn: 1,
                ecosystemColumn: 1,
                moreLoginColumn: 1,
                passkeyColumn: 1,
            };
        }

        // Default layout (distribute evenly)
        const totalButtons =
            Object.values(visibleButtons).filter(Boolean).length;
        const defaultColumn = Math.min(4, totalButtons);

        // defaults to no self hosted privy
        return {
            veChainColumn: 4,
            dappKitColumn: defaultColumn,
            ecosystemColumn: defaultColumn,
        };
    }, [
        loginMethods,
        showSocialLogin,
        showVeChainLogin,
        showDappKit,
        showEcosystem,
        showMoreLogin,
        showPasskey,
    ]);

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
                            {loginModalUI?.description || t('Login')}
                        </Text>
                    </HStack>
                )}

                <Stack spacing={4} w={'full'} align={'center'}>
                    <Grid templateColumns="repeat(4, 1fr)" gap={2} w={'full'}>
                        {showSocialLogin && (
                            <SocialLoginButtons
                                isDark={isDark}
                                loginMethods={loginMethods}
                                gridColumn={gridLayout.socialLoginColumn}
                            />
                        )}

                        {showVeChainLogin &&
                            (isOfficialVeChainApp ? (
                                <VeChainWithPrivyLoginButton
                                    isDark={isDark}
                                    gridColumn={gridLayout.veChainColumn}
                                />
                            ) : (
                                <VeChainLoginButton
                                    isDark={isDark}
                                    gridColumn={gridLayout.veChainColumn}
                                />
                            ))}

                        {showPasskey && (
                            <PasskeyLoginButton
                                isDark={isDark}
                                gridColumn={gridLayout.passkeyColumn}
                            />
                        )}

                        {showDappKit && (
                            <DappKitButton
                                isDark={isDark}
                                gridColumn={gridLayout.dappKitColumn}
                            />
                        )}

                        {showEcosystem && (
                            <EcosystemButton
                                isDark={isDark}
                                appsInfo={Object.values(appsInfo || {})}
                                isLoading={isEcosystemAppsLoading}
                                gridColumn={gridLayout.ecosystemColumn}
                            />
                        )}

                        {showMoreLogin && (
                            <PrivyButton
                                isDark={isDark}
                                onViewMoreLogin={viewMoreLogin}
                                gridColumn={gridLayout.moreLoginColumn}
                            />
                        )}
                    </Grid>
                </Stack>
            </ModalBody>

            <ModalFooter>
                <VersionFooter />
            </ModalFooter>
        </>
    );
};
