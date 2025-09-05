import { Box, HStack, Text, Icon, Tooltip, VStack } from '@chakra-ui/react';
import { MdInfo } from 'react-icons/md';
import {
    GasTokenSelection,
    SUPPORTED_GAS_TOKENS,
    GasTokenType,
} from '@/types/gasToken';

interface GasTokenDisplayProps {
    selection: GasTokenSelection;
    showBreakdown?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

interface TokenIconProps {
    token: GasTokenType;
    size?: 'sm' | 'md' | 'lg';
}

const TokenIcon = ({ token, size = 'md' }: TokenIconProps) => {
    const sizeMap = {
        sm: '16px',
        md: '20px',
        lg: '24px',
    };

    const iconSize = sizeMap[size];

    // You can replace this with actual token icons
    const getTokenColor = (token: GasTokenType) => {
        switch (token) {
            case 'VTHO':
                return 'blue.500';
            case 'B3TR':
                return 'green.500';
            case 'VET':
                return 'purple.500';
            default:
                return 'gray.500';
        }
    };

    return (
        <Box
            width={iconSize}
            height={iconSize}
            borderRadius="full"
            bg={getTokenColor(token)}
            display="flex"
            alignItems="center"
            justifyContent="center"
            color="white"
            fontSize={size === 'sm' ? 'xs' : 'sm'}
            fontWeight="bold"
        >
            {token.slice(0, 2)}
        </Box>
    );
};

export const GasTokenDisplay = ({
    selection,
    showBreakdown = false,
    size = 'md',
}: GasTokenDisplayProps) => {
    const tokenInfo = SUPPORTED_GAS_TOKENS[selection.selectedToken];

    const formatCost = (cost: string) => {
        return parseFloat(cost).toFixed(4) + ' ' + tokenInfo.symbol;
    };

    const fontSize = size === 'sm' ? 'sm' : size === 'lg' ? 'md' : 'sm';
    const iconSize = size;

    if (!showBreakdown) {
        return (
            <HStack spacing={2}>
                <TokenIcon token={selection.selectedToken} size={iconSize} />
                <Text
                    fontSize={fontSize}
                    color="gray.700"
                    _dark={{ color: 'gray.300' }}
                >
                    {formatCost(selection.cost)} {tokenInfo.symbol}
                    {selection.hasServiceFee && (
                        <Text as="span" fontSize="xs" color="orange.500" ml={1}>
                            (+fee)
                        </Text>
                    )}
                </Text>
                {selection.hasServiceFee && (
                    <Tooltip
                        label={`Service fee: ${formatCost(selection.cost)} ${
                            tokenInfo.symbol
                        }`}
                        placement="top"
                    >
                        <Box>
                            <Icon
                                as={MdInfo}
                                color="orange.500"
                                boxSize="12px"
                            />
                        </Box>
                    </Tooltip>
                )}
            </HStack>
        );
    }

    return (
        <VStack align="start" spacing={1}>
            <HStack spacing={2}>
                <TokenIcon token={selection.selectedToken} size={iconSize} />
                <Text fontSize={fontSize} fontWeight="medium">
                    Paying with {tokenInfo.name}
                </Text>
            </HStack>

            <VStack align="start" spacing={0.5} ml={6}>
                <HStack justify="space-between" w="full">
                    <Text fontSize="xs" color="gray.600">
                        Transaction cost:
                    </Text>
                    <Text fontSize="xs">
                        {formatCost(selection.cost)} {tokenInfo.symbol}
                    </Text>
                </HStack>

                {selection.hasServiceFee && (
                    <HStack justify="space-between" w="full">
                        <Text fontSize="xs" color="orange.600">
                            Service fee:
                        </Text>
                        <Text fontSize="xs" color="orange.600">
                            {formatCost(selection.cost)} {tokenInfo.symbol}
                        </Text>
                    </HStack>
                )}

                {selection.hasServiceFee && (
                    <Box borderTop="1px" borderColor="gray.200" pt={1} w="full">
                        <HStack justify="space-between" w="full">
                            <Text fontSize="xs" fontWeight="medium">
                                Total:
                            </Text>
                            <Text fontSize="xs" fontWeight="medium">
                                {formatCost(
                                    (
                                        BigInt(selection.cost) +
                                        BigInt(selection.cost)
                                    ).toString(),
                                )}{' '}
                                {tokenInfo.symbol}
                            </Text>
                        </HStack>
                    </Box>
                )}
            </VStack>
        </VStack>
    );
};
