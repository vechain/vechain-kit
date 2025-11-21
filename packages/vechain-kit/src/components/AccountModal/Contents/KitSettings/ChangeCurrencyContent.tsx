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
} from '@chakra-ui/react';
import {
    ModalBackButton,
    ScrollToTopWrapper,
    StickyHeaderContainer,
} from '@/components/common';
import { AccountModalContentTypes } from '../../Types';
import { CURRENCY, CURRENCY_SYMBOLS } from '@/types';
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

    useEffect(() => {
        // Ensure we mark the currency settings as visited when this component mounts
        setLocalStorageItem('settings-currency-visited', 'true');
    }, []);

    const renderCurrencyButton = (currency: CURRENCY) => (
        <Button
            key={currency}
            w="full"
            variant="ghost"
            justifyContent="space-between"
            onClick={() => changeCurrency(currency)}
            py={6}
            px={4}
        >
            <HStack spacing={3}>
                <Text fontSize="xl">{CURRENCY_SYMBOLS[currency]}</Text>
                <Text>{currency.toUpperCase()}</Text>
            </HStack>
            {currentCurrency === currency && (
                <Icon as={LuCheck} boxSize={5} color="blue.500" />
            )}
        </Button>
    );

    return (
        <ScrollToTopWrapper>
            <StickyHeaderContainer>
                <ModalHeader>{t('Select currency')}</ModalHeader>
                <ModalBackButton
                    onClick={() => setCurrentContent('general-settings')}
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
