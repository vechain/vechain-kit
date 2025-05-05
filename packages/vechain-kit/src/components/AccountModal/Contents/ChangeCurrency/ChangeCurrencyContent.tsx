import {
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    VStack,
    Button,
    Heading,
} from '@chakra-ui/react';
import { ModalBackButton, StickyHeaderContainer } from '@/components/common';
import { AccountModalContentTypes } from '../../Types/Types';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '@/hooks/api/wallet';

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

    return (
        <>
            <StickyHeaderContainer>
                <ModalBackButton onClick={() => setCurrentContent('settings')} />
                <ModalHeader>{t('Change Currency')}</ModalHeader>
                <ModalCloseButton />
            </StickyHeaderContainer>
            <ModalBody>
                <VStack spacing={4} align="stretch">
                    <Heading size="md">{t('Select Currency')}</Heading>
                    {allCurrencies.map((cur) => (
                        <Button
                            key={cur}
                            variant={currentCurrency === cur ? 'solid' : 'outline'}
                            onClick={() => changeCurrency(cur)}
                        >
                            {cur.toUpperCase()}
                        </Button>
                    ))}
                </VStack>
            </ModalBody>
        </>
    );
};
