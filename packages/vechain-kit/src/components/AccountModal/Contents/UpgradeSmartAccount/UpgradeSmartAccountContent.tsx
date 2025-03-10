import {
    ModalHeader,
    ModalBody,
    ModalFooter,
    Text,
    VStack,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Box,
    ModalCloseButton,
    Button,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { IoWarningOutline } from 'react-icons/io5';
import { useVeChainKitConfig } from '@/providers';
import {
    StickyHeaderContainer,
    TransactionButtonAndStatus,
} from '@/components/common';
import { AccountModalContentTypes } from '../../Types';
import { useUpgradeRequired, useUpgradeSmartAccount, useWallet } from '@/hooks';

type Props = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
    handleClose: () => void;
};

export const UpgradeSmartAccountContent = ({
    setCurrentContent,
    handleClose,
}: Props) => {
    const { t } = useTranslation();
    const { darkMode: isDark } = useVeChainKitConfig();
    const { smartAccount, connectedWallet } = useWallet();
    const { data: upgradeRequired } = useUpgradeRequired(
        smartAccount?.address ?? '',
        connectedWallet?.address ?? '',
        3,
    );

    // Set up the upgrade transaction
    const {
        sendTransaction: upgradeSmartAccount,
        isTransactionPending,
        isWaitingForWalletConfirmation,
        error: upgradeError,
        txReceipt,
    } = useUpgradeSmartAccount({
        smartAccountAddress: smartAccount?.address ?? '',
        targetVersion: 3,
        onSuccess: () => {
            setCurrentContent({
                type: 'successful-operation',
                props: {
                    setCurrentContent,
                    txId: txReceipt?.meta.txID,
                    title: t('Upgrade Successful!'),
                    description: t(
                        'Your account has been successfully upgraded to the latest version. You can now enjoy a better user experience, lower gas costs, and enhanced security.',
                    ),
                    onDone: () => {
                        handleClose();
                    },
                    showSocialButtons: false,
                },
            });
        },
        onError: () => {
            console.error('Error upgrading Smart Account');
        },
    });

    // Handle the upgrade process
    const handleUpgrade = async () => {
        try {
            await upgradeSmartAccount();
        } catch (err) {
            console.error('Failed to upgrade Smart Account:', err);
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
                    {t('Account upgrade required')}
                </ModalHeader>
                <ModalCloseButton />
            </StickyHeaderContainer>

            <ModalBody>
                <VStack spacing={6} align="stretch">
                    <Text fontSize="sm" textAlign="center">
                        {upgradeRequired
                            ? t(
                                  'Your smart account needs to be upgraded to the latest version (v3).',
                              )
                            : t(
                                  'Your smart account is already upgraded to this version.',
                              )}
                    </Text>

                    <Alert status="info" borderRadius="md">
                        <AlertIcon />
                        <Box>
                            <AlertTitle fontSize="sm">
                                {t('Benefits of this upgrade:')}
                            </AlertTitle>
                            <AlertDescription fontSize="xs">
                                <VStack align="start" spacing={0} mt={1}>
                                    <Text fontSize="xs" lineHeight="1.2">
                                        • {t('Improved security features')}
                                    </Text>
                                    <Text fontSize="xs">
                                        • {t('Better transaction handling')}
                                    </Text>
                                    <Text fontSize="xs">
                                        •{' '}
                                        {t('Enhanced compatibility with dApps')}
                                    </Text>
                                    <Text fontSize="xs">
                                        •{' '}
                                        {t('Reduced gas costs for operations')}
                                    </Text>
                                </VStack>
                            </AlertDescription>
                        </Box>
                    </Alert>

                    <Alert status="warning" borderRadius="md">
                        <AlertIcon as={IoWarningOutline} />
                        <Box>
                            <AlertTitle fontSize="sm">
                                {t('Important')}
                            </AlertTitle>
                            <AlertDescription
                                fontSize="xs"
                                lineHeight="17px"
                                display="block"
                            >
                                {t(
                                    'This upgrade is necessary to continue interacting with VeChain blockchain. Please complete it now.',
                                )}
                            </AlertDescription>
                        </Box>
                    </Alert>
                </VStack>
            </ModalBody>

            <ModalFooter justifyContent="center">
                <VStack spacing={3} w="full">
                    <TransactionButtonAndStatus
                        buttonText={
                            upgradeRequired
                                ? t('Upgrade account')
                                : t('Account already upgraded')
                        }
                        onConfirm={handleUpgrade}
                        isTxWaitingConfirmation={isWaitingForWalletConfirmation}
                        isSubmitting={isTransactionPending}
                        transactionPendingText={t('Upgrading...')}
                        txReceipt={txReceipt}
                        transactionError={upgradeError}
                        isDisabled={!upgradeRequired}
                    />

                    <Button
                        mt={2}
                        variant={'link'}
                        onClick={handleClose}
                        isDisabled={isTransactionPending}
                    >
                        {upgradeRequired
                            ? t('Close and do this later')
                            : t('Close')}
                    </Button>
                </VStack>
            </ModalFooter>
        </>
    );
};
