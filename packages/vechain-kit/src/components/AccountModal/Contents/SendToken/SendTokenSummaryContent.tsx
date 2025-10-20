import {
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    VStack,
    Text,
    HStack,
    Divider,
    ModalFooter,
} from '@chakra-ui/react';
import {
    ModalBackButton,
    StickyHeaderContainer,
    AddressDisplayCard,
    TransactionButtonAndStatus,
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
    useTokenBalances
} from '@/hooks';
import { ExchangeWarningAlert } from '@/components';
import { useTranslation } from 'react-i18next';
import { useVeChainKitConfig } from '@/providers';
import { useGetAvatarOfAddress } from '@/hooks/api/vetDomains';
import { useMemo } from 'react';
import { Analytics } from '@/utils/mixpanelClientInstance';
import { isRejectionError } from '@/utils/stringUtils';
import { GasFeeSummary } from '@/components/common/GasFeeSummary';

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
    const { data: upgradeRequired } = useUpgradeRequired(
        account?.address ?? '',
        connectedWallet?.address ?? '',
        3,
    );
    const { open: openUpgradeSmartAccountModal } =
        useUpgradeSmartAccountModal();
    const { balances } = useTokenBalances(account?.address ?? '');
    let showCostBreakdown = false;
    if (connection.isConnectedWithPrivy && !feeDelegation?.delegatorUrl) {
        showCostBreakdown = preferences.showCostBreakdown;
    }
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

    const shouldEstimateGas = preferences.availableGasTokens.length > 0 && (connection.isConnectedWithPrivy || connection.isConnectedWithVeChain) && !feeDelegation?.delegatorUrl;
    const {
        data: gasEstimation,
        isLoading: gasEstimationLoading,
        error: gasEstimationError,
    } = useGasEstimation({
        clauses: selectedToken.symbol === 'VET' ? vetClauses : erc20Clauses,
        token: preferences.availableGasTokens[0],
        enabled: shouldEstimateGas && !!feeDelegation?.genericDelegatorUrl,
    });
    const totalCost = gasEstimation?.transactionCost;
    const hasEnoughBalance = shouldEstimateGas ? (
        selectedToken.symbol === preferences.availableGasTokens[0]
            ? (typeof totalCost === 'number' && (totalCost + Number(amount)) < Number(selectedToken.balance)) // case where both token being sent and gas token are the same
            : (typeof totalCost === 'number' && (totalCost + Number(amount)) < Number(balances.find(token => token.symbol === preferences.availableGasTokens[0])?.balance)) // case where token being sent and gas token are different
    ) : undefined;

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
                    {connection.isConnectedWithPrivy && (
                        <ExchangeWarningAlert />
                    )}
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

                        <Divider />
                        <VStack
                            spacing={0}
                            w="full"
                            justifyContent="flex-start"
                            p={2}
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
                                    ≈{' '}
                                    {formattedTotalAmount}
                                </Text>
                            </HStack>
                        </VStack>
                        {feeDelegation?.genericDelegatorUrl && showCostBreakdown && gasEstimation && (
                            <GasFeeSummary 
                                gasToken={preferences.availableGasTokens[0]}
                                estimation={gasEstimation}
                                error={gasEstimationError}
                                isLoading={gasEstimationLoading}
                            />
                        )}
                    </VStack>
                </VStack>
            </ModalBody>

            <ModalFooter>
                {((!feeDelegation?.delegatorUrl && hasEnoughBalance) || feeDelegation?.delegatorUrl || connection.isConnectedWithDappKit) && (
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
                {(!feeDelegation?.delegatorUrl && !hasEnoughBalance && connection.isConnectedWithPrivy && !gasEstimationLoading) && (
                    <Text color="red.500">
                        {t('You do not have enough {{token}} to cover the gas fee and the transaction. Please check to see that you have gas tokens enabled in Gas Token Preferences or add more funds to your wallet and try again.', {token: preferences.availableGasTokens[0]})}
                    </Text>
                )}
            </ModalFooter>
        </>
    );
};
