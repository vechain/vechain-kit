import {
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    VStack,
    Text,
    useColorMode,
    Button,
    Icon,
} from '@chakra-ui/react';
import {
    FadeInViewFromBottom,
    ModalBackButton,
    StickyHeaderContainer,
} from '@/components/common';
import { AccountModalContentTypes } from '../../Types';
import { FaRegAddressCard } from 'react-icons/fa';
import { useWallet } from '@/hooks';
import { useTranslation } from 'react-i18next';

type Props = {
    setCurrentContent: (content: AccountModalContentTypes) => void;
};

export const ChooseNameContent = ({ setCurrentContent }: Props) => {
    const { t } = useTranslation();
    const { smartAccount, connection } = useWallet();
    const { colorMode } = useColorMode();
    const isDark = colorMode === 'dark';

    return (
        <FadeInViewFromBottom>
            <StickyHeaderContainer>
                <ModalHeader
                    fontSize={'md'}
                    fontWeight={'500'}
                    textAlign={'center'}
                    color={isDark ? '#dfdfdd' : '#4d4d4d'}
                >
                    {t('Choose your account name')}
                </ModalHeader>
                <ModalBackButton
                    onClick={() =>
                        smartAccount.isActive
                            ? setCurrentContent('smart-account')
                            : connection.isConnectedWithDappKit
                            ? setCurrentContent('settings')
                            : setCurrentContent('accounts')
                    }
                />
                <ModalCloseButton />
            </StickyHeaderContainer>

            <FadeInViewFromBottom>
                <ModalBody>
                    <VStack spacing={6} align="center" py={8}>
                        <Icon
                            as={FaRegAddressCard}
                            boxSize={16}
                            opacity={0.5}
                            color={isDark ? 'whiteAlpha.800' : 'gray.600'}
                        />
                        <VStack spacing={2}>
                            <Text
                                fontSize="lg"
                                fontWeight="500"
                                textAlign="center"
                            >
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

                        <Button
                            variant="primary"
                            onClick={() =>
                                setCurrentContent({
                                    type: 'choose-name-search',
                                    props: {
                                        name: '',
                                        setCurrentContent: setCurrentContent,
                                    },
                                })
                            }
                        >
                            {t('Choose name')}
                        </Button>
                    </VStack>
                </ModalBody>
            </FadeInViewFromBottom>
        </FadeInViewFromBottom>
    );
};
