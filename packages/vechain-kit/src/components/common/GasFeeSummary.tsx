import React, { useState, useCallback, useEffect } from 'react';
import {
    HStack,
    Text,
    Skeleton,
    Icon,
    Box,
    useDisclosure,
    VStack,
    Button,
    Divider,
} from '@chakra-ui/react';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { useVeChainKitConfig } from '@/providers';
import { GasTokenType } from '@/types/gasToken';
import { SUPPORTED_GAS_TOKENS, TOKEN_LOGO_COMPONENTS } from '@/utils/constants';
import { formatGasCost } from '@/types/gasEstimation';
import { useWallet, useGasTokenSelection, useEstimateAllTokens } from '@/hooks';
import { EstimationResponse } from '@/types/gasEstimation';
import { GasFeeTokenSelector } from './GasFeeTokenSelector';
import { TransactionClause } from '@vechain/sdk-core';

interface GasFeeSummaryProps {
    estimation: (EstimationResponse & { usedToken: string }) | undefined;
    isLoading: boolean | undefined;
    onTokenChange?: (token: GasTokenType) => void;
    clauses?: TransactionClause[];
}

export const GasFeeSummary: React.FC<GasFeeSummaryProps> = ({
    estimation,
    isLoading,
    onTokenChange,
    clauses = [],
}: GasFeeSummaryProps) => {
    const { t } = useTranslation();
    const { feeDelegation } = useVeChainKitConfig();
    const { connection, account } = useWallet();
    const { preferences, reorderTokenPriority } = useGasTokenSelection();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [tokenEstimations, setTokenEstimations] = useState<
        Record<GasTokenType, { cost: number; loading: boolean }>
    >(() => {
        // Initialize with loading states for all available tokens
        const initialStates: Record<
            string,
            { cost: number; loading: boolean }
        > = {};
        preferences.availableGasTokens.forEach((token) => {
            initialStates[token] = { cost: 0, loading: true };
        });
        return initialStates as Record<
            GasTokenType,
            { cost: number; loading: boolean }
        >;
    });

    const { darkMode: isDark } = useVeChainKitConfig();
    // Fetch estimates for all available tokens when modal opens
    const { data: allTokenEstimates, isLoading: isLoadingAllEstimates } =
        useEstimateAllTokens({
            clauses: clauses,
            tokens: preferences.availableGasTokens,
            enabled: isOpen && clauses.length > 0,
        });

    // Initialize token estimations when modal opens
    useEffect(() => {
        if (isOpen && !isLoadingAllEstimates && allTokenEstimates) {
            setTokenEstimations(allTokenEstimates);
        }
    }, [isOpen, allTokenEstimates, isLoadingAllEstimates]);

    // Update current token estimation
    useEffect(() => {
        if (estimation) {
            setTokenEstimations((prev) => ({
                ...prev,
                [estimation.usedToken as GasTokenType]: {
                    cost: estimation.transactionCost || 0,
                    loading: false,
                },
            }));
        }
    }, [estimation]);

    // Initialize loading states for all tokens when modal opens
    useEffect(() => {
        if (isOpen && isLoadingAllEstimates) {
            const loadingStates = preferences.availableGasTokens.reduce(
                (acc, token) => {
                    acc[token] = { cost: 0, loading: true };
                    return acc;
                },
                {} as Record<GasTokenType, { cost: number; loading: boolean }>,
            );
            setTokenEstimations(loadingStates);
        }
    }, [isOpen, isLoadingAllEstimates, preferences.availableGasTokens]);

    const handleTokenSelect = useCallback(
        (token: GasTokenType, rememberChoice: boolean) => {
            if (rememberChoice) {
                // Move selected token to the top of priority order
                // This has the same effect as dragging it to the top in settings
                const newTokenPriority = [
                    token,
                    ...preferences.tokenPriority.filter((t) => t !== token),
                ];
                reorderTokenPriority(newTokenPriority);
            }

            // Trigger re-estimation
            if (onTokenChange && token !== estimation?.usedToken) {
                onTokenChange(token);
            }
        },
        [
            estimation,
            onTokenChange,
            reorderTokenPriority,
            preferences.tokenPriority,
        ],
    );

    if (feeDelegation?.delegatorUrl) {
        return null;
    }

    if (connection.isConnectedWithDappKit) {
        return null;
    }

    const tokenInfo =
        SUPPORTED_GAS_TOKENS[estimation?.usedToken as GasTokenType];
    const totalCost = estimation?.transactionCost || 0;

    if (isLoading || !estimation || !tokenInfo) {
        return (
            <Box
                w="full"
                p={2}
                borderRadius="lg"
                // bg={isDark ? '#00000038' : 'gray.50'}
            >
                <Text fontSize="sm" fontWeight="bold" mb={2}>
                    {t('Fee')}
                </Text>
                <HStack justify="space-between" w="full">
                    <Skeleton height="16px" width="120px" borderRadius="md" />
                    <HStack spacing={2}>
                        <Skeleton
                            height="20px"
                            width="20px"
                            borderRadius="full"
                        />
                        <Skeleton
                            height="16px"
                            width="100px"
                            borderRadius="md"
                        />
                        <Skeleton
                            height="16px"
                            width="16px"
                            borderRadius="md"
                        />
                    </HStack>
                </HStack>
            </Box>
        );
    }

    return (
        <>
            <Divider mt={3} />

            <HStack mt={3} w="full" justifyContent="start" alignItems="center">
                <VStack align="start" spacing={0} w="full">
                    <Text
                        fontSize="sm"
                        fontWeight="light"
                        textAlign="left"
                        w="full"
                    >
                        {t('Fee')}
                    </Text>

                    <HStack
                        align="start"
                        justifyContent="space-between"
                        spacing={0}
                        w="full"
                    >
                        <HStack justifyContent="flex-start" w="full">
                            <Text fontSize="sm" fontWeight="semibold">
                                {formatGasCost(totalCost, 2)} {tokenInfo.symbol}
                            </Text>
                            <Text fontSize="xs" opacity={0.5}>
                                {'≈'} ${(totalCost * 0.01).toFixed(2)}
                            </Text>
                        </HStack>
                    </HStack>
                </VStack>

                <Button
                    onClick={onOpen}
                    variant="outline"
                    size="sm"
                    borderRadius="full"
                    px={6}
                    color={isDark ? 'whiteAlpha.700' : 'blackAlpha.700'}
                    borderColor={isDark ? 'whiteAlpha.700' : 'blackAlpha.700'}
                    _hover={{
                        bg: isDark ? 'whiteAlpha.300' : 'blackAlpha.300',
                    }}
                    leftIcon={React.cloneElement(
                        TOKEN_LOGO_COMPONENTS[tokenInfo.symbol],
                        {
                            boxSize: '20px',
                            borderRadius: 'full',
                        },
                    )}
                >
                    <Text fontSize="sm" fontWeight="semibold">
                        {tokenInfo.symbol}
                    </Text>
                    <Icon
                        as={MdKeyboardArrowDown}
                        boxSize={5}
                        color={isDark ? 'whiteAlpha.600' : 'blackAlpha.600'}
                    />
                </Button>
            </HStack>

            <GasFeeTokenSelector
                isOpen={isOpen}
                onClose={onClose}
                selectedToken={estimation.usedToken as GasTokenType}
                onTokenSelect={handleTokenSelect}
                availableTokens={preferences.availableGasTokens}
                tokenEstimations={tokenEstimations}
                walletAddress={account?.address ?? ''}
            />
        </>
    );
};
