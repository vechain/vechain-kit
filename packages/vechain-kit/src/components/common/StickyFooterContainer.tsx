import { Box, useToken } from '@chakra-ui/react';

type Props = {
    children: React.ReactNode;
};

export const StickyFooterContainer = ({ children }: Props) => {
    // Use semantic token for sticky footer background (same as modal)
    const footerBg = useToken('colors', 'vechain-kit-modal');

    return (
        <Box
            position="sticky"
            bottom="0"
            left="0"
            right="0"
            bg={footerBg}
            zIndex="1000"
            p={4}
            boxShadow={'0px -1px 6px -3px rgb(0 0 0 / 56%)'}
            transition="box-shadow 0.2s ease-in-out"
        >
            {children}
        </Box>
    );
};
