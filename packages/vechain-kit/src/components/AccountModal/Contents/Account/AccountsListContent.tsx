import {
    Alert,
    AlertDescription,
    AlertIcon,
    Button,
    Grid,
    ModalBody,
    ModalCloseButton,
    ModalFooter,
    ModalHeader,
    useColorMode,
    VStack,
} from '@chakra-ui/react';
import { useWallet } from '@/hooks';
import {
    FadeInViewFromBottom,
    ModalBackButton,
    StickyHeaderContainer,
} from '@/components/common';
import { AccountDetailsButton } from '@/components';
import { MdAccountCircle, MdOutlineNavigateNext } from 'react-icons/md';
import { AccountModalContentTypes } from '../../Types';
import { HiOutlineWallet } from 'react-icons/hi2';
import React from 'react';
import { RxExit } from 'react-icons/rx';
import { Wallet } from '@/types';

type Props = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
    onClose: () => void;
    wallet?: Wallet;
};

export const AccountsListContent = ({ setCurrentContent, onClose }: Props) => {
    const { colorMode } = useColorMode();
    const isDark = colorMode === 'dark';

    const { account, connectedWallet, disconnect, smartAccount } = useWallet();

    const hasActiveSmartAccount = smartAccount.isDeployed;

    return (
        <FadeInViewFromBottom>
            <StickyHeaderContainer>
                <ModalHeader
                    fontSize={'md'}
                    fontWeight={'500'}
                    textAlign={'center'}
                    color={isDark ? '#dfdfdd' : '#4d4d4d'}
                >
                    {'Your accounts'}
                </ModalHeader>
                <ModalBackButton onClick={() => setCurrentContent('main')} />
                <ModalCloseButton />
            </StickyHeaderContainer>
            <FadeInViewFromBottom>
                <ModalBody w={'full'}>
                    <VStack justify={'space-between'} w={'full'}>
                        {hasActiveSmartAccount && (
                            <Alert
                                status="info"
                                variant="subtle"
                                mb={4}
                                borderRadius={'lg'}
                            >
                                <AlertIcon />
                                <AlertDescription
                                    fontSize={'sm'}
                                    lineHeight={'1.2'}
                                >
                                    You own a Smart Account, which has
                                    precedence over your wallet and is set as
                                    active.
                                </AlertDescription>
                            </Alert>
                        )}
                        <Grid
                            gap={2}
                            templateColumns={['repeat(1, 1fr)']}
                            w="100%"
                            h="100%"
                        >
                            {hasActiveSmartAccount && (
                                <AccountDetailsButton
                                    title="Smart Account"
                                    address={account.address ?? ''}
                                    isActive
                                    onClick={() => {
                                        setCurrentContent('smart-account');
                                    }}
                                    leftIcon={MdAccountCircle}
                                    rightIcon={MdOutlineNavigateNext}
                                />
                            )}
                            <AccountDetailsButton
                                title="Wallet"
                                address={connectedWallet?.address ?? ''}
                                onClick={() => {
                                    setCurrentContent('settings');
                                }}
                                leftIcon={HiOutlineWallet}
                                rightIcon={MdOutlineNavigateNext}
                            />
                        </Grid>
                    </VStack>
                </ModalBody>
                <ModalFooter>
                    <Button
                        onClick={() => {
                            disconnect();
                            onClose();
                        }}
                        fontSize={'sm'}
                        fontWeight={'400'}
                        px={4}
                        width="full"
                        height="60px"
                        variant="solid"
                        borderRadius="xl"
                        leftIcon={<RxExit color="#888888" />}
                    >
                        Logout
                    </Button>
                </ModalFooter>
            </FadeInViewFromBottom>
        </FadeInViewFromBottom>
    );
};
