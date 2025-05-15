import { useLegalDocuments, useVeChainKitConfig } from '@/providers';
import {
    VECHAIN_KIT_TERMS_CONFIG,
    VECHAIN_KIT_PRIVACY_CONFIG,
    VECHAIN_KIT_COOKIE_CONFIG,
} from '@/utils/Constants';
import { Accordion, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { PolicyAccordion } from './PolicyAccordion';
import { LegalDocumentType } from '@/types';

export const TermsAndPrivacyAccordion = () => {
    const { t } = useTranslation();
    const { darkMode: isDark } = useVeChainKitConfig();
    const {
        legalDocuments: { agreements },
    } = useLegalDocuments();

    //Vechain Kit current terms
    const currentVechainKitTerms = agreements?.find(
        (agreement) => agreement.url === VECHAIN_KIT_TERMS_CONFIG.url,
    );

    //Vechain Kit current privacy policy
    const currentVechainKitPrivacyPolicy = agreements?.find(
        (agreement) => agreement.url === VECHAIN_KIT_PRIVACY_CONFIG.url,
    );

    //Vechain Kit current cookie policy
    const currentVechainKitCookiePolicy = agreements?.find(
        (agreement) => agreement.url === VECHAIN_KIT_COOKIE_CONFIG.url,
    );

    //All terms and conditions agreements
    const allTermsAndConditionsAgreements = agreements?.filter(
        (agreement) => agreement.documentType === LegalDocumentType.TERMS,
    );

    //All privacy policies agreements
    const allPrivacyPoliciesAgreements = agreements?.filter(
        (agreement) => agreement.documentType === LegalDocumentType.PRIVACY,
    );

    //All cookie policies agreements
    const allCookiePoliciesAgreements = agreements?.filter(
        (agreement) => agreement.documentType === LegalDocumentType.COOKIES,
    );

    const accordionBg = isDark ? 'whiteAlpha.50' : 'blackAlpha.50';
    const accordionHoverBg = isDark ? 'whiteAlpha.100' : 'blackAlpha.100';

    return (
        <VStack spacing={4} align="stretch">
            <Accordion allowMultiple>
                <PolicyAccordion
                    title={t('Terms and Conditions')}
                    description={t(
                        'Legal agreement between you, Vechain Kit and the current app, outlining the rules for using wallet services.',
                    )}
                    documents={allTermsAndConditionsAgreements}
                    bg={accordionBg}
                    hoverBg={accordionHoverBg}
                    currentPolicy={currentVechainKitTerms}
                />

                <PolicyAccordion
                    title={t('Privacy Policy')}
                    description={t(
                        'Privacy policy outlining the data collection and processing practices.',
                    )}
                    documents={allPrivacyPoliciesAgreements}
                    bg={accordionBg}
                    hoverBg={accordionHoverBg}
                    currentPolicy={currentVechainKitPrivacyPolicy}
                />

                <PolicyAccordion
                    title={t('Cookie Policy')}
                    description={t(
                        'Cookie policy outlining the use of cookies and tracking technologies.',
                    )}
                    documents={allCookiePoliciesAgreements}
                    bg={accordionBg}
                    hoverBg={accordionHoverBg}
                    currentPolicy={currentVechainKitCookiePolicy}
                />
            </Accordion>
        </VStack>
    );
};
