import {
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    VStack,
    Button,
    Text,
    ModalFooter,
    useToken,
} from '@chakra-ui/react';
import {
    ModalBackButton,
    ScrollToTopWrapper,
    StickyHeaderContainer,
} from '@/components/common';
import { useTranslation } from 'react-i18next';

export type DisconnectConfirmContentProps = {
    onDisconnect: () => void;
    onBack: () => void;
    onClose?: () => void;
    text?: string;
    showCloseButton?: boolean;
};

export const DisconnectConfirmContent = ({
    onDisconnect,
    onBack,
    onClose,
    showCloseButton = true,
    text,
}: DisconnectConfirmContentProps) => {
    const { t } = useTranslation();
    const textPrimary = useToken('colors', 'vechain-kit-text-primary');
    const textTitle =
        text ?? t('Are you sure you want to disconnect your wallet?');
    return (
        <ScrollToTopWrapper>
            <StickyHeaderContainer>
                <ModalHeader>{t('Logout')}</ModalHeader>
                <ModalBackButton onClick={onBack} />
                {showCloseButton ? (
                    <ModalCloseButton onClick={onClose} />
                ) : null}
            </StickyHeaderContainer>

            <ModalBody>
                <VStack spacing={6} align="stretch">
                    <Text fontSize="md" textAlign="center" color={textPrimary}>
                        {textTitle}
                    </Text>
                </VStack>
            </ModalBody>
            <ModalFooter w="full">
                <VStack spacing={3} w="full">
                    <Button
                        height="60px"
                        colorScheme="red"
                        w="full"
                        onClick={onDisconnect}
                        data-testid="disconnect-button"
                    >
                        {t('Confirm')}
                    </Button>
                    <Button
                        variant="vechainKitSecondary"
                        onClick={onBack}
                        data-testid="cancel-logout-button"
                    >
                        {t('Cancel')}
                    </Button>
                </VStack>
            </ModalFooter>
        </ScrollToTopWrapper>
    );
};
