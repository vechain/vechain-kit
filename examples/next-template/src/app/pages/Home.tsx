'use client';

import { type ReactElement } from 'react';
import { Container, Spinner, VStack } from '@chakra-ui/react';
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

export default function Home(): ReactElement {
    const { account, connection } = useWallet();

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
