import { useVeChainKitConfig } from '@/providers';
import { Box } from '@chakra-ui/react';

type Props = {
    children: React.ReactNode;
};

export const StickyFooterContainer = ({ children }: Props) => {
    const { darkMode: isDark } = useVeChainKitConfig();

    return (
        <Box
            position="sticky"
            bottom="0"
            left="0"
            right="0"
            bg={isDark ? '#18181b' : 'white'}
            zIndex="1000"
            p={4}
            boxShadow={'0px -1px 6px -3px rgb(0 0 0 / 56%)'}
            transition="box-shadow 0.2s ease-in-out"
        >
            {children}
        </Box>
    );
};
