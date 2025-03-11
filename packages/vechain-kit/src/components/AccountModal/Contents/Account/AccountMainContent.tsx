import {
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    VStack,
    Tag,
    ModalFooter,
    HStack,
} from '@chakra-ui/react';
import {
    StickyHeaderContainer,
    ScrollToTopWrapper,
    ModalFAQButton,
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
    const { network } = useVeChainKitConfig();
    const { connection, account } = useWallet();

    return (
        <ScrollToTopWrapper>
            <StickyHeaderContainer>
                <ModalFAQButton
                    onClick={() =>
                        setCurrentContent({
                            type: 'faq',
                            props: {
                                onGoBack: () => setCurrentContent('main'),
                            },
                        })
                    }
                />
                <ModalHeader>
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
                    spacing={6}
                >
                    {!account?.domain && (
                        <FeatureAnnouncementCard
                            setCurrentContent={setCurrentContent}
                        />
                    )}

                    <AccountSelector
                        style={{ justifyContent: 'flex-start' }}
                        onClick={() => {
                            setCurrentContent('profile');
                        }}
                        wallet={wallet}
                    />

                    {network?.type !== 'main' && (
                        <HStack w={'full'} justifyContent={'flex-start'}>
                            <Tag
                                size="xl"
                                colorScheme="orange"
                                fontSize={'xs'}
                                p={2}
                                textTransform={'capitalize'}
                            >
                                {`${network?.type} network`}
                            </Tag>
                        </HStack>
                    )}

                    <BalanceSection
                        onAssetsClick={() => {
                            setCurrentContent('assets');
                        }}
                    />

                    <QuickActionsSection
                        setCurrentContent={setCurrentContent}
                    />
                </VStack>
            </ModalBody>
            <ModalFooter pt={0}></ModalFooter>
        </ScrollToTopWrapper>
    );
};
