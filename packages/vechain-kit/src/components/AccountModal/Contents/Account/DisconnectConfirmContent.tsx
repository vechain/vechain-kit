import {
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    VStack,
    Button,
    Text,
    ModalFooter,
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
};

export const DisconnectConfirmContent = ({
    onDisconnect,
    onBack,
    onClose,
}: DisconnectConfirmContentProps) => {
    const { t } = useTranslation();

    return (
        <ScrollToTopWrapper>
            <StickyHeaderContainer>
                <ModalHeader>{t('Logout')}</ModalHeader>
                <ModalBackButton onClick={onBack} />
                <ModalCloseButton onClick={onClose} />
            </StickyHeaderContainer>

            <ModalBody>
                <VStack spacing={6} align="stretch">
                    <Text fontSize="md" textAlign="center">
                        {t('Are you sure you want to disconnect your wallet?')}
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
