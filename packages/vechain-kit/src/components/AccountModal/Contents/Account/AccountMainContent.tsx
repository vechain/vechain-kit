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
} from '@/components/common';
import { AccountModalContentTypes } from '../../Types';
import {
    AccountSelector,
    AssetsSection,
    BalanceSection,
    QuickActionsSection,
} from '@/components';
import { Wallet } from '@/types';

type Props = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
    onClose: () => void;
    wallet: Wallet;
};

export const AccountMainContent = ({ setCurrentContent, wallet }: Props) => {
    const { colorMode } = useColorMode();
    const isDark = colorMode === 'dark';

    const { smartAccount } = useWallet();

    return (
        <FadeInViewFromBottom>
            <StickyHeaderContainer>
                <ModalHeader
                    w={'full'}
                    fontSize={'md'}
                    fontWeight={'500'}
                    textAlign={'center'}
                    color={isDark ? '#dfdfdd' : '#4d4d4d'}
                >
                    {'Account'}
                </ModalHeader>
                <ModalCloseButton />
            </StickyHeaderContainer>

            <FadeInViewFromBottom>
                <VStack justify={'center'}>
                    <Image
                        src={wallet.image}
                        w="120px"
                        h="120px"
                        mt={10}
                        mb={5}
                        borderRadius="full"
                        objectFit="cover"
                    />
                </VStack>
            </FadeInViewFromBottom>

            <FadeInViewFromBottom>
                <Container maxW={'container.lg'}>
                    <ModalBody w={'full'}>
                        <VStack w={'full'} spacing={3} overflow={'hidden'}>
                            <AccountSelector
                                onClick={() => {
                                    if (smartAccount.isActive) {
                                        setCurrentContent('accounts');
                                    } else {
                                        setCurrentContent('settings');
                                    }
                                }}
                                wallet={wallet}
                            />
                            <BalanceSection mb={4} />
                            <QuickActionsSection
                                setCurrentContent={setCurrentContent}
                            />
                            <AssetsSection />
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
