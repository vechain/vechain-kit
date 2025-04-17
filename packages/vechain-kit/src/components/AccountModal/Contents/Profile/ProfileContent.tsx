import {
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    Box,
    ModalFooter,
    VStack,
} from '@chakra-ui/react';
import { useWallet } from '@/hooks';
import { FeatureAnnouncementCard, ProfileCard } from '@/components';
import { ModalBackButton, StickyHeaderContainer } from '@/components/common';
import { AccountModalContentTypes } from '../../Types';
import { useTranslation } from 'react-i18next';
import { Analytics } from '@/utils/mixpanelClientInstance';

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

    const { account, disconnect } = useWallet();

    return (
        <Box>
            <StickyHeaderContainer>
                <ModalHeader data-testid='modal-title'>{t('Profile')}</ModalHeader>

                <ModalBackButton onClick={() => setCurrentContent('main')} />
                <ModalCloseButton />
            </StickyHeaderContainer>

            <ModalBody w={'full'}>
                <VStack w={'full'} spacing={2}>
                    {!account?.domain && (
                        <FeatureAnnouncementCard
                            setCurrentContent={setCurrentContent}
                        />
                    )}

                    <ProfileCard
                        onEditClick={() => {
                            Analytics.customization.started();
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
                        style={{
                            card: {
                                bg: 'transparent',
                                px: 0,
                            },
                            footer: {
                                px: 0,
                            },
                        }}
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
            <ModalFooter pt={0} />
        </Box>
    );
};
