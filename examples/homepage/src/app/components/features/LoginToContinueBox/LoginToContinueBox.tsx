'use client';

import { Button, Text, VStack, useColorMode } from '@chakra-ui/react';
import { useConnectModal } from '@vechain/vechain-kit';

export function LoginToContinueBox() {
    const { colorMode } = useColorMode();
    const { open } = useConnectModal();

    return (
        <VStack
            w="full"
            p={4}
            rounded="md"
            spacing={3}
            borderRadius="lg"
            boxShadow="xl"
            bg="whiteAlpha.100"
            backdropFilter="blur(10px)"
            zIndex={2}
        >
            <Text fontSize="lg" fontWeight="medium" textAlign="center">
                Connect your wallet to explore all features
            </Text>
            <Text
                fontSize="sm"
                color={colorMode === 'light' ? 'gray.600' : 'gray.400'}
                textAlign="center"
            >
                Sign in to access transaction examples, signing capabilities,
                profile customization and more.
            </Text>
            <Button width="full" onClick={() => open()}>
                Click here to sign in!
            </Button>
        </VStack>
    );
}
