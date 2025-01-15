import { HStack, Image, Text, Box, Button, VStack } from '@chakra-ui/react';
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
    <Button
        height="72px"
        variant="ghost"
        justifyContent="space-between"
        p={4}
        w="100%"
        cursor="default"
        _hover={{ bg: 'whiteAlpha.100' }}
    >
        <HStack>
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
            <Text>{symbol}</Text>
        </HStack>
        <VStack align="flex-end" spacing={0}>
            <Text>{compactFormatter.format(amount)}</Text>
            <Text fontSize="sm" color="gray.500">
                ${compactFormatter.format(usdValue)}
            </Text>
        </VStack>
    </Button>
);
