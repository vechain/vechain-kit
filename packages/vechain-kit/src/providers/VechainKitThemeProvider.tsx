import {
    ChakraProvider,
    createStandaloneToast,
    ColorModeScript,
    Box,
    useColorMode,
} from '@chakra-ui/react';
import { CacheProvider, Global, css } from '@emotion/react';
import createCache from '@emotion/cache';
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useMemo,
    useRef,
} from 'react';
import { getVechainKitTheme } from '@/theme';
import { safeQuerySelector } from '@/utils/ssrUtils';
import type { VechainKitThemeConfig } from '../theme/tokens';
import { VeChainKitContext } from './VeChainKitProvider';
import { ThemeTokens } from '@/theme/tokens';
import {
    getDefaultTokens,
    convertThemeConfigToTokens,
    mergeTokens,
} from '@/theme/tokens';

type Props = {
    children: ReactNode;
    darkMode?: boolean;
    theme?: VechainKitThemeConfig;
};

// Create a standalone toast system
const { ToastContainer } = createStandaloneToast();

// isolated emotion cache for vechain-kit with CSS layer support
const createVeChainKitCache = () => {
    return createCache({
        key: 'vechain-kit', // consistent with our layer and class names
        prepend: true,
        // CSS layers will be handled via Global component injection
    });
};

// CSS Layer setup - simpler approach that doesn't interfere with host app
const LayerSetup = () => {
    return (
        <Global
            styles={css`
                /* define CSS layers with proper priority order */
                @layer vechain-kit, host-app;

                /* All vechain-kit styles go in the vechain-kit layer */
                @layer vechain-kit {
                    /* scope all Chakra styles to vechain-kit-root */
                    .vechain-kit-root {
                        /* vechain-kit styles are contained here */
                    }
                }
            `}
        />
    );
};

// Base ChakraProvider conf with style isolation
const EnsureChakraProvider = ({
    children,
    theme,
}: {
    children: ReactNode;
    theme: any;
}) => {
    const cache = useMemo(() => createVeChainKitCache(), []);

    // Always disable CSS reset to prevent conflicts with host apps
    // vechain-kit components should be self-contained with their own styling
    return (
        <CacheProvider value={cache}>
            <LayerSetup />
            <ChakraProvider
                theme={theme}
                resetCSS={false}
                // Undefined portal z-index allows host apps to control their own z-index hierarchy
                // instead of Chakra forcing high values (1500+) that might conflict
                portalZIndex={undefined}
            >
                {children}
            </ChakraProvider>
        </CacheProvider>
    );
};

const EnsureColorModeScript = ({ darkMode }: { darkMode: boolean }) => {
    try {
        // Check if ColorModeScript already exists by looking for its data attribute
        const existingScript = safeQuerySelector('[data-chakra-color-mode]');
        if (existingScript) {
            return null; // Don't render another one if it exists
        }
    } catch (e) {
        console.error(e);
    }

    // If no ColorModeScript exists, provide one
    return <ColorModeScript initialColorMode={darkMode ? 'dark' : 'light'} />;
};

const VechainKitThemeContext = createContext<{
    portalRootRef?: React.RefObject<HTMLDivElement | null>;
    tokens?: ThemeTokens;
}>({
    portalRootRef: undefined,
    tokens: undefined,
});

export const useVechainKitThemeConfig = () => {
    const context = useContext(VechainKitThemeContext);
    if (!context) {
        throw new Error(
            'useVechainKitTheme must be used within a VechainKitThemeProvider',
        );
    }
    return context;
};

export const ColorModeSync = ({ darkMode = false }: { darkMode: boolean }) => {
    const { setColorMode, colorMode: currentColorMode } = useColorMode();

    useEffect(() => {
        const colorMode = darkMode ? 'dark' : 'light';

        if (currentColorMode !== colorMode) setColorMode(colorMode);
    }, [darkMode]);

    return <></>;
};

export const VechainKitThemeProvider = ({
    children,
    darkMode = false,
    theme: customTheme,
}: Props) => {
    const portalRootRef = useRef<HTMLDivElement | null>(null);

    // Get theme from context if not provided as prop
    const context = useContext(VeChainKitContext);
    const contextTheme = context ? (context as any).theme : undefined;
    const effectiveTheme = customTheme ?? contextTheme;

    // Generate tokens for component access
    const tokens = useMemo(() => {
        const defaultTokens = getDefaultTokens(darkMode);
        const customTokens = convertThemeConfigToTokens(
            effectiveTheme,
            darkMode,
        );
        return mergeTokens(defaultTokens, customTokens);
    }, [darkMode, effectiveTheme]);

    const theme = useMemo(
        () => ({
            ...getVechainKitTheme(darkMode, effectiveTheme),
            config: {
                ...getVechainKitTheme(darkMode, effectiveTheme).config,
                initialColorMode: darkMode ? 'dark' : 'light',
            },
        }),
        [darkMode, effectiveTheme],
    );

    return (
        <VechainKitThemeContext.Provider value={{ portalRootRef, tokens }}>
            <EnsureColorModeScript darkMode={darkMode} />
            <EnsureChakraProvider theme={theme}>
                <ColorModeSync darkMode={darkMode} />
                <Box
                    id="vechain-kit-root"
                    ref={portalRootRef}
                    bg="transparent"
                    borderRadius="12px"
                >
                    {children}
                </Box>
            </EnsureChakraProvider>
            <ToastContainer />
        </VechainKitThemeContext.Provider>
    );
};
