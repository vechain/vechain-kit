'use client';

import {
    Card,
    VStack,
    Heading,
    SimpleGrid,
    Image,
    useColorMode,
} from '@chakra-ui/react';

interface PlatformSectionProps {
    title?: string;
}

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

export function PlatformSection({
    title = 'Works on all platforms',
}: PlatformSectionProps) {
    const { colorMode } = useColorMode();

    return (
        <Card
            variant={colorMode === 'dark' ? 'featureDark' : 'section'}
            py={{ base: 12, md: 16 }}
            px={{ base: 4, md: 8 }}
        >
            <VStack spacing={8} align="center" maxW="6xl" mx="auto">
                <Heading
                    as="h2"
                    fontSize={{ base: '2xl', md: '3xl' }}
                    fontWeight="bold"
                    color={colorMode === 'dark' ? 'white' : 'gray.900'}
                    textAlign="center"
                >
                    {title}
                </Heading>
                <SimpleGrid
                    columns={{ base: 3, sm: 4, md: 6, lg: 8 }}
                    spacing={{ base: 4, md: 6 }}
                    w="full"
                >
                    {platforms.map((platform) => (
                        <VStack
                            key={platform.name}
                            spacing={2}
                            p={4}
                            borderRadius="lg"
                            _hover={{
                                bg:
                                    colorMode === 'dark'
                                        ? 'whiteAlpha.100'
                                        : 'gray.50',
                                transition: 'background-color 0.2s',
                            }}
                        >
                            <Image
                                src={platform.logo}
                                alt={platform.name}
                                height={10}
                                width="auto"
                                objectFit="contain"
                                opacity={0.8}
                                _hover={{
                                    opacity: 1,
                                    transition: 'opacity 0.2s',
                                }}
                            />
                        </VStack>
                    ))}
                </SimpleGrid>
            </VStack>
        </Card>
    );
}
