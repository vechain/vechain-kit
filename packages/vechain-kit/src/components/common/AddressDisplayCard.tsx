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
};

export const AddressDisplayCard = ({
    label,
    address,
    domain,
    imageSrc,
    imageAlt = 'Account',
    hideAddress = false,
}: AddressDisplayCardProps) => {
    const { darkMode: isDark } = useVeChainKitConfig();
    const { t } = useTranslation();

    const { totalBalance, isLoading } = useBalances({
        address: address,
    });
    return (
        <Box
            w="full"
            p={2}
            borderRadius="lg"
            bg={isDark ? '#ffffff0f' : 'gray.50'}
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
                    />
                    <VStack align="start" spacing={0}>
                        {domain ? (
                            <>
                                <Text fontWeight="medium" fontSize="sm">
                                    {domain}
                                </Text>
                                {!hideAddress && (
                                    <Text fontSize="xs" opacity={0.5}>
                                        {humanAddress(address, 6, 4)}
                                    </Text>
                                )}
                            </>
                        ) : (
                            <Text fontWeight="medium" fontSize="sm">
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
                            ${compactFormatter.format(totalBalance)}
                        </Text>
                    </Skeleton>
                </VStack>
            </HStack>
        </Box>
    );
};
