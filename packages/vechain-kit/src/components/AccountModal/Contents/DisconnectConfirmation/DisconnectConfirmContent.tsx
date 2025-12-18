import {
    ModalBody,
    ModalHeader,
    VStack,
    Button,
    Text,
    useToken,
    Icon,
    ModalFooter,
} from '@chakra-ui/react';
import {
    ModalBackButton,
    StickyHeaderContainer,
    ModalCloseButton,
} from '@/components/common';
import { useTranslation } from 'react-i18next';
import { LuLogOut } from 'react-icons/lu';

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
        <>
            <StickyHeaderContainer>
                <ModalHeader>{t('Logout')}</ModalHeader>
                <ModalBackButton onClick={onBack} />
                {showCloseButton ? (
                    <ModalCloseButton onClick={onClose} />
                ) : null}
            </StickyHeaderContainer>

            <ModalBody>
                <VStack spacing={6} align="center" mt={10}>
                    <Icon
                        as={LuLogOut}
                        color={'#ef4444'}
                        fontSize={'60px'}
                        opacity={0.5}
                    />
                    <Text fontSize="md" textAlign="center" color={textPrimary}>
                        {textTitle}
                    </Text>
                </VStack>
            </ModalBody>
            <ModalFooter w="full" mt={4}>
                <VStack spacing={3} w="full">
                    <Button
                        onClick={onDisconnect}
                        data-testid="disconnect-button"
                        variant="vechainKitLogout"
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
        </>
    );
};
