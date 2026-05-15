'use client';

import { HStack, Icon, Text, Tooltip } from '@chakra-ui/react';
import { LuCircleCheck, LuTriangleAlert } from 'react-icons/lu';
import { resolveContractLabel } from '../cross-app/_lib/contracts';
import type { AppConfig } from '@vechain/vechain-kit';

type Props = {
    address: string;
    appConfig?: AppConfig;
    self?: string;
};

function truncate(addr: string): string {
    if (!addr || addr.length < 12) return addr;
    return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

/**
 * Render an Ethereum address with phishing-defence affordances: a green
 * check + label for VeChain-maintained contracts, an orange warning + raw
 * hex for everything else. Users can't tell a real contract from a spoof
 * by hex alone, so the explicit "Unverified" treatment is the point.
 */
export function AddressTag({ address, appConfig, self }: Props) {
    const resolved = resolveContractLabel(address, appConfig, self);
    if (resolved) {
        return (
            <HStack spacing={1} align="center">
                <Text fontWeight={500} color="text-strong">
                    {resolved.label}
                </Text>
                {resolved.verified && (
                    <Tooltip
                        label="Verified VeChain contract"
                        placement="top"
                        hasArrow
                        openDelay={200}
                        fontSize="xs"
                    >
                        <span style={{ display: 'inline-flex' }}>
                            <Icon
                                as={LuCircleCheck}
                                color="green.500"
                                boxSize="14px"
                                aria-label="Verified"
                            />
                        </span>
                    </Tooltip>
                )}
            </HStack>
        );
    }
    return (
        <HStack spacing={1} align="center">
            <Text fontFamily="mono" fontSize="sm" color="text-muted">
                {truncate(address)}
            </Text>
            <Tooltip
                label="Unverified contract — make sure you trust it before continuing"
                placement="top"
                hasArrow
                openDelay={200}
                fontSize="xs"
            >
                <span style={{ display: 'inline-flex' }}>
                    <Icon
                        as={LuTriangleAlert}
                        color="orange.400"
                        boxSize="14px"
                        aria-label="Unverified"
                    />
                </span>
            </Tooltip>
        </HStack>
    );
}
