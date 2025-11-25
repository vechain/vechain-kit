import { createStandaloneToast, Box, ChakraProvider } from '@chakra-ui/react';
import { createContext, ReactNode, useContext, useMemo, useRef } from 'react';
import { useTheme as useEmotionTheme } from '@emotion/react';
import type { VechainKitThemeConfig } from '../theme/tokens';
import { VeChainKitContext } from './VeChainKitProvider';
import { ThemeTokens } from '@/theme/tokens';
import {
    getDefaultTokens,
    convertThemeConfigToTokens,
    mergeTokens,
} from '@/theme/tokens';
import { getVechainKitTheme } from '@/theme/theme';

type Props = {
    children: ReactNode;
    darkMode?: boolean;
    theme?: VechainKitThemeConfig;
};

// Create a standalone toast system
const { ToastContainer } = createStandaloneToast();

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

// Component to conditionally wrap with ChakraProvider if not already provided
const ConditionalChakraProvider = ({
    children,
    darkMode,
    theme,
}: {
    children: ReactNode;
    darkMode: boolean;
    theme?: VechainKitThemeConfig;
}) => {
    // Check if Chakra provider already exists by trying to access emotion theme
    // This hook call is unconditional, which follows React's rules of hooks
    const emotionTheme = useEmotionTheme();
    // Generate the Chakra theme for VeChain Kit
    const chakraTheme = useMemo(
        () => getVechainKitTheme(darkMode, theme),
        [darkMode, theme],
    );

    // If emotion theme exists, ChakraProvider is already in the tree
    // Return children without wrapping
    if (emotionTheme && Object.keys(emotionTheme).length > 0) {
        return <>{children}</>;
    }

    // Otherwise, wrap with ChakraProvider
    return <ChakraProvider theme={chakraTheme}>{children}</ChakraProvider>;
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

    return (
        <ConditionalChakraProvider darkMode={darkMode} theme={effectiveTheme}>
            <VechainKitThemeContext.Provider value={{ portalRootRef, tokens }}>
                <Box
                    id="vechain-kit-root"
                    ref={portalRootRef}
                    bg="transparent"
                    borderRadius="12px"
                >
                    {children}
                </Box>

                <ToastContainer />
            </VechainKitThemeContext.Provider>
        </ConditionalChakraProvider>
    );
};
