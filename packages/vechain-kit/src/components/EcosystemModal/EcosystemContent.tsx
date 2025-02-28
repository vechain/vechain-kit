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
import { useCrossAppConnectionCache } from '@/hooks';
import { usePrivyCrossAppSdk } from '@/providers/PrivyCrossAppProvider';
import { useState } from 'react';
import { LoginLoadingModal } from '../LoginLoadingModal';
import { useTranslation } from 'react-i18next';
import { PrivyAppInfo } from '@/types';
import { useVeChainKitConfig } from '@/providers';
import { handlePopupError } from '@/utils/handlePopupError';

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
                loginLoadingModal.onClose();
                setConnectionCache({
                    name: appName,
                    logoUrl: appsInfo.find((app) => app.id === appId)?.logo_url,
                    appId: appId,
                });
                onClose();
            } catch (error) {
                const popupError = handlePopupError({
                    error,
                    rejectedMessage: t('Login request was cancelled.'),
                    defaultMessage: t('Failed to connect with ecosystem app'),
                });
                setLoginError(popupError.message);
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

    // Add onTryAgain handler for the LoginLoadingModal
    const handleTryAgain = () => {
        if (selectedApp) {
            const app = appsInfo.find((app) => app.name === selectedApp);
            if (app) {
                connectWithVebetterDaoApps(app.id, app.name);
            }
        }
    };

    return (
        <Box>
            <>
                <StickyHeaderContainer>
                    <ModalHeader
                        fontSize={'md'}
                        fontWeight={'500'}
                        textAlign={'center'}
                        color={isDark ? '#dfdfdd' : '#4d4d4d'}
                        justifyContent={'center'}
                        alignItems={'center'}
                        display={'flex'}
                        gap={2}
                    >
                        {t('Already have an app account?')}
                    </ModalHeader>
                    <ModalCloseButton />
                </StickyHeaderContainer>

                {/* {loginModalUI?.logo && (
                        <HStack justify={'center'}>
                            <Image
                                src={loginModalUI.logo || '/images/favicon.png'}
                                maxW={'180px'}
                                maxH={'90px'}
                                m={10}
                                alt="logo"
                            />
                        </HStack>
                )} */}

                <ModalBody>
                    <Text
                        fontSize={'12px'}
                        fontWeight={'400'}
                        opacity={0.5}
                        mb={4}
                        textAlign={'center'}
                    >
                        {t('Sign in with a wallet from other x2earn apps.')}
                    </Text>
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
                <ModalFooter></ModalFooter>
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
