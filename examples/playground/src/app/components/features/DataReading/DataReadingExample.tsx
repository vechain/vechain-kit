'use client';

import { ReactElement } from 'react';
import { VStack, Text, Heading } from '@chakra-ui/react';
import {
    useWallet,
    useGetB3trBalance,
    useGetVot3Balance,
    useGetTokenUsdPrice,
    useCurrentAllocationsRoundId,
} from '@vechain/vechain-kit';
import { useTranslation } from 'react-i18next';

export function DataReadingExample(): ReactElement {
    const { t } = useTranslation();
    const { account } = useWallet();
    const address = account?.address || '';

    // Example hooks for reading data
    const { data: b3trBalance, isLoading: isLoadingB3tr } =
        useGetB3trBalance(address);
    const { data: vot3Balance, isLoading: isLoadingVot3 } =
        useGetVot3Balance(address);
    const { data: vetPrice, isLoading: isLoadingVetPrice } =
        useGetTokenUsdPrice('VET');
    const { data: vbdCurrentRoundId } = useCurrentAllocationsRoundId();

    return (
        <VStack spacing={6} align="stretch" w="full">
            <Text fontSize="xl" fontWeight="bold">
                {t('Reading Blockchain Data Examples')}
            </Text>
            <Text fontSize="sm" opacity={0.5}>
                {t(
                    'Hooks to easily read data from the blockchain. Here are some examples using built-in hooks. These hooks use react-query under the hood for efficient data fetching and caching.',
                )}
            </Text>

            {/* Live Data Display */}
            <VStack spacing={4} p={6} borderRadius="md" bg="whiteAlpha.50">
                <Text fontWeight="bold">{t('Live Blockchain Data')}</Text>
                <VStack spacing={3} align="start" w="full">
                    <Text>
                        <Text as="span" fontWeight="bold">
                            {t('B3TR Balance')}:{' '}
                        </Text>
                        {isLoadingB3tr
                            ? 'Loading...'
                            : b3trBalance?.formatted || '0'}
                    </Text>
                    <Text>
                        <Text as="span" fontWeight="bold">
                            {t('VOT3 Balance')}:{' '}
                        </Text>
                        {isLoadingVot3
                            ? 'Loading...'
                            : vot3Balance?.formatted || '0'}
                    </Text>
                    <Text>
                        <Text as="span" fontWeight="bold">
                            {t('VET Price')}:{' '}
                        </Text>
                        {isLoadingVetPrice
                            ? 'Loading...'
                            : `$${vetPrice?.toFixed(4) || '0'}`}
                    </Text>
                    <VStack mt={4} align="start" spacing={1}>
                        <Heading size="sm">{t('VeBetterDAO')}</Heading>
                        <Text fontWeight="bold">
                            {t('Current round')}: {vbdCurrentRoundId}
                        </Text>
                    </VStack>
                </VStack>
            </VStack>
        </VStack>
    );
}
