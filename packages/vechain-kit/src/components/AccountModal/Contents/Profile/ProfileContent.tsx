import {
    ModalBody,
    ModalHeader,
    Box,
    ModalFooter,
    VStack,
} from '@chakra-ui/react';
import { useWallet } from '@/hooks';
import { FeatureAnnouncementCard } from '@/components';
import { ProfileCard } from '@/components/ProfileCard/ProfileCard';
import {
    ModalBackButton,
    StickyHeaderContainer,
    ModalCloseButton,
} from '@/components/common';
import { AccountModalContentTypes } from '../../Types';
import { useTranslation } from 'react-i18next';
import { useAccountModalOptions } from '@/hooks/modals/useAccountModalOptions';

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
    const { isolatedView } = useAccountModalOptions();
    const { account, disconnect } = useWallet();

    return (
        <Box>
            <StickyHeaderContainer>
                <ModalHeader data-testid="modal-title">
                    {t('Profile')}
                </ModalHeader>

                {!isolatedView && (
                    <ModalBackButton
                        onClick={() => setCurrentContent('main')}
                    />
                )}
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
