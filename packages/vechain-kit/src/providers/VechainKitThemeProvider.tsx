import { ChakraProvider } from '@chakra-ui/react';
import { ReactNode, useMemo } from 'react';
import { VechainKitTheme } from '@/theme';

type Props = {
    children: ReactNode;
    darkMode?: boolean;
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
        <ChakraProvider theme={theme} resetCSS={false}>
            {children}
        </ChakraProvider>
    );
};
