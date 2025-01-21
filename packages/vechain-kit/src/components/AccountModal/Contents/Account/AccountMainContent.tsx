import {
    Container,
    Image,
    ModalBody,
    ModalCloseButton,
    ModalFooter,
    ModalHeader,
    VStack,
    useColorMode,
} from '@chakra-ui/react';
import { useWallet } from '@/hooks';
import {
    FadeInViewFromBottom,
    StickyHeaderContainer,
    VersionFooter,
    ModalFAQButton,
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

type Props = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
    onClose: () => void;
    wallet: Wallet;
};

export const AccountMainContent = ({ setCurrentContent, wallet }: Props) => {
    const { t } = useTranslation();
    const { colorMode } = useColorMode();
    const isDark = colorMode === 'dark';

    const { smartAccount } = useWallet();

    return (
        <FadeInViewFromBottom>
            <StickyHeaderContainer>
                <ModalFAQButton onClick={() => setCurrentContent('faq')} />
                <ModalHeader
                    w={'full'}
                    fontSize={'md'}
                    fontWeight={'500'}
                    textAlign={'center'}
                    color={isDark ? '#dfdfdd' : '#4d4d4d'}
                >
                    {t('Account')}
                </ModalHeader>

                <ModalCloseButton />
            </StickyHeaderContainer>

            <FadeInViewFromBottom>
                <VStack justify={'center'}>
                    <Image
                        src={wallet?.image}
                        maxW={'100px'}
                        mt={5}
                        mb={5}
                        borderRadius="full"
                        objectFit="cover"
                    />
                </VStack>
            </FadeInViewFromBottom>

            <FadeInViewFromBottom>
                <Container maxW={'container.lg'}>
                    <ModalBody w={'full'}>
                        <VStack w={'full'} overflow={'hidden'}>
                            <AccountSelector
                                mt={0}
                                onClick={() => {
                                    if (smartAccount.isActive) {
                                        setCurrentContent('accounts');
                                    } else {
                                        setCurrentContent('settings');
                                    }
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
            </FadeInViewFromBottom>
        </FadeInViewFromBottom>
    );
};
