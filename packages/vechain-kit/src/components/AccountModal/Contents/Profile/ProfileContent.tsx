import {
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    ModalFooter,
    VStack,
    HStack,
    Button,
    Icon,
} from '@chakra-ui/react';
import { useSwitchWallet, useWallet } from '@/hooks';
import { FeatureAnnouncementCard } from '@/components';
import { ProfileCard } from './Components/ProfileCard/ProfileCard';
import { StickyHeaderContainer } from '@/components/common';
import { AccountModalContentTypes } from '../../Types';
import { useTranslation } from 'react-i18next';
import { LuArrowLeftRight, LuLogOut, LuWalletCards } from 'react-icons/lu';
import { ModalSettingsButton } from '@/components/common/ModalSettingsButton';

export type ProfileContentProps = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
    onLogoutSuccess: () => void;
};

export const ProfileContent = ({
    setCurrentContent,
    onLogoutSuccess,
}: ProfileContentProps) => {
    const { t } = useTranslation();
    const { account, disconnect, connection } = useWallet();
    const { switchWallet, isSwitching } = useSwitchWallet();

    return (
        <>
            <StickyHeaderContainer>
                <ModalHeader data-testid="modal-title">
                    {t('Profile')}
                </ModalHeader>

                <ModalSettingsButton
                    onClick={() => {
                        setCurrentContent('settings');
                    }}
                    data-testid="settings-button"
                />

                <ModalCloseButton />
            </StickyHeaderContainer>

            <ModalBody w={'full'}>
                <VStack w={'full'} spacing={6}>
                    {!account?.domain && (
                        <FeatureAnnouncementCard
                            setCurrentContent={setCurrentContent}
                        />
                    )}

                    <ProfileCard
                        onEditClick={() => {
                            setCurrentContent({
                                type: 'account-customization',
                                props: {
                                    setCurrentContent,
                                    initialContentSource: 'profile',
                                },
                            });
                        }}
                        address={account?.address ?? ''}
                        showHeader={false}
                        setCurrentContent={setCurrentContent}
                        onLogout={() => {
                            setCurrentContent?.({
                                type: 'disconnect-confirm',
                                props: {
                                    onDisconnect: () => {
                                        disconnect();
                                        onLogoutSuccess?.();
                                    },
                                    onBack: () =>
                                        setCurrentContent?.('profile'),
                                },
                            });
                        }}
                    />
                </VStack>
            </ModalBody>
            <ModalFooter w="full">
                <HStack w="full" justify="space-between" spacing={4} mt={4}>
                    <Button
                        size="md"
                        width="full"
                        height="40px"
                        variant="vechainKitSecondary"
                        leftIcon={<Icon as={LuWalletCards} />}
                        onClick={() => setCurrentContent('main')}
                        data-testid="wallet-button"
                    >
                        {t('Wallet')}
                    </Button>
                    {connection.isInAppBrowser ? (
                        <Button
                            size="md"
                            width="full"
                            height="40px"
                            variant="vechainKitSecondary"
                            leftIcon={<Icon as={LuArrowLeftRight} />}
                            colorScheme="red"
                            onClick={() => {
                                switchWallet();
                            }}
                            isLoading={isSwitching}
                            isDisabled={isSwitching}
                            data-testid="switch-wallet-button"
                        >
                            {t('Switch')}
                        </Button>
                    ) : (
                        <Button
                            size="md"
                            width="full"
                            height="40px"
                            variant="vechainKitSecondary"
                            leftIcon={<Icon as={LuLogOut} />}
                            colorScheme="red"
                            onClick={() =>
                                setCurrentContent({
                                    type: 'disconnect-confirm',
                                    props: {
                                        onDisconnect: () => {
                                            disconnect();
                                            onLogoutSuccess?.();
                                        },
                                        onBack: () =>
                                            setCurrentContent?.('profile'),
                                    },
                                })
                            }
                            data-testid="logout-button"
                        >
                            {t('Logout')}
                        </Button>
                    )}
                </HStack>
            </ModalFooter>
        </>
    );
};
