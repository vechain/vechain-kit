import {
    Box,
    Button,
    Container,
    HStack,
    Heading,
    Icon,
    Image,
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    Text,
    VStack,
    useToken,
} from '@chakra-ui/react';
import { LuExternalLink, LuSparkles } from 'react-icons/lu';
import { useTranslation } from 'react-i18next';
import {
    AddressOrDomainLabel,
    CopyIconButton,
    ModalBackButton,
    StickyHeaderContainer,
} from '@/components/common';
import { useAccountModalOptions } from '@/hooks/modals/useAccountModalOptions';
import { useCurrency, TransferHistoryItem } from '@/hooks';
import { useAppConfig } from '@/providers';
import { TOKEN_LOGOS } from '@/utils/constants';
import { humanAddress } from '@/utils/formattingUtils';
import {
    formatCompactCurrency,
    SupportedCurrency,
} from '@/utils/currencyUtils';
import { useTokenPrices } from '@/hooks';
import { AccountModalContentTypes } from '../../Types';

export type TransactionDetailContentProps = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
    item: TransferHistoryItem;
};

const formatFullDate = (timestamp: number, locale: string) =>
    new Intl.DateTimeFormat(locale, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    }).format(new Date(timestamp * 1000));

const Row = ({
    label,
    value,
    copyValue,
}: {
    label: string;
    value: React.ReactNode;
    copyValue?: string;
}) => {
    const labelColor = useToken('colors', 'vechain-kit-text-secondary');
    const valueColor = useToken('colors', 'vechain-kit-text-primary');
    return (
        <HStack w="full" justify="space-between" align="center">
            <Text fontSize="sm" color={labelColor}>
                {label}
            </Text>
            <HStack spacing={1} align="center">
                {typeof value === 'string' ? (
                    <Text fontSize="sm" color={valueColor} fontWeight="500">
                        {value}
                    </Text>
                ) : (
                    value
                )}
                {copyValue && (
                    <CopyIconButton
                        value={copyValue}
                        ariaLabel={`Copy ${label}`}
                    />
                )}
            </HStack>
        </HStack>
    );
};

export const TransactionDetailContent = ({
    setCurrentContent,
    item,
}: TransactionDetailContentProps) => {
    const { t, i18n } = useTranslation();
    const { isolatedView } = useAccountModalOptions();
    const config = useAppConfig();
    const { currentCurrency } = useCurrency();
    const { prices, exchangeRates } = useTokenPrices();
    const successColor = useToken('colors', 'vechain-kit-success');
    const errorColor = useToken('colors', 'vechain-kit-error');

    const sent = item.direction === 'sent';
    const sign = sent ? '-' : '+';
    const amountColor = sent ? errorColor : successColor;
    const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
    const fromZero =
        !sent && item.from.toLowerCase() === ZERO_ADDRESS;
    const placeholderColor = useToken('colors', 'vechain-kit-text-secondary');

    const priceKey = (item.tokenAddress ?? '0x').toLowerCase();
    const priceUsd = prices[priceKey] ?? 0;
    const usdValue = item.amount * priceUsd;
    const valueInCurrency = (() => {
        if (currentCurrency === 'eur') {
            return usdValue * (exchangeRates?.eurUsdPrice ?? 1);
        }
        if (currentCurrency === 'gbp') {
            return usdValue * (exchangeRates?.gbpUsdPrice ?? 1);
        }
        return usdValue;
    })();

    const explorerUrl = `${config.explorerUrl}/${item.txId}`;

    const handleBack = () =>
        setCurrentContent({
            type: 'transaction-history',
            props: { setCurrentContent },
        });

    return (
        <>
            <StickyHeaderContainer>
                <ModalHeader>{sent ? t('Sent') : t('Received')}</ModalHeader>
                {!isolatedView && <ModalBackButton onClick={handleBack} />}
                <ModalCloseButton />
            </StickyHeaderContainer>

            <Container h={['540px', 'auto']} p={0}>
                <ModalBody>
                    <VStack spacing={6} align="stretch" w="full">
                        <HStack spacing={3}>
                            {fromZero ? (
                                <Box
                                    boxSize="40px"
                                    borderRadius="full"
                                    bg="whiteAlpha.300"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    <Icon
                                        as={LuSparkles}
                                        boxSize={5}
                                        color={placeholderColor}
                                    />
                                </Box>
                            ) : TOKEN_LOGOS[item.tokenSymbol] ? (
                                <Image
                                    src={TOKEN_LOGOS[item.tokenSymbol]}
                                    alt={item.tokenSymbol}
                                    boxSize="40px"
                                    borderRadius="full"
                                    fallback={
                                        <Box
                                            boxSize="40px"
                                            borderRadius="full"
                                            bg="whiteAlpha.300"
                                        />
                                    }
                                />
                            ) : (
                                <Box
                                    boxSize="40px"
                                    borderRadius="full"
                                    bg="whiteAlpha.300"
                                />
                            )}
                            <VStack spacing={0} align="flex-start">
                                <Heading
                                    size="md"
                                    color={amountColor}
                                    fontWeight="700"
                                >
                                    {sign}
                                    {item.amount.toLocaleString(undefined, {
                                        maximumFractionDigits: 4,
                                    })}{' '}
                                    {item.tokenSymbol}
                                </Heading>
                                <Text fontSize="sm" opacity={0.7}>
                                    ={' '}
                                    {formatCompactCurrency(valueInCurrency, {
                                        currency:
                                            currentCurrency as SupportedCurrency,
                                    })}
                                </Text>
                            </VStack>
                        </HStack>

                        <VStack
                            w="full"
                            align="stretch"
                            spacing={3}
                            p={4}
                            borderRadius="xl"
                            bg="vechain-kit-card"
                        >
                            <Row
                                label={t('Date')}
                                value={formatFullDate(
                                    item.timestamp,
                                    i18n.language || 'en-US',
                                )}
                            />
                            <Row
                                label={t('Status')}
                                value={
                                    <Text
                                        color={successColor}
                                        fontWeight="600"
                                    >
                                        {t('Succeeded')}
                                    </Text>
                                }
                            />
                            <Row
                                label={t('From')}
                                value={
                                    <AddressOrDomainLabel
                                        address={item.from}
                                        headLen={6}
                                        tailLen={6}
                                        fontSize="sm"
                                        fontWeight="500"
                                    />
                                }
                                copyValue={item.from}
                            />
                            <Row
                                label={t('To')}
                                value={
                                    <AddressOrDomainLabel
                                        address={item.to}
                                        headLen={6}
                                        tailLen={6}
                                        fontSize="sm"
                                        fontWeight="500"
                                    />
                                }
                                copyValue={item.to}
                            />
                            <Row
                                label={t('Hash')}
                                value={humanAddress(item.txId, 6, 6)}
                                copyValue={item.txId}
                            />
                        </VStack>

                        <Button
                            as="a"
                            href={explorerUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="vechainKitSecondary"
                            leftIcon={<LuExternalLink />}
                        >
                            {t('View on explorer')}
                        </Button>
                    </VStack>
                </ModalBody>
            </Container>
        </>
    );
};
