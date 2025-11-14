import {
    ChakraProvider,
    createStandaloneToast,
    ColorModeScript,
} from '@chakra-ui/react';
import { ReactNode, useMemo } from 'react';
import { getVechainKitTheme } from '@/theme';
import { CacheProvider, Global, css } from '@emotion/react';
import createCache from '@emotion/cache';

type Props = {
    children: ReactNode;
    darkMode?: boolean;
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

// Base ChakraProvider configuration
const EnsureChakraProvider = ({
    children,
    theme,
}: {
    children: ReactNode;
    theme: any;
}) => {
    const cache = useMemo(() => createVeChainKitCache(), []);

    try {
        // Try to access Chakra's CSS variables to check if provider exists
        const chakraVars = document.documentElement.style.getPropertyValue(
            '--chakra-colors-transparent',
        );

        if (chakraVars) {
            // If ChakraProvider exists, just add our theme layer
            return (
                <CacheProvider value={cache}>
                    <LayerSetup />
                    <ChakraProvider theme={theme} resetCSS={false}>
                        {children}
                    </ChakraProvider>
                </CacheProvider>
            );
        }
    } catch (e) {
        // Handle any potential errors silently
        console.error(e);
    }

    // If no ChakraProvider exists, provide a base one
    return (
        <CacheProvider value={cache}>
            <LayerSetup />
            <ChakraProvider theme={theme} resetCSS={true}>
                {children}
            </ChakraProvider>
        </CacheProvider>
    );
};

const EnsureColorModeScript = ({ darkMode }: { darkMode: boolean }) => {
    try {
        // Check if ColorModeScript already exists by looking for its data attribute
        const existingScript = document.querySelector(
            '[data-chakra-color-mode]',
        );
        if (existingScript) {
            return null; // Don't render another one if it exists
        }
    } catch (e) {
        console.error(e);
    }

    // If no ColorModeScript exists, provide one
    return <ColorModeScript initialColorMode={darkMode ? 'dark' : 'light'} />;
};

export const VechainKitThemeProvider = ({
    children,
    darkMode = false,
}: Props) => {
    const theme = useMemo(
        () => ({
            ...getVechainKitTheme(darkMode),
            config: {
                ...getVechainKitTheme(darkMode).config,
                initialColorMode: darkMode ? 'dark' : 'light',
            },
        }),
        [darkMode],
    );

    return (
        <>
            <EnsureColorModeScript darkMode={darkMode} />
            <EnsureChakraProvider theme={theme}>
                {children}
            </EnsureChakraProvider>
            <ToastContainer />
        </>
    );
};
