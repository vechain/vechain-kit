import { Box, Text, HStack, VStack, Image, Skeleton } from '@chakra-ui/react';
import { humanAddress } from '@/utils';
import { useVeChainKitConfig } from '@/providers';
import { useBalances } from '@/hooks';
import { useTranslation } from 'react-i18next';

const compactFormatter = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 2,
});

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

    const { tokens, isLoading } = useBalances({
        address: address,
    });

    // Find token by address instead of using it as a key
    const tokenData = tokenAddress
        ? Object.values(tokens).find((token) => token.address === tokenAddress)
        : null;
    const displayBalance =
        balance !== undefined ? balance : tokenData?.value || 0;
    const displaySymbol = tokenData?.symbol || '';

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
                                <Text fontWeight="medium" fontSize="sm" data-testid={`${label.toLowerCase()}-domain`}>
                                    {domain}
                                </Text>
                                {!hideAddress && (
                                    <Text fontSize="xs" opacity={0.5} data-testid={`${label.toLowerCase()}-address`}>
                                        {humanAddress(address, 6, 4)}
                                    </Text>
                                )}
                            </>
                        ) : (
                            <Text fontWeight="medium" fontSize="sm" data-testid={`${label.toLowerCase()}-address`}>
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
                    <Skeleton isLoaded={!isLoading}>
                        <Text fontSize="xs" opacity={0.5}>
                            {compactFormatter.format(Number(displayBalance))}
                            {displaySymbol && ` ${displaySymbol}`}
                        </Text>
                    </Skeleton>
                </VStack>
            </HStack>
        </Box>
    );
};
