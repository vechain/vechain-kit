import React, { useMemo } from 'react';
import { Image, Box } from '@chakra-ui/react';
import { useSupportedTokens } from '@/hooks/api/tokenRegistry';
import { TOKEN_LOGO_COMPONENTS } from '@/utils/constants';

interface TokenIconProps {
    address?: string;
    symbol?: string;
    size?: number;
    className?: string;
}

export const TokenIcon = ({
    address,
    symbol,
    size = 24,
    className = '',
}: TokenIconProps) => {
    const { tokens, isLoading } = useSupportedTokens();

    // token info by address / symbol
    const token = useMemo(() => {
        if (address) {
            return tokens.find(
                (t) => t.address.toLowerCase() === address.toLowerCase(),
            );
        }
        if (symbol) {
            return tokens.find(
                (t) => t.symbol.toUpperCase() === symbol.toUpperCase(),
            );
        }
        return undefined;
    }, [tokens, address, symbol]);
    const tokenSymbol = token?.symbol || symbol || '';

    // token icon from registry if available (priority)
    if (token?.iconUrl) {
        return (
            <Image
                src={token.iconUrl}
                alt={`${tokenSymbol} icon`}
                boxSize={`${size}px`}
                borderRadius="full"
                className={className}
                onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                }}
                fallback={
                    <Box
                        className={className}
                        boxSize={`${size}px`}
                        borderRadius="full"
                        bg="gray.100"
                    />
                }
            />
        );
    }

    // fallback to SVG components for core tokens when registry is unavailable
    const IconComponent = TOKEN_LOGO_COMPONENTS[tokenSymbol];
    if (IconComponent && !isLoading) {
        return React.cloneElement(IconComponent, {
            boxSize: `${size}px`,
            borderRadius: 'full',
            className,
        });
    }

    // fallback: show symbol text
    return (
        <Box
            className={className}
            width={`${size}px`}
            height={`${size}px`}
            borderRadius="full"
            bg="gray.200"
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontSize="xs"
            fontWeight="semibold"
        >
            {tokenSymbol.slice(0, 3)}
        </Box>
    );
};
