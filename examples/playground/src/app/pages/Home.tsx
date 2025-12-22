'use client';

import { type ReactElement } from 'react';
import {
    Container,
    VStack,
    HStack,
    useColorMode,
    IconButton,
} from '@chakra-ui/react';
import { useWallet, WalletButton } from '@vechain/vechain-kit';
import { TransactionExamples } from '@/app/components/features/TransactionExamples';
import { SigningExample } from '@/app/components/features/Signing/SigningExample';
import { LuMoon, LuSun } from 'react-icons/lu';
import { FeaturesToTry } from '@/app/components/features/FeaturesToTry/FeaturesToTry';
import { DataReadingExample } from '../components/features/DataReading';
import { LoginUIControl } from '../components/features/LoginUIControl/LoginUIControl';
import { LoginToContinueBox } from '../components/features/LoginToContinueBox';
import { LanguageDropdown } from '../components/layout/Header';
import { useTranslation } from 'react-i18next';

export default function Home(): ReactElement {
    const { account } = useWallet();
    const { colorMode, toggleColorMode } = useColorMode();
    const { t } = useTranslation();

    if (!account) {
        return (
            <Container
                height={'full'}
                maxW="container.lg"
                justifyContent={'center'}
                wordBreak={'break-word'}
            >
                <VStack spacing={10} mt={10} pb={10} alignItems="flex-start">
                    <HStack w={'full'} justifyContent={'space-between'}>
                        <WalletButton
                            mobileVariant="iconDomainAndAssets"
                            desktopVariant="iconDomainAndAssets"
                            label={t('Login or sign up')}
                        />

                        <HStack spacing={2}>
                            <LanguageDropdown />
                            <IconButton
                                onClick={toggleColorMode}
                                icon={
                                    colorMode === 'light' ? (
                                        <LuMoon />
                                    ) : (
                                        <LuSun />
                                    )
                                }
                                aria-label="Toggle color mode"
                                borderRadius="xl"
                            />
                        </HStack>
                    </HStack>

                    <LoginToContinueBox />

                    <LoginUIControl />
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
        >
            <VStack spacing={12} mt={10} pb={10} alignItems="flex-start">
                <HStack w={'full'} justifyContent={'space-between'}>
                    <WalletButton
                        mobileVariant="iconDomainAndAssets"
                        desktopVariant="iconDomainAndAssets"
                    />

                    <HStack spacing={2}>
                        <LanguageDropdown />
                        <IconButton
                            onClick={toggleColorMode}
                            icon={
                                colorMode === 'light' ? <LuMoon /> : <LuSun />
                            }
                            aria-label="Toggle color mode"
                            borderRadius="xl"
                        />
                    </HStack>
                </HStack>

                <FeaturesToTry />

                <TransactionExamples />

                <SigningExample />

                <DataReadingExample />
            </VStack>
        </Container>
    );
}
