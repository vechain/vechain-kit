import { Box, Text, HStack, VStack, Image, Skeleton } from '@chakra-ui/react';
import { humanAddress } from '@/utils';
import { useVeChainKitConfig } from '@/providers';
import { useTotalBalance, useTokensWithValues } from '@/hooks';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

type AddressDisplayCardProps = {
    label: string;
    address: string;
    domain?: string;
    imageSrc: string;
    imageAlt?: string;
    hideAddress?: boolean;
    balance?: number;
    tokenAddress?: string;
};

export const AddressDisplayCard = ({
    label,
    address,
    domain,
    imageSrc,
    imageAlt = 'Account',
    hideAddress = false,
    balance,
    tokenAddress,
}: AddressDisplayCardProps) => {
    const { darkMode: isDark } = useVeChainKitConfig();
    const { t } = useTranslation();

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
            <Box
                w="full"
                p={2}
                borderRadius="lg"
                bg={isDark ? '#00000038' : 'gray.50'}
            >
                <Text fontSize="sm" fontWeight="bold" mb={2}>
                    {label}
                </Text>
                <HStack minH={'50px'} justify="space-between">
                    <HStack>
                        <Skeleton boxSize="40px" borderRadius="xl" />
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
                        <Text fontSize="sm" fontWeight="medium">
                            {t('Balance')}
                        </Text>
                        <Skeleton
                            height="12px"
                            width="80px"
                            borderRadius="md"
                        />
                    </VStack>
                </HStack>
            </Box>
        );
    }

    return (
        <Box
            w="full"
            p={2}
            borderRadius="lg"
            bg={isDark ? '#00000038' : 'gray.50'}
            wordBreak="break-word"
        >
            <Text fontSize="sm" fontWeight="bold" mb={2}>
                {label}
            </Text>
            <HStack minH={'50px'} justify="space-between">
                <HStack>
                    <Image
                        src={imageSrc}
                        alt={imageAlt}
                        boxSize="40px"
                        borderRadius="xl"
                        objectFit="cover"
                    />
                    <VStack align="start" spacing={0}>
                        {domain ? (
                            <>
                                <Text
                                    fontWeight="medium"
                                    fontSize="sm"
                                    data-testid={`${label.toLowerCase()}-domain`}
                                >
                                    {domain}
                                </Text>
                                {!hideAddress && (
                                    <Text
                                        fontSize="xs"
                                        opacity={0.5}
                                        data-testid={`${label.toLowerCase()}-address`}
                                    >
                                        {humanAddress(address, 6, 4)}
                                    </Text>
                                )}
                            </>
                        ) : (
                            <Text
                                fontWeight="medium"
                                fontSize="sm"
                                data-testid={`${label.toLowerCase()}-address`}
                            >
                                {humanAddress(address, 6, 4)}
                            </Text>
                        )}
                    </VStack>
                </HStack>

                <VStack
                    justify="flex-start"
                    align="flex-end"
                    spacing={0}
                    mr={2}
                >
                    <Text fontSize="sm" fontWeight="medium">
                        {t('Balance')}
                    </Text>
                    <Text fontSize="xs" opacity={0.5}>
                        {displayBalance.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                        })}
                        {displaySymbol && ` ${displaySymbol}`}
                    </Text>
                </VStack>
            </HStack>
        </Box>
    );
};
