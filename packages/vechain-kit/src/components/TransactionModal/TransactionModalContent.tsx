import {
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    VStack,
    Text,
    Button,
    Box,
    ModalFooter,
    Icon,
    Link,
    HStack,
    Spinner,
} from '@chakra-ui/react';
import { ReactNode, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useVeChainKitConfig } from '@/providers';
import { getConfig } from '@/config';
import { GoLinkExternal } from 'react-icons/go';
import { IoIosCheckmarkCircleOutline } from 'react-icons/io';
import { MdOutlineErrorOutline, MdOutlineRefresh } from 'react-icons/md';
import { ShareButtons } from './Components/ShareButtons';
import { StickyHeaderContainer } from '../common';
import { TransactionStatus, TransactionStatusErrorType } from '@/types';

export type TransactionModalContentProps = {
    status: TransactionStatus;
    title?: ReactNode;
    description?: string;
    showSocialButtons?: boolean;
    socialDescriptionEncoded?: string;
    onTryAgain?: () => void;
    showExplorerButton?: boolean;
    txReceipt?: Connex.Thor.Transaction.Receipt | null;
    onClose?: () => void;
    txError?: Error | TransactionStatusErrorType;
    isClosable?: boolean;
};

type StatusConfig = {
    title: ReactNode;
    icon: ReactNode;
    description: string;
};

export const TransactionModalContent = ({
    status,
    title,
    description,
    showSocialButtons,
    socialDescriptionEncoded,
    onTryAgain,
    showExplorerButton,
    txReceipt,
    onClose,
    txError,
    isClosable = true,
}: TransactionModalContentProps) => {
    const { t } = useTranslation();
    const { darkMode: isDark, network } = useVeChainKitConfig();

    const errorMessage = useMemo(() => {
        if (!txError) return null;
        return (
            (txError as any).reason ||
            t('Something went wrong. Please try again.')
        );
    }, [txError, t]);

    const getStatusConfig = (): StatusConfig => {
        // overwrite status to avoid flickering
        const isSendingTransaction = status === 'waitingConfirmation';
        if (isSendingTransaction) {
            status = 'pending';
        }
        switch (status) {
            case 'pending':
                return {
                    title:
                        title ??
                        (isSendingTransaction
                            ? t('Sending Transaction...')
                            : t('Waiting for confirmation')),
                    icon: <Spinner size="xl" />,
                    description: isSendingTransaction
                        ? t(
                              'Transaction is being processed, it can take up to 15 seconds.',
                          )
                        : description ??
                          t('Please confirm the transaction in your wallet.'),
                };
            case 'error':
                return {
                    title: title ?? t('Something went wrong'),
                    icon: (
                        <Icon
                            as={MdOutlineErrorOutline}
                            color="red"
                            fontSize="100px"
                        />
                    ),
                    description:
                        errorMessage ?? t('An unexpected error occurred.'),
                };
            case 'success':
                return {
                    title: title ?? t('Transaction completed!'),
                    icon: (
                        <Icon
                            as={IoIosCheckmarkCircleOutline}
                            color="#00ff45de"
                            fontSize="100px"
                        />
                    ),
                    description: '',
                };
            default:
                return {
                    title: '',
                    icon: null,
                    description: '',
                };
        }
    };

    const statusConfig = getStatusConfig();
    const socialDescription =
        socialDescriptionEncoded ??
        `${getConfig(network.type).explorerUrl}/${txReceipt?.meta.txID}`;

    return (
        <Box>
            <StickyHeaderContainer>
                <ModalHeader
                    fontSize="md"
                    fontWeight="500"
                    textAlign="center"
                    color={isDark ? '#dfdfdd' : '#4d4d4d'}
                >
                    {statusConfig.title}
                </ModalHeader>
                <ModalCloseButton
                    isDisabled={status === 'pending' && !isClosable}
                />
            </StickyHeaderContainer>

            <ModalBody>
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
                        {statusConfig.icon}
                    </motion.div>

                    {status === 'success' && showSocialButtons && (
                        <VStack mt={2}>
                            <Text fontSize="xs">{t('Share on')}</Text>
                            <ShareButtons
                                descriptionEncoded={socialDescription}
                            />
                        </VStack>
                    )}
                </VStack>
            </ModalBody>

            <ModalFooter justifyContent="center">
                <VStack width="full" spacing={4}>
                    {statusConfig.description && (
                        <Text fontSize="sm" textAlign="center">
                            {statusConfig.description}
                        </Text>
                    )}

                    {status === 'error' && !!onTryAgain && (
                        <Button
                            variant="vechainKitSecondary"
                            onClick={onTryAgain}
                            width="full"
                        >
                            <Icon mr={2} as={MdOutlineRefresh} />
                            {t('Try again')}
                        </Button>
                    )}

                    {(status === 'success' || status === 'error') && (
                        <Button
                            onClick={onClose}
                            variant="vechainKitSecondary"
                            width="full"
                        >
                            {t('Close')}
                        </Button>
                    )}

                    {showExplorerButton && txReceipt?.meta.txID && (
                        <Link
                            href={`${getConfig(network.type).explorerUrl}/${
                                txReceipt?.meta.txID
                            }`}
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
            </ModalFooter>
        </Box>
    );
};
