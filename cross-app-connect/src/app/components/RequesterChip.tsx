'use client';

import { useState } from 'react';
import { HStack, Icon, Image, Text, Tooltip } from '@chakra-ui/react';
import {
    LuCircleCheck,
    LuGlobe,
    LuLockKeyhole,
    LuTriangleAlert,
} from 'react-icons/lu';
import { lookupAppByUrl } from '../cross-app/_lib/app-hub';

type Props = {
    url: string;
};

/**
 * Identifies the dApp asking to connect. Three signals stacked on the chip:
 *
 *   1. HTTPS lock      -- raw transport security check.
 *   2. Favicon          -- visual recognition cue from the requester's domain.
 *   3. Verified badge   -- match against vechain/app-hub registry. Listed
 *                          apps render their canonical Name + green check;
 *                          everything else gets an orange warning triangle.
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
    const appHubEntry = lookupAppByUrl(url);
    const verified = Boolean(appHubEntry);

    return (
        <HStack
            spacing={2}
            px={2}
            py="3px"
            rounded="full"
            bg="card-bg"
            borderWidth="1px"
            borderColor={verified ? 'green.500' : 'login-btn-border'}
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
                {verified ? appHubEntry!.name : display}
            </Text>
            {verified ? (
                <Tooltip
                    label="Listed in the VeChain App Hub"
                    placement="top"
                    hasArrow
                    openDelay={150}
                    fontSize="xs"
                >
                    <span style={{ display: 'inline-flex' }}>
                        <Icon
                            as={LuCircleCheck}
                            boxSize="14px"
                            color="green.500"
                            aria-label="Verified VeChain app"
                        />
                    </span>
                </Tooltip>
            ) : (
                <Tooltip
                    label="Not listed in the VeChain App Hub — proceed only if you recognize this site"
                    placement="top"
                    hasArrow
                    openDelay={150}
                    fontSize="xs"
                >
                    <span style={{ display: 'inline-flex' }}>
                        <Icon
                            as={LuTriangleAlert}
                            boxSize="14px"
                            color="orange.400"
                            aria-label="Unverified app"
                        />
                    </span>
                </Tooltip>
            )}
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
