import {
    Image,
    ModalBody,
    ModalCloseButton,
    VStack,
    ModalFooter,
    ModalHeader,
    Text,
    Icon,
    Link,
    Button,
    Divider,
} from '@chakra-ui/react';
import { useCrossAppConnectionCache, usePrivy, useWallet } from '@/hooks';
import React, { useState } from 'react';
import {
    AddressDisplay,
    ModalBackButton,
    ScrollToTopWrapper,
    StickyHeaderContainer,
} from '@/components/common';
import { AccountModalContentTypes } from '../../Types';
import { getPicassoImage } from '@/utils';
import { useTranslation } from 'react-i18next';
import { useVeChainKitConfig } from '@/providers';
import { IoOpenOutline } from 'react-icons/io5';
import { ActionButton } from '../../Components';
import { GiHouseKeys } from 'react-icons/gi';
import { MdManageAccounts, MdOutlineNavigateNext } from 'react-icons/md';
import { WalletSecuredBy } from '../ConnectionDetails/Components';
import { IoIosFingerPrint } from 'react-icons/io';

type Props = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
};

export const EmbeddedWalletContent = ({ setCurrentContent }: Props) => {
    const { t } = useTranslation();
    const [showFullText, setShowFullText] = useState(false);

    const { connectedWallet } = useWallet();

    const { exportWallet } = usePrivy();

    const walletImage = getPicassoImage(connectedWallet?.address ?? '');

    const { getConnectionCache } = useCrossAppConnectionCache();

    const { darkMode: isDark, privy } = useVeChainKitConfig();
    const { connection } = useWallet();

    const { linkPasskey } = usePrivy();

    const connectionCache = getConnectionCache();

    return (
        <ScrollToTopWrapper>
            <StickyHeaderContainer>
                <ModalHeader
                    fontSize={'md'}
                    fontWeight={'500'}
                    textAlign={'center'}
                    color={isDark ? '#dfdfdd' : '#4d4d4d'}
                >
                    {t('Embedded Wallet')}
                </ModalHeader>

                <ModalBackButton
                    onClick={() => setCurrentContent('settings')}
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
                                    'This is your main wallet, created by {{element}} and secured by Privy. This wallet is the owner of your smart account, which is used as your identity and as a gateway for your blockchain interactions. Please be sure to keep it safe and backed up.',
                                    {
                                        element:
                                            connectionCache?.ecosystemApp?.name,
                                    },
                                )}
                            </Text>
                            <Text fontSize={'sm'} opacity={0.5} mt={5}>
                                {t(
                                    'A smart account is being used as a gateway for blockchain interactions.',
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

                    {/* TODO: Go to {{element}} website to manage your login methods and security settings. */}

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
                        rightIcon={MdOutlineNavigateNext}
                    />

                    <ActionButton
                        title={t('Login methods')}
                        description={t(
                            connection.isConnectedWithSocialLogin
                                ? 'View and manage the login methods linked to your wallet.'
                                : 'Login methods can be managed only in the app securing your wallet.',
                        )}
                        onClick={() => {
                            setCurrentContent('privy-linked-accounts');
                        }}
                        isDisabled={!connection.isConnectedWithSocialLogin}
                        leftIcon={MdManageAccounts}
                        rightIcon={MdOutlineNavigateNext}
                    />

                    <ActionButton
                        title={t('Manage passkey login')}
                        description={t(
                            'Enable one click login by adding a passkey to your account.',
                        )}
                        onClick={() => {
                            linkPasskey();
                        }}
                        leftIcon={IoIosFingerPrint}
                        rightIcon={MdOutlineNavigateNext}
                        isDisabled={
                            !connection.isConnectedWithSocialLogin ||
                            !privy?.allowPasskeyLinking
                        }
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
