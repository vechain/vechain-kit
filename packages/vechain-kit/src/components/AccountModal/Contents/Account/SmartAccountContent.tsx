import {
    Image,
    ModalBody,
    ModalCloseButton,
    VStack,
    ModalFooter,
    ModalHeader,
    Text,
    useColorMode,
    Link,
} from '@chakra-ui/react';
import { useWallet } from '@/hooks';
import React, { useState } from 'react';
import {
    AddressDisplay,
    FadeInViewFromBottom,
    ModalBackButton,
    StickyHeaderContainer,
} from '@/components/common';
import { AccountModalContentTypes } from '../../Types';
import { getPicassoImage } from '@/utils';
import { ActionButton } from '@/components';
import { MdOutlineNavigateNext } from 'react-icons/md';
import { FaRegAddressCard } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

type Props = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
};

export const SmartAccountContent = ({ setCurrentContent }: Props) => {
    const { t } = useTranslation();

    const { smartAccount, connection } = useWallet();

    const walletImage = getPicassoImage(smartAccount.address ?? '');

    const { colorMode } = useColorMode();
    const isDark = colorMode === 'dark';

    const [isExpanded, setIsExpanded] = useState(false);

    const hasExistingDomain = !!smartAccount.domain;

    return (
        <FadeInViewFromBottom>
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

            <FadeInViewFromBottom>
                <ModalBody w={'full'}>
                    <VStack justify={'center'}>
                        <Image
                            src={walletImage}
                            maxW={'70px'}
                            borderRadius="50%"
                        />
                        <AddressDisplay wallet={smartAccount} />
                    </VStack>

                    <VStack align="stretch" textAlign={'center'} mt={5}>
                        <Text fontSize={'sm'} opacity={0.5}>
                            {t(
                                'Your smart account is your gateway to blockchain interactions.',
                            )}
                        </Text>

                        {isExpanded && (
                            <FadeInViewFromBottom>
                                <VStack>
                                    {connection.isConnectedWithSocialLogin && (
                                        <Text fontSize={'sm'} opacity={0.5}>
                                            {t(
                                                'You are using an Embedded Wallet secured by your social login method, which acts as a master controller of your smart account, ensuring a seamless VeChain experience with full ownership and control.',
                                            )}
                                        </Text>
                                    )}

                                    <Text fontSize={'sm'} opacity={0.5}>
                                        {t(
                                            'Transfer the ownership of your Smart Account to make your main wallet active again.',
                                        )}
                                    </Text>
                                </VStack>
                            </FadeInViewFromBottom>
                        )}

                        <Link
                            onClick={() => setIsExpanded(!isExpanded)}
                            color="gray.500"
                            fontSize={'sm'}
                            transition={'all 0.2s'}
                            _hover={{ textDecoration: 'none' }}
                        >
                            {isExpanded ? t('Read less') : t('Read more')}
                        </Link>
                    </VStack>

                    <VStack mt={10} spacing={5}>
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
            </FadeInViewFromBottom>
        </FadeInViewFromBottom>
    );
};
