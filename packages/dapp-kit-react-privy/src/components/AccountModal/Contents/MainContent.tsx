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
import { useWallet, Wallet } from '../../../hooks';
import { FadeInViewFromBottom, StickyHeaderContainer } from '../../common';
import { AccountModalContentTypes } from '../AccountModal';
import { AccountSelector, AssetsSection, BalanceSection } from '../Components';

type Props = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
    onClose: () => void;
    wallet: Wallet;
};

export const MainContent = ({ setCurrentContent, wallet }: Props) => {
    const { colorMode } = useColorMode();
    const isDark = colorMode === 'dark';

    const { connection } = useWallet();

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
            <VStack justify={'center'}>
                <Image
                    src={wallet.image}
                    w="120px"
                    h="120px"
                    m={10}
                    borderRadius="full"
                    objectFit="cover"
                />
            </VStack>

            <Container maxW={'container.lg'}>
                <ModalBody w={'full'}>
                    <VStack w={'full'} spacing={5} overflow={'hidden'}>
                        <AccountSelector
                            onClick={() => {
                                if (connection.isConnectedWithPrivy) {
                                    setCurrentContent('accounts');
                                } else {
                                    setCurrentContent('settings');
                                }
                            }}
                            wallet={wallet}
                        />

                        <BalanceSection />
                        <AssetsSection />
                    </VStack>
                </ModalBody>
                <ModalFooter></ModalFooter>
            </Container>
        </FadeInViewFromBottom>
    );
};
