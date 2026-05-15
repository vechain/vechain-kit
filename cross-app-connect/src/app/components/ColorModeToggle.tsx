'use client';

import { IconButton, useColorMode } from '@chakra-ui/react';
import { LuMoon, LuSun } from 'react-icons/lu';

/**
 * Floating debug toggle for swapping light / dark themes. Set
 * NEXT_PUBLIC_SHOW_COLOR_MODE_TOGGLE=true to render it; defaults to dev only.
 */
export function ColorModeToggle() {
    const { colorMode, toggleColorMode } = useColorMode();
    // Hidden by default. Set NEXT_PUBLIC_SHOW_COLOR_MODE_TOGGLE=true to
    // surface it (in dev or prod) when you need to debug theme swaps.
    const show = process.env.NEXT_PUBLIC_SHOW_COLOR_MODE_TOGGLE === 'true';
    if (!show) return null;
    return (
        <IconButton
            aria-label={
                colorMode === 'dark' ? 'Switch to light' : 'Switch to dark'
            }
            icon={colorMode === 'dark' ? <LuSun /> : <LuMoon />}
            onClick={toggleColorMode}
            position="fixed"
            top={4}
            left={4}
            zIndex={9999}
            size="md"
            isRound
            bg="accent"
            color="white"
            boxShadow="0 8px 24px rgba(0,0,0,0.25)"
            _hover={{ bg: 'accent' }}
        />
    );
}
