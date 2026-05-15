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
            bottom={4}
            right={4}
            zIndex={9999}
            size="sm"
            variant="ghost"
            bg="card-bg"
            color="text-strong"
            borderWidth="1px"
            borderColor="card-border"
            _hover={{ bg: 'btn-row-hover-bg' }}
        />
    );
}
