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
    effects?: {
        glass?: {
            enabled?: boolean;
            intensity?: 'low' | 'medium' | 'high';
        };
        backdropFilter?: {
            modal?: string; // Optional custom blur for modal
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
 * Parse color string (hex or rgba) and return rgba with new opacity
 */
function applyOpacity(color: string, opacity: number): string {
    // If already rgba, extract RGB values and apply new opacity
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

    // Fallback: return as-is
    return color;
}

/**
 * Derive background colors from base color with different opacities
 */
function deriveBackgroundColors(
    baseColor: string,
    darkMode: boolean,
): ThemeTokens['colors']['background'] {
    return {
        modal: baseColor, // 100% opacity
        card: applyOpacity(baseColor, 0.8),
        cardElevated: baseColor, // Same as modal for elevated
        overlay: darkMode ? applyOpacity(baseColor, 0.4) : 'rgba(0, 0, 0, 0.4)', // Overlay uses black in light mode
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
    if (!enabled) {
        return {
            blur: 'none',
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
            base: 'rgba(0, 0, 0, 0.05)',
            hover: 'rgba(0, 0, 0, 0.1)',
            active: 'rgba(0, 0, 0, 0.15)',
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
            card: '#1c1c1b',
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
            primary: '#dfdfdd',
            secondary: '#b0b0b0',
            tertiary: '#718096',
            disabled: '#4A5568',
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
    if (config.backgroundColor || config.textColor) {
        tokens.colors = {} as ThemeTokens['colors'];

        // Derive background colors from backgroundColor
        if (config.backgroundColor) {
            tokens.colors.background = deriveBackgroundColors(
                config.backgroundColor,
                darkMode,
            );
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
    if (config.effects) {
        tokens.effects = {} as ThemeTokens['effects'];

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
        tokens.effects.backdropFilter = {
            modal: config.effects.backdropFilter?.modal || glassSettings.blur,
            overlay: glassSettings.blur,
            stickyHeader: glassSettings.blur,
        };

        // Apply glass opacity to backgrounds if enabled
        if (glassEnabled && config.backgroundColor) {
            tokens.effects.glassOpacity = {
                modal: glassSettings.modalOpacity,
                overlay: glassSettings.overlayOpacity,
                stickyHeader: glassSettings.stickyHeaderOpacity,
            };

            // Update background colors with glass opacity
            if (tokens.colors?.background) {
                tokens.colors.background.modal = applyOpacity(
                    config.backgroundColor,
                    glassSettings.modalOpacity,
                );
                tokens.colors.background.stickyHeader = applyOpacity(
                    config.backgroundColor,
                    glassSettings.stickyHeaderOpacity,
                );
            }
        } else {
            tokens.effects.glassOpacity = defaultTokens.effects.glassOpacity;
        }
    }

    return tokens;
}
