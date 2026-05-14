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
            <HStack spacing={3}>
                {fromZero ? (
                    <Box
                        boxSize="32px"
                        borderRadius="full"
                        bg="whiteAlpha.300"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
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
                        fallback={
                            <Box boxSize="32px" borderRadius="full" bg="whiteAlpha.300" />
                        }
                    />
                ) : (
                    <Box boxSize="32px" borderRadius="full" bg="whiteAlpha.300" />
                )}
                <VStack spacing={0} align="flex-start">
                    <Text fontWeight="600" color={textPrimary}>
                        {sent ? t('Sent') : t('Received')}
                    </Text>
                    <HStack spacing={1} align="baseline">
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
            <VStack spacing={0} align="flex-end">
                <Text fontWeight="600" color={amountColor}>
                    {sign}
                    {formattedAmount} {item.tokenSymbol}
                </Text>
            </VStack>
        </Button>
    );
};
