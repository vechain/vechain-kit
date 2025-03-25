'use client';

import { ReactElement, useCallback } from 'react';
import {
    Button,
    VStack,
    Text,
    Code,
    useToast,
    Heading,
} from '@chakra-ui/react';
import {
    useWallet,
    useSignMessage,
    useSignTypedData,
    WalletButton,
} from '@vechain/vechain-kit';

// Example EIP-712 typed data
const exampleTypedData = {
    domain: {
        name: 'VeChain Example',
        version: '1',
        chainId: 1,
    },
    types: {
        Person: [
            { name: 'name', type: 'string' },
            { name: 'wallet', type: 'address' },
        ],
    },
    message: {
        name: 'Alice',
        wallet: '0x0000000000000000000000000000000000000000',
    },
    primaryType: 'Person',
};

export function SigningExample(): ReactElement {
    const { connection, account } = useWallet();
    const toast = useToast();

    const {
        signMessage,
        isSigningPending: isMessageSignPending,
        signature: messageSignature,
    } = useSignMessage();

    const {
        signTypedData,
        isSigningPending: isTypedDataSignPending,
        signature: typedDataSignature,
    } = useSignTypedData();

    const handleSignMessage = useCallback(async () => {
        try {
            const signature = await signMessage('Hello VeChain!');
            toast({
                title: 'Message signed!',
                description: `Signature: ${signature.slice(0, 20)}...`,
                status: 'success',
                duration: 1000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: 'Signing failed',
                description:
                    error instanceof Error ? error.message : String(error),
                status: 'error',
                duration: 1000,
                isClosable: true,
            });
        }
    }, [signMessage, toast]);

    const handleSignTypedData = useCallback(async () => {
        try {
            const signature = await signTypedData(exampleTypedData, {
                signer: account?.address,
            });
            toast({
                title: 'Typed data signed!',
                description: `Signature: ${signature.slice(0, 20)}...`,
                status: 'success',
                duration: 1000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: 'Signing failed',
                description:
                    error instanceof Error ? error.message : String(error),
                status: 'error',
                duration: 1000,
                isClosable: true,
            });
        }
    }, [signTypedData, toast, account]);

    if (!connection.isConnected) {
        return (
            <VStack spacing={4}>
                <Text>Connect your wallet to start signing messages</Text>
                <WalletButton />
            </VStack>
        );
    }

    return (
        <VStack spacing={6} align="stretch">
            <VStack align="stretch" spacing={4}>
                <Heading size="md">Sign Message</Heading>
                <Button
                    onClick={handleSignMessage}
                    isLoading={isMessageSignPending}
                >
                    Sign "Hello VeChain!"
                </Button>
                {messageSignature && (
                    <Code p={2} borderRadius="md">
                        {messageSignature}
                    </Code>
                )}
            </VStack>

            <VStack align="stretch" spacing={4}>
                <Heading size="md">Sign Typed Data</Heading>
                <Button
                    onClick={handleSignTypedData}
                    isLoading={isTypedDataSignPending}
                >
                    Sign Typed Data
                </Button>
                {typedDataSignature && (
                    <Code p={2} borderRadius="md">
                        {typedDataSignature}
                    </Code>
                )}
            </VStack>
        </VStack>
    );
}
