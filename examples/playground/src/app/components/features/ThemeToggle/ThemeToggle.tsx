'use client';

import { Box, Button, useColorMode } from '@chakra-ui/react';

export function ThemeToggle() {
    const { colorMode, toggleColorMode } = useColorMode();

    return (
        <Box>
            <Button onClick={toggleColorMode}>
                Toggle {colorMode === 'light' ? 'Dark' : 'Light'} Mode
            </Button>
        </Box>
    );
}
