import {
    Container,
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    VStack,
    Text,
    useColorMode,
    ModalFooter,
} from '@chakra-ui/react';
import { QRCode } from 'react-qrcode-logo';
import {
    FadeInViewFromBottom,
    ModalBackButton,
    StickyHeaderContainer,
    AddressDisplay,
} from '@/components/common';
import { AccountModalContentTypes } from '../../Types';
import { useWallet } from '@/hooks';

type Props = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
};

export const ReceiveTokenContent = ({ setCurrentContent }: Props) => {
    const { colorMode } = useColorMode();
    const isDark = colorMode === 'dark';
    const { account } = useWallet();

    return (
        <FadeInViewFromBottom>
            <StickyHeaderContainer>
                <ModalHeader
                    fontSize={'md'}
                    fontWeight={'500'}
                    textAlign={'center'}
                    color={isDark ? '#dfdfdd' : '#4d4d4d'}
                >
                    Receive
                </ModalHeader>
                <ModalBackButton onClick={() => setCurrentContent('main')} />
                <ModalCloseButton />
            </StickyHeaderContainer>

            <FadeInViewFromBottom>
                <Container maxW={'container.lg'}>
                    <ModalBody>
                        <VStack spacing={6} align="center" w="full">
                            <AddressDisplay wallet={account} size="lg" />
                            <QRCode
                                value={account.address ?? ''}
                                size={200}
                                removeQrCodeBehindLogo={true}
                                eyeRadius={4}
                                logoPaddingStyle={'circle'}
                                style={{
                                    borderRadius: '16px',
                                }}
                            />

                            <Text fontSize="sm" textAlign="center">
                                Copy your address or scan this QR code
                            </Text>

                            <Text
                                fontSize="xs"
                                textAlign="center"
                                opacity={0.5}
                            >
                                This address only supports VeChain assets.
                            </Text>
                        </VStack>
                    </ModalBody>
                    <ModalFooter></ModalFooter>
                </Container>
            </FadeInViewFromBottom>
        </FadeInViewFromBottom>
    );
};
