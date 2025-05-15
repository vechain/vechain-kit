import { useVeChainKitConfig } from '@/providers';
import { EnrichedLegalDocument } from '@/types';
import { Checkbox, HStack, Icon, Input, Link, Text } from '@chakra-ui/react';
import { UseFormRegister } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { FiExternalLink } from 'react-icons/fi';

type Props = {
    document: EnrichedLegalDocument;
    register: UseFormRegister<any>;
    isText?: boolean;
};

export const LegalDocumentItem = ({
    document,
    register,
    isText = false,
}: Props) => {
    const { t } = useTranslation();
    const { darkMode: isDark } = useVeChainKitConfig();
    const documentName = document.displayName ?? t('Terms and Policies');

    const borderColor = isDark ? 'whiteAlpha.400' : 'blackAlpha.400';

    const linkColor = isDark ? 'blue.300' : 'blue.500';
    const linkHoverColor = isDark ? 'blue.200' : 'blue.700';

    // Get document type display text
    const getDocumentTypeDisplay = (): string => {
        if (!document.documentType) return documentName;

        switch (document.documentType) {
            case 'terms':
                return document.displayName || 'Terms of Service';
            case 'privacy':
                return document.displayName || 'Privacy Policy';
            case 'cookies':
                return document.displayName || 'Cookie Policy';
            default:
                return document.displayName || 'Legal Document';
        }
    };

    const displayName = getDocumentTypeDisplay();

    if (isText) {
        return (
            <Link
                key={document.id}
                href={document.url}
                isExternal
                color={'blue.500'}
                textDecoration="underline"
                _hover={{
                    color: 'blue.300',
                    textDecoration: 'underline',
                }}
                fontWeight="medium"
                display="contents"
                alignItems="center"
            >
                <Input
                    {...register(document.id, {
                        required: document.required,
                    })}
                    type="checkbox"
                    hidden
                />
                {document.displayName || 'Vechain Kit Policy'}
                <Icon as={FaExternalLinkAlt} ml={1} />
            </Link>
        );
    }

    return (
        <HStack
            width="full"
            borderRadius="md"
            transition="all 0.2s"
            key={document.id}
        >
            <HStack align="flex-start" spacing={3} width="full">
                <Checkbox
                    mt="2px"
                    size="md"
                    colorScheme="blue"
                    borderColor={borderColor}
                    {...register(document.id, {
                        required: document.required,
                    })}
                    data-testid="tnc-checkbox"
                />

                <Text fontSize="xs">
                    {t('I have read and agree to ')}
                    <Link
                        href={document.url}
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
                        {displayName}
                        <Icon as={FiExternalLink} ml={1} />
                    </Link>
                    {document.required && (
                        <Text as="span" color="red.500" fontWeight="bold">
                            *
                        </Text>
                    )}
                </Text>
            </HStack>
        </HStack>
    );
};
