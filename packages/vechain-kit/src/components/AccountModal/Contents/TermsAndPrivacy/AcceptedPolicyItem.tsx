import { Tag, Text, HStack } from '@chakra-ui/react';
import { LegalDocumentAgreement } from '@/types';
import { formatDate } from '@/utils/dateUtils';
import { useTranslation } from 'react-i18next';

export const AcceptedPolicyItem = ({
    document,
}: {
    document: LegalDocumentAgreement;
}) => {
    const { t } = useTranslation();
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
                {t("'{{policyName}}' on {{date}}", {
                    policyName: document.displayName ?? t('Policy'),
                    date: formatDate(document.timestamp),
                })}
            </Text>
        </HStack>
    );
};
