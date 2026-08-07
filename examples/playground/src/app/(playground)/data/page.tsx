'use client';

import {
    Heading,
    HStack,
    Skeleton,
    Tag,
    Text,
    useColorMode,
    VStack,
} from '@chakra-ui/react';
import {
    useCurrentAllocationsRoundId,
    useGetB3trBalance,
    useGetTokenUsdPrice,
    useGetVot3Balance,
    useIsPerson,
    useTotalBalance,
    useWallet,
} from '@vechain/vechain-kit';
import { useTranslation } from 'react-i18next';
import { DemoSection } from '../../components/demo/DemoSection';
import { ConnectGate } from '../../components/demo/ConnectGate';

interface DataRowProps {
    label: string;
    value?: React.ReactNode;
    loading?: boolean;
    suffix?: string;
}

function DataRow({ label, value, loading, suffix }: DataRowProps) {
    const { colorMode } = useColorMode();
    return (
        <HStack
            justify="space-between"
            py={2}
            px={3}
            borderRadius="md"
            bg={colorMode === 'light' ? 'gray.50' : 'whiteAlpha.50'}
        >
            <Text fontSize="sm" fontWeight="medium">
                {label}
            </Text>
            {loading ? (
                <Skeleton h="14px" w="80px" />
            ) : (
                <HStack spacing={1}>
                    <Text fontFamily="mono" fontSize="sm">
                        {value ?? '—'}
                    </Text>
                    {suffix && (
                        <Text fontSize="xs" opacity={0.6}>
                            {suffix}
                        </Text>
                    )}
                </HStack>
            )}
        </HStack>
    );
}

const BALANCE_SNIPPET = `import {
    useGetB3trBalance,
    useGetVot3Balance,
} from '@vechain/vechain-kit';

function Balances({ address }) {
    const { data: b3tr, isLoading: l1 } = useGetB3trBalance(address);
    const { data: vot3, isLoading: l2 } = useGetVot3Balance(address);
    return (
        <ul>
            <li>B3TR: {l1 ? '…' : b3tr?.formatted}</li>
            <li>VOT3: {l2 ? '…' : vot3?.formatted}</li>
        </ul>
    );
}
`;

const PRICE_SNIPPET = `import { useGetTokenUsdPrice } from '@vechain/vechain-kit';

function VetPrice() {
    const { data: price } = useGetTokenUsdPrice('VET');
    return <p>VET / USD: \${price?.toFixed(4)}</p>;
}
`;

const VBD_SNIPPET = `import {
    useCurrentAllocationsRoundId,
    useIsPerson,
} from '@vechain/vechain-kit';

const { data: roundId } = useCurrentAllocationsRoundId();
const { data: isPerson } = useIsPerson(address);
`;

const TOTAL_BALANCE_SNIPPET = `import { useTotalBalance } from '@vechain/vechain-kit';

function PortfolioValue({ address }) {
    const { totalBalanceUsd, isLoading } = useTotalBalance({ address });
    return <p>{isLoading ? '…' : \`$\${totalBalanceUsd.toFixed(2)}\`}</p>;
}
`;

export default function DataPage() {
    const { t } = useTranslation();
    const { account } = useWallet();
    const address = account?.address ?? '';

    const { data: b3tr, isLoading: l1 } = useGetB3trBalance(address);
    const { data: vot3, isLoading: l2 } = useGetVot3Balance(address);
    const { data: vetPrice, isLoading: l3 } = useGetTokenUsdPrice('VET');
    const { data: roundId } = useCurrentAllocationsRoundId();
    const { data: isPerson } = useIsPerson(address);
    // Liquid holdings + staking positions (Stargate, Navigator, BetterSwap
    // LP, Juicy), summed to one USD figure -- the same total the AccountModal
    // itself shows.
    const { totalBalanceUsd, isLoading: l4 } = useTotalBalance({ address });

    return (
        <VStack align="stretch" spacing={6}>
            <VStack align="stretch" spacing={2}>
                <Heading size="lg">{t('Reading Data')}</Heading>
                <Text opacity={0.7}>
                    {t(
                        'React Query hooks for on-chain data — efficient caching, automatic refetching, ready to compose.',
                    )}
                </Text>
            </VStack>

            <ConnectGate feature={t('Reading Data')}>
                <DemoSection
                    title={t('Account balances')}
                    description={t(
                        'B3TR and VOT3 balances for the connected address.',
                    )}
                    hooks={['useGetB3trBalance', 'useGetVot3Balance']}
                    code={BALANCE_SNIPPET}
                    aiPrompt={t(
                        'Build a "Portfolio" card that shows B3TR and VOT3 balances for the connected user via useGetB3trBalance and useGetVot3Balance from @vechain/vechain-kit. Show a Chakra UI Skeleton while loading, format numbers with thousand separators, and add a "Refresh" button that invalidates the queries.',
                    )}
                    aiSkills={['vechain-kit']}
                >
                    <VStack align="stretch" spacing={2}>
                        <DataRow
                            label={t('B3TR Balance')}
                            value={b3tr?.formatted ?? '0'}
                            loading={l1}
                        />
                        <DataRow
                            label={t('VOT3 Balance')}
                            value={vot3?.formatted ?? '0'}
                            loading={l2}
                        />
                    </VStack>
                </DemoSection>

                <DemoSection
                    title={t('Total balance')}
                    description={t(
                        'One USD figure across every liquid token plus staking positions (Stargate, Navigator, BetterSwap LP, Juicy) -- the same total the AccountModal shows.',
                    )}
                    hooks={['useTotalBalance']}
                    status="STABLE"
                    code={TOTAL_BALANCE_SNIPPET}
                    aiPrompt={t(
                        'Show the connected user\'s total portfolio value in USD using useTotalBalance from @vechain/vechain-kit. Display it as a large "$X,XXX.XX" figure with a Chakra UI Skeleton while loading, and show a small "no assets yet" hint when hasAnyBalance is false.',
                    )}
                    aiSkills={['vechain-kit']}
                >
                    <DataRow
                        label={t('Total balance')}
                        value={`$${totalBalanceUsd.toFixed(2)}`}
                        loading={l4}
                    />
                </DemoSection>

                <DemoSection
                    title={t('Token prices')}
                    description={t(
                        'Live USD price from the kit price oracle.',
                    )}
                    hooks={['useGetTokenUsdPrice']}
                    code={PRICE_SNIPPET}
                    aiPrompt={t(
                        'Show the live VET/USD price in my app header using useGetTokenUsdPrice from @vechain/vechain-kit. Format it as $X.XXXX, refresh every 30 seconds, and add a tooltip that says "Powered by VeChain Kit".',
                    )}
                    aiSkills={['vechain-kit']}
                >
                    <DataRow
                        label={t('VET Price')}
                        value={vetPrice ? `$${vetPrice.toFixed(4)}` : '—'}
                        loading={l3}
                    />
                </DemoSection>

                <DemoSection
                    title={t('VeBetterDAO')}
                    description={t(
                        'Round metadata and passport validity for the connected account.',
                    )}
                    hooks={[
                        'useCurrentAllocationsRoundId',
                        'useIsPerson',
                    ]}
                    code={VBD_SNIPPET}
                    aiPrompt={t(
                        'In my X2Earn app, gate reward submission behind a valid VeBetterDAO passport. Use useIsPerson from @vechain/vechain-kit. If the user is not a valid person, show a banner explaining how to get one. Also display the current allocations round id with useCurrentAllocationsRoundId.',
                    )}
                    aiSkills={['vechain-kit', 'vebetterdao']}
                >
                    <VStack align="stretch" spacing={2}>
                        <DataRow
                            label={t('Current round')}
                            value={roundId ?? '—'}
                        />
                        <HStack
                            justify="space-between"
                            py={2}
                            px={3}
                            borderRadius="md"
                        >
                            <Text fontSize="sm" fontWeight="medium">
                                {t('Valid passport')}
                            </Text>
                            <Tag
                                size="sm"
                                colorScheme={isPerson ? 'green' : 'gray'}
                            >
                                {isPerson === undefined
                                    ? '—'
                                    : isPerson
                                    ? t('Yes')
                                    : t('No')}
                            </Tag>
                        </HStack>
                    </VStack>
                </DemoSection>
            </ConnectGate>
        </VStack>
    );
}
