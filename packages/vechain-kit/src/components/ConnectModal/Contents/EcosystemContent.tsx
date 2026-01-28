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
    useToken,
} from '@chakra-ui/react';
import { ModalBackButton, StickyHeaderContainer } from '../../common';
import { useCrossAppConnectionCache } from '../../../hooks';
import { usePrivyCrossAppSdk } from '../../../providers/PrivyCrossAppProvider';
import { useTranslation } from 'react-i18next';
import type { PrivyAppInfo } from '../../../types';
import { isRejectionError } from '../../../utils/stringUtils';
import { ConnectModalContentsTypes } from '../ConnectModal';
type Props = {
    onClose: () => void;
    appsInfo: PrivyAppInfo[];
    isLoading: boolean;
    setCurrentContent: React.Dispatch<
        React.SetStateAction<ConnectModalContentsTypes>
    >;
    showBackButton?: boolean;
};

export const EcosystemContent = ({
    onClose,
    appsInfo,
    isLoading,
    setCurrentContent,
    showBackButton = true,
}: Props) => {
    const { t } = useTranslation();

    // Use semantic token for text color (buttons use variants now)
    const textColor = useToken('colors', 'vechain-kit-text-primary');

    const { setConnectionCache } = useCrossAppConnectionCache();

    // Login with Vechain - Cross app account login
    const { login: loginWithCrossApp } = usePrivyCrossAppSdk();

    const connectWithVebetterDaoApps = async (
        appId: string,
        appName: string,
    ) => {
        setCurrentContent({
            type: 'loading',
            props: {
                title: `${t('Connecting with')} ${appName}`,
                loadingText: t(
                    'Please approve the request in the connection request window...',
                ),
                onTryAgain: () => {
                    connectWithVebetterDaoApps(appId, appName);
                },
            },
        });
        try {
            await loginWithCrossApp(appId);
            setConnectionCache({
                name: appName,
                logoUrl: appsInfo.find((app) => app.id === appId)?.logo_url,
                appId: appId,
                website: appsInfo.find((app) => app.id === appId)?.website,
            });
            onClose();
        } catch (error) {
            const errorMsg = (error as { message?: string })?.message;

            // Handle user rejection or other errors
            if (errorMsg && isRejectionError(errorMsg)) {
                setCurrentContent({
                    type: 'ecosystem',
                    props: { appsInfo, isLoading: false },
                });
                return;
            }

            // If it's an Error instance, return it, otherwise create new Error
            const errorToShow =
                error instanceof Error
                    ? error
                    : new Error(
                          'An unexpected issue occurred while logging in with this app. Please try again or contact support.',
                      );

            setCurrentContent({
                type: 'error',
                props: {
                    error: errorToShow.message,
                    onTryAgain: () => {
                        connectWithVebetterDaoApps(appId, appName);
                    },
                },
            });
        }
    };

    return (
        <Box>
            <>
                <StickyHeaderContainer>
                    <ModalHeader>
                        {showBackButton && (
                            <ModalBackButton
                                onClick={() => setCurrentContent('main')}
                            />
                        )}
                        {t('Already have an x2earn app wallet?')}
                        <ModalCloseButton onClick={onClose} />
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
                                    variant="loginIn"
                                    fontSize={'14px'}
                                    fontWeight={'400'}
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
                        <Text textAlign={'center'} color={textColor}>
                            {t(
                                'No application from VeChain ecosystem is available to login.',
                            )}
                        </Text>
                    )}
                </ModalBody>
                <ModalFooter pt={0} />
            </>
        </Box>
    );
};
