/**
 * CSS variable generators for DAppKit and Privy
 * Converts ThemeTokens to CSS variable objects
 */

import { ThemeTokens } from '@/theme/tokens';
import { CustomizedStyle } from '@vechain/dapp-kit-ui';

/**
 * Generate DAppKit CSS variables from ThemeTokens
 */
export function generateDAppKitCSSVariables(
    tokens: ThemeTokens,
    darkMode: boolean,
): CustomizedStyle {
    const vars: CustomizedStyle = {
        '--vdk-modal-z-index': '10000',
        '--vdk-modal-width': '22rem',
        '--vdk-modal-backdrop-filter': tokens.effects.backdropFilter.modal,
        '--vdk-border-dark-source-card': `1px solid ${tokens.colors.border.default}`,
        '--vdk-border-light-source-card': `1px solid ${tokens.colors.border.default}`,
        '--vdk-font-family': tokens.fonts.family,
        '--vdk-font-size-medium': tokens.fonts.sizes.medium,
        '--vdk-font-size-large': tokens.fonts.sizes.large,
        '--vdk-font-weight-medium': tokens.fonts.weights.medium.toString(),
    };

    if (darkMode) {
        vars['--vdk-color-dark-primary'] = tokens.colors.primary.base;
        vars['--vdk-color-dark-primary-hover'] = tokens.colors.primary.hover;
        vars['--vdk-color-dark-primary-active'] = tokens.colors.primary.active;
        vars['--vdk-color-dark-secondary'] = tokens.colors.secondary.base;
    } else {
        vars['--vdk-color-light-primary'] = tokens.colors.primary.base;
        vars['--vdk-color-light-primary-hover'] = tokens.colors.primary.hover;
        vars['--vdk-color-light-primary-active'] = tokens.colors.primary.active;
        vars['--vdk-color-light-secondary'] = tokens.colors.secondary.base;
    }

    return vars;
}

/**
 * Generate Privy CSS variables from ThemeTokens
 */
export function generatePrivyCSSVariables(
    tokens: ThemeTokens,
): Record<string, string> {
    return {
        '--privy-border-radius-sm': tokens.borders.radius.small,
        '--privy-border-radius-md': tokens.borders.radius.medium,
        '--privy-border-radius-lg': tokens.borders.radius.large,
        '--privy-border-radius-full': tokens.borders.radius.full,
        '--privy-color-background': tokens.colors.background.modal,
        '--privy-color-background-2': tokens.colors.background.card,
        '--privy-color-background-3': tokens.colors.background.cardElevated,
        '--privy-color-foreground': tokens.colors.text.primary,
        '--privy-color-foreground-2': tokens.colors.text.secondary,
        '--privy-color-foreground-3': tokens.colors.text.tertiary,
        '--privy-color-foreground-4': tokens.colors.text.disabled,
        '--privy-color-foreground-accent': tokens.colors.primary.base,
        '--privy-color-accent': tokens.colors.primary.base,
        '--privy-color-accent-light': tokens.colors.primary.hover,
        '--privy-color-accent-lightest': tokens.colors.tertiary.base,
        '--privy-color-accent-dark': tokens.colors.primary.active,
        '--privy-color-accent-darkest': tokens.colors.primary.active,
        '--privy-color-success': tokens.colors.success,
        '--privy-color-error': tokens.colors.error,
        '--privy-color-error-light': tokens.colors.error + '33',
    };
}

/**
 * Apply Privy CSS variables to document body
 */
export function applyPrivyCSSVariables(variables: Record<string, string>): void {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    Object.entries(variables).forEach(([key, value]) => {
        root.style.setProperty(key, value);
    });
}

