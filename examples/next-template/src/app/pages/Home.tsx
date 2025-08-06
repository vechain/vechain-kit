'use client';

import { useEffect, type ReactElement } from 'react';
import { Button, Container, Spinner, VStack } from '@chakra-ui/react';
import { useWallet, WalletButton } from '@vechain/vechain-kit';
import { AccountInfo } from '@/app/components/features/AccountInfo';
import { ConnectionInfo } from '@/app/components/features/ConnectionInfo';
import { DaoInfo } from '@/app/components/features/DaoInfo';
import { UIControls } from '@/app/components/features/UIControls';
import { LanguageSelector } from '@/app/components/features/LanguageSelector';
import { TransactionExamples } from '@/app/components/features/TransactionExamples';
import { SigningExample } from '@/app/components/features/SigningExample/SigningExample';
import { WelcomeSection } from '../components/features/WelcomeSection';
import mixpanelClient from '@/lib/mixpanelClient';
import { vthorContract } from '@/app/constants';

export default function Home(): ReactElement {
    const { account, connection, signer } = useWallet();

    if (!account) {
        return <WelcomeSection />;
    }

    if (connection.isLoading) {
        return (
            <VStack w="full" h="full" justify="center" align="center">
                <Spinner />
            </VStack>
        );
    }

    mixpanelClient.trackEvent('Home Page Viewed');

    return (
        <Container
            height={'full'}
            maxW="container.md"
            justifyContent={'center'}
            wordBreak={'break-word'}
        >
            <VStack spacing={10} mt={10} pb={10} alignItems="flex-start">
                <WalletButton
                    mobileVariant="iconDomainAndAssets"
                    desktopVariant="iconDomainAndAssets"
                />
                <Button
                    onClick={async () => {
                        console.log('signer', signer);
                        if (signer) {
                            vthorContract.setSigner(signer);
                            const receipt = await (
                                await vthorContract.transact.transfer(
                                    account.address,
                                    0 as any,
                                )
                            ).wait();
                            console.log('transaction receipt', receipt);
                        }
                    }}
                >
                    Sign Transaction
                </Button>

                <Button
                    onClick={async () => {
                        console.log('signer', signer);
                        if (signer) {
                            try {
                                const signature = await signer.signTypedData(
                                    {
                                        name: 'Test Domain',
                                        version: '1',
                                        chainId: 1,
                                    },
                                    {
                                        Person: [
                                            { name: 'name', type: 'string' },
                                            { name: 'wallet', type: 'address' },
                                        ],
                                    },
                                    {
                                        name: 'John Doe',
                                        wallet: account.address,
                                    },
                                );
                                console.log('Typed data signature:', signature);
                            } catch (error) {
                                console.error(
                                    'Typed data signing failed:',
                                    error,
                                );
                            }
                        }
                    }}
                >
                    Sign Typed Data
                </Button>

                <Button
                    onClick={async () => {
                        console.log('signer', signer);
                        if (signer) {
                            try {
                                const signature = await signer.signPayload(
                                    new TextEncoder().encode('Hello, VeChain!'),
                                );
                                console.log('Message signature:', signature);
                            } catch (error) {
                                console.error('Message signing failed:', error);
                            }
                        }
                    }}
                >
                    Sign Payload
                </Button>
                <Button
                    onClick={async () => {
                        console.log('signer', signer);
                        if (signer) {
                            const signature = await signer.signMessage(
                                'Hello, VeChain!',
                            );
                            console.log('Message signature:', signature);
                        }
                    }}
                >
                    Sign Message
                </Button>
                <AccountInfo />
                <ConnectionInfo />
                <DaoInfo />
                <UIControls />
                <LanguageSelector />
                <TransactionExamples />
                <SigningExample />
            </VStack>
        </Container>
    );
}
