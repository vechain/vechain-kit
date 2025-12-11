import React, { useMemo } from 'react';
import {
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    VStack,
    Text,
    HStack,
    ModalFooter,
    useToken,
} from '@chakra-ui/react';
import {
    ModalBackButton,
    StickyHeaderContainer,
    AddressDisplayCard,
    TransactionButtonAndStatus,
    GasFeeSummary,
} from '@/components/common';
import { AccountModalContentTypes } from '../../Types';
import { getPicassoImage } from '@/utils';
import {
    useTransferERC20,
    useTransferVET,
    useUpgradeRequired,
    useUpgradeSmartAccountModal,
    useWallet,
    TokenWithValue,
    useGasTokenSelection,
    useGenericDelegatorFeeEstimation,
} from '@/hooks';
import { useTranslation } from 'react-i18next';
import { useVeChainKitConfig } from '@/providers';
import { useGetAvatarOfAddress } from '@/hooks/api/vetDomains';
import { GasTokenType } from '@/types/gasToken';
import { useAccountModalOptions } from '@/hooks/modals/useAccountModalOptions';

export type SendTokenSummaryContentProps = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
    toAddressOrDomain: string;
    resolvedDomain?: string;
    resolvedAddress?: string;
    amount: string;
    selectedToken: TokenWithValue;
    formattedTotalAmount: string;
};

export const SendTokenSummaryContent = ({
    setCurrentContent,
    toAddressOrDomain,
    resolvedDomain,
    resolvedAddress,
    amount,
    selectedToken,
    formattedTotalAmount,
}: SendTokenSummaryContentProps) => {
    const { t } = useTranslation();
    const { account, connection, connectedWallet } = useWallet();
    const { data: avatar } = useGetAvatarOfAddress(resolvedAddress ?? '');
    const { network, feeDelegation } = useVeChainKitConfig();
    const { preferences } = useGasTokenSelection();
    const { isolatedView, closeAccountModal } = useAccountModalOptions();

    const textPrimary = useToken('colors', 'vechain-kit-text-primary');
    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');

    const { data: upgradeRequired } = useUpgradeRequired(
        account?.address ?? '',
        connectedWallet?.address ?? '',
        3,
    );
    const { open: openUpgradeSmartAccountModal } =
        useUpgradeSmartAccountModal();
    // Get the final image URL
    const toImageSrc = useMemo(() => {
        if (avatar) {
            return avatar;
        }
        return getPicassoImage(resolvedAddress || toAddressOrDomain);
    }, [avatar, network.type, resolvedAddress, toAddressOrDomain]);

    const handleSend = async () => {
        if (upgradeRequired) {
            openUpgradeSmartAccountModal();
            return;
        }

        try {
            if (selectedToken.symbol === 'VET') {
                await transferVET();
            } else {
                await transferERC20();
            }
        } catch (error) {
            console.error(t('Transaction failed:'), error);
        }
    };

    const handleSuccess = (txId: string) => {
        setCurrentContent({
            type: 'successful-operation',
            props: {
                setCurrentContent,
                txId,
                title: t('Transaction successful'),
                onDone: () => {
                    if (isolatedView) {
                        closeAccountModal();
                    } else {
                        setCurrentContent('main');
                    }
                },
                showSocialButtons: true,
            },
        });
    };

    const {
        sendTransaction: transferERC20,
        txReceipt: transferERC20Receipt,
        error: transferERC20Error,
        isWaitingForWalletConfirmation:
            transferERC20WaitingForWalletConfirmation,
        isTransactionPending: transferERC20Pending,
        clauses: erc20Clauses,
    } = useTransferERC20({
        fromAddress: account?.address ?? '',
        receiverAddress: resolvedAddress || toAddressOrDomain,
        amount,
        tokenAddress: selectedToken.address,
        tokenName: selectedToken.symbol,
        onSuccess: () => {
            handleSuccess(transferERC20Receipt?.meta.txID ?? '');
        },
        onError: (error) => {
            handleError(error ?? '');
        },
    });

    const {
        sendTransaction: transferVET,
        txReceipt: transferVETReceipt,
        error: transferVETError,
        isWaitingForWalletConfirmation: transferVETWaitingForWalletConfirmation,
        isTransactionPending: transferVETPending,
        clauses: vetClauses,
    } = useTransferVET({
        fromAddress: account?.address ?? '',
        receiverAddress: resolvedAddress || toAddressOrDomain,
        amount,
        onSuccess: () => {
            handleSuccess(transferVETReceipt?.meta.txID ?? '');
        },
        onError: (error) => {
            handleError(error ?? '');
        },
    });

    const getTxReceipt = () => {
        return selectedToken.symbol === 'VET'
            ? transferVETReceipt
            : transferERC20Receipt;
    };

    const isTxWaitingConfirmation =
        transferERC20WaitingForWalletConfirmation ||
        transferVETWaitingForWalletConfirmation;
    const isSubmitting =
        isTxWaitingConfirmation || transferERC20Pending || transferVETPending;

    const handleBack = () => {
        setCurrentContent({
            type: 'send-token',
            props: {
                setCurrentContent,
                preselectedToken: selectedToken,
                initialAmount: amount,
                initialToAddressOrDomain: toAddressOrDomain,
            },
        });
    };

    const handleError = (error: string) => {
        console.error('Transaction failed:', error);
    };

    const [selectedGasToken, setSelectedGasToken] =
        React.useState<GasTokenType | null>(null);
    // Track the user's manual selection to show it during loading (before estimation completes)
    const [userSelectedGasToken, setUserSelectedGasToken] =
        React.useState<GasTokenType | null>(null);

    const shouldEstimateGas =
        preferences.availableGasTokens.length > 0 &&
        (connection.isConnectedWithPrivy ||
            connection.isConnectedWithVeChain) &&
        !feeDelegation?.delegatorUrl;
    const {
        data: gasEstimation,
        isLoading: gasEstimationLoading,
        error: gasEstimationError,
        refetch: refetchGasEstimation,
    } = useGenericDelegatorFeeEstimation({
        clauses: selectedToken.symbol === 'VET' ? vetClauses : erc20Clauses,
        tokens: selectedGasToken
            ? [selectedGasToken]
            : preferences.availableGasTokens, // Use selected token or all available
        sendingAmount: amount,
        sendingTokenSymbol: selectedToken.symbol,
        enabled: shouldEstimateGas && !!feeDelegation?.genericDelegatorUrl,
    });
    const usedGasToken = gasEstimation?.usedToken;
    const disableConfirmButtonDuringEstimation =
        (gasEstimationLoading || !gasEstimation) &&
        connection.isConnectedWithPrivy &&
        !feeDelegation?.delegatorUrl;

    const handleGasTokenChange = React.useCallback(
        (token: GasTokenType) => {
            setSelectedGasToken(token);
            setUserSelectedGasToken(token); // Track user's choice
            // Refetch will be triggered automatically by the query key change
            setTimeout(() => refetchGasEstimation(), 100);
        },
        [refetchGasEstimation],
    );

    // hasEnoughBalance is now determined by the hook itself
    const hasEnoughBalance = !!usedGasToken && !gasEstimationError;

    // Auto-fallback: if the selected token cannot cover fees (estimation error),
    // clear selection to re-estimate across all available tokens
    // Keep userSelectedGasToken to show during loading, but actual result will show the token that succeeds
    React.useEffect(() => {
        if (gasEstimationError && selectedGasToken) {
            setSelectedGasToken(null);
        }
    }, [gasEstimationError, selectedGasToken]);

    return (
        <>
            <StickyHeaderContainer>
                <ModalHeader>Send</ModalHeader>
                <ModalBackButton
                    isDisabled={isSubmitting}
                    onClick={handleBack}
                />
                <ModalCloseButton isDisabled={isSubmitting} />
            </StickyHeaderContainer>

            <ModalBody>
                <VStack spacing={6} align="stretch" w="full">
                    {/* From/To Card */}

                    <VStack spacing={4} w="full">
                        <AddressDisplayCard
                            label={t('From')}
                            address={account?.address ?? ''}
                            domain={account?.domain}
                            imageSrc={account?.image ?? ''}
                            imageAlt="From account"
                            balance={Number(selectedToken.balance)}
                            tokenAddress={selectedToken.address}
                        />

                        <AddressDisplayCard
                            label={t('To')}
                            address={resolvedAddress || toAddressOrDomain}
                            domain={resolvedDomain}
                            imageSrc={toImageSrc ?? ''}
                            imageAlt="To account"
                            tokenAddress={selectedToken.address}
                        />

                        {connection.isConnectedWithPrivy && (
                            <GasFeeSummary
                                estimation={gasEstimation}
                                isLoading={gasEstimationLoading}
                                isLoadingTransaction={isSubmitting}
                                onTokenChange={handleGasTokenChange}
                                clauses={
                                    selectedToken.symbol === 'VET'
                                        ? vetClauses
                                        : erc20Clauses
                                }
                                userSelectedToken={userSelectedGasToken}
                            />
                        )}

                        <VStack
                            spacing={0}
                            w="full"
                            justifyContent="flex-start"
                        >
                            <Text
                                fontSize="sm"
                                fontWeight="light"
                                textAlign="left"
                                w="full"
                                color={textSecondary}
                            >
                                {t('Amount')}
                            </Text>
                            <HStack justifyContent="flex-start" w="full">
                                <Text
                                    fontSize="xl"
                                    fontWeight="semibold"
                                    textAlign="left"
                                    data-testid="send-summary-amount"
                                    color={textPrimary}
                                >
                                    {Number(amount).toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}{' '}
                                    {selectedToken.symbol}
                                </Text>
                                <Text color={textSecondary}>
                                    ≈ {formattedTotalAmount}
                                </Text>
                            </HStack>
                        </VStack>
                    </VStack>
                </VStack>
            </ModalBody>

            <ModalFooter>
                <TransactionButtonAndStatus
                    transactionError={
                        selectedToken.symbol === 'VET'
                            ? transferVETError
                            : transferERC20Error
                    }
                    isSubmitting={isSubmitting}
                    isTxWaitingConfirmation={isTxWaitingConfirmation}
                    onConfirm={handleSend}
                    transactionPendingText={t('Sending...')}
                    txReceipt={getTxReceipt()}
                    buttonText={t('Confirm')}
                    isDisabled={
                        isSubmitting || disableConfirmButtonDuringEstimation
                    }
                    gasEstimationError={gasEstimationError}
                    hasEnoughGasBalance={hasEnoughBalance}
                    isLoadingGasEstimation={gasEstimationLoading}
                    showGasEstimationError={
                        !feeDelegation?.delegatorUrl &&
                        connection.isConnectedWithPrivy
                    }
                    context="send"
                />
            </ModalFooter>
        </>
    );
};
