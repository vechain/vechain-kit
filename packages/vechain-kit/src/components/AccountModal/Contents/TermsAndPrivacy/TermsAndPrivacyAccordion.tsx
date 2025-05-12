import { useLegalDocuments, useVeChainKitConfig } from '@/providers';
import {
    Accordion,
    AccordionButton,
    AccordionItem,
    AccordionPanel,
    Box,
    Icon,
    Link,
    Stack,
    Text,
    VStack,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { IoChevronDown, IoChevronUp } from 'react-icons/io5';
import { VECHAIN_KIT_TERMS_CONFIG } from '@/utils/Constants';
import { LegalDocument } from '@/providers/VeChainKitProvider';
import { TermsAndConditions } from '@/types';

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

    const renderDocumentLink = (
        document: LegalDocument | TermsAndConditions,
    ) => {
        const linkColor = isDark ? '#63B3ED' : '#3182CE';
        const title = document.displayName || 'Legal Document';

        return (
            <Link
                href={document.url}
                target="_blank"
                rel="noopener noreferrer"
                color={linkColor}
                textDecoration="underline"
                fontWeight="medium"
                isExternal
            >
                {title}
            </Link>
        );
    };

    const renderPolicySection = (
        title: string,
        documents: Array<LegalDocument | TermsAndConditions>,
    ) => {
        if (!documents || documents.length === 0) return null;

        return (
            <>
                <Text fontSize="sm" fontWeight="medium" mb={2} opacity={0.8}>
                    {title}
                </Text>
                <Stack spacing={2} mb={4} pl={2}>
                    {documents.map((doc, idx) => (
                        <Box key={idx}>{renderDocumentLink(doc)}</Box>
                    ))}
                </Stack>
            </>
        );
    };

    const hasVechainKitPolicies =
        vechainKitTerms.length > 0 ||
        vechainKitPrivacyPolicy.length > 0 ||
        vechainKitCookiePolicy.length > 0;

    const hasAppPolicies =
        appTerms.length > 0 ||
        appPrivacyPolicies.length > 0 ||
        appCookiePolicies.length > 0;

    return (
        <VStack spacing={4} align="stretch">
            <Accordion allowMultiple>
                {hasVechainKitPolicies && (
                    <AccordionItem border="none" mb={3}>
                        {({ isExpanded }) => (
                            <>
                                <AccordionButton
                                    bg={
                                        isDark
                                            ? 'whiteAlpha.50'
                                            : 'blackAlpha.50'
                                    }
                                    borderRadius="xl"
                                    _hover={{
                                        bg: isDark
                                            ? 'whiteAlpha.100'
                                            : 'blackAlpha.100',
                                    }}
                                >
                                    <Box flex="1" textAlign="left" py={2}>
                                        <Text fontWeight="700">
                                            {t('Vechain Kit')}
                                        </Text>
                                    </Box>
                                    <Icon
                                        as={
                                            isExpanded
                                                ? IoChevronUp
                                                : IoChevronDown
                                        }
                                        fontSize="20px"
                                        opacity={0.7}
                                    />
                                </AccordionButton>
                                <AccordionPanel pb={4} pt={3}>
                                    {renderPolicySection(
                                        t('Terms and Conditions'),
                                        vechainKitTerms,
                                    )}

                                    {vechainKitPrivacyPolicy.length > 0 &&
                                        renderPolicySection(
                                            'Privacy Policies',
                                            vechainKitPrivacyPolicy,
                                        )}

                                    {vechainKitCookiePolicy.length > 0 &&
                                        renderPolicySection(
                                            'Cookie Policies',
                                            vechainKitCookiePolicy,
                                        )}
                                </AccordionPanel>
                            </>
                        )}
                    </AccordionItem>
                )}

                {hasAppPolicies && (
                    <AccordionItem border="none">
                        {({ isExpanded }) => (
                            <>
                                <AccordionButton
                                    bg={
                                        isDark
                                            ? 'whiteAlpha.50'
                                            : 'blackAlpha.50'
                                    }
                                    borderRadius="xl"
                                    _hover={{
                                        bg: isDark
                                            ? 'whiteAlpha.100'
                                            : 'blackAlpha.100',
                                    }}
                                >
                                    <Box flex="1" textAlign="left" py={2}>
                                        <Text fontWeight="700">
                                            {t('Others')}
                                        </Text>
                                    </Box>
                                    <Icon
                                        as={
                                            isExpanded
                                                ? IoChevronUp
                                                : IoChevronDown
                                        }
                                        fontSize="20px"
                                        opacity={0.7}
                                    />
                                </AccordionButton>
                                <AccordionPanel pb={4} pt={3}>
                                    {renderPolicySection(
                                        t('Terms and Conditions'),
                                        appTerms,
                                    )}

                                    {appPrivacyPolicies.length > 0 &&
                                        renderPolicySection(
                                            'Privacy Policies',
                                            appPrivacyPolicies,
                                        )}

                                    {appCookiePolicies.length > 0 &&
                                        renderPolicySection(
                                            'Cookie Policies',
                                            appCookiePolicies,
                                        )}
                                </AccordionPanel>
                            </>
                        )}
                    </AccordionItem>
                )}
            </Accordion>
        </VStack>
    );
};
