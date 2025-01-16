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
import { usePrivy, useWallet } from '@/hooks';
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
import { FaRegAddressCard, FaUserEdit } from 'react-icons/fa';

type Props = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
};

export const SmartAccountContent = ({ setCurrentContent }: Props) => {
    const { smartAccount, connection } = useWallet();
    const { exportWallet } = usePrivy();

    const walletImage = getPicassoImage(smartAccount.address ?? '');

    const { colorMode } = useColorMode();
    const isDark = colorMode === 'dark';

    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <FadeInViewFromBottom>
            <StickyHeaderContainer>
                <ModalHeader
                    fontSize={'md'}
                    fontWeight={'500'}
                    textAlign={'center'}
                    color={isDark ? '#dfdfdd' : '#4d4d4d'}
                >
                    {'Smart Account'}
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
                            Your smart account is your gateway to blockchain
                            interactions.
                        </Text>

                        {isExpanded && (
                            <FadeInViewFromBottom>
                                <VStack>
                                    {connection.isConnectedWithPrivy && (
                                        <Text fontSize={'sm'} opacity={0.5}>
                                            You're using an Embedded Wallet
                                            secured by your social login method,
                                            which acts as a master controller of
                                            your smart account, ensuring a
                                            seamless VeChain experience with
                                            full ownership and control.
                                        </Text>
                                    )}

                                    <Text fontSize={'sm'} opacity={0.5}>
                                        Transfer the ownership of your Smart
                                        Account to make your main wallet active
                                        again.
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
                            {isExpanded ? 'Read less' : 'Read more'}
                        </Link>
                    </VStack>

                    <VStack mt={10} spacing={5}>
                        <ActionButton
                            title="Transfer ownership"
                            description="Change the owner of your smart account."
                            onClick={() => {
                                exportWallet();
                            }}
                            leftIcon={FaUserEdit}
                            rightIcon={MdOutlineNavigateNext}
                        />

                        <ActionButton
                            title="Manage account name"
                            description="Give a nickname to your wallet address to easily identify it."
                            onClick={() => {
                                // linkPasskey();
                            }}
                            showComingSoon={true}
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
