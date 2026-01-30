# Fonts

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
