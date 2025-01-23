import {
    ModalBody,
    ModalCloseButton,
    VStack,
    ModalFooter,
    ModalHeader,
    Text,
    HStack,
    Image,
    Divider,
} from '@chakra-ui/react';
import { ModalBackButton, StickyHeaderContainer } from '@/components/common';
import { useTranslation } from 'react-i18next';
import {
    useCrossAppConnectionCache,
    useFetchAppInfo,
    useWallet,
} from '@/hooks';
import {
    CrossAppConnectionCard,
    DappKitConnectionCard,
    PrivyConnectionCard,
} from './Components';
import { useVeChainKitConfig } from '@/providers';
import { useWallet as useDappKitWallet } from '@vechain/dapp-kit-react';

type Props = {
    onGoBack: () => void;
};

export const ConnectionDetailsContent = ({ onGoBack }: Props) => {
    const { t } = useTranslation();
    const { getConnectionCache } = useCrossAppConnectionCache();

    const { privy, darkMode: isDark } = useVeChainKitConfig();
    const { connection } = useWallet();
    const { source } = useDappKitWallet();

    const { data: appInfo } = useFetchAppInfo(privy?.appId ?? '');

    const connectionCache = getConnectionCache();

    return (
        <>
            <StickyHeaderContainer>
                <ModalHeader
                    fontSize={'md'}
                    fontWeight={'500'}
                    textAlign={'center'}
                    color={isDark ? '#dfdfdd' : '#4d4d4d'}
                >
                    {t('Connection Details')}
                </ModalHeader>

                <ModalBackButton
                    onClick={() => {
                        onGoBack();
                    }}
                />
                <ModalCloseButton />
            </StickyHeaderContainer>

            <ModalBody w={'full'}>
                {connection.isConnectedWithCrossApp && connectionCache && (
                    <CrossAppConnectionCard connectionCache={connectionCache} />
                )}

                {connection.isConnectedWithSocialLogin && (
                    <PrivyConnectionCard />
                )}

                {connection.isConnectedWithDappKit && (
                    <VStack align="stretch" textAlign={'center'} mt={5}>
                        <DappKitConnectionCard />

                        <Text
                            fontSize={'sm'}
                            opacity={0.5}
                            textAlign={'center'}
                        >
                            {t(
                                'This is your main wallet and identity. Please be sure to keep it safe and backed up. Go to {{element}} app or extension to manage your wallet and security settings.',
                                {
                                    element: source,
                                },
                            )}
                        </Text>
                    </VStack>
                )}

                {(connection.isConnectedWithSocialLogin ||
                    connection.isConnectedWithCrossApp) && (
                    <VStack spacing={4} mt={5}>
                        <Divider />
                        <VStack
                            spacing={4}
                            p={4}
                            borderRadius="lg"
                            bg={isDark ? 'whiteAlpha.100' : 'blackAlpha.50'}
                        >
                            <Text
                                fontSize="xs"
                                fontWeight="normal"
                                textAlign={'center'}
                            >
                                {t(
                                    'To use this identity on other applications always choose this option as login method:',
                                )}
                            </Text>

                            <HStack
                                p={3}
                                borderRadius="lg"
                                bg={isDark ? 'whiteAlpha.200' : 'white'}
                                shadow="sm"
                                spacing={4}
                            >
                                <Image
                                    src={
                                        connection.isConnectedWithCrossApp
                                            ? connectionCache?.ecosystemApp
                                                  ?.logoUrl
                                            : privy?.appearance.logo
                                    }
                                    alt="App Logo"
                                    boxSize="24px"
                                    borderRadius="md"
                                />
                                <Text fontSize="sm" fontWeight="500">
                                    {t('Login with {{appName}}', {
                                        appName:
                                            connection.isConnectedWithCrossApp
                                                ? connectionCache?.ecosystemApp
                                                      ?.name
                                                : Object.values(
                                                      appInfo ?? {},
                                                  )[0]?.name ?? '',
                                    })}
                                </Text>
                            </HStack>
                        </VStack>
                    </VStack>
                )}
            </ModalBody>
            <ModalFooter></ModalFooter>
        </>
    );
};
