import { LegalDocumentAgreement, LegalDocumentSource } from '@/types';
import { formatDate } from '@/utils/dateUtils';
import { HStack, Tag, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

export const AcceptedPolicyItem = ({
    document,
}: {
    document: LegalDocumentAgreement;
}) => {
    const { t } = useTranslation();
    const isVechainKitTerms =
        document.documentSource === LegalDocumentSource.VECHAIN_KIT;
    return (
        <HStack>
            <Tag size="sm" borderRadius="full">
                v{document.version}
            </Tag>
            <Text
                fontSize="xs"
                cursor="pointer"
                onClick={() => {
                    window.open(document.url, '_blank');
                }}
                _hover={{
                    textDecoration: 'underline',
                }}
            >
                {isVechainKitTerms
                    ? t('{{policyName}} on connect', {
                          policyName:
                              document.displayName ?? t('Vechain Kit Policy'),
                      })
                    : t("'{{policyName}}' on {{date}}", {
                          policyName: document.displayName ?? t('Policy'),
                          date: formatDate(document.timestamp),
                      })}
            </Text>
        </HStack>
    );
};
