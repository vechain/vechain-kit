import {
    Box,
    Button,
    Image,
    ModalBody,
    ModalCloseButton,
    ModalFooter,
    ModalHeader,
    Spinner,
    Text,
    VStack,
    useDisclosure,
} from '@chakra-ui/react';
import { StickyHeaderContainer } from '@/components/common';
import { useCrossAppConnectionCache, usePrivy } from '@/hooks';
import { usePrivyCrossAppSdk } from '@/providers/PrivyCrossAppProvider';
import { useState } from 'react';
import { LoginLoadingModal } from '../LoginLoadingModal';
import { useTranslation } from 'react-i18next';
import { PrivyAppInfo } from '@/types';
import { useVeChainKitConfig } from '@/providers';
import { Analytics } from '@/utils/mixpanelClientInstance';
import { VeLoginMethod } from '@/types/mixPanel';
import { isRejectionError } from '@/utils/StringUtils';
type Props = {
    onClose: () => void;
    appsInfo: PrivyAppInfo[];
    isLoading: boolean;
};

export const EcosystemContent = ({ onClose, appsInfo, isLoading }: Props) => {
    const { t } = useTranslation();
    const { darkMode: isDark } = useVeChainKitConfig();

    const [loginError, setLoginError] = useState<string>();
    const [selectedApp, setSelectedApp] = useState<string>();
    const loginLoadingModal = useDisclosure();
    const { user } = usePrivy();

    const { setConnectionCache } = useCrossAppConnectionCache();

    // Login with Vechain - Cross app account login
    const { login: loginWithCrossApp } = usePrivyCrossAppSdk();

    const connectWithVebetterDaoApps = async (
        appId: string,
        appName: string,
    ) => {
        loginLoadingModal.onOpen();
        try {
            setLoginError(undefined);
            setSelectedApp(appName);
            try {
                await loginWithCrossApp(appId);
                Analytics.auth.trackAuth('connect_initiated', {
                    totalConnections: appsInfo.length,
                });
                loginLoadingModal.onClose();
                setConnectionCache({
                    name: appName,
                    logoUrl: appsInfo.find((app) => app.id === appId)?.logo_url,
                    appId: appId,
                    website: appsInfo.find((app) => app.id === appId)?.website,
                });
                Analytics.auth.completed({
                    userId: user?.id,
                    loginMethod: VeLoginMethod.ECOSYSTEM,
                });
                onClose();
            } catch (error) {
                const errorMsg = (error as { message?: string })?.message;

                // Handle user rejection or other errors
                if (errorMsg && isRejectionError(errorMsg)) {
                    Analytics.auth.dropOff('ecosystem-app-connect', {
                        ...(appName && { appName }),
                    });

                    return new Error('Login request was cancelled.');
                }

                // If it's an Error instance, return it, otherwise create new Error
                const errorToShow =
                    error instanceof Error
                        ? error
                        : new Error(
                              "'An unexpected issue occurred while logging in with this app. Please try again or contact support.',",
                          );

                setLoginError(errorToShow.message);
            }
        } catch (error) {
            console.error(t('Login failed:'), error);
            setLoginError(
                error instanceof Error
                    ? error.message
                    : t('Failed to connect with ecosystem app'),
            );
        }
    };

    const handleTryAgain = () => {
        if (selectedApp) {
            Analytics.auth.tryAgain(VeLoginMethod.ECOSYSTEM, selectedApp);
            const app = appsInfo.find((app) => app.name === selectedApp);
            if (app) {
                connectWithVebetterDaoApps(app.id, app.name);
            }
        }
    };

    const handleClose = () => {
        Analytics.auth.dropOff('ecosystem-view', {
            ...(selectedApp && { appName: selectedApp }),
        });
        onClose();
    };

    return (
        <Box>
            <>
                <StickyHeaderContainer>
                    <ModalHeader>
                        {t('Already have an x2earn app wallet?')}
                        <ModalCloseButton onClick={handleClose} />
                    </ModalHeader>
                </StickyHeaderContainer>

                <ModalBody>
                    {isLoading && (
                        <VStack
                            minH={'200px'}
                            w={'full'}
                            justifyContent={'center'}
                        >
                            <Spinner />
                        </VStack>
                    )}

                    {!isLoading && appsInfo && (
                        <VStack spacing={4} w={'full'} pb={6}>
                            {appsInfo.map((appInfo) => (
                                <Button
                                    key={appInfo.id}
                                    fontSize={'14px'}
                                    fontWeight={'400'}
                                    backgroundColor={
                                        isDark ? 'transparent' : '#ffffff'
                                    }
                                    border={`1px solid ${
                                        isDark ? '#ffffff29' : '#ebebeb'
                                    }`}
                                    p={6}
                                    borderRadius={16}
                                    w={'full'}
                                    onClick={() => {
                                        connectWithVebetterDaoApps(
                                            appInfo.id,
                                            appInfo.name,
                                        );
                                    }}
                                    justifyContent={'flex-start'}
                                >
                                    <Image
                                        src={appInfo.logo_url}
                                        alt={appInfo.name}
                                        w={'30px'}
                                    />
                                    <Text ml={5}>{appInfo.name}</Text>
                                </Button>
                            ))}
                        </VStack>
                    )}

                    {!isLoading && !appsInfo && (
                        <Text textAlign={'center'}>
                            {t(
                                'No application from VeChain ecosystem is available to login.',
                            )}
                        </Text>
                    )}
                </ModalBody>
                <ModalFooter pt={0} />
            </>

            <LoginLoadingModal
                isOpen={loginLoadingModal.isOpen}
                onClose={() => {
                    loginLoadingModal.onClose();
                }}
                error={loginError}
                title={`${t('Connecting with')} ${selectedApp}`}
                loadingText={t(
                    'Please approve the request in the connection request window...',
                )}
                onTryAgain={handleTryAgain}
            />
        </Box>
    );
};
