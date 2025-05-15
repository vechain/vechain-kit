import { useLegalDocuments, useVeChainKitConfig } from '@/providers';
import { EnrichedLegalDocument, LegalDocumentType } from '@/types';
import { VECHAIN_KIT_TERMS_CONFIG } from '@/utils/Constants';
import { Accordion, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { PolicyAccordion } from './PolicyAccordion';

export const TermsAndPrivacyAccordion = () => {
    const { t } = useTranslation();
    const { darkMode: isDark } = useVeChainKitConfig();
    const {
        legalDocuments: { documents },
    } = useLegalDocuments();

    // VeChain Kit terms
    const vechainKitTerms =
        documents?.filter(
            (term) => term.url === VECHAIN_KIT_TERMS_CONFIG.url,
        ) || [];

    // Application terms
    const appTerms =
        documents?.filter(
            (term) => term.url !== VECHAIN_KIT_TERMS_CONFIG.url,
        ) || [];

    const vechainKitPrivacyPolicy: EnrichedLegalDocument[] = [];
    const appPrivacyPolicies =
        documents?.filter(
            (doc) => doc.documentType === LegalDocumentType.PRIVACY,
        ) || [];

    const vechainKitCookiePolicy: EnrichedLegalDocument[] = [];
    const appCookiePolicies =
        documents?.filter(
            (doc) => doc.documentType === LegalDocumentType.COOKIES,
        ) || [];

    const linkColor = isDark ? '#63B3ED' : '#3182CE';
    const accordionBg = isDark ? 'whiteAlpha.50' : 'blackAlpha.50';
    const accordionHoverBg = isDark ? 'whiteAlpha.100' : 'blackAlpha.100';

    return (
        <VStack spacing={4} align="stretch">
            <Accordion allowMultiple>
                <PolicyAccordion
                    title={t('Vechain Kit')}
                    termsDocuments={vechainKitTerms}
                    privacyDocuments={vechainKitPrivacyPolicy}
                    cookieDocuments={vechainKitCookiePolicy}
                    bg={accordionBg}
                    hoverBg={accordionHoverBg}
                    linkColor={linkColor}
                />

                <PolicyAccordion
                    title={t('Others')}
                    termsDocuments={appTerms}
                    privacyDocuments={appPrivacyPolicies}
                    cookieDocuments={appCookiePolicies}
                    bg={accordionBg}
                    hoverBg={accordionHoverBg}
                    linkColor={linkColor}
                />
            </Accordion>
        </VStack>
    );
};
