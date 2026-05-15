'use client';

import { useEffect } from 'react';
import { useColorMode } from '@chakra-ui/react';

/**
 * Force Chakra into a specific color mode regardless of what's cached in
 * localStorage. Chakra's ColorModeScript reads `chakra-ui-color-mode` from
 * storage before our theme config can take effect, so a user who toggled
 * dark earlier in the session keeps seeing dark after we change theme.
 * This component overrides the cached value on mount so light-mode stays
 * locked while we evaluate.
 */
export function ForceColorMode({ mode }: { mode: 'light' | 'dark' }) {
    const { colorMode, setColorMode } = useColorMode();
    useEffect(() => {
        if (colorMode !== mode) setColorMode(mode);
    }, [colorMode, mode, setColorMode]);
    return null;
}
