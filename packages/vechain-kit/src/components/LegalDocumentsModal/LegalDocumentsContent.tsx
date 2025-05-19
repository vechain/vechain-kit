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
import { useMemo } from 'react';
import { Fragment } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { LegalDocumentItem } from './Components';

type Props = {
    onAgree: (
        documents: EnrichedLegalDocument | EnrichedLegalDocument[],
    ) => void;
    onReject: () => void;
};

export const LegalDocumentsContent = ({ onAgree, onReject }: Props) => {
    const { t } = useTranslation();
    const { darkMode: isDark } = useVeChainKitConfig();
    const {
        legalDocuments: { documentsNotAgreed, getDocumentId },
    } = useLegalDocuments();

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
                acc[getDocumentId(document)] = document.required;
                return acc;
            },
            {},
        );
    }, [documentsNotAgreed, getDocumentId]);

    const {
        handleSubmit,
        register,
        formState: { isValid },
    } = useForm<Record<string, boolean>>({
        defaultValues: defaultFormValues,
    });

    const onSubmit = (data: Record<string, boolean>) => {
        const agreedDocumentIds = new Set(
            Object.entries(data)
                .filter(([_, checked]) => checked)
                .map(([docId]) => docId),
        );

        const agreedDocuments = documentsNotAgreed.filter((document) =>
            agreedDocumentIds.has(getDocumentId(document)),
        );

        if (agreedDocuments.length > 0) {
            return onAgree(agreedDocuments);
        }
    };

    const borderColor = isDark ? '#3a3a3a' : '#eaeaea';
    const sectionBgColor = isDark ? '#2a2a2a' : '#f5f5f5';
    const headingColor = isDark ? 'gray.300' : 'gray.600';
    const sectionBoxShadow = isDark
        ? '0 2px 8px rgba(0, 0, 0, 0.2)'
        : '0 2px 8px rgba(0, 0, 0, 0.05)';

    const hasRequiredDocuments = requiredDocuments.length > 0;
    const hasOptionalDocuments = optionalDocuments.length > 0;

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
                                    <Fragment key={getDocumentId(document)}>
                                        <LegalDocumentItem
                                            key={getDocumentId(document)}
                                            document={document}
                                            register={register}
                                            isText={true}
                                        />
                                        {index < requiredDocuments.length - 1
                                            ? index ===
                                                  requiredDocuments.length -
                                                      2 &&
                                              requiredDocuments.length > 1
                                                ? t(' and ')
                                                : ', '
                                            : null}
                                    </Fragment>
                                ))}
                                .{' '}
                                {t(
                                    'Please take a moment to review all the policies, with acceptance being mandatory to continue.',
                                )}
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
                                            key={getDocumentId(document)}
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
                            variant="vechainKitPrimary"
                            width="full"
                            type="submit"
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
