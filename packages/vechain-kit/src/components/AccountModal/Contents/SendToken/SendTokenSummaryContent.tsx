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
} from '@/hooks';
import { ExchangeWarningAlert } from '@/components';
import { useTranslation } from 'react-i18next';
import { useVeChainKitConfig } from '@/providers';
import { useGetAvatarOfAddress } from '@/hooks/api/vetDomains';
import { useMemo } from 'react';
import { Token } from './SelectTokenContent';

const compactFormatter = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 2,
});

const summaryFormatter = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 18,
});

export type SendTokenSummaryContentProps = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
    toAddressOrDomain: string;
    resolvedDomain?: string;
    resolvedAddress?: string;
    amount: string;
    selectedToken: Token;
};

export const SendTokenSummaryContent = ({
    setCurrentContent,
    toAddressOrDomain,
    resolvedDomain,
    resolvedAddress,
    amount,
    selectedToken,
}: SendTokenSummaryContentProps) => {
    const { t } = useTranslation();
    const { account, connection, connectedWallet } = useWallet();
    const { data: avatar } = useGetAvatarOfAddress(resolvedAddress ?? '');
    const { network } = useVeChainKitConfig();
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

    const {
        sendTransaction: transferERC20,
        txReceipt: transferERC20Receipt,
        error: transferERC20Error,
        isWaitingForWalletConfirmation:
            transferERC20WaitingForWalletConfirmation,
        isTransactionPending: transferERC20Pending,
    } = useTransferERC20({
        fromAddress: account?.address ?? '',
        receiverAddress: resolvedAddress || toAddressOrDomain,
        amount,
        tokenAddress: selectedToken.address,
        tokenName: selectedToken.symbol,
        onSuccess: () => {
            setCurrentContent({
                type: 'successful-operation',
                props: {
                    setCurrentContent,
                    txId: transferERC20Receipt?.meta.txID,
                    title: t('Transaction successful'),
                    onDone: () => {
                        setCurrentContent('main');
                    },
                    showSocialButtons: true,
                },
            });
        },
    });

    const {
        sendTransaction: transferVET,
        txReceipt: transferVETReceipt,
        error: transferVETError,
        isWaitingForWalletConfirmation: transferVETWaitingForWalletConfirmation,
        isTransactionPending: transferVETPending,
    } = useTransferVET({
        fromAddress: account?.address ?? '',
        receiverAddress: resolvedAddress || toAddressOrDomain,
        amount,
        onSuccess: () => {
            setCurrentContent({
                type: 'successful-operation',
                props: {
                    setCurrentContent,
                    txId: transferVETReceipt?.meta.txID,
                    title: t('Transaction successful'),
                    onDone: () => {
                        setCurrentContent('main');
                    },
                    showSocialButtons: true,
                },
            });
        },
        onError: () => {
            // Handle error internally
        },
    });

    const getTxReceipt = () => {
        return selectedToken.symbol === 'VET'
            ? transferVETReceipt
            : transferERC20Receipt;
    };

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

    const isTxWaitingConfirmation =
        transferERC20WaitingForWalletConfirmation ||
        transferVETWaitingForWalletConfirmation;
    const isSubmitting =
        isTxWaitingConfirmation || transferERC20Pending || transferVETPending;

    return (
        <>
            <StickyHeaderContainer>
                <ModalHeader>Send</ModalHeader>
                <ModalBackButton
                    isDisabled={isSubmitting}
                    onClick={() =>
                        setCurrentContent({
                            type: 'send-token',
                            props: {
                                setCurrentContent,
                            },
                        })
                    }
                />
                <ModalCloseButton isDisabled={isSubmitting} />
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
                            balance={Number(selectedToken.numericBalance)}
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
                                >
                                    {summaryFormatter.format(Number(amount))}{' '}
                                    {selectedToken.symbol}
                                </Text>
                                <Text fontSize="sm" opacity={0.5}>
                                    ≈ $
                                    {compactFormatter.format(
                                        Number(amount) * selectedToken.price,
                                    )}
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
                    isDisabled={isSubmitting}
                />
            </ModalFooter>
        </>
    );
};
