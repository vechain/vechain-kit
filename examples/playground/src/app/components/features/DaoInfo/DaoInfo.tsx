'use client';

import {
    HStack,
    SimpleGrid,
    Tag,
    Text,
    useColorMode,
    VStack,
} from '@chakra-ui/react';
import {
    useCurrentAllocationsRoundId,
    useIsPerson,
    useWallet,
} from '@vechain/vechain-kit';
import { useTranslation } from 'react-i18next';

interface DataRowProps {
    label: string;
    children: React.ReactNode;
}

function DataRow({ label, children }: DataRowProps) {
    return (
        <HStack justify="space-between" w="full" py={2}>
            <Text fontSize="sm" opacity={0.7}>
                {label}
            </Text>
            <HStack spacing={2}>{children}</HStack>
        </HStack>
    );
}

export function DaoInfo() {
    const { t } = useTranslation();
    const { colorMode } = useColorMode();
    const { account } = useWallet();
    const { data: currentAllocationsRoundId } = useCurrentAllocationsRoundId();
    const { data: isValidPassport } = useIsPerson(account?.address);

    return (
        <VStack
            align="stretch"
            spacing={2}
            p={5}
            borderRadius="md"
            borderWidth="1px"
            borderColor={
                colorMode === 'light' ? 'gray.200' : 'whiteAlpha.200'
            }
            bg={colorMode === 'light' ? 'gray.50' : 'whiteAlpha.50'}
            divider={undefined}
        >
            <SimpleGrid columns={{ base: 1, md: 2 }} spacingX={6}>
                <DataRow label={t('Current round')}>
                    <Tag size="sm" colorScheme="blue">
                        {currentAllocationsRoundId ?? '—'}
                    </Tag>
                </DataRow>
                <DataRow label={t('Valid passport')}>
                    <Tag
                        size="sm"
                        colorScheme={isValidPassport ? 'green' : 'gray'}
                    >
                        {isValidPassport === undefined
                            ? '—'
                            : isValidPassport
                            ? t('Yes')
                            : t('No')}
                    </Tag>
                </DataRow>
            </SimpleGrid>
        </VStack>
    );
}
