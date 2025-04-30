'use client';

import { Box, Button, Heading, HStack } from '@chakra-ui/react';
import { useColorMode } from '@chakra-ui/react';
import { useAccountModal } from '@vechain/vechain-kit';

export function UIControls() {
    const { toggleColorMode, colorMode } = useColorMode();
    const { open: openAccountModal } = useAccountModal();

    return (
        <Box>
            <Heading size={'md'}>
                <b>UI</b>
            </Heading>
            <HStack mt={4} spacing={4}>
                <Button
                    colorScheme="primary"
                    onClick={toggleColorMode}
                    data-testid={`${colorMode === 'dark' ? 'light' : 'dark' }-mode-button`}
                >
                    {colorMode === 'dark' ? 'Light mode' : 'Dark mode'}
                </Button>
                <Button
                    onClick={openAccountModal}
                    data-testid="account-modal-button"
                >
                    Account Modal
                </Button>
            </HStack>
        </Box>
    );
}
