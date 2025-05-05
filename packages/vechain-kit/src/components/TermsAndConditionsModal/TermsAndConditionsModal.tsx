import { BaseModal } from '@/components/common';
import { useTermsAndConditions } from '@/hooks/utils/useTermsAndConditions';
import {
    Button,
    ModalBody,
    ModalCloseButton,
    ModalFooter,
    ModalHeader,
    Stack,
    Text,
    VStack,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useCallback, useMemo } from 'react';
import { VECHAIN_KIT_TERMS_CONFIG } from '@/utils/Constants';
import { LegalDocument } from '@/providers';
import { useTranslation } from 'react-i18next';
import { TermItem } from './components';
type Props = {
    isOpen: boolean;
    onClose: () => void;
    onAgree: () => void;
};

export const TermsAndConditionsModal = ({
    isOpen,
    onClose,
    onAgree,
}: Props) => {
    const { t } = useTranslation();
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

    const defaultFormValues = allTermsNotAccepted.reduce((acc, term) => {
        acc[getTermId(term)] = false;
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

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            allowExternalFocus={true}
            blockScrollOnMount={true}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <ModalHeader>Terms and Conditions</ModalHeader>
                <ModalCloseButton onClick={onClose} />
                <ModalBody>
                    <VStack align="stretch" spacing={5} width="full">
                        {vechainKitTerms.length > 0 && appTerms.length > 0 ? (
                            <>
                                <Text fontSize={'md'} fontWeight={'bold'}>
                                    {t('Vechain Kit')}
                                </Text>
                                {vechainKitTerms.map((term) => (
                                    <TermItem
                                        key={getTermId(term)}
                                        term={term}
                                        register={register}
                                        getTermId={getTermId}
                                    />
                                ))}
                                <Text fontSize={'md'} fontWeight={'bold'}>
                                    {t('Others')}
                                </Text>
                                {appTerms.map((term) => (
                                    <TermItem
                                        key={getTermId(term)}
                                        term={term}
                                        register={register}
                                        getTermId={getTermId}
                                    />
                                ))}
                            </>
                        ) : (
                            <Stack spacing={3}>
                                {allTermsNotAccepted.map((term) => (
                                    <TermItem
                                        key={getTermId(term)}
                                        term={term}
                                        register={register}
                                        getTermId={getTermId}
                                    />
                                ))}
                            </Stack>
                        )}
                    </VStack>
                </ModalBody>
                <ModalFooter w="full" display="flex" gap={2}>
                    <Button variant="vechainKitSecondary" onClick={onClose}>
                        {t('Cancel')}
                    </Button>
                    <Button
                        variant="vechainKitPrimary"
                        type="submit"
                        px={8}
                        isDisabled={!isValid}
                    >
                        {t('Accept')}
                    </Button>
                </ModalFooter>
            </form>
        </BaseModal>
    );
};
