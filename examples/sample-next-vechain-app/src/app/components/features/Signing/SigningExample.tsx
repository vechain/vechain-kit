'use client';

import { ReactElement, useCallback } from 'react';
import {
    Button,
    VStack,
    Text,
    Code,
    useToast,
    SimpleGrid,
} from '@chakra-ui/react';
import {
    useWallet,
    useSignMessage,
    useSignTypedData,
    WalletButton,
} from '@vechain/vechain-kit';
import { MdFingerprint } from 'react-icons/md';
import { CollapsibleCard } from '../../ui/CollapsibleCard';
import { Link } from '@chakra-ui/react';

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
    const { connection } = useWallet();
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
            const signature = await signTypedData(exampleTypedData);
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
    }, [signTypedData, toast]);

    if (!connection.isConnected) {
        return (
            <CollapsibleCard title="Message Signing" icon={MdFingerprint}>
                <VStack spacing={4}>
                    <Text>Connect your wallet to start signing messages</Text>
                    <WalletButton />
                </VStack>
            </CollapsibleCard>
        );
    }

    return (
        <CollapsibleCard
            defaultIsOpen
            title="Message Signing"
            icon={MdFingerprint}
        >
            <VStack spacing={6} align="stretch">
                <Text textAlign="center">
                    VeChain Kit provides hooks for signing messages and typed
                    data. Try these examples to see signing in action.
                </Text>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    {/* Message Signing */}
                    <VStack
                        spacing={4}
                        p={6}
                        borderRadius="md"
                        bg="whiteAlpha.50"
                    >
                        <Text fontWeight="bold">Sign Message</Text>
                        <Button
                            onClick={handleSignMessage}
                            isLoading={isMessageSignPending}
                            w="full"
                        >
                            Sign "Hello VeChain!"
                        </Button>
                        {messageSignature && (
                            <Code
                                p={2}
                                borderRadius="md"
                                w="full"
                                fontSize="sm"
                            >
                                {messageSignature}
                            </Code>
                        )}
                    </VStack>

                    {/* Typed Data Signing */}
                    <VStack
                        spacing={4}
                        p={6}
                        borderRadius="md"
                        bg="whiteAlpha.50"
                    >
                        <Text fontWeight="bold">Sign Typed Data</Text>
                        <Button
                            onClick={handleSignTypedData}
                            isLoading={isTypedDataSignPending}
                            w="full"
                        >
                            Sign Typed Data
                        </Button>
                        {typedDataSignature && (
                            <Code
                                p={2}
                                borderRadius="md"
                                w="full"
                                fontSize="sm"
                            >
                                {typedDataSignature}
                            </Code>
                        )}
                    </VStack>
                </SimpleGrid>

                {/* Implementation Example */}
                <VStack spacing={4} p={6} borderRadius="md" bg="whiteAlpha.50">
                    <Text fontWeight="bold">Implementation</Text>
                    <Button
                        as={Link}
                        isExternal
                        href="https://vechain-foundation-san-marino.gitbook.io/vechain-kit/vechain-kit/sign-messages"
                        w="full"
                        variant="outline"
                        rightIcon={<MdFingerprint />}
                    >
                        View Full Documentation
                    </Button>
                </VStack>
            </VStack>
        </CollapsibleCard>
    );
}
