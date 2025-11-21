# Theme Customization Guide

This guide explains how to customize the VeChain Kit theme to match your app's design.

## Quick Start

The theme system is designed to be simple - you only need to provide a base `backgroundColor` and `textColor`, and all other colors are automatically derived. You can optionally customize specific aspects like overlay, buttons, and glass effects.

```tsx
<VeChainKitProvider
    theme={{
        backgroundColor: isDarkMode ? '#1f1f1e' : '#ffffff',
        textColor: isDarkMode ? 'rgb(223, 223, 221)' : '#2e2e2e',
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            blur: 'blur(3px)',
        },
        buttons: {
            secondaryButton: {
                bg: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                border: 'none',
            },
        },
        effects: {
            glass: {
                enabled: true,
                intensity: 'low',
            },
        },
    }}
    // ... other props
>
    {children}
</VeChainKitProvider>
```

## Simplified API

The theme configuration has been simplified to focus on what matters most:

### Base Colors

-   **`backgroundColor`** (optional) - Base background color. Automatically derives:

    -   Modal background (100% opacity)
    -   Card background (80% opacity)
    -   Sticky header background (90% opacity)
    -   Secondary/tertiary colors (with opacity overlays)
    -   Border colors

-   **`textColor`** (optional) - Base text color. Automatically derives:
    -   Primary text (100% opacity)
    -   Secondary text (70% opacity)
    -   Tertiary text (50% opacity)

### Overlay Configuration

Customize the modal overlay independently:

```tsx
overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Overlay background color
    blur: 'blur(10px)', // Overlay blur effect
}
```

### Button Customization

Customize button styles for different button variants. All button configs are grouped under the `buttons` object:

**Secondary Buttons** (applies to all `vechainKitSecondary` buttons):

```tsx
buttons: {
    secondaryButton: {
        bg: 'rgba(255, 255, 255, 0.1)', // Background color
        color: '#ffffff', // Text color
        border: '1px solid rgba(255, 255, 255, 0.2)', // Border (full CSS string)
    },
}
```

**Primary Buttons** (applies to all `vechainKitPrimary` buttons):

```tsx
buttons: {
    primaryButton: {
        bg: '#3182CE', // Background color
        color: '#ffffff', // Text color
        border: 'none', // Border (full CSS string)
    },
}
```

**Tertiary Buttons** (applies to all `vechainKitTertiary` buttons):

```tsx
buttons: {
    tertiaryButton: {
        bg: 'transparent', // Background color
        color: '#ffffff', // Text color
        border: 'none', // Border (full CSS string)
    },
}
```

**Login Buttons** (applies to `loginIn` variant):

```tsx
buttons: {
    loginButton: {
        bg: 'transparent', // Background color
        color: '#ffffff', // Text color
        border: '1px solid rgba(255, 255, 255, 0.1)', // Border (full CSS string)
    },
}
```

You can customize multiple button types in one config:

```tsx
buttons: {
    secondaryButton: {
        bg: 'rgba(255, 255, 255, 0.1)',
        color: '#ffffff',
        border: 'none',
    },
    primaryButton: {
        bg: '#3182CE',
        color: '#ffffff',
        border: 'none',
    },
    loginButton: {
        bg: 'transparent',
        color: '#ffffff',
        border: '1px solid rgba(255, 255, 255, 0.1)',
    },
}
```

Hover and active states are handled automatically through opacity for all button types.

### Font Customization

Customize fonts used throughout VeChain Kit components:

```tsx
fonts: {
    family: 'Inter, sans-serif', // Font family (e.g., "Inter, sans-serif", "'Roboto', sans-serif")
    sizes: {
        small: '12px', // Font size for small text
        medium: '14px', // Font size for medium text
        large: '16px', // Font size for large text
    },
    weights: {
        normal: 400, // Normal font weight
        medium: 500, // Medium font weight
        bold: 700, // Bold font weight
    },
}
```

**Important**: Font customization only affects VeChain Kit components (modals, buttons, etc.) and does not leak to your host application. Fonts are scoped to VeChain Kit containers only.

You can customize any subset of font properties - unspecified values will use defaults:

```tsx
// Only customize font family
fonts: {
    family: 'Inter, sans-serif',
}

// Only customize font sizes
fonts: {
    sizes: {
        medium: '15px',
        large: '18px',
    },
}
```

### Glass Effects

Enable and configure glass morphism effects:

```tsx
effects: {
    glass: {
        enabled: true, // Enable glass effects
        intensity: 'low' | 'medium' | 'high', // Glass intensity
    },
    backdropFilter: {
        modal: 'blur(15px)', // Optional: override modal blur
        // overlay blur is set via overlay.blur
    },
}
```

When glass is enabled, the system automatically:

-   Applies appropriate blur values based on intensity
-   Adjusts background opacities for glass morphism effect
-   Maintains readability across all surfaces

**Glass Intensity Settings:**

-   `low`: `blur(2px)`, modal opacity 0.6, sticky header opacity 0.7
-   `medium`: `blur(3px)`, modal opacity 0.7, sticky header opacity 0.8
-   `high`: `blur(5px)`, modal opacity 0.8, sticky header opacity 0.85

## Complete Example

Here's a complete example with glass effects:

```tsx
import type { VechainKitThemeConfig } from '@vechain/vechain-kit';

const theme: VechainKitThemeConfig = {
    backgroundColor: isDarkMode ? '#1f1f1e' : '#ffffff',
    textColor: isDarkMode ? 'rgb(223, 223, 221)' : '#2e2e2e',
    overlay: {
        backgroundColor: isDarkMode
            ? 'rgba(0, 0, 0, 0.6)'
            : 'rgba(0, 0, 0, 0.4)',
        blur: 'blur(3px)',
    },
    buttons: {
        secondaryButton: {
            bg: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.1)',
            color: isDarkMode ? 'rgb(223, 223, 221)' : '#2e2e2e',
            border: 'none',
        },
        primaryButton: {
            bg: isDarkMode ? '#3182CE' : '#2B6CB0',
            color: 'white',
            border: 'none',
        },
        loginButton: {
            bg: 'transparent',
            color: isDarkMode ? 'white' : '#1a1a1a',
            border: isDarkMode
                ? '1px solid rgba(255, 255, 255, 0.1)'
                : '1px solid #ebebeb',
        },
    },
    fonts: {
        family: 'Inter, sans-serif',
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
    effects: {
        glass: {
            enabled: true,
            intensity: 'low',
        },
    },
};

<VeChainKitProvider theme={theme} {...otherProps}>
    {children}
</VeChainKitProvider>;
```

## How It Works

1. **Simplified Input**: You provide only `backgroundColor` and `textColor`
2. **Automatic Derivation**: The system derives all other colors (secondary, tertiary, borders) with appropriate opacity
3. **Token System**: Your config is converted to internal `ThemeTokens`
4. **Semantic Tokens**: Tokens are exposed as Chakra semantic tokens (e.g., `vechain-kit-modal`)
5. **Component Usage**: Components use `useToken()` to access semantic tokens
6. **CSS Variables**: DAppKit and Privy CSS variables are generated from tokens
7. **Automatic Sync**: All modals (VeChain Kit, DAppKit, Privy) derive from the same tokens

## Color Derivation

When you provide `backgroundColor`:

-   **Modal**: Uses `backgroundColor` at 100% opacity
-   **Card**: Uses `backgroundColor` at 80% opacity
-   **Sticky Header**: Uses `backgroundColor` at 90% opacity
-   **Secondary Colors**: Derived from white (dark mode) or black (light mode) overlays with opacity
-   **Borders**: Derived from white (dark mode) or black (light mode) overlays with low opacity

When you provide `textColor`:

-   **Primary Text**: Uses `textColor` at 100% opacity
-   **Secondary Text**: Uses `textColor` at 70% opacity
-   **Tertiary Text**: Uses `textColor` at 50% opacity

## Glass Effects

When glass effects are enabled:

-   Background colors automatically get reduced opacity based on intensity
-   Blur values are applied to modal, overlay, and sticky header
-   The system ensures readability while maintaining the glass aesthetic

If glass is disabled, default blur values are still applied (not removed).

## Partial Configuration

You only need to specify the values you want to customize. All other values will use sensible defaults:

```tsx
// Minimal config - just enable glass effects
theme={{
    effects: {
        glass: {
            enabled: true,
            intensity: 'medium',
        },
    },
}}

// Customize overlay only
theme={{
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        blur: 'blur(5px)',
    },
}}

// Customize secondary buttons only
theme={{
    buttons: {
        secondaryButton: {
            bg: '#6366f1',
            color: '#ffffff',
            border: 'none',
        },
    },
}}

// Customize primary buttons only
theme={{
    buttons: {
        primaryButton: {
            bg: '#3182CE',
            color: '#ffffff',
            border: 'none',
        },
    },
}}

// Customize fonts only
theme={{
    fonts: {
        family: 'Inter, sans-serif',
    },
}}
```

## TypeScript Support

Import the type for full autocomplete:

```tsx
import type { VechainKitThemeConfig } from '@vechain/vechain-kit';

const myTheme: VechainKitThemeConfig = {
    backgroundColor: '#ffffff',
    textColor: '#2e2e2e',
    // ... your config
};
```

## Conditional Styling

The sticky header automatically becomes transparent when there's no content below it, and applies the configured background + blur when content is detected. This is handled automatically by `StickyHeaderContainer`.

## Default Behavior

If you don't provide a theme config, the system uses default colors:

-   **Light Mode**: White backgrounds, dark text
-   **Dark Mode**: Dark backgrounds (`#1f1f1e`), light text (`rgb(223, 223, 221)`)
-   **Default Blur**: `blur(3px)` for modal and overlay, `blur(12px)` for sticky header
-   **Default Overlay**: `rgba(0, 0, 0, 0.4)` (light) or `rgba(0, 0, 0, 0.6)` (dark)
