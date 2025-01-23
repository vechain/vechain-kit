import {
    Image,
    ModalBody,
    ModalCloseButton,
    VStack,
    ModalFooter,
    ModalHeader,
} from '@chakra-ui/react';
import { useWallet } from '@/hooks';
import React from 'react';
import {
    AddressDisplay,
    ModalBackButton,
    StickyHeaderContainer,
} from '@/components/common';
import { AccountModalContentTypes } from '../../Types';
import { getPicassoImage } from '@/utils';
import { ActionButton } from '@/components';
import { MdOutlineNavigateNext } from 'react-icons/md';
import { FaRegAddressCard } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useVeChainKitConfig } from '@/providers';

type Props = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
};

export const SmartAccountContent = ({ setCurrentContent }: Props) => {
    const { t } = useTranslation();

    const { smartAccount } = useWallet();

    const walletImage = getPicassoImage(smartAccount.address ?? '');

    const { darkMode: isDark } = useVeChainKitConfig();

    const hasExistingDomain = !!smartAccount.domain;

    return (
        <>
            <StickyHeaderContainer>
                <ModalHeader
                    fontSize={'md'}
                    fontWeight={'500'}
                    textAlign={'center'}
                    color={isDark ? '#dfdfdd' : '#4d4d4d'}
                >
                    {t('Smart Account')}
                </ModalHeader>

                <ModalBackButton
                    onClick={() => setCurrentContent('accounts')}
                />
                <ModalCloseButton />
            </StickyHeaderContainer>

            <ModalBody w={'full'}>
                <VStack justify={'center'}>
                    <Image
                        src={walletImage}
                        maxW={'100px'}
                        borderRadius="50%"
                    />
                    <AddressDisplay wallet={smartAccount} />
                </VStack>

                <VStack mt={10} spacing={3}>
                    {/* <ActionButton
                            title="Transfer ownership"
                            description="Change the owner of your smart account."
                            onClick={() => {
                                exportWallet();
                            }}
                            leftIcon={FaUserEdit}
                            rightIcon={MdOutlineNavigateNext}
                        /> */}

                    <ActionButton
                        title={
                            hasExistingDomain
                                ? t('Change account name')
                                : t('Choose account name')
                        }
                        description={t(
                            'Give a nickname to your wallet to easily identify it.',
                        )}
                        onClick={() => {
                            if (hasExistingDomain) {
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
                        leftIcon={FaRegAddressCard}
                        rightIcon={MdOutlineNavigateNext}
                    />
                </VStack>
            </ModalBody>
            <ModalFooter></ModalFooter>
        </>
    );
};
