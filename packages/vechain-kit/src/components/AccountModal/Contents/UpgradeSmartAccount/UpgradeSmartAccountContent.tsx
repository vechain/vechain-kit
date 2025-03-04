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
import { useUpgradeSmartAccount } from '@/hooks';

type Props = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
    handleClose: () => void;
    smartAccountAddress: string;
};

export const UpgradeSmartAccountContent = ({
    setCurrentContent,
    handleClose,
    smartAccountAddress,
}: Props) => {
    const { t } = useTranslation();
    const { darkMode: isDark } = useVeChainKitConfig();

    // Set up the upgrade transaction
    const {
        sendTransaction: upgradeSmartAccount,
        isTransactionPending,
        isWaitingForWalletConfirmation,
        error: upgradeError,
        txReceipt,
    } = useUpgradeSmartAccount({
        smartAccountAddress,
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
                    <Text fontSize="md" textAlign="center">
                        {t(
                            'Your smart account needs to be upgraded to the latest version (v3).',
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

                    <Alert
                        status="warning"
                        variant="subtle"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        textAlign="center"
                        borderRadius="lg"
                        py={4}
                    >
                        <Box>
                            <AlertIcon
                                boxSize="24px"
                                mr={0}
                                as={IoWarningOutline}
                            />
                            <AlertTitle mt={4} mb={1} fontSize="lg">
                                {t('Important')}
                            </AlertTitle>
                            <AlertDescription maxWidth="sm">
                                {t(
                                    'This upgrade is necessary to continue interacting with VeChain blockchain. Please complete it now.',
                                )}
                            </AlertDescription>
                        </Box>
                    </Alert>
                </VStack>
            </ModalBody>

            <ModalFooter justifyContent="center">
                <TransactionButtonAndStatus
                    buttonText={t('Upgrade account')}
                    onConfirm={handleUpgrade}
                    isTxWaitingConfirmation={isWaitingForWalletConfirmation}
                    isSubmitting={isTransactionPending}
                    transactionPendingText={t('Upgrading...')}
                    txReceipt={txReceipt}
                    transactionError={upgradeError}
                />

                <Button mt={5} variant={'link'} onClick={handleClose}>
                    {t('Close and do this later')}
                </Button>
            </ModalFooter>
        </>
    );
};
