import {
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    VStack,
    Text,
    Button,
    Icon,
} from '@chakra-ui/react';
import { ModalBackButton, StickyHeaderContainer } from '@/components/common';
import { AccountModalContentTypes } from '../../Types';
import { FaRegAddressCard } from 'react-icons/fa';
import { useWallet } from '@/hooks';
import { useTranslation } from 'react-i18next';
import { useVeChainKitConfig } from '@/providers';

export type ChooseNameContentProps = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
};

export const ChooseNameContent = ({
    setCurrentContent,
}: ChooseNameContentProps) => {
    const { t } = useTranslation();
    const { smartAccount, connection } = useWallet();
    const { darkMode: isDark } = useVeChainKitConfig();

    return (
        <>
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

                    <Button
                        variant="vechainKitPrimary"
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
        </>
    );
};
