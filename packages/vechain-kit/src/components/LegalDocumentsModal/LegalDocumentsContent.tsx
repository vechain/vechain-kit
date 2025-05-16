import {
    StickyFooterContainer,
    StickyHeaderContainer,
} from '@/components/common';
import { useLegalDocuments, useVeChainKitConfig } from '@/providers';
import { EnrichedLegalDocument, LegalDocumentSource } from '@/types';
import {
    Button,
    ModalBody,
    ModalHeader,
    Stack,
    Text,
    VStack,
} from '@chakra-ui/react';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';

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

    // Separate required and optional documents
    const requiredDocuments = useMemo(() => {
        return documentsNotAgreed.filter((document) => document.required);
    }, [documentsNotAgreed]);

    const optionalDocuments = useMemo(() => {
        return documentsNotAgreed.filter((document) => !document.required);
    }, [documentsNotAgreed]);

    // Filter for VechainKit required documents
    const vechainKitRequiredDocuments = useMemo(() => {
        return requiredDocuments.filter(
            (document) =>
                document.documentSource === LegalDocumentSource.VECHAIN_KIT,
        );
    }, [requiredDocuments]);

    // Filter for other required documents
    const appRequiredDocuments = useMemo(() => {
        return requiredDocuments.filter(
            (document) => document.documentSource === LegalDocumentSource.OTHER,
        );
    }, [requiredDocuments]);

    // Filter for optional documents
    const allOptionalDocuments = useMemo(() => {
        return optionalDocuments;
    }, [optionalDocuments]);

    const defaultFormValues = documentsNotAgreed.reduce((acc, document) => {
        acc[getDocumentId(document)] = document.required;
        return acc;
    }, {} as Record<string, boolean>);

    const {
        handleSubmit,
        register,
        formState: { isValid },
    } = useForm<Record<string, boolean>>({
        defaultValues: defaultFormValues,
    });

    const onSubmit = (data: Record<string, boolean>) => {
        const agreedInputs = Object.entries(data)
            .filter(([_, checked]) => checked)
            .filter(Boolean);
        const agreedDocuments = documentsNotAgreed.filter((document) =>
            agreedInputs.some(([documentId]) => documentId === document.id),
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

    const hasVechainKitRequiredDocuments =
        vechainKitRequiredDocuments.length > 0;

    const appsAndOptionalDocuments = [
        ...appRequiredDocuments,
        ...allOptionalDocuments,
    ];
    const hasOtherDocuments = appsAndOptionalDocuments.length > 0;

    return (
        <Stack width="full">
            <form onSubmit={handleSubmit(onSubmit)}>
                <StickyHeaderContainer>
                    <ModalHeader>{t('Terms and Policies')}</ModalHeader>
                </StickyHeaderContainer>

                <ModalBody>
                    <VStack align="stretch" spacing={5} width="full">
                        {hasVechainKitRequiredDocuments ? (
                            <Text as="span" fontSize="sm">
                                <Trans
                                    key="vechainKitRequiredDocuments"
                                    i18nKey="By continuing, you agree to <links/>. Please take a moment to review all the terms, with acceptance being mandatory to continue."
                                    components={{
                                        links: (
                                            <>
                                                {vechainKitRequiredDocuments.map(
                                                    (document) => (
                                                        <LegalDocumentItem
                                                            document={document}
                                                            register={register}
                                                            isText={true}
                                                        />
                                                    ),
                                                )}
                                            </>
                                        ),
                                    }}
                                />
                            </Text>
                        ) : null}

                        {hasOtherDocuments && (
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
                                    {t('Others')}
                                </Text>
                                <VStack align="stretch" spacing={4}>
                                    {appsAndOptionalDocuments.map(
                                        (document) => (
                                            <LegalDocumentItem
                                                document={document}
                                                register={register}
                                            />
                                        ),
                                    )}
                                </VStack>
                            </Stack>
                        )}
                    </VStack>
                </ModalBody>
                <StickyFooterContainer>
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
                </StickyFooterContainer>
            </form>
        </Stack>
    );
};
