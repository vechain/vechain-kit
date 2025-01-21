import {
    Button,
    HStack,
    Image,
    Text,
    Box,
    VStack,
    ButtonProps,
} from '@chakra-ui/react';
import { TOKEN_LOGOS } from '@/utils';

const compactFormatter = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 2,
});

type AssetButtonProps = ButtonProps & {
    symbol: string;
    amount: number;
    usdValue: number;
    isDisabled?: boolean;
    onClick?: () => void;
};

export const AssetButton = ({
    symbol,
    amount,
    usdValue,
    isDisabled,
    onClick,
    ...buttonProps
}: AssetButtonProps) => (
    <Button
        height="72px"
        variant="ghost"
        justifyContent="space-between"
        p={4}
        w="100%"
        opacity={isDisabled ? 0.5 : 1}
        _disabled={{
            cursor: 'not-allowed',
            opacity: 0.5,
        }}
        onClick={onClick}
        {...buttonProps}
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
