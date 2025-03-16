import {
    ModalBody,
    ModalCloseButton,
    VStack,
    ModalFooter,
    ModalHeader,
    Text,
    Icon,
    Button,
} from '@chakra-ui/react';
import {
    usePrivy,
    useWallet,
    useMfaEnrollment,
    useUpgradeRequired,
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
import { HiOutlineShieldCheck } from 'react-icons/hi2';
import { IoShieldOutline } from 'react-icons/io5';
import { GiHouseKeys } from 'react-icons/gi';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { Analytics } from '@/utils/mixpanelClientInstance';

type Props = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
};

export const AccessAndSecurityContent = ({ setCurrentContent }: Props) => {
    const { t } = useTranslation();

    const { exportWallet } = usePrivy();
    const { showMfaEnrollmentModal } = useMfaEnrollment();

    const { connection, smartAccount, connectedWallet } = useWallet();

    const { data: upgradeRequired } = useUpgradeRequired(
        smartAccount?.address ?? '',
        connectedWallet?.address ?? '',
        3,
    );

    useEffect(() => {
        Analytics.settings.accessAndSecurityViewed();
    }, []);

    const handleEmbeddedWalletClick = () => {
        Analytics.settings.embeddedWalletViewed();
        setCurrentContent('embedded-wallet');
    };

    const handleVeBetterDAOClick = () => {
        Analytics.settings.manageVeBetterDAO();
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
                        style={{
                            borderTopRadius: '0px',
                        }}
                        title={t('Manage on VeBetterDAO')}
                        description={t(
                            'Manage your embedded wallet security settings: handle your login methods, add a passkey or back up your wallet to never lose access to your assets.',
                        )}
                        onClick={handleVeBetterDAOClick}
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
                            leftIcon={HiOutlineShieldCheck}
                        />
                    )}
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
