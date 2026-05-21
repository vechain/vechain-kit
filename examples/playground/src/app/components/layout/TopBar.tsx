'use client';

import {
    HStack,
    IconButton,
    useColorMode,
    useDisclosure,
    Box,
    useBreakpointValue,
} from '@chakra-ui/react';
import { LuMenu, LuMoon, LuSun } from 'react-icons/lu';
import { WalletButton } from '@vechain/vechain-kit';
import { useTranslation } from 'react-i18next';
import { LanguageDropdown } from './Header';
import { MobileNav } from './MobileNav';

export function TopBar() {
    const { colorMode, toggleColorMode } = useColorMode();
    const { t } = useTranslation();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const showMenuButton = useBreakpointValue({ base: true, md: false });

    return (
        <>
            <HStack
                as="header"
                w="full"
                px={{ base: 4, md: 6 }}
                py={3}
                justify="space-between"
                borderBottomWidth="1px"
                borderBottomColor={
                    colorMode === 'light' ? 'gray.200' : 'whiteAlpha.200'
                }
                bg={colorMode === 'light' ? 'white' : '#0c0c10'}
                position="sticky"
                top={0}
                zIndex={10}
            >
                <HStack spacing={2}>
                    {showMenuButton && (
                        <IconButton
                            aria-label={t('Open menu')}
                            icon={<LuMenu />}
                            onClick={onOpen}
                            variant="ghost"
                            size="sm"
                        />
                    )}
                </HStack>

                <HStack spacing={2}>
                    <Box display={{ base: 'none', sm: 'block' }}>
                        <WalletButton
                            mobileVariant="iconDomainAndAssets"
                            desktopVariant="iconDomainAndAssets"
                            label={t('Login or sign up')}
                        />
                    </Box>
                    <Box display={{ base: 'block', sm: 'none' }}>
                        <WalletButton
                            mobileVariant="icon"
                            desktopVariant="icon"
                            label={t('Login or sign up')}
                        />
                    </Box>
                    <LanguageDropdown />
                    <IconButton
                        onClick={toggleColorMode}
                        icon={colorMode === 'light' ? <LuMoon /> : <LuSun />}
                        aria-label={t('Toggle color mode')}
                        borderRadius="xl"
                        variant="ghost"
                        size="sm"
                    />
                </HStack>
            </HStack>

            <MobileNav isOpen={isOpen} onClose={onClose} />
        </>
    );
}
