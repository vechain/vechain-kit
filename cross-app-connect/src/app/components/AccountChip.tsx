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
import { executeCallClause } from '@vechain/vechain-kit/utils';
import { formatUnits, parseAbi } from 'viem';
import type { TokenInfo } from '../cross-app/_lib/decoder';

const ERC20_BALANCE_ABI = parseAbi([
    'function balanceOf(address owner) view returns (uint256)',
]);

type Props = {
    address: string;
    thor: ThorClient | null;
    /**
     * Additional tokens (beyond native VET) to display the user's balance
     * for. Typically the tokens the current transaction touches.
     */
    relevantTokens?: TokenInfo[];
};

type LiveBalance = { token: TokenInfo; raw: bigint };

const VET_TOKEN: TokenInfo = {
    address: 'VET',
    symbol: 'VET',
    decimals: 18,
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
export function AccountChip({ address, thor, relevantTokens }: Props) {
    const { onCopy, hasCopied } = useClipboard(address);
    const [balances, setBalances] = useState<LiveBalance[] | null>(null);
    const { data: domainInfo } = useVechainDomain(address);
    const { data: avatar } = useGetAvatarOfAddress(address);

    const tokenKey = (relevantTokens ?? [])
        .map((t) => t.address.toLowerCase())
        .sort()
        .join(',');

    useEffect(() => {
        if (!thor || !address) return;
        let cancelled = false;
        (async () => {
            try {
                // VET always shown first; then any tokens the transaction
                // touches. Single Thor batch via Promise.all -- each is its
                // own request but they fire in parallel.
                const vetTask = thor.accounts
                    .getAccount(Address.of(address))
                    .then((acc) => ({
                        token: VET_TOKEN,
                        raw: BigInt(acc.balance.toString()),
                    }));
                const erc20Tasks = (relevantTokens ?? [])
                    .filter(
                        (t) => t.address !== 'VET' && t.address !== 'vet',
                    )
                    .map(async (token) => {
                        const res = await executeCallClause({
                            thor,
                            contractAddress: token.address,
                            abi: ERC20_BALANCE_ABI,
                            method: 'balanceOf' as const,
                            args: [address as `0x${string}`],
                        });
                        return {
                            token,
                            raw: BigInt(
                                (res as unknown as [bigint])[0],
                            ),
                        };
                    });
                const results = await Promise.all([
                    vetTask,
                    ...erc20Tasks,
                ]);
                if (!cancelled) setBalances(results);
            } catch {
                if (!cancelled) setBalances(null);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [thor, address, tokenKey]); // eslint-disable-line react-hooks/exhaustive-deps

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
            {balances && balances.length > 0 && (
                <Stack spacing={0} align="flex-end">
                    <Text fontSize="xs" color="text-subtle">
                        Balance
                    </Text>
                    <Stack spacing={0} align="flex-end">
                        {balances.map((b) => (
                            <Text
                                key={b.token.address}
                                fontSize="sm"
                                fontWeight={600}
                                color="text-strong"
                                fontFamily="mono"
                            >
                                {formatVET(b.raw)} {b.token.symbol}
                            </Text>
                        ))}
                    </Stack>
                </Stack>
            )}
        </HStack>
    );
}
