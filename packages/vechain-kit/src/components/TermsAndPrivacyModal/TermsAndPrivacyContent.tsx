import { StickyHeaderContainer } from '@/components/common';
import { useLegalDocuments, useVeChainKitConfig } from '@/providers';
import { TermsAndConditions } from '@/types';
import { VECHAIN_KIT_TERMS_CONFIG } from '@/utils/Constants';
import {
    Button,
    Icon,
    Link,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Stack,
    Text,
    VStack,
} from '@chakra-ui/react';
import { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { FaExternalLinkAlt } from 'react-icons/fa';

import { PrivacyItem } from './Components';

type Props = {
    onAgree: (terms: TermsAndConditions | TermsAndConditions[]) => void;
    onReject: () => void;
};

export const TermsAndPrivacyContent = ({ onAgree, onReject }: Props) => {
    const { t } = useTranslation();
    const { darkMode: isDark } = useVeChainKitConfig();
    const {
        termsAndConditions: { termsNotAgreed, getTermId },
    } = useLegalDocuments();

    // Separate required and optional terms
    const requiredTerms = useMemo(() => {
        return termsNotAgreed.filter((term) => term.required);
    }, [termsNotAgreed]);

    const optionalTerms = useMemo(() => {
        return termsNotAgreed.filter((term) => !term.required);
    }, [termsNotAgreed]);

    // Filter for VechainKit required terms
    const vechainKitRequiredTerms = useMemo(() => {
        return requiredTerms.filter(
            (term) => term.url === VECHAIN_KIT_TERMS_CONFIG.url,
        );
    }, [requiredTerms]);

    // Filter for other required terms
    const appRequiredTerms = useMemo(() => {
        return requiredTerms.filter(
            (term) => term.url !== VECHAIN_KIT_TERMS_CONFIG.url,
        );
    }, [requiredTerms]);

    // Filter for optional terms
    const vechainKitOptionalTerms = useMemo(() => {
        return optionalTerms.filter(
            (term) => term.url === VECHAIN_KIT_TERMS_CONFIG.url,
        );
    }, [optionalTerms]);

    const appOptionalTerms = useMemo(() => {
        return optionalTerms.filter(
            (term) => term.url !== VECHAIN_KIT_TERMS_CONFIG.url,
        );
    }, [optionalTerms]);

    const allOptionalTerms = useMemo(() => {
        return [...vechainKitOptionalTerms, ...appOptionalTerms];
    }, [vechainKitOptionalTerms, appOptionalTerms]);

    const shouldShowCategories =
        (vechainKitRequiredTerms.length > 0 || appRequiredTerms.length > 0) &&
        allOptionalTerms.length > 0;

    const defaultFormValues = termsNotAgreed.reduce((acc, term) => {
        acc[getTermId(term)] = term.required;
        return acc;
    }, {} as Record<string, boolean>);

    const {
        handleSubmit,
        register,
        formState: { isValid },
    } = useForm<Record<string, boolean>>({
        defaultValues: defaultFormValues,
    });

    const onSubmit = useCallback(
        (data: Record<string, boolean>) => {
            const agreedTerms = Object.entries(data)
                .filter(([_, checked]) => checked)
                .map(([termId]) =>
                    termsNotAgreed.find((term) => getTermId(term) === termId),
                )
                .filter(Boolean) as TermsAndConditions[];

            if (agreedTerms.length > 0) {
                onAgree(agreedTerms);
            }
        },
        [termsNotAgreed, getTermId, onAgree],
    );

    const borderColor = isDark ? '#3a3a3a' : '#eaeaea';
    const sectionBgColor = isDark ? '#2a2a2a' : '#f5f5f5';
    const headingColor = isDark ? 'gray.300' : 'gray.600';
    const sectionBoxShadow = isDark
        ? '0 2px 8px rgba(0, 0, 0, 0.2)'
        : '0 2px 8px rgba(0, 0, 0, 0.05)';

    const hasVechainKitRequiredTerms = vechainKitRequiredTerms.length > 0;
    const hasMultipleVechainKitRequiredTerms =
        vechainKitRequiredTerms.length > 1;
    const appsAndOptionalTerms = [...appRequiredTerms, ...allOptionalTerms];
    const hasOtherTerms = appsAndOptionalTerms.length > 0;

    const renderTermsSection = (
        terms: TermsAndConditions[],
        title?: string,
    ) => (
        <Stack
            p={4}
            borderRadius="xl"
            bg={sectionBgColor}
            borderWidth="1px"
            borderColor={borderColor}
            boxShadow={sectionBoxShadow}
            spacing={5}
        >
            {shouldShowCategories && title && (
                <Text fontSize="md" fontWeight="bold" color={headingColor}>
                    {title}
                </Text>
            )}
            <VStack align="stretch" spacing={4}>
                {terms.map((term) => (
                    <PrivacyItem
                        key={getTermId(term)}
                        term={term}
                        register={register}
                        getTermId={getTermId}
                    />
                ))}
            </VStack>
        </Stack>
    );

    return (
        <Stack width="full">
            <form onSubmit={handleSubmit(onSubmit)}>
                <StickyHeaderContainer>
                    <ModalHeader>{t('Terms and Privacy')}</ModalHeader>
                </StickyHeaderContainer>

                <ModalBody>
                    <VStack align="stretch" spacing={5} width="full">
                        {hasVechainKitRequiredTerms ? (
                            <Text as="span" fontSize="sm">
                                <Trans
                                    i18nKey="By continuing, you agree to <links/>. Please take a moment to review all the terms, with acceptance being mandatory to continue."
                                    components={{
                                        links: (
                                            <>
                                                {vechainKitRequiredTerms.map(
                                                    (term, index) => (
                                                        <Link
                                                            key={getTermId(
                                                                term,
                                                            )}
                                                            href={term.url}
                                                            isExternal
                                                            color={'blue.500'}
                                                            textDecoration="underline"
                                                            _hover={{
                                                                color: 'blue.300',
                                                                textDecoration:
                                                                    'underline',
                                                            }}
                                                            fontWeight="medium"
                                                            display="contents"
                                                            alignItems="center"
                                                        >
                                                            {term?.displayName ??
                                                                'Vechain Kit Terms'}
                                                            <Icon
                                                                as={
                                                                    FaExternalLinkAlt
                                                                }
                                                                ml={1}
                                                            />
                                                            {hasMultipleVechainKitRequiredTerms &&
                                                                index <
                                                                    vechainKitRequiredTerms.length -
                                                                        1 &&
                                                                ' and '}
                                                        </Link>
                                                    ),
                                                )}
                                            </>
                                        ),
                                    }}
                                />
                            </Text>
                        ) : null}

                        {hasOtherTerms &&
                            renderTermsSection(
                                appsAndOptionalTerms,
                                t('Others'),
                            )}
                    </VStack>
                </ModalBody>
                <ModalFooter>
                    <VStack w={'full'} spacing={3}>
                        <Button
                            onClick={handleSubmit(onSubmit)}
                            variant="vechainKitPrimary"
                            width="full"
                            isDisabled={!isValid}
                            data-testid={'accept-tnc-button'}
                        >
                            {t('Accept')}
                        </Button>
                        <Button
                            variant="ghost"
                            width="full"
                            onClick={onReject}
                            data-testid={'reject-tnc-button'}
                            colorScheme="red"
                        >
                            {t('Reject and logout')}
                        </Button>
                    </VStack>
                </ModalFooter>
            </form>
        </Stack>
    );
};
