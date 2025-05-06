import { BaseModal } from '@/components/common';
import { useTermsAndConditions } from '@/hooks/utils/useTermsAndConditions';
import { LegalDocument, useVeChainKitConfig } from '@/providers';
import { VECHAIN_KIT_TERMS_CONFIG } from '@/utils/Constants';
import {
    Box,
    Button,
    Divider,
    Heading,
    HStack,
    Icon,
    ModalBody,
    ModalCloseButton,
    ModalFooter,
    ModalHeader,
    Text,
    VStack,
} from '@chakra-ui/react';
import { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FiFileText } from 'react-icons/fi';

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

    const borderColor = isDark ? '#3a3a3a' : '#eaeaea';
    const sectionBgColor = isDark ? '#2a2a2a' : '#f5f5f5';

    const headingColor = isDark ? 'gray.300' : 'gray.600';
    const sectionBoxShadow = isDark
        ? '0 2px 8px rgba(0, 0, 0, 0.2)'
        : '0 2px 8px rgba(0, 0, 0, 0.05)';

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            allowExternalFocus={true}
            blockScrollOnMount={true}
            size="md"
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <ModalHeader
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    pb={4}
                >
                    <HStack spacing={2}>
                        <Icon
                            as={FiFileText}
                            w={5}
                            h={5}
                            color={isDark ? 'blue.300' : 'blue.500'}
                        />
                        <Heading size="md">{t('Terms and Conditions')}</Heading>
                    </HStack>
                </ModalHeader>
                <ModalCloseButton
                    size="md"
                    borderRadius="full"
                    top={3}
                    right={3}
                    onClick={onClose}
                />
                <Divider borderColor={borderColor} />
                <ModalBody pt={6}>
                    <VStack align="stretch" spacing={6} width="full">
                        {vechainKitTerms.length > 0 && appTerms.length > 0 ? (
                            <>
                                <Box
                                    p={4}
                                    borderRadius="xl"
                                    bg={sectionBgColor}
                                    borderWidth="1px"
                                    borderColor={borderColor}
                                    boxShadow={sectionBoxShadow}
                                >
                                    <Text
                                        fontSize="md"
                                        fontWeight="bold"
                                        mb={3}
                                        color={headingColor}
                                    >
                                        {t('Vechain Kit')}
                                    </Text>
                                    <VStack align="stretch" spacing={4}>
                                        {vechainKitTerms.map((term) => (
                                            <TermItem
                                                key={getTermId(term)}
                                                term={term}
                                                register={register}
                                                getTermId={getTermId}
                                            />
                                        ))}
                                    </VStack>
                                </Box>
                                <Box
                                    p={4}
                                    borderRadius="xl"
                                    bg={sectionBgColor}
                                    borderWidth="1px"
                                    borderColor={borderColor}
                                    boxShadow={sectionBoxShadow}
                                >
                                    <Text
                                        fontSize="md"
                                        fontWeight="bold"
                                        mb={3}
                                        color={headingColor}
                                    >
                                        {t('Others')}
                                    </Text>
                                    <VStack align="stretch" spacing={4}>
                                        {appTerms.map((term) => (
                                            <TermItem
                                                key={getTermId(term)}
                                                term={term}
                                                register={register}
                                                getTermId={getTermId}
                                            />
                                        ))}
                                    </VStack>
                                </Box>
                            </>
                        ) : (
                            <Box
                                p={4}
                                borderRadius="xl"
                                bg={sectionBgColor}
                                borderWidth="1px"
                                borderColor={borderColor}
                                boxShadow={sectionBoxShadow}
                            >
                                <VStack align="stretch" spacing={4}>
                                    {allTermsNotAccepted.map((term) => (
                                        <TermItem
                                            key={getTermId(term)}
                                            term={term}
                                            register={register}
                                            getTermId={getTermId}
                                        />
                                    ))}
                                </VStack>
                            </Box>
                        )}
                    </VStack>
                </ModalBody>
                <ModalFooter
                    w="full"
                    display="flex"
                    gap={3}
                    borderTop="1px solid"
                    borderColor={borderColor}
                    mt={4}
                    pt={4}
                >
                    <Button
                        variant="vechainKitSecondary"
                        onClick={onClose}
                        h="50px"
                    >
                        {t('Cancel')}
                    </Button>
                    <Button
                        variant="vechainKitPrimary"
                        type="submit"
                        px={8}
                        isDisabled={!isValid}
                        h="50px"
                    >
                        {t('Accept')}
                    </Button>
                </ModalFooter>
            </form>
        </BaseModal>
    );
};
