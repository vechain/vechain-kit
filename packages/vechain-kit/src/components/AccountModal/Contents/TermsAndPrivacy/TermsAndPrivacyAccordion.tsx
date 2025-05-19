import { useWallet } from '@/hooks';
import { useLegalDocuments, useVeChainKitConfig } from '@/providers';
import { LegalDocumentAgreement, LegalDocumentType } from '@/types';
import { compareAddresses } from '@/utils';
import { Accordion, VStack } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { PolicyAccordion } from './PolicyAccordion';

export const TermsAndPrivacyAccordion = () => {
    const { account } = useWallet();
    const { t } = useTranslation();
    const { darkMode: isDark } = useVeChainKitConfig();
    const {
        legalDocuments: { agreements, documents },
    } = useLegalDocuments();

    const agreementsByDocumentType = useMemo(() => {
        const filteredAgreements = agreements?.filter((agreement) =>
            compareAddresses(agreement.walletAddress, account?.address),
        );

        return filteredAgreements?.reduce((acc, agreement) => {
            acc[agreement.documentType] = [
                ...(acc[agreement.documentType] || []),
                agreement,
            ];
            return acc;
        }, {} as Record<LegalDocumentType, LegalDocumentAgreement[]>);
    }, [agreements, account?.address]);

    const latestDocumentsByType = useMemo(() => {
        return documents.reduce((acc, document) => {
            const docType = document.documentType;
            if (!acc[docType] || document.version > acc[docType].version) {
                acc[docType] = document;
            }
            return acc;
        }, {} as Record<LegalDocumentType, (typeof documents)[0]>);
    }, [documents]);

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
                    documents={
                        agreementsByDocumentType[LegalDocumentType.TERMS]
                    }
                    bg={accordionBg}
                    hoverBg={accordionHoverBg}
                    currentPolicy={
                        latestDocumentsByType[LegalDocumentType.TERMS]
                    }
                />

                <PolicyAccordion
                    title={t('Privacy Policy')}
                    description={t(
                        'Privacy policy outlining the data collection and processing practices.',
                    )}
                    documents={
                        agreementsByDocumentType[LegalDocumentType.PRIVACY]
                    }
                    bg={accordionBg}
                    hoverBg={accordionHoverBg}
                    currentPolicy={
                        latestDocumentsByType[LegalDocumentType.PRIVACY]
                    }
                />

                <PolicyAccordion
                    title={t('Cookie Policy')}
                    description={t(
                        'Cookie policy outlining the use of cookies and tracking technologies.',
                    )}
                    documents={
                        agreementsByDocumentType[LegalDocumentType.COOKIES]
                    }
                    bg={accordionBg}
                    hoverBg={accordionHoverBg}
                    currentPolicy={
                        latestDocumentsByType[LegalDocumentType.COOKIES]
                    }
                />
            </Accordion>
        </VStack>
    );
};
