import { ThemeTokens } from './tokens';

const POPOVER_ANATOMY_KEYS = [
    'content',
    'header',
    'body',
    'footer',
    'popper',
    'arrow',
    'closeButton',
] as const;

const definePartsStyle = <T>(config: T): T => config;
const defineMultiStyleConfig = <T extends object>(
    config: T,
): T & { parts: readonly string[] } => ({
    parts: POPOVER_ANATOMY_KEYS,
    ...config,
});

const getPopoverVariants = (tokens: ThemeTokens) => ({
    vechainKitBase: definePartsStyle({
        popper: {
            zIndex: 1000,
        },
        content: {
            borderRadius: tokens.borders.radius.xl,
            border: tokens.colors.border.modal,
            backgroundColor: tokens.colors.background.modal,
            backdropFilter: tokens.effects.backdropFilter.modal,
            boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.12)',
            minWidth: '380px',
        },
        body: {
            padding: '16px',
        },
    }),
});

export const getPopoverTheme = (tokens: ThemeTokens) =>
    defineMultiStyleConfig({
        variants: getPopoverVariants(tokens),
        defaultProps: {
            variant: 'vechainKitBase',
        },
    });
