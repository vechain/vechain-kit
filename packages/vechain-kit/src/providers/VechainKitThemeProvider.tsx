import {
    ChakraProvider,
    createStandaloneToast,
    ColorModeScript,
} from '@chakra-ui/react';
import { CacheProvider, Global, css } from '@emotion/react';
import createCache from '@emotion/cache';
import { ReactNode, useMemo } from 'react';
import { VechainKitTheme } from '@/theme';

type Props = {
    children: ReactNode;
    darkMode?: boolean;
};

// Create a standalone toast system
const { ToastContainer } = createStandaloneToast();

// isolated emotion cache for VeChain Kit with CSS layer support
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

                /* All VeChain Kit styles go in the vechain-kit layer */
                @layer vechain-kit {
                    /* scope all Chakra styles to vechain-kit-root */
                    .vechain-kit-root {
                        /* VeChain Kit styles are contained here */
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

    // Always disable CSS reset to prevent conflicts with host applications
    // VeChain Kit components should be self-contained with their own styling
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
                <div className="vechain-kit-root">{children}</div>
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
            ...VechainKitTheme,
            config: {
                ...VechainKitTheme.config,
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
