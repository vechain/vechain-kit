import { HStack, Text, TextProps, useToken } from '@chakra-ui/react';

type Props = TextProps & {
    valuePct?: number;
    showSuffix?: boolean;
};

export const PriceChangeBadge = ({
    valuePct,
    showSuffix,
    ...textProps
}: Props) => {
    const success = useToken('colors', 'vechain-kit-success');
    const error = useToken('colors', 'vechain-kit-error');
    const muted = useToken('colors', 'vechain-kit-text-tertiary');

    if (valuePct === undefined || !Number.isFinite(valuePct)) {
        return null;
    }

    const sign = valuePct > 0 ? '+' : '';
    const color =
        valuePct === 0 ? muted : valuePct > 0 ? success : error;

    return (
        <HStack spacing={1} align="baseline">
            <Text fontSize="xs" fontWeight="600" color={color} {...textProps}>
                {sign}
                {valuePct.toFixed(2)}%
            </Text>
            {showSuffix && (
                <Text fontSize="xs" fontWeight="500" color={muted}>
                    24h
                </Text>
            )}
        </HStack>
    );
};
