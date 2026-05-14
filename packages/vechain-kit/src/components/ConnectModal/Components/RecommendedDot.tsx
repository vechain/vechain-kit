import { Box } from '@chakra-ui/react';

// Brand green from the design system. Reserved for the recommended-provider
// indicator only — do not reuse for other status surfaces.
const DOT_COLOR = '#16a34a';

/**
 * 6px green dot with a 3px halo (18% alpha). Lives in the trailing slot of
 * the primary VeWorld button.
 */
export const RecommendedDot = () => (
    <Box
        w={'6px'}
        h={'6px'}
        borderRadius={'full'}
        bg={DOT_COLOR}
        boxShadow={`0 0 0 3px ${DOT_COLOR}2e`}
        mr={'3px'}
        flexShrink={0}
        aria-hidden
    />
);
