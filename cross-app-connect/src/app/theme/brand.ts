/**
 * Design tokens mirror the defaults used by `@vechain/vechain-kit` so the
 * whitelabel host's UI feels native next to consumer dApps. The source of
 * truth is `packages/vechain-kit/src/theme/tokens.ts` (defaultLightTokens
 * / defaultDarkTokens) -- keep them in sync if the kit's defaults shift.
 *
 * Brand identity comes from the VeChain wordmark / VeChain purple chip,
 * not from a brand-colored primary button -- the kit deliberately uses
 * monochrome buttons (dark in light mode, white in dark mode) with a
 * blue accent for spinners / focus rings.
 */
export const tokens = {
    light: {
        modalBg: '#FFFFFF',
        cardBg: '#F5F5F5',
        cardElevatedBg: '#FFFFFF',
        textPrimary: '#2E2E2E',
        textSecondary: '#4D4D4D',
        textTertiary: '#718096',
        borderDefault: 'transparent',
        borderButton: '#EBEBEB',
        borderHover: '#D0D0D0',
        loginBtnBg: '#FFFFFF',
        loginBtnColor: '#1A1A1A',
        loginBtnHoverBg: '#F0F0F0',
        primaryBtnBg: '#272A2E',
        primaryBtnColor: '#FFFFFF',
        accent: '#3B82F6',
        chipBg: 'rgba(114, 102, 255, 0.12)',
        chipText: '#5B50CC',
    },
    dark: {
        modalBg: '#151515',
        cardBg: 'rgba(255, 255, 255, 0.04)',
        cardElevatedBg: '#2A2A2A',
        textPrimary: 'rgb(223, 223, 221)',
        textSecondary: 'rgba(223, 223, 221, 0.6)',
        textTertiary: 'rgba(223, 223, 221, 0.4)',
        borderDefault: 'rgba(255, 255, 255, 0.1)',
        borderButton: 'rgba(255, 255, 255, 0.1)',
        borderHover: 'rgba(255, 255, 255, 0.2)',
        loginBtnBg: 'transparent',
        loginBtnColor: '#FFFFFF',
        loginBtnHoverBg: 'rgba(255, 255, 255, 0.05)',
        primaryBtnBg: '#FFFFFF',
        primaryBtnColor: 'rgba(0, 0, 0, 0.9)',
        accent: '#60A5FA',
        chipBg: 'rgba(114, 102, 255, 0.2)',
        chipText: '#B9B0FF',
    },
    fontHeading: `"Satoshi", "Inter", system-ui, -apple-system, sans-serif`,
    fontBody: `"Inter", system-ui, -apple-system, sans-serif`,
    radius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        full: '9999px',
    },
} as const;
