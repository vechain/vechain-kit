import {
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    VStack,
    Text,
    Button,
    Icon,
    ModalFooter,
    useToken,
} from '@chakra-ui/react';
import { ModalBackButton, StickyHeaderContainer } from '../../../common';
import { AccountModalContentTypes } from '../../Types';
import { LuSquareUser } from 'react-icons/lu';
import { useTranslation } from 'react-i18next';
import { useAccountModalOptions } from '../../../../hooks/modals/useAccountModalOptions';

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

    const { isolatedView } = useAccountModalOptions();

    const textColor = useToken('colors', 'vechain-kit-text-primary');
    const secondaryTextColor = useToken('colors', 'vechain-kit-text-secondary');

    const handleBack = () => {
        onBack();
    };

    return (
        <>
            <StickyHeaderContainer>
                <ModalHeader data-testid="modal-title">
                    {t('Choose your account name')}
                </ModalHeader>
                {!isolatedView && <ModalBackButton onClick={handleBack} />}
                <ModalCloseButton />
            </StickyHeaderContainer>

            <ModalBody>
                <VStack spacing={6} align="center" py={8}>
                    <Icon
                        as={LuSquareUser}
                        boxSize={16}
                        color={secondaryTextColor}
                    />
                    <VStack spacing={2}>
                        <Text
                            fontSize="lg"
                            fontWeight="500"
                            textAlign="center"
                            color={textColor}
                        >
                            {t('Finally say goodbye to 0x addresses')}
                        </Text>
                        <Text
                            fontSize="md"
                            color={secondaryTextColor}
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
