import {
    ModalBody,
    ModalCloseButton,
    ModalFooter,
    ModalHeader,
    VStack,
} from '@chakra-ui/react';
import {
    StickyHeaderContainer,
    VersionFooter,
    ScrollToTopWrapper,
} from '@/components/common';
import { AccountModalContentTypes } from '../../Types';
import {
    AccountSelector,
    BalanceSection,
    QuickActionsSection,
} from '@/components';
import { Wallet } from '@/types';
import { useTranslation } from 'react-i18next';
import { useVeChainKitConfig } from '@/providers';
import { useWallet } from '@/hooks';
import { FeatureAnnouncementCard } from '../../Components/Alerts';
import React from 'react';

type Props = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
    onClose: () => void;
    wallet: Wallet;
};

export const AccountMainContent = ({ setCurrentContent, wallet }: Props) => {
    const { t } = useTranslation();
    const { darkMode: isDark } = useVeChainKitConfig();
    const { connection, account } = useWallet();

    return (
        <ScrollToTopWrapper>
            <StickyHeaderContainer>
                <ModalHeader
                    w={'full'}
                    color={isDark ? '#dfdfdd' : 'rgb(77, 77, 77)'}
                    fontSize={'md'}
                    fontWeight={'500'}
                    textAlign={'center'}
                >
                    {connection.isConnectedWithPrivy
                        ? t('Account')
                        : t('Wallet')}
                </ModalHeader>

                <ModalCloseButton />
            </StickyHeaderContainer>

            <ModalBody w={'full'}>
                <VStack
                    w={'full'}
                    overflow={'hidden'}
                    justifyContent={'flex-start'}
                >
                    {!account?.domain && (
                        <FeatureAnnouncementCard
                            setCurrentContent={setCurrentContent}
                        />
                    )}

                    <AccountSelector
                        mt={0}
                        style={{ justifyContent: 'flex-start' }}
                        onClick={() => {
                            setCurrentContent('settings');
                        }}
                        wallet={wallet}
                    />

                    <BalanceSection
                        mt={8}
                        onAssetsClick={() => {
                            setCurrentContent('assets');
                        }}
                    />

                    <QuickActionsSection
                        mt={8}
                        setCurrentContent={setCurrentContent}
                    />
                </VStack>
            </ModalBody>
            <ModalFooter>
                <VersionFooter />
            </ModalFooter>
        </ScrollToTopWrapper>
    );
};
