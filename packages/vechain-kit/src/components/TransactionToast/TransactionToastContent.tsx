import {
    VStack,
    Text,
    Link,
    Icon,
    HStack,
    Heading,
    Spinner,
    Button,
    IconButton,
} from '@chakra-ui/react';
import React, { useMemo } from 'react';
import { TransactionStatus, TransactionStatusErrorType } from '@/types';
import { FcCheckmark } from 'react-icons/fc';
import { IoCloseOutline, IoOpenOutline } from 'react-icons/io5';
import { MdOutlineErrorOutline } from 'react-icons/md';
import { useVeChainKitConfig } from '@/providers';
import { getConfig } from '@/config';
import { useTranslation } from 'react-i18next';
import { TransactionReceipt } from '@vechain/sdk-network';

type TransactionToastContentProps = {
    status: TransactionStatus;
    txReceipt: TransactionReceipt | null;
    onTryAgain: () => void;
    txError?: Error | TransactionStatusErrorType;
    description?: string;
    onClose: () => void;
};

type StatusConfig = {
    icon: React.ReactElement | null;
    title: string;
    closeDisabled: boolean;
    description?: string;
};

export const TransactionToastContent = ({
    status,
    txReceipt,
    txError,
    onTryAgain,
    description,
    onClose,
}: TransactionToastContentProps) => {
    const { t } = useTranslation();
    const { network } = useVeChainKitConfig();
    const explorerUrl = getConfig(network.type).explorerUrl;

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
                    icon: (
                        <Spinner
                            size="md"
                            data-testid="pending-spinner-toast"
                        />
                    ),
                    title: isSendingTransaction
                        ? t('Processing transaction...')
                        : t('Waiting for confirmation...'),
                    closeDisabled: true,
                    description: isSendingTransaction
                        ? t(
                              'Transaction is being processed, it can take up to 15 seconds.',
                          )
                        : description ??
                          t('Please confirm the transaction in your wallet.'),
                };
            case 'error':
                return {
                    icon: (
                        <Icon
                            as={MdOutlineErrorOutline}
                            color={'red.500'}
                            fontSize={'40px'}
                            data-testid="error-icon-toast"
                        />
                    ),
                    title: t('Transaction failed'),
                    closeDisabled: false,
                    description: errorMessage,
                };
            case 'success':
                return {
                    icon: (
                        <Icon
                            as={FcCheckmark}
                            fontSize={'40px'}
                            data-testid="success-icon-toast"
                        />
                    ),
                    title: t('Transaction successful!'),
                    closeDisabled: false,
                    description: undefined,
                };
            case 'ready':
                return {
                    icon: null,
                    title: t('Confirm transaction'),
                    closeDisabled: false,
                    description:
                        description ??
                        t(
                            'Confirm the transaction in your wallet to complete it.',
                        ),
                };
            default:
                return {
                    icon: null,
                    title: '',
                    closeDisabled: false,
                    description: '',
                };
        }
    };

    const config = getStatusConfig();
    if (!config) return null;

    return (
        <HStack justify="space-between" alignItems={'flex-start'} w="full">
            <VStack spacing={4}>
                <HStack
                    spacing={4}
                    w={'full'}
                    justifyContent={'flex-start'}
                    alignItems={'flex-start'}
                >
                    {config.icon}

                    <VStack w={'full'} align={'flex-start'} spacing={2}>
                        <VStack spacing={1} w={'full'}>
                            <Heading w={'full'} size={'xs'}>
                                {config.title}
                            </Heading>
                            {config.description && (
                                <Text fontSize={'xs'}>
                                    {config.description}
                                </Text>
                            )}
                        </VStack>

                        {(status === 'error' || status === 'ready') && (
                            <Button size="xs" onClick={onTryAgain}>
                                {status === 'error'
                                    ? t('Try again')
                                    : t('Confirm')}
                            </Button>
                        )}

                        {txReceipt && status !== 'pending' && (
                            <Link
                                fontSize={'xs'}
                                isExternal
                                href={`${explorerUrl}/${txReceipt.meta.txID}`}
                            >
                                {t('View on explorer')}{' '}
                                <Icon as={IoOpenOutline} />
                            </Link>
                        )}
                    </VStack>
                </HStack>
            </VStack>

            {!config.closeDisabled && (
                <IconButton
                    onClick={onClose}
                    variant="ghost"
                    size="sm"
                    borderRadius={'full'}
                    aria-label="Close"
                    icon={<Icon as={IoCloseOutline} boxSize={4} />}
                />
            )}
        </HStack>
    );
};
