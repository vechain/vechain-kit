import {
    ModalBody,
    ModalCloseButton,
    VStack,
    ModalFooter,
    ModalHeader,
    useColorMode,
    Text,
    Link,
    Icon,
} from '@chakra-ui/react';
import { useWallet } from '@/hooks';
import {
    ModalBackButton,
    StickyHeaderContainer,
    FadeInViewFromBottom,
} from '@/components/common';
import { useTranslation } from 'react-i18next';
import { useCrossAppConnectionCache } from '@/hooks';
import { CrossAppConnectionCard } from '@/components/AccountModal/Components';
import { IoOpenOutline } from 'react-icons/io5';

type Props = {
    onGoBack: () => void;
};

export const ConnectionDetailsContent = ({ onGoBack }: Props) => {
    const { t } = useTranslation();
    const { getConnectionCache } = useCrossAppConnectionCache();

    const { connectedWallet, connection, disconnect } = useWallet();
    const { colorMode } = useColorMode();
    const isDark = colorMode === 'dark';

    const connectionCache = getConnectionCache();

    return (
        <FadeInViewFromBottom>
            <StickyHeaderContainer>
                <ModalHeader
                    fontSize={'md'}
                    fontWeight={'500'}
                    textAlign={'center'}
                    color={isDark ? '#dfdfdd' : '#4d4d4d'}
                >
                    {t('Wallet')}
                </ModalHeader>

                <ModalBackButton
                    onClick={() => {
                        onGoBack();
                    }}
                />
                <ModalCloseButton />
            </StickyHeaderContainer>

            <FadeInViewFromBottom>
                <ModalBody w={'full'}>
                    <VStack align="stretch" textAlign={'center'} mt={5}>
                        {connection.isConnectedWithCrossApp && (
                            <Text
                                fontSize={'sm'}
                                opacity={0.5}
                                textAlign={'center'}
                            >
                                {t(
                                    'This is your main wallet and identity. Please be sure to keep it safe and backed up. Go to VeChain to manage your wallet and security settings.',
                                )}
                            </Text>
                        )}

                        {connection.isConnectedWithSocialLogin && (
                            <FadeInViewFromBottom>
                                {connection.isConnectedWithSocialLogin && (
                                    <>
                                        <Text fontSize={'sm'} opacity={0.5}>
                                            {t(
                                                'You are using an Embedded Wallet secured by your social login method, which acts as a master controller of your smart account, ensuring a seamless VeChain experience with full ownership and control.',
                                            )}
                                        </Text>

                                        <Text fontSize={'sm'} opacity={0.5}>
                                            {t(
                                                'We highly recommend exporting your private key to back up your wallet. This ensures you can restore it if needed or transfer it to self-custody using',
                                            )}
                                            <Link
                                                href="https://www.veworld.net/"
                                                isExternal
                                                color="gray.500"
                                                fontSize={'14px'}
                                                textDecoration={'underline'}
                                            >
                                                {t('VeWorld Wallet')}
                                                <Icon
                                                    ml={1}
                                                    as={IoOpenOutline}
                                                />
                                            </Link>
                                            .
                                        </Text>
                                    </>
                                )}
                            </FadeInViewFromBottom>
                        )}
                    </VStack>

                    <VStack mt={5} w={'full'} spacing={5}>
                        {connection.isConnectedWithCrossApp &&
                            connectionCache && (
                                <CrossAppConnectionCard
                                    connectionCache={connectionCache}
                                />
                            )}
                    </VStack>
                </ModalBody>
                <ModalFooter></ModalFooter>
            </FadeInViewFromBottom>
        </FadeInViewFromBottom>
    );
};
