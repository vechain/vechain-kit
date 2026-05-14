import {
    Box,
    Button,
    Divider,
    HStack,
    Heading,
    Image,
    Tag,
    Text,
    VStack,
    useToken,
} from '@chakra-ui/react';
import { LuExternalLink } from 'react-icons/lu';
import { formatCompactCurrency } from '@/utils/currencyUtils';
import { useCurrency } from '@/hooks';
import { useTranslation } from 'react-i18next';
import { SupportedCurrency } from '@/utils/currencyUtils';

export type StakingCardProps = {
    name: string;
    logoSrc?: string;
    logoFallback?: React.ReactNode;
    totalValueInCurrency: number;
    tag?: string;
    platformUrl?: string;
    children?: React.ReactNode;
};

export const StakingCard = ({
    name,
    logoSrc,
    logoFallback,
    totalValueInCurrency,
    tag,
    platformUrl,
    children,
}: StakingCardProps) => {
    const { t } = useTranslation();
    const { currentCurrency } = useCurrency();
    const textPrimary = useToken('colors', 'vechain-kit-text-primary');
    const cardBg = useToken('colors', 'vechain-kit-card');

    return (
        <VStack
            w="full"
            align="stretch"
            spacing={3}
            p={4}
            borderRadius="xl"
            bg={cardBg}
        >
            <HStack w="full" justify="space-between" align="center">
                <HStack spacing={2}>
                    {logoSrc ? (
                        <Image
                            src={logoSrc}
                            alt={name}
                            boxSize="24px"
                            borderRadius="full"
                            fallback={
                                <Box
                                    boxSize="24px"
                                    borderRadius="full"
                                    bg="whiteAlpha.300"
                                />
                            }
                        />
                    ) : (
                        logoFallback ?? (
                            <Box
                                boxSize="24px"
                                borderRadius="full"
                                bg="whiteAlpha.300"
                            />
                        )
                    )}
                    <Heading size="sm" color={textPrimary}>
                        {name}
                    </Heading>
                </HStack>
                <Text fontWeight="600" color={textPrimary}>
                    {formatCompactCurrency(totalValueInCurrency, {
                        currency: currentCurrency as SupportedCurrency,
                    })}
                </Text>
            </HStack>

            {tag && (
                <Box>
                    <Tag size="sm" colorScheme="purple" borderRadius="md">
                        {tag}
                    </Tag>
                </Box>
            )}

            <Divider opacity={0.2} />

            <VStack w="full" align="stretch" spacing={2}>
                {children}
            </VStack>

            {platformUrl && (
                <Button
                    as="a"
                    href={platformUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="vechainKitSecondary"
                    size="xs"
                    leftIcon={<LuExternalLink size={11} />}
                    fontSize="xs"
                    h="40px"
                    px={3}
                    mt={1}
                >
                    {t('Go to platform')}
                </Button>
            )}
        </VStack>
    );
};

export type StakingRowProps = {
    label: string;
    amount: string;
    valueInCurrency: number;
    rightLabel?: React.ReactNode;
    iconSrc?: string;
    iconFallback?: React.ReactNode;
};

export const StakingRow = ({
    label,
    amount,
    valueInCurrency,
    rightLabel,
    iconSrc,
    iconFallback,
}: StakingRowProps) => {
    const { currentCurrency } = useCurrency();
    const textPrimary = useToken('colors', 'vechain-kit-text-primary');
    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');

    return (
        <HStack w="full" justify="space-between" align="center">
            <HStack spacing={2}>
                {iconSrc ? (
                    <Image
                        src={iconSrc}
                        alt={label}
                        boxSize="20px"
                        borderRadius="full"
                        fallback={
                            <Box
                                boxSize="20px"
                                borderRadius="full"
                                bg="whiteAlpha.300"
                            />
                        }
                    />
                ) : (
                    iconFallback
                )}
                <VStack spacing={0} align="flex-start">
                    <Text fontSize="sm" color={textSecondary}>
                        {label}
                    </Text>
                    <Text fontSize="sm" color={textPrimary}>
                        {amount}
                    </Text>
                </VStack>
            </HStack>
            <VStack spacing={0} align="flex-end">
                <Text fontSize="sm" color={textPrimary}>
                    {formatCompactCurrency(valueInCurrency, {
                        currency: currentCurrency as SupportedCurrency,
                    })}
                </Text>
                {rightLabel}
            </VStack>
        </HStack>
    );
};
