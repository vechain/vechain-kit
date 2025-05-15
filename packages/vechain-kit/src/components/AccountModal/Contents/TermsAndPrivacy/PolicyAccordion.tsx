import {
    AccordionButton,
    AccordionItem,
    AccordionPanel,
    Box,
    Button,
    HStack,
    Icon,
    Tag,
    Text,
    VStack,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { IoChevronDown } from 'react-icons/io5';
import { IoChevronUp } from 'react-icons/io5';

import { LegalDocumentAgreement } from '@/types';
import { MdCheck } from 'react-icons/md';
import { formatDate } from '@/utils/dateUtils';

type PolicyAccordionProps = {
    title: string;
    description: string;
    documents: LegalDocumentAgreement[];
    bg: string;
    hoverBg: string;
    currentPolicy?: LegalDocumentAgreement;
};

export const PolicyAccordion = ({
    title,
    description,
    documents,
    bg,
    hoverBg,
    currentPolicy,
}: PolicyAccordionProps) => {
    const { t } = useTranslation();
    const hasDocuments = documents.length > 0;

    const hasMoreThanOneAgreement = documents.length > 1;

    if (!hasDocuments) return null;

    return (
        <AccordionItem border="none" mb={3}>
            {({ isExpanded }) => (
                <>
                    <AccordionButton
                        bg={bg}
                        borderRadius="xl"
                        _hover={{
                            bg: hoverBg,
                        }}
                    >
                        <Box flex="1" textAlign="left" py={2}>
                            <Text fontWeight="700">{title}</Text>
                            <Text fontSize="xs" color="gray.400">
                                {description}
                            </Text>
                        </Box>
                        <Icon
                            as={isExpanded ? IoChevronUp : IoChevronDown}
                            fontSize="20px"
                            opacity={0.7}
                        />
                    </AccordionButton>
                    <AccordionPanel pb={4} pt={3}>
                        <VStack align="stretch" spacing={4}>
                            {currentPolicy && (
                                <HStack w="full">
                                    <Icon as={MdCheck} color="green.500" />
                                    <Text fontSize="xs">
                                        {t(
                                            'You accepted current policy on {{date}}',
                                            {
                                                date: formatDate(
                                                    currentPolicy.timestamp,
                                                ),
                                            },
                                        )}
                                    </Text>
                                </HStack>
                            )}

                            <HStack w="full" textAlign="left">
                                <Text fontSize="xs" fontWeight="bold">
                                    {t(
                                        '{{variant}} policies you have accepted',
                                        {
                                            variant: hasMoreThanOneAgreement
                                                ? 'Other'
                                                : 'All',
                                        },
                                    )}
                                </Text>
                            </HStack>

                            <HStack w="full" gap={2}>
                                <VStack align="stretch" spacing={2}>
                                    {documents.map((document) => (
                                        <HStack justifyContent="space-between">
                                            <Tag size="sm" borderRadius="full">
                                                v{document.version}
                                            </Tag>
                                            <Text
                                                fontSize="xs"
                                                cursor="pointer"
                                                onClick={() => {
                                                    window.open(
                                                        document.url,
                                                        '_blank',
                                                    );
                                                }}
                                                _hover={{
                                                    textDecoration: 'underline',
                                                }}
                                            >
                                                {t(
                                                    "'{{policyName}}' on {{date}}",
                                                    {
                                                        policyName:
                                                            document.displayName ??
                                                            'Policy',
                                                        date: formatDate(
                                                            document.timestamp,
                                                        ),
                                                    },
                                                )}
                                            </Text>
                                        </HStack>
                                    ))}
                                </VStack>
                            </HStack>

                            {currentPolicy && (
                                <Button
                                    variant="outline"
                                    size="xs"
                                    alignSelf="flex-end"
                                    onClick={() => {
                                        window.open(
                                            currentPolicy.url,
                                            '_blank',
                                        );
                                    }}
                                >
                                    {t('View Current Policy')}
                                </Button>
                            )}
                        </VStack>
                    </AccordionPanel>
                </>
            )}
        </AccordionItem>
    );
};
