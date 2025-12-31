import React from 'react';
import {
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    VStack,
    HStack,
    Text,
    Box,
    Skeleton,
    Switch,
    FormControl,
    FormLabel,
    useToken,
    Image,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { GasTokenType } from '@/types/gasToken';
import { SUPPORTED_GAS_TOKENS } from '@/utils/constants';
import { formatGasCost } from '@/types/gasEstimation';
import { useTokenBalances } from '@/hooks';
import { BaseModal } from './BaseModal';

interface GasFeeTokenSelectorProps {
    isOpen: boolean;
    onClose: () => void;
    selectedToken: GasTokenType;
    onTokenSelect: (token: GasTokenType, rememberChoice: boolean) => void;
    availableTokens: GasTokenType[];
    tokenEstimations: Record<GasTokenType, { cost: number; loading: boolean }>;
    walletAddress: string;
}

export const GasFeeTokenSelector = ({
    isOpen,
    onClose,
    selectedToken,
    onTokenSelect,
    availableTokens,
    tokenEstimations,
    walletAddress,
}: GasFeeTokenSelectorProps) => {
    const { t } = useTranslation();
    const { balances } = useTokenBalances(walletAddress);
    const [tempSelectedToken, setTempSelectedToken] =
        React.useState(selectedToken);
    const [rememberChoice, setRememberChoice] = React.useState(false);

    const textPrimary = useToken('colors', 'vechain-kit-text-primary');
    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');
    const textTertiary = useToken('colors', 'vechain-kit-text-tertiary');
    const errorColor = useToken('colors', 'vechain-kit-error');

    const itemBg = (selected: boolean) =>
        selected ? textTertiary : 'transparent';
    const itemBorderColor = (selected: boolean) =>
        selected ? textPrimary : 'transparent';

    React.useEffect(() => {
        if (isOpen) {
            setTempSelectedToken(selectedToken);
            setRememberChoice(false);
        }
    }, [isOpen, selectedToken]);

    const handleApply = () => {
        onTokenSelect(tempSelectedToken, rememberChoice);
        onClose();
    };

    const getTokenBalance = (tokenSymbol: string) => {
        const balance = balances.find((b) => b.symbol === tokenSymbol);
        return balance
            ? Number(balance.balance.scaled).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
              })
            : '0.00';
    };

    const getTokenIcon = (tokenSymbol: string) => {
        const balance = balances.find((b) => b.symbol === tokenSymbol);
        return balance?.icon;
    };

    const hasInsufficientBalance = (tokenSymbol: GasTokenType) => {
        const balance = balances.find((b) => b.symbol === tokenSymbol);
        const estimation = tokenEstimations[tokenSymbol];
        if (!balance || !estimation) return false;
        return Number(balance.balance.scaled) < estimation.cost;
    };

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} size="sm">
            <ModalHeader>
                <Text fontSize="lg" fontWeight="semibold" color={textPrimary}>
                    {t('Fee token')}
                </Text>
                <Text
                    fontSize="sm"
                    fontWeight="normal"
                    color={textSecondary}
                    mt={1}
                >
                    {t('Select the token to pay the fee with')}
                </Text>
            </ModalHeader>

            <ModalBody>
                <VStack spacing={2} align="stretch">
                    {availableTokens.map((token) => {
                        const tokenInfo = SUPPORTED_GAS_TOKENS[token];
                        const isSelected = tempSelectedToken === token;
                        const estimation = tokenEstimations[token] || {
                            cost: 0,
                            loading: true,
                        };
                        const insufficient = hasInsufficientBalance(token);

                        return (
                            <Box
                                key={token}
                                cursor={
                                    insufficient ? 'not-allowed' : 'pointer'
                                }
                                bg={itemBg(isSelected)}
                                border="1px"
                                borderColor={itemBorderColor(isSelected)}
                                borderRadius="md"
                                p={3}
                                transition="all 0.2s ease"
                                _hover={{
                                    backgroundColor: insufficient
                                        ? itemBg(isSelected)
                                        : textSecondary
                                        ? '#ffffff12'
                                        : textSecondary,
                                    borderColor: insufficient
                                        ? itemBorderColor(isSelected)
                                        : textSecondary,
                                }}
                                opacity={insufficient ? 0.5 : 1}
                                onClick={() =>
                                    !insufficient && setTempSelectedToken(token)
                                }
                            >
                                <HStack spacing={3} justify="space-between">
                                    <HStack spacing={3} flex={1}>
                                        <Image
                                            src={getTokenIcon(token)}
                                            alt={`${token} logo`}
                                            boxSize="36px"
                                            borderRadius="full"
                                            fallback={
                                                <Box
                                                    boxSize="36px"
                                                    borderRadius="full"
                                                    bg="whiteAlpha.200"
                                                    display="flex"
                                                    alignItems="center"
                                                    justifyContent="center"
                                                >
                                                    <Text
                                                        fontSize="xs"
                                                        fontWeight="bold"
                                                        color={textPrimary}
                                                    >
                                                        {token.slice(0, 3)}
                                                    </Text>
                                                </Box>
                                            }
                                        />
                                        <VStack align="start" spacing={0}>
                                            <Text
                                                fontWeight="medium"
                                                color={textPrimary}
                                            >
                                                {tokenInfo.symbol}
                                            </Text>
                                            <Text
                                                fontSize="xs"
                                                color={textSecondary}
                                            >
                                                {t('Balance')}:{' '}
                                                {getTokenBalance(token)}
                                            </Text>
                                            {insufficient && (
                                                <Text
                                                    fontSize="xs"
                                                    color={errorColor}
                                                >
                                                    {t('Insufficient balance')}
                                                </Text>
                                            )}
                                        </VStack>
                                    </HStack>
                                    <VStack align="end" spacing={0}>
                                        {estimation.loading ? (
                                            <Skeleton
                                                height="16px"
                                                width="60px"
                                            />
                                        ) : (
                                            <>
                                                <Text
                                                    fontSize="sm"
                                                    fontWeight="semibold"
                                                    color={textPrimary}
                                                >
                                                    {formatGasCost(
                                                        estimation.cost,
                                                        2,
                                                    )}
                                                </Text>
                                                <Text
                                                    fontSize="xs"
                                                    color={textSecondary}
                                                >
                                                    {tokenInfo.symbol}
                                                </Text>
                                            </>
                                        )}
                                    </VStack>
                                </HStack>
                            </Box>
                        );
                    })}

                    {tempSelectedToken !== selectedToken && (
                        <FormControl
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                        >
                            <FormLabel
                                htmlFor="remember-choice"
                                mb="0"
                                fontSize="sm"
                                color={textPrimary}
                            >
                                {t('Use this token for future transactions')}
                            </FormLabel>
                            <Switch
                                id="remember-choice"
                                isChecked={rememberChoice}
                                onChange={(e) =>
                                    setRememberChoice(e.target.checked)
                                }
                                color={textPrimary}
                            />
                        </FormControl>
                    )}
                </VStack>
            </ModalBody>

            <ModalFooter>
                <VStack spacing={3} w="full">
                    <Button
                        variant="vechainKitPrimary"
                        onClick={handleApply}
                        isDisabled={hasInsufficientBalance(tempSelectedToken)}
                    >
                        {t('Apply')}
                    </Button>
                    <Button variant="ghost" width="full" onClick={onClose}>
                        {t('Cancel')}
                    </Button>
                </VStack>
            </ModalFooter>
        </BaseModal>
    );
};
