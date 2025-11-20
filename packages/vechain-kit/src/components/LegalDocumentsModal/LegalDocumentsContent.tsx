import { StickyHeaderContainer } from '@/components/common';
import { useLegalDocuments, useVeChainKitConfig } from '@/providers';
import { EnrichedLegalDocument } from '@/types';
import {
    Button,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Stack,
    Text,
    VStack,
} from '@chakra-ui/react';
import { Fragment, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';

import { LegalDocumentItem } from './Components';

type Props = {
    onAgree: (
        documents: EnrichedLegalDocument | EnrichedLegalDocument[],
    ) => void;
    onReject: () => void;
    onlyOptionalDocuments?: boolean;
};

export const LegalDocumentsContent = ({
    onAgree,
    onReject,
    onlyOptionalDocuments = false,
}: Props) => {
    const { t } = useTranslation();
    const { darkMode: isDark } = useVeChainKitConfig();
    const { documentsNotAgreed } = useLegalDocuments();

    const { requiredDocuments, optionalDocuments } = useMemo(() => {
        return documentsNotAgreed.reduce<{
            requiredDocuments: EnrichedLegalDocument[];
            optionalDocuments: EnrichedLegalDocument[];
        }>(
            (acc, document) => {
                if (document.required) {
                    acc.requiredDocuments.push(document);
                } else {
                    acc.optionalDocuments.push(document);
                }
                return acc;
            },
            { requiredDocuments: [], optionalDocuments: [] },
        );
    }, [documentsNotAgreed]);

    const defaultFormValues = useMemo(() => {
        return documentsNotAgreed.reduce<Record<string, boolean>>(
            (acc, document) => {
                acc[document.id] = document.required;
                return acc;
            },
            {},
        );
    }, [documentsNotAgreed]);

    const {
        handleSubmit,
        register,
        formState: { isValid },
        watch,
    } = useForm<Record<string, boolean>>({
        defaultValues: defaultFormValues,
    });

    const formValues = watch();

    // Calculate if any optional documents are selected
    const selectedDocuments = useMemo(() => {
        return documentsNotAgreed.filter((document) => formValues[document.id]);
    }, [documentsNotAgreed, formValues]);

    // Calculate if all optional documents are selected
    const allSelected = documentsNotAgreed?.length === selectedDocuments.length;

    const onSubmit = useCallback(
        (data: Record<string, boolean>) => {
            const agreedDocumentIds = new Set(
                Object.entries(data)
                    .filter(([_, checked]) => checked)
                    .map(([docId]) => docId),
            );

            const agreedDocuments = documentsNotAgreed.filter((document) =>
                agreedDocumentIds.has(document.id),
            );
            return onAgree(agreedDocuments);
        },
        [documentsNotAgreed, onAgree],
    );

    const borderColor = isDark ? '#3a3a3a' : '#eaeaea';
    const sectionBgColor = isDark ? '#2a2a2a' : '#f5f5f5';
    const headingColor = isDark ? 'gray.300' : 'gray.600';
    const sectionBoxShadow = isDark
        ? '0 2px 8px rgba(0, 0, 0, 0.2)'
        : '0 2px 8px rgba(0, 0, 0, 0.05)';

    const hasRequiredDocuments = requiredDocuments.length > 0;
    const hasOptionalDocuments = optionalDocuments.length > 0;

    // Determine the text for the accept button based on selection state
    const acceptButtonText = useMemo(() => {
        const selectedOptionalCount = optionalDocuments.filter(
            (doc) => formValues[doc.id],
        ).length;

        if (allSelected) {
            return t('Accept all');
        }
        if (onlyOptionalDocuments && selectedOptionalCount === 0) {
            return t('Ignore and continue');
        }
        if (
            (hasRequiredDocuments && !hasOptionalDocuments) ||
            (hasRequiredDocuments && selectedOptionalCount === 0)
        ) {
            return t('Accept');
        }
        return t('Accept selected');
    }, [onlyOptionalDocuments, allSelected, optionalDocuments, formValues]);

    const requiredTextDivider = (index: number) => {
        //If the last two documents, and there are more than 1 document, return ' and '
        if (
            index === requiredDocuments.length - 2 &&
            requiredDocuments.length > 1
        ) {
            return t(' and ');
        }
        return ', ';
    };

    return (
        <Stack width="full">
            <form onSubmit={handleSubmit(onSubmit)}>
                <StickyHeaderContainer>
                    <ModalHeader>{t('Terms and Policies')}</ModalHeader>
                </StickyHeaderContainer>

                <ModalBody>
                    <VStack align="stretch" spacing={5} width="full">
                        {hasRequiredDocuments && (
                            <Text as="span" fontSize="sm">
                                {t('By continuing, you agree to')}{' '}
                                {requiredDocuments.map((document, index) => (
                                    <Fragment key={document.id}>
                                        <LegalDocumentItem
                                            key={document.id}
                                            document={document}
                                            register={register}
                                            isText={true}
                                        />
                                        {index < requiredDocuments.length - 1
                                            ? requiredTextDivider(index)
                                            : null}
                                    </Fragment>
                                ))}
                                .{' '}
                                {t(
                                    'Please take a moment to review all the policies, with acceptance being mandatory to continue.',
                                )}
                            </Text>
                        )}
                        {onlyOptionalDocuments && (
                            <Text fontSize="sm" color={headingColor} mb={3}>
                                <Trans
                                    i18nKey="<bold>Your privacy matters.</bold> You’re in control, accept to enable optional features like cookies that help us enhance your experience."
                                    components={{
                                        bold: (
                                            <Text
                                                as="span"
                                                fontWeight="semibold"
                                                color={headingColor}
                                            />
                                        ),
                                    }}
                                />
                            </Text>
                        )}

                        {hasOptionalDocuments && (
                            <Stack
                                p={4}
                                borderRadius="xl"
                                bg={sectionBgColor}
                                borderWidth="1px"
                                borderColor={borderColor}
                                boxShadow={sectionBoxShadow}
                                spacing={5}
                            >
                                <Text
                                    fontSize="md"
                                    fontWeight="bold"
                                    color={headingColor}
                                >
                                    {t('Optional')}
                                </Text>
                                <VStack align="stretch" spacing={4}>
                                    {optionalDocuments.map((document) => (
                                        <LegalDocumentItem
                                            key={document.id}
                                            document={document}
                                            register={register}
                                        />
                                    ))}
                                </VStack>
                            </Stack>
                        )}
                    </VStack>
                </ModalBody>
                <ModalFooter>
                    <VStack width="full" spacing={3}>
                        <Button
                            variant="vechainKitSecondary"
                            width="full"
                            type="submit"
                            isDisabled={!isValid}
                            data-testid={'accept-tnc-button'}
                        >
                            {acceptButtonText}
                        </Button>
                        {!onlyOptionalDocuments && (
                            <Button
                                variant="ghost"
                                width="full"
                                onClick={onReject}
                                data-testid={'reject-tnc-button'}
                                colorScheme="red"
                            >
                                {t('Reject and logout')}
                            </Button>
                        )}
                    </VStack>
                </ModalFooter>
            </form>
        </Stack>
    );
};
