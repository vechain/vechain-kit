import {
    Box,
    Button,
    Container,
    Heading,
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    Text,
    VStack,
    useToken,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import {
    ModalBackButton,
    StickyHeaderContainer,
} from '@/components/common';
import { useAccountModalOptions } from '@/hooks/modals/useAccountModalOptions';
import {
    TransferHistoryItem,
    useTransferHistory,
    useWallet,
} from '@/hooks';
import { AccountModalContentTypes } from '../../Types';
import { HistoryItemRow } from './Components/HistoryItemRow';

export type TransactionHistoryContentProps = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
    tokenFilter?: { address: string; symbol: string };
};

const formatDayLabel = (timestamp: number, locale: string) =>
    new Intl.DateTimeFormat(locale, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(new Date(timestamp * 1000));

const groupByDay = (items: TransferHistoryItem[], locale: string) => {
    const groups: { label: string; items: TransferHistoryItem[] }[] = [];
    let lastKey = '';
    for (const item of items) {
        const label = formatDayLabel(item.timestamp, locale);
        if (label !== lastKey) {
            groups.push({ label, items: [item] });
            lastKey = label;
        } else {
            groups[groups.length - 1].items.push(item);
        }
    }
    return groups;
};

export const TransactionHistoryContent = ({
    setCurrentContent,
    tokenFilter,
}: TransactionHistoryContentProps) => {
    const { t, i18n } = useTranslation();
    const { account } = useWallet();
    const { isolatedView } = useAccountModalOptions();
    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');

    const {
        transfers,
        isLoading,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
        isUnsupportedNetwork,
    } = useTransferHistory(account?.address, {
        tokenAddress: tokenFilter?.address,
    });

    const groups = useMemo(
        () => groupByDay(transfers, i18n.language || 'en-US'),
        [transfers, i18n.language],
    );

    const handleItemClick = (item: TransferHistoryItem) => {
        setCurrentContent({
            type: 'transaction-detail',
            props: { setCurrentContent, item },
        });
    };

    const headerTitle = tokenFilter
        ? t('{{symbol}} history', { symbol: tokenFilter.symbol })
        : t('History');

    return (
        <>
            <StickyHeaderContainer>
                <ModalHeader>{headerTitle}</ModalHeader>
                {!isolatedView && (
                    <ModalBackButton
                        onClick={() => setCurrentContent('assets')}
                    />
                )}
                <ModalCloseButton />
            </StickyHeaderContainer>

            <Container h={['540px', 'auto']} p={0}>
                <ModalBody>
                    {isUnsupportedNetwork ? (
                        <Box py={6} textAlign="center">
                            <Text color={textSecondary}>
                                {t('History is only available on mainnet.')}
                            </Text>
                        </Box>
                    ) : isLoading ? (
                        <Text textAlign="center" color={textSecondary}>
                            {t('Loading')}…
                        </Text>
                    ) : groups.length === 0 ? (
                        <Box py={6} textAlign="center">
                            <Text color={textSecondary}>
                                {t('No transfers yet.')}
                            </Text>
                        </Box>
                    ) : (
                        <VStack spacing={4} align="stretch" w="full">
                            {groups.map((group) => (
                                <VStack
                                    key={group.label}
                                    spacing={1}
                                    align="stretch"
                                >
                                    <Heading
                                        size="xs"
                                        color={textSecondary}
                                        textTransform="uppercase"
                                    >
                                        {group.label}
                                    </Heading>
                                    {group.items.map((item) => (
                                        <HistoryItemRow
                                            key={item.id}
                                            item={item}
                                            onClick={() =>
                                                handleItemClick(item)
                                            }
                                        />
                                    ))}
                                </VStack>
                            ))}
                            {hasNextPage && (
                                <Button
                                    variant="vechainKitSecondary"
                                    size="sm"
                                    isLoading={isFetchingNextPage}
                                    onClick={() => fetchNextPage()}
                                >
                                    {t('Load more')}
                                </Button>
                            )}
                        </VStack>
                    )}
                </ModalBody>
            </Container>
        </>
    );
};
