'use client';

import { type ReactElement } from 'react';
import {
    VStack,
    Text,
    Link,
    Card,
    useColorMode,
    Box,
    Heading,
    Button,
} from '@chakra-ui/react';
import { useWallet, VechainLogo } from '@vechain/vechain-kit';
import { Header } from '@/app/components/layout/Header';
import { HeroSection } from '@/app/components/features/HeroSection';
import { FeatureSection } from '@/app/components/features/FeatureSection';
import { TestimonialSection } from '@/app/components/features/TestimonialSection';
import { PlatformSection } from '@/app/components/features/PlatformSection';
import { PrivacySection } from '@/app/components/features/PrivacySection';
import { FAQSection } from '../components/features/FAQSection';
import { FeaturesToTry } from '@/app/components/features/FeaturesToTry/FeaturesToTry';
import { InfoSection } from '@/app/components/features/InfoSection';
import {
    LuPalette,
    LuShield,
    LuLock,
    LuEye,
    LuShieldCheck,
} from 'react-icons/lu';

const basePath = process.env.basePath ?? '';

const platforms = [
    { name: 'VeWorld', logo: `${basePath}/images/veworld-logo.png` },
    {
        name: 'WalletConnect',
        logo: `${basePath}/images/wallet-connect-logo.png`,
    },
    { name: 'MetaMask', logo: `${basePath}/images/metamask-logo.png` },
    { name: 'Rabby', logo: `${basePath}/images/rabby-logo.png` },
    { name: 'Coinbase', logo: `${basePath}/images/coinbase-wallet-logo.webp` },
    { name: 'Rainbow', logo: `${basePath}/images/rainbow-logo.webp` },
];

const privacyFeatures = [
    {
        title: 'Zero data retention',
        description:
            'Your wallet data is private with zero data retention. None of your data will be stored or used for model training.',
        icon: LuLock,
    },
    {
        title: 'Everything stays local',
        description:
            'All history stays local on your device. Your wallet operations are processed securely without exposing sensitive information.',
        icon: LuEye,
    },
    {
        title: 'Certified security',
        description:
            'Audited and verified by independent security experts to ensure the highest standards of privacy and security.',
        icon: LuShieldCheck,
    },
];

export default function Home(): ReactElement {
    const { account } = useWallet();
    const { colorMode } = useColorMode();

    return (
        <VStack spacing={0} align="stretch" minH="100vh">
            <Box h={[300, 250]} w="full" bg="#e4ebe1" borderBottomRadius={24}>
                <VStack mt={100} justifyContent="center">
                    <Heading
                        fontSize="3xl"
                        fontWeight="500"
                        color="black"
                        textAlign="center"
                        py={10}
                        px={4}
                    >
                        🎉​ Version 2 has been released!
                    </Heading>

                    <Button
                        as={Link}
                        href="https://github.com/vechain/vechain-kit/releases/tag/v2.0.0"
                        isExternal
                        variant="homepageSecondary"
                    >
                        View Release Notes 👇​
                    </Button>
                </VStack>
            </Box>

            <Header />

            <HeroSection />

            <VStack spacing={12} align="stretch">
                <InfoSection
                    bg="#e0daea"
                    title="Seamless Wallet Integration"
                    content="Connect your users to your dApp with out-of-the-box wallet connection options. Support for VeWorld, Sync2, WalletConnect, and social logins including Google, Twitter, Email, and more."
                    imageSrc="https://prod-vechainkit-docs-images-bucket.s3.eu-west-1.amazonaws.com/vechain-kit-v2-shocase.png"
                    imageAlt="VeChain Kit"
                />

                <InfoSection
                    bg="#dae8fb"
                    title="Boosted Development"
                    content="Use our hooks and components to speed up your development. No need to worry about the underlying VeChain infrastructure—we handle it for you. Focus on building your dApp, not the blockchain integration."
                    imageSrc="https://prod-vechainkit-docs-images-bucket.s3.eu-west-1.amazonaws.com/vechain-kit-v2-shocase.png"
                    imageAlt="VeChain Kit"
                />
            </VStack>

            <FeatureSection
                title="Style Customization"
                description="The kit is designed to be customizable to your needs. Decide what features you want to use and which ones you don't. Add call-to-action buttons to your app to guide your users to the features they need."
                icon={LuPalette}
                variant="beige"
            />

            {account && (
                <Card
                    id="features"
                    variant="section"
                    py={{ base: 12, md: 16 }}
                    px={{ base: 4, md: 8 }}
                >
                    <FeaturesToTry />
                </Card>
            )}

            <TestimonialSection quote="Building on VeChain has never been easier. VeChain Kit handles all the complexity so I can focus on creating great user experiences." />

            <PlatformSection platforms={platforms} />

            <FeatureSection
                title="Assets, Profile, and Wallet Management"
                description="Use VeChain Kit to allow your users to have asset management, profile management, social login, wallet backup, MFA, and more. All out of the box, so you can focus on building your dApp."
                icon={LuShield}
                variant="green"
                reverse
            />

            <PrivacySection features={privacyFeatures} />

            <Card
                variant="section"
                py={{ base: 12, md: 16 }}
                px={{ base: 4, md: 8 }}
            >
                <FAQSection />
            </Card>

            <Card
                variant="section"
                py={{ base: 12, md: 16 }}
                px={{ base: 4, md: 8 }}
            >
                <VStack spacing={4} align="center">
                    <Text
                        fontSize="sm"
                        color={colorMode === 'dark' ? 'gray.400' : 'gray.600'}
                        textAlign="center"
                    >
                        Found a bug? Please open an issue on{' '}
                        <Link
                            href="https://github.com/vechain/vechain-kit/issues"
                            color="primary.500"
                            isExternal
                            _hover={{ textDecoration: 'underline' }}
                        >
                            GitHub
                        </Link>
                    </Text>
                    <Logo />
                </VStack>
            </Card>
        </VStack>
    );
}

const Logo = () => {
    const { colorMode } = useColorMode();
    return (
        <VStack
            onClick={() => window.open('https://vechain.org', '_blank')}
            spacing={4}
            justify={'center'}
            w={'full'}
            cursor={'pointer'}
            _hover={{
                opacity: 0.8,
                transition: 'opacity 0.2s ease-in-out',
            }}
        >
            <Text
                fontSize="sm"
                fontWeight="medium"
                color={colorMode === 'dark' ? 'gray.400' : 'gray.600'}
            >
                Made by
            </Text>
            <VechainLogo
                maxW="500px"
                isDark={colorMode === 'dark'}
                w="200px"
                h="auto"
            />
        </VStack>
    );
};
