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
import { ConnectModalContentsTypes, VeChainLoginButton, SocialLoginButtons, PasskeyLoginButton, DappKitButton, EcosystemButton, PrivyButton, VeChainWithPrivyLoginButton } from '@/components';
import React, { useEffect, useMemo } from 'react';
import { useFetchAppInfo, useWallet } from '@/hooks';
import { useTranslation } from 'react-i18next';

export type ConnectModalVariant =
    | 'full'
    | 'vechain-and-wallet'
    | 'vechain'
    | 'vechain-wallet-ecosystem';

type Props = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<ConnectModalContentsTypes>
    >;
    onClose: () => void;
    variant?: ConnectModalVariant;
};

export const MainContent = ({
    setCurrentContent,
    onClose,
    variant = 'vechain-wallet-ecosystem',
}: Props) => {
    const { t } = useTranslation();

    const { darkMode: isDark } = useVeChainKitConfig();
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

    const dappKitGridColumn = useMemo(() => {
        switch (variant) {
            case 'full':
                return 1;
            case 'vechain-and-wallet':
                return 4;
            case 'vechain-wallet-ecosystem':
                if (privyEcosystemAppIDS.length === 0) {
                    return 4;
                }
                return 2;
            default:
                if (
                    !privySocialLoginEnabled ||
                    privyEcosystemAppIDS.length === 0
                ) {
                    return 4;
                }
                return 1;
        }
    }, [variant, privySocialLoginEnabled, privyEcosystemAppIDS]);

    const privyGridColumn = useMemo(() => {
        switch (variant) {
            case 'full':
                if (privyEcosystemAppIDS.length === 0) {
                    return 2;
                }
                return 1;
            default:
                return 0;
        }
    }, [variant, privyEcosystemAppIDS]);

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
                            {t(loginModalUI?.description)}
                        </Text>
                    </HStack>
                )}

                <Stack spacing={4} w={'full'} align={'center'}>
                    <Grid templateColumns="repeat(4, 1fr)" gap={2} w={'full'}>
                        {variant === 'full' && privySocialLoginEnabled && (
                            <SocialLoginButtons
                                isDark={isDark}
                                loginModalUI={loginModalUI}
                            />
                        )}

                        {variant === 'vechain' ? (
                            // This exists because we want to use same button but connect
                            // with privy-auth instead of cross-app, used only by vechain.
                            <VeChainWithPrivyLoginButton
                                isDark={isDark}
                                gridColumn={4}
                            />
                        ) : (
                            <VeChainLoginButton
                                isDark={isDark}
                                gridColumn={4}
                            />
                        )}

                        {variant === 'full' && privySocialLoginEnabled && (
                            <PasskeyLoginButton isDark={isDark} />
                        )}

                        <DappKitButton
                            isDark={isDark}
                            gridColumn={dappKitGridColumn}
                        />

                        {(variant === 'full' ||
                            variant === 'vechain-wallet-ecosystem') &&
                            privyEcosystemAppIDS.length > 0 && (
                                <EcosystemButton
                                    isDark={isDark}
                                    privySocialLoginEnabled={
                                        variant === 'full' &&
                                        privySocialLoginEnabled
                                    }
                                    appsInfo={Object.values(appsInfo || {})}
                                    isLoading={isEcosystemAppsLoading}
                                />
                            )}

                        {variant === 'full' && privySocialLoginEnabled && (
                            <PrivyButton
                                isDark={isDark}
                                onViewMoreLogin={viewMoreLogin}
                                gridColumn={privyGridColumn}
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
