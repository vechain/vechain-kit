'use client';

import { useState } from 'react';
import { HStack, Icon, Image, Text } from '@chakra-ui/react';
import { LuLockKeyhole, LuGlobe } from 'react-icons/lu';

type Props = {
    url: string;
};

/**
 * Compact pill identifying the dApp asking to connect. Shows a lock icon
 * for HTTPS origins (so users learn to scan for it), the site's favicon via
 * Google's S2 service, and the hostname stripped of scheme / port noise.
 */
export function RequesterChip({ url }: Props) {
    const [iconBroken, setIconBroken] = useState(false);
    const parsed = safeParseUrl(url);
    if (!parsed) {
        return (
            <Text fontSize="sm" color="text-muted">
                {url}
            </Text>
        );
    }

    const isSecure = parsed.protocol === 'https:';
    const display =
        parsed.port && parsed.port !== '80' && parsed.port !== '443'
            ? `${parsed.hostname}:${parsed.port}`
            : parsed.hostname;
    const faviconSrc = `https://www.google.com/s2/favicons?domain=${parsed.hostname}&sz=64`;

    return (
        <HStack
            spacing={2}
            px={2}
            py="3px"
            rounded="full"
            bg="card-bg"
            borderWidth="1px"
            borderColor="login-btn-border"
            display="inline-flex"
            maxW="full"
        >
            <Icon
                as={isSecure ? LuLockKeyhole : LuGlobe}
                boxSize="14px"
                color={isSecure ? 'green.500' : 'text-subtle'}
                aria-label={
                    isSecure ? 'Secure (HTTPS)' : 'Not encrypted (HTTP)'
                }
            />
            {!iconBroken && (
                <Image
                    src={faviconSrc}
                    alt=""
                    boxSize="16px"
                    rounded="sm"
                    onError={() => setIconBroken(true)}
                    draggable={false}
                />
            )}
            <Text
                fontSize="sm"
                fontWeight={500}
                color="text-strong"
                noOfLines={1}
            >
                {display}
            </Text>
        </HStack>
    );
}

function safeParseUrl(url: string): URL | null {
    try {
        return new URL(url);
    } catch {
        return null;
    }
}
