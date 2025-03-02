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
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RiShieldKeyholeLine } from 'react-icons/ri';
import { IoWarningOutline } from 'react-icons/io5';
import {
    useWallet,
    useGetSmartAccountAddress,
    useUpgradeSmartAccountVersion,
    useHasV1SmartAccount,
    useSmartAccountVersion,
} from '@/hooks';
import { useVeChainKitConfig } from '@/providers';
import { BaseModal } from '../common/BaseModal';
import {
    StickyHeaderContainer,
    StickyFooterContainer,
    TransactionButtonAndStatus,
} from '../common';
import { motion } from 'framer-motion';
import { FcCheckmark } from 'react-icons/fc';
import { GoLinkExternal } from 'react-icons/go';
import { getConfig } from '@/config';

interface UpgradeSmartAccountModalProps {
    onSuccess?: () => void;
}

export const UpgradeSmartAccountModal = ({
    onSuccess,
}: UpgradeSmartAccountModalProps) => {
    const { t } = useTranslation();
    const { darkMode: isDark } = useVeChainKitConfig();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { connectedWallet } = useWallet();
    const [isTransactionSuccess, setIsTransactionSuccess] = useState(false);

    // Get the smart account address for the connected wallet
    const { data: smartAccountAddress } = useGetSmartAccountAddress(
        connectedWallet?.address,
    );

    // Instead of using useSmartAccountNeedsUpgrade, we will use useHasV1SmartAccount
    // smartAccountNeedsUpgrade will return false if the account is not deployed
    // but we want to enforce the upgrade, so we will both create the smart account and upgrade it at once
    const { data: isLegacySmartAccount, isLoading: isCheckingUpgrade } =
        useHasV1SmartAccount(connectedWallet?.address);

    const {
        data: smartAccountVersion,
        isLoading: isCheckingSmartAccountVersion,
    } = useSmartAccountVersion(smartAccountAddress ?? '');

    // Set up the upgrade transaction
    const {
        sendTransaction: upgradeSmartAccount,
        isTransactionPending,
        isWaitingForWalletConfirmation,
        error: upgradeError,
        txReceipt,
        resetStatus: resetUpgradeState,
    } = useUpgradeSmartAccountVersion({
        fromAddress: connectedWallet?.address ?? '',
        smartAccountAddress: smartAccountAddress ?? '',
        targetVersion: 3,
        onSuccess: () => {
            setIsTransactionSuccess(true);
            setTimeout(() => {
                onSuccess?.();
                onClose();
            }, 3000); // Show success state for 3 seconds before closing
        },
        onError: () => {
            console.error('Error upgrading Smart Account');
        },
    });

    // Automatically open the modal when needed
    useEffect(() => {
        // If the user is connected and has a legacy smart account (even if not deployed)
        // and the smart account is not already upgraded, open the modal
        if (
            connectedWallet &&
            isLegacySmartAccount &&
            !isOpen &&
            !isCheckingUpgrade &&
            !isCheckingSmartAccountVersion &&
            (smartAccountVersion === undefined || // return undefined when the contract is not deployed
                (smartAccountVersion && smartAccountVersion !== 3))
        ) {
            onOpen();
        }
    }, [
        isLegacySmartAccount,
        isOpen,
        isCheckingUpgrade,
        onOpen,
        connectedWallet,
        smartAccountVersion,
        isCheckingSmartAccountVersion,
    ]);

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
            isCloseable={false}
            isCentered
            blockScrollOnMount={true}
            allowExternalFocus={true}
        >
            <StickyHeaderContainer>
                <ModalHeader
                    fontSize="xl"
                    fontWeight="600"
                    textAlign="center"
                    color={isDark ? '#dfdfdd' : '#4d4d4d'}
                >
                    {isTransactionSuccess
                        ? t('Upgrade Successful!')
                        : t('Smart Account Upgrade Required')}
                </ModalHeader>
            </StickyHeaderContainer>

            <ModalBody>
                <VStack spacing={5} align="center">
                    {!isTransactionSuccess && (
                        <Icon
                            as={RiShieldKeyholeLine}
                            boxSize={12}
                            color="blue.400"
                        />
                    )}

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
                            <Text textAlign="center" fontSize="md">
                                {t(
                                    'Your smart account needs to be upgraded to the latest version (v3).',
                                )}
                            </Text>

                            <Alert status="info" borderRadius="md">
                                <AlertIcon />
                                <Box>
                                    <AlertTitle>
                                        {t('Benefits of this upgrade:')}
                                    </AlertTitle>
                                    <AlertDescription>
                                        <VStack
                                            align="start"
                                            spacing={0}
                                            mt={1}
                                        >
                                            <Text fontSize="sm">
                                                •{' '}
                                                {t(
                                                    'Improved security features',
                                                )}
                                            </Text>
                                            <Text fontSize="sm">
                                                •{' '}
                                                {t(
                                                    'Better transaction handling',
                                                )}
                                            </Text>
                                            <Text fontSize="sm">
                                                •{' '}
                                                {t(
                                                    'Enhanced compatibility with dApps',
                                                )}
                                            </Text>
                                            <Text fontSize="sm">
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
                                        <AlertTitle>
                                            {t('Upgrade failed')}
                                        </AlertTitle>
                                        <AlertDescription>
                                            {String(upgradeError)}
                                        </AlertDescription>
                                    </Box>
                                </Alert>
                            )}

                            {!isTransactionSuccess && (
                                <Alert status="warning" borderRadius="md">
                                    <AlertIcon as={IoWarningOutline} />
                                    <Box>
                                        <AlertTitle>
                                            {t('Important')}
                                        </AlertTitle>
                                        <AlertDescription>
                                            <Text fontSize="sm">
                                                {t(
                                                    'This upgrade is necessary to continue using all features of your smart account. Please complete it now.',
                                                )}
                                            </Text>
                                        </AlertDescription>
                                    </Box>
                                </Alert>
                            )}
                        </>
                    )}
                </VStack>
            </ModalBody>

            <StickyFooterContainer>
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
                                            {t(
                                                'View transaction on the explorer',
                                            )}
                                        </Text>
                                        <Icon size="sm" as={GoLinkExternal} />
                                    </HStack>
                                </Link>
                            )}
                        </VStack>
                    ) : (
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
                    )}
                </ModalFooter>
            </StickyFooterContainer>
        </BaseModal>
    );
};
