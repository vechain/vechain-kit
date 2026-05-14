import {
    Box,
    Button,
    HStack,
    Icon,
    Image,
    Text,
    VStack,
    useToken,
} from '@chakra-ui/react';
import { LuSparkles } from 'react-icons/lu';
import { useTranslation } from 'react-i18next';
import { TransferHistoryItem } from '@/hooks';
import { TOKEN_LOGOS } from '@/utils/constants';
import { AddressOrDomainLabel } from '@/components/common';

type Props = {
    item: TransferHistoryItem;
    onClick?: () => void;
};

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

const isZeroAddress = (address: string) =>
    address.toLowerCase() === ZERO_ADDRESS;

export const HistoryItemRow = ({ item, onClick }: Props) => {
    const { t } = useTranslation();
    const textPrimary = useToken('colors', 'vechain-kit-text-primary');
    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');
    const success = useToken('colors', 'vechain-kit-success');
    const error = useToken('colors', 'vechain-kit-error');

    const sent = item.direction === 'sent';
    const sign = sent ? '-' : '+';
    const amountColor = sent ? error : success;
    const counterparty = sent ? item.to : item.from;
    const formattedAmount = item.amount.toLocaleString(undefined, {
        maximumFractionDigits: 4,
    });
    const fromZero = !sent && isZeroAddress(item.from);
    const logo = TOKEN_LOGOS[item.tokenSymbol];

    return (
        <Button
            variant="ghost"
            h="64px"
            w="full"
            justifyContent="space-between"
            px={2}
            onClick={onClick}
            isDisabled={!onClick}
            _disabled={{ cursor: 'default', opacity: 1 }}
        >
            <HStack spacing={3} flex={1} minW={0}>
                {fromZero ? (
                    <Box
                        boxSize="32px"
                        borderRadius="full"
                        bg="whiteAlpha.300"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        flexShrink={0}
                    >
                        <Icon
                            as={LuSparkles}
                            boxSize={4}
                            color={textSecondary}
                        />
                    </Box>
                ) : logo ? (
                    <Image
                        src={logo}
                        alt={item.tokenSymbol}
                        boxSize="32px"
                        borderRadius="full"
                        flexShrink={0}
                        fallback={
                            <Box boxSize="32px" borderRadius="full" bg="whiteAlpha.300" />
                        }
                    />
                ) : (
                    <Box
                        boxSize="32px"
                        borderRadius="full"
                        bg="whiteAlpha.300"
                        flexShrink={0}
                    />
                )}
                <VStack spacing={0} align="flex-start" minW={0}>
                    <Text fontWeight="600" color={textPrimary}>
                        {sent ? t('Sent') : t('Received')}
                    </Text>
                    <HStack spacing={1} align="baseline" maxW="full">
                        <Text fontSize="xs" color={textSecondary}>
                            {sent ? t('To') : t('From')}
                        </Text>
                        <AddressOrDomainLabel
                            address={counterparty}
                            fontSize="xs"
                            color={textSecondary}
                        />
                    </HStack>
                </VStack>
            </HStack>
            <VStack
                spacing={0}
                align="flex-end"
                maxW="45%"
                flexShrink={0}
            >
                <Text
                    fontWeight="600"
                    color={amountColor}
                    lineHeight="short"
                >
                    {sign}
                    {formattedAmount}
                </Text>
                <Text
                    fontSize="xs"
                    color={textSecondary}
                    lineHeight="short"
                    maxW="full"
                    isTruncated
                >
                    {item.tokenSymbol}
                </Text>
            </VStack>
        </Button>
    );
};
