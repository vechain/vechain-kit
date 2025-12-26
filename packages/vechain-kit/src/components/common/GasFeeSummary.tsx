import React, { useState, useCallback, useEffect } from 'react';
import {
    HStack,
    Text,
    Skeleton,
    Icon,
    useDisclosure,
    VStack,
    Button,
    Divider,
    useToken,
} from '@chakra-ui/react';
import { LuChevronDown } from 'react-icons/lu';
import { useTranslation } from 'react-i18next';
import { useVeChainKitConfig } from '@/providers';
import { GasTokenType } from '@/types/gasToken';
import { SUPPORTED_GAS_TOKENS } from '@/utils/constants';
import { formatGasCost } from '@/types/gasEstimation';
import {
    useWallet,
    useGasTokenSelection,
    useEstimateAllTokens,
    useTokenBalances,
} from '@/hooks';
import { EstimationResponse } from '@/types/gasEstimation';
import { GasFeeTokenSelector } from './GasFeeTokenSelector';
import { TransactionClause } from '@vechain/sdk-core';

interface GasFeeSummaryProps {
    estimation: (EstimationResponse & { usedToken: string }) | undefined;
    isLoading: boolean | undefined;
    isLoadingTransaction?: boolean;
    onTokenChange?: (token: GasTokenType) => void;
    clauses?: TransactionClause[];
    userSelectedToken?: GasTokenType | null; // Track user's manual selection
}

export const GasFeeSummary: React.FC<GasFeeSummaryProps> = ({
    estimation,
    isLoading,
    isLoadingTransaction,
    onTokenChange,
    clauses = [],
    userSelectedToken,
}: GasFeeSummaryProps) => {
    const { t } = useTranslation();
    const { feeDelegation } = useVeChainKitConfig();
    const { connection, account } = useWallet();
    const { preferences, reorderTokenPriority } = useGasTokenSelection();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const textPrimary = useToken('colors', 'vechain-kit-text-primary');
    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');

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

    // Fetch estimates for all available tokens when modal opens
    const { data: allTokenEstimates, isLoading: isLoadingAllEstimates } =
        useEstimateAllTokens({
            clauses: clauses,
            tokens: preferences.availableGasTokens,
            enabled: clauses.length > 0,
        });
    // Preload all token estimates to avoid re-fetching per token switch and to enable
    // fallback display when single-token estimation is undefined.
    // Initialize token estimations from prefetch results as soon as they are ready
    useEffect(() => {
        if (!isLoadingAllEstimates && allTokenEstimates) {
            setTokenEstimations(allTokenEstimates);
        }
    }, [allTokenEstimates, isLoadingAllEstimates]);

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

    // Initialize loading states while prefetch is loading
    useEffect(() => {
        if (isLoadingAllEstimates) {
            const loadingStates = preferences.availableGasTokens.reduce(
                (acc, token) => {
                    acc[token] = { cost: 0, loading: true };
                    return acc;
                },
                {} as Record<GasTokenType, { cost: number; loading: boolean }>,
            );
            setTokenEstimations(loadingStates);
        }
    }, [isLoadingAllEstimates, preferences.availableGasTokens]);

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

    // If no tokens are available, don't render anything
    if (preferences.availableGasTokens.length === 0) {
        return null;
    }

    const { balances } = useTokenBalances(account?.address ?? '');

    const hasInsufficientBalanceForToken = (token: GasTokenType) => {
        const balance = balances.find((b) => b.symbol === token);
        const est = tokenEstimations[token];
        if (!balance || !est || est.loading) return true;
        return Number(balance.balance.scaled) < est.cost;
    };

    // Determine display token and cost:
    // Priority order:
    // 1. Successfully used token from estimation (shows what will actually be used)
    // 2. User's manual selection while loading (shows what they picked during estimation)
    // 3. First available token with sufficient balance
    // 4. First available token with loaded estimate
    // 5. First available token
    const preferredToken = estimation?.usedToken as GasTokenType | undefined;
    const availableTokens = preferences.availableGasTokens as GasTokenType[];

    let displayToken: GasTokenType | undefined;

    // Priority 1: Successfully used token from estimation (always show what will actually be used)
    if (preferredToken) {
        displayToken = preferredToken;
    }
    // Priority 2: User's manual selection while loading (keeps UI stable during estimation)
    else if (userSelectedToken && availableTokens.includes(userSelectedToken)) {
        displayToken = userSelectedToken;
    }
    // Priority 3 & 4: Auto-select based on availability
    else {
        displayToken = availableTokens.find(
            (t) =>
                tokenEstimations[t] &&
                !tokenEstimations[t].loading &&
                !hasInsufficientBalanceForToken(t),
        );
        if (!displayToken) {
            displayToken = availableTokens.find(
                (t) => tokenEstimations[t] && !tokenEstimations[t].loading,
            );
        }
        if (!displayToken) {
            displayToken = availableTokens[0];
        }
    }

    const displayEstimation = displayToken
        ? tokenEstimations[displayToken]
        : undefined;

    // Show cost for the displayed token
    // If we have a successful estimation, use its cost; otherwise use the display token's estimation
    const totalCost =
        preferredToken && estimation?.transactionCost
            ? estimation.transactionCost
            : displayEstimation?.cost || 0;

    const tokenInfo = displayToken
        ? SUPPORTED_GAS_TOKENS[displayToken]
        : undefined;

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
                        color={textSecondary}
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
                            {isLoading ||
                            (!preferredToken &&
                                (!displayEstimation ||
                                    displayEstimation.loading)) ||
                            !tokenInfo ? (
                                <>
                                    <Skeleton
                                        height="16px"
                                        width="120px"
                                        borderRadius="md"
                                    />
                                    <Skeleton
                                        height="16px"
                                        width="60px"
                                        borderRadius="md"
                                    />
                                </>
                            ) : (
                                <>
                                    <Text
                                        color={textPrimary}
                                        fontSize="sm"
                                        fontWeight="semibold"
                                    >
                                        {formatGasCost(totalCost, 2)}{' '}
                                        {tokenInfo.symbol}
                                    </Text>
                                    <Text color={textSecondary} fontSize="xs">
                                        {'≈'} ${(totalCost * 0.01).toFixed(2)}
                                    </Text>
                                </>
                            )}
                        </HStack>
                    </HStack>
                </VStack>

                <Button
                    onClick={onOpen}
                    variant="outline"
                    size="sm"
                    borderRadius="full"
                    px={6}
                    disabled={isLoadingTransaction}
                    color={textSecondary}
                    borderColor={textSecondary}
                    _hover={{
                        bg: textSecondary,
                    }}
                    //TODO: CHECK IF COMPONENT IS NEEDED
                    // leftIcon={React.cloneElement(
                    //     TOKEN_LOGO_COMPONENTS[
                    //         (displayToken as GasTokenType) ||
                    //             preferences.availableGasTokens[0]
                    //     ],
                    //     {
                    //         boxSize: '20px',
                    //         borderRadius: 'full',
                    //     },
                    // )}
                >
                    <Text fontSize="sm" fontWeight="semibold">
                        {displayToken || preferences.availableGasTokens[0]}
                    </Text>
                    <Icon
                        as={LuChevronDown}
                        boxSize={5}
                        color={textSecondary}
                    />
                </Button>
            </HStack>

            <GasFeeTokenSelector
                isOpen={isOpen}
                onClose={onClose}
                selectedToken={
                    (displayToken as GasTokenType) ||
                    preferences.availableGasTokens[0]
                }
                onTokenSelect={handleTokenSelect}
                availableTokens={preferences.availableGasTokens}
                tokenEstimations={tokenEstimations}
                walletAddress={account?.address ?? ''}
            />
        </>
    );
};
