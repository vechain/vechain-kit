import React, { useMemo } from 'react';
import {
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    VStack,
    Text,
    HStack,
    ModalFooter,
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
    useGasEstimation,
} from '@/hooks';
import { ExchangeWarningAlert } from '@/components';
import { useTranslation } from 'react-i18next';
import { useVeChainKitConfig } from '@/providers';
import { useGetAvatarOfAddress } from '@/hooks/api/vetDomains';
import { Analytics } from '@/utils/mixpanelClientInstance';
import { isRejectionError } from '@/utils/stringUtils';
import { showGasFees } from '@/utils/constants';
import { GasTokenType } from '@/types/gasToken';

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
    const showGasFeeSummary = showGasFees(
        connection.isConnectedWithPrivy,
        !!feeDelegation?.delegatorUrl,
    );
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
            Analytics.send.flow('review', {
                tokenSymbol: selectedToken.symbol,
                amount,
                recipientAddress: resolvedAddress || toAddressOrDomain,
                recipientType: resolvedDomain ? 'domain' : 'address',
            });

            if (selectedToken.symbol === 'VET') {
                await transferVET();
            } else {
                await transferERC20();
            }
        } catch (error) {
            Analytics.send.flow('review', {
                tokenSymbol: selectedToken.symbol,
                error: error instanceof Error ? error.message : 'Unknown error',
            });
            console.error(t('Transaction failed:'), error);
        }
    };

    const handleSuccess = (txId: string) => {
        Analytics.send.flow('confirmation', {
            tokenSymbol: selectedToken.symbol,
            amount,
            recipientAddress: resolvedAddress || toAddressOrDomain,
            recipientType: resolvedDomain ? 'domain' : 'address',
        });

        Analytics.send.completed(
            selectedToken.symbol,
            amount,
            txId,
            selectedToken.symbol === 'VET' ? 'vet' : 'erc20',
        );

        setCurrentContent({
            type: 'successful-operation',
            props: {
                setCurrentContent,
                txId,
                title: t('Transaction successful'),
                onDone: () => {
                    setCurrentContent('main');
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
        Analytics.send.flow('review', {
            tokenSymbol: selectedToken.symbol,
            amount,
            recipientAddress: resolvedAddress || toAddressOrDomain,
            recipientType: resolvedDomain ? 'domain' : 'address',
            error: 'back_button',
            isError: false,
        });
        setCurrentContent({
            type: 'send-token',
            props: {
                setCurrentContent,
                preselectedToken: selectedToken,
            },
        });
    };

    const handleClose = () => {
        Analytics.send.flow('review', {
            tokenSymbol: selectedToken.symbol,
            amount,
            recipientAddress: resolvedAddress || toAddressOrDomain,
            recipientType: resolvedDomain ? 'domain' : 'address',
            error: 'modal_closed',
            isError: false,
        });
    };

    const handleError = (error: string) => {
        if (error && isRejectionError(error)) {
            Analytics.send.flow('review', {
                tokenSymbol: selectedToken.symbol,
                amount,
                recipientAddress: resolvedAddress || toAddressOrDomain,
                recipientType: resolvedDomain ? 'domain' : 'address',
                error: 'wallet_rejected',
                isError: true,
            });
        } else {
            Analytics.send.flow('review', {
                tokenSymbol: selectedToken.symbol,
                amount,
                recipientAddress: resolvedAddress || toAddressOrDomain,
                recipientType: resolvedDomain ? 'domain' : 'address',
                error,
                isError: true,
            });
        }
    };

    const [selectedGasToken, setSelectedGasToken] =
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
    } = useGasEstimation({
        clauses: selectedToken.symbol === 'VET' ? vetClauses : erc20Clauses,
        tokens: selectedGasToken
            ? [selectedGasToken]
            : preferences.availableGasTokens, // Use selected token or all available
        sendingAmount: amount,
        sendingTokenSymbol: selectedToken.symbol,
        enabled: shouldEstimateGas && !!feeDelegation?.genericDelegatorUrl,
    });
    const usedGasToken = gasEstimation?.usedToken;

    const handleGasTokenChange = React.useCallback(
        (token: GasTokenType) => {
            setSelectedGasToken(token);
            // Refetch will be triggered automatically by the query key change
            setTimeout(() => refetchGasEstimation(), 100);
        },
        [refetchGasEstimation],
    );

    // hasEnoughBalance is now determined by the hook itself
    const hasEnoughBalance = !!usedGasToken && !gasEstimationError;

    return (
        <>
            <StickyHeaderContainer>
                <ModalHeader>Send</ModalHeader>
                <ModalBackButton
                    isDisabled={isSubmitting}
                    onClick={handleBack}
                />
                <ModalCloseButton
                    isDisabled={isSubmitting}
                    onClick={handleClose}
                />
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

                        {feeDelegation?.genericDelegatorUrl &&
                            showGasFeeSummary &&
                            gasEstimation &&
                            usedGasToken && (
                                <GasFeeSummary
                                    estimation={gasEstimation}
                                    isLoading={gasEstimationLoading}
                                    onTokenChange={handleGasTokenChange}
                                    clauses={
                                        selectedToken.symbol === 'VET'
                                            ? vetClauses
                                            : erc20Clauses
                                    }
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
                            >
                                {t('Amount')}
                            </Text>
                            <HStack justifyContent="flex-start" w="full">
                                <Text
                                    fontSize="xl"
                                    fontWeight="semibold"
                                    textAlign="left"
                                    data-testid="send-summary-amount"
                                >
                                    {Number(amount).toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}{' '}
                                    {selectedToken.symbol}
                                </Text>
                                <Text opacity={0.5}>
                                    ≈ {formattedTotalAmount}
                                </Text>
                            </HStack>
                        </VStack>
                    </VStack>
                </VStack>
            </ModalBody>

            <ModalFooter>
                <VStack spacing={4} w="full">
                    {((!feeDelegation?.delegatorUrl && hasEnoughBalance) ||
                        feeDelegation?.delegatorUrl ||
                        connection.isConnectedWithDappKit) && (
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
                            isDisabled={isSubmitting}
                        />
                    )}
                    {!feeDelegation?.delegatorUrl &&
                        !hasEnoughBalance &&
                        connection.isConnectedWithPrivy &&
                        !gasEstimationLoading && (
                            <Text color="red.500">
                                {gasEstimationError
                                    ? t(
                                          'Unable to find a gas token with sufficient balance. Please enable more gas tokens in Gas Token Preferences or add funds to your wallet and try again.',
                                      )
                                    : t(
                                          "You don't have any gas tokens enabled. Please enable at least one gas token in Gas Token Preferences.",
                                      )}
                            </Text>
                        )}

                    {connection.isConnectedWithPrivy && (
                        <ExchangeWarningAlert />
                    )}
                </VStack>
            </ModalFooter>
        </>
    );
};
