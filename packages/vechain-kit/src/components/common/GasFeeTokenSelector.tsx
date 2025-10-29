import React from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    VStack,
    HStack,
    Text,
    Box,
    Radio,
    RadioGroup,
    Skeleton,
    Switch,
    FormControl,
    FormLabel,
    useColorModeValue,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { GasTokenType } from '@/types/gasToken';
import { SUPPORTED_GAS_TOKENS, TOKEN_LOGO_COMPONENTS } from '@/utils/constants';
import { formatGasCost } from '@/types/gasEstimation';
import { useTokenBalances } from '@/hooks';

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

    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.600');
    const selectedBg = useColorModeValue('blue.50', 'blue.900');
    const selectedBorder = useColorModeValue('blue.500', 'blue.300');

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
        <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    <Text fontSize="lg" fontWeight="semibold">
                        {t('Fee token')}
                    </Text>
                    <Text
                        fontSize="sm"
                        fontWeight="normal"
                        color="gray.600"
                        mt={1}
                    >
                        {t('Select the token to pay the fee with')}
                    </Text>
                </ModalHeader>

                <ModalBody>
                    <RadioGroup
                        value={tempSelectedToken}
                        onChange={(value) =>
                            setTempSelectedToken(value as GasTokenType)
                        }
                    >
                        <VStack spacing={2} align="stretch">
                            {availableTokens.map((token) => {
                                const tokenInfo = SUPPORTED_GAS_TOKENS[token];
                                const isSelected = tempSelectedToken === token;
                                const estimation = tokenEstimations[token] || {
                                    cost: 0,
                                    loading: true,
                                };
                                const insufficient =
                                    hasInsufficientBalance(token);

                                return (
                                    <Box
                                        key={token}
                                        as="label"
                                        cursor="pointer"
                                        bg={isSelected ? selectedBg : bgColor}
                                        border="2px solid"
                                        borderColor={
                                            isSelected
                                                ? selectedBorder
                                                : borderColor
                                        }
                                        borderRadius="lg"
                                        p={4}
                                        transition="all 0.2s"
                                        _hover={{
                                            borderColor: isSelected
                                                ? selectedBorder
                                                : 'gray.300',
                                        }}
                                        opacity={insufficient ? 0.6 : 1}
                                        position="relative"
                                    >
                                        <HStack
                                            spacing={3}
                                            justify="space-between"
                                        >
                                            <HStack spacing={3} flex={1}>
                                                <Radio
                                                    value={token}
                                                    isDisabled={insufficient}
                                                />
                                                <Box
                                                    display="flex"
                                                    alignItems="center"
                                                    justifyContent="center"
                                                    w="32px"
                                                    h="32px"
                                                >
                                                    {
                                                        TOKEN_LOGO_COMPONENTS[
                                                            token
                                                        ]
                                                    }
                                                </Box>
                                                <VStack
                                                    align="start"
                                                    spacing={0}
                                                >
                                                    <Text fontWeight="medium">
                                                        {tokenInfo.symbol}
                                                    </Text>
                                                    <Text
                                                        fontSize="xs"
                                                        color="gray.600"
                                                    >
                                                        {getTokenBalance(token)}
                                                    </Text>
                                                    {insufficient && (
                                                        <Text
                                                            fontSize="xs"
                                                            color="red.500"
                                                        >
                                                            {t(
                                                                'Insufficient balance',
                                                            )}
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
                                                            color="gray.600"
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
                        </VStack>
                    </RadioGroup>

                    <Box
                        mt={4}
                        p={3}
                        bg="gray.50"
                        borderRadius="md"
                        _dark={{ bg: 'gray.700' }}
                    >
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
                                {t('Remember my choice')}
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
                        <Text fontSize="xs" color="gray.600" mt={2}>
                            {t(
                                'Set this as your preferred token for future transactions',
                            )}
                        </Text>
                    </Box>
                </ModalBody>

                <ModalFooter>
                    <HStack spacing={3} w="full">
                        <Button
                            variant="ghost"
                            onClick={onClose}
                            flex={1}
                            colorScheme="gray"
                        >
                            {t('Cancel')}
                        </Button>
                        <Button
                            colorScheme="blue"
                            onClick={handleApply}
                            flex={1}
                            isDisabled={hasInsufficientBalance(
                                tempSelectedToken,
                            )}
                        >
                            {t('Apply')}
                        </Button>
                    </HStack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
