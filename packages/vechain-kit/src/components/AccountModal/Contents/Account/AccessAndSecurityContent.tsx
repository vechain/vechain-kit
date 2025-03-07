import {
    ModalBody,
    ModalCloseButton,
    VStack,
    ModalFooter,
    ModalHeader,
    Text,
    Icon,
} from '@chakra-ui/react';
import { usePrivy, useWallet, useMfaEnrollment } from '@/hooks';
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
import { HiOutlineWallet, HiOutlineShieldCheck } from 'react-icons/hi2';
import { IoShieldOutline } from 'react-icons/io5';
import { GiHouseKeys } from 'react-icons/gi';

type Props = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
};

export const AccessAndSecurityContent = ({ setCurrentContent }: Props) => {
    const { t } = useTranslation();

    const { linkPasskey, exportWallet, user } = usePrivy();
    const {showMfaEnrollmentModal} = useMfaEnrollment();

    const { darkMode: isDark } = useVeChainKitConfig();
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
                    <VStack w="full" justifyContent="center" spacing={3} mb={3}>
                        <Icon
                            opacity={0.5}
                            as={IoShieldOutline}
                            fontSize={'50px'}
                        />
                        <Text
                            fontSize={'sm'}
                            opacity={0.5}
                            textAlign={'center'}
                        >
                            {t(
                                'Manage your embedded wallet security settings: handle your login methods, add a passkey or back up your wallet to never lose access to your assets.',
                            )}
                        </Text>
                    </VStack>

                    {/* TODO: Go to {{element}} website to manage your login methods and security settings. */}
                    <ActionButton
                        title={t('Your embedded wallet')}
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
                        title={t('Passkey')}
                        description={t(
                            'Enable one click login by adding a passkey to your account.',
                        )}
                        onClick={() => {
                            linkPasskey();
                        }}
                        leftIcon={IoIosFingerPrint}
                        rightIcon={undefined}
                        isDisabled={!connection.isConnectedWithSocialLogin}
                    />

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

                    <ActionButton
                        title={t('Manage MFA')}
                        description={t(
                            user?.mfaMethods
                                ? 'MFA is enabled. Click to manage your MFA settings.'
                                : 'Enable MFA to add an extra layer of security to your wallet.'
                        )}
                        onClick={() => {
                            showMfaEnrollmentModal();
                        }}
                        leftIcon={HiOutlineShieldCheck}
                        rightIcon={MdOutlineNavigateNext}
                    />
                </VStack>
            </ModalBody>
            <ModalFooter w={'full'}></ModalFooter>
        </ScrollToTopWrapper>
    );
};
