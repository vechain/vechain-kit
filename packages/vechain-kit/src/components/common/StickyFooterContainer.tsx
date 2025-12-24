import { Box, useToken } from '@chakra-ui/react';

type Props = {
    children: React.ReactNode;
};

export const StickyFooterContainer = ({ children }: Props) => {
    // Use semantic token for sticky footer background (same as modal)
    const footerBg = useToken('colors', 'vechain-kit-modal');

    return (
        <Box
            position="absolute"
            bottom="0"
            left="0"
            right="0"
            bg={footerBg}
            zIndex="1000"
            p={4}
            w="full"
        >
            {children}
        </Box>
    );
};
