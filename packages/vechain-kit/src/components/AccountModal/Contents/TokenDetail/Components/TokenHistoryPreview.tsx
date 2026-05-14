import { Box, Button, HStack, Heading, Text, VStack, useToken } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useTokenTransferHistory, TransferHistoryItem, useWallet } from '@/hooks';
import { HistoryItemRow } from '../../TransactionHistory/Components/HistoryItemRow';

type Props = {
    tokenAddress: string;
    onItemClick: (item: TransferHistoryItem) => void;
    onSeeAll: () => void;
};

export const TokenHistoryPreview = ({
    tokenAddress,
    onItemClick,
    onSeeAll,
}: Props) => {
    const { t } = useTranslation();
    const { account } = useWallet();
    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');
    const { transfers, isLoading, isUnsupportedNetwork } =
        useTokenTransferHistory(account?.address, tokenAddress);

    const preview = transfers.slice(0, 5);

    return (
        <VStack w="full" align="stretch" spacing={3}>
            <HStack w="full" justify="space-between" align="center">
                <Heading size="sm">{t('Token History')}</Heading>
                {transfers.length > 5 && (
                    <Button
                        variant="link"
                        size="sm"
                        fontWeight="500"
                        onClick={onSeeAll}
                    >
                        {t('See all')}
                    </Button>
                )}
            </HStack>

            {isUnsupportedNetwork ? (
                <Box py={4} textAlign="center">
                    <Text fontSize="sm" color={textSecondary}>
                        {t('History is only available on mainnet.')}
                    </Text>
                </Box>
            ) : isLoading ? (
                <Text fontSize="sm" color={textSecondary} textAlign="center">
                    {t('Loading')}…
                </Text>
            ) : preview.length === 0 ? (
                <Text fontSize="sm" color={textSecondary} textAlign="center">
                    {t('No transfers yet.')}
                </Text>
            ) : (
                preview.map((item) => (
                    <HistoryItemRow
                        key={item.id}
                        item={item}
                        onClick={() => onItemClick(item)}
                    />
                ))
            )}
        </VStack>
    );
};
