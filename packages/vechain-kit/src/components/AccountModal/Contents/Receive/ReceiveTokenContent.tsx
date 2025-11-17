import {
    Container,
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    VStack,
    Text,
    ModalFooter,
} from '@chakra-ui/react';
import { QRCode } from 'react-qrcode-logo';
import {
    ModalBackButton,
    StickyHeaderContainer,
    AddressDisplay,
} from '@/components/common';
import { AccountModalContentTypes } from '../../Types';
import { useWallet } from '@/hooks';
import { useTranslation } from 'react-i18next';
import { useAccountModalOptions } from '@/hooks/modals/useAccountModalOptions';

type Props = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
};

export const ReceiveTokenContent = ({ setCurrentContent }: Props) => {
    const { t } = useTranslation();
    const { account } = useWallet();
    const { isolatedView } = useAccountModalOptions();

    return (
        <>
            <StickyHeaderContainer>
                <ModalHeader>{t('Receive')}</ModalHeader>
                {!isolatedView && (
                    <ModalBackButton
                        onClick={() => setCurrentContent('main')}
                    />
                )}
                <ModalCloseButton />
            </StickyHeaderContainer>

            <Container maxW={'container.lg'}>
                <ModalBody>
                    <VStack spacing={4} align="center" w="full">
                        <QRCode
                            value={account?.address ?? ''}
                            size={200}
                            removeQrCodeBehindLogo={true}
                            eyeRadius={4}
                            logoPaddingStyle={'circle'}
                            style={{
                                borderRadius: '16px',
                            }}
                        />

                        <AddressDisplay wallet={account} style={{ w: '85%' }} />

                        <Text fontSize="sm" textAlign="center">
                            {t('Copy your address or scan this QR code')}
                        </Text>

                        <Text fontSize="xs" textAlign="center" opacity={0.5}>
                            {t('This address only supports VeChain assets.')}
                        </Text>
                    </VStack>
                </ModalBody>
                <ModalFooter pt={0} />
            </Container>
        </>
    );
};
