import {
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    VStack,
    Button,
    Text,
    useToken,
    Icon,
    ModalFooter,
} from '@chakra-ui/react';
import { ModalBackButton, StickyHeaderContainer } from '../../../common';
import { useTranslation } from 'react-i18next';
import { LuTrash2 } from 'react-icons/lu';
import { humanAddress, humanDomain } from '../../../../utils';
import { useWalletMetadata } from '../../../../hooks';
import { useVeChainKitConfig } from '../../../../providers';

export type RemoveWalletConfirmContentProps = {
    walletAddress: string;
    walletDomain: string | null; // Kept for backward compatibility but will be fetched dynamically
    onConfirm: () => void;
    onBack: () => void;
    onClose?: () => void;
};

export const RemoveWalletConfirmContent = ({
    walletAddress,
    walletDomain: _walletDomain,
    onConfirm,
    onBack,
    onClose,
}: RemoveWalletConfirmContentProps) => {
    const { t } = useTranslation();
    const { network } = useVeChainKitConfig();
    const { domain } = useWalletMetadata(walletAddress, network.type);
    const textPrimary = useToken('colors', 'vechain-kit-text-primary');

    const displayName = domain
        ? humanDomain(domain, 20, 0)
        : humanAddress(walletAddress, 6, 4);

    return (
        <>
            <StickyHeaderContainer>
                <ModalHeader>{t('Remove')}</ModalHeader>
                <ModalBackButton onClick={onBack} />
                {onClose && <ModalCloseButton onClick={onClose} />}
            </StickyHeaderContainer>

            <ModalBody>
                <VStack spacing={6} align="center" mt={10}>
                    <Icon
                        as={LuTrash2}
                        color={'#ef4444'}
                        fontSize={'60px'}
                        opacity={0.5}
                    />
                    <Text fontSize="md" textAlign="center" color={textPrimary}>
                        {t('Are you sure you want to remove this wallet?')}
                    </Text>
                    <Text
                        fontSize="sm"
                        textAlign="center"
                        color="vechain-kit-text-secondary"
                        fontWeight="600"
                    >
                        {displayName}
                    </Text>
                    <Text
                        fontSize="sm"
                        textAlign="center"
                        color="vechain-kit-text-secondary"
                    >
                        {humanAddress(walletAddress, 8, 7)}
                    </Text>
                </VStack>
            </ModalBody>
            <ModalFooter w="full" mt={4}>
                <VStack spacing={3} w="full">
                    <Button
                        onClick={onConfirm}
                        data-testid="remove-wallet-button"
                        variant="vechainKitLogout"
                    >
                        {t('Remove')}
                    </Button>
                    <Button
                        variant="vechainKitSecondary"
                        onClick={onBack}
                        data-testid="cancel-remove-button"
                    >
                        {t('Cancel')}
                    </Button>
                </VStack>
            </ModalFooter>
        </>
    );
};
