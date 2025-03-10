import {
    ChakraProvider,
    createStandaloneToast,
    ColorModeScript,
} from '@chakra-ui/react';
import { ReactNode, useMemo } from 'react';
import { VechainKitTheme } from '@/theme';

type Props = {
    children: ReactNode;
    darkMode?: boolean;
};

// Create a standalone toast system
const { ToastContainer } = createStandaloneToast();

// Base ChakraProvider configuration
const EnsureChakraProvider = ({
    children,
    theme,
}: {
    children: ReactNode;
    theme: any;
}) => {
    try {
        // Try to access Chakra's CSS variables to check if provider exists
        const chakraVars = document.documentElement.style.getPropertyValue(
            '--chakra-colors-transparent',
        );
        if (chakraVars) {
            // If ChakraProvider exists, just add our theme layer
            return (
                <ChakraProvider theme={theme} resetCSS={false}>
                    {children}
                </ChakraProvider>
            );
        }
    } catch (e) {
        // Handle any potential errors silently
        console.error(e);
    }

    // If no ChakraProvider exists, provide a base one
    return (
        <ChakraProvider theme={theme} resetCSS={true}>
            {children}
        </ChakraProvider>
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
