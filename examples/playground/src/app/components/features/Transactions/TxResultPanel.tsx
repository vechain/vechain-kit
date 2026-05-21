'use client';

import {
    Box,
    Button,
    HStack,
    Link,
    Tag,
    Text,
    useColorMode,
    VStack,
} from '@chakra-ui/react';
import { LuExternalLink } from 'react-icons/lu';
import { useTranslation } from 'react-i18next';
import { CopyAddress } from '../../demo/CopyAddress';

type TxStatus =
    | 'idle'
    | 'pending'
    | 'waitingConfirmation'
    | 'success'
    | 'error'
    | 'unknown';

interface TxResultPanelProps {
    status: TxStatus | string;
    txReceipt?: {
        meta?: { txID?: string; blockNumber?: number };
        gasUsed?: number;
    } | null;
    error?: Error | { reason?: string; message?: string } | null;
    explorerBaseUrl?: string;
    onTryAgain?: () => void;
}

const STATUS_SCHEME: Record<string, string> = {
    idle: 'gray',
    pending: 'yellow',
    waitingConfirmation: 'yellow',
    success: 'green',
    error: 'red',
    unknown: 'gray',
};

export function TxResultPanel({
    status,
    txReceipt,
    error,
    explorerBaseUrl = 'https://explore.vechain.org/transactions',
    onTryAgain,
}: TxResultPanelProps) {
    const { colorMode } = useColorMode();
    const { t } = useTranslation();

    if (status === 'idle') return null;

    const txID = txReceipt?.meta?.txID;
    const errorMessage =
        error && 'reason' in error
            ? (error as { reason?: string }).reason
            : error?.message;

    return (
        <VStack
            align="stretch"
            spacing={3}
            p={4}
            borderRadius="md"
            borderWidth="1px"
            borderColor={
                colorMode === 'light' ? 'gray.200' : 'whiteAlpha.200'
            }
            bg={colorMode === 'light' ? 'gray.50' : 'whiteAlpha.50'}
            w="full"
        >
            <HStack justify="space-between">
                <Text fontSize="sm" fontWeight="semibold">
                    {t('Transaction status')}
                </Text>
                <Tag
                    size="sm"
                    colorScheme={STATUS_SCHEME[status as string] ?? 'gray'}
                    textTransform="uppercase"
                >
                    {status}
                </Tag>
            </HStack>

            {txID && (
                <Box>
                    <Text fontSize="xs" opacity={0.7} mb={1}>
                        {t('Transaction ID')}
                    </Text>
                    <HStack>
                        <CopyAddress address={txID} />
                        <Link
                            href={`${explorerBaseUrl}/${txID}`}
                            isExternal
                            color="blue.400"
                            fontSize="sm"
                        >
                            <HStack spacing={1}>
                                <Text>{t('View on explorer')}</Text>
                                <LuExternalLink size={14} />
                            </HStack>
                        </Link>
                    </HStack>
                </Box>
            )}

            {txReceipt?.gasUsed != null && (
                <HStack>
                    <Text fontSize="xs" opacity={0.7}>
                        {t('Gas used')}:
                    </Text>
                    <Text fontSize="sm" fontFamily="mono">
                        {txReceipt.gasUsed.toLocaleString()}
                    </Text>
                </HStack>
            )}

            {errorMessage && (
                <Box>
                    <Text fontSize="xs" opacity={0.7} mb={1}>
                        {t('Error')}
                    </Text>
                    <Text fontSize="sm" color="red.400">
                        {errorMessage}
                    </Text>
                </Box>
            )}

            {(status === 'error' || status === 'unknown') && onTryAgain && (
                <Button size="sm" variant="outline" onClick={onTryAgain}>
                    {t('Try again')}
                </Button>
            )}
        </VStack>
    );
}
