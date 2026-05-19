import type { ButtonProps } from '@chakra-ui/react';

/**
 * The "recommended provider" style — filled with inverted contrast against
 * the modal surface (dark on light mode, white on dark mode). Originally
 * baked into `VeWorldButton`, now shared so it can move to whichever method
 * is first in `loginMethods` (the kit treats the first entry as the primary
 * CTA, regardless of which provider it is).
 *
 * Intentionally does NOT consume `theme.buttons.primaryButton.{bg,color}`
 * — devs who themed their primary button (e.g. brand blue) shouldn't end
 * up with a blue Google or Apple button. The brand glyph + label have to
 * stay recognisable.
 */
export const primaryButtonStyle = (isDark: boolean): ButtonProps => {
    const bg = isDark ? '#ffffff' : '#0E0D18';
    const color = isDark ? '#0E0D18' : '#ffffff';
    return {
        bg,
        color,
        border: 'none',
        _hover: { bg, opacity: 0.92 },
    };
};
