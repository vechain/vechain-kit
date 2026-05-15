/**
 * VeChain brand tokens lifted from the official brand guidelines
 * (https://files.vechain.org/branding). Use these instead of ad-hoc colors so
 * the host can be re-themed by swapping a single file.
 */
export const brand = {
    // Core palette
    purple: '#7266FF', // VeChain Purple (from the official logo SVG accent)
    darkPurple: '#0C0A1F', // Dark Purple background
    coolGray: '#F0F0F5',
    almostWhite: '#FCFCFD',

    // Derived purple tints
    purpleSoft: '#EFEDFF', // very light tint for hover bg on light mode
    purpleDeep: '#5B50CC', // hover/active variant for dark mode

    // Font stacks (Satoshi for headings, Inter for body)
    fontHeading: `"Satoshi", "Inter", system-ui, -apple-system, sans-serif`,
    fontBody: `"Inter", system-ui, -apple-system, sans-serif`,

    radius: {
        button: '12px',
        card: '20px',
        chip: '999px',
    },
} as const;
