'use client';

import { SimpleGrid, VStack, Text, Icon, useColorMode } from '@chakra-ui/react';
import { LuShield, LuLock, LuShieldCheck } from 'react-icons/lu';
import { useTranslation } from 'react-i18next';

interface PerkProps {
    icon: typeof LuShield;
    title: string;
    description: string;
}

function Perk({ icon, title, description }: PerkProps) {
    const { colorMode } = useColorMode();
    return (
        <VStack
            spacing={3}
            p={5}
            borderRadius="md"
            borderWidth="1px"
            borderColor={
                colorMode === 'light' ? 'gray.200' : 'whiteAlpha.200'
            }
            bg={colorMode === 'light' ? 'gray.50' : 'whiteAlpha.50'}
            align="flex-start"
        >
            <Icon
                as={icon}
                boxSize={6}
                color={colorMode === 'light' ? 'blue.500' : 'blue.300'}
            />
            <Text fontWeight="semibold">{title}</Text>
            <Text
                fontSize="sm"
                color={colorMode === 'light' ? 'gray.600' : 'gray.300'}
            >
                {description}
            </Text>
        </VStack>
    );
}

export function SmartAccountInfo() {
    const { t } = useTranslation();

    return (
        <VStack spacing={4} align="stretch">
            <Text
                fontSize="sm"
                color="inherit"
                opacity={0.85}
            >
                {t(
                    'When using Privy authentication (direct or cross-app), a Smart Account is automatically created and linked to your wallet. This account becomes your primary identity on VeChain, offering enhanced security and flexibility.',
                )}
            </Text>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                <Perk
                    icon={LuShield}
                    title={t('Secure Ownership')}
                    description={t(
                        'Exclusively controlled by your Privy-secured wallet',
                    )}
                />
                <Perk
                    icon={LuLock}
                    title={t('Transferable')}
                    description={t(
                        'Transfer ownership to another wallet anytime',
                    )}
                />
                <Perk
                    icon={LuShieldCheck}
                    title={t('Recovery')}
                    description={t(
                        'Secure backup and recovery through Privy',
                    )}
                />
            </SimpleGrid>
        </VStack>
    );
}
