'use client';

import { useEffect, useState } from 'react';
import {
    Box,
    HStack,
    Icon,
    IconButton,
    Stack,
    Text,
    Tooltip,
    useClipboard,
} from '@chakra-ui/react';
import { LuCheck, LuCopy, LuWallet } from 'react-icons/lu';
import { Address } from '@vechain/sdk-core';
import type { ThorClient } from '@vechain/sdk-network';
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
 * Header row identifying the account that will sign. Shows the truncated
 * address, a copy button, and the live VET balance so the user can sanity
 * check ("yep, that's my wallet, and it has the funds it'll need").
 */
export function AccountChip({ address, thor }: Props) {
    const { onCopy, hasCopied } = useClipboard(address);
    const [balance, setBalance] = useState<bigint | null>(null);

    useEffect(() => {
        if (!thor || !address) return;
        let cancelled = false;
        (async () => {
            try {
                const acc = await thor.accounts.getAccount(Address.of(address));
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
            <Box
                p={2}
                rounded="full"
                bg="login-btn-hover-bg"
                color="text-strong"
            >
                <Icon as={LuWallet} boxSize="16px" />
            </Box>
            <Stack spacing={0} flex={1} minW={0}>
                <Text fontSize="xs" color="text-subtle">
                    Your account
                </Text>
                <HStack spacing={2} align="center">
                    <Text
                        fontFamily="mono"
                        fontSize="sm"
                        fontWeight={500}
                        color="text-strong"
                    >
                        {truncate(address)}
                    </Text>
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
                    {balance !== null && (
                        <>
                            <Text fontSize="sm" color="text-subtle">
                                ·
                            </Text>
                            <Text
                                fontSize="sm"
                                color="text-muted"
                                fontFamily="mono"
                            >
                                {formatVET(balance)} VET
                            </Text>
                        </>
                    )}
                </HStack>
            </Stack>
        </HStack>
    );
}
