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
import type { TransactionStatus, TransactionStatusErrorType } from '../../types';
import {
    LuX,
    LuExternalLink,
    LuCircleAlert,
    LuCircleCheck,
    LuRefreshCw,
} from 'react-icons/lu';
// Direct import to avoid circular dependency via providers barrel export
import { useVeChainKitConfig } from '../../providers/VeChainKitContext';
import { getConfig } from '../../config';
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
                            as={LuCircleAlert}
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
                            as={LuCircleCheck}
                            color={'green.500'}
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
                                {status === 'error' ? (
                                    <>
                                        <Icon mr={2} as={LuRefreshCw} />
                                        {t('Try again')}
                                    </>
                                ) : (
                                    t('Confirm')
                                )}
                            </Button>
                        )}

                        {txReceipt && status !== 'pending' && (
                            <Link
                                fontSize={'xs'}
                                isExternal
                                href={`${explorerUrl}/${txReceipt.meta.txID}`}
                            >
                                {t('View on explorer')}{' '}
                                <Icon as={LuExternalLink} />
                            </Link>
                        )}
                    </VStack>
                </HStack>
            </VStack>

            {!config.closeDisabled && (
                <IconButton
                    onClick={onClose}
                    size="sm"
                    borderRadius={'full'}
                    aria-label="Close"
                    icon={<Icon as={LuX} boxSize={4} />}
                />
            )}
        </HStack>
    );
};
