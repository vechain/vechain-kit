import { useLegalDocuments, useVeChainKitConfig } from '@/providers';
import { Accordion, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { PolicyAccordion } from './PolicyAccordion';
import { LegalDocumentType, LegalDocumentSource } from '@/types';
import { compareAddresses } from '@/utils';
import { useMemo } from 'react';
import { useWallet } from '@/hooks';

export const TermsAndPrivacyAccordion = () => {
    const { account } = useWallet();
    const { t } = useTranslation();
    const { darkMode: isDark } = useVeChainKitConfig();
    const {
        legalDocuments: { agreements },
    } = useLegalDocuments();

    const userAgreements = useMemo(() => {
        return agreements?.filter((agreement) =>
            compareAddresses(agreement.walletAddress, account?.address),
        );
    }, [agreements, account?.address]);

    //Vechain Kit current terms
    const currentVechainKitTerms = userAgreements?.find(
        (agreement) =>
            agreement.documentSource === LegalDocumentSource.VECHAIN_KIT &&
            agreement.documentType === LegalDocumentType.TERMS,
    );

    //Vechain Kit current privacy policy
    const currentVechainKitPrivacyPolicy = userAgreements?.find(
        (agreement) =>
            agreement.documentSource === LegalDocumentSource.VECHAIN_KIT &&
            agreement.documentType === LegalDocumentType.PRIVACY,
    );

    //Vechain Kit current cookie policy
    const currentVechainKitCookiePolicy = userAgreements?.find(
        (agreement) =>
            agreement.documentSource === LegalDocumentSource.VECHAIN_KIT &&
            agreement.documentType === LegalDocumentType.COOKIES,
    );

    //All terms and conditions agreements
    const allTermsAndConditionsAgreements = userAgreements?.filter(
        (agreement) => agreement.documentType === LegalDocumentType.TERMS,
    );

    //All privacy policies agreements
    const allPrivacyPoliciesAgreements = userAgreements?.filter(
        (agreement) => agreement.documentType === LegalDocumentType.PRIVACY,
    );

    //All cookie policies agreements
    const allCookiePoliciesAgreements = userAgreements?.filter(
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
