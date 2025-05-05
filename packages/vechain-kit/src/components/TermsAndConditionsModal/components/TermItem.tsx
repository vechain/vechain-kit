import { Checkbox, Text, HStack, Link } from '@chakra-ui/react';

import { LegalDocument } from '@/providers';
import { useTranslation } from 'react-i18next';
import { UseFormRegister } from 'react-hook-form';

type Props = {
    term: LegalDocument;
    register: UseFormRegister<any>;
    getTermId: (term: LegalDocument) => string;
};

export const TermItem = ({ term, register, getTermId }: Props) => {
    const { t } = useTranslation();
    const termName = term.displayName ?? t('Terms and Conditions');
    const termId = getTermId(term);

    return (
        <HStack align="flex-start" spacing={2} width="full">
            <Checkbox
                mt="1px"
                {...register(termId, {
                    required: term.required,
                })}
            />
            <Text>
                {t('I have read and agree to')}
                <Link
                    href={term.url}
                    isExternal
                    color="blue.500"
                    textDecoration="underline"
                >
                    {termName}
                </Link>
                {term.required && (
                    <Text as="span" color="red.500" ml={1}>
                        *
                    </Text>
                )}
            </Text>
        </HStack>
    );
};
