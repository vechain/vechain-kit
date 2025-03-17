import {
    ModalBody,
    ModalCloseButton,
    VStack,
    ModalFooter,
    ModalHeader,
    Text,
    Icon,
    Button,
    Box,
} from '@chakra-ui/react';
import {
    usePrivy,
    useWallet,
    useMfaEnrollment,
    useUpgradeRequired,
    useSetWalletRecovery,
} from '@/hooks';
import React, { useEffect } from 'react';
import {
    ModalBackButton,
    ScrollToTopWrapper,
    StickyHeaderContainer,
} from '@/components/common';
import { AccountModalContentTypes } from '../../Types';
import { useTranslation } from 'react-i18next';
import { ActionButton } from '../../Components';
import { MdOutlineNavigateNext } from 'react-icons/md';
import { GrUserAdmin } from 'react-icons/gr';
import { Analytics } from '@/utils/mixpanelClientInstance';
import { HiOutlineShieldCheck } from 'react-icons/hi2';
import { IoCogSharp, IoShieldOutline } from 'react-icons/io5';
import { GiHouseKeys } from 'react-icons/gi';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { MdOutlineSettingsBackupRestore } from 'react-icons/md';

type Props = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
};

export const AccessAndSecurityContent = ({ setCurrentContent }: Props) => {
    const { t } = useTranslation();

    const { exportWallet } = usePrivy();
    const { showMfaEnrollmentModal } = useMfaEnrollment();
    const { setWalletRecovery } = useSetWalletRecovery();
    const { connection, smartAccount, connectedWallet } = useWallet();

    const { data: upgradeRequired } = useUpgradeRequired(
        smartAccount?.address ?? '',
        connectedWallet?.address ?? '',
        3,
    );

    useEffect(() => {
        Analytics.settings.trackSettings('security_view');
    }, []);

    const handleEmbeddedWalletClick = () => {
        Analytics.settings.trackSettings('embedded_wallet_view');
        setCurrentContent('embedded-wallet');
    };

    return (
        <ScrollToTopWrapper>
            <StickyHeaderContainer>
                <ModalHeader>{t('Access and security')}</ModalHeader>

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

                    {upgradeRequired && (
                        <ActionButton
                            title={t('Upgrade Smart Account to V3')}
                            description={t(
                                'A new version is available for your account',
                            )}
                            onClick={() => {
                                setCurrentContent({
                                    type: 'upgrade-smart-account',
                                    props: {
                                        setCurrentContent,
                                        initialContent: 'access-and-security',
                                    },
                                });
                            }}
                            leftIcon={IoCogSharp}
                            extraContent={
                                <Box
                                    minWidth="8px"
                                    height="8px"
                                    bg="red.500"
                                    borderRadius="full"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    ml={2}
                                />
                            }
                        />
                    )}

                    <ActionButton
                        style={{
                            marginTop: '10px',
                            borderBottomRadius: '0px',
                        }}
                        title={t('Embedded wallet')}
                        description={t(
                            'Manage your embedded wallet security settings: handle your login methods, add a passkey or back up your wallet to never lose access to your assets.',
                        )}
                        onClick={handleEmbeddedWalletClick}
                        leftIcon={IoShieldOutline}
                        rightIcon={MdOutlineNavigateNext}
                    />

                    <ActionButton
                        title={t('Login methods and Passkeys')}
                        onClick={() => {
                            setCurrentContent('privy-linked-accounts');
                        }}
                        isDisabled={!connection.isConnectedWithSocialLogin}
                        leftIcon={GrUserAdmin}
                        rightIcon={MdOutlineNavigateNext}
                    />

                    {/* <ActionButton
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
                    /> */}

                    <ActionButton
                        title={t('Backup your wallet')}
                        onClick={() => {
                            exportWallet();
                        }}
                        isDisabled={!connection.isConnectedWithSocialLogin}
                        leftIcon={GiHouseKeys}
                        // rightIcon={MdOutlineNavigateNext}
                    />

                    <ActionButton
                        title={t('Manage MFA')}
                        onClick={() => {
                            showMfaEnrollmentModal();
                        }}
                        isDisabled={!connection.isConnectedWithSocialLogin}
                        leftIcon={HiOutlineShieldCheck}
                    />

                    <ActionButton
                        title={t('Manage Recovery')}
                        onClick={() => {
                            setWalletRecovery();
                        }}
                        isDisabled={!connection.isConnectedWithSocialLogin}
                        leftIcon={MdOutlineSettingsBackupRestore}
                    />
                </VStack>
            </ModalBody>
            <ModalFooter w={'full'}>
                {connection.isConnectedWithVeChain &&
                    connection.isConnectedWithCrossApp && (
                        <Button
                            variant="vechainKitSecondary"
                            onClick={() => {
                                window.open(
                                    'https://governance.vebetterdao.org/',
                                    '_blank',
                                );
                            }}
                        >
                            {t('Manage on VeBetterDAO')}
                            <Icon as={FaExternalLinkAlt} ml={2} />
                        </Button>
                    )}
            </ModalFooter>
        </ScrollToTopWrapper>
    );
};
