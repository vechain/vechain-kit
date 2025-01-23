import {
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    VStack,
    Button,
    Text,
    HStack,
    Divider,
    Alert,
    AlertIcon,
    ModalFooter,
    useDisclosure,
    Icon,
} from '@chakra-ui/react';
import {
    ModalBackButton,
    StickyHeaderContainer,
    AddressDisplayCard,
} from '@/components/common';
import { AccountModalContentTypes } from '../../Types';
import { getPicassoImage } from '@/utils';
import { useTransferERC20, useTransferVET, useWallet } from '@/hooks';
import { TransactionModal } from '@/components';
import { GiConfirmed } from 'react-icons/gi';
import { useTranslation } from 'react-i18next';
import { useVeChainKitConfig } from '@/providers';

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
    selectedToken: {
        symbol: string;
        balance: string;
        address: string;
        numericBalance: number;
        price: number;
    };
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
    const { darkMode: isDark } = useVeChainKitConfig();
    const { account, connection } = useWallet();
    const transactionModal = useDisclosure();

    const transferERC20 = useTransferERC20({
        fromAddress: account?.address ?? '',
        receiverAddress: resolvedAddress || toAddressOrDomain,
        amount,
        tokenAddress: selectedToken.address,
        tokenName: selectedToken.symbol,
    });

    const transferVET = useTransferVET({
        fromAddress: account?.address ?? '',
        receiverAddress: resolvedAddress || toAddressOrDomain,
        amount,
    });

    const handleSend = async () => {
        transactionModal.onOpen();
        try {
            if (selectedToken.symbol === 'VET') {
                await transferVET.sendTransaction();
            } else {
                await transferERC20.sendTransaction();
            }
        } catch (error) {
            console.error(t('Transaction failed:'), error);
        }
    };

    const { status, error, txReceipt } =
        selectedToken.symbol === 'VET' ? transferVET : transferERC20;

    return (
        <>
            <StickyHeaderContainer>
                <ModalHeader
                    fontSize={'md'}
                    fontWeight={'500'}
                    textAlign={'center'}
                    color={isDark ? '#dfdfdd' : '#4d4d4d'}
                >
                    Send
                </ModalHeader>
                <ModalBackButton
                    onClick={() =>
                        setCurrentContent({
                            type: 'send-token',
                            props: {
                                setCurrentContent,
                            },
                        })
                    }
                />
                <ModalCloseButton />
            </StickyHeaderContainer>

            <ModalBody>
                <VStack spacing={6} align="stretch" w="full">
                    {connection.isConnectedWithPrivy && (
                        <Alert
                            status="warning"
                            fontSize={'xs'}
                            borderRadius={'xl'}
                        >
                            <AlertIcon />
                            {t(
                                'Sending to OceanX or other exchanges may result in loss of funds. Send the tokens to your VeWorld wallet first.',
                            )}
                        </Alert>
                    )}
                    {/* From/To Card */}

                    <VStack spacing={4} w="full">
                        <AddressDisplayCard
                            label={t('From')}
                            address={account?.address ?? ''}
                            domain={account?.domain}
                            imageSrc={account?.image ?? ''}
                            imageAlt="From account"
                            balance={selectedToken.numericBalance}
                            symbol={selectedToken.symbol}
                        />

                        <AddressDisplayCard
                            label={t('To')}
                            address={resolvedAddress || toAddressOrDomain}
                            domain={resolvedDomain}
                            imageSrc={getPicassoImage(
                                resolvedAddress || toAddressOrDomain,
                            )}
                            imageAlt="To account"
                            symbol={selectedToken.symbol}
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

            {/* <StickyFooterContainer> */}
            <ModalFooter>
                <Button
                    px={4}
                    width="full"
                    height="60px"
                    variant="solid"
                    borderRadius="xl"
                    colorScheme="blue"
                    onClick={handleSend}
                    rightIcon={<Icon as={GiConfirmed} />}
                >
                    {t('Confirm')}
                </Button>
            </ModalFooter>
            {/* </StickyFooterContainer> */}

            <TransactionModal
                isOpen={transactionModal.isOpen}
                onClose={() => {
                    transactionModal.onClose();
                    setCurrentContent('main');
                }}
                status={status}
                txId={txReceipt?.meta.txID}
                errorDescription={error?.reason ?? t('Unknown error')}
                showExplorerButton={true}
                showSocialButtons={true}
                showTryAgainButton={true}
                onTryAgain={handleSend}
            />
        </>
    );
};
