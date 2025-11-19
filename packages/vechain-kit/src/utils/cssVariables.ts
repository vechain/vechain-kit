/**
 * CSS variable generators for DAppKit and Privy
 * Converts ThemeTokens to CSS variable objects
 */

import { ThemeTokens } from '@/theme/tokens';
import { CustomizedStyle } from '@vechain/dapp-kit-ui';

/**
 * Slightly increase opacity for Privy modals to improve readability
 * while maintaining the glass effect appearance
 */
function improvePrivyReadability(color: string, darkMode: boolean): string {
    // If it's already a solid color (hex or rgb without alpha), return as-is
    if (!color.includes('rgba') && !color.includes('hsla')) {
        return color;
    }

    // Extract rgba values
    const rgbaMatch = color.match(
        /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/,
    );
    if (rgbaMatch) {
        const r = parseInt(rgbaMatch[1], 10);
        const g = parseInt(rgbaMatch[2], 10);
        const b = parseInt(rgbaMatch[3], 10);
        const alpha = rgbaMatch[4] ? parseFloat(rgbaMatch[4]) : 1;

        // If alpha is already high, return as-is to maintain glass effect
        if (alpha >= 0.9) {
            return color;
        }

        // Only slightly increase opacity (by ~0.15-0.2) to improve readability
        // while maintaining the glass effect look
        const minAlpha = darkMode ? 0.9 : 0.91;
        const targetAlpha = Math.min(Math.max(alpha + 0.15, minAlpha), 0.91);
        return `rgba(${r}, ${g}, ${b}, ${targetAlpha})`;
    }

    // If we can't parse it, return the original color
    return color;
}

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
 * Note: Privy modals don't support backdrop filters natively, so we:
 * 1. Slightly increase opacity for readability while maintaining glass effect
 * 2. Inject CSS to apply backdrop filters to Privy modals
 */
export function generatePrivyCSSVariables(
    tokens: ThemeTokens,
    darkMode: boolean,
): Record<string, string> {
    // Slightly improve readability while maintaining glass effect
    const privyModalBg = improvePrivyReadability(
        tokens.colors.background.modal,
        darkMode,
    );
    const privyCardBg = improvePrivyReadability(
        tokens.colors.background.card,
        darkMode,
    );
    const privyCardElevatedBg = improvePrivyReadability(
        tokens.colors.background.cardElevated,
        darkMode,
    );

    const variables: Record<string, string> = {
        '--privy-border-radius-sm': tokens.borders.radius.small,
        '--privy-border-radius-md': tokens.borders.radius.medium,
        '--privy-border-radius-lg': tokens.borders.radius.large,
        '--privy-border-radius-full': tokens.borders.radius.full,
        '--privy-color-background': privyModalBg,
        '--privy-color-background-2': privyCardBg,
        '--privy-color-background-3': privyCardElevatedBg,
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

    return variables;
}

/**
 * Apply Privy CSS variables to document body and inject backdrop filter styles
 */
export function applyPrivyCSSVariables(
    variables: Record<string, string>,
    backdropFilter?: string,
): void {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    Object.entries(variables).forEach(([key, value]) => {
        root.style.setProperty(key, value);
    });

    // Inject CSS to apply backdrop filters to Privy modals
    // This helps maintain visual consistency with VeChain Kit modals
    if (backdropFilter) {
        const styleId = 'vechain-kit-privy-backdrop-filter';
        let styleElement = document.getElementById(styleId);

        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = styleId;
            document.head.appendChild(styleElement);
        }

        // Apply backdrop filter to Privy modal containers
        styleElement.textContent = `
            [data-privy-dialog-overlay],
            [data-privy-dialog-content],
            .privy-dialog-overlay,
            .privy-dialog-content {
                backdrop-filter: ${backdropFilter} !important;
                -webkit-backdrop-filter: ${backdropFilter} !important;
            }
        `;
    }
}
