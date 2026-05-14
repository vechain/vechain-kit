'use client';
import {
    ClientOnly,
    IconButton,
    IconButtonProps,
    Skeleton,
} from '@chakra-ui/react';
import {
    ThemeProvider,
    ThemeProviderProps,
    useTheme,
} from 'next-themes';
import * as React from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';

// Mirrors b3tr's color-mode wrapper exactly. next-themes provides the
// resolved theme; the kit receives `darkMode={colorMode === 'dark'}` from a
// consumer of this hook.
export interface ColorModeProviderProps extends ThemeProviderProps {}
export function ColorModeProvider(props: ColorModeProviderProps) {
    return (
        <ThemeProvider attribute="class" disableTransitionOnChange {...props} />
    );
}

export type ColorMode = 'light' | 'dark';
export interface UseColorModeReturn {
    colorMode: ColorMode;
    setColorMode: (colorMode: ColorMode) => void;
    toggleColorMode: () => void;
}

export function useColorMode(): UseColorModeReturn {
    const { resolvedTheme, setTheme, forcedTheme } = useTheme();
    const colorMode = forcedTheme || resolvedTheme;
    const toggleColorMode = () => {
        setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
    };
    return {
        colorMode: colorMode as ColorMode,
        setColorMode: setTheme as (m: ColorMode) => void,
        toggleColorMode,
    };
}

export function ColorModeIcon() {
    const { colorMode } = useColorMode();
    return colorMode === 'light' ? <FaMoon /> : <FaSun />;
}

interface ColorModeButtonProps extends Omit<IconButtonProps, 'aria-label'> {}

export const ColorModeButton = React.forwardRef<
    HTMLButtonElement,
    ColorModeButtonProps
>(function ColorModeButton(props, ref) {
    const { toggleColorMode } = useColorMode();
    return (
        <ClientOnly fallback={<Skeleton boxSize="8" />}>
            <IconButton
                onClick={toggleColorMode}
                variant="ghost"
                aria-label="Toggle color mode"
                ref={ref}
                {...props}
            >
                <ColorModeIcon />
            </IconButton>
        </ClientOnly>
    );
});
