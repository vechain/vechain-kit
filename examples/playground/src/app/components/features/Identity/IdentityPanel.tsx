'use client';

import {
    Box,
    HStack,
    SimpleGrid,
    Tag,
    Text,
    useColorMode,
    VStack,
} from '@chakra-ui/react';
import { useWallet } from '@vechain/vechain-kit';
import { LuWallet, LuWalletCards } from 'react-icons/lu';
import { useTranslation } from 'react-i18next';
import { CopyAddress } from '../../demo/CopyAddress';

interface InfoBlockProps {
    title: string;
    icon: typeof LuWallet;
    children: React.ReactNode;
}

function InfoBlock({ title, icon: IconCmp, children }: InfoBlockProps) {
    const { colorMode } = useColorMode();
    return (
        <VStack
            align="flex-start"
            spacing={3}
            p={5}
            borderRadius="md"
            borderWidth="1px"
            borderColor={
                colorMode === 'light' ? 'gray.200' : 'whiteAlpha.200'
            }
            bg={colorMode === 'light' ? 'gray.50' : 'whiteAlpha.50'}
            w="full"
        >
            <HStack>
                <Box
                    as={IconCmp}
                    boxSize={5}
                    color={colorMode === 'light' ? 'blue.500' : 'blue.300'}
                />
                <Text fontWeight="semibold">{title}</Text>
            </HStack>
            {children}
        </VStack>
    );
}

export function IdentityPanel() {
    const { t } = useTranslation();
    const { account, smartAccount, connectedWallet, connection } = useWallet();

    if (!account) return null;

    return (
        <VStack align="stretch" spacing={4} w="full">
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                {smartAccount.address && (
                    <InfoBlock
                        title={t('Smart Account')}
                        icon={LuWalletCards}
                    >
                        <VStack align="flex-start" spacing={2}>
                            <CopyAddress address={smartAccount.address} />
                            <HStack>
                                <Text fontSize="xs" opacity={0.7}>
                                    {t('Deployed')}:
                                </Text>
                                <Tag
                                    size="sm"
                                    colorScheme={
                                        smartAccount.isDeployed
                                            ? 'green'
                                            : 'gray'
                                    }
                                >
                                    {smartAccount.isDeployed
                                        ? t('Yes')
                                        : t('No')}
                                </Tag>
                            </HStack>
                        </VStack>
                    </InfoBlock>
                )}

                <InfoBlock
                    title={
                        connection.isConnectedWithPrivy
                            ? t('Embedded Wallet')
                            : t('Wallet')
                    }
                    icon={LuWallet}
                >
                    {connectedWallet?.address && (
                        <CopyAddress address={connectedWallet.address} />
                    )}
                </InfoBlock>
            </SimpleGrid>

            {account.domain && (
                <Box
                    p={3}
                    borderRadius="md"
                    bg="green.50"
                    color="green.700"
                    borderWidth="1px"
                    borderColor="green.200"
                    fontSize="sm"
                    _dark={{
                        bg: 'green.900',
                        color: 'green.100',
                        borderColor: 'green.700',
                    }}
                >
                    {t('VET Domain')}: <strong>{account.domain}</strong>
                </Box>
            )}
        </VStack>
    );
}
