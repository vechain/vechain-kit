'use client';

import {
    Card,
    Grid,
    VStack,
    Heading,
    Text,
    Image,
    HStack,
    Icon,
    useColorMode,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { LuMail, LuApple, LuGithub } from 'react-icons/lu';
import { FaXTwitter, FaDiscord } from 'react-icons/fa6';
import { SiFarcaster } from 'react-icons/si';
import { FcGoogle } from 'react-icons/fc';

interface LoginMethodsSectionProps {
    bg?: string;
    title: string;
    content: string;
}

const basePath = process.env.basePath ?? '';

export function LoginMethodsSection({
    bg = '#f0e8d8',
    title,
    content,
}: LoginMethodsSectionProps) {
    const { colorMode } = useColorMode();
    const { t } = useTranslation();

    return (
        <Card
            px={[0, 20]}
            py={[0, 20]}
            mx={[4, '5%']}
            borderRadius={25}
            bg={bg}
            minH={'550px'}
            justifyContent={'center'}
        >
            <Grid
                templateColumns={['repeat(1, 1fr)', 'repeat(2, 1fr)']}
                gap={4}
                placeItems={'center center'}
                alignItems={'center'}
            >
                <VStack spacing={4} align="start" p={10}>
                    <Heading
                        as="h2"
                        fontSize="3xl"
                        fontWeight="bold"
                        color={colorMode === 'dark' ? 'white' : 'gray.900'}
                    >
                        {title}
                    </Heading>

                    <Text
                        fontSize="lg"
                        color={colorMode === 'dark' ? 'gray.400' : 'gray.600'}
                    >
                        {content}
                    </Text>
                </VStack>

                <HStack
                    spacing={3}
                    wrap="wrap"
                    p={10}
                    justify={['center', 'flex-start']}
                >
                    <Icon as={FcGoogle} boxSize={6} />
                    <Icon as={FaXTwitter} boxSize={6} />
                    <Icon as={LuMail} boxSize={6} />
                    <Icon as={FaDiscord} boxSize={6} />
                    <Icon as={SiFarcaster} boxSize={6} />
                    <Icon as={LuApple} boxSize={6} />
                    <Icon as={LuGithub} boxSize={6} />
                    <Image
                        src={`${basePath}/images/veworld-logo.png`}
                        alt="VeWorld"
                        height={6}
                        width="auto"
                        borderRadius="md"
                    />
                    <Image
                        src={`${basePath}/images/wallet-connect-logo.png`}
                        alt="WalletConnect"
                        height={6}
                        width="auto"
                        borderRadius="md"
                    />
                    <Image
                        src={`${basePath}/images/rabby-logo.png`}
                        alt="Rabby Wallet"
                        height={6}
                        width="auto"
                        borderRadius="md"
                    />
                    <Image
                        src={`${basePath}/images/metamask-logo.png`}
                        alt="MetaMask"
                        height={6}
                        width="auto"
                        borderRadius="md"
                    />
                    <Image
                        src={`${basePath}/images/coinbase-wallet-logo.webp`}
                        alt="Coinbase Wallet"
                        height={6}
                        width="auto"
                        borderRadius="md"
                    />
                    <Image
                        src={`${basePath}/images/rainbow-logo.webp`}
                        alt="Rainbow"
                        height={6}
                        width="auto"
                        borderRadius="md"
                    />
                    <Text
                        fontSize="sm"
                        color={colorMode === 'dark' ? 'gray.400' : 'gray.600'}
                        fontStyle="italic"
                    >
                        {t('and more...')}
                    </Text>
                </HStack>
            </Grid>
        </Card>
    );
}
