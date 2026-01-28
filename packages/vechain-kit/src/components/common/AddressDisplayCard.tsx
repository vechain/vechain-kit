import {
    Text,
    HStack,
    VStack,
    Image,
    Skeleton,
    useToken,
} from '@chakra-ui/react';
import { humanAddress } from '../../utils';
import { useTotalBalance, useTokensWithValues } from '../../hooks';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

type AddressDisplayCardProps = {
    address: string;
    domain?: string;
    imageSrc: string;
    imageAlt?: string;
    hideAddress?: boolean;
    balance?: number;
    tokenAddress?: string;
};

export const AddressDisplayCard = ({
    address,
    domain,
    imageSrc,
    imageAlt = 'Account',
    hideAddress = false,
    balance,
    tokenAddress,
}: AddressDisplayCardProps) => {
    const { t } = useTranslation();

    const textColor = useToken('colors', 'vechain-kit-text-primary');
    const secondaryTextColor = useToken('colors', 'vechain-kit-text-secondary');
    const cardBg = useToken('colors', 'vechain-kit-card');

    const { isLoading: totalBalanceLoading } = useTotalBalance({ address });
    const { tokens, isLoading: tokensLoading } = useTokensWithValues({
        address,
    });

    // Find token by address if specified
    const tokenData = useMemo(() => {
        if (!tokenAddress) return null;
        return tokens.find((token) => token.address === tokenAddress);
    }, [tokens, tokenAddress]);

    // Determine what balance to display
    const displayBalance = useMemo(() => {
        // If balance is explicitly provided, always use that
        if (balance !== undefined) return balance;

        // Otherwise, find the actual token balance, not its currency value
        if (tokenData) {
            return Number(tokenData.balance);
        }
        return 0;
    }, [balance, tokenData]);

    const displaySymbol = tokenData?.symbol || '';
    const isLoading = totalBalanceLoading || tokensLoading;

    if (isLoading) {
        return (
            <HStack
                minH={'50px'}
                justify="space-between"
                p={4}
                borderRadius="2xl"
                bg={cardBg}
            >
                <HStack>
                    <Skeleton boxSize="40px" borderRadius="full" />
                    <VStack align="start" spacing={0}>
                        <Skeleton
                            height="16px"
                            width="120px"
                            borderRadius="md"
                        />
                        {!hideAddress && (
                            <Skeleton
                                mt={2}
                                height="12px"
                                width="100px"
                                borderRadius="md"
                            />
                        )}
                    </VStack>
                </HStack>

                <VStack
                    justify="flex-start"
                    align="flex-end"
                    spacing={0}
                    mr={2}
                >
                    <Text fontSize="sm" fontWeight="medium" color={textColor}>
                        {t('Balance')}
                    </Text>
                    <Skeleton height="12px" width="80px" borderRadius="md" />
                </VStack>
            </HStack>
        );
    }

    return (
        <HStack
            minH={'50px'}
            justify="space-between"
            p={4}
            borderRadius="2xl"
            bg={cardBg}
        >
            <HStack>
                <Image
                    src={imageSrc}
                    alt={imageAlt}
                    boxSize="40px"
                    borderRadius="full"
                    objectFit="cover"
                />
                <VStack align="start" spacing={0}>
                    {domain ? (
                        <>
                            <Text
                                fontWeight="medium"
                                fontSize="sm"
                                color={textColor}
                            >
                                {domain}
                            </Text>
                            {!hideAddress && (
                                <Text fontSize="xs" color={secondaryTextColor}>
                                    {humanAddress(address, 6, 4)}
                                </Text>
                            )}
                        </>
                    ) : (
                        <Text
                            fontWeight="medium"
                            fontSize="sm"
                            color={textColor}
                        >
                            {humanAddress(address, 6, 4)}
                        </Text>
                    )}
                </VStack>
            </HStack>

            <VStack justify="flex-start" align="flex-end" spacing={0} mr={2}>
                <Text fontSize="sm" fontWeight="medium" color={textColor}>
                    {t('Balance')}
                </Text>
                <Text fontSize="xs" color={secondaryTextColor}>
                    {displayBalance.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                    })}
                    {displaySymbol && ` ${displaySymbol}`}
                </Text>
            </VStack>
        </HStack>
    );
};
