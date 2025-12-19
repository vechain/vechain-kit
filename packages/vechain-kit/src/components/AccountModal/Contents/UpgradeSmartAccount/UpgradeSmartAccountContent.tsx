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
    HStack,
    Circle,
    Image,
    Heading,
    Icon,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import {
    ModalBackButton,
    StickyHeaderContainer,
    TransactionButtonAndStatus,
} from '@/components/common';
import { AccountModalContentTypes } from '../../Types';
import { useUpgradeRequired, useUpgradeSmartAccount, useWallet } from '@/hooks';
import { LuArrowRight } from 'react-icons/lu';

export type UpgradeSmartAccountContentProps = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
    handleClose?: () => void;
    initialContent?: AccountModalContentTypes;
};

export const UpgradeSmartAccountContent = ({
    setCurrentContent,
    handleClose,
    initialContent = 'settings',
}: UpgradeSmartAccountContentProps) => {
    const { t } = useTranslation();
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
                        if (handleClose) {
                            handleClose();
                        } else {
                            setCurrentContent(initialContent);
                        }
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
                <ModalHeader>{t('Account upgrade required')}</ModalHeader>
                <ModalBackButton
                    onClick={() => {
                        setCurrentContent(initialContent);
                    }}
                />
                <ModalCloseButton />
            </StickyHeaderContainer>

            <ModalBody>
                <VStack spacing={10} align="stretch">
                    <Text fontSize="sm" textAlign="center">
                        {upgradeRequired
                            ? t(
                                  'Your smart account needs to be upgraded to the latest version (v3).',
                              )
                            : t(
                                  'Your smart account is already upgraded to this version.',
                              )}
                    </Text>

                    <HStack
                        align="center"
                        justifyContent="space-evenly"
                        rounded="md"
                    >
                        <Box position="relative" display="inline-block">
                            <Circle size="60px" bg="gray.200">
                                <Image
                                    borderRadius="full"
                                    src={smartAccount?.image}
                                    alt={t('Profile Picture')}
                                    w="100%"
                                    h="100%"
                                    objectFit="cover"
                                />
                            </Circle>

                            <Heading
                                position="absolute"
                                top="-5"
                                right="-5"
                                color="#D23F63"
                                fontSize="28px"
                            >
                                {`v1`}
                            </Heading>
                        </Box>

                        <Icon as={LuArrowRight} color="#3DBA67" />

                        <Box position="relative" display="inline-block">
                            <Circle size="60px" bg="gray.200">
                                <Image
                                    borderRadius="full"
                                    src={smartAccount?.image}
                                    alt={t('Profile Picture')}
                                    w="100%"
                                    h="100%"
                                    objectFit="cover"
                                />
                            </Circle>
                            <Heading
                                position="absolute"
                                top="-5"
                                right="-5"
                                color="#3DBA67"
                                fontSize="28px"
                            >
                                {`v3`}
                            </Heading>
                        </Box>
                    </HStack>

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
                        onClick={() => {
                            if (handleClose) {
                                handleClose();
                            } else {
                                setCurrentContent(initialContent);
                            }
                        }}
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
