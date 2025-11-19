# Theme Customization Guide

This guide explains how to customize the VeChain Kit theme to match your app's design.

## Quick Start

Pass a `theme` prop to `VeChainKitProvider`:

```tsx
<VeChainKitProvider
  theme={{
    colors: {
      primary: '#6366f1',
      background: {
        modal: 'rgba(99, 102, 241, 0.1)',
        overlay: 'rgba(0, 0, 0, 0.5)',
      },
    },
    effects: {
      backdropFilter: {
        modal: 'blur(15px)',
        overlay: 'blur(2px)',
        stickyHeader: 'blur(15px)',
      },
    },
  }}
  // ... other props
>
  {children}
</VeChainKitProvider>
```

## Glass Effect Theme Example

Here's a complete example matching your tested glass effect configuration:

```tsx
const glassTheme: VechainKitThemeConfig = {
  colors: {
    background: {
      // Modal with glass effect (40% opacity)
      modal: isDarkMode
        ? 'rgba(21, 21, 21, 0.4)'
        : 'rgba(255, 255, 255, 0.4)',
      // Overlay colors
      overlay: isDarkMode ? '#00000026' : '#00000024',
      // Card backgrounds
      card: isDarkMode ? 'rgba(21, 21, 21, 0.4)' : 'rgba(255, 255, 255, 0.4)',
      cardElevated: isDarkMode
        ? 'rgba(21, 21, 21, 0.6)'
        : 'rgba(255, 255, 255, 0.6)',
      // Sticky header (conditional - transparent when no content below)
      stickyHeader: isDarkMode
        ? 'rgba(21, 21, 21, 0.6)'
        : 'rgba(255, 255, 255, 0.6)',
    },
    // DAppKit primary colors (for wallet cards)
    primary: isDarkMode
      ? {
          base: 'rgba(21, 21, 21, 0.4)',
          hover: 'rgba(255, 255, 255, 0.05)',
          active: 'rgba(255, 255, 255, 0.1)',
        }
      : {
          base: 'rgba(255, 255, 255, 0.4)',
          hover: 'rgba(248, 248, 248, 0.5)',
          active: 'rgba(240, 240, 240, 0.6)',
        },
    // DAppKit secondary colors
    secondary: isDarkMode
      ? {
          base: 'rgba(21, 21, 21, 0.6)',
          hover: 'rgba(21, 21, 21, 0.7)',
          active: 'rgba(21, 21, 21, 0.8)',
        }
      : {
          base: 'rgba(255, 255, 255, 0.6)',
          hover: 'rgba(255, 255, 255, 0.7)',
          active: 'rgba(255, 255, 255, 0.8)',
        },
    border: {
      default: isDarkMode ? '#ffffff0a' : '#ebebeb',
    },
  },
  effects: {
    backdropFilter: {
      modal: 'blur(15px)', // Modal backdrop blur
      overlay: 'blur(2px)', // Overlay backdrop blur
      stickyHeader: 'blur(15px)', // Sticky header blur when hasContentBelow
    },
  },
};
```

## Configuration Structure

### Colors

#### Background Colors
- `background.modal` - Main modal background color
- `background.overlay` - Modal overlay/backdrop color
- `background.card` - Card component background
- `background.cardElevated` - Elevated card background
- `background.stickyHeader` - Sticky header background (used when content is below)

#### Primary Colors
Can be a simple string or an object with states:
```tsx
// Simple (same color for all states)
primary: '#6366f1'

// With states
primary: {
  base: '#6366f1',
  hover: '#4f46e5',
  active: '#4338ca',
  disabled: '#a5b4fc',
}
```

#### Secondary & Tertiary Colors
Same format as primary - string or object with states.

#### Text Colors
- `text.primary` - Main text color
- `text.secondary` - Secondary text color
- `text.tertiary` - Tertiary/placeholder text color

#### Border Colors
- `border.default` - Default border color
- `border.hover` - Border color on hover
- `border.focus` - Border color on focus

#### Semantic Colors
- `success` - Success state color
- `error` - Error state color
- `warning` - Warning state color

### Effects

#### Backdrop Filters
Control blur effects for different surfaces:
- `effects.backdropFilter.modal` - Blur for modal dialog
- `effects.backdropFilter.overlay` - Blur for modal overlay
- `effects.backdropFilter.stickyHeader` - Blur for sticky header

Example:
```tsx
effects: {
  backdropFilter: {
    modal: 'blur(15px)',
    overlay: 'blur(2px)',
    stickyHeader: 'blur(15px)',
  },
}
```

#### Glass Opacity (Optional)
Control opacity values for glass effects:
- `effects.glassOpacity.modal`
- `effects.glassOpacity.overlay`
- `effects.glassOpacity.stickyHeader`

### Fonts

```tsx
fonts: {
  family: 'Your Font Family',
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
}
```

### Borders

```tsx
borders: {
  radius: {
    small: '8px',
    medium: '12px',
    large: '16px',
    xl: '24px',
    full: '9999px',
  },
}
```

## How It Works

1. **Token System**: Your config is converted to internal `ThemeTokens`
2. **Semantic Tokens**: Tokens are exposed as Chakra semantic tokens (e.g., `vechain-kit-modal`)
3. **Component Usage**: Components use `useToken()` to access semantic tokens
4. **CSS Variables**: DAppKit and Privy CSS variables are generated from tokens
5. **Automatic Sync**: All modals (VeChain Kit, DAppKit, Privy) derive from the same tokens

## Conditional Styling

The sticky header automatically becomes transparent when there's no content below it, and applies the configured background + blur when content is detected. This is handled automatically by `StickyHeaderContainer`.

## Partial Configuration

You only need to specify the values you want to override. All other values will use defaults:

```tsx
// Only override modal background
theme={{
  colors: {
    background: {
      modal: 'rgba(99, 102, 241, 0.1)',
    },
  },
}}
```

## TypeScript Support

Import the type for full autocomplete:

```tsx
import type { VechainKitThemeConfig } from '@vechain/vechain-kit';

const myTheme: VechainKitThemeConfig = {
  // ... your config
};
```

