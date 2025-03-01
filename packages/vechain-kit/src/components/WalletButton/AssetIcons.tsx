import { HStack, Text, Circle, Image } from '@chakra-ui/react';
import { useBalances } from '@/hooks';
import { useVeChainKitConfig } from '@/providers';
import { TOKEN_LOGOS } from '@/utils';

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
    const { tokens } = useBalances({ address: address ?? '' });
    const { darkMode } = useVeChainKitConfig();
    const marginLeft = iconSize / 2;

    // Create array of tokens with balances and their values
    const tokensList = Object.values(tokens)
        .filter((token) => token.value > 0)
        .sort((a, b) => b.usdValue - a.usdValue);

    const tokensToShow = tokensList.slice(0, maxIcons);
    const remainingTokens = tokensList.length - maxIcons;

    if (!address) return null;
    if (tokensList.length === 0) return null;

    return (
        <HStack spacing={0} ml={ml}>
            {tokensToShow.map((token, index) => (
                <Circle
                    key={token.symbol}
                    ml={index > 0 ? `-${marginLeft}px` : '0'}
                    zIndex={index}
                    size={`${iconSize}px`}
                    borderRadius="full"
                    bg={darkMode ? 'gray.100' : 'gray.600'}
                    border="2px solid #00000024"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Image
                        src={TOKEN_LOGOS[token.symbol]}
                        alt={`${token.symbol} logo`}
                        width={`${iconSize * 0.8}px`}
                        height={`${iconSize * 0.8}px`}
                        rounded="full"
                    />
                </Circle>
            ))}
            {remainingTokens > 0 && (
                <Circle
                    ml={`-${marginLeft}px`}
                    zIndex={tokensToShow.length}
                    size={`${iconSize}px`}
                    borderRadius="full"
                    bg={darkMode ? 'gray.100' : 'gray.700'}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    border="2px solid"
                >
                    <Text
                        fontSize={`${iconSize * 0.4}px`}
                        fontWeight="bold"
                        color={darkMode ? 'black' : 'white'}
                    >
                        +{remainingTokens}
                    </Text>
                </Circle>
            )}
        </HStack>
    );
};
