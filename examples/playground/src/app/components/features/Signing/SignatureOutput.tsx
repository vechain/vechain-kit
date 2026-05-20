'use client';

import {
    Box,
    HStack,
    IconButton,
    Text,
    useColorMode,
    useToast,
} from '@chakra-ui/react';
import { LuCopy } from 'react-icons/lu';
import { useTranslation } from 'react-i18next';

interface SignatureOutputProps {
    signature?: string | null;
}

export function SignatureOutput({ signature }: SignatureOutputProps) {
    const { colorMode } = useColorMode();
    const { t } = useTranslation();
    const toast = useToast();

    if (!signature) return null;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(signature);
            toast({
                title: t('Copied!'),
                status: 'success',
                duration: 1200,
                isClosable: true,
                position: 'bottom-right',
            });
        } catch {
            toast({ title: t('Copy failed'), status: 'error', duration: 1500 });
        }
    };

    return (
        <Box
            w="full"
            p={3}
            borderRadius="md"
            borderWidth="1px"
            borderColor={
                colorMode === 'light' ? 'gray.200' : 'whiteAlpha.200'
            }
            bg={colorMode === 'light' ? 'gray.50' : 'rgba(13, 17, 23, 0.6)'}
        >
            <HStack justify="space-between" mb={1}>
                <Text fontSize="xs" opacity={0.7} textTransform="uppercase">
                    {t('Signature')}
                </Text>
                <IconButton
                    aria-label={t('Copy')}
                    icon={<LuCopy />}
                    size="xs"
                    variant="ghost"
                    onClick={handleCopy}
                />
            </HStack>
            <Text fontFamily="mono" fontSize="xs" wordBreak="break-all">
                {signature}
            </Text>
        </Box>
    );
}
