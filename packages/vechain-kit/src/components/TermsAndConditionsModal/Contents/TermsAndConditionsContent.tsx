import { StickyHeaderContainer } from '@/components/common';
import { useTermsAndConditions } from '@/hooks/utils/useTermsAndConditions';
import { LegalDocument, useVeChainKitConfig } from '@/providers';
import { VECHAIN_KIT_TERMS_CONFIG } from '@/utils/Constants';
import {
    Button,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Stack,
    Text,
    VStack,
} from '@chakra-ui/react';
import { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { TermItem } from '../Components';

type Props = {
    onAgree: () => void;
    onCancel: () => void;
};

export const TermsAndConditionsContent = ({ onAgree, onCancel }: Props) => {
    const { t } = useTranslation();
    const { darkMode: isDark } = useVeChainKitConfig();
    const { allTermsNotAccepted, agreeToTerms, getTermId } =
        useTermsAndConditions();

    const vechainKitTerms = useMemo(() => {
        return allTermsNotAccepted.filter(
            (term) => term.url === VECHAIN_KIT_TERMS_CONFIG.url,
        );
    }, [allTermsNotAccepted]);

    const appTerms = useMemo(() => {
        return allTermsNotAccepted.filter(
            (term) => term.url !== VECHAIN_KIT_TERMS_CONFIG.url,
        );
    }, [allTermsNotAccepted]);

    const shouldShowCategories =
        vechainKitTerms.length > 0 && appTerms.length > 0;

    const defaultFormValues = allTermsNotAccepted.reduce((acc, term) => {
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
                    allTermsNotAccepted.find(
                        (term) => getTermId(term) === termId,
                    ),
                )
                .filter(Boolean) as LegalDocument[];

            if (agreedTerms.length > 0) {
                agreeToTerms(agreedTerms);
            }

            onAgree();
        },
        [agreeToTerms, allTermsNotAccepted, getTermId, onAgree],
    );

    const borderColor = isDark ? '#3a3a3a' : '#eaeaea';
    const sectionBgColor = isDark ? '#2a2a2a' : '#f5f5f5';
    const headingColor = isDark ? 'gray.300' : 'gray.600';
    const sectionBoxShadow = isDark
        ? '0 2px 8px rgba(0, 0, 0, 0.2)'
        : '0 2px 8px rgba(0, 0, 0, 0.05)';

    const renderTermsSection = (terms: LegalDocument[], title?: string) => (
        <Stack
            p={4}
            borderRadius="xl"
            bg={sectionBgColor}
            borderWidth="1px"
            borderColor={borderColor}
            boxShadow={sectionBoxShadow}
            spacing={shouldShowCategories ? 4 : 3}
        >
            {shouldShowCategories && title && (
                <Text fontSize="md" fontWeight="bold" color={headingColor}>
                    {title}
                </Text>
            )}
            <VStack align="stretch" spacing={4}>
                {terms.map((term) => (
                    <TermItem
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
                    <ModalHeader>{t('Terms and Conditions')}</ModalHeader>
                </StickyHeaderContainer>

                <ModalBody pt={6}>
                    <VStack align="stretch" spacing={6} width="full">
                        {shouldShowCategories ? (
                            <>
                                {renderTermsSection(
                                    vechainKitTerms,
                                    t('Vechain Kit'),
                                )}
                                {renderTermsSection(appTerms, t('Others'))}
                            </>
                        ) : (
                            renderTermsSection(allTermsNotAccepted)
                        )}

                        <VStack w={'full'} spacing={3} pt={4}>
                            <Button
                                onClick={handleSubmit(onSubmit)}
                                variant="vechainKitPrimary"
                                width="full"
                                isDisabled={!isValid}
                            >
                                {t('Accept')}
                            </Button>
                            <Button
                                variant="vechainKitSecondary"
                                width="full"
                                onClick={onCancel}
                            >
                                {t('Cancel')}
                            </Button>
                        </VStack>
                    </VStack>
                </ModalBody>

                <ModalFooter pt={0} />
            </form>
        </Stack>
    );
};
