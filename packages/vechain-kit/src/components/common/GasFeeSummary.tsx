import React, { useState, useCallback, useEffect } from 'react';
import {
    HStack,
    Text,
    Button,
    Skeleton,
    Icon,
    Box,
    useDisclosure,
    useColorModeValue,
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

export const GasFeeSummary = ({
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

    const bgColor = useColorModeValue('gray.50', 'gray.700');
    const hoverBgColor = useColorModeValue('gray.100', 'gray.600');
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
            <Box w="full" p={3} bg={bgColor} borderRadius="md">
                <HStack justify="space-between" w="full">
                    <Skeleton height="16px" width="60px" borderRadius="md" />
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
            <Button
                variant="ghost"
                onClick={onOpen}
                w="full"
                justifyContent="space-between"
                p={3}
                h="auto"
                bg={bgColor}
                _hover={{ bg: hoverBgColor }}
                borderRadius="md"
            >
                <HStack spacing={2}>
                    <Text
                        fontSize="sm"
                        color={isDark ? 'whiteAlpha.600' : 'blackAlpha.600'}
                        fontWeight="normal"
                    >
                        {t('Max fee')}
                    </Text>
                </HStack>
                <HStack spacing={2}>
                    <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        w="20px"
                        h="20px"
                    >
                        {
                            TOKEN_LOGO_COMPONENTS[
                                tokenInfo.symbol as keyof typeof TOKEN_LOGO_COMPONENTS
                            ]
                        }
                    </Box>
                    <Text fontSize="sm" fontWeight="semibold">
                        {tokenInfo.symbol} {formatGasCost(totalCost, 2)}
                    </Text>
                    <Text
                        fontSize="xs"
                        color={isDark ? 'whiteAlpha.600' : 'blackAlpha.600'}
                    >
                        {'<'} ${(totalCost * 0.01).toFixed(2)}
                    </Text>
                    <Icon
                        as={MdKeyboardArrowDown}
                        boxSize={5}
                        color={isDark ? 'whiteAlpha.600' : 'blackAlpha.600'}
                    />
                </HStack>
            </Button>

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
