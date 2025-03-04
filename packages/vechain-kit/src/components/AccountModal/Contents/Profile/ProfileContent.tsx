import {
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    Box,
} from '@chakra-ui/react';
import { useWallet } from '@/hooks';
import { ProfileCard } from '@/components';
import { ModalBackButton, StickyHeaderContainer } from '@/components/common';
import { useVeChainKitConfig } from '@/providers/VeChainKitProvider';
import { AccountModalContentTypes } from '../../Types';
import { useTranslation } from 'react-i18next';

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

    const { darkMode: isDark } = useVeChainKitConfig();

    const { account, disconnect } = useWallet();

    return (
        <Box>
            <StickyHeaderContainer>
                <ModalHeader
                    fontSize={'md'}
                    fontWeight={'500'}
                    textAlign={'center'}
                    color={isDark ? '#dfdfdd' : '#4d4d4d'}
                >
                    {t('Profile')}
                </ModalHeader>

                <ModalBackButton onClick={() => setCurrentContent('main')} />
                <ModalCloseButton />
            </StickyHeaderContainer>

            <ModalBody w={'full'}>
                <ProfileCard
                    onEditClick={() =>
                        setCurrentContent('account-customization')
                    }
                    address={account?.address ?? ''}
                    onLogout={() => {
                        setCurrentContent?.({
                            type: 'disconnect-confirm',
                            props: {
                                onDisconnect: () => {
                                    disconnect();
                                    onLogoutSuccess?.();
                                },
                                onBack: () => setCurrentContent?.('settings'),
                            },
                        });
                    }}
                />
            </ModalBody>
        </Box>
    );
};
