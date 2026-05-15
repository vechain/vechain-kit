'use client';

import { IconButton, useColorMode } from '@chakra-ui/react';
import { LuMoon, LuSun } from 'react-icons/lu';

/**
 * Floating debug toggle for swapping light / dark themes. Set
 * NEXT_PUBLIC_SHOW_COLOR_MODE_TOGGLE=true to render it; defaults to dev only.
 */
export function ColorModeToggle() {
    const { colorMode, toggleColorMode } = useColorMode();
    const show =
        process.env.NEXT_PUBLIC_SHOW_COLOR_MODE_TOGGLE === 'true' ||
        process.env.NODE_ENV !== 'production';
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
            bg="brand-accent"
            color="white"
            boxShadow="0 8px 24px rgba(0,0,0,0.25)"
            _hover={{ bg: 'brand-accent-hover' }}
        />
    );
}
