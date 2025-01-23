import {
    Container,
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

            <Container maxW={'container.lg'}>
                <ModalBody w={'full'}>
                    <VStack w={'full'} overflow={'hidden'}>
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
            </Container>
        </ScrollToTopWrapper>
    );
};
