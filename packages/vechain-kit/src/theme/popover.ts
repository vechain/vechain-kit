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
            // Tighter than the modal — popovers anchor next to a trigger and
            // don't need the full 380px the modal uses.
            width: '320px',
            minWidth: '320px',
        },
        body: {
            padding: '12px',
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
