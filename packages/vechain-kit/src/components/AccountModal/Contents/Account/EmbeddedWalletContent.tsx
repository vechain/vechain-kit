import {
    AddressDisplay,
    ModalBackButton,
    ScrollToTopWrapper,
    StickyHeaderContainer,
} from '@/components/common';
import { useCrossAppConnectionCache, useWallet } from '@/hooks';
import { getPicassoImage } from '@/utils';
import {
    Divider,
    Icon,
    Image,
    Link,
    ModalBody,
    ModalCloseButton,
    ModalFooter,
    ModalHeader,
    Text,
    VStack,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { AccountModalContentTypes } from '../../Types';
import { IoOpenOutline } from 'react-icons/io5';
import { WalletSecuredBy } from '../ConnectionDetails/Components';
import { Analytics } from '@/utils/mixpanelClientInstance';
import { useEffect } from 'react';

type Props = {
    setCurrentContent: (content: AccountModalContentTypes) => void;
};

export const EmbeddedWalletContent = ({ setCurrentContent }: Props) => {
    const { t } = useTranslation();
    const { connectedWallet, connection } = useWallet();
    const walletImage = getPicassoImage(connectedWallet?.address ?? '');
    const { getConnectionCache } = useCrossAppConnectionCache();
    const connectionCache = getConnectionCache();

    useEffect(() => {
        Analytics.settings.trackSettings('embedded_wallet_view');
    }, []);

    return (
        <ScrollToTopWrapper>
            <StickyHeaderContainer>
                <ModalHeader>{t('Embedded wallet')}</ModalHeader>

                <ModalBackButton
                    onClick={() => setCurrentContent('access-and-security')}
                />
                <ModalCloseButton />
            </StickyHeaderContainer>

            <ModalBody w={'full'}>
                <VStack
                    justify={'center'}
                    spacing={3}
                    align="flex-start"
                    w={'full'}
                >
                    <VStack justify={'center'} align={'center'} w={'full'}>
                        <Image
                            src={walletImage}
                            maxW={'100px'}
                            borderRadius="50%"
                        />
                        <AddressDisplay
                            wallet={connectedWallet}
                            style={{ mt: 2 }}
                            showHumanAddress={false}
                        />
                    </VStack>

                    {connection.isConnectedWithCrossApp && (
                        <>
                            <Text fontSize={'sm'} opacity={0.5}>
                                {t(
                                    'This is your main wallet, created by {{element}} and secured by Privy.',
                                    {
                                        element:
                                            connectionCache?.ecosystemApp?.name,
                                    },
                                )}
                            </Text>

                            <Text fontSize={'sm'} opacity={0.5}>
                                {t(
                                    'This wallet is the owner of your smart account, which is used as your identity and as a gateway for your blockchain interactions.',
                                )}
                            </Text>
                            <Text fontSize={'sm'} opacity={0.5}>
                                {t(
                                    'Please be sure to keep this wallet safe and backed up.',
                                )}
                            </Text>
                        </>
                    )}

                    {connection.isConnectedWithSocialLogin && (
                        <>
                            <Text fontSize={'sm'} opacity={0.5}>
                                {t(
                                    'You are using an Embedded Wallet secured by your social login method, ensuring a seamless VeChain experience.',
                                )}
                            </Text>

                            <Text fontSize={'sm'} opacity={0.5}>
                                {t(
                                    'This wallet is the owner of your smart account, which is used as your identity and as a gateway for your blockchain interactions.',
                                )}
                            </Text>
                            <Text fontSize={'sm'} opacity={0.5}>
                                {t(
                                    'We highly recommend exporting your private key to back up your wallet. This ensures you can restore it if needed or transfer it to self-custody using',
                                )}
                                <Link
                                    href="https://www.veworld.net/"
                                    isExternal
                                    color="blackAlpha.600"
                                    fontSize={'14px'}
                                    textDecoration={'underline'}
                                >
                                    {' '}
                                    {t('VeWorld Wallet')}
                                    <Icon ml={1} as={IoOpenOutline} />
                                </Link>
                                .
                            </Text>
                            <Text fontSize={'sm'} opacity={0.5}>
                                {t('Click')}{' '}
                                <Link
                                    href="https://docs.vechainkit.vechain.org/vechain-kit/embedded-wallets"
                                    isExternal
                                    color="blackAlpha.600"
                                    fontSize={'14px'}
                                    textDecoration={'underline'}
                                >
                                    {t('here')}
                                </Link>{' '}
                                {t('to learn more about embedded wallets.')}
                            </Text>
                        </>
                    )}
                </VStack>
            </ModalBody>
            <ModalFooter w={'full'}>
                <VStack w={'full'}>
                    <Divider />
                    {connection.isConnectedWithPrivy && <WalletSecuredBy />}
                </VStack>
            </ModalFooter>
        </ScrollToTopWrapper>
    );
};
