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
import { VechainLogo } from '@vechain/vechain-kit';
import { Header } from '@/app/components/layout/Header';
import { HeroSection } from '@/app/components/features/HeroSection';
import { TestimonialSection } from '@/app/components/features/TestimonialSection';
import { FAQSection } from '../components/features/FAQSection';
import { ScrollableInfoSections } from '@/app/components/features/ScrollableInfoSections';

export default function Home(): ReactElement {
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

            <TestimonialSection
                mt={10}
                quote="The VeChain Kit is a fantastic foundation for building on VeChain, especially with its clean hooks and UI components."
            />

            <FAQSection />

            <Card
                variant="section"
                py={{ base: 12, md: 16 }}
                px={{ base: 4, md: 8 }}
            >
                <VStack spacing={4} align="center">
                    <VechainLogo
                        maxW="500px"
                        isDark={colorMode === 'dark'}
                        w="200px"
                        h="auto"
                    />
                    <Text
                        fontSize="large"
                        color={'gray.900'}
                        textAlign="center"
                    >
                        By developers, for developers.
                    </Text>
                </VStack>
            </Card>
        </VStack>
    );
}
