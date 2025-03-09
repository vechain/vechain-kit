import {
    VStack,
    Text,
    Link,
    Icon,
    HStack,
    Heading,
    Spinner,
    Button,
} from '@chakra-ui/react';
import React, { useMemo } from 'react';
import { TransactionStatus, TransactionStatusErrorType } from '@/types';
import { FcCheckmark } from 'react-icons/fc';
import { IoCloseOutline, IoOpenOutline } from 'react-icons/io5';
import { MdOutlineErrorOutline } from 'react-icons/md';
import { useVeChainKitConfig } from '@/providers';
import { getConfig } from '@/config';
import { useTranslation } from 'react-i18next';

type TransactionToastContentProps = {
    status: TransactionStatus;
    txReceipt?: Connex.Thor.Transaction.Receipt | null;
    txError?: Error | TransactionStatusErrorType;
    onTryAgain?: () => void;
    description?: string;
    onClose: () => void;
};

type StatusConfig = {
    icon: React.ReactElement;
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

    const statusConfig = {
        pending: {
            icon: <Spinner size="md" />,
            title: t('Processing transaction...'),
            description: description,
            closeDisabled: true,
        },
        waitingConfirmation: {
            icon: <Spinner size="md" />,
            title: t('Waiting for confirmation') + '...',
            closeDisabled: true,
            description: description,
        },
        error: {
            icon: (
                <Icon
                    as={MdOutlineErrorOutline}
                    color={'red'}
                    fontSize={'40px'}
                />
            ),
            title: t('Transaction failed'),
            closeDisabled: false,
            description: errorMessage,
        },
        success: {
            icon: <Icon as={FcCheckmark} fontSize={'40px'} />,
            title: t('Transaction successful!'),
            closeDisabled: false,
            description: undefined,
        },
    } as const satisfies Record<
        Exclude<TransactionStatus, 'ready' | 'unknown'>,
        StatusConfig
    >;

    const isValidStatus = (
        status: TransactionStatus,
    ): status is Exclude<TransactionStatus, 'ready' | 'unknown'> => {
        return status in statusConfig;
    };

    if (!isValidStatus(status)) return null;
    const config = statusConfig[status];

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

                        {status === 'error' && onTryAgain && (
                            <Button size="xs" onClick={onTryAgain}>
                                {t('Try again')}
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
                <Button
                    onClick={onClose}
                    variant="ghost"
                    size="sm"
                    borderRadius={'full'}
                    aria-label="Close"
                    ml={5}
                    leftIcon={<Icon as={IoCloseOutline} boxSize={2} />}
                >
                    {t('Close')}
                </Button>
            )}
        </HStack>
    );
};
