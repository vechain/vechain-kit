'use client';

import { useEffect, type ReactElement } from 'react';
import { Button, Container, Spinner, VStack } from '@chakra-ui/react';
import {
    usePrivyWalletProvider,
    useWallet,
    WalletButton,
    useSigner,
} from '@vechain/vechain-kit';
import { AccountInfo } from '@/app/components/features/AccountInfo';
import { ConnectionInfo } from '@/app/components/features/ConnectionInfo';
import { DaoInfo } from '@/app/components/features/DaoInfo';
import { UIControls } from '@/app/components/features/UIControls';
import { LanguageSelector } from '@/app/components/features/LanguageSelector';
import { TransactionExamples } from '@/app/components/features/TransactionExamples';
import { SigningExample } from '@/app/components/features/SigningExample/SigningExample';
import { WelcomeSection } from '../components/features/WelcomeSection';
import mixpanelClient from '@/lib/mixpanelClient';
import { ThorClient } from '@vechain/sdk-network';
import { ERC20_ABI, VTHO_ADDRESS } from '@vechain/sdk-core';

export default function Home(): ReactElement {
    const { account, connection } = useWallet();
    const signer = useSigner();

    const thorClient = ThorClient.at('https://testnet.vechain.org');
    const contract = thorClient.contracts.load(VTHO_ADDRESS, ERC20_ABI);

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
                            contract.setSigner(signer);

                            const tx = await (
                                await contract.transact.transfer(
                                    account.address,
                                    0 as any,
                                )
                            ).wait();
                            console.log('tx', tx);
                        }
                    }}
                >
                    Get Address
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
