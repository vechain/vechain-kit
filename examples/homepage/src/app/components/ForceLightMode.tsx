'use client';

import { useEffect } from 'react';
import { useColorMode } from '@chakra-ui/react';

/**
 * Component that forces light mode and clears any cached dark mode preference.
 * This ensures that users with old cached preferences always see light mode.
 */
export function ForceLightMode() {
    const { colorMode, setColorMode } = useColorMode();

    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Clear any cached color mode preferences from localStorage
        // Chakra UI may store it with different keys depending on cssVarPrefix
        const possibleKeys = [
            'chakra-ui-color-mode-vechain-kit-homepage',
            'chakra-ui-color-mode',
            'vechain-kit-homepage-color-mode',
        ];

        possibleKeys.forEach((key) => {
            const storedValue = localStorage.getItem(key);
            if (storedValue && storedValue !== 'light') {
                localStorage.setItem(key, 'light');
            }
        });

        // Force light mode
        if (colorMode !== 'light') {
            setColorMode('light');
        }
    }, [colorMode, setColorMode]);

    return null;
}

