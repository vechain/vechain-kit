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
import { useGasTokenSelection } from '@/hooks/transactions';
import { useMemo } from 'react';
import { SUPPORTED_GAS_TOKENS, GasTokenType } from '@/types/GasToken';
import { formatGasCost } from '@/types/GasEstimation';
import { useWallet } from '@/hooks';
import { useGasEstimation } from '@/hooks/api/useGasEstimation';
import { EnhancedClause } from '@/types';

interface GasFeeSummaryProps {
    clauses?: EnhancedClause[];
}

export const GasFeeSummary = ({ clauses }: GasFeeSummaryProps) => {
    const { t } = useTranslation();
    const config = useVeChainKitConfig();
    const { connection } = useWallet();
    const { preferences } = useGasTokenSelection();

    // If developer has configured fee delegation, don't show gas info
    if (config?.feeDelegation?.delegatorUrl) {
        return null;
    }

    // For DAppKit users (VeWorld), gas is handled by wallet so don't show
    if (connection.isConnectedWithDappKit) {
        return null;
    }

    // Use default clauses if none provided
    const estimationClauses = useMemo(() => {
        if (!clauses || clauses.length === 0) {
            return [
                {
                    to: '0x0000000000000000000000000000000000000000',
                    value: '0',
                    data: '0x',
                },
            ] as EnhancedClause[];
        }
        return clauses;
    }, [clauses]);

    // Use the React Query hook
    const {
        data: estimation,
        isLoading,
        error,
    } = useGasEstimation({
        clauses: estimationClauses,
    });

    // Get the first priority token
    const primaryToken = preferences.tokenPriority[0];
    const tokenInfo = SUPPORTED_GAS_TOKENS[primaryToken];

    // Get cost for the selected token and speed
    const getCostForToken = (token: GasTokenType): number => {
        if (!estimation) return 0;

        // Use regular speed by default
        const speedCost = estimation.transactionCost.regular;

        // For smart account users, use the smart account cost
        const isSmartAccount = connection.isConnectedWithPrivy;

        switch (token) {
            case 'VTHO':
                return speedCost.vtho;
            case 'VET':
                return isSmartAccount
                    ? speedCost.vetWithSmartAccount
                    : speedCost.vet;
            case 'B3TR':
                return isSmartAccount
                    ? speedCost.b3trWithSmartAccount
                    : speedCost.b3tr;
            default:
                return 0;
        }
    };

    const baseCost = getCostForToken(primaryToken);
    const serviceFeeAmount = baseCost * (estimation?.serviceFee || 0.1);
    const totalCost = baseCost + serviceFeeAmount;

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
                                {t('Transaction cost')}
                            </Text>
                            <Text fontSize="xs">
                                {formatGasCost(baseCost)} {tokenInfo.symbol}
                            </Text>
                        </HStack>

                        <HStack justify="space-between" w="full">
                            <Text fontSize="xs" color="gray.600">
                                {t('Service fee (10%)')}
                            </Text>
                            <Text fontSize="xs">
                                {formatGasCost(serviceFeeAmount)}{' '}
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
                                    {t('Total gas fee')}
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
