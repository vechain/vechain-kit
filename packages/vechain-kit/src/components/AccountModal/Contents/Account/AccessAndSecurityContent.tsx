import {
    ModalBody,
    ModalCloseButton,
    VStack,
    ModalFooter,
    ModalHeader,
    Text,
} from '@chakra-ui/react';
import { usePrivy, useWallet } from '@/hooks';
import React from 'react';
import {
    ModalBackButton,
    ScrollToTopWrapper,
    StickyHeaderContainer,
} from '@/components/common';
import { AccountModalContentTypes } from '../../Types';
import { useTranslation } from 'react-i18next';
import { useVeChainKitConfig } from '@/providers';
import { ActionButton } from '../../Components';
import { MdOutlineNavigateNext } from 'react-icons/md';
import { GrUserAdmin } from 'react-icons/gr';
import { IoIosFingerPrint } from 'react-icons/io';
import { HiOutlineWallet } from 'react-icons/hi2';

type Props = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
};

export const AccessAndSecurityContent = ({ setCurrentContent }: Props) => {
    const { t } = useTranslation();

    const { linkPasskey } = usePrivy();

    const { darkMode: isDark, privy } = useVeChainKitConfig();
    const { connection } = useWallet();

    return (
        <ScrollToTopWrapper>
            <StickyHeaderContainer>
                <ModalHeader
                    fontSize={'md'}
                    fontWeight={'500'}
                    textAlign={'center'}
                    color={isDark ? '#dfdfdd' : '#4d4d4d'}
                >
                    {t('Access and security')}
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
                    <Text fontSize={'sm'} opacity={0.5}>
                        {t(
                            'Manage your embedded wallet security settings or back it up to a new device.',
                        )}
                    </Text>
                    {/* TODO: Go to {{element}} website to manage your login methods and security settings. */}

                    <ActionButton
                        title={t('Passkey')}
                        description={t(
                            'Enable one click login by adding a passkey to your account.',
                        )}
                        onClick={() => {
                            linkPasskey();
                        }}
                        leftIcon={IoIosFingerPrint}
                        rightIcon={undefined}
                        isDisabled={!privy?.allowPasskeyLinking}
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
                        leftIcon={GrUserAdmin}
                        rightIcon={MdOutlineNavigateNext}
                    />

                    <ActionButton
                        title={t('Embedded wallet')}
                        description={t(
                            connection.isConnectedWithSocialLogin
                                ? 'Store your Recovery Phrase or Private Key in a secure location, avoid losing access to your assets.'
                                : 'Backup can be done only in the app securing your wallet.',
                        )}
                        onClick={() => {
                            setCurrentContent('embedded-wallet');
                        }}
                        leftIcon={HiOutlineWallet}
                        rightIcon={MdOutlineNavigateNext}
                    />
                </VStack>
            </ModalBody>
            <ModalFooter w={'full'}></ModalFooter>
        </ScrollToTopWrapper>
    );
};
