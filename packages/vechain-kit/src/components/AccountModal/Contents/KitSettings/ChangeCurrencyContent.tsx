import {
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    VStack,
    Button,
    ModalFooter,
    Text,
    Icon,
    HStack,
    useColorModeValue,
} from '@chakra-ui/react';
import {
    ModalBackButton,
    ScrollToTopWrapper,
    StickyHeaderContainer,
} from '@/components/common';
import { AccountModalContentTypes } from '../../Types';
import type { CURRENCY } from '../../../../types';
import { CURRENCY_SYMBOLS } from '../../../../types';
import { useCurrency } from '@/hooks';
import { LuCheck } from 'react-icons/lu';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { setLocalStorageItem } from '@/utils/ssrUtils';

export type ChangeCurrencyContentProps = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
};

export const ChangeCurrencyContent = ({
    setCurrentContent,
}: ChangeCurrencyContentProps) => {
    const { t } = useTranslation();
    const { currentCurrency, changeCurrency, allCurrencies } = useCurrency();
    const selectedBg = useColorModeValue(
        'rgba(0, 0, 0, 0.1)',
        'rgba(255, 255, 255, 0.05)',
    );

    useEffect(() => {
        // Ensure we mark the currency settings as visited when this component mounts
        setLocalStorageItem('settings-currency-visited', 'true');
    }, []);

    const renderCurrencyButton = (currency: CURRENCY) => {
        const isSelected = currentCurrency === currency;
        return (
            <Button
                key={currency}
                w="full"
                variant="ghost"
                justifyContent="space-between"
                onClick={() => changeCurrency(currency)}
                py={6}
                px={4}
                bg={isSelected ? selectedBg : undefined}
            >
                <HStack spacing={3}>
                    <Text fontSize="xl">{CURRENCY_SYMBOLS[currency]}</Text>
                    <Text>{currency.toUpperCase()}</Text>
                </HStack>
                {isSelected && (
                    <Icon as={LuCheck} boxSize={5} color="blue.500" />
                )}
            </Button>
        );
    };

    return (
        <ScrollToTopWrapper>
            <StickyHeaderContainer>
                <ModalHeader>{t('Select currency')}</ModalHeader>
                <ModalBackButton
                    onClick={() => setCurrentContent('settings')}
                />
                <ModalCloseButton />
            </StickyHeaderContainer>
            <ModalBody w={'full'}>
                <VStack
                    justify={'center'}
                    spacing={3}
                    align="flex-start"
                    w={'full'}
                >
                    {allCurrencies.map((cur) => renderCurrencyButton(cur))}
                </VStack>
            </ModalBody>
            <ModalFooter pt={0} />
        </ScrollToTopWrapper>
    );
};
