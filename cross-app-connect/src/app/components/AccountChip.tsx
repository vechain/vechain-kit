'use client';

import { useEffect, useState } from 'react';
import {
    Box,
    HStack,
    Icon,
    IconButton,
    Image,
    Stack,
    Text,
    Tooltip,
    useClipboard,
} from '@chakra-ui/react';
import { LuCheck, LuCopy } from 'react-icons/lu';
import { Address } from '@vechain/sdk-core';
import type { ThorClient } from '@vechain/sdk-network';
import {
    useGetAvatarOfAddress,
    useVechainDomain,
} from '@vechain/vechain-kit';
import { formatUnits } from 'viem';

type Props = {
    address: string;
    thor: ThorClient | null;
};

function truncate(addr: string): string {
    if (!addr || addr.length < 12) return addr;
    return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

function formatVET(raw: bigint): string {
    const str = formatUnits(raw, 18);
    if (!str.includes('.')) return str;
    const [whole, frac] = str.split('.');
    const trimmed = frac.replace(/0+$/, '').slice(0, 4);
    return trimmed.length === 0 ? whole : `${whole}.${trimmed}`;
}

/**
 * Header row identifying the account that will sign. Shows the address with
 * its VeChain domain (if any) plus the avatar (custom for .vet domains,
 * Picasso identicon as fallback), a copy button, and the live VET balance.
 */
export function AccountChip({ address, thor }: Props) {
    const { onCopy, hasCopied } = useClipboard(address);
    const [balance, setBalance] = useState<bigint | null>(null);
    const { data: domainInfo } = useVechainDomain(address);
    const { data: avatar } = useGetAvatarOfAddress(address);

    useEffect(() => {
        if (!thor || !address) return;
        let cancelled = false;
        (async () => {
            try {
                const acc = await thor.accounts.getAccount(
                    Address.of(address),
                );
                if (!cancelled) setBalance(BigInt(acc.balance.toString()));
            } catch {
                // Network hiccup — leave balance null and let the chip render
                // without it.
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [thor, address]);

    const domain = domainInfo?.domain;

    return (
        <HStack
            spacing={3}
            p={3}
            rounded="md"
            bg="card-elevated-bg"
            borderWidth="1px"
            borderColor="card-border"
            align="center"
        >
            {avatar ? (
                <Image
                    src={avatar}
                    alt=""
                    boxSize="36px"
                    rounded="full"
                    draggable={false}
                    fallback={<Box boxSize="36px" rounded="full" bg="login-btn-hover-bg" />}
                />
            ) : (
                <Box boxSize="36px" rounded="full" bg="login-btn-hover-bg" />
            )}
            <Stack spacing={0} flex={1} minW={0}>
                <Text fontSize="xs" color="text-subtle">
                    Your account
                </Text>
                <HStack spacing={2} align="center">
                    {domain ? (
                        <Stack spacing={0}>
                            <Text
                                fontWeight={600}
                                color="text-strong"
                                lineHeight="1.2"
                            >
                                {domain}
                            </Text>
                            <Text
                                fontFamily="mono"
                                fontSize="xs"
                                color="text-subtle"
                                lineHeight="1.2"
                            >
                                {truncate(address)}
                            </Text>
                        </Stack>
                    ) : (
                        <Text
                            fontFamily="mono"
                            fontSize="sm"
                            fontWeight={500}
                            color="text-strong"
                        >
                            {truncate(address)}
                        </Text>
                    )}
                    <Tooltip
                        label={hasCopied ? 'Copied' : 'Copy address'}
                        placement="top"
                        hasArrow
                        openDelay={150}
                        fontSize="xs"
                    >
                        <IconButton
                            aria-label="Copy address"
                            icon={
                                <Icon
                                    as={hasCopied ? LuCheck : LuCopy}
                                    boxSize="14px"
                                />
                            }
                            size="xs"
                            variant="ghost"
                            h="22px"
                            minW="22px"
                            border="none"
                            rounded="md"
                            onClick={(e) => {
                                e.stopPropagation();
                                onCopy();
                            }}
                        />
                    </Tooltip>
                </HStack>
            </Stack>
            {balance !== null && (
                <Stack spacing={0} align="flex-end">
                    <Text fontSize="xs" color="text-subtle">
                        Balance
                    </Text>
                    <Text
                        fontSize="sm"
                        fontWeight={600}
                        color="text-strong"
                        fontFamily="mono"
                    >
                        {formatVET(balance)} VET
                    </Text>
                </Stack>
            )}
        </HStack>
    );
}
