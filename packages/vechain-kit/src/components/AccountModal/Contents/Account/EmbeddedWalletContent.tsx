import {
    AddressDisplay,
    ModalBackButton,
    ScrollToTopWrapper,
    StickyHeaderContainer,
} from '@/components/common';
import { useCrossAppConnectionCache, usePrivy, useWallet } from '@/hooks';
import { useVeChainKitConfig } from '@/providers';
import { getPicassoImage } from '@/utils';
import {
    Button,
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
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AccountModalContentTypes } from '../../Types';
import { IoOpenOutline } from 'react-icons/io5';
import { WalletSecuredBy } from '../ConnectionDetails/Components';
import { ActionButton } from '../../Components';
import { GiHouseKeys } from 'react-icons/gi';

type Props = {
    setCurrentContent: (content: AccountModalContentTypes) => void;
};

export const EmbeddedWalletContent = ({ setCurrentContent }: Props) => {
    const { t } = useTranslation();
    const { connectedWallet, connection } = useWallet();
    const [showFullText, setShowFullText] = useState(false);
    const walletImage = getPicassoImage(connectedWallet?.address ?? '');
    const { getConnectionCache } = useCrossAppConnectionCache();
    const connectionCache = getConnectionCache();
    const { darkMode: isDark } = useVeChainKitConfig();

    const { exportWallet } = usePrivy();

    return (
        <ScrollToTopWrapper>
            <StickyHeaderContainer>
                <ModalHeader
                    fontSize={'md'}
                    fontWeight={'500'}
                    textAlign={'center'}
                    color={isDark ? '#dfdfdd' : '#4d4d4d'}
                >
                    {t('Embedded wallet')}
                </ModalHeader>

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
                        <AddressDisplay wallet={connectedWallet} />
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

                            {showFullText && (
                                <>
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

                            <Button
                                mt={0}
                                variant="link"
                                size="sm"
                                onClick={() => setShowFullText(!showFullText)}
                                color="blue.500"
                                textAlign="left"
                            >
                                {t(showFullText ? 'Show Less' : 'Read More')}
                            </Button>
                        </>
                    )}

                    {connection.isConnectedWithSocialLogin && (
                        <>
                            <Text fontSize={'sm'} opacity={0.5}>
                                {t(
                                    'You are using an Embedded Wallet secured by your social login method, ensuring a seamless VeChain experience.',
                                )}
                            </Text>

                            {showFullText && (
                                <>
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
                                            color="gray.500"
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
                                            href="https://docs.vechain-kit.vechain.org/vechain-kit/embedded-wallets"
                                            isExternal
                                            color="gray.500"
                                            fontSize={'14px'}
                                            textDecoration={'underline'}
                                        >
                                            {t('here')}
                                        </Link>{' '}
                                        {t(
                                            'to learn more about embedded wallets.',
                                        )}
                                    </Text>
                                </>
                            )}

                            <Button
                                mt={0}
                                variant="link"
                                size="sm"
                                onClick={() => setShowFullText(!showFullText)}
                                color="blue.500"
                                textAlign="left"
                            >
                                {t(showFullText ? 'Show Less' : 'Read More')}
                            </Button>
                        </>
                    )}

                    <ActionButton
                        title={t('Backup your wallet')}
                        description={t(
                            connection.isConnectedWithSocialLogin
                                ? 'Store your Recovery Phrase or Private Key in a secure location, avoid losing access to your assets.'
                                : 'Backup can be done only in the app securing your wallet.',
                        )}
                        onClick={() => {
                            exportWallet();
                        }}
                        isDisabled={!connection.isConnectedWithSocialLogin}
                        leftIcon={GiHouseKeys}
                        // rightIcon={MdOutlineNavigateNext}
                    />
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
