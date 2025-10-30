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
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { GasTokenType } from '@/types/gasToken';
import { SUPPORTED_GAS_TOKENS, TOKEN_LOGO_COMPONENTS } from '@/utils/constants';
import { formatGasCost } from '@/types/gasEstimation';
import { useTokenBalances } from '@/hooks';
import { BaseModal } from './BaseModal';
import { useVeChainKitConfig } from '@/providers';

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
    const { darkMode: isDark } = useVeChainKitConfig();
    const { balances } = useTokenBalances(walletAddress);
    const [tempSelectedToken, setTempSelectedToken] =
        React.useState(selectedToken);
    const [rememberChoice, setRememberChoice] = React.useState(false);

    const itemBg = (selected: boolean) =>
        isDark
            ? selected
                ? '#ffffff12'
                : 'transparent'
            : selected
            ? 'blackAlpha.100'
            : 'transparent';
    const itemBorderColor = (selected: boolean) =>
        selected
            ? isDark
                ? 'blue.400'
                : 'blue.500'
            : isDark
            ? 'whiteAlpha.200'
            : 'gray.200';

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
            ? Number(balance.balance).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
              })
            : '0.00';
    };

    const hasInsufficientBalance = (tokenSymbol: GasTokenType) => {
        const balance = balances.find((b) => b.symbol === tokenSymbol);
        const estimation = tokenEstimations[tokenSymbol];
        if (!balance || !estimation) return false;
        return Number(balance.balance) < estimation.cost;
    };

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} size="sm">
            <ModalHeader>
                <Text fontSize="lg" fontWeight="semibold">
                    {t('Fee token')}
                </Text>
                <Text
                    fontSize="sm"
                    fontWeight="normal"
                    color={isDark ? 'whiteAlpha.600' : 'blackAlpha.600'}
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
                                        : isDark
                                        ? '#ffffff12'
                                        : 'blackAlpha.100',
                                    borderColor: insufficient
                                        ? itemBorderColor(isSelected)
                                        : isSelected
                                        ? isDark
                                            ? 'blue.400'
                                            : 'blue.500'
                                        : isDark
                                        ? 'whiteAlpha.300'
                                        : 'gray.300',
                                }}
                                opacity={insufficient ? 0.5 : 1}
                                onClick={() =>
                                    !insufficient && setTempSelectedToken(token)
                                }
                            >
                                <HStack spacing={3} justify="space-between">
                                    <HStack spacing={3} flex={1}>
                                        {React.cloneElement(
                                            TOKEN_LOGO_COMPONENTS[token],
                                            {
                                                boxSize: '36px',
                                                borderRadius: 'full',
                                            },
                                        )}
                                        <VStack align="start" spacing={0}>
                                            <Text fontWeight="medium">
                                                {tokenInfo.symbol}
                                            </Text>
                                            <Text
                                                fontSize="xs"
                                                color={
                                                    isDark
                                                        ? 'whiteAlpha.600'
                                                        : 'blackAlpha.600'
                                                }
                                            >
                                                {t('Balance')}:{' '}
                                                {getTokenBalance(token)}
                                            </Text>
                                            {insufficient && (
                                                <Text
                                                    fontSize="xs"
                                                    color="red.500"
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
                                                >
                                                    {formatGasCost(
                                                        estimation.cost,
                                                        2,
                                                    )}
                                                </Text>
                                                <Text
                                                    fontSize="xs"
                                                    color={
                                                        isDark
                                                            ? 'whiteAlpha.600'
                                                            : 'blackAlpha.600'
                                                    }
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
                            >
                                {t('Use this token for future transactions')}
                            </FormLabel>
                            <Switch
                                id="remember-choice"
                                isChecked={rememberChoice}
                                onChange={(e) =>
                                    setRememberChoice(e.target.checked)
                                }
                                colorScheme="blue"
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
                    <Button
                        variant="ghost"
                        width="full"
                        onClick={onClose}
                        colorScheme="gray"
                    >
                        {t('Cancel')}
                    </Button>
                </VStack>
            </ModalFooter>
        </BaseModal>
    );
};
