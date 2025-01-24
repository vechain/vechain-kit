'use client';

import { type ReactElement } from 'react';
import { Container, Spinner, VStack, Text, Link } from '@chakra-ui/react';
import { useWallet, WalletButton } from '@vechain/vechain-kit';
import { AccountInfo } from '@/app/components/features/AccountInfo';
import { ConnectionInfo } from '@/app/components/features/ConnectionInfo';
import { DaoInfo } from '@/app/components/features/DaoInfo';
import { UIControls } from '@/app/components/features/UIControls';
import { LanguageSelector } from '@/app/components/features/LanguageSelector';
import { TransactionExamples } from '@/app/components/features/TransactionExamples';
import { SigningExample } from '@/app/components/features/Signing/SigningExample';
import { WelcomeSection } from '../components/features/WelcomeSection';
import { Introduction } from '../components/features/Introduction';
import { ConnectionTypes } from '../components/features/ConnectionTypes';
import { SmartAccountInfo } from '../components/features/SmartAccountInfo';
import { KitFeatures } from '../components/features/KitFeatures';

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
                <Introduction />

                <ConnectionTypes />
                <ConnectionInfo />

                <SmartAccountInfo />
                <AccountInfo />

                <UIControls />

                <DaoInfo />
                {/* <LanguageSelector /> */}
                <TransactionExamples />
                <SigningExample />
                <Text
                    fontSize="sm"
                    color="gray.600"
                    w="full"
                    textAlign="center"
                    mt={4}
                >
                    Found a bug? Please open an issue on{' '}
                    <Link
                        href="https://github.com/vechain/vechain-kit/issues"
                        color="blue.500"
                        isExternal
                    >
                        GitHub
                    </Link>
                </Text>
            </VStack>
        </Container>
    );
}
