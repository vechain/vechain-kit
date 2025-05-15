import { Link, Stack, Text, Box } from '@chakra-ui/react';
import { EnrichedLegalDocument } from '@/types';

type PolicySectionProps = {
    title: string;
    documents: Array<EnrichedLegalDocument>;
    linkColor: string;
};

export const PolicySection = ({
    title,
    documents,
    linkColor,
}: PolicySectionProps) => {
    return (
        <>
            <Text fontSize="sm" fontWeight="medium" mb={2} opacity={0.8}>
                {title}
            </Text>
            <Stack spacing={2} mb={4} pl={2}>
                {documents.map((doc, idx) => (
                    <Box key={idx}>
                        <Link
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            color={linkColor}
                            textDecoration="underline"
                            fontWeight="medium"
                            fontSize="xs"
                            isExternal
                        >
                            {doc?.displayName ?? 'Legal Document'}
                        </Link>
                    </Box>
                ))}
            </Stack>
        </>
    );
};
