'use client';

import { HStack, Icon, Image, Stack, Text, Tooltip } from '@chakra-ui/react';
import { LuCircleCheck, LuTriangleAlert } from 'react-icons/lu';
import {
    useGetAvatarOfAddress,
    useVechainDomain,
    type AppConfig,
} from '@vechain/vechain-kit';
import { resolveContractLabel } from '../cross-app/_lib/contracts';

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
     * scary noise.
     */
    kind?: 'contract' | 'recipient';
    /** Avatar size in px. Defaults to 20 for inline use. */
    avatarSize?: number;
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
    avatarSize = 20,
}: Props) {
    // Hooks must be unconditional — React Query caches across instances so
    // multiple AddressTags pointing at the same address share one fetch.
    const { data: domainInfo } = useVechainDomain(address);
    const { data: avatar } = useGetAvatarOfAddress(address);
    const resolved = resolveContractLabel(address, appConfig, self);

    // Verified VeChain-maintained contract: label + check, no avatar (the
    // entity's branding is implicit in the name).
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

    // Unresolved: avatar + (domain ?? truncated address). Warn only when
    // we're rendering the contract the user is *calling*, not a destination
    // wallet for a token transfer.
    const domain = domainInfo?.domain;
    return (
        <HStack spacing={2} align="center" minW={0}>
            {avatar && (
                <Image
                    src={avatar}
                    alt=""
                    boxSize={`${avatarSize}px`}
                    rounded="full"
                    draggable={false}
                    fallback={<span style={{ width: avatarSize, height: avatarSize }} />}
                />
            )}
            {domain ? (
                <Stack spacing={0} minW={0}>
                    <Text
                        fontWeight={500}
                        color="text-strong"
                        fontSize="sm"
                        lineHeight="1.1"
                        noOfLines={1}
                    >
                        {domain}
                    </Text>
                    <Text
                        fontFamily="mono"
                        fontSize="xs"
                        color="text-subtle"
                        lineHeight="1.1"
                    >
                        {truncate(address)}
                    </Text>
                </Stack>
            ) : (
                <Text fontFamily="mono" fontSize="sm" color="text-muted">
                    {truncate(address)}
                </Text>
            )}
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
