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
    IconButton,
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
import { compareAddresses } from '@/utils';
import { useSmartAccountAlert } from '@/hooks';
import { IoCloseCircle } from 'react-icons/io5';
import { useTranslation } from 'react-i18next';
import { useCrossAppConnectionCache } from '@/hooks';

type Props = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
    onClose: () => void;
    wallet?: Wallet;
};

export const AccountsListContent = ({ setCurrentContent, onClose }: Props) => {
    const { t } = useTranslation();
    const { colorMode } = useColorMode();
    const isDark = colorMode === 'dark';

    const { account, connectedWallet, disconnect, smartAccount, connection } =
        useWallet();
    const { isAlertVisible, hideAlert } = useSmartAccountAlert();

    const activeWalletIsSmartAccount = compareAddresses(
        smartAccount?.address ?? '',
        account?.address ?? '',
    );

    const { getConnectionCache } = useCrossAppConnectionCache();
    const connectionCache = getConnectionCache();

    return (
        <FadeInViewFromBottom>
            <StickyHeaderContainer>
                <ModalHeader
                    fontSize={'md'}
                    fontWeight={'500'}
                    textAlign={'center'}
                    color={isDark ? '#dfdfdd' : '#4d4d4d'}
                >
                    {t('Your accounts')}
                </ModalHeader>
                <ModalBackButton onClick={() => setCurrentContent('main')} />
                <ModalCloseButton />
            </StickyHeaderContainer>
            <FadeInViewFromBottom>
                <ModalBody w={'full'}>
                    <VStack justify={'space-between'} w={'full'}>
                        {activeWalletIsSmartAccount && isAlertVisible && (
                            <Alert
                                status="info"
                                variant="subtle"
                                mb={4}
                                borderRadius={'lg'}
                                pr={8}
                                position="relative"
                            >
                                <AlertIcon boxSize={'16px'} />
                                <AlertDescription
                                    fontSize={'xs'}
                                    lineHeight={'1.2'}
                                >
                                    {t(
                                        'You own a Smart Account and it has priority over your wallet.',
                                    )}
                                </AlertDescription>
                                <IconButton
                                    position="absolute"
                                    right={1}
                                    top={1}
                                    size="sm"
                                    variant="ghost"
                                    icon={<IoCloseCircle />}
                                    onClick={hideAlert}
                                    aria-label="Close alert"
                                />
                            </Alert>
                        )}
                        <Grid
                            gap={2}
                            templateColumns={['repeat(1, 1fr)']}
                            w="100%"
                            h="100%"
                        >
                            {activeWalletIsSmartAccount && (
                                <AccountDetailsButton
                                    title={t('Smart Account')}
                                    wallet={smartAccount as Wallet}
                                    isActive={activeWalletIsSmartAccount}
                                    onClick={() => {
                                        setCurrentContent('smart-account');
                                    }}
                                    leftIcon={MdAccountCircle}
                                    rightIcon={MdOutlineNavigateNext}
                                />
                            )}
                            <AccountDetailsButton
                                title={
                                    connection.isConnectedWithCrossApp &&
                                    connectionCache
                                        ? connectionCache.ecosystemApp.name +
                                          ' ' +
                                          t('Wallet')
                                        : connection.isConnectedWithSocialLogin
                                        ? t('Embedded Wallet')
                                        : t('Wallet')
                                }
                                wallet={connectedWallet}
                                isActive={!activeWalletIsSmartAccount}
                                onClick={() => {
                                    setCurrentContent('settings');
                                }}
                                leftImage={
                                    connection.isConnectedWithCrossApp &&
                                    connectionCache?.ecosystemApp?.logoUrl
                                        ? connectionCache.ecosystemApp?.logoUrl
                                        : undefined
                                }
                                leftIcon={
                                    !connection.isConnectedWithCrossApp ||
                                    !connectionCache?.ecosystemApp?.logoUrl
                                        ? HiOutlineWallet
                                        : undefined
                                }
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
                        variant="secondary"
                        leftIcon={<RxExit color="#888888" />}
                    >
                        {t('Logout')}
                    </Button>
                </ModalFooter>
            </FadeInViewFromBottom>
        </FadeInViewFromBottom>
    );
};
