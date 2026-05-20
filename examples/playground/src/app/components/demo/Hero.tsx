'use client';

import {
    Box,
    Button,
    Heading,
    HStack,
    Icon,
    Text,
    VStack,
    useColorMode,
} from '@chakra-ui/react';
import { LuGithub, LuBook } from 'react-icons/lu';
import { useTranslation } from 'react-i18next';
import { WalletButton, useWallet } from '@vechain/vechain-kit';

export function Hero() {
    const { colorMode } = useColorMode();
    const { t } = useTranslation();
    const { account } = useWallet();

    return (
        <Box
            position="relative"
            borderRadius="2xl"
            overflow="hidden"
            px={{ base: 6, md: 12 }}
            py={{ base: 10, md: 16 }}
            bgGradient={
                colorMode === 'light'
                    ? 'linear(135deg, blue.50 0%, white 50%, purple.50 100%)'
                    : 'linear(135deg, rgba(35,169,246,0.18) 0%, rgba(20,20,30,0.6) 50%, rgba(127,86,217,0.18) 100%)'
            }
            borderWidth="1px"
            borderColor={
                colorMode === 'light' ? 'blue.100' : 'whiteAlpha.200'
            }
        >
            <VStack align="flex-start" spacing={6} maxW="2xl">
                <Box
                    px={3}
                    py={1}
                    borderRadius="full"
                    bg={colorMode === 'light' ? 'blue.100' : 'whiteAlpha.200'}
                    fontSize="xs"
                    fontWeight="semibold"
                    letterSpacing="0.06em"
                    textTransform="uppercase"
                    color={colorMode === 'light' ? 'blue.700' : 'blue.200'}
                >
                    {t('VeChain Kit Playground')}
                </Box>

                <Heading
                    size={{ base: 'xl', md: '2xl' }}
                    lineHeight={1.15}
                    fontWeight="bold"
                >
                    {t('The complete toolkit for VeChain dApps')}
                </Heading>

                <Text
                    fontSize={{ base: 'md', md: 'lg' }}
                    color={colorMode === 'light' ? 'gray.700' : 'gray.300'}
                >
                    {t(
                        'Connect wallets, sign messages, build transactions and ship social login — all in a few hooks. Explore each capability live, then copy the code.',
                    )}
                </Text>

                <HStack spacing={3} flexWrap="wrap">
                    {!account && (
                        <WalletButton
                            mobileVariant="iconDomainAndAssets"
                            desktopVariant="iconDomainAndAssets"
                            label={t('Connect wallet')}
                        />
                    )}
                    <Button
                        as="a"
                        href="https://docs.vechainkit.vechain.org/"
                        target="_blank"
                        rel="noopener noreferrer"
                        leftIcon={<Icon as={LuBook} />}
                        variant="outline"
                    >
                        {t('Read the docs')}
                    </Button>
                    <Button
                        as="a"
                        href="https://github.com/vechain/vechain-kit"
                        target="_blank"
                        rel="noopener noreferrer"
                        leftIcon={<Icon as={LuGithub} />}
                        variant="ghost"
                    >
                        {t('GitHub')}
                    </Button>
                </HStack>
            </VStack>
        </Box>
    );
}
