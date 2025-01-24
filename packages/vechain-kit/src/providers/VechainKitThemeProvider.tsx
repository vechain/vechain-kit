import { ChakraProvider, createStandaloneToast } from '@chakra-ui/react';
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
            <EnsureChakraProvider theme={theme}>
                {children}
            </EnsureChakraProvider>
            <ToastContainer />
        </>
    );
};
