import { HStack, Text, Circle, Image, StackProps } from '@chakra-ui/react';
import { useBalances } from '@/hooks';
import { useVeChainKitConfig } from '@/providers';
import { TOKEN_LOGOS } from '@/utils';
import { useTranslation } from 'react-i18next';

type AssetIconsProps = {
    address: string;
    maxIcons?: number;
    iconSize?: number;
    ml?: number;
    style?: StackProps;
    iconsGap?: number;
    rightIcon?: React.ReactNode;
    showNoAssetsWarning?: boolean;
    onClick?: () => void;
};

export const AssetIcons = ({
    address,
    maxIcons = 3,
    iconSize = 20,
    ml = 0,
    style,
    iconsGap = 0,
    rightIcon,
    showNoAssetsWarning = false,
    onClick,
}: AssetIconsProps) => {
    const { t } = useTranslation();
    const { tokens } = useBalances({ address });
    const { darkMode } = useVeChainKitConfig();
    const marginLeft = iconsGap < 1 ? `-${iconSize / 2}px` : `${iconsGap}px`;

    // Create array of tokens with balances and their values
    const tokensList = Object.values(tokens)
        .filter((token) => token.value > 0)
        .sort((a, b) => b.usdValue - a.usdValue);

    const tokensToShow = tokensList.slice(0, maxIcons);
    const remainingTokens = tokensList.length - maxIcons;

    if (!address) return null;
    if (tokensList.length === 0 && !showNoAssetsWarning) return null;

    return (
        <HStack spacing={0} ml={ml} {...style} onClick={onClick}>
            <HStack spacing={0}>
                {tokensToShow.map((token, index) => (
                    <Circle
                        key={token.symbol}
                        ml={index > 0 ? marginLeft : '0'}
                        zIndex={index}
                        size={`${iconSize}px`}
                        borderRadius="full"
                        bg={darkMode ? 'gray.100' : 'gray.600'}
                        border="2px solid #00000024"
                        alignItems="center"
                        justifyContent="center"
                    >
                        {TOKEN_LOGOS[token.symbol] ? (
                            <Image
                                src={TOKEN_LOGOS[token.symbol]}
                                alt={`${token.symbol} logo`}
                                width={`${iconSize * 0.8}px`}
                                height={`${iconSize * 0.8}px`}
                                rounded="full"
                            />
                        ) : (
                            <Text
                                fontSize={`${iconSize * 0.4}px`}
                                fontWeight="bold"
                                color={darkMode ? 'black' : 'white'}
                            >
                                {token.symbol.slice(0, 3)}
                            </Text>
                        )}
                    </Circle>
                ))}
                {remainingTokens > 0 && (
                    <Circle
                        ml={marginLeft}
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

                {tokensList.length === 0 && showNoAssetsWarning && (
                    <Text
                        fontSize={'sm'}
                        color={darkMode ? 'white' : 'black'}
                        opacity={0.9}
                        fontWeight="700"
                    >
                        {t('No assets')}
                    </Text>
                )}
            </HStack>

            {rightIcon}
        </HStack>
    );
};
