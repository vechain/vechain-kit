import {
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    VStack,
    Tag,
    ModalFooter,
} from '@chakra-ui/react';
import {
    StickyHeaderContainer,
    ScrollToTopWrapper,
    WalletSwitchFeedback,
} from '@/components/common';
import { AccountModalContentTypes } from '../../Types';
import {
    AccountSelector,
    BalanceSection,
    ModalBackButton,
    QuickActionsSection,
} from '@/components';
import type { Wallet } from '../../../../types';
import { useTranslation } from 'react-i18next';
import { useVeChainKitConfig } from '@/providers';
import { useAccountModalOptions } from '../../../../hooks';

type Props = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
    onClose: () => void;
    wallet: Wallet;
    switchFeedback?: { showFeedback: boolean };
};

export const AccountMainContent = ({
    setCurrentContent,
    wallet,
    onClose,
    switchFeedback,
}: Props) => {
    const { t } = useTranslation();
    const { network } = useVeChainKitConfig();
    const { isolatedView } = useAccountModalOptions();

    return (
        <ScrollToTopWrapper>
            <StickyHeaderContainer>
                {!isolatedView && (
                    <ModalBackButton
                        onClick={() => {
                            setCurrentContent('profile');
                        }}
                    />
                )}
                <ModalHeader>
                    {t('Wallet')}

                    {network?.type !== 'main' && (
                        <Tag
                            size="xs"
                            colorScheme="orange"
                            fontSize={'2xs'}
                            p={1}
                            ml={1}
                            textTransform={'uppercase'}
                        >
                            {`${network?.type}`}
                        </Tag>
                    )}
                </ModalHeader>

                <ModalCloseButton />
            </StickyHeaderContainer>

            <ModalBody w={'full'}>
                <VStack
                    w={'full'}
                    overflow={'hidden'}
                    justifyContent={'flex-start'}
                    spacing={8}
                >
                    <WalletSwitchFeedback
                        showFeedback={switchFeedback?.showFeedback}
                    />
                    <AccountSelector
                        style={{ justifyContent: 'flex-start' }}
                        onClick={() => {
                            setCurrentContent('profile');
                        }}
                        setCurrentContent={setCurrentContent}
                        onClose={onClose}
                        wallet={wallet}
                    />

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
