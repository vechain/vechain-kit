/**
 * Theme token system for VeChain Kit
 * Provides a single source of truth for all styling values
 */

/**
 * Complete internal token type - all fields required
 */
export interface ThemeTokens {
    colors: {
        background: {
            modal: string;
            overlay: string;
            card: string;
            cardElevated: string;
            stickyHeader: string;
        };
        primary: {
            base: string;
            hover: string;
            active: string;
            disabled: string;
        };
        secondary: {
            base: string;
            hover: string;
            active: string;
        };
        tertiary: {
            base: string;
            hover: string;
            active: string;
        };
        text: {
            primary: string;
            secondary: string;
            tertiary: string;
            disabled: string;
        };
        border: {
            default: string;
            hover: string;
            focus: string;
            button: string;
        };
        success: string;
        error: string;
        warning: string;
    };
    buttons: {
        button: {
            bg: string;
            color: string;
            border: string;
        };
        loginButton: {
            bg: string;
            color: string;
            border: string;
        };
    };
    effects: {
        backdropFilter: {
            modal: string;
            overlay: string;
            stickyHeader: string;
        };
        glassOpacity: {
            modal: number;
            overlay: number;
            stickyHeader: number;
        };
    };
    fonts: {
        family: string;
        sizes: {
            small: string;
            medium: string;
            large: string;
        };
        weights: {
            normal: number;
            medium: number;
            bold: number;
        };
    };
    borders: {
        radius: {
            small: string;
            medium: string;
            large: string;
            xl: string;
            full: string;
        };
    };
}

/**
 * Developer-facing theme configuration
 * Simplified interface - only backgroundColor and textColor required
 * All other colors are automatically derived from these base colors
 */
export interface VechainKitThemeConfig {
    backgroundColor?: string;
    textColor?: string;
    overlayColor?: string; // Optional: customize overlay separately from modal background (deprecated, use overlay.backgroundColor)
    overlay?: {
        backgroundColor?: string; // Customize overlay background color
        blur?: string; // Customize overlay blur effect (e.g., "blur(10px)")
    };
    button?: {
        bg?: string;
        color?: string;
        border?: string; // Full CSS border string like "1px solid #color"
    };
    loginButton?: {
        bg?: string;
        color?: string;
        border?: string; // Full CSS border string like "1px solid #color"
    };
    effects?: {
        glass?: {
            enabled?: boolean;
            intensity?: 'low' | 'medium' | 'high';
        };
        backdropFilter?: {
            modal?: string; // Optional custom blur for modal
            overlay?: string; // Optional custom blur for overlay (deprecated, use overlay.blur)
        };
    };
}

/**
 * Convert hex color to rgba with opacity
 */
function hexToRgba(hex: string, opacity: number): string {
    // Remove # if present
    hex = hex.replace('#', '');

    // Parse hex values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

/**
 * Parse color string (hex, rgba, rgb, or named color) and return rgba with new opacity
 */
function applyOpacity(color: string, opacity: number): string {
    // If already rgba/rgb, extract RGB values and apply new opacity
    const rgbaMatch = color.match(
        /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/,
    );
    if (rgbaMatch) {
        return `rgba(${rgbaMatch[1]}, ${rgbaMatch[2]}, ${rgbaMatch[3]}, ${opacity})`;
    }

    // If hex, convert to rgba
    if (color.startsWith('#')) {
        return hexToRgba(color, opacity);
    }

    // Try to parse named colors or other formats by creating a temporary element
    // This handles CSS named colors like 'red', 'blue', etc.
    // Only works in browser environment (not SSR)
    if (
        typeof window !== 'undefined' &&
        typeof document !== 'undefined' &&
        document.body
    ) {
        try {
            const tempEl = document.createElement('div');
            tempEl.style.color = color;
            document.body.appendChild(tempEl);
            const computedColor = window.getComputedStyle(tempEl).color;
            document.body.removeChild(tempEl);

            // If we got a valid rgb/rgba color, extract and apply opacity
            const computedMatch = computedColor.match(
                /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/,
            );
            if (computedMatch) {
                return `rgba(${computedMatch[1]}, ${computedMatch[2]}, ${computedMatch[3]}, ${opacity})`;
            }
        } catch {
            // Fall through to fallback
        }
    }

    // Fallback: return as-is (for SSR or unsupported formats)
    // In practice, users should use hex or rgba colors
    return color;
}

/**
 * Derive background colors from base color with different opacities
 */
function deriveBackgroundColors(
    baseColor: string,
    darkMode: boolean,
    defaultOverlayColor: string,
    overlayColor?: string,
): ThemeTokens['colors']['background'] {
    // Use custom overlayColor if provided, otherwise use default overlay color
    // Never derive overlay from backgroundColor - always use default unless explicitly set
    const overlay = overlayColor || defaultOverlayColor;

    return {
        modal: baseColor, // 100% opacity
        card: applyOpacity(baseColor, 0.8),
        cardElevated: baseColor, // Same as modal for elevated
        overlay: overlay,
        stickyHeader: applyOpacity(baseColor, 0.9),
    };
}

/**
 * Derive secondary colors from background color with opacity
 */
function deriveSecondaryColors(
    baseColor: string,
    darkMode: boolean,
): ThemeTokens['colors']['secondary'] {
    // For dark mode, use white overlay; for light mode, use black overlay
    const overlayColor = darkMode ? '#ffffff' : '#000000';
    return {
        base: applyOpacity(overlayColor, 0.05),
        hover: applyOpacity(overlayColor, 0.1),
        active: applyOpacity(overlayColor, 0.15),
    };
}

/**
 * Derive tertiary colors from background color with opacity
 */
function deriveTertiaryColors(
    baseColor: string,
    darkMode: boolean,
): ThemeTokens['colors']['tertiary'] {
    const overlayColor = darkMode ? '#ffffff' : '#000000';
    return {
        base: 'transparent',
        hover: applyOpacity(overlayColor, 0.05),
        active: applyOpacity(overlayColor, 0.1),
    };
}

/**
 * Derive text colors from base text color with opacity
 */
function deriveTextColors(
    baseColor: string,
    darkMode: boolean,
): ThemeTokens['colors']['text'] {
    return {
        primary: baseColor,
        secondary: applyOpacity(baseColor, 0.7),
        tertiary: applyOpacity(baseColor, 0.5),
        disabled: darkMode ? '#4A5568' : '#A0AEC0',
    };
}

/**
 * Derive border colors from background color with low opacity
 */
function deriveBorderColors(
    baseColor: string,
    darkMode: boolean,
): ThemeTokens['colors']['border'] {
    const overlayColor = darkMode ? '#ffffff' : '#000000';
    return {
        default: applyOpacity(overlayColor, 0.1),
        hover: applyOpacity(overlayColor, 0.2),
        focus: darkMode ? '#3182CE' : '#2B6CB0',
        button: applyOpacity(overlayColor, 0.1),
    };
}

/**
 * Derive button styles from backgroundColor and textColor
 */
function deriveButtonStyles(
    backgroundColor: string | undefined,
    textColor: string | undefined,
    darkMode: boolean,
    customConfig: VechainKitThemeConfig['button'] | undefined,
    defaultTokens: ThemeTokens,
): ThemeTokens['buttons']['button'] {
    // Use custom config if provided
    if (customConfig) {
        return {
            bg: customConfig.bg || defaultTokens.buttons.button.bg,
            color: customConfig.color || defaultTokens.buttons.button.color,
            border: customConfig.border || defaultTokens.buttons.button.border,
        };
    }

    // Derive from backgroundColor and textColor if available
    if (backgroundColor && textColor) {
        const overlayColor = darkMode ? '#ffffff' : '#000000';
        return {
            bg: applyOpacity(overlayColor, 0.1), // Similar to secondary.base
            color: textColor,
            border: `1px solid ${applyOpacity(overlayColor, 0.1)}`, // Similar to border.button
        };
    }

    // Use defaults
    return defaultTokens.buttons.button;
}

/**
 * Derive login button styles
 */
function deriveLoginButtonStyles(
    backgroundColor: string | undefined,
    textColor: string | undefined,
    darkMode: boolean,
    customConfig: VechainKitThemeConfig['loginButton'] | undefined,
    defaultTokens: ThemeTokens,
): ThemeTokens['buttons']['loginButton'] {
    // Use custom config if provided
    if (customConfig) {
        return {
            bg: customConfig.bg || defaultTokens.buttons.loginButton.bg,
            color:
                customConfig.color || defaultTokens.buttons.loginButton.color,
            border:
                customConfig.border || defaultTokens.buttons.loginButton.border,
        };
    }

    // Use default login button styles (current hardcoded behavior)
    return defaultTokens.buttons.loginButton;
}

/**
 * Get glass effect settings based on intensity
 */
function getGlassEffectSettings(
    intensity: 'low' | 'medium' | 'high',
    enabled: boolean,
): {
    blur: string;
    modalOpacity: number;
    overlayOpacity: number;
    stickyHeaderOpacity: number;
} {
    // Default blur values (used when glass is disabled or as fallback)
    const defaultBlur = {
        modal: 'blur(3px)',
        overlay: 'blur(3px)',
        stickyHeader: 'blur(12px)',
    };

    if (!enabled) {
        return {
            blur: defaultBlur.modal, // Use default blur even when glass is disabled
            modalOpacity: 1,
            overlayOpacity: 0.4,
            stickyHeaderOpacity: 0.9,
        };
    }

    const settings = {
        low: {
            blur: 'blur(2px)',
            modalOpacity: 0.6,
            overlayOpacity: 0.3,
            stickyHeaderOpacity: 0.7,
        },
        medium: {
            blur: 'blur(3px)',
            modalOpacity: 0.7,
            overlayOpacity: 0.4,
            stickyHeaderOpacity: 0.8,
        },
        high: {
            blur: 'blur(5px)',
            modalOpacity: 0.8,
            overlayOpacity: 0.5,
            stickyHeaderOpacity: 0.85,
        },
    };

    return settings[intensity];
}

/**
 * Default tokens for light mode
 */
const defaultLightTokens: ThemeTokens = {
    colors: {
        background: {
            modal: '#ffffff',
            overlay: 'rgba(0, 0, 0, 0.4)',
            card: '#f5f5f5',
            cardElevated: '#ffffff',
            stickyHeader: 'rgba(255, 255, 255, 0.69)',
        },
        primary: {
            base: '#2B6CB0',
            hover: '#2C5282',
            active: '#2A4A6E',
            disabled: '#A0AEC0',
        },
        secondary: {
            base: 'rgba(0, 0, 0, 0.1)',
            hover: 'rgba(0, 0, 0, 0.15)',
            active: 'rgba(0, 0, 0, 0.20)',
        },
        tertiary: {
            base: 'transparent',
            hover: 'rgba(0, 0, 0, 0.05)',
            active: 'rgba(0, 0, 0, 0.1)',
        },
        text: {
            primary: '#2e2e2e',
            secondary: '#4d4d4d',
            tertiary: '#718096',
            disabled: '#A0AEC0',
        },
        border: {
            default: 'transparent',
            hover: '#d0d0d0',
            focus: '#2B6CB0',
            button: '#ebebeb',
        },
        success: '#10ba3e',
        error: '#ef4444',
        warning: '#F6AD55',
    },
    buttons: {
        button: {
            bg: 'rgba(0, 0, 0, 0.1)',
            color: '#2e2e2e',
            border: 'none',
        },
        loginButton: {
            bg: 'white',
            color: '#1a1a1a',
            border: '1px solid transparent',
        },
    },
    effects: {
        backdropFilter: {
            modal: 'blur(3px)',
            overlay: 'blur(3px)',
            stickyHeader: 'blur(12px)',
        },
        glassOpacity: {
            modal: 1,
            overlay: 0.4,
            stickyHeader: 0.69,
        },
    },
    fonts: {
        family: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        sizes: {
            small: '12px',
            medium: '14px',
            large: '16px',
        },
        weights: {
            normal: 400,
            medium: 500,
            bold: 700,
        },
    },
    borders: {
        radius: {
            small: '8px',
            medium: '12px',
            large: '16px',
            xl: '24px',
            full: '9999px',
        },
    },
};

/**
 * Default tokens for dark mode
 */
const defaultDarkTokens: ThemeTokens = {
    colors: {
        background: {
            modal: '#1f1f1e',
            overlay: 'rgba(0, 0, 0, 0.6)',
            card: 'rgba(0, 0, 0, 0.3)',
            cardElevated: '#2a2a2a',
            stickyHeader: 'rgba(31, 31, 30, 0.9)',
        },
        primary: {
            base: '#3182CE',
            hover: '#2B6CB0',
            active: '#2C5282',
            disabled: '#4A5568',
        },
        secondary: {
            base: 'rgba(255, 255, 255, 0.05)',
            hover: 'rgba(255, 255, 255, 0.1)',
            active: 'rgba(255, 255, 255, 0.15)',
        },
        tertiary: {
            base: 'transparent',
            hover: 'rgba(255, 255, 255, 0.05)',
            active: 'rgba(255, 255, 255, 0.1)',
        },
        text: {
            primary: 'rgb(223, 223, 221)',
            secondary: 'rgba(223, 223, 221, 0.6)',
            tertiary: 'rgba(223, 223, 221, 0.4)',
            disabled: 'rgba(223, 223, 221, 0.2)',
        },
        border: {
            default: 'rgba(255, 255, 255, 0.1)',
            hover: 'rgba(255, 255, 255, 0.2)',
            focus: '#3182CE',
            button: 'rgba(255, 255, 255, 0.1)',
        },
        success: '#00ff45de',
        error: '#ef4444',
        warning: '#F6AD55',
    },
    buttons: {
        button: {
            bg: 'rgba(255, 255, 255, 0.05)',
            color: 'rgb(223, 223, 221)',
            border: 'none',
        },
        loginButton: {
            bg: 'transparent',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.1)',
        },
    },
    effects: {
        backdropFilter: {
            modal: 'blur(3px)',
            overlay: 'blur(3px)',
            stickyHeader: 'blur(12px)',
        },
        glassOpacity: {
            modal: 1,
            overlay: 0.6,
            stickyHeader: 0.9,
        },
    },
    fonts: {
        family: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        sizes: {
            small: '12px',
            medium: '14px',
            large: '16px',
        },
        weights: {
            normal: 400,
            medium: 500,
            bold: 700,
        },
    },
    borders: {
        radius: {
            small: '8px',
            medium: '12px',
            large: '16px',
            xl: '24px',
            full: '9999px',
        },
    },
};

/**
 * Get default tokens for a given mode
 */
export const getDefaultTokens = (darkMode: boolean): ThemeTokens => {
    return darkMode ? defaultDarkTokens : defaultLightTokens;
};

/**
 * Deep merge utility for tokens
 * Merges custom tokens into default tokens, only including provided keys
 */
export function mergeTokens(
    defaultTokens: ThemeTokens,
    customTokens: Partial<ThemeTokens>,
): ThemeTokens {
    const merged: ThemeTokens = { ...defaultTokens };

    if (customTokens.colors) {
        merged.colors = {
            ...defaultTokens.colors,
            ...customTokens.colors,
        };

        if (customTokens.colors.background) {
            merged.colors.background = {
                ...defaultTokens.colors.background,
                ...customTokens.colors.background,
            };
        }

        if (customTokens.colors.primary) {
            merged.colors.primary = {
                ...defaultTokens.colors.primary,
                ...customTokens.colors.primary,
            };
        }

        if (customTokens.colors.secondary) {
            merged.colors.secondary = {
                ...defaultTokens.colors.secondary,
                ...customTokens.colors.secondary,
            };
        }

        if (customTokens.colors.tertiary) {
            merged.colors.tertiary = {
                ...defaultTokens.colors.tertiary,
                ...customTokens.colors.tertiary,
            };
        }

        if (customTokens.colors.text) {
            merged.colors.text = {
                ...defaultTokens.colors.text,
                ...customTokens.colors.text,
            };
        }

        if (customTokens.colors.border) {
            merged.colors.border = {
                ...defaultTokens.colors.border,
                ...customTokens.colors.border,
            };
            // Ensure button border defaults to default if not provided
            if (!customTokens.colors.border.button) {
                merged.colors.border.button =
                    defaultTokens.colors.border.button;
            }
        }
    }

    if (customTokens.effects) {
        merged.effects = {
            ...defaultTokens.effects,
            ...customTokens.effects,
        };

        if (customTokens.effects.backdropFilter) {
            merged.effects.backdropFilter = {
                ...defaultTokens.effects.backdropFilter,
                ...customTokens.effects.backdropFilter,
            };
        }

        if (customTokens.effects.glassOpacity) {
            merged.effects.glassOpacity = {
                ...defaultTokens.effects.glassOpacity,
                ...customTokens.effects.glassOpacity,
            };
        }
    }

    if (customTokens.fonts) {
        merged.fonts = {
            ...defaultTokens.fonts,
            ...customTokens.fonts,
        };

        if (customTokens.fonts.sizes) {
            merged.fonts.sizes = {
                ...defaultTokens.fonts.sizes,
                ...customTokens.fonts.sizes,
            };
        }

        if (customTokens.fonts.weights) {
            merged.fonts.weights = {
                ...defaultTokens.fonts.weights,
                ...customTokens.fonts.weights,
            };
        }
    }

    if (customTokens.borders) {
        merged.borders = {
            ...defaultTokens.borders,
            ...customTokens.borders,
        };

        if (customTokens.borders.radius) {
            merged.borders.radius = {
                ...defaultTokens.borders.radius,
                ...customTokens.borders.radius,
            };
        }
    }

    if (customTokens.buttons) {
        merged.buttons = {
            ...defaultTokens.buttons,
            ...customTokens.buttons,
        };

        if (customTokens.buttons.button) {
            merged.buttons.button = {
                ...defaultTokens.buttons.button,
                ...customTokens.buttons.button,
            };
        }

        if (customTokens.buttons.loginButton) {
            merged.buttons.loginButton = {
                ...defaultTokens.buttons.loginButton,
                ...customTokens.buttons.loginButton,
            };
        }
    }

    return merged;
}

/**
 * Convert developer-facing config to internal tokens
 * Derives all colors from backgroundColor and textColor
 */
export function convertThemeConfigToTokens(
    config: VechainKitThemeConfig | undefined,
    darkMode: boolean,
): Partial<ThemeTokens> {
    if (!config) {
        return {};
    }

    const tokens: Partial<ThemeTokens> = {};
    const defaultTokens = getDefaultTokens(darkMode);

    // Derive colors from backgroundColor and textColor
    // Always initialize colors if any color-related config is provided
    // Support both overlay.backgroundColor (new) and overlayColor (deprecated)
    const overlayBgColor =
        config.overlay?.backgroundColor || config.overlayColor;

    if (
        config.backgroundColor ||
        config.textColor ||
        overlayBgColor ||
        config.button ||
        config.loginButton
    ) {
        tokens.colors = {} as ThemeTokens['colors'];

        // Derive background colors from backgroundColor
        if (config.backgroundColor) {
            tokens.colors.background = deriveBackgroundColors(
                config.backgroundColor,
                darkMode,
                defaultTokens.colors.background.overlay, // Pass default overlay color
                overlayBgColor, // Use custom overlay backgroundColor if provided
            );
        } else if (overlayBgColor) {
            // If only overlay backgroundColor is provided, use defaults for other backgrounds
            const defaultBg = defaultTokens.colors.background;
            tokens.colors.background = {
                ...defaultBg,
                overlay: overlayBgColor,
            };
        } else {
            // Use defaults if no backgroundColor or overlay backgroundColor provided
            tokens.colors.background = defaultTokens.colors.background;
        }

        // Derive secondary and tertiary colors from backgroundColor
        if (config.backgroundColor) {
            tokens.colors.secondary = deriveSecondaryColors(
                config.backgroundColor,
                darkMode,
            );
            tokens.colors.tertiary = deriveTertiaryColors(
                config.backgroundColor,
                darkMode,
            );
        }

        // Derive text colors from textColor
        if (config.textColor) {
            tokens.colors.text = deriveTextColors(config.textColor, darkMode);
        }

        // Derive border colors from backgroundColor
        if (config.backgroundColor) {
            tokens.colors.border = deriveBorderColors(
                config.backgroundColor,
                darkMode,
            );
        }

        // Keep primary colors as defaults (or could derive from backgroundColor if needed)
        tokens.colors.primary = defaultTokens.colors.primary;

        // Keep error/success/warning as defaults
        tokens.colors.error = defaultTokens.colors.error;
        tokens.colors.success = defaultTokens.colors.success;
        tokens.colors.warning = defaultTokens.colors.warning;
    }

    // Handle glass effect settings
    // Always initialize effects to ensure they're always available
    tokens.effects = {} as ThemeTokens['effects'];

    if (config.effects) {
        const glassEnabled =
            config.effects.glass?.enabled !== undefined
                ? config.effects.glass.enabled
                : true;
        const glassIntensity = config.effects.glass?.intensity || 'medium';

        const glassSettings = getGlassEffectSettings(
            glassIntensity,
            glassEnabled,
        );

        // Apply glass effect to backdrop filters
        // When glass is disabled, use default blur values instead of 'none'
        // Overlay blur can be customized independently via overlay.blur (new) or effects.backdropFilter.overlay (deprecated)
        const overlayBlur =
            config.overlay?.blur || config.effects.backdropFilter?.overlay;

        tokens.effects.backdropFilter = {
            modal:
                config.effects.backdropFilter?.modal ||
                (glassEnabled
                    ? glassSettings.blur
                    : defaultTokens.effects.backdropFilter.modal),
            overlay:
                overlayBlur ||
                (glassEnabled
                    ? glassSettings.blur
                    : defaultTokens.effects.backdropFilter.overlay),
            stickyHeader: glassEnabled
                ? glassSettings.blur
                : defaultTokens.effects.backdropFilter.stickyHeader,
        };

        // Apply glass opacity to backgrounds if enabled
        // Note: overlay color is NOT affected by glass opacity - it uses overlayColor directly
        tokens.effects.glassOpacity = {
            modal: glassSettings.modalOpacity,
            overlay: glassSettings.overlayOpacity,
            stickyHeader: glassSettings.stickyHeaderOpacity,
        };

        // Update background colors with glass opacity if glass is enabled
        if (glassEnabled) {
            // Ensure colors.background is initialized
            if (!tokens.colors) {
                tokens.colors = {} as ThemeTokens['colors'];
            }
            if (!tokens.colors.background) {
                tokens.colors.background = {
                    ...defaultTokens.colors.background,
                };
            }

            if (config.backgroundColor) {
                // Use custom backgroundColor with glass opacity
                tokens.colors.background.modal = applyOpacity(
                    config.backgroundColor,
                    glassSettings.modalOpacity,
                );
                tokens.colors.background.stickyHeader = applyOpacity(
                    config.backgroundColor,
                    glassSettings.stickyHeaderOpacity,
                );
            } else {
                // Apply glass opacity to default background colors
                const defaultModalBg = defaultTokens.colors.background.modal;
                const defaultStickyHeaderBg =
                    defaultTokens.colors.background.stickyHeader;

                // Extract base color from default backgrounds and apply glass opacity
                // For rgba colors, we need to extract the RGB values and apply new opacity
                tokens.colors.background.modal = applyOpacity(
                    defaultModalBg,
                    glassSettings.modalOpacity,
                );
                tokens.colors.background.stickyHeader = applyOpacity(
                    defaultStickyHeaderBg,
                    glassSettings.stickyHeaderOpacity,
                );
            }
            // Overlay color is already set correctly from overlayColor or default
            // Don't modify it here
        }

        // Ensure overlay backgroundColor is always respected, even after glass effects
        // Support both overlay.backgroundColor (new) and overlayColor (deprecated)
        // overlayBgColor is already declared at the top of the function
        if (overlayBgColor && tokens.colors?.background) {
            tokens.colors.background.overlay = overlayBgColor;
        }
    } else {
        // If no effects config provided, use default backdrop filters
        // But still check for overlay.blur
        const overlayBlur = config.overlay?.blur;
        tokens.effects.backdropFilter = {
            ...defaultTokens.effects.backdropFilter,
            overlay:
                overlayBlur || defaultTokens.effects.backdropFilter.overlay,
        };
        tokens.effects.glassOpacity = defaultTokens.effects.glassOpacity;
    }

    // Ensure overlay backgroundColor is always respected, even if no effects config
    // Support both overlay.backgroundColor (new) and overlayColor (deprecated)
    // overlayBgColor is already declared at the top of the function
    if (overlayBgColor && tokens.colors?.background) {
        tokens.colors.background.overlay = overlayBgColor;
    }

    // Derive button styles
    tokens.buttons = {} as ThemeTokens['buttons'];
    tokens.buttons.button = deriveButtonStyles(
        config.backgroundColor,
        config.textColor,
        darkMode,
        config.button,
        defaultTokens,
    );
    tokens.buttons.loginButton = deriveLoginButtonStyles(
        config.backgroundColor,
        config.textColor,
        darkMode,
        config.loginButton,
        defaultTokens,
    );

    return tokens;
}
