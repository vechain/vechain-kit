'use client';

import { type ReactElement, useRef } from 'react';
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
import { useTranslation } from 'react-i18next';
import { VechainLogo } from '@vechain/vechain-kit';
import { Header } from '@/app/components/layout/Header';
import { HeroSection } from '@/app/components/features/HeroSection';
import { TestimonialSection } from '@/app/components/features/TestimonialSection';
import { AppShowcase } from '@/app/components/features/AppShowcase';
import { FAQSection } from '../components/features/FAQSection';
import { ScrollableInfoSections } from '@/app/components/features/ScrollableInfoSections';
import { FloatingGetStartedButton } from '@/app/components/features/FloatingGetStartedButton/FloatingGetStartedButton';

export default function Home(): ReactElement {
    const { colorMode } = useColorMode();
    const { t } = useTranslation();
    const heroSectionRef = useRef<HTMLDivElement>(null);
    const scrollableSectionsRef = useRef<HTMLDivElement>(null);

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
                        🎉​ {t('Version 2 has been released!')}
                    </Heading>

                    <Button
                        as={Link}
                        href="https://github.com/vechain/vechain-kit/releases"
                        isExternal
                        variant="homepageSecondary"
                    >
                        {t('View Release Notes')} 👇​
                    </Button>
                </VStack>
            </Box>

            <Header />

            <Box ref={heroSectionRef}>
                <HeroSection />
            </Box>

            <Box ref={scrollableSectionsRef}>
                <ScrollableInfoSections />
            </Box>

            <FloatingGetStartedButton
                heroSectionRef={heroSectionRef}
                scrollableSectionsRef={scrollableSectionsRef}
            />

            <TestimonialSection
                mt={10}
                quote={t(
                    'The VeChain Kit is a fantastic foundation for building on VeChain, especially with its clean hooks and UI components.',
                )}
            />

            <AppShowcase />

            <FAQSection />

            <Card
                variant="section"
                pt={'50px'}
                pb={{ base: '100px', md: '100px' }}
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
                        {t('By developers, for developers.')}
                    </Text>
                </VStack>
            </Card>
        </VStack>
    );
}
