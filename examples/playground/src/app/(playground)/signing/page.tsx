'use client';

import { Button, Heading, HStack, Text, useToast, VStack } from '@chakra-ui/react';
import {
    useSignMessage,
    useSignTypedData,
    useWallet,
} from '@vechain/vechain-kit';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { DemoSection } from '../../components/demo/DemoSection';
import { ConnectGate } from '../../components/demo/ConnectGate';
import { SignatureOutput } from '../../components/features/Signing/SignatureOutput';

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

const SIGN_MESSAGE_SNIPPET = `import { useSignMessage } from '@vechain/vechain-kit';

function SignButton() {
    const { signMessage, signature, isSigningPending } = useSignMessage();

    return (
        <>
            <Button
                onClick={() => signMessage('Hello VeChain!')}
                isLoading={isSigningPending}
            >
                Sign message
            </Button>
            {signature && <code>{signature}</code>}
        </>
    );
}
`;

const SIGN_TYPED_DATA_SNIPPET = `import { useSignTypedData } from '@vechain/vechain-kit';

const typedData = {
    domain: { name: 'VeChain Example', version: '1', chainId: 1 },
    types: { Person: [{ name: 'name', type: 'string' }, { name: 'wallet', type: 'address' }] },
    primaryType: 'Person',
    message: { name: 'Alice', wallet: '0x000...' },
};

function SignTypedButton() {
    const { signTypedData, signature, isSigningPending } = useSignTypedData();
    return (
        <Button
            onClick={() => signTypedData(typedData)}
            isLoading={isSigningPending}
        >
            Sign typed data
        </Button>
    );
}
`;

function SignMessageDemo() {
    const { t } = useTranslation();
    const toast = useToast();
    const {
        signMessage,
        signature,
        isSigningPending,
    } = useSignMessage();

    const handle = useCallback(async () => {
        try {
            await signMessage('Hello VeChain!');
            toast({
                title: t('Message signed!'),
                status: 'success',
                duration: 1200,
            });
        } catch (e) {
            toast({
                title: t('Signing failed'),
                description: e instanceof Error ? e.message : String(e),
                status: 'error',
                duration: 1500,
            });
        }
    }, [signMessage, toast, t]);

    return (
        <VStack align="stretch" spacing={3}>
            <HStack>
                <Button onClick={handle} isLoading={isSigningPending}>
                    {t('Sign "Hello VeChain!"')}
                </Button>
            </HStack>
            <SignatureOutput signature={signature} />
        </VStack>
    );
}

function SignTypedDataDemo() {
    const { t } = useTranslation();
    const toast = useToast();
    const { account } = useWallet();
    const {
        signTypedData,
        signature,
        isSigningPending,
    } = useSignTypedData();

    const handle = useCallback(async () => {
        try {
            await signTypedData(exampleTypedData, {
                signer: account?.address,
            });
            toast({
                title: t('Typed data signed!'),
                status: 'success',
                duration: 1200,
            });
        } catch (e) {
            toast({
                title: t('Signing failed'),
                description: e instanceof Error ? e.message : String(e),
                status: 'error',
                duration: 1500,
            });
        }
    }, [signTypedData, account, toast, t]);

    return (
        <VStack align="stretch" spacing={3}>
            <HStack>
                <Button onClick={handle} isLoading={isSigningPending}>
                    {t('Sign typed data')}
                </Button>
            </HStack>
            <SignatureOutput signature={signature} />
        </VStack>
    );
}

export default function SigningPage() {
    const { t } = useTranslation();

    return (
        <VStack align="stretch" spacing={6}>
            <VStack align="stretch" spacing={2}>
                <Heading size="lg">{t('Signing')}</Heading>
                <Text opacity={0.7}>
                    {t(
                        'Sign plain messages or structured EIP-712 typed data — works for both wallet and embedded users.',
                    )}
                </Text>
            </VStack>

            <ConnectGate feature={t('Signing')}>
                <DemoSection
                    title={t('Personal sign')}
                    description={t(
                        'A simple message signature. Useful for proving ownership of an address.',
                    )}
                    hooks={['useSignMessage']}
                    code={SIGN_MESSAGE_SNIPPET}
                >
                    <SignMessageDemo />
                </DemoSection>

                <DemoSection
                    title={t('EIP-712 typed data')}
                    description={t(
                        'Structured signing — the standard for off-chain order books, permits and gasless approvals.',
                    )}
                    hooks={['useSignTypedData']}
                    code={SIGN_TYPED_DATA_SNIPPET}
                >
                    <SignTypedDataDemo />
                </DemoSection>
            </ConnectGate>
        </VStack>
    );
}
