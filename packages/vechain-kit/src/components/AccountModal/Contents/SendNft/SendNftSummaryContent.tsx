import React, { useMemo } from 'react';
import {
    AspectRatio,
    Box,
    HStack,
    Image,
    ModalBody,
    ModalCloseButton,
    ModalFooter,
    ModalHeader,
    Skeleton,
    Text,
    VStack,
    useToken,
} from '@chakra-ui/react';
import {
    ModalBackButton,
    StickyHeaderContainer,
    AddressDisplayCard,
    TransactionButtonAndStatus,
    GasFeeSummary,
} from '@/components/common';
import { useTranslation } from 'react-i18next';
import {
    useTransferERC721,
    useUpgradeRequired,
    useUpgradeSmartAccountModal,
    useWallet,
    useGasTokenSelection,
    useGenericDelegatorFeeEstimation,
} from '@/hooks';
import { useGetAvatarOfAddress } from '@/hooks/api/vetDomains';
import { useAccountModalOptions } from '@/hooks/modals/useAccountModalOptions';
import { useVeChainKitConfig } from '@/providers';
import { getPicassoImage } from '@/utils';
import { GasTokenType } from '@/types/gasToken';
import { OwnedNft } from '@/hooks/api/nfts';
import { AccountModalContentTypes } from '../../Types';

export type SendNftSummaryContentProps = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
    nft: OwnedNft;
    collectionName?: string;
    imageUrl?: string;
    toAddressOrDomain: string;
    resolvedDomain?: string;
    resolvedAddress?: string;
};

export const SendNftSummaryContent = ({
    setCurrentContent,
    nft,
    collectionName,
    imageUrl,
    toAddressOrDomain,
    resolvedDomain,
    resolvedAddress,
}: SendNftSummaryContentProps) => {
    const { t } = useTranslation();
    const { account, connection, connectedWallet } = useWallet();
    const { data: avatar } = useGetAvatarOfAddress(resolvedAddress ?? '');
    const { feeDelegation } = useVeChainKitConfig();
    const { preferences } = useGasTokenSelection();
    const { isolatedView, closeAccountModal } = useAccountModalOptions();

    const textPrimary = useToken('colors', 'vechain-kit-text-primary');
    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');
    const cardBg = useToken('colors', 'vechain-kit-card');

    const { data: upgradeRequired } = useUpgradeRequired(
        account?.address ?? '',
        connectedWallet?.address ?? '',
        3,
    );
    const { open: openUpgradeSmartAccountModal } =
        useUpgradeSmartAccountModal();

    const toImageSrc = useMemo(() => {
        if (avatar) return avatar;
        return getPicassoImage(resolvedAddress || toAddressOrDomain);
    }, [avatar, resolvedAddress, toAddressOrDomain]);

    const displayName = `${collectionName ?? 'NFT'} #${nft.tokenId}`;

    const handleError = (error: string) => {
        console.error('NFT transfer failed:', error);
    };

    const {
        sendTransaction: transferERC721,
        txReceipt,
        error: transferError,
        isWaitingForWalletConfirmation,
        isTransactionPending,
        clauses,
    } = useTransferERC721({
        fromAddress: account?.address ?? '',
        receiverAddress: resolvedAddress || toAddressOrDomain,
        collectionAddress: nft.collectionAddress,
        tokenId: nft.tokenId,
        collectionName,
        onError: (e) => handleError(e ?? ''),
    });

    const isTxWaitingConfirmation = isWaitingForWalletConfirmation;
    const isSubmitting = isTxWaitingConfirmation || isTransactionPending;

    const handleSend = async () => {
        if (upgradeRequired) {
            openUpgradeSmartAccountModal();
            return;
        }
        try {
            await transferERC721();
        } catch (error) {
            console.error(t('Transaction failed:'), error);
        }
    };

    const handleSuccess = React.useCallback(
        (txId: string) => {
            const recipientLabel =
                resolvedDomain || resolvedAddress || toAddressOrDomain;
            setCurrentContent({
                type: 'successful-operation',
                props: {
                    setCurrentContent,
                    txId,
                    title: t('NFT sent'),
                    description: t(
                        '{{nft}} is now in {{recipient}}’s wallet.',
                        {
                            nft: displayName,
                            recipient: recipientLabel,
                        },
                    ),
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
        },
        [
            setCurrentContent,
            t,
            isolatedView,
            closeAccountModal,
            displayName,
            resolvedDomain,
            resolvedAddress,
            toAddressOrDomain,
        ],
    );

    const [hasShownSuccess, setHasShownSuccess] = React.useState(false);
    React.useEffect(() => {
        if (!txReceipt) return;
        if (txReceipt.reverted) return;
        if (hasShownSuccess) return;
        if (isSubmitting) return;
        const txId = txReceipt.meta.txID;
        if (!txId) return;
        setHasShownSuccess(true);
        handleSuccess(txId);
    }, [txReceipt, hasShownSuccess, isSubmitting, handleSuccess]);

    React.useEffect(() => {
        if (isSubmitting) setHasShownSuccess(false);
    }, [isSubmitting]);

    const handleBack = () => {
        setCurrentContent({
            type: 'send-nft',
            props: {
                setCurrentContent,
                nft,
                collectionName,
                imageUrl,
                initialToAddressOrDomain: toAddressOrDomain,
            },
        });
    };

    const [selectedGasToken, setSelectedGasToken] =
        React.useState<GasTokenType | null>(null);
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
        clauses,
        tokens: selectedGasToken
            ? [selectedGasToken]
            : preferences.availableGasTokens,
        sendingAmount: '0',
        sendingTokenSymbol: 'NFT',
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
            setUserSelectedGasToken(token);
            setTimeout(() => refetchGasEstimation(), 100);
        },
        [refetchGasEstimation],
    );

    const hasEnoughBalance = !!usedGasToken && !gasEstimationError;

    React.useEffect(() => {
        if (gasEstimationError && selectedGasToken) {
            setSelectedGasToken(null);
        }
    }, [gasEstimationError, selectedGasToken]);

    return (
        <>
            <StickyHeaderContainer>
                <ModalHeader>{t('Send NFT')}</ModalHeader>
                <ModalBackButton
                    isDisabled={isSubmitting}
                    onClick={handleBack}
                />
                <ModalCloseButton isDisabled={isSubmitting} />
            </StickyHeaderContainer>

            <ModalBody>
                <VStack spacing={6} align="stretch" w="full">
                    <HStack spacing={3} bg={cardBg} p={3} borderRadius="xl">
                        <Box w="64px" flexShrink={0}>
                            <AspectRatio ratio={1} w="64px">
                                {imageUrl ? (
                                    <Image
                                        src={imageUrl}
                                        alt={displayName}
                                        objectFit="cover"
                                        borderRadius="md"
                                        fallback={
                                            <Skeleton borderRadius="md" />
                                        }
                                    />
                                ) : (
                                    <Skeleton borderRadius="md" />
                                )}
                            </AspectRatio>
                        </Box>
                        <VStack spacing={0} align="stretch" flex={1}>
                            <Text
                                fontWeight="600"
                                color={textPrimary}
                                noOfLines={1}
                            >
                                {displayName}
                            </Text>
                            <Text fontSize="sm" color={textSecondary}>
                                #{nft.tokenId}
                            </Text>
                        </VStack>
                    </HStack>

                    <Box w="full">
                        <Text fontSize="sm" mb={2} color={textSecondary}>
                            {t('From')}
                        </Text>
                        <AddressDisplayCard
                            address={account?.address ?? ''}
                            domain={account?.domain}
                            imageSrc={account?.image ?? ''}
                            imageAlt="From account"
                            hideAddress={false}
                        />
                    </Box>

                    <Box w="full">
                        <Text fontSize="sm" mb={2} color={textSecondary}>
                            {t('To')}
                        </Text>
                        <AddressDisplayCard
                            address={resolvedAddress || toAddressOrDomain}
                            domain={resolvedDomain}
                            imageSrc={toImageSrc ?? ''}
                            imageAlt="To account"
                        />
                    </Box>

                    {connection.isConnectedWithPrivy && (
                        <GasFeeSummary
                            estimation={gasEstimation}
                            isLoading={gasEstimationLoading}
                            isLoadingTransaction={isSubmitting}
                            onTokenChange={handleGasTokenChange}
                            clauses={clauses}
                            userSelectedToken={userSelectedGasToken}
                        />
                    )}
                </VStack>
            </ModalBody>

            <ModalFooter>
                <TransactionButtonAndStatus
                    transactionError={transferError}
                    isSubmitting={isSubmitting}
                    isTxWaitingConfirmation={isTxWaitingConfirmation}
                    onConfirm={handleSend}
                    transactionPendingText={t('Sending...')}
                    txReceipt={txReceipt}
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
