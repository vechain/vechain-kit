import {
    Button,
    Icon,
    Image,
    ModalBody,
    ModalCloseButton,
    ModalFooter,
    ModalHeader,
    Spinner,
    Text,
    VStack,
    useColorMode,
    useDisclosure,
} from '@chakra-ui/react';
import {
    FadeInViewFromBottom,
    StickyHeaderContainer,
} from '@/components/common';
import { useVeChainKitConfig } from '@/providers';
import { useFetchAppInfo, useCrossAppConnectionCache } from '@/hooks';
import { IoPlanet } from 'react-icons/io5';
import { usePrivyCrossAppSdk } from '@/providers/PrivyCrossAppProvider';
import { useState } from 'react';
import { LoginLoadingModal } from '../LoginLoadingModal';
import { useTranslation } from 'react-i18next';

type Props = {
    onClose: () => void;
};

export const EcosystemContent = ({ onClose }: Props) => {
    const { t } = useTranslation();
    const { colorMode } = useColorMode();
    const isDark = colorMode === 'dark';
    const [loginError, setLoginError] = useState<string>();
    const [selectedApp, setSelectedApp] = useState<string>();
    const loginLoadingModal = useDisclosure();

    const { setConnectionCache } = useCrossAppConnectionCache();

    const { privyEcosystemAppIDS } = useVeChainKitConfig();
    const { data: appsInfo, isLoading } = useFetchAppInfo(privyEcosystemAppIDS);

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

            await loginWithCrossApp(appId);
            loginLoadingModal.onClose();

            // Store the appId along with the connection info
            setConnectionCache({
                name: appName,
                logoUrl: appsInfo?.[appId]?.logo_url,
                appId: appId,
            });

            onClose();
        } catch (error) {
            console.error(t('Login failed:'), error);
            setLoginError(
                error instanceof Error
                    ? error.message
                    : t('Failed to connect with ecosystem app'),
            );
        }
    };

    return (
        <>
            <FadeInViewFromBottom>
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
                        <Icon as={IoPlanet} size={'20px'} />
                        {t('Ecosystem Login')}
                    </ModalHeader>
                    <ModalCloseButton />
                </StickyHeaderContainer>

                {/* {loginModalUI?.logo && (
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
                )} */}

                <FadeInViewFromBottom>
                    <ModalBody>
                        <Text
                            fontSize={'12px'}
                            fontWeight={'400'}
                            opacity={0.5}
                            mb={4}
                            textAlign={'center'}
                        >
                            {t(
                                'Use your existing VeChain wallet from other ecosystem apps to sign in seamlessly.',
                            )}
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
                                {Object.entries(appsInfo).map(
                                    ([appId, appInfo]) => (
                                        <Button
                                            key={appId}
                                            fontSize={'14px'}
                                            fontWeight={'400'}
                                            backgroundColor={
                                                isDark
                                                    ? 'transparent'
                                                    : '#ffffff'
                                            }
                                            border={`1px solid ${
                                                isDark ? '#ffffff29' : '#ebebeb'
                                            }`}
                                            p={6}
                                            borderRadius={16}
                                            w={'full'}
                                            onClick={() =>
                                                connectWithVebetterDaoApps(
                                                    appId,
                                                    appInfo.name,
                                                )
                                            }
                                        >
                                            <Image
                                                src={appInfo.logo_url}
                                                alt={appInfo.name}
                                                w={'30px'}
                                            />
                                            <Text ml={5}>{appInfo.name}</Text>
                                        </Button>
                                    ),
                                )}
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
                </FadeInViewFromBottom>
            </FadeInViewFromBottom>

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
            />
        </>
    );
};
