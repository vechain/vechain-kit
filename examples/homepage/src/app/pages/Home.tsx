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
import { TestimonialSection } from '@/app/components/features/TestimonialSection';
import { PlatformSection } from '@/app/components/features/PlatformSection';
import { FAQSection } from '../components/features/FAQSection';
import { FeaturesToTry } from '@/app/components/features/FeaturesToTry/FeaturesToTry';
import { ScrollableInfoSections } from '@/app/components/features/ScrollableInfoSections';

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

            <ScrollableInfoSections />

            {/* {account && (
                <Card
                    id="features"
                    variant="section"
                    py={{ base: 12, md: 16 }}
                    px={{ base: 4, md: 8 }}
                >
                    <FeaturesToTry />
                </Card>
            )} */}

            <TestimonialSection quote="The VeChain Kit is a fantastic foundation for building on VeChain, especially with its clean hooks and UI components." />

            <PlatformSection />

            <FAQSection />

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
