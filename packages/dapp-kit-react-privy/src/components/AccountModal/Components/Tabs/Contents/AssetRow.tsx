import { HStack, Image, Text, Box } from '@chakra-ui/react';
import { TOKEN_LOGOS } from '@/utils';

const compactFormatter = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 2,
});

type AssetRowProps = {
    symbol: string;
    amount: number;
    usdValue: number;
};

export const AssetRow = ({ symbol, amount, usdValue }: AssetRowProps) => (
    <HStack justify="space-between" px={2} py={1}>
        <HStack spacing={2}>
            <Image
                src={TOKEN_LOGOS[symbol]}
                alt={`${symbol} logo`}
                boxSize="24px"
                borderRadius="full"
                fallback={
                    <Box
                        boxSize="24px"
                        borderRadius="full"
                        bg="whiteAlpha.200"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Text fontSize="10px" fontWeight="bold">
                            {symbol.slice(0, 3)}
                        </Text>
                    </Box>
                }
            />
            <Text fontSize="sm">{symbol}</Text>
        </HStack>
        <Text fontSize="sm">
            {compactFormatter.format(amount)}
            <Text as="span" color="gray.500">
                {' '}
                (${compactFormatter.format(usdValue)})
            </Text>
        </Text>
    </HStack>
);
