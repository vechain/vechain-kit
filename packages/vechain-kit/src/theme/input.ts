import {
    defineStyle,
    defineStyleConfig,
    createMultiStyleConfigHelpers,
} from '@chakra-ui/react';
import { inputAnatomy } from '@chakra-ui/anatomy';

/**
 * Force a 16px font size on form inputs so mobile Safari doesn't
 * auto-zoom on focus. iOS zooms the page whenever a focused input's
 * computed font-size is below 16px CSS pixels — and the kit's `md`
 * font token resolves to 14px (see tokens.ts), so the Chakra default
 * Input/Textarea would land at 14px and trigger the zoom. We pin the
 * size in absolute pixels rather than `lg` so future token tweaks
 * can't accidentally regress this.
 */
const { definePartsStyle, defineMultiStyleConfig } =
    createMultiStyleConfigHelpers(inputAnatomy.keys);

export const getInputTheme = () =>
    defineMultiStyleConfig({
        baseStyle: definePartsStyle({
            field: {
                fontSize: '16px',
            },
        }),
    });

export const getTextareaTheme = () =>
    defineStyleConfig({
        baseStyle: defineStyle({
            fontSize: '16px',
        }),
    });
