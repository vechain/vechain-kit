'use client';

import {
    Stack,
    VStack,
    Text,
    Heading,
    useColorMode,
    Button,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

const PLAYGROUND_URL = 'https://playground.vechainkit.vechain.org';

export function HeroSection() {
    const { colorMode } = useColorMode();
    const { t } = useTranslation();

    const scrollToQuickStart = () => {
        const el = document.getElementById('quick-start');
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <VStack
            spacing={8}
            align="center"
            maxW="4xl"
            mx="auto"
            textAlign="center"
            p={8}
            my={[15, 20]}
        >
            <Heading
                as="h1"
                fontSize="xxx-large"
                fontWeight="800"
                lineHeight="1.1"
                fontFamily={
                    "'Satoshi', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
                }
                color={colorMode === 'dark' ? 'white' : 'gray.900'}
            >
                {t('Build on VeChain, effortlessly')}
            </Heading>
            <Text
                fontSize={{ base: 'lg', md: 'xl' }}
                color={colorMode === 'dark' ? 'gray.300' : 'gray.600'}
                maxW="2xl"
                lineHeight="1.6"
            >
                {t(
                    'React hooks, pre-built UI, wallet integration, and social login — everything you need to ship a VeChain dApp.',
                )}
            </Text>

            <Stack
                direction={{ base: 'column', sm: 'row' }}
                spacing={3}
                align="center"
            >
                <Button
                    onClick={scrollToQuickStart}
                    variant="homepagePrimary"
                    size="lg"
                >
                    {t('Get Started')} 🚀
                </Button>
                <Button
                    as="a"
                    href={PLAYGROUND_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="homepageSecondary"
                    size="lg"
                >
                    {t('Try the playground')} ▸
                </Button>
            </Stack>
        </VStack>
    );
}
