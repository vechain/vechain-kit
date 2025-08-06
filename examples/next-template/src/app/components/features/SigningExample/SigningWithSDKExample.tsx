'use client';

import { ReactElement, useCallback, useState } from 'react';
import {
    Button,
    VStack,
    Text,
    Code,
    useToast,
    Heading,
} from '@chakra-ui/react';
import { useWallet, WalletButton } from '@vechain/vechain-kit';

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

export function SigningWithSDKExample(): ReactElement {
    const [messageSignature, setMessageSignature] = useState<string | null>(
        null,
    );
    const [typedDataSignature, setTypedDataSignature] = useState<string | null>(
        null,
    );
    const { connection, account, signer } = useWallet();
    const toast = useToast();

    const handleSignMessage = useCallback(async () => {
        if (!signer) {
            throw new Error('Signer not found');
        }

        try {
            const signature = await signer.signMessage('Hello VeChain!');
            setMessageSignature(signature);
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
    }, [signer, toast]);

    const handleSignTypedData = useCallback(async () => {
        if (!signer) {
            throw new Error('Signer not found');
        }

        try {
            const signature = await signer.signTypedData(
                exampleTypedData.domain,
                exampleTypedData.types,
                exampleTypedData.message,
            );
            setTypedDataSignature(signature);
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
    }, [signer, toast, account]);

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
                <Heading size="md">Sign Message with SDK "signer"</Heading>
                <Button
                    onClick={handleSignMessage}
                    data-testid="sign-message-button"
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
                <Heading size="md">Sign Typed Data with SDK "signer"</Heading>
                <Button
                    onClick={handleSignTypedData}
                    data-testid="sign-typed-data-button"
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
