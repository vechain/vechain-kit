'use client';

import { type ReactElement } from 'react';
import {
    Container,
    VStack,
    Text,
    Link,
    HStack,
    useColorMode,
    Flex,
} from '@chakra-ui/react';
import { useWallet, WalletButton } from '@vechain/vechain-kit';
import { UIControls } from '@/app/components/features/UIControls';
import { TransactionExamples } from '@/app/components/features/TransactionExamples';
import { SigningExample } from '@/app/components/features/Signing/SigningExample';
import { Introduction } from '../components/features/Introduction';
import { FAQSection } from '../components/features/FAQSection';
import { FeaturesToTry } from '@/app/components/features/FeaturesToTry/FeaturesToTry';
import { DataReadingExample } from '../components/features/DataReading';
import { VechainLogo } from '@vechain/vechain-kit/assets';
import { LoginUIControl } from '../components/features/LoginUIControl/LoginUIControl';
import { LoginToContinueBox } from '../components/features/LoginToContinueBox';

export default function Home(): ReactElement {
    const { account } = useWallet();

    if (!account) {
        return (
            <Container
                height={'full'}
                maxW="container.lg"
                justifyContent={'center'}
                wordBreak={'break-word'}
                position="relative"
                zIndex={1}
            >
                <VStack spacing={10} mt={10} pb={10} alignItems="flex-start">
                    <HStack w={'full'} justifyContent={'space-between'}>
                        <WalletButton
                            mobileVariant="iconDomainAndAssets"
                            desktopVariant="iconDomainAndAssets"
                        />
                    </HStack>

                    <Introduction />

                    <LoginUIControl />

                    <FAQSection />

                    <LoginToContinueBox />

                    <Logo />
                </VStack>
            </Container>
        );
    }

    return (
        <Container
            height={'full'}
            maxW="container.lg"
            justifyContent={'center'}
            wordBreak={'break-word'}
            position="relative"
            zIndex={1}
        >
            <VStack spacing={10} mt={10} pb={10} alignItems="flex-start">
                <WalletButton
                    mobileVariant="iconDomainAndAssets"
                    desktopVariant="iconDomainAndAssets"
                />

                <Introduction />

                <FeaturesToTry />

                <UIControls />

                <TransactionExamples />
                <SigningExample />
                <DataReadingExample />
                <FAQSection />
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

                <Logo />
            </VStack>
        </Container>
    );
}

const Logo = () => {
    const { colorMode } = useColorMode();
    return (
        <HStack
            onClick={() => window.open('https://vechain.org', '_blank')}
            pt={10}
            justify={'center'}
            w={'full'}
            cursor={'pointer'}
            _hover={{
                opacity: 0.8,
                transition: 'opacity 0.2s ease-in-out',
            }}
        >
            <Flex
                direction={{ base: 'column', md: 'row' }}
                align="center"
                wrap="wrap"
                justify="center"
                gap={2}
            >
                <Text fontSize="md" fontWeight="bold">
                    Made by
                </Text>
                <VechainLogo
                    maxW="200px"
                    isDark={colorMode === 'dark'}
                    w="200px"
                    h="auto"
                    ml={{ base: 0, sm: -6 }}
                    mt={{ base: -6, md: 0 }}
                />
            </Flex>
        </HStack>
    );
};
