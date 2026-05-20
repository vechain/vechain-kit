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

export default function DataPage() {
    const { t } = useTranslation();
    const { account } = useWallet();
    const address = account?.address ?? '';

    const { data: b3tr, isLoading: l1 } = useGetB3trBalance(address);
    const { data: vot3, isLoading: l2 } = useGetVot3Balance(address);
    const { data: vetPrice, isLoading: l3 } = useGetTokenUsdPrice('VET');
    const { data: roundId } = useCurrentAllocationsRoundId();
    const { data: isPerson } = useIsPerson(address);

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
                    title={t('Token prices')}
                    description={t(
                        'Live USD price from the kit price oracle.',
                    )}
                    hooks={['useGetTokenUsdPrice']}
                    code={PRICE_SNIPPET}
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
