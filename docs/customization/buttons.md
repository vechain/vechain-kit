# Buttons

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
