import { EmptyContent } from '@/components/common/EmptyContent';
import { useWallet } from '@/hooks';
import { useLegalDocuments, useVeChainKitConfig } from '@/providers';
import {
    LegalDocumentAgreement,
    LegalDocumentSource,
    LegalDocumentType,
} from '@/types';
import { compareAddresses, VECHAIN_KIT_TERMS_CONFIG } from '@/utils';
import { Accordion, VStack } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { LuGavel } from 'react-icons/lu';

import { PolicyAccordion } from './PolicyAccordion';

export const TermsAndPrivacyAccordion = () => {
    const { account } = useWallet();
    const { t } = useTranslation();
    const { darkMode: isDark } = useVeChainKitConfig();
    const { agreements, documents } = useLegalDocuments();

    const agreementsByDocumentType = useMemo(() => {
        const userAgreements = agreements?.filter((agreement) =>
            compareAddresses(agreement.walletAddress, account?.address),
        );
        const vechainKitDefaultTerms: LegalDocumentAgreement = {
            id: 'vechain-kit-terms',
            ...VECHAIN_KIT_TERMS_CONFIG,
            documentType: LegalDocumentType.TERMS,
            documentSource: LegalDocumentSource.VECHAIN_KIT,
            walletAddress: account?.address ?? '',
            timestamp: new Date().getTime(),
        };

        const userAgreementsWithVechainKitTerms = [
            vechainKitDefaultTerms,
            ...userAgreements,
        ];

        return userAgreementsWithVechainKitTerms?.reduce((acc, agreement) => {
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

    const hasAgreements = useMemo(() => {
        return Object.values(agreementsByDocumentType).some(
            (agreements) => agreements.length > 0,
        );
    }, [agreementsByDocumentType]);

    const accordionBg = isDark ? 'whiteAlpha.50' : 'blackAlpha.50';
    const accordionHoverBg = isDark ? 'whiteAlpha.100' : 'blackAlpha.100';

    const defaultOpenIndices = useMemo(() => {
        const indices: number[] = [];

        if (agreementsByDocumentType[LegalDocumentType.TERMS]?.length > 0) {
            indices.push(0);
        }
        if (agreementsByDocumentType[LegalDocumentType.PRIVACY]?.length > 0) {
            indices.push(1);
        }
        if (agreementsByDocumentType[LegalDocumentType.COOKIES]?.length > 0) {
            indices.push(2);
        }

        return indices;
    }, [agreementsByDocumentType]);

    if (!hasAgreements) {
        return (
            <EmptyContent
                title={t('No policies accepted')}
                description={t(
                    'When you have accepted a policy, it will appear here',
                )}
                icon={LuGavel}
            />
        );
    }

    return (
        <VStack spacing={4} align="stretch">
            <Accordion allowMultiple defaultIndex={defaultOpenIndices}>
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
