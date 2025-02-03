import {
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    VStack,
    Button,
    Image,
    Icon,
} from '@chakra-ui/react';
import { ModalBackButton, StickyHeaderContainer } from '@/components/common';
import { AccountModalContentTypes } from '../../Types';
import { useTranslation } from 'react-i18next';
import { useVeChainKitConfig } from '@/providers';
import { useWallet } from '@/hooks';
import { FaCamera } from 'react-icons/fa';
import { useRef } from 'react';
import { MdOutlineNavigateNext } from 'react-icons/md';
import { ActionButton } from '../../Components';
import { PiAddressBook } from 'react-icons/pi';

type Props = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
};

export const AccountCustomizationContent = ({ setCurrentContent }: Props) => {
    const { t } = useTranslation();
    const { darkMode: isDark } = useVeChainKitConfig();
    const { account } = useWallet();

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Implement image upload logic here
            // console.log('Image upload:', file);
        }
    };

    return (
        <>
            <StickyHeaderContainer>
                <ModalHeader
                    fontSize={'md'}
                    fontWeight={'500'}
                    textAlign={'center'}
                    color={isDark ? '#dfdfdd' : '#4d4d4d'}
                >
                    {t('Customize Account')}
                </ModalHeader>
                <ModalBackButton
                    onClick={() => setCurrentContent('settings')}
                />
                <ModalCloseButton />
            </StickyHeaderContainer>

            <ModalBody>
                <VStack spacing={6} align="center">
                    <VStack spacing={2} position="relative">
                        <Image
                            src={account?.image}
                            alt="Profile"
                            boxSize="120px"
                            borderRadius="full"
                        />
                        {account?.domain && (
                            <>
                                <Button
                                    size="sm"
                                    position="absolute"
                                    bottom="0"
                                    right="0"
                                    borderRadius="full"
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                >
                                    <Icon as={FaCamera} />
                                </Button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    hidden
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />
                            </>
                        )}
                    </VStack>

                    <ActionButton
                        title={
                            account?.domain
                                ? account?.domain
                                : t('Choose account name')
                        }
                        description={t(
                            'Choose a unique .vet domain name for your account',
                        )}
                        onClick={() => {
                            if (account?.domain) {
                                setCurrentContent({
                                    type: 'choose-name-search',
                                    props: {
                                        name: '',
                                        setCurrentContent,
                                    },
                                });
                            } else {
                                setCurrentContent('choose-name');
                            }
                        }}
                        leftIcon={PiAddressBook}
                        rightIcon={MdOutlineNavigateNext}
                    />
                </VStack>
            </ModalBody>
        </>
    );
};
