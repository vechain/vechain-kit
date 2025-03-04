import {
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Text,
    VStack,
    Icon,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    useDisclosure,
    Box,
    Link,
    HStack,
    ModalCloseButton,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoWarningOutline } from 'react-icons/io5';
import {
    useWallet,
    useUpgradeSmartAccount,
    useAccountUpgradeRequired,
} from '@/hooks';
import { useVeChainKitConfig } from '@/providers';
import { BaseModal } from '../common/BaseModal';
import { StickyHeaderContainer, TransactionButtonAndStatus } from '../common';
import { motion } from 'framer-motion';
import { FcCheckmark } from 'react-icons/fc';
import { GoLinkExternal } from 'react-icons/go';
import { getConfig } from '@/config';

export const UpgradeSmartAccountModal = () => {
    const { t } = useTranslation();
    const { darkMode: isDark } = useVeChainKitConfig();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { connectedWallet, smartAccount } = useWallet();
    const [isTransactionSuccess, setIsTransactionSuccess] = useState(false);

    const { data: isAccountUpgradeRequired } = useAccountUpgradeRequired(
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
        resetStatus: resetUpgradeState,
    } = useUpgradeSmartAccount({
        smartAccountAddress: smartAccount?.address ?? '',
        targetVersion: 3,
        onSuccess: () => {
            setIsTransactionSuccess(true);
        },
        onError: () => {
            console.error('Error upgrading Smart Account');
        },
    });

    // Automatically open the modal when needed
    useEffect(() => {
        // If the modal is already open, don't open it again
        if (isOpen) {
            return;
        }

        // If the user is connected and the account needs to be upgraded, open the modal
        if (isAccountUpgradeRequired) {
            onOpen();
        }
    }, [isOpen, onOpen, isAccountUpgradeRequired]);

    // Handle the upgrade process
    const handleUpgrade = async () => {
        try {
            await upgradeSmartAccount();
        } catch (err) {
            console.error('Failed to upgrade Smart Account:', err);
        }
    };

    // Reset state if modal is closed
    const handleClose = () => {
        if (!isTransactionPending) {
            resetUpgradeState();
            onClose();
        }
    };

    const { network } = useVeChainKitConfig();
    const explorerUrl = getConfig(network.type).explorerUrl;

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={handleClose}
            isCloseable={true}
            isCentered
            blockScrollOnMount={true}
            allowExternalFocus={true}
        >
            <StickyHeaderContainer>
                <ModalHeader
                    fontSize={'md'}
                    fontWeight={'500'}
                    textAlign={'center'}
                    color={isDark ? '#dfdfdd' : '#4d4d4d'}
                >
                    {isTransactionSuccess
                        ? t('Upgrade Successful!')
                        : t('Smart Account Upgrade Required')}
                </ModalHeader>
                <ModalCloseButton onClick={handleClose} />
            </StickyHeaderContainer>

            <ModalBody>
                <VStack spacing={5} align="center">
                    {isTransactionSuccess ? (
                        <VStack align="center" p={6} spacing={3}>
                            <motion.div
                                transition={{
                                    duration: 4,
                                    ease: 'easeInOut',
                                    repeat: Infinity,
                                }}
                                animate={{
                                    scale: [1, 1.1, 1],
                                }}
                            >
                                <Icon as={FcCheckmark} fontSize="100px" />
                            </motion.div>
                        </VStack>
                    ) : (
                        <>
                            <Text textAlign="center" fontSize="sm">
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
                                        <VStack
                                            align="start"
                                            spacing={0}
                                            mt={1}
                                        >
                                            <Text
                                                fontSize="xs"
                                                lineHeight="1.2"
                                            >
                                                •{' '}
                                                {t(
                                                    'Improved security features',
                                                )}
                                            </Text>
                                            <Text fontSize="xs">
                                                •{' '}
                                                {t(
                                                    'Better transaction handling',
                                                )}
                                            </Text>
                                            <Text fontSize="xs">
                                                •{' '}
                                                {t(
                                                    'Enhanced compatibility with dApps',
                                                )}
                                            </Text>
                                            <Text fontSize="xs">
                                                •{' '}
                                                {t(
                                                    'Reduced gas costs for operations',
                                                )}
                                            </Text>
                                        </VStack>
                                    </AlertDescription>
                                </Box>
                            </Alert>

                            {upgradeError && (
                                <Alert status="error" borderRadius="md">
                                    <AlertIcon />
                                    <Box>
                                        <AlertTitle fontSize="sm">
                                            {t('Upgrade failed')}
                                        </AlertTitle>
                                        <AlertDescription fontSize="xs">
                                            {String(upgradeError)}
                                        </AlertDescription>
                                    </Box>
                                </Alert>
                            )}

                            {!isTransactionSuccess && (
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
                            )}
                        </>
                    )}
                </VStack>
            </ModalBody>

            <ModalFooter justifyContent="center">
                {isTransactionSuccess ? (
                    <VStack w="full" spacing={4}>
                        <Button
                            onClick={handleClose}
                            variant="vechainKitSecondary"
                            width="full"
                        >
                            {t('Close')}
                        </Button>

                        {txReceipt?.meta.txID && (
                            <Link
                                href={`${explorerUrl}/${txReceipt.meta.txID}`}
                                isExternal
                                opacity={0.5}
                                fontSize="14px"
                                textDecoration="underline"
                            >
                                <HStack
                                    spacing={1}
                                    alignItems="center"
                                    w="full"
                                    justifyContent="center"
                                >
                                    <Text>
                                        {t('View transaction on the explorer')}
                                    </Text>
                                    <Icon size="sm" as={GoLinkExternal} />
                                </HStack>
                            </Link>
                        )}
                    </VStack>
                ) : (
                    <VStack w="full" spacing={4}>
                        <TransactionButtonAndStatus
                            isSubmitting={isTransactionPending}
                            isTxWaitingConfirmation={
                                isWaitingForWalletConfirmation
                            }
                            handleSend={handleUpgrade}
                            transactionPendingText={t('Upgrading...')}
                            txReceipt={txReceipt}
                            transactionError={upgradeError}
                        />
                        <Button
                            onClick={handleClose}
                            variant={'link'}
                            width="full"
                            isDisabled={isTransactionPending}
                        >
                            {t('Close and do this later')}
                        </Button>
                    </VStack>
                )}
            </ModalFooter>
        </BaseModal>
    );
};
