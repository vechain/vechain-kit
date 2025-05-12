import { LegalDocument } from '@/providers/VeChainKitProvider';
import { TermsAndConditions } from '@/types/legalDocuments';
import {
    AccordionButton,
    Icon,
    AccordionItem,
    Box,
    Text,
    AccordionPanel,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { IoChevronDown } from 'react-icons/io5';
import { IoChevronUp } from 'react-icons/io5';
import { PolicySection } from './PolicySection';

type PolicyAccordionProps = {
    title: string;
    termsDocuments: Array<LegalDocument | TermsAndConditions>;
    privacyDocuments: Array<LegalDocument | TermsAndConditions>;
    cookieDocuments: Array<LegalDocument | TermsAndConditions>;
    bg: string;
    hoverBg: string;
    linkColor: string;
};

export const PolicyAccordion = ({
    title,
    termsDocuments,
    privacyDocuments,
    cookieDocuments,
    bg,
    hoverBg,
    linkColor,
}: PolicyAccordionProps) => {
    const { t } = useTranslation();
    const hasDocuments =
        termsDocuments.length > 0 ||
        privacyDocuments.length > 0 ||
        cookieDocuments.length > 0;

    if (!hasDocuments) return null;

    return (
        <AccordionItem border="none" mb={3}>
            {({ isExpanded }) => (
                <>
                    <AccordionButton
                        bg={bg}
                        borderRadius="xl"
                        _hover={{
                            bg: hoverBg,
                        }}
                    >
                        <Box flex="1" textAlign="left" py={2}>
                            <Text fontWeight="700">{title}</Text>
                        </Box>
                        <Icon
                            as={isExpanded ? IoChevronUp : IoChevronDown}
                            fontSize="20px"
                            opacity={0.7}
                        />
                    </AccordionButton>
                    <AccordionPanel pb={4} pt={3}>
                        {termsDocuments.length > 0 && (
                            <PolicySection
                                title={t('Terms and Conditions')}
                                documents={termsDocuments}
                                linkColor={linkColor}
                            />
                        )}

                        {privacyDocuments.length > 0 && (
                            <PolicySection
                                title="Privacy Policies"
                                documents={privacyDocuments}
                                linkColor={linkColor}
                            />
                        )}

                        {cookieDocuments.length > 0 && (
                            <PolicySection
                                title="Cookie Policies"
                                documents={cookieDocuments}
                                linkColor={linkColor}
                            />
                        )}
                    </AccordionPanel>
                </>
            )}
        </AccordionItem>
    );
};
