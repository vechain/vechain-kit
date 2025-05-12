import { useLegalDocuments, useVeChainKitConfig } from '@/providers';
import { Accordion, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { VECHAIN_KIT_TERMS_CONFIG } from '@/utils/Constants';
import { LegalDocument } from '@/providers/VeChainKitProvider';
import { PolicyAccordion } from './PolicyAccordion';

export const TermsAndPrivacyAccordion = () => {
    const { t } = useTranslation();
    const { darkMode: isDark } = useVeChainKitConfig();
    const {
        termsAndConditions: { terms },
    } = useLegalDocuments();
    const { legalDocuments } = useVeChainKitConfig();

    // VeChain Kit terms
    const vechainKitTerms =
        terms?.filter((term) => term.url === VECHAIN_KIT_TERMS_CONFIG.url) ||
        [];

    // Application terms
    const appTerms =
        terms?.filter((term) => term.url !== VECHAIN_KIT_TERMS_CONFIG.url) ||
        [];

    //TODO: Handle other privacy policies
    const vechainKitPrivacyPolicy: LegalDocument[] = [];
    const appPrivacyPolicies = legalDocuments?.privacyPolicy || [];

    const vechainKitCookiePolicy: LegalDocument[] = [];
    const appCookiePolicies = legalDocuments?.cookiePolicy || [];

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
