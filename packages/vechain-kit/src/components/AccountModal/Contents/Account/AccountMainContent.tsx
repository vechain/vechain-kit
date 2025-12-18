import {
    ModalBody,
    ModalHeader,
    VStack,
    Tag,
    ModalFooter,
} from '@chakra-ui/react';
import {
    StickyHeaderContainer,
    ScrollToTopWrapper,
    ModalCloseButton,
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
import { ModalSettingsButton } from '@/components/common/ModalSettingsButton';

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
    const { network } = useVeChainKitConfig();

    return (
        <ScrollToTopWrapper>
            <StickyHeaderContainer>
                <ModalSettingsButton
                    onClick={() => {
                        setCurrentContent('settings');
                    }}
                    data-testid="settings-button"
                />
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
