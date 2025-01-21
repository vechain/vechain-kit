import { HStack, Image, Box, Text } from '@chakra-ui/react';
import { useBalances } from '@/hooks';
import { TOKEN_LOGOS } from '@/utils';
import { useVeChainKitConfig } from '@/providers';

type AssetIconsProps = {
    address?: string;
    maxIcons?: number;
    iconSize?: number;
    ml?: number;
};

export const AssetIcons = ({
    address,
    maxIcons = 3,
    iconSize = 20,
    ml = 0,
}: AssetIconsProps) => {
    const { balances } = useBalances({ address: address ?? '' });
    const { darkMode } = useVeChainKitConfig();
    const marginLeft = iconSize / 2;

    // Create array of tokens with balances
    const tokens = [
        { symbol: 'VET', balance: balances.vet },
        { symbol: 'VTHO', balance: balances.vtho },
        { symbol: 'B3TR', balance: balances.b3tr },
        { symbol: 'VOT3', balance: balances.vot3 },
        { symbol: 'veDelegate', balance: balances.veDelegate },
    ].filter((token) => token.balance > 0);

    const tokensToShow = tokens.slice(0, maxIcons);
    const remainingTokens = tokens.length - maxIcons;

    if (!address) return null;
    if (tokens.length === 0) return null;

    return (
        <HStack spacing={0} ml={ml}>
            {tokensToShow.map((token, index) => (
                <Box
                    key={token.symbol}
                    ml={index > 0 ? `-${marginLeft}px` : '0'}
                    zIndex={index}
                    borderRadius="full"
                    backgroundColor={darkMode ? 'gray.100' : 'gray.700'}
                >
                    <Image
                        src={TOKEN_LOGOS[token.symbol]}
                        alt={`${token.symbol} logo`}
                        width={`${iconSize}px`}
                        height={`${iconSize}px`}
                        borderRadius="full"
                        fallback={
                            <Box
                                boxSize={`${iconSize}px`}
                                borderRadius="full"
                                bg={darkMode ? 'gray.200' : 'gray.700'}
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <Text
                                    fontSize={`${iconSize * 0.4}px`}
                                    fontWeight="bold"
                                    color={darkMode ? 'white' : 'black'}
                                >
                                    {token.symbol.slice(0, 3)}
                                </Text>
                            </Box>
                        }
                    />
                </Box>
            ))}
            {remainingTokens > 0 && (
                <Box
                    ml={`-${marginLeft}px`}
                    zIndex={tokensToShow.length}
                    width={`${iconSize}px`}
                    height={`${iconSize}px`}
                    borderRadius="full"
                    bg={darkMode ? 'gray.100' : 'gray.700'}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Text
                        fontSize={`${iconSize * 0.4}px`}
                        fontWeight="bold"
                        color={darkMode ? 'black' : 'white'}
                    >
                        +{remainingTokens}
                    </Text>
                </Box>
            )}
        </HStack>
    );
};
