import { LegalDocument, useVeChainKitConfig } from '@/providers';
import { Checkbox, HStack, Icon, Link, Text } from '@chakra-ui/react';
import { UseFormRegister } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FiExternalLink } from 'react-icons/fi';

type Props = {
    term: LegalDocument;
    register: UseFormRegister<any>;
    getTermId: (term: LegalDocument) => string;
};

export const PrivacyItem = ({ term, register, getTermId }: Props) => {
    const { t } = useTranslation();
    const { darkMode: isDark } = useVeChainKitConfig();
    const termName = term.displayName ?? t('Terms and Privacy');
    const termId = getTermId(term);

    const borderColor = isDark ? 'whiteAlpha.400' : 'blackAlpha.400';

    const linkColor = isDark ? 'blue.300' : 'blue.500';
    const linkHoverColor = isDark ? 'blue.200' : 'blue.700';

    return (
        <HStack width="full" borderRadius="md" transition="all 0.2s">
            <HStack align="flex-start" spacing={3} width="full">
                <Checkbox
                    mt="2px"
                    size="md"
                    colorScheme="blue"
                    borderColor={borderColor}
                    {...register(termId, {
                        required: term.required,
                    })}
                    data-testid="tnc-checkbox"
                />

                <Text fontSize="sm" lineHeight="1.6">
                    {t('I have read and agree to ')}
                    <Link
                        href={term.url}
                        isExternal
                        color={linkColor}
                        textDecoration="underline"
                        _hover={{
                            color: linkHoverColor,
                            textDecoration: 'underline',
                        }}
                        fontWeight="medium"
                        display="contents"
                        alignItems="center"
                    >
                        {termName}
                        <Icon as={FiExternalLink} ml={1} />
                    </Link>
                    {term.required && (
                        <Text as="span" color="red.500" fontWeight="bold">
                            *
                        </Text>
                    )}
                </Text>
            </HStack>
        </HStack>
    );
};
