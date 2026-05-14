import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

// Mirror b3tr's theme shape: a `cssVarsPrefix` and semantic tokens with
// `_dark` variants. The kit receives `useToken(...)` results from these
// tokens, which resolve to `var(--vbd-colors-*)` CSS variable references
// whose underlying value flips based on `html.class="dark"`.
const config = defineConfig({
    preflight: true,
    cssVarsPrefix: 'vbd',
    theme: {
        tokens: {
            colors: {
                gray: {
                    50: { value: '#F9F9FA' },
                    100: { value: '#F1F2F3' },
                    200: { value: '#E7E9EB' },
                    700: { value: '#363A3F' },
                    800: { value: '#272A2E' },
                    900: { value: '#1B1D1F' },
                },
                blue: {
                    400: { value: '#4D88FF' },
                    600: { value: '#004CFC' },
                    700: { value: '#003ECC' },
                },
            },
        },
        semanticTokens: {
            colors: {
                bg: {
                    primary: {
                        value: { base: 'white', _dark: '{colors.gray.900}' },
                    },
                    secondary: {
                        value: { base: '{colors.gray.50}', _dark: '#0F0F0F' },
                    },
                },
                actions: {
                    primary: {
                        default: {
                            value: {
                                base: '{colors.blue.600}',
                                _dark: '{colors.blue.400}',
                            },
                        },
                        hover: {
                            value: {
                                base: '{colors.blue.700}',
                                _dark: '{colors.blue.400}',
                            },
                        },
                        text: { value: { base: 'white', _dark: 'white' } },
                    },
                },
                card: {
                    subtle: {
                        value: {
                            base: '{colors.gray.50}',
                            _dark: '{colors.gray.700}',
                        },
                        hover: {
                            value: {
                                base: '{colors.gray.100}',
                                _dark: '{colors.gray.800}',
                            },
                        },
                    },
                },
                border: {
                    secondary: {
                        value: {
                            base: '{colors.gray.100}',
                            _dark: '{colors.gray.800}',
                        },
                    },
                },
                text: {
                    primary: {
                        value: { base: '{colors.gray.800}', _dark: 'white' },
                    },
                },
            },
        },
        globalCss: {
            'html,body': {
                bg: 'bg.secondary',
                color: 'text.primary',
                transition: 'background-color 0.2s, color 0.2s',
            },
        },
    },
});

const theme = createSystem(defaultConfig, config);
export default theme;
