import {
    AccordionButton,
    AccordionItem,
    AccordionPanel,
    Button,
    HStack,
    Icon,
    Text,
    VStack,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { IoChevronDown } from 'react-icons/io5';
import { IoChevronUp } from 'react-icons/io5';

import { LegalDocumentAgreement } from '@/types';
import { MdCheck } from 'react-icons/md';
import { formatDate } from '@/utils/dateUtils';
import { AcceptedPolicyItem } from './AcceptedPolicyItem';

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
                        <VStack w="full" align="flex-start" textAlign="left">
                            <Text fontWeight="700">{title}</Text>
                            <Text fontSize="xs" color="gray.400">
                                {description}
                            </Text>
                        </VStack>
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
                                    {t('All policies you have accepted')}
                                </Text>
                            </HStack>

                            <HStack w="full" gap={2}>
                                <VStack align="stretch" spacing={2}>
                                    {documents.map((document) => (
                                        <AcceptedPolicyItem
                                            key={document.id}
                                            document={document}
                                        />
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
