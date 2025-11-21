import {
    ModalBody,
    ModalCloseButton,
    VStack,
    ModalFooter,
    ModalHeader,
    Text,
    Box,
    useToken,
} from '@chakra-ui/react';
import {
    usePrivy,
    useWallet,
    useMfaEnrollment,
    useUpgradeRequired,
    useSetWalletRecovery,
} from '@/hooks';
import {
    ModalBackButton,
    ScrollToTopWrapper,
    StickyHeaderContainer,
} from '@/components/common';
import { AccountModalContentTypes } from '../../Types';
import { useTranslation } from 'react-i18next';
import { ActionButton } from '../../Components';
import {
    LuChevronRight,
    LuUserCog,
    LuSettings2,
    LuRotateCcw,
    LuShieldCheck,
    LuWallet,
    LuKey,
} from 'react-icons/lu';
import { CrossAppConnectionSecurityCard } from '../../Components/CrossAppConnectionSecurityCard';

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

    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');

    const { data: upgradeRequired } = useUpgradeRequired(
        smartAccount?.address ?? '',
        connectedWallet?.address ?? '',
        3,
    );

    const handleUpgradeSmartAccountClick = () => {
        setCurrentContent({
            type: 'upgrade-smart-account',
            props: {
                setCurrentContent,
                initialContent: 'access-and-security',
            },
        });
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
                        <Text
                            fontSize={'sm'}
                            color={textSecondary}
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
                            onClick={handleUpgradeSmartAccountClick}
                            leftIcon={LuSettings2}
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
                        title={t('Your embedded wallet')}
                        onClick={() => {
                            setCurrentContent('embedded-wallet');
                        }}
                        leftIcon={LuWallet}
                        rightIcon={LuChevronRight}
                    />

                    {connection.isConnectedWithSocialLogin ? (
                        <VStack w="full" justifyContent="center" spacing={0}>
                            <ActionButton
                                title={t('Login methods and Passkeys')}
                                style={{
                                    borderBottomRadius: '0px',
                                }}
                                onClick={() => {
                                    setCurrentContent('privy-linked-accounts');
                                }}
                                leftIcon={LuUserCog}
                                rightIcon={LuChevronRight}
                            />

                            <ActionButton
                                title={t('Backup your wallet')}
                                style={{
                                    borderTopRadius: '0px',
                                    borderBottomRadius: '0px',
                                }}
                                onClick={() => {
                                    exportWallet();
                                }}
                                leftIcon={LuKey}
                            />

                            <ActionButton
                                title={t('Manage MFA')}
                                style={{
                                    borderTopRadius: '0px',
                                    borderBottomRadius: '0px',
                                }}
                                onClick={() => {
                                    showMfaEnrollmentModal();
                                }}
                                leftIcon={LuShieldCheck}
                            />

                            <ActionButton
                                title={t('Manage Recovery')}
                                style={{
                                    borderTopRadius: '0px',
                                }}
                                onClick={() => {
                                    setWalletRecovery();
                                }}
                                leftIcon={LuRotateCcw}
                            />
                        </VStack>
                    ) : (
                        <CrossAppConnectionSecurityCard />
                    )}
                </VStack>
            </ModalBody>
            <ModalFooter pt={0} />
        </ScrollToTopWrapper>
    );
};
