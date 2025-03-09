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
import { useVeChainKitConfig } from '@/providers';

export type DisconnectConfirmContentProps = {
    onDisconnect: () => void;
    onBack: () => void;
};

export const DisconnectConfirmContent = ({
    onDisconnect,
    onBack,
}: DisconnectConfirmContentProps) => {
    const { t } = useTranslation();
    const { darkMode: isDark } = useVeChainKitConfig();

    return (
        <ScrollToTopWrapper>
            <StickyHeaderContainer>
                <ModalHeader
                    fontSize={'md'}
                    fontWeight={'500'}
                    textAlign={'center'}
                    color={isDark ? '#dfdfdd' : '#4d4d4d'}
                >
                    {t('Disconnect Wallet')}
                </ModalHeader>
                <ModalBackButton onClick={onBack} />
                <ModalCloseButton />
            </StickyHeaderContainer>

            <ModalBody>
                <VStack spacing={6} align="stretch">
                    <Text fontSize="md" textAlign="center">
                        {t('Are you sure you want to disconnect your wallet?')}
                    </Text>

                    <VStack spacing={3} w="full">
                        <Button
                            height="60px"
                            colorScheme="red"
                            w="full"
                            onClick={onDisconnect}
                        >
                            {t('Disconnect')}
                        </Button>
                        <Button variant="vechainKitSecondary" onClick={onBack}>
                            {t('Cancel')}
                        </Button>
                    </VStack>
                </VStack>
            </ModalBody>
            <ModalFooter></ModalFooter>
        </ScrollToTopWrapper>
    );
};
