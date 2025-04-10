import {
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    VStack,
    Text,
    Button,
    Icon,
    ModalFooter,
} from '@chakra-ui/react';
import { ModalBackButton, StickyHeaderContainer } from '@/components/common';
import { AccountModalContentTypes } from '../../Types';
import { FaRegAddressCard } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useVeChainKitConfig } from '@/providers';
import { Analytics } from '@/utils/mixpanelClientInstance';

export type ChooseNameContentProps = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
    onBack?: () => void;
    initialContentSource?: AccountModalContentTypes;
};

export const ChooseNameContent = ({
    setCurrentContent,
    onBack = () => setCurrentContent('settings'),
    initialContentSource = 'settings',
}: ChooseNameContentProps) => {
    const { t } = useTranslation();
    const { darkMode: isDark } = useVeChainKitConfig();

    const handleClose = () => {
        Analytics.nameSelection.dropOff('search', {
            isError: false,
            name: '',
            reason: 'modal_closed',
        });
    };

    const handleBack = () => {
        Analytics.nameSelection.dropOff('search', {
            isError: false,
            name: '',
            reason: 'back_button',
        });
        onBack();
    };

    return (
        <>
            <StickyHeaderContainer>
                <ModalHeader data-testid='modal-title'>{t('Choose your account name')}</ModalHeader>
                <ModalBackButton onClick={handleBack} />
                <ModalCloseButton onClick={handleClose} />
            </StickyHeaderContainer>

            <ModalBody>
                <VStack spacing={6} align="center" py={8}>
                    <Icon
                        as={FaRegAddressCard}
                        boxSize={16}
                        opacity={0.5}
                        color={isDark ? 'whiteAlpha.800' : 'gray.600'}
                    />
                    <VStack spacing={2}>
                        <Text fontSize="lg" fontWeight="500" textAlign="center">
                            {t('Finally say goodbye to 0x addresses')}
                        </Text>
                        <Text
                            fontSize="md"
                            opacity={0.7}
                            textAlign="center"
                            px={4}
                        >
                            {t(
                                'Name your account to make it easier to exchange assets',
                            )}
                        </Text>
                    </VStack>
                </VStack>
            </ModalBody>
            <ModalFooter>
                <Button
                    variant="vechainKitPrimary"
                    onClick={() =>
                        setCurrentContent({
                            type: 'choose-name-search',
                            props: {
                                name: '',
                                setCurrentContent: setCurrentContent,
                                initialContentSource,
                            },
                        })
                    }
                    data-testid="choose-name-button"
                >
                    {t('Choose name')}
                </Button>
            </ModalFooter>
        </>
    );
};
