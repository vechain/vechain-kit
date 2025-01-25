'use client';

import { type ReactElement } from 'react';
import {
    Container,
    Spinner,
    VStack,
    Text,
    Link,
    HStack,
    useColorMode,
} from '@chakra-ui/react';
import { useWallet, WalletButton } from '@vechain/vechain-kit';
import { UIControls } from '@/app/components/features/UIControls';
import { TransactionExamples } from '@/app/components/features/TransactionExamples';
import { SigningExample } from '@/app/components/features/Signing/SigningExample';
import { WelcomeSection } from '../components/features/WelcomeSection';
import { Introduction } from '../components/features/Introduction';
import { IconButton } from '@chakra-ui/react';
import { IoMdMoon } from 'react-icons/io';
import { FaSun } from 'react-icons/fa';

export default function Home(): ReactElement {
    const { account, connection } = useWallet();
    const { colorMode, toggleColorMode } = useColorMode();

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
                <HStack w={'full'} justifyContent={'space-between'}>
                    <WalletButton
                        mobileVariant="iconDomainAndAssets"
                        desktopVariant="iconDomainAndAssets"
                    />
                    <IconButton
                        onClick={toggleColorMode}
                        icon={colorMode === 'light' ? <IoMdMoon /> : <FaSun />}
                        aria-label="Toggle color mode"
                    />
                </HStack>

                <Introduction />

                <UIControls />

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
