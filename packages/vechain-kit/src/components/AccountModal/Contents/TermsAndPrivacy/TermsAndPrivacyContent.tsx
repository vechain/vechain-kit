import {
    ModalBackButton,
    ScrollToTopWrapper,
    StickyHeaderContainer,
    ModalCloseButton,
} from '@/components/common';
import { ModalBody, ModalFooter, ModalHeader, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { TermsAndPrivacyAccordion } from './TermsAndPrivacyAccordion';

export type TermsAndPrivacyContentProps = {
    onGoBack: () => void;
};

export const TermsAndPrivacyContent = ({
    onGoBack,
}: TermsAndPrivacyContentProps) => {
    const { t } = useTranslation();

    return (
        <ScrollToTopWrapper>
            <StickyHeaderContainer>
                <ModalHeader>{t('Terms and Policies')}</ModalHeader>
                <ModalBackButton onClick={onGoBack} />
                <ModalCloseButton />
            </StickyHeaderContainer>

            <ModalBody w={'full'}>
                <VStack spacing={6} align="stretch">
                    <TermsAndPrivacyAccordion />
                </VStack>
            </ModalBody>
            <ModalFooter pt={0} />
        </ScrollToTopWrapper>
    );
};
