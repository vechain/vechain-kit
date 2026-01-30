# Theming

This guide explains how to customize the VeChain Kit theme to match your app's design.

### Quick Start

The theme system is designed to be simple - you only need to provide a base `modal.backgroundColor` and `textColor`, and all other colors are automatically derived. You can optionally customize specific aspects like overlay, buttons, and glass effects.

```tsx
<VeChainKitProvider
    theme={{
        modal: {
            backgroundColor: isDarkMode ? '#1f1f1e' : '#ffffff',
        },
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

### Simplified API

The theme configuration has been simplified to focus on what matters most:

#### Base Colors

* **`modal.backgroundColor`** (optional) - Base background color for the modal. Automatically derives:
  * Modal background (100% opacity)
  * Card background (80% opacity)
  * Sticky header background (90% opacity)
  * Secondary/tertiary colors (with opacity overlays)
  * Border colors
* **`textColor`** (optional) - Base text color. Automatically derives:
  * Primary text (100% opacity)
  * Secondary text (70% opacity)
  * Tertiary text (50% opacity)

#### Overlay Configuration

Customize the modal overlay independently:

```tsx
overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Overlay background color
    blur: 'blur(10px)', // Overlay blur effect
}
```

### Complete Example

Here's a complete example with glass effects:

```tsx
import type { VechainKitThemeConfig } from '@vechain/vechain-kit';

const theme: VechainKitThemeConfig = {
    modal: {
        backgroundColor: isDarkMode ? '#1f1f1e' : '#ffffff',
        border: "1px solid #00000",
        // backdropFilter?: string; // Backdrop filter for modal dialog (e.g., "blur(10px)")
        // borderRadius?: string; // Modal dialog border radius (e.g., "24px", "1rem") - deprecated, use rounded instead
        // rounded?: string | number; // Border radius (Chakra UI rounded prop: "sm", "md", "lg", "xl", "2xl", "3xl", "full", or number)
    },
    textColor: isDarkMode ? 'rgb(223, 223, 221)' : '#2e2e2e',
    overlay: {
        backgroundColor: isDarkMode
            ? 'rgba(0, 0, 0, 0.6)'
            : 'rgba(0, 0, 0, 0.4)',
        blur: 'blur(3px)',
    },
    buttons: {
        primaryButton: {
            bg: isDarkMode ? '#3182CE' : '#2B6CB0',
            color: 'white',
            border: 'none',
        },    
        secondaryButton: {
            bg: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.1)',
            color: isDarkMode ? 'rgb(223, 223, 221)' : '#2e2e2e',
            border: 'none',
            // backdropFilter?: string; // Optional backdrop filter (e.g., "blur(10px)")
            // rounded?: string | number; // Border radius (Chakra UI rounded prop: "sm", "md", "lg", "xl", "2xl", "3xl", "full", or number)
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
