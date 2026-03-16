import { ThemeTokens } from './tokens';

const MODAL_ANATOMY_KEYS = [
    'overlay',
    'dialogContainer',
    'dialog',
    'header',
    'closeButton',
    'body',
    'footer',
] as const;

const definePartsStyle = <T>(config: T): T => config;
const defineMultiStyleConfig = <T extends object>(
    config: T,
): T & { parts: readonly string[] } => ({
    parts: MODAL_ANATOMY_KEYS,
    ...config,
});

const getModalVariants = (tokens: ThemeTokens) => ({
    vechainKitBase: definePartsStyle({
        dialog: {
            scrollbarWidth: 'none',
            overflow: 'scroll',
            overflowX: 'hidden',
            rounded: tokens.modal.rounded ?? tokens.borders.radius.modal,
            backgroundColor: tokens.colors.background.modal,
            backdropFilter: tokens.effects.backdropFilter.modal,
            border: tokens.colors.border.modal,
        },
        overlay: {
            backgroundColor: tokens.colors.background.overlay,
            backdropFilter: tokens.effects.backdropFilter.overlay,
        },
        closeButton: {
            borderRadius: tokens.borders.radius.full,
            color: tokens.colors.text.primary,
            _hover: {
                ...(tokens.buttons.button.hoverBg
                    ? { bg: tokens.buttons.button.hoverBg }
                    : { opacity: 0.8 }),
            },
            _active: {
                bg: tokens.buttons.button.bg,
                opacity: 0.8,
            },
        },
        header: {
            w: 'full',
            color: tokens.colors.text.primary,
            fontSize: tokens.fonts.sizes.large,
            fontWeight: tokens.fonts.weights.bold,
            textAlign: 'center',
            paddingBottom: 5,
            paddingTop: 5,
        },
    }),
});

export const getModalTheme = (tokens: ThemeTokens) =>
    defineMultiStyleConfig({
        variants: getModalVariants(tokens),
        defaultProps: {
            variant: 'vechainKitBase',
        },
    });
