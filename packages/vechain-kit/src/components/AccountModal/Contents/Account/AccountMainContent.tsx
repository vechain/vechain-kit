import {
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    VStack,
    Tag,
    ModalFooter,
    HStack,
    Text,
} from '@chakra-ui/react';
import {
    StickyHeaderContainer,
    ScrollToTopWrapper,
    NotificationButton,
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
import { useNotifications } from '@/hooks';
import { Analytics } from '@/utils/mixpanelClientInstance';

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

    const { getNotifications } = useNotifications();
    const notifications = getNotifications();
    const hasUnreadNotifications = notifications.some((n) => !n.isRead);

    return (
        <ScrollToTopWrapper>
            <StickyHeaderContainer showInBottomSheet={false}>
                <ModalFAQButton
                    onClick={() =>
                        setCurrentContent({
                            type: 'faq',
                            props: {
                                onGoBack: () => setCurrentContent('main'),
                                showLanguageSelector: false,
                            },
                        })
                    }
                />

                <ModalHeader>
                    <HStack
                        w={'full'}
                        justifyContent={'center'}
                        p={0}
                        spacing={2}
                    >
                        <Text
                            fontSize={'md'}
                            fontWeight={'bold'}
                            data-testid="modal-title"
                        >
                            {t('Wallet')}
                        </Text>
                        {network?.type !== 'main' && (
                            <Tag
                                size="xs"
                                colorScheme="orange"
                                fontSize={'2xs'}
                                p={1}
                                textTransform={'uppercase'}
                            >
                                {`${network?.type}`}
                            </Tag>
                        )}
                    </HStack>
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
                    <HStack w={'full'} justifyContent={'flex-start'}>
                        <NotificationButton
                            onClick={() => {
                                Analytics.notifications.viewed();
                                setCurrentContent('notifications');
                            }}
                            hasUnreadNotifications={hasUnreadNotifications}
                            data-testid="notifications-button"
                        />
                        <AccountSelector
                            style={{ justifyContent: 'flex-start' }}
                            onClick={() => {
                                setCurrentContent('profile');
                            }}
                            wallet={wallet}
                        />
                    </HStack>

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
