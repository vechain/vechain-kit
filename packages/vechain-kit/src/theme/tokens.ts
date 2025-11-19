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
 * All fields are optional - only provided values will override defaults
 */
export interface VechainKitThemeConfig {
    colors?: {
        primary?:
            | string
            | {
                  base: string;
                  hover?: string;
                  active?: string;
                  disabled?: string;
              };
        secondary?:
            | string
            | {
                  base: string;
                  hover?: string;
                  active?: string;
              };
        tertiary?: string;
        background?: {
            modal?: string;
            overlay?: string;
            card?: string;
            cardElevated?: string;
            stickyHeader?: string;
        };
        text?: {
            primary?: string;
            secondary?: string;
            tertiary?: string;
        };
        border?: {
            default?: string;
            hover?: string;
            focus?: string;
        };
        success?: string;
        error?: string;
        warning?: string;
    };
    effects?: {
        backdropFilter?: {
            modal?: string;
            overlay?: string;
            stickyHeader?: string;
        };
        glassOpacity?: {
            modal?: number;
            overlay?: number;
            stickyHeader?: number;
        };
    };
    fonts?: {
        family?: string;
        sizes?: {
            small?: string;
            medium?: string;
            large?: string;
        };
        weights?: {
            normal?: number;
            medium?: number;
            bold?: number;
        };
    };
    borders?: {
        radius?: {
            small?: string;
            medium?: string;
            large?: string;
            xl?: string;
            full?: string;
        };
    };
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
            default: '#ebebeb',
            hover: '#d0d0d0',
            focus: '#2B6CB0',
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
 * Only includes keys that are actually provided
 */
export function convertThemeConfigToTokens(
    config: VechainKitThemeConfig | undefined,
    darkMode: boolean,
): Partial<ThemeTokens> {
    if (!config) {
        return {};
    }

    const tokens: Partial<ThemeTokens> = {};

    if (config.colors) {
        tokens.colors = {} as ThemeTokens['colors'];

        if (config.colors.background) {
            tokens.colors.background = {
                ...config.colors.background,
            } as ThemeTokens['colors']['background'];
        }

        if (config.colors.primary) {
            // Handle both string (simple) and object (with hover/active) formats
            if (typeof config.colors.primary === 'string') {
                tokens.colors.primary = {
                    base: config.colors.primary,
                    hover: config.colors.primary,
                    active: config.colors.primary,
                    disabled: darkMode ? '#4A5568' : '#A0AEC0',
                };
            } else {
                tokens.colors.primary = {
                    base: config.colors.primary.base || '',
                    hover:
                        config.colors.primary.hover ||
                        config.colors.primary.base ||
                        '',
                    active:
                        config.colors.primary.active ||
                        config.colors.primary.base ||
                        '',
                    disabled:
                        config.colors.primary.disabled ||
                        (darkMode ? '#4A5568' : '#A0AEC0'),
                };
            }
        }

        if (config.colors.secondary) {
            if (typeof config.colors.secondary === 'string') {
                tokens.colors.secondary = {
                    base: config.colors.secondary,
                    hover: config.colors.secondary,
                    active: config.colors.secondary,
                };
            } else {
                tokens.colors.secondary = {
                    base: config.colors.secondary.base || '',
                    hover:
                        config.colors.secondary.hover ||
                        config.colors.secondary.base ||
                        '',
                    active:
                        config.colors.secondary.active ||
                        config.colors.secondary.base ||
                        '',
                };
            }
        }

        if (config.colors.tertiary) {
            if (typeof config.colors.tertiary === 'string') {
                // Simple string format - apply to all states
                tokens.colors.tertiary = {
                    base: config.colors.tertiary,
                    hover: config.colors.tertiary,
                    active: config.colors.tertiary,
                };
            } else {
                // Object format with states
                tokens.colors.tertiary = {
                    base: config.colors.tertiary.base || '',
                    hover:
                        config.colors.tertiary.hover ||
                        config.colors.tertiary.base ||
                        '',
                    active:
                        config.colors.tertiary.active ||
                        config.colors.tertiary.base ||
                        '',
                };
            }
        }

        if (config.colors.text) {
            tokens.colors.text = {
                ...config.colors.text,
            } as ThemeTokens['colors']['text'];
        }

        if (config.colors.border) {
            tokens.colors.border = {
                default: config.colors.border.default || '',
                hover: config.colors.border.hover || '',
                focus: config.colors.border.focus || '',
            };
        }

        if (config.colors.success) {
            tokens.colors.success = config.colors.success;
        }

        if (config.colors.error) {
            tokens.colors.error = config.colors.error;
        }

        if (config.colors.warning) {
            tokens.colors.warning = config.colors.warning;
        }
    }

    if (config.effects) {
        tokens.effects = {
            ...config.effects,
        } as ThemeTokens['effects'];

        if (config.effects.backdropFilter) {
            tokens.effects.backdropFilter = {
                ...config.effects.backdropFilter,
            } as ThemeTokens['effects']['backdropFilter'];
        }

        if (config.effects.glassOpacity) {
            tokens.effects.glassOpacity = {
                ...config.effects.glassOpacity,
            } as ThemeTokens['effects']['glassOpacity'];
        }
    }

    if (config.fonts) {
        tokens.fonts = {
            ...config.fonts,
        } as ThemeTokens['fonts'];

        if (config.fonts.sizes) {
            tokens.fonts.sizes = {
                ...config.fonts.sizes,
            } as ThemeTokens['fonts']['sizes'];
        }

        if (config.fonts.weights) {
            tokens.fonts.weights = {
                ...config.fonts.weights,
            } as ThemeTokens['fonts']['weights'];
        }
    }

    if (config.borders) {
        tokens.borders = {
            ...config.borders,
        } as ThemeTokens['borders'];

        if (config.borders.radius) {
            tokens.borders.radius = {
                ...config.borders.radius,
            } as ThemeTokens['borders']['radius'];
        }
    }

    return tokens;
}
