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
export function improvePrivyReadability(
    color: string,
    darkMode: boolean,
): string {
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
        '--vdk-modal-width': tokens.sizes.modal,
        '--vdk-modal-backdrop-filter': tokens.effects.backdropFilter.modal,
        '--vdk-border-dark-source-card': `1px solid ${tokens.colors.border.default}`,
        '--vdk-border-light-source-card': `1px solid ${tokens.colors.border.default}`,
        '--vdk-font-family': tokens.fonts.body,
        '--vdk-font-size-medium': tokens.fonts.sizes.medium,
        '--vdk-font-size-large': tokens.fonts.sizes.large,
        '--vdk-font-weight-medium': tokens.fonts.weights.medium.toString(),
    };

    // Use loginIn variant style: white (light) / transparent (dark) background
    // For hover/active, derive colors that simulate the opacity: 0.5 effect
    // DAppKit uses these CSS variables for background colors
    if (darkMode) {
        vars['--vdk-color-dark-primary'] = 'transparent'; // loginIn dark mode bg
        // For transparent base, use a subtle white overlay to simulate dimming
        // This creates a visual effect similar to opacity: 0.5
        vars['--vdk-color-dark-primary-hover'] = 'rgba(255, 255, 255, 0.05)'; // Subtle white overlay
        vars['--vdk-color-dark-primary-active'] = 'rgba(255, 255, 255, 0.1)'; // Slightly more visible
        // DAppKit uses secondary color for modal background
        vars['--vdk-color-dark-secondary'] = tokens.colors.background.modal;
        // DAppKit uses tertiary color for text
        vars['--vdk-color-dark-tertiary'] = tokens.colors.text.primary;
    } else {
        vars['--vdk-color-light-primary'] = '#ffffff'; // loginIn light mode bg
        // For white base, use a slightly grayed white to simulate opacity: 0.5
        // This makes the button appear dimmed on hover
        vars['--vdk-color-light-primary-hover'] = 'rgba(245, 245, 245, 0.8)'; // Slightly grayed white
        vars['--vdk-color-light-primary-active'] = 'rgba(240, 240, 240, 0.8)'; // Slightly darker for active
        // DAppKit uses secondary color for modal background
        vars['--vdk-color-light-secondary'] = tokens.colors.background.modal;
        // DAppKit uses tertiary color for text
        vars['--vdk-color-light-tertiary'] = tokens.colors.text.primary;
    }

    return vars;
}

/**
 * Generate Privy CSS variables from ThemeTokens
 * Note: Privy modals don't support backdrop filters natively, so we:
 * 1. Slightly increase opacity for readability while maintaining glass effect
 * 2. Inject CSS to apply backdrop filters to Privy modals
 * 3. Map primary hover/active colors to Privy button states (background-2/background-3)
 * 4. Inject CSS to apply card colors to Privy card elements directly
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

    // Use loginIn variant style: white (light) / transparent (dark) background
    // For hover/active, we'll apply opacity: 0.5 via CSS injection
    const privyButtonBaseBg = darkMode ? 'transparent' : '#ffffff';
    const privyButtonHoverBg = darkMode ? 'transparent' : '#ffffff';
    const privyButtonActiveBg = darkMode ? 'transparent' : '#ffffff';

    const variables: Record<string, string> = {
        '--privy-border-radius-sm': tokens.borders.radius.small,
        '--privy-border-radius-md': tokens.borders.radius.medium,
        '--privy-border-radius-lg': tokens.borders.radius.large,
        '--privy-border-radius-full': tokens.borders.radius.full,
        '--privy-color-background': privyModalBg,
        // Use loginIn variant style: white (light) / transparent (dark) background
        // Hover/active will use opacity: 0.5 via CSS injection
        '--privy-color-background-2': privyButtonHoverBg,
        '--privy-color-background-3': privyButtonActiveBg,
        '--privy-color-foreground': tokens.colors.text.primary,
        '--privy-color-foreground-2': tokens.colors.text.primary, // Privy uses this for primary text
        '--privy-color-foreground-3': tokens.colors.text.secondary, // Privy uses this for secondary text
        '--privy-color-foreground-4': tokens.colors.text.tertiary, // Privy uses this for tertiary text
        // Use loginIn text colors: #1a1a1a (light) / white (dark)
        '--privy-color-foreground-accent': darkMode ? '#ffffff' : '#1a1a1a',
        '--privy-color-accent': privyButtonBaseBg, // loginIn background color
        '--privy-color-accent-light': privyButtonHoverBg,
        '--privy-color-accent-lightest': privyButtonActiveBg,
        '--privy-color-accent-dark': privyButtonHoverBg,
        '--privy-color-accent-darkest': privyButtonActiveBg,
        '--privy-color-success': tokens.colors.success,
        '--privy-color-error': tokens.colors.error,
        '--privy-color-error-light': tokens.colors.error + '33',
    };

    return variables;
}

/**
 * Apply DAppKit button styles (hover opacity matching loginIn variant)
 */
export function applyDAppKitButtonStyles(): void {
    if (typeof document === 'undefined') return;

    const styleId = 'vechain-kit-dappkit-button-styles';
    let styleElement = document.getElementById(styleId);

    if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = styleId;
        document.head.appendChild(styleElement);
    }

    // Target DAppKit wallet source buttons/cards
    // Apply hover/active opacity to match loginIn variant style
    // Target all button-like elements (buttons, clickable divs, elements with cursor pointer)
    const cssRules = `
        /* DAppKit wallet source buttons - apply loginIn hover style */
        /* Target all button-like elements within DAppKit containers */
        [class*="vdk"] button,
        [class*="vdk"] [role="button"],
        [class*="vdk"] [tabindex],
        [id*="vdk"] button,
        [id*="vdk"] [role="button"],
        [id*="vdk"] [tabindex],
        [data-vdk-modal] button,
        [data-vdk-modal] [role="button"],
        [data-vdk-modal] [tabindex],
        [data-vdk-source-card],
        [class*="vdk-source-card"],
        [class*="source-card"],
        button[class*="vdk"],
        [data-vdk-button],
        [class*="vdk-button"],
        /* Target elements that are likely buttons based on styling */
        [class*="vdk"] [style*="cursor"][style*="pointer"],
        [id*="vdk"] [style*="cursor"][style*="pointer"],
        [data-vdk-modal] [style*="cursor"][style*="pointer"] {
            transition: opacity 0.2s ease !important;
        }
        
        /* Hover states */
        [class*="vdk"] button:hover,
        [class*="vdk"] [role="button"]:hover,
        [class*="vdk"] [tabindex]:hover,
        [id*="vdk"] button:hover,
        [id*="vdk"] [role="button"]:hover,
        [id*="vdk"] [tabindex]:hover,
        [data-vdk-modal] button:hover,
        [data-vdk-modal] [role="button"]:hover,
        [data-vdk-modal] [tabindex]:hover,
        [data-vdk-source-card]:hover,
        [class*="vdk-source-card"]:hover,
        [class*="source-card"]:hover,
        button[class*="vdk"]:hover,
        [data-vdk-button]:hover,
        [class*="vdk-button"]:hover,
        [class*="vdk"] [style*="cursor"][style*="pointer"]:hover,
        [id*="vdk"] [style*="cursor"][style*="pointer"]:hover,
        [data-vdk-modal] [style*="cursor"][style*="pointer"]:hover {
            opacity: 0.5 !important;
        }
        
        /* Active states */
        [class*="vdk"] button:active,
        [class*="vdk"] [role="button"]:active,
        [class*="vdk"] [tabindex]:active,
        [id*="vdk"] button:active,
        [id*="vdk"] [role="button"]:active,
        [id*="vdk"] [tabindex]:active,
        [data-vdk-modal] button:active,
        [data-vdk-modal] [role="button"]:active,
        [data-vdk-modal] [tabindex]:active,
        [data-vdk-source-card]:active,
        [class*="vdk-source-card"]:active,
        [class*="source-card"]:active,
        button[class*="vdk"]:active,
        [data-vdk-button]:active,
        [class*="vdk-button"]:active,
        [class*="vdk"] [style*="cursor"][style*="pointer"]:active,
        [id*="vdk"] [style*="cursor"][style*="pointer"]:active,
        [data-vdk-modal] [style*="cursor"][style*="pointer"]:active {
            opacity: 0.5 !important;
        }
    `;

    styleElement.textContent = cssRules;

    // Use MutationObserver to apply styles to dynamically added DAppKit elements
    if (typeof MutationObserver !== 'undefined') {
        const observer = new MutationObserver(() => {
            // Re-apply styles when DAppKit adds new elements
            const dappKitElements = document.querySelectorAll(
                '[data-vdk-source-card], [class*="vdk-source-card"], [class*="source-card"], [data-vdk-modal] button, [data-vdk-modal] [role="button"]',
            );
            dappKitElements.forEach((element) => {
                if (element instanceof HTMLElement) {
                    element.style.setProperty('opacity', '1', 'important');
                    element.style.setProperty(
                        'transition',
                        'opacity 0.2s ease',
                        'important',
                    );
                }
            });
        });

        // Observe the document body for DAppKit modal additions
        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        // Cleanup observer after a delay (DAppKit modals are typically short-lived)
        setTimeout(() => {
            observer.disconnect();
        }, 60000); // Disconnect after 60 seconds
    }
}

/**
 * Apply Privy CSS variables to document body and inject backdrop filter + card styles
 */
export function applyPrivyCSSVariables(
    variables: Record<string, string>,
    backdropFilter?: string,
    cardBg?: string,
    cardElevatedBg?: string,
    buttonBaseColor?: string,
    buttonHoverColor?: string,
    buttonActiveColor?: string,
    borderColor?: string,
    modalWidth?: string,
): void {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    Object.entries(variables).forEach(([key, value]) => {
        root.style.setProperty(key, value);
    });

    // Inject CSS for backdrop filters, card backgrounds, and button colors
    const styleId = 'vechain-kit-privy-styles';
    let styleElement = document.getElementById(styleId);

    if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = styleId;
        document.head.appendChild(styleElement);
    }

    const cssRules: string[] = [];

    // Apply backdrop filter to Privy modal containers
    if (backdropFilter) {
        cssRules.push(`
            [data-privy-dialog-overlay],
            [data-privy-dialog-content],
            .privy-dialog-overlay,
            .privy-dialog-content {
                backdrop-filter: ${backdropFilter} !important;
                -webkit-backdrop-filter: ${backdropFilter} !important;
            }
        `);
    }

    // Apply modal width to Privy modal containers
    if (modalWidth) {
        cssRules.push(`
            [data-privy-dialog-content],
            .privy-dialog-content {
                width: ${modalWidth} !important;
                max-width: ${modalWidth} !important;
            }
        `);
    }

    // Apply card backgrounds to Privy card/container elements
    // Target common Privy card selectors without affecting button hover states
    if (cardBg) {
        cssRules.push(`
            [data-privy-card],
            .privy-card,
            [class*="privy-card"],
            [class*="privy-connect-wallet-card"],
            [class*="privy-account-card"] {
                background-color: ${cardBg} !important;
            }
        `);
    }

    if (cardElevatedBg) {
        cssRules.push(`
            [data-privy-card][data-elevated],
            .privy-card-elevated,
            [class*="privy-card"][class*="elevated"] {
                background-color: ${cardElevatedBg} !important;
            }
        `);
    }

    // Apply loginIn variant style to Privy login method buttons
    // Base: white (light) / transparent (dark)
    // Hover/Active: opacity: 0.5 (matching loginIn variant)
    if (buttonBaseColor) {
        const borderColorValue = borderColor || 'rgba(0, 0, 0, 0.1)';
        cssRules.push(`
            #headlessui-portal-root .login-method-button,
            #headlessui-portal-root [class*="login-method-button"],
            .login-method-button {
                background-color: ${buttonBaseColor} !important;
                border: 1px solid ${borderColorValue} !important;
            }
        `);
    }

    // Apply hover state with opacity: 0.5 (matching loginIn variant)
    if (buttonHoverColor) {
        cssRules.push(`
            #headlessui-portal-root .login-method-button:hover,
            #headlessui-portal-root [class*="login-method-button"]:hover,
            .login-method-button:hover {
                background-color: ${buttonHoverColor} !important;
                opacity: 0.5 !important;
            }
        `);
    }

    // Apply active state with opacity: 0.5 (matching loginIn variant)
    if (buttonActiveColor) {
        cssRules.push(`
            #headlessui-portal-root .login-method-button:active,
            #headlessui-portal-root [class*="login-method-button"]:active,
            .login-method-button:active {
                background-color: ${buttonActiveColor} !important;
                opacity: 0.5 !important;
            }
        `);
    }

    if (cssRules.length > 0) {
        styleElement.textContent = cssRules.join('\n');
    }
}
