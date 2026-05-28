'use client';

import {
    HStack,
    IconButton,
    Text,
    useColorMode,
    useToast,
} from '@chakra-ui/react';
import { LuCopy } from 'react-icons/lu';
import { useTranslation } from 'react-i18next';

interface CopyAddressProps {
    address: string;
    truncate?: boolean;
    fontSize?: string;
}

function shorten(address: string) {
    if (address.length <= 12) return address;
    return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export function CopyAddress({
    address,
    truncate = true,
    fontSize = 'sm',
}: CopyAddressProps) {
    const { colorMode } = useColorMode();
    const { t } = useTranslation();
    const toast = useToast();

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(address);
            toast({
                title: t('Copied!'),
                status: 'success',
                duration: 1200,
                isClosable: true,
                position: 'bottom-right',
            });
        } catch {
            toast({
                title: t('Copy failed'),
                status: 'error',
                duration: 1500,
            });
        }
    };

    return (
        <HStack spacing={1}>
            <Text
                fontFamily="mono"
                fontSize={fontSize}
                color={colorMode === 'light' ? 'gray.700' : 'gray.300'}
            >
                {truncate ? shorten(address) : address}
            </Text>
            <IconButton
                aria-label={t('Copy')}
                size="xs"
                variant="ghost"
                icon={<LuCopy />}
                onClick={handleCopy}
            />
        </HStack>
    );
}
