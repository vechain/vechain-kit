import {
    HStack,
    Icon,
    IconButton,
    ModalBody,
    ModalCloseButton,
    ModalFooter,
    ModalHeader,
    VStack,
} from '@chakra-ui/react';
import {
    StickyHeaderContainer,
    VersionFooter,
    ModalFAQButton,
    ScrollToTopWrapper,
} from '@/components/common';
import { AccountModalContentTypes } from '../../Types';
import {
    AccountSelector,
    AssetsSection,
    BalanceSection,
    QuickActionsSection,
} from '@/components';
import { Wallet } from '@/types';
import { useTranslation } from 'react-i18next';
import { useVeChainKitConfig } from '@/providers';
import { useWallet } from '@/hooks';
import { BiBell } from 'react-icons/bi';

type Props = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
    onClose: () => void;
    wallet: Wallet;
};

export const AccountMainContent = ({
    setCurrentContent,
    wallet,
    onClose,
}: Props) => {
    const { t } = useTranslation();
    const { darkMode: isDark } = useVeChainKitConfig();
    const { disconnect, connection } = useWallet();

    return (
        <ScrollToTopWrapper>
            <StickyHeaderContainer>
                <ModalFAQButton onClick={() => setCurrentContent('faq')} />
                <ModalHeader
                    w={'full'}
                    fontSize={'md'}
                    fontWeight={'500'}
                    textAlign={'center'}
                    color={isDark ? '#dfdfdd' : '#4d4d4d'}
                >
                    {connection.isConnectedWithPrivy
                        ? t('Account')
                        : t('Wallet')}
                </ModalHeader>

                <ModalCloseButton />
            </StickyHeaderContainer>

            <ModalBody w={'full'}>
                <VStack w={'full'} overflow={'hidden'}>
                    <HStack justify={'space-between'}>
                        <AccountSelector
                            mt={0}
                            onClick={() => {
                                setCurrentContent('settings');
                            }}
                            onDisconnect={() => {
                                disconnect();
                                onClose();
                            }}
                            wallet={wallet}
                        />
                        <IconButton
                            p={2}
                            h={9}
                            variant="vechainKitSelector"
                            aria-label="notifications"
                            icon={<Icon boxSize={5} as={BiBell} />}
                            onClick={() => setCurrentContent('notifications')}
                        />
                    </HStack>

                    <BalanceSection mt={10} />

                    <QuickActionsSection
                        mt={10}
                        setCurrentContent={setCurrentContent}
                    />
                    <AssetsSection
                        mt={2}
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
