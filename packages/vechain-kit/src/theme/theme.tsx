import { ThemeConfig, extendTheme, theme as baseTheme } from '@chakra-ui/react';
import { getModalTheme } from './modal';
import { getCardTheme } from './card';
import { buttonTheme } from './button';
import { getPopoverTheme } from './popover';

// minimal theme that completely disables global styles
const getThemeConfig = (darkMode: boolean): ThemeConfig => ({
  useSystemColorMode: false,
  disableTransitionOnChange: false,

  // @ts-ignore
  components: {
    Modal: getModalTheme(darkMode),
    Card: getCardTheme(darkMode),
    Button: buttonTheme,
    Popover: getPopoverTheme(darkMode),
  },
  cssVarPrefix: 'vechain-kit', // consistent naming across all components

  // COMPLETELY disable global styles to prevent any conflicts
  styles: {
    global: () => ({}), // empty object = no global styles injected
  },

  // only defining the semantic tokens we need, scoped to our components
  semanticTokens: {
    colors: {
      'chakra-body-text': {
        _light: '#1A202C',
        _dark: '#F7FAFC',
      },
      'chakra-body-bg': {
        _light: '#FFFFFF',
        _dark: '#1A202C',
      },
      'chakra-border-color': {
        _light: '#E2E8F0',
        _dark: '#2D3748',
      },
      'chakra-placeholder-color': {
        _light: '#A0AEC0',
        _dark: '#718096',
      },
    },
  },

  // minimal foundations to prevent global style injection
  fonts: baseTheme.fonts,
  colors: baseTheme.colors,
  space: baseTheme.space,
});

export const getVechainKitTheme = (darkMode: boolean) => {
  const theme = extendTheme(getThemeConfig(darkMode));

  // CRITICAL: Force override of global styles after theme creation
  theme.styles.global = () => ({});

  // also override any other global style fns that might exist
  if (theme.__cssVars) {
    theme.__cssVars.global = () => ({});
  }

  return theme;
};

