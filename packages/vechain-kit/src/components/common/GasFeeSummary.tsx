import {
    VStack,
    HStack,
    Text,
    Divider,
    Box,
    Icon,
    Skeleton,
    Badge,
} from '@chakra-ui/react';
import { FiInfo } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { useVeChainKitConfig } from '@/providers';
import { GasTokenType, SUPPORTED_GAS_TOKENS } from '@/types/gasToken';
import { formatGasCost } from '@/types/gasEstimation';
import { useWallet } from '@/hooks';
import { useGasEstimation } from '@/hooks/api';
import { TransactionClause } from '@vechain/sdk-core';

interface GasFeeSummaryProps {
    clauses?: TransactionClause[];
    gasToken: string;
}

export const GasFeeSummary = ({ clauses, gasToken }: GasFeeSummaryProps) => {
    const { t } = useTranslation();
    const config = useVeChainKitConfig();
    const { connection } = useWallet();

    if (config?.feeDelegation?.delegatorUrl) {
        return null;
    }

    if (connection.isConnectedWithDappKit) {
        return null;
    }

    const estimationClauses = clauses ? clauses : [
        {
            to: '0x0000000000000000000000000000000000000000',
            value: '0',
            data: '0x',
        },
    ];

    const {
        data: estimation,
        isLoading,
        error,
    } = useGasEstimation({
        clauses: estimationClauses,
        token: gasToken,
    });

    const tokenInfo = SUPPORTED_GAS_TOKENS[gasToken as GasTokenType];

    let rate = 1;
    let transactionCostVTHO = 0;
    let totalCost = 0;

    rate = estimation?.rate || 1;
    transactionCostVTHO = (estimation?.vthoPerGasAtSpeed || 0) * (estimation?.estimatedGas || 0);
    totalCost = estimation?.transactionCost || 0;

    return (
        <>
            <Divider />
            <VStack spacing={3} w="full" p={2}>
                <HStack justify="space-between" w="full">
                    <Text fontSize="sm" fontWeight="light">
                        {t('Gas Payment')}
                    </Text>
                    <Badge colorScheme="blue" size="sm">
                        {t('Generic Delegator')}
                    </Badge>
                </HStack>

                {isLoading ? (
                    <VStack spacing={2} w="full">
                        <Skeleton height="16px" w="full" />
                        <Skeleton height="16px" w="full" />
                        <Skeleton height="16px" w="full" />
                    </VStack>
                ) : error ? (
                    <Text fontSize="xs" color="red.500">
                        {t('Unable to estimate gas')}: {error.message}
                    </Text>
                ) : estimation ? (
                    <VStack spacing={1} w="full" align="stretch">
                        <HStack justify="space-between" w="full">
                            <Text fontSize="xs" color="gray.600">
                                {t('Token')}
                            </Text>
                            <Text fontSize="xs" fontWeight="medium">
                                {tokenInfo.name} ({tokenInfo.symbol})
                            </Text>
                        </HStack>

                        <HStack justify="space-between" w="full">
                            <Text fontSize="xs" color="gray.600">
                                {t('Transaction Cost (In VTHO)')}
                            </Text>
                            <Text fontSize="xs">
                                {formatGasCost(transactionCostVTHO)}{' '}
                            </Text>
                        </HStack>

                        <HStack justify="space-between" w="full">
                            <Text fontSize="xs" color="gray.600">
                                {t('Rate from VTHO to {{token}}', { token: tokenInfo.symbol })}
                            </Text>
                            <Text fontSize="xs">
                                {formatGasCost(rate)}{' '}
                                {tokenInfo.symbol}
                            </Text>
                        </HStack>

                        <Box
                            borderTop="1px"
                            borderColor="gray.200"
                            pt={1}
                            mt={1}
                        >
                            <HStack justify="space-between" w="full">
                                <Text fontSize="xs" fontWeight="semibold">
                                    {t('Total gas fee in {{token}}', { token: tokenInfo.symbol })}
                                </Text>
                                <Text fontSize="xs" fontWeight="semibold">
                                    {formatGasCost(totalCost)}{' '}
                                    {tokenInfo.symbol}
                                </Text>
                            </HStack>
                        </Box>
                    </VStack>
                ) : (
                    <Text fontSize="xs" color="gray.500">
                        {t('Unable to estimate gas')}
                    </Text>
                )}

                <Box
                    w="full"
                    p={2}
                    bg="blue.50"
                    borderRadius="md"
                    _dark={{ bg: 'blue.900' }}
                >
                    <HStack align="start" spacing={2}>
                        <Icon
                            as={FiInfo}
                            color="blue.500"
                            boxSize={3}
                            mt={0.5}
                        />
                        <Text
                            fontSize="xs"
                            color="blue.700"
                            _dark={{ color: 'blue.300' }}
                        >
                            {t(
                                'Service fee applied (already included in rates)',
                            )}
                        </Text>
                    </HStack>
                </Box>
            </VStack>
        </>
    );
};
