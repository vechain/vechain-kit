import {
    ChakraProvider,
    createStandaloneToast,
    Box,
} from '@chakra-ui/react';
import { CacheProvider, Global, css } from '@emotion/react';
import createCache from '@emotion/cache';
import {
    createContext,
    ReactNode,
    useContext,
    useMemo,
    useRef,
} from 'react';
import { getVechainKitTheme } from '@/theme';
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
const LayerSetup = ({
    bodyFont,
    headingFont,
}: {
    bodyFont: string;
    headingFont: string;
}) => {
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

                    /* CRITICAL: Remove font CSS variables from :root to prevent leaking to host app */
                    /* Chakra UI sets these globally, so we need to explicitly remove them */
                    :root {
                        --chakra-fonts-body: unset !important;
                        --chakra-fonts-heading: unset !important;
                    }

                    /* CRITICAL: Remove Chakra body background and text color CSS variables from :root, html, and body */
                    /* These are automatically applied by Chakra UI and would override host app styles */
                    :root,
                    html,
                    body {
                        --chakra-body-bg: unset !important;
                        --chakra-body-text: unset !important;
                    }

                    /* Apply font family and CSS variables only to VeChain Kit components */
                    #vechain-kit-root,
                    [data-vechain-kit],
                    [id*='headlessui-portal-root'],
                    [data-vdk-modal] {
                        --chakra-fonts-body: ${bodyFont} !important;
                        --chakra-fonts-heading: ${headingFont} !important;
                        font-family: ${bodyFont} !important;
                    }

                    /* Apply body font to all text elements */
                    #vechain-kit-root *,
                    [data-vechain-kit] *,
                    [id*='headlessui-portal-root'] *,
                    [data-vdk-modal] * {
                        font-family: ${bodyFont} !important;
                    }

                    /* Apply heading font to headings */
                    #vechain-kit-root h1,
                    #vechain-kit-root h2,
                    #vechain-kit-root h3,
                    #vechain-kit-root h4,
                    #vechain-kit-root h5,
                    #vechain-kit-root h6,
                    [data-vechain-kit] h1,
                    [data-vechain-kit] h2,
                    [data-vechain-kit] h3,
                    [data-vechain-kit] h4,
                    [data-vechain-kit] h5,
                    [data-vechain-kit] h6,
                    [id*='headlessui-portal-root'] h1,
                    [id*='headlessui-portal-root'] h2,
                    [id*='headlessui-portal-root'] h3,
                    [id*='headlessui-portal-root'] h4,
                    [id*='headlessui-portal-root'] h5,
                    [id*='headlessui-portal-root'] h6,
                    [data-vdk-modal] h1,
                    [data-vdk-modal] h2,
                    [data-vdk-modal] h3,
                    [data-vdk-modal] h4,
                    [data-vdk-modal] h5,
                    [data-vdk-modal] h6 {
                        font-family: ${headingFont} !important;
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
    bodyFont,
    headingFont,
    colorModeManager,
}: {
    children: ReactNode;
    theme: any;
    bodyFont: string;
    headingFont: string;
    colorModeManager: any;
}) => {
    const cache = useMemo(() => createVeChainKitCache(), []);

    // Always disable CSS reset to prevent conflicts with host apps
    // vechain-kit components should be self-contained with their own styling
    return (
        <CacheProvider value={cache}>
            <LayerSetup bodyFont={bodyFont} headingFont={headingFont} />
            <ChakraProvider
                theme={theme}
                resetCSS={false}
                // Undefined portal z-index allows host apps to control their own z-index hierarchy
                // instead of Chakra forcing high values (1500+) that might conflict
                portalZIndex={undefined}
                colorModeManager={colorModeManager}
            >
                {children}
            </ChakraProvider>
        </CacheProvider>
    );
};

const VechainKitThemeContext = createContext<{
    portalRootRef?: React.RefObject<HTMLDivElement | null>;
    tokens?: ThemeTokens;
    themeConfig?: VechainKitThemeConfig;
}>({
    portalRootRef: undefined,
    tokens: undefined,
    themeConfig: undefined,
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

    // The `darkMode` prop is the single source of truth for the kit's color
    // mode. We feed Chakra's ColorModeProvider a manager that always reports
    // the current prop value and ignores writes, so it never reads or writes
    // localStorage. Without this, Chakra's mount-time effect reads a stale
    // `chakra-ui-color-mode` value and overrides the prop — visible as the
    // kit being stuck in dark mode when the host is light.
    const colorModeManager = useMemo(
        () => ({
            type: 'localStorage' as const,
            ssr: false,
            get: () => (darkMode ? 'dark' : 'light'),
            set: () => {},
        }),
        [darkMode],
    );

    return (
        <VechainKitThemeContext.Provider
            value={{ portalRootRef, tokens, themeConfig: effectiveTheme }}
        >
            <EnsureChakraProvider
                theme={theme}
                bodyFont={tokens.fonts.body}
                headingFont={tokens.fonts.heading}
                colorModeManager={colorModeManager}
            >
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
