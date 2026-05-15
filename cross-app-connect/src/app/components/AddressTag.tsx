'use client';

import { HStack, Icon, Text, Tooltip } from '@chakra-ui/react';
import { LuCircleCheck, LuTriangleAlert } from 'react-icons/lu';
import { resolveContractLabel } from '../cross-app/_lib/contracts';
import type { AppConfig } from '@vechain/vechain-kit';

type Props = {
    address: string;
    appConfig?: AppConfig;
    self?: string;
    /**
     * Distinguishes "contract this user is calling" (`'contract'` — default)
     * from "address receiving funds" (`'recipient'`).
     *
     * `'contract'` shows an "Unverified contract" warning when the address
     * isn't in the kit's appConfig — that's the phishing-defence path.
     *
     * `'recipient'` is for token transfer destinations (a 2nd-leg argument
     * to `transfer(address,uint256)` — typically just a wallet address, not
     * a contract at all). Showing "Unverified contract" there would be
     * scary noise. Instead: if the address happens to resolve to a known
     * VeChain entity (e.g. you're sending to the treasury), label it;
     * otherwise just render the truncated hex with no badge.
     */
    kind?: 'contract' | 'recipient';
};

function truncate(addr: string): string {
    if (!addr || addr.length < 12) return addr;
    return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export function AddressTag({
    address,
    appConfig,
    self,
    kind = 'contract',
}: Props) {
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
            {kind === 'contract' && (
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
            )}
        </HStack>
    );
}
