# VeChain Kit — Working application examples

Maintained homepage demos, Next.js templates, Chakra v3 integration, Tailwind compatibility app, and the complete playground source. This includes playground code snippets and ready-made AI prompts. Prefer patterns that agree with the current public API and package manifest.

> Generated from the VeChain Kit repository. File paths are preserved so answers can cite the source.
> VeChain Kit commit: `f8f32209bf76b08a0e459f534c9fb488a9e5fd00`. VeChain AI Skills commit: `b0d8b8f0dbb97cf4224840f7ee7a2eaadea677f2`.

## Source: `examples/homepage/src/app/components/ForceLightMode.tsx`

````tsx
'use client';

import { useEffect } from 'react';
import { useColorMode } from '@chakra-ui/react';

/**
 * Component that forces light mode and clears any cached dark mode preference.
 * This ensures that users with old cached preferences always see light mode.
 */
export function ForceLightMode() {
    const { colorMode, setColorMode } = useColorMode();

    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Clear any cached color mode preferences from localStorage
        // Chakra UI may store it with different keys depending on cssVarPrefix
        const possibleKeys = [
            'chakra-ui-color-mode-vechain-kit-homepage',
            'chakra-ui-color-mode',
            'vechain-kit-homepage-color-mode',
        ];

        possibleKeys.forEach((key) => {
            const storedValue = localStorage.getItem(key);
            if (storedValue && storedValue !== 'light') {
                localStorage.setItem(key, 'light');
            }
        });

        // Force light mode
        if (colorMode !== 'light') {
            setColorMode('light');
        }
    }, [colorMode, setColorMode]);

    return null;
}
````

## Source: `examples/homepage/src/app/components/features/AISection/AISection.tsx`

````tsx
'use client';

import {
    Card,
    Grid,
    VStack,
    Heading,
    Text,
    HStack,
    Box,
    Icon,
    useColorMode,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { LuSparkles, LuCheck } from 'react-icons/lu';

interface AISectionProps {
    bg?: string;
    title: string;
    content: string;
}

const TERMINAL_LINES: { prompt: string; text: string; check?: boolean }[] = [
    { prompt: '$', text: 'npx skills add vechain/vechain-ai-skills' },
    { prompt: '✓', text: '11 VeChain skills installed', check: true },
    { prompt: '>', text: 'Build a B3TR rewards contract for my X2Earn app' },
    { prompt: '✨', text: 'Using vebetterdao + smart-contract-development...' },
];

function TerminalMock() {
    const bg = '#0d1117';
    const borderColor = '#30363d';
    const textColor = '#c9d1d9';
    const promptColor = '#58a6ff';
    const greenColor = '#3fb950';

    return (
        <Box
            bg={bg}
            borderRadius="xl"
            borderWidth="1px"
            borderColor={borderColor}
            p={5}
            fontFamily="monospace"
            w={['90%', '450px']}
            boxShadow="0 10px 30px rgba(0,0,0,0.25)"
        >
            <HStack spacing={2} mb={4}>
                <Box w={3} h={3} borderRadius="full" bg="#ff5f57" />
                <Box w={3} h={3} borderRadius="full" bg="#febc2e" />
                <Box w={3} h={3} borderRadius="full" bg="#28c840" />
            </HStack>
            <VStack align="stretch" spacing={2}>
                {TERMINAL_LINES.map((line, i) => (
                    <HStack key={i} align="flex-start" spacing={3}>
                        <Text
                            color={line.check ? greenColor : promptColor}
                            fontSize="sm"
                            fontWeight="bold"
                            minW="14px"
                        >
                            {line.check ? <Icon as={LuCheck} boxSize={4} /> : line.prompt}
                        </Text>
                        <Text
                            color={line.check ? greenColor : textColor}
                            fontSize="sm"
                            wordBreak="break-word"
                        >
                            {line.text}
                        </Text>
                    </HStack>
                ))}
            </VStack>
        </Box>
    );
}

export function AISection({
    bg = '#e8e0d3',
    title,
    content,
}: AISectionProps) {
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
                templateColumns={[
                    'minmax(0, 1fr)',
                    'repeat(2, minmax(0, 1fr))',
                ]}
                gap={4}
                placeItems={'center center'}
                alignItems={'center'}
                w="full"
            >
                <VStack spacing={4} align="start" p={10}>
                    <HStack spacing={2}>
                        <Icon as={LuSparkles} boxSize={5} color="black" />
                        <Text
                            fontSize="sm"
                            fontWeight="bold"
                            letterSpacing="wider"
                            textTransform="uppercase"
                            color="black"
                        >
                            {t('VeChain AI Skills')}
                        </Text>
                    </HStack>
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
                        color={colorMode === 'dark' ? 'gray.400' : 'gray.700'}
                    >
                        {content}
                    </Text>
                </VStack>

                <Box
                    p={[6, 10]}
                    display="flex"
                    justifyContent="center"
                    w="full"
                >
                    <TerminalMock />
                </Box>
            </Grid>
        </Card>
    );
}
````

## Source: `examples/homepage/src/app/components/features/AISection/index.ts`

````typescript
export { AISection } from './AISection';
````

## Source: `examples/homepage/src/app/components/features/AISkillsSection/AISkillsSection.tsx`

````tsx
'use client';

import {
    VStack,
    HStack,
    Heading,
    Text,
    Card,
    Box,
    Button,
    IconButton,
    SimpleGrid,
    Icon,
    Stack,
    useColorMode,
    useColorModeValue,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LuCopy, LuCheck, LuGithub, LuSparkles } from 'react-icons/lu';

const CLI_COMMAND = 'npx skills add vechain/vechain-ai-skills';
const CLAUDE_COMMAND = '/plugin marketplace add vechain/vechain-ai-skills';
const REPO_URL = 'https://github.com/vechain/vechain-ai-skills';

const SKILLS: { name: string; descKey: string }[] = [
    { name: 'vechain-dev', descKey: 'Core SDK, fee delegation, multi-clause transactions.' },
    { name: 'vechain-kit', descKey: 'Frontend dApps, wallet, social login, hooks.' },
    { name: 'smart-contract-development', descKey: 'Solidity, Hardhat, testing, security.' },
    { name: 'vebetterdao', descKey: 'X2Earn apps, B3TR/VOT3, governance.' },
    { name: 'stargate', descKey: 'NFT staking, validators, delegation.' },
    { name: 'create-vechain-dapp', descKey: 'Scaffold a VeChain dApp in seconds.' },
    { name: 'vechain-react-native-dev', descKey: 'VeWorld deep-link integration.' },
    { name: 'indexer-core', descKey: 'Index VeChain events and blocks for apps or analytics.' },
    { name: 'auto-voting-relayers', descKey: 'Auto-voting & relayer system.' },
    { name: 'translate', descKey: 'i18n translation management across locales.' },
    { name: 'grill-me', descKey: 'Pressure-tests your plan before you write code.' },
];

function TerminalBlock({
    command,
    label,
}: {
    command: string;
    label: string;
}) {
    const { t } = useTranslation();
    const [copied, setCopied] = useState(false);

    const bgColor = useColorModeValue('#1a1a1a', '#0d1117');
    const textColor = '#c9d1d9';
    const promptColor = '#58a6ff';
    const borderColor = useColorModeValue('#30363d', '#21262d');
    const labelColor = useColorModeValue('gray.600', 'gray.400');

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(command);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Silently fail if clipboard access is not available
        }
    };

    return (
        <VStack align="stretch" spacing={2} w="full">
            <Text
                fontSize="sm"
                fontWeight="medium"
                color={labelColor}
                textAlign="left"
            >
                {label}
            </Text>
            <Box
                position="relative"
                bg={bgColor}
                borderRadius="lg"
                borderWidth="1px"
                borderColor={borderColor}
                p={4}
                fontFamily="monospace"
                w="full"
                overflowX="auto"
            >
                <HStack spacing={3} align="center">
                    <Text color={promptColor} fontSize="md" fontWeight="bold">
                        $
                    </Text>
                    <Text
                        color={textColor}
                        fontSize="md"
                        flex={1}
                        textAlign="left"
                    >
                        {command}
                    </Text>
                    <IconButton
                        aria-label={t('Copy command')}
                        icon={<Icon as={copied ? LuCheck : LuCopy} />}
                        onClick={handleCopy}
                        size="sm"
                        variant="ghost"
                        color={textColor}
                        _hover={{ bg: 'rgba(255, 255, 255, 0.1)' }}
                    />
                </HStack>
            </Box>
        </VStack>
    );
}

function PromptExample() {
    const { t } = useTranslation();
    const { colorMode } = useColorMode();

    const bubbleBg = useColorModeValue('#f6f8fa', '#161b22');
    const bubbleBorder = useColorModeValue('#d0d7de', '#30363d');
    const userBg = useColorModeValue('#dae8fb', '#1f6feb');
    const userColor = useColorModeValue('gray.900', 'white');
    const agentColor = useColorModeValue('gray.700', 'gray.300');

    return (
        <Box
            w="full"
            borderWidth="1px"
            borderColor={bubbleBorder}
            borderRadius="xl"
            bg={bubbleBg}
            p={{ base: 5, md: 7 }}
        >
            <VStack align="stretch" spacing={4}>
                <HStack align="flex-start" spacing={3}>
                    <Icon
                        as={LuSparkles}
                        boxSize={5}
                        mt={1}
                        color={
                            colorMode === 'dark' ? 'blue.300' : 'blue.500'
                        }
                    />
                    <Box
                        bg={userBg}
                        color={userColor}
                        px={4}
                        py={3}
                        borderRadius="lg"
                        flex={1}
                    >
                        <Text fontSize={{ base: 'sm', md: 'md' }}>
                            {t(
                                'Scaffold a new VeChain dApp with social login, then add a B3TR reward distribution contract.',
                            )}
                        </Text>
                    </Box>
                </HStack>
                <Text
                    fontSize={{ base: 'sm', md: 'md' }}
                    color={agentColor}
                    pl={8}
                >
                    {t(
                        '→ Agent picks the right skills automatically: create-vechain-dapp + vechain-kit + vebetterdao.',
                    )}
                </Text>
            </VStack>
        </Box>
    );
}

function SkillCard({ name, description }: { name: string; description: string }) {
    const { colorMode } = useColorMode();
    const bg = useColorModeValue('white', '#161b22');
    const borderColor = useColorModeValue('#d0d7de', '#30363d');
    const nameColor = useColorModeValue('gray.900', 'white');
    const descColor = useColorModeValue('gray.600', 'gray.400');

    return (
        <Box
            bg={bg}
            borderWidth="1px"
            borderColor={borderColor}
            borderRadius="lg"
            px={4}
            py={3}
            transition="transform 0.15s ease, box-shadow 0.15s ease"
            _hover={{
                transform: 'translateY(-2px)',
                boxShadow:
                    colorMode === 'dark'
                        ? '0 4px 12px rgba(0,0,0,0.4)'
                        : '0 4px 12px rgba(0,0,0,0.08)',
            }}
        >
            <VStack align="start" spacing={1}>
                <Text
                    fontFamily="monospace"
                    fontSize="sm"
                    fontWeight="bold"
                    color={nameColor}
                >
                    {name}
                </Text>
                <Text fontSize="xs" color={descColor}>
                    {description}
                </Text>
            </VStack>
        </Box>
    );
}

export function AISkillsSection() {
    const { colorMode } = useColorMode();
    const { t } = useTranslation();

    return (
        <Card
            id="ai-skills"
            variant="section"
            py={{ base: 16, md: 20 }}
            px={{ base: 4, md: 8 }}
        >
            <VStack
                spacing={10}
                align="center"
                maxW="5xl"
                mx="auto"
                w="full"
                textAlign="center"
            >
                <VStack spacing={4}>
                    <HStack spacing={2}>
                        <Icon
                            as={LuSparkles}
                            boxSize={6}
                            color={
                                colorMode === 'dark' ? 'blue.300' : 'blue.500'
                            }
                        />
                        <Text
                            fontSize="sm"
                            fontWeight="bold"
                            letterSpacing="wider"
                            textTransform="uppercase"
                            color={
                                colorMode === 'dark' ? 'blue.300' : 'blue.500'
                            }
                        >
                            {t('VeChain AI Skills')}
                        </Text>
                    </HStack>
                    <Heading
                        as="h2"
                        fontSize={{ base: '2xl', md: '3xl' }}
                        fontWeight="bold"
                        color={colorMode === 'dark' ? 'white' : 'gray.900'}
                    >
                        {t('Ship VeChain dApps with AI')}
                    </Heading>
                    <Text
                        fontSize={{ base: 'lg', md: 'xl' }}
                        color={colorMode === 'dark' ? 'gray.300' : 'gray.600'}
                        maxW="3xl"
                    >
                        {t(
                            'Give your coding agent deep VeChain domain knowledge — wallet UX, smart contracts, VeBetterDAO, StarGate, and more. Works with Claude Code, Cursor, and any agent.',
                        )}
                    </Text>
                </VStack>

                <Stack
                    direction={{ base: 'column', md: 'row' }}
                    spacing={4}
                    w="full"
                    maxW="3xl"
                    align="stretch"
                >
                    <TerminalBlock
                        command={CLI_COMMAND}
                        label={t('Any agent (Skills CLI)')}
                    />
                    <TerminalBlock
                        command={CLAUDE_COMMAND}
                        label={t('Claude Code')}
                    />
                </Stack>

                <VStack spacing={4} w="full" align="stretch">
                    <Text
                        fontSize="sm"
                        fontWeight="bold"
                        letterSpacing="wider"
                        textTransform="uppercase"
                        color={
                            colorMode === 'dark' ? 'gray.400' : 'gray.500'
                        }
                        textAlign="center"
                    >
                        {t('Available skills')}
                    </Text>
                    <SimpleGrid
                        columns={{ base: 1, sm: 2, lg: 3 }}
                        spacing={3}
                        w="full"
                    >
                        {SKILLS.map((skill) => (
                            <SkillCard
                                key={skill.name}
                                name={skill.name}
                                description={t(skill.descKey)}
                            />
                        ))}
                    </SimpleGrid>
                </VStack>

                <VStack spacing={4} w="full" maxW="3xl">
                    <Text
                        fontSize="sm"
                        fontWeight="bold"
                        letterSpacing="wider"
                        textTransform="uppercase"
                        color={
                            colorMode === 'dark' ? 'gray.400' : 'gray.500'
                        }
                    >
                        {t('Try a prompt')}
                    </Text>
                    <PromptExample />
                </VStack>

                <Button
                    as="a"
                    href={REPO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="homepagePrimary"
                    size="lg"
                    leftIcon={<Icon as={LuGithub} />}
                >
                    {t('View on GitHub')}
                </Button>
            </VStack>
        </Card>
    );
}
````

## Source: `examples/homepage/src/app/components/features/AISkillsSection/index.ts`

````typescript
export { AISkillsSection } from './AISkillsSection';
````

## Source: `examples/homepage/src/app/components/features/AccountInfo/AccountInfo.tsx`

````tsx
'use client';

import {
    Box,
    Heading,
    Text,
    VStack,
    Icon,
    Alert,
    AlertIcon,
    AlertDescription,
    SimpleGrid,
} from '@chakra-ui/react';
import { useWallet } from '@vechain/vechain-kit';
import { LuWallet, LuWalletCards } from 'react-icons/lu';

export function AccountInfo() {
    const { smartAccount, connectedWallet, connection } = useWallet();

    return (
        <Box
            p={8}
            borderRadius="lg"
            boxShadow="xl"
            bg="whiteAlpha.100"
            backdropFilter="blur(10px)"
        >
            <VStack spacing={6} align="stretch">
                <Heading size="lg" textAlign="left">
                    Your Account Details
                </Heading>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    {smartAccount.address && (
                        <VStack
                            spacing={4}
                            p={6}
                            borderRadius="md"
                            bg="whiteAlpha.50"
                        >
                            <Icon as={LuWalletCards} boxSize={8} />
                            <Text fontWeight="bold">Smart Account</Text>
                            <VStack spacing={3} align="start">
                                <Text>
                                    <Text as="span" fontWeight="bold">
                                        Address:{' '}
                                    </Text>
                                    {smartAccount.address}
                                </Text>
                                <Text>
                                    <Text as="span" fontWeight="bold">
                                        Deployed:{' '}
                                    </Text>
                                    {smartAccount.isDeployed.toString()}
                                </Text>
                            </VStack>
                        </VStack>
                    )}

                    <VStack
                        spacing={4}
                        p={6}
                        borderRadius="md"
                        bg="whiteAlpha.50"
                    >
                        <Icon as={LuWallet} boxSize={8} />
                        <Text fontWeight="bold">
                            {connection.isConnectedWithPrivy
                                ? 'Embedded Wallet'
                                : 'Wallet'}
                        </Text>
                        <Text>
                            <Text as="span" fontWeight="bold">
                                Address:{' '}
                            </Text>
                            {connectedWallet?.address}
                        </Text>
                    </VStack>
                </SimpleGrid>

                <Alert status="info" bg="whiteAlpha.200">
                    <AlertIcon />
                    <AlertDescription fontSize="xs">
                        Smart accounts are not immediately deployed on login but
                        only after first action done by the user, avoiding
                        unnecessary money spent on gas.
                    </AlertDescription>
                </Alert>
            </VStack>
        </Box>
    );
}
````

## Source: `examples/homepage/src/app/components/features/AccountInfo/index.ts`

````typescript
export * from './AccountInfo';
````

## Source: `examples/homepage/src/app/components/features/AppShowcase/AppCard.tsx`

````tsx
'use client';

import {
    Box,
    Flex,
    VStack,
    HStack,
    Text,
    Image,
    Badge,
    Card,
    Icon,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { AppData } from './appData';
import { LuExternalLink } from 'react-icons/lu';

interface AppCardProps {
    app: AppData;
}

// Theme colors matching ScrollableInfoSections
const cardBackgroundColors = [
    '#e0daea', // light purple
    '#dae8fb', // light blue
    '#eae3d1', // light beige
    '#f0e8d8', // light tan
    '#e1e5e4', // light grey-green
    '#e0daea', // light purple (repeat)
    '#dae8fb', // light blue (repeat)
];

// Get a consistent color for each app based on its id
const getCardBgColor = (appId: string): string => {
    const appIds = [
        'stargate',
        'vebetter',
        'cleanify',
        'betterswap',
        'vetrade',
        'velottery',
        'solarwise',
    ];
    const appIndex = appIds.indexOf(appId);
    return cardBackgroundColors[appIndex >= 0 ? appIndex : 0];
};

export function AppCard({ app }: AppCardProps) {
    const { t } = useTranslation();
    const cardBg = getCardBgColor(app.id);

    return (
        <Card
            bg={cardBg}
            borderRadius="25px"
            overflow="hidden"
            boxShadow="lg"
            width="100%"
            height="100%"
            display="flex"
            flexDirection="column"
            p={0}
        >
            {/* Image Banner */}
            <Box
                position="relative"
                width="100%"
                height="200px"
                overflow="hidden"
                borderRadius="25px 25px 0 0"
            >
                <Image
                    src={app.image}
                    alt={app.name}
                    width="100%"
                    height="100%"
                    objectFit="cover"
                />
            </Box>

            {/* Card Body */}
            <VStack spacing={0} align="stretch" flex={1} p={6}>
                {/* Logo, Name, Tag, and Description */}
                <VStack spacing={4} align="stretch" flex={1}>
                    {/* Logo, Name, and Tag */}
                    <Flex justify="space-between" align="center">
                        <HStack spacing={3}>
                            <Image
                                src={app.logo}
                                alt={`${app.name} logo`}
                                width="40px"
                                height="40px"
                                borderRadius="md"
                                bg="white"
                                p={1}
                            />
                            <Text
                                fontSize="xl"
                                fontWeight="bold"
                                color="gray.900"
                            >
                                {app.name}
                            </Text>
                        </HStack>
                        <Badge
                            bg="white"
                            color="gray.700"
                            px={3}
                            py={1}
                            borderRadius="full"
                            fontSize="xs"
                            fontWeight="medium"
                            boxShadow="sm"
                        >
                            {app.tag}
                        </Badge>
                    </Flex>

                    {/* Description */}
                    <Text
                        fontSize="md"
                        color="gray.700"
                        lineHeight="1.6"
                        noOfLines={10}
                        whiteSpace="pre-line"
                    >
                        {app.description}
                    </Text>
                </VStack>

                {/* Visit Button */}
                <Box
                    as="a"
                    href={app.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    bg="gray.900"
                    color="white"
                    _hover={{
                        bg: 'gray.800',
                    }}
                    borderRadius="xl"
                    px={4}
                    py={2}
                    width="100%"
                    fontWeight="medium"
                    textDecoration="none"
                    mt={4}
                    cursor="pointer"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    gap={2}
                    transition="background-color 0.2s"
                >
                    {t('Visit')}
                    <Icon as={LuExternalLink} />
                </Box>
            </VStack>
        </Card>
    );
}
````

## Source: `examples/homepage/src/app/components/features/AppShowcase/AppShowcase.tsx`

````tsx
'use client';

import { Card, Heading, Text, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Carousel } from '@/app/components/ui/Carousel';
import { AppCard } from './AppCard';
import { getApps, AppData } from './appData';

export function AppShowcase() {
    const { t } = useTranslation();
    const apps = getApps(t);
    return (
        <Card
            variant="section"
            py={{ base: 16, md: 20 }}
            px={{ base: 4, md: 8 }}
        >
            <VStack spacing={8} align="stretch" maxW="7xl" mx="auto" w="full">
                <Heading as="h2" size="lg" textAlign="center">
                    {t('Apps Built with VeKit')}
                </Heading>

                <Text textAlign="center" fontSize="lg" color="gray.500">
                    {t(
                        'Discover all the possible ways to use the VeKit to build your next dApp.',
                    )}
                </Text>

                <Carousel<AppData>
                    items={apps}
                    renderItem={(app) => <AppCard app={app} />}
                    itemWidth={350}
                    itemSpacing={24}
                    wideMode={true}
                    blurSideItems={true}
                    infiniteLoop={true}
                />
            </VStack>
        </Card>
    );
}
````

## Source: `examples/homepage/src/app/components/features/AppShowcase/appData.ts`

````typescript
import { TFunction } from 'i18next';

export interface AppData {
    id: string;
    name: string;
    logo: string;
    image: string;
    tag: string;
    description: string;
    url: string;
}

export const getApps = (t: TFunction): AppData[] => [
    {
        id: 'velottery',
        name: 'VeLottery',
        logo: 'https://api.gateway-proxy.vechain.org/ipfs/bafybeigtlombd3jplbq33k2m2p5cbrbniznv4fnr3bbh2hxxackh5bpcqy/media/logo.png',
        image: 'https://api.gateway-proxy.vechain.org/ipfs/bafybeigtlombd3jplbq33k2m2p5cbrbniznv4fnr3bbh2hxxackh5bpcqy/media/ve_world_banner.png',
        tag: t('Gaming'),
        description: t(
            'Uses VeKit end-to-end: login, wallet, hooks, and transaction components.',
        ),
        url: 'https://velottery.vet/',
    },
    {
        id: 'vebetter',
        name: 'VeBetter',
        logo: 'https://prod-vechainkit-docs-images-bucket.s3.eu-west-1.amazonaws.com/vebetter-512x512.png',
        image: 'https://governance.vebetterdao.org/assets/images/platform_page.webp',
        tag: t('DAO'),
        description: t(
            'VeKit UI is fully integrated into the app, using a bottom sheet UX on mobile to enhance the user experience.',
        ),
        url: 'https://governance.vebetterdao.org/',
    },
    {
        id: 'cleanify',
        name: 'Cleanify',
        logo: 'https://api.gateway-proxy.vechain.org/ipfs/bafybeicvr6ivkwv2iygkgcijbmjaorfyi4gui2bjskhwuitop7n3tqo24m/media/logo.png',
        image: 'https://api.gateway-proxy.vechain.org/ipfs/bafybeicvr6ivkwv2iygkgcijbmjaorfyi4gui2bjskhwuitop7n3tqo24m/media/ve_world_featured_image.png',
        tag: t('Sustainability'),
        description: t(
            'Uses its own Privy setup for social login OAuth2 based methods like Google and Apple.',
        ),
        url: 'https://app.cleanify.vet/',
    },
    {
        id: 'stargate',
        name: 'StarGate',
        logo: 'https://prod-vechainkit-docs-images-bucket.s3.eu-west-1.amazonaws.com/stargate-icon.png',
        image: 'https://prod-vechainkit-docs-images-bucket.s3.eu-west-1.amazonaws.com/banner.png',
        tag: t('Staking'),
        description: t(
            'Supports only VeWorld, WalletConnect, and Sync2 wallets, and fully integrates VeKit UI into the app to enhance the user experience Profile and Wallet modals.',
        ),
        url: 'https://app.stargate.vechain.org/',
    },

    {
        id: 'betterswap',
        name: 'BetterSwap',
        logo: 'https://api.gateway-proxy.vechain.org/ipfs/bafybeifqy6ojar5aryglbbpvsm7pqz4tn76ruf5nh4vwsb4lc6um5ehvfi/media/logo.png',
        image: 'https://api.gateway-proxy.vechain.org/ipfs/bafybeifqy6ojar5aryglbbpvsm7pqz4tn76ruf5nh4vwsb4lc6um5ehvfi/media/ve_world_featured_image.png',
        tag: t('DeFi'),
        description: t(
            'Uses VeKit to allow social login users to trade on the platform.',
        ),
        url: 'https://www.betterswap.io',
    },
    {
        id: 'vetrade',
        name: 'VeTrade',
        logo: 'https://api.gateway-proxy.vechain.org/ipfs/bafybeihgqfn2fjdjg5pcfdygwbhl5e56vmkvj6rm3dzw4fqfxz6v5njf2u/media/logo.jpeg',
        image: 'https://api.gateway-proxy.vechain.org/ipfs/bafybeihgqfn2fjdjg5pcfdygwbhl5e56vmkvj6rm3dzw4fqfxz6v5njf2u/media/ve_world_banner.jpeg',
        tag: t('Trading'),
        description: t(
            'Uses VeKit only for the login flow and for the hooks to manage transactions.',
        ),
        url: 'https://vetrade.vet/',
    },
    {
        id: 'solarwise',
        name: 'Solarwise',
        logo: 'https://api.gateway-proxy.vechain.org/ipfs/bafybeibdjnbjssp66rssj7gmmnsd3l3ljdmckxxxrouosx2dtuapzyxarq/media/logo.png',
        image: 'https://api.gateway-proxy.vechain.org/ipfs/bafybeibdjnbjssp66rssj7gmmnsd3l3ljdmckxxxrouosx2dtuapzyxarq/media/ve_world_featured_image.png',
        tag: t('Energy'),
        description: t(
            'Lightweight integration to allow social login users to use the platform and manage their energy assets.',
        ),
        url: 'https://app.solarwise.vet/',
    },
];
````

## Source: `examples/homepage/src/app/components/features/AppShowcase/index.ts`

````typescript
export { AppShowcase } from './AppShowcase';
````

## Source: `examples/homepage/src/app/components/features/BoostedDevSection/BoostedDevSection.tsx`

````tsx
'use client';

import {
    Card,
    Grid,
    VStack,
    Heading,
    Text,
    HStack,
    Box,
    useColorMode,
} from '@chakra-ui/react';

interface BoostedDevSectionProps {
    bg?: string;
    title: string;
    content: string;
}

const COLORS = {
    keyword: '#ff7b72',
    fn: '#7ee787',
    variable: '#79c0ff',
    string: '#a5d6ff',
    comment: '#8b949e',
    text: '#e6edf3',
};

type Token = { t: string; c: string };

const k = (t: string): Token => ({ t, c: COLORS.keyword });
const fn = (t: string): Token => ({ t, c: COLORS.fn });
const v = (t: string): Token => ({ t, c: COLORS.variable });
const s = (t: string): Token => ({ t, c: COLORS.string });
const c = (t: string): Token => ({ t, c: COLORS.comment });
const x = (t: string): Token => ({ t, c: COLORS.text });

const LINES: Token[][] = [
    [k('import'), x(' {')],
    [x('  '), v('useWallet'), x(',')],
    [x('  '), v('useThor'), x(',')],
    [x('  '), v('useBuildTransaction'), x(',')],
    [x('} '), k('from'), x(' '), s('"@vechain/vechain-kit"'), x(';')],
    [],
    [k('function'), x(' '), fn('MyComponent'), x('() {')],
    [x('  '), c('// Manage the wallet')],
    [
        x('  '),
        k('const'),
        x(' { '),
        v('account'),
        x(', '),
        v('connection'),
        x(', '),
        v('disconnect'),
        x(' } = '),
        fn('useWallet'),
        x('()'),
    ],
    [],
    [x('  '), c('// Interact with Thor provider')],
    [x('  '), k('const'), x(' '), v('thor'), x(' = '), fn('useThor'), x('()')],
    [],
    [x('  '), c('// Send transaction')],
    [x('  '), k('const'), x(' {')],
    [x('      '), v('sendTransaction'), x(',')],
    [x('      '), v('status'), x(',')],
    [x('      '), v('txReceipt'), x(',')],
    [x('  } = '), fn('useBuildTransaction'), x('({})')],
    [],
    [x('  '), k('return'), x(' <></>')],
    [x('}')],
];

function CodeWindow() {
    return (
        <Box
            bg="#1f2229"
            borderRadius="xl"
            w={['90%', '550px']}
            maxW="100%"
            boxShadow="0 10px 30px rgba(0,0,0,0.25)"
            overflow="hidden"
        >
            <HStack
                spacing={2}
                px={4}
                py={3}
                bg="#2a2d36"
                position="relative"
            >
                <Box w={3} h={3} borderRadius="full" bg="#ff5f57" />
                <Box w={3} h={3} borderRadius="full" bg="#febc2e" />
                <Box w={3} h={3} borderRadius="full" bg="#28c840" />
                <Text
                    position="absolute"
                    left="50%"
                    transform="translateX(-50%)"
                    color="#8b949e"
                    fontSize="sm"
                    fontFamily="monospace"
                >
                    My App
                </Text>
            </HStack>
            <Box
                px={5}
                py={4}
                fontFamily="monospace"
                fontSize={{ base: 'xs', md: 'sm' }}
                lineHeight="1.6"
                overflowX="auto"
            >
                {LINES.map((line, i) => (
                    <Box key={i} whiteSpace="pre" minH="1.6em">
                        {line.length === 0 ? (
                            <Text as="span">{' '}</Text>
                        ) : (
                            line.map((tok, j) => (
                                <Text
                                    key={j}
                                    as="span"
                                    color={tok.c}
                                    fontStyle={
                                        tok.c === COLORS.comment
                                            ? 'italic'
                                            : 'normal'
                                    }
                                >
                                    {tok.t}
                                </Text>
                            ))
                        )}
                    </Box>
                ))}
            </Box>
        </Box>
    );
}

export function BoostedDevSection({
    bg = '#dae8fb',
    title,
    content,
}: BoostedDevSectionProps) {
    const { colorMode } = useColorMode();

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
                templateColumns={[
                    'minmax(0, 1fr)',
                    'repeat(2, minmax(0, 1fr))',
                ]}
                gap={4}
                placeItems={'center center'}
                alignItems={'center'}
                w="full"
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
                        color={colorMode === 'dark' ? 'gray.400' : 'gray.700'}
                    >
                        {content}
                    </Text>
                </VStack>

                <Box
                    p={[6, 10]}
                    display="flex"
                    justifyContent="center"
                    w="full"
                >
                    <CodeWindow />
                </Box>
            </Grid>
        </Card>
    );
}
````

## Source: `examples/homepage/src/app/components/features/BoostedDevSection/index.ts`

````typescript
export { BoostedDevSection } from './BoostedDevSection';
````

## Source: `examples/homepage/src/app/components/features/ConnectionInfo/ConnectionInfo.tsx`

````tsx
'use client';

import { VStack, Text } from '@chakra-ui/react';
import { useWallet } from '@vechain/vechain-kit';
import { LuShield } from 'react-icons/lu';
import { CollapsibleCard } from '../../ui/CollapsibleCard';

export function ConnectionInfo() {
    const { connection } = useWallet();

    const getConnectionDescription = () => {
        switch (connection.source.type) {
            case 'privy':
                return "You're connected using Privy authentication, which provides a dedicated user management system for this application.";
            case 'privy-cross-app':
                return "You're connected through the VeChain cross-app ecosystem, sharing authentication with other VeChain apps like Cleanify or Mugshot.";
            case 'wallet':
                return "You're connected directly through a Web3 wallet (VeWorld, Sync2, or WalletConnect).";
            default:
                return 'Connection type not recognized.';
        }
    };

    return (
        <CollapsibleCard
            title="Your Connection Source"
            icon={LuShield}
            style={{ bg: 'whiteAlpha.100' }}
        >
            <VStack spacing={4} p={6} borderRadius="md" bg="whiteAlpha.50">
                <Text>
                    <Text as="span" fontWeight="bold">
                        Type:{' '}
                    </Text>
                    {connection.source.type}
                </Text>
                <Text>
                    <Text as="span" fontWeight="bold">
                        Network:{' '}
                    </Text>
                    {connection.network}
                </Text>
                <Text textAlign="center">{getConnectionDescription()}</Text>
            </VStack>
        </CollapsibleCard>
    );
}
````

## Source: `examples/homepage/src/app/components/features/ConnectionInfo/index.ts`

````typescript
export * from './ConnectionInfo';
````

## Source: `examples/homepage/src/app/components/features/DaoInfo/DaoInfo.tsx`

````tsx
'use client';

import { VStack, Text, SimpleGrid } from '@chakra-ui/react';
import { LuBuilding2 } from 'react-icons/lu';
import { CollapsibleCard } from '../../ui/CollapsibleCard';
import {
    useWallet,
    useCurrentAllocationsRoundId,
    useIsPerson,
} from '@vechain/vechain-kit';

export function DaoInfo() {
    const { account } = useWallet();
    const { data: currentAllocationsRoundId } = useCurrentAllocationsRoundId();
    const { data: isValidPassport } = useIsPerson(account?.address);

    return (
        <CollapsibleCard
            title="Contract Interactions"
            icon={LuBuilding2}
            style={{ bg: 'whiteAlpha.100' }}
        >
            <VStack spacing={6} align="stretch">
                <Text textAlign="center">
                    VeKit provides hooks to easily interact with popular
                    VeChain contracts. Here's how to use them in your
                    application.
                </Text>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    {/* Current Implementation */}
                    <VStack
                        spacing={4}
                        p={6}
                        borderRadius="md"
                        bg="whiteAlpha.50"
                    >
                        <Text fontWeight="bold">Live VeBetterDAO Data</Text>
                        <VStack spacing={3} align="start" w="full">
                            <Text>
                                <Text as="span" fontWeight="bold">
                                    Current Round ID:{' '}
                                </Text>
                                {currentAllocationsRoundId}
                            </Text>
                            <Text>
                                <Text as="span" fontWeight="bold">
                                    Valid Passport:{' '}
                                </Text>
                                {isValidPassport?.toString()}
                            </Text>
                        </VStack>
                    </VStack>
                </SimpleGrid>
            </VStack>
        </CollapsibleCard>
    );
}
````

## Source: `examples/homepage/src/app/components/features/DaoInfo/index.ts`

````typescript
export * from './DaoInfo';
````

## Source: `examples/homepage/src/app/components/features/DataReading/DataReadingExample.tsx`

````tsx
'use client';

import { ReactElement } from 'react';
import {
    VStack,
    Text,
    SimpleGrid,
    Button,
    Code,
    Box,
    Link,
    Heading,
} from '@chakra-ui/react';
import {
    useWallet,
    useGetB3trBalance,
    useGetVot3Balance,
    useGetTokenUsdPrice,
    useCurrentAllocationsRoundId,
} from '@vechain/vechain-kit';
import { LuDatabase } from 'react-icons/lu';
import { CollapsibleCard } from '../../ui/CollapsibleCard';

export function DataReadingExample(): ReactElement {
    const { account } = useWallet();
    const address = account?.address || '';

    // Example hooks for reading data
    const { data: b3trBalance, isLoading: isLoadingB3tr } =
        useGetB3trBalance(address);
    const { data: vot3Balance, isLoading: isLoadingVot3 } =
        useGetVot3Balance(address);
    const { data: vetPrice, isLoading: isLoadingVetPrice } =
        useGetTokenUsdPrice('VET');
    const { data: vbdCurrentRoundId } = useCurrentAllocationsRoundId();

    return (
        <CollapsibleCard
            defaultIsOpen={false}
            title="Reading Blockchain Data"
            icon={LuDatabase}
            style={{ bg: 'whiteAlpha.100' }}
        >
            <VStack spacing={6} align="stretch">
                <Text textAlign="center">
                    VeKit provides hooks to easily read data from the
                    blockchain. Here are some examples using built-in hooks.
                </Text>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    {/* Live Data Display */}
                    <VStack
                        spacing={4}
                        p={6}
                        borderRadius="md"
                        bg="whiteAlpha.50"
                    >
                        <Text fontWeight="bold">Live Blockchain Data</Text>
                        <VStack spacing={3} align="start" w="full">
                            <Text>
                                <Text as="span" fontWeight="bold">
                                    B3TR Balance:{' '}
                                </Text>
                                {isLoadingB3tr
                                    ? 'Loading...'
                                    : b3trBalance?.formatted || '0'}
                            </Text>
                            <Text>
                                <Text as="span" fontWeight="bold">
                                    VOT3 Balance:{' '}
                                </Text>
                                {isLoadingVot3
                                    ? 'Loading...'
                                    : vot3Balance?.formatted || '0'}
                            </Text>
                            <Text>
                                <Text as="span" fontWeight="bold">
                                    VET Price:{' '}
                                </Text>
                                {isLoadingVetPrice
                                    ? 'Loading...'
                                    : `$${vetPrice?.toFixed(4) || '0'}`}
                            </Text>
                            <VStack mt={4} align="start" spacing={1}>
                                <Heading size="sm">VeBetterDAO</Heading>
                                <Text fontWeight="bold">
                                    Current round: {vbdCurrentRoundId}
                                </Text>
                            </VStack>
                        </VStack>
                    </VStack>

                    {/* Code Example */}
                    <VStack
                        spacing={4}
                        p={6}
                        borderRadius="md"
                        bg="whiteAlpha.50"
                    >
                        <Text fontWeight="bold">Implementation Example</Text>
                        <Box
                            w="full"
                            p={3}
                            bg="blackAlpha.300"
                            borderRadius="md"
                        >
                            <Code
                                display="block"
                                whiteSpace="pre"
                                p={2}
                                overflowX="auto"
                            >
                                {`// Import hooks
import {
    useGetB3trBalance,
    useGetTokenUsdPrice,
} from '@vechain/vechain-kit';

// Use hooks in your component
const { data: b3trBalance } =
    useGetB3trBalance(address);
const { data: vetPrice } =
    useGetTokenUsdPrice('VET');`}
                            </Code>
                        </Box>
                        <Button
                            as={Link}
                            isExternal
                            href="https://docs.vechainkit.vechain.org/vechain-kit/hooks"
                            w="full"
                            variant="outline"
                            rightIcon={<LuDatabase />}
                        >
                            View Full Documentation
                        </Button>
                    </VStack>
                </SimpleGrid>

                <Text fontSize="sm" textAlign="center" color="gray.400">
                    Note: These hooks use react-query under the hood for
                    efficient data fetching and caching.
                </Text>
            </VStack>
        </CollapsibleCard>
    );
}
````

## Source: `examples/homepage/src/app/components/features/DataReading/index.ts`

````typescript
export * from './DataReadingExample';
````

## Source: `examples/homepage/src/app/components/features/FAQSection/FAQSection.tsx`

````tsx
'use client';

import {
    VStack,
    Heading,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Text,
    Box,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

export function FAQSection() {
    const { t } = useTranslation();
    const faqItems = [
        {
            question: t('Is the kit free to use?'),
            answer: t(
                'Yes — free for the shared VeChain + Privy integration. Bring your own Privy account if you want full control over the login UX (Privy pricing applies).',
            ),
        },
        {
            question: t('Are there any limitations?'),
            answer: t(
                "Yes. To support all login methods, use the kit's hooks (useSendTransaction, useSignMessage). For full control over the login UX, bring your own Privy account — the shared VeChain + Privy integration can't target specific social methods and always prompts for signatures.",
            ),
        },
        {
            question: t('What are the supported frameworks?'),
            answer: t('The kit supports Next.js and React.'),
        },
        {
            question: t('Can I customize the login methods shown to users?'),
            answer: t(
                'Yes. You can decide to use only veworld, or only social login methods. To maximize flexibility, you can also use your own Privy account and connect it to VeKit, allowing you to use OAuth2-based login methods like Google, Apple, Twitter, GitHub, etc. and completely customize the login experience.',
            ),
        },
        {
            question: t('What can I customize?'),
            answer: t(
                'Color, fonts, background color, etc. You can create your own login button, and modal or use the provided one. You can decide to show or not the wallet or transaction modal, or show only specific contents (Send, Receive, Assets, Profile, etc.).',
            ),
        },
        {
            question: t('Who pays for the transactions?'),
            answer: t(
                'The user pays for the transactions. However, if you want to sponsor them (always or only in specific scenarios), you can use the fee delegation feature.',
            ),
        },
    ];

    return (
        <VStack
            py={{ base: 12, md: 16 }}
            px={{ base: 4, md: 8 }}
            spacing={8}
            align="stretch"
            maxW="4xl"
            mx="auto"
            w="full"
        >
            <Heading as="h2" size="lg" textAlign="center">
                {t('Frequently Asked Questions')}
            </Heading>

            <Accordion allowMultiple defaultIndex={[0]}>
                {faqItems.map((item, index) => (
                    <AccordionItem key={index} border="none" mb={4}>
                        <h3>
                            <AccordionButton
                                bg="#e3ebe1"
                                color="black"
                                borderRadius="md"
                                rounded="xl"
                                _hover={{ bg: '#e2eae0' }}
                            >
                                <Box
                                    as="span"
                                    flex="1"
                                    textAlign="left"
                                    fontWeight="medium"
                                >
                                    {item.question}
                                </Box>
                                <AccordionIcon />
                            </AccordionButton>
                        </h3>
                        <AccordionPanel pb={4} pt={4} px={6}>
                            <Text>{item.answer}</Text>
                        </AccordionPanel>
                    </AccordionItem>
                ))}
            </Accordion>
        </VStack>
    );
}
````

## Source: `examples/homepage/src/app/components/features/FAQSection/index.ts`

````typescript
export * from './FAQSection';
````

## Source: `examples/homepage/src/app/components/features/FeatureSection/FeatureSection.tsx`

````tsx
'use client';

import { Card, VStack, Text, Heading, HStack, Icon, useColorMode, Stack } from '@chakra-ui/react';
import { ReactElement } from 'react';

type FeatureVariant = 'purple' | 'blue' | 'beige' | 'green' | 'grey' | 'dark';

interface FeatureSectionProps {
    title: string;
    description: string;
    icon?: React.ElementType;
    variant?: FeatureVariant;
    reverse?: boolean;
}

const variantMap: Record<FeatureVariant, string> = {
    purple: 'featurePurple',
    blue: 'featureBlue',
    beige: 'featureBeige',
    green: 'featureGreen',
    grey: 'featureGrey',
    dark: 'featureDark',
};

export function FeatureSection({
    title,
    description,
    icon,
    variant = 'purple',
    reverse = false,
}: FeatureSectionProps) {
    const { colorMode } = useColorMode();
    const cardVariant = variantMap[variant];

    return (
        <Card variant={cardVariant as any} py={{ base: 12, md: 16 }} px={{ base: 6, md: 12 }}>
            <Stack
                direction={{ base: 'column', md: reverse ? 'row-reverse' : 'row' }}
                spacing={8}
                align={{ base: 'flex-start', md: 'center' }}
            >
                <VStack
                    flex={1}
                    align={{ base: 'flex-start', md: reverse ? 'flex-end' : 'flex-start' }}
                    spacing={4}
                    minW={{ base: '100%', md: '300px' }}
                >
                    {icon && (
                        <Icon
                            as={icon}
                            boxSize={8}
                            color={colorMode === 'dark' ? 'primary.400' : 'primary.600'}
                        />
                    )}
                    <Heading
                        as="h2"
                        fontSize={{ base: 'xl', md: '2xl' }}
                        fontWeight="bold"
                        color={colorMode === 'dark' ? 'white' : 'gray.900'}
                        textAlign={{ base: 'left', md: reverse ? 'right' : 'left' }}
                    >
                        {title}
                    </Heading>
                    <Text
                        fontSize={{ base: 'md', md: 'lg' }}
                        color={colorMode === 'dark' ? 'gray.300' : 'gray.600'}
                        lineHeight="1.6"
                        textAlign={{ base: 'left', md: reverse ? 'right' : 'left' }}
                    >
                        {description}
                    </Text>
                </VStack>
                <VStack flex={1} minW={{ base: '100%', md: '300px' }} align="center">
                    {/* Placeholder for visual content - can be replaced with images or illustrations */}
                </VStack>
            </Stack>
        </Card>
    );
}
````

## Source: `examples/homepage/src/app/components/features/FeatureSection/index.ts`

````typescript
export { FeatureSection } from './FeatureSection';
````

## Source: `examples/homepage/src/app/components/features/FeaturesToTry/FeatureCard.tsx`

````tsx
'use client';

import {
    Card,
    VStack,
    Text,
    Icon,
    useColorMode,
    HStack,
} from '@chakra-ui/react';
import { IconType } from 'react-icons';
import { LuMousePointerClick } from 'react-icons/lu';

interface FeatureCardProps {
    title: string;
    description: React.ReactNode;
    icon: IconType;
    highlight?: boolean;
    content: () => void;
    disabled?: boolean;
    showHint?: boolean;
}

export function FeatureCard({
    title,
    description,
    icon,
    highlight,
    content,
    disabled = false,
    showHint = false,
}: FeatureCardProps) {
    const { colorMode } = useColorMode();

    return (
        <Card
            onClick={(e) => {
                if (disabled) {
                    e.preventDefault();
                    return;
                }
                content();
            }}
            p={4}
            variant={highlight ? 'baseWithBorder' : 'filled'}
            borderColor={highlight ? 'primary.500' : undefined}
            borderWidth={highlight ? '2px' : undefined}
            _hover={{
                transform: disabled ? 'translateY(0)' : 'translateY(-2px)',
                transition: 'transform 0.2s',
                bg: colorMode === 'light' ? 'gray.100' : 'whiteAlpha.100',
            }}
            cursor={disabled ? 'not-allowed' : 'pointer'}
            height="full"
        >
            <VStack spacing={3} align="start">
                <HStack>
                    <Icon
                        as={icon}
                        boxSize={6}
                        color={colorMode === 'light' ? 'blue.500' : 'blue.300'}
                    />
                    {showHint && (
                        <HStack
                            spacing={3}
                            animation="bounce-left 1s infinite"
                            justifyContent="center"
                            alignItems="center"
                            transform="rotate(-10deg)"
                            sx={{
                                '@keyframes bounce-left': {
                                    '0%, 100%': {
                                        transform: 'rotate(0deg) translateX(0)',
                                    },
                                    '50%': {
                                        transform:
                                            'rotate(0deg) translateX(-5px)',
                                    },
                                },
                            }}
                        >
                            <LuMousePointerClick
                                size={24}
                                color={
                                    colorMode === 'light'
                                        ? '#4A5568'
                                        : '#A0AEC0'
                                }
                                style={{ marginLeft: '8px' }}
                            />

                            <Text
                                fontSize="sm"
                                color={
                                    colorMode === 'light'
                                        ? 'gray.600'
                                        : 'gray.400'
                                }
                            >
                                Click me!
                            </Text>
                        </HStack>
                    )}
                </HStack>
                <Text fontWeight="bold">{title}</Text>
                <Text
                    fontSize="sm"
                    color={colorMode === 'light' ? 'gray.600' : 'gray.400'}
                >
                    {description}
                </Text>
                {disabled && (
                    <Text fontSize="xs" opacity={0.5}>
                        Only available for social login users.
                    </Text>
                )}
            </VStack>
        </Card>
    );
}
````

## Source: `examples/homepage/src/app/components/features/FeaturesToTry/FeaturesToTry.tsx`

````tsx
'use client';

import { VStack, Text, SimpleGrid } from '@chakra-ui/react';
import {
    LuSquareUser,
    LuArrowLeftRight,
    LuUserCog,
    LuBell,
    LuCircleHelp,
} from 'react-icons/lu';
import {
    useUpgradeSmartAccountModal,
    useWallet,
    useSwapTokenModal,
} from '@vechain/vechain-kit';
import {
    useChooseNameModal,
    useSendTokenModal,
    useExploreEcosystemModal,
    useNotificationsModal,
    useProfileModal,
    useFAQModal,
    useReceiveModal,
} from '@vechain/vechain-kit';
import { FeatureCard } from './FeatureCard';
import { GithubCard } from './GithubCard';
import { LanguageCard } from './LanguageCard';
import { ThemeCard } from './ThemeCard';
import { LuUser, LuArrowDownToLine, LuRefreshCw } from 'react-icons/lu';

export function FeaturesToTry() {
    const { account } = useWallet();

    // Use the modal hooks
    const { open: openChooseNameModal } = useChooseNameModal();
    const { open: openProfileModal } = useProfileModal();
    const { open: openSendTokenModal } = useSendTokenModal();
    const { open: openExploreEcosystemModal } = useExploreEcosystemModal();
    const { open: openNotificationsModal } = useNotificationsModal();
    const { open: openFAQModal } = useFAQModal();
    const { open: openReceiveModal } = useReceiveModal();
    const { open: openUpgradeSmartAccountModal } =
        useUpgradeSmartAccountModal();
    const { open: openSwapTokenModal } = useSwapTokenModal();

    const features = [
        {
            title: 'Set VET Domain',
            description:
                'Replace your complex address with a memorable .vet domain name',
            icon: LuSquareUser,
            highlight: !account?.domain,
            content: () => openChooseNameModal({ isolatedView: true }),
        },
        {
            title: 'Customize Profile',
            description:
                'Show the user his profile and allow them to customize it with a profile image, display name, bio and more to enhance their identity across VeChain applications.',
            icon: LuUser,
            content: () => openProfileModal({ isolatedView: true }),
        },
        {
            title: 'Transfer Assets',
            description:
                'Send and receive VET, VTHO, and other tokens seamlessly',
            icon: LuArrowLeftRight,
            content: () => openSendTokenModal({ isolatedView: true }),
        },
        {
            title: 'Swap Tokens',
            description: 'Swap between tokens with best available rates',
            icon: LuArrowLeftRight,
            content: () => openSwapTokenModal({ isolatedView: true }),
        },
        {
            title: 'Receive Assets',
            description: 'Receive VET, VTHO, and other tokens from anyone',
            icon: LuArrowDownToLine,
            content: () => openReceiveModal({ isolatedView: true }),
        },
        {
            title: 'Explore Ecosystem',
            description:
                'Explore other apps built on VeChain, and add shortcuts for faster access.',
            icon: LuUserCog,
            content: () => openExploreEcosystemModal({ isolatedView: true }),
        },
        {
            title: 'Notifications',
            description:
                'Stay updated with the kit or ecosystem updates, and account alerts',
            icon: LuBell,
            content: () => openNotificationsModal({ isolatedView: true }),
        },
        {
            title: 'FAQ',
            description: 'Find answers to common questions about VeChain',
            icon: LuCircleHelp,
            content: () => openFAQModal({ isolatedView: true }),
        },
        {
            title: 'Upgrade Smart Account',
            description: 'Upgrade your smart account to the latest version',
            icon: LuRefreshCw,
            content: openUpgradeSmartAccountModal,
        },
    ];

    return (
        <VStack spacing={6} align="stretch">
            <Text fontSize="xl" fontWeight="bold">
                Features
            </Text>
            <Text fontSize="sm" opacity={0.5}>
                The following features are available for your users and for you
                both accessible by using the VeKit main modal or by adding
                custom call to action buttons to your app and opening the
                content you need on demand. Try them out by clicking on the
                cards below.
            </Text>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                {features.map((feature, index) => (
                    <FeatureCard
                        key={feature.title}
                        {...feature}
                        showHint={index === 0}
                    />
                ))}
                <LanguageCard />
                <ThemeCard />
                <GithubCard />
            </SimpleGrid>
        </VStack>
    );
}
````

## Source: `examples/homepage/src/app/components/features/FeaturesToTry/GithubCard.tsx`

````tsx
'use client';

import { Box, VStack, Text, Icon, Link, useColorMode } from '@chakra-ui/react';
import { LuGithub } from 'react-icons/lu';

export function GithubCard() {
    const { colorMode } = useColorMode();

    return (
        <Link
            href="https://github.com/vechain/vechain-kit/issues/new"
            isExternal
            _hover={{ textDecoration: 'none' }}
        >
            <Box
                p={4}
                borderRadius="md"
                bg={colorMode === 'light' ? 'green.50' : 'green.900'}
                _hover={{
                    transform: 'translateY(-2px)',
                    transition: 'transform 0.2s',
                    bg: colorMode === 'light' ? 'green.100' : 'green.800',
                }}
                cursor="pointer"
                height="full"
            >
                <VStack spacing={3} align="start">
                    <Icon
                        as={LuGithub}
                        boxSize={6}
                        color={
                            colorMode === 'light' ? 'green.500' : 'green.300'
                        }
                    />
                    <Text fontWeight="bold">Feature Request</Text>
                    <Text
                        fontSize="sm"
                        color={colorMode === 'light' ? 'gray.600' : 'gray.400'}
                    >
                        Would you like to see something that is still missing?
                        Request the feature by opening an issue on our GitHub!
                    </Text>
                </VStack>
            </Box>
        </Link>
    );
}
````

## Source: `examples/homepage/src/app/components/features/FeaturesToTry/LanguageCard.tsx`

````tsx
'use client';

import {
    Box,
    VStack,
    Text,
    Icon,
    useColorMode,
    Select,
    Button,
} from '@chakra-ui/react';
import { LuGlobe } from 'react-icons/lu';
import { useTranslation } from 'react-i18next';
import { languageNames, supportedLanguages } from '../../../../../i18n';
import { useAccountModal } from '@vechain/vechain-kit';

export function LanguageCard() {
    const { colorMode } = useColorMode();
    const { t, i18n } = useTranslation();
    const { open: openAccountModal } = useAccountModal();
    return (
        <Box
            p={4}
            backdropFilter="blur(10px)"
            borderRadius="md"
            bg={colorMode === 'light' ? 'gray.50' : 'whiteAlpha.50'}
            height="full"
        >
            <VStack spacing={3} align="start">
                <Icon
                    as={LuGlobe}
                    boxSize={6}
                    color={colorMode === 'light' ? 'blue.500' : 'blue.300'}
                />
                <Text fontWeight="bold">Multilanguage support</Text>
                <VStack align="start" spacing={2}>
                    <Text
                        fontSize="sm"
                        color={colorMode === 'light' ? 'gray.600' : 'gray.400'}
                    >
                        {t('Demo text to be translated')}
                    </Text>
                    <Select
                        borderRadius={'md'}
                        size="sm"
                        width="auto"
                        value={i18n.language}
                        onChange={(e) => i18n.changeLanguage(e.target.value)}
                    >
                        {supportedLanguages.map((lang) => (
                            <option key={lang} value={lang}>
                                {
                                    languageNames[
                                        lang as keyof typeof languageNames
                                    ]
                                }
                            </option>
                        ))}
                    </Select>
                    <Button
                        size="sm"
                        variant="ghost"
                        colorScheme="blue"
                        onClick={() => openAccountModal()}
                    >
                        {t('Check language in account modal')}
                    </Button>
                </VStack>
            </VStack>
        </Box>
    );
}
````

## Source: `examples/homepage/src/app/components/features/FeaturesToTry/ThemeCard.tsx`

````tsx
'use client';

import {
    Box,
    VStack,
    Text,
    Icon,
    useColorMode,
    Button,
} from '@chakra-ui/react';
import { LuSun, LuMoon } from 'react-icons/lu';
import { useTranslation } from 'react-i18next';

export function ThemeCard() {
    const { colorMode, toggleColorMode } = useColorMode();
    const { t } = useTranslation();

    return (
        <Box
            p={4}
            borderRadius="md"
            backdropFilter="blur(10px)"
            bg={colorMode === 'light' ? 'gray.50' : 'whiteAlpha.50'}
            height="full"
        >
            <VStack spacing={3} align="start">
                <Icon
                    as={colorMode === 'light' ? LuSun : LuMoon}
                    boxSize={6}
                    color={colorMode === 'light' ? 'orange.500' : 'purple.300'}
                />
                <Text fontWeight="bold">{t('Theme switcher')}</Text>
                <VStack align="start" spacing={2}>
                    <Text
                        fontSize="sm"
                        color={colorMode === 'light' ? 'gray.600' : 'gray.400'}
                    >
                        {t('Try switching between light and dark mode')}
                    </Text>
                    <Button
                        size="sm"
                        variant="ghost"
                        colorScheme={
                            colorMode === 'light' ? 'orange' : 'purple'
                        }
                        leftIcon={
                            <Icon
                                as={colorMode === 'light' ? LuMoon : LuSun}
                                boxSize={4}
                            />
                        }
                        onClick={toggleColorMode}
                    >
                        {t('Switch to')}{' '}
                        {colorMode === 'light' ? t('dark') : t('light')}{' '}
                        {t('mode')}
                    </Button>
                </VStack>
            </VStack>
        </Box>
    );
}
````

## Source: `examples/homepage/src/app/components/features/FeaturesToTry/index.ts`

````typescript
export * from './FeaturesToTry';
export * from './FeatureCard';
export * from './GithubCard';
export * from './LanguageCard';
````

## Source: `examples/homepage/src/app/components/features/FloatingGetStartedButton/FloatingGetStartedButton.tsx`

````tsx
'use client';

import { useEffect, useState, useRef } from 'react';
import { Button, Box } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

interface FloatingGetStartedButtonProps {
    heroSectionRef: React.RefObject<HTMLDivElement>;
    scrollableSectionsRef: React.RefObject<HTMLDivElement>;
}

export function FloatingGetStartedButton({
    heroSectionRef,
    scrollableSectionsRef,
}: FloatingGetStartedButtonProps) {
    const { t } = useTranslation();
    const [isVisible, setIsVisible] = useState(false);
    const buttonRef = useRef<HTMLDivElement>(null);

    const scrollToQuickStart = () => {
        const el = document.getElementById('quick-start');
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            if (!heroSectionRef.current || !scrollableSectionsRef.current) {
                return;
            }

            const heroRect = heroSectionRef.current.getBoundingClientRect();
            const scrollableRect =
                scrollableSectionsRef.current.getBoundingClientRect();

            const heroBottom = heroRect.bottom;
            const scrollableTop = scrollableRect.top;
            const windowHeight = window.innerHeight;

            // Button appears once the hero section has scrolled past and the
            // scrollable sections (or anything below them) are in view.
            const quickStartEl = document.getElementById('quick-start');
            const quickStartTop =
                quickStartEl?.getBoundingClientRect().top ?? Infinity;

            // The Marketplace agent owns the persistent help launcher. Keep
            // this CTA focused on navigation and hide it once Quick Start is
            // reached so the two fixed controls never overlap.
            setIsVisible(
                heroBottom < 0 &&
                    scrollableTop < windowHeight &&
                    quickStartTop >= windowHeight,
            );
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial check

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [heroSectionRef, scrollableSectionsRef]);

    return (
        <Box
            ref={buttonRef}
            position="fixed"
            bottom={0}
            left={0}
            right={0}
            zIndex={100}
            px={4}
            pb={4}
            pointerEvents={isVisible ? 'auto' : 'none'}
            transition="opacity 0.3s ease-in-out, transform 0.3s ease-in-out"
            opacity={isVisible ? 1 : 0}
            transform={isVisible ? 'translateY(0)' : 'translateY(100%)'}
            display="flex"
            justifyContent="center"
        >
            <Button
                variant="homepagePrimary"
                size="lg"
                maxW="400px"
                boxShadow={'0px 2px 20px 10px rgb(150 150 150 / 32%)'}
                _hover={{ transform: 'translateY(-2px)' }}
                onClick={scrollToQuickStart}
            >
                {t('Get Started')} 🚀
            </Button>
        </Box>
    );
}
````

## Source: `examples/homepage/src/app/components/features/HeroSection/HeroSection.tsx`

````tsx
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
````

## Source: `examples/homepage/src/app/components/features/HeroSection/index.ts`

````typescript
export { HeroSection } from './HeroSection';
````

## Source: `examples/homepage/src/app/components/features/InfoSection/InfoSection.tsx`

````tsx
'use client';

import {
    Card,
    Grid,
    VStack,
    Heading,
    Text,
    Image,
    Box,
    useColorMode,
    useBreakpointValue,
} from '@chakra-ui/react';

interface InfoSectionProps {
    bg?: string;
    title: string;
    content: string;
    imageSrc: string;
    imageAlt: string;
    imageWidth?: string;
    mobileImageSrc?: string;
}

const isVideoFile = (src: string): boolean => {
    return /\.(mp4|webm|ogg|mov)$/i.test(src);
};

export function InfoSection({
    bg = '#e0daea',
    title,
    content,
    imageSrc,
    imageAlt,
    imageWidth = '450px',
    mobileImageSrc,
}: InfoSectionProps) {
    const { colorMode } = useColorMode();
    const finalImageSrc = useBreakpointValue({
        base: mobileImageSrc || imageSrc,
        md: imageSrc,
    });
    const isVideo = isVideoFile(finalImageSrc || imageSrc);

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

                {isVideo ? (
                    <Box
                        as="video"
                        src={finalImageSrc || imageSrc}
                        autoPlay
                        loop
                        muted
                        playsInline
                        w={['100%', imageWidth]}
                        borderRadius="md"
                        sx={{
                            backgroundColor: 'transparent',
                            background: 'transparent',
                            display: 'block',
                        }}
                    />
                ) : (
                    <Image
                        src={finalImageSrc || imageSrc}
                        alt={imageAlt}
                        w={['80%', imageWidth]}
                        mb={['20px', '0']}
                        sx={{
                            height: 'auto',
                            display: 'block',
                            WebkitMaskImage:
                                'radial-gradient(ellipse at center, rgba(0,0,0,1) 80%, rgba(0,0,0,0) 99%, rgba(0,0,0,0) 95%)',
                            maskImage:
                                'radial-gradient(ellipse at center, rgba(0,0,0,1) 80%,rgba(0,0,0,0) 99%, rgba(0,0,0,0) 95%)',
                        }}
                    />
                )}
            </Grid>
        </Card>
    );
}
````

## Source: `examples/homepage/src/app/components/features/InfoSection/index.ts`

````typescript
export * from './InfoSection';
````

## Source: `examples/homepage/src/app/components/features/Introduction/Introduction.tsx`

````tsx
'use client';

import {
    Box,
    Button,
    Text,
    VStack,
    Heading,
    SimpleGrid,
    Icon,
    Image,
    Link,
    HStack,
} from '@chakra-ui/react';
import { useWallet } from '@vechain/vechain-kit';
import {
    LuGithub,
    LuApple,
    LuFileText,
    LuWallet,
    LuPalette,
    LuCode,
    LuMail,
    LuLogIn,
} from 'react-icons/lu';
import { FaXTwitter } from 'react-icons/fa6';
import { SiNpm, SiFarcaster } from 'react-icons/si';
import { FcGoogle } from 'react-icons/fc';
import { FaDiscord } from 'react-icons/fa';
import { CollapsibleCard } from '@/app/components/ui/CollapsibleCard';

export function Introduction() {
    const { connection } = useWallet();

    const basePath = process.env.basePath ?? '';
    return (
        <Box
            p={8}
            borderRadius="lg"
            boxShadow="xl"
            bg="whiteAlpha.100"
            backdropFilter="blur(10px)"
        >
            <VStack spacing={6} align="stretch">
                <Heading as="h1" size="lg" textAlign="center">
                    Welcome to VeKit!
                </Heading>

                <Text textAlign="center">
                    VeKit is a comprehensive library, for React and
                    NextJs, designed to make building VeChain applications fast
                    and straightforward. Learn how to integrate VeChain in your
                    dApp using our resources below.
                    {connection.isConnected
                        ? ''
                        : ' Login to view all available features.'}
                </Text>

                <Box
                    display="flex"
                    gap={4}
                    justifyContent="center"
                    flexWrap="wrap"
                >
                    <VStack spacing={4}>
                        <SimpleGrid
                            columns={{ base: 1, md: 1 }}
                            spacing={4}
                            width="100%"
                        >
                            <Button
                                leftIcon={<LuFileText />}
                                as={Link}
                                href="https://docs.vechainkit.vechain.org/"
                                isExternal
                                rel="noopener noreferrer"
                                colorScheme="gray"
                                size="lg"
                                width="100%"
                            >
                                Get Started with our Docs
                            </Button>
                        </SimpleGrid>
                        <SimpleGrid
                            columns={{ base: 1, md: 3 }}
                            spacing={4}
                            width="100%"
                        >
                            <Button
                                leftIcon={<SiNpm />}
                                as="a"
                                href="https://www.npmjs.com/package/@vechain/vechain-kit"
                                target="_blank"
                                rel="noopener noreferrer"
                                colorScheme="red"
                                width="100%"
                            >
                                View Package on NPM
                            </Button>
                            <Button
                                leftIcon={<LuGithub />}
                                as="a"
                                href="https://github.com/vechain/vechain-kit"
                                target="_blank"
                                rel="noopener noreferrer"
                                colorScheme="gray"
                                width="100%"
                            >
                                View GitHub Repository
                            </Button>
                            <Button
                                leftIcon={
                                    <Image
                                        src="https://vechain.github.io/smart-accounts/assets/logo-DnOsqNR_.png"
                                        alt="Smart Account Factory"
                                        width={7}
                                        height={7}
                                    />
                                }
                                as="a"
                                href="https://vechain.github.io/smart-accounts/"
                                target="_blank"
                                rel="noopener noreferrer"
                                variant="outline"
                                width="100%"
                            >
                                Learn about Smart Accounts
                            </Button>
                        </SimpleGrid>
                    </VStack>
                </Box>
            </VStack>

            <CollapsibleCard
                title="Learn More About VeKit Features"
                icon={LuFileText}
                defaultIsOpen={!connection.isConnected}
                style={{ mt: 8, borderRadius: 'lg' }}
            >
                <VStack spacing={6} align="stretch">
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                        <Box p={4} borderRadius="md" borderWidth="1px">
                            <VStack align="start" spacing={3}>
                                <Icon
                                    as={LuLogIn}
                                    boxSize={6}
                                    color="blue.400"
                                />
                                <Text fontWeight="bold">
                                    Wallet Connection Integration
                                </Text>
                                <Text>
                                    Easily connect your users to your dApp with
                                    out of the box wallet connection options.
                                    Choose between:
                                </Text>
                                <HStack spacing={3} wrap="wrap">
                                    <Icon as={FcGoogle} boxSize={6} />
                                    <Icon as={FaXTwitter} boxSize={6} />
                                    <Icon as={LuMail} boxSize={6} />
                                    <Icon as={FaDiscord} boxSize={6} />
                                    <Icon as={SiFarcaster} boxSize={6} />
                                    <Icon as={LuApple} boxSize={6} />
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
                                    <Text fontSize="sm" color="gray.400">
                                        and more...
                                    </Text>
                                </HStack>
                            </VStack>
                        </Box>

                        <Box p={4} borderRadius="md" borderWidth="1px">
                            <VStack align="start" spacing={3}>
                                <Icon
                                    as={LuWallet}
                                    boxSize={6}
                                    color="blue.400"
                                />
                                <Text fontWeight="bold">
                                    Assets, Profile, and Wallet Management
                                </Text>
                                <Text>
                                    Use VeKit to allow your users to have
                                    asset management, profile management, social
                                    login, wallet backup, mfa, and more. All out
                                    of the box, so you can focus on building
                                    your dApp.
                                </Text>
                            </VStack>
                        </Box>

                        <Box p={4} borderRadius="md" borderWidth="1px">
                            <VStack align="start" spacing={3}>
                                <Icon
                                    as={LuCode}
                                    boxSize={6}
                                    color="green.400"
                                />
                                <Text fontWeight="bold">
                                    Boosted development
                                </Text>
                                <Text>
                                    Use our hooks and components to speed up
                                    your development. No need to worry about the
                                    underlying VeChain infrastructure, we handle
                                    it for you.
                                </Text>
                            </VStack>
                        </Box>

                        <Box p={4} borderRadius="md" borderWidth="1px">
                            <VStack align="start" spacing={3}>
                                <Icon
                                    as={LuPalette}
                                    boxSize={6}
                                    color="purple.400"
                                />
                                <Text fontWeight="bold">
                                    Style customization
                                </Text>
                                <Text>
                                    The kit is designed to be customizable to
                                    your needs. Decide what features you want to
                                    use and which ones you don't. Add call to
                                    action buttons to your app to guide your
                                    users to the features they need.
                                </Text>
                            </VStack>
                        </Box>
                    </SimpleGrid>

                    <VStack mt={8} spacing={4} align="stretch">
                        <Heading size="sm" textAlign="center">
                            Explore some of the apps built with VeKit
                        </Heading>
                        <Text textAlign="center" fontSize="xs">
                            (This website is built with VeKit as well!)
                        </Text>
                        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                            {[
                                {
                                    name: 'EatGreen',
                                    href: 'https://eatgreen.aworld.org/',
                                    logo: 'https://i.ibb.co/zVx7ncgq/download-2.png',
                                },
                                {
                                    name: 'ScoopUp',
                                    href: 'https://scoopup.vet/',
                                    logo: 'https://scoopup.vet/images/logo.webp',
                                },
                                {
                                    name: 'VeLottery',
                                    href: 'https://velottery.vet/',
                                    logo: 'https://velottery.vet/assets/logo.png',
                                },
                                {
                                    name: 'Betterswap',
                                    href: 'https://www.betterswap.io/',
                                    logo: 'https://api.gateway-proxy.vechain.org/ipfs/bafybeidvm2qibth26fzp45llucfapshw2zycmfpkebejmecn4amhbqi5qy/media/logo.png',
                                },
                                {
                                    name: 'Solarwise',
                                    href: 'https://app.solarwise.vet/',
                                    logo: 'https://app.solarwise.vet/pictogram.png',
                                },
                                {
                                    name: 'VeTrade',
                                    href: 'https://vetrade.vet/',
                                    logo: 'https://pbs.twimg.com/media/Gsf7GiRXQAAYUeM.png',
                                },
                            ].map((app) => (
                                <Box
                                    key={app.name}
                                    p={3}
                                    borderRadius="md"
                                    borderWidth="1px"
                                    role="group"
                                    as={Link}
                                    href={app.href}
                                    isExternal
                                >
                                    <HStack
                                        align="start"
                                        spacing={2}
                                        alignItems={'center'}
                                    >
                                        <Image
                                            src={app.logo}
                                            alt={app.name}
                                            width={'auto'}
                                            height={10}
                                            borderRadius="md"
                                        />
                                        <Text fontWeight="bold" fontSize="sm">
                                            {app.name}
                                        </Text>
                                    </HStack>
                                </Box>
                            ))}
                        </SimpleGrid>
                    </VStack>
                </VStack>
            </CollapsibleCard>
        </Box>
    );
}
````

## Source: `examples/homepage/src/app/components/features/Introduction/index.ts`

````typescript
export * from './Introduction';
````

## Source: `examples/homepage/src/app/components/features/LanguageSelector/LanguageSelector.tsx`

````tsx
'use client';

import { Box, Heading, VStack, Text, Select } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { languageNames, supportedLanguages } from '../../../../../i18n';

export function LanguageSelector() {
    const { t, i18n } = useTranslation();

    return (
        <Box
            p={6}
            bg="white"
            borderRadius="xl"
            border="1px solid"
            borderColor="gray.100"
            _hover={{ borderColor: 'blue.500', cursor: 'pointer' }}
            transition="all 0.2s"
        >
            <Heading size={'md'}>
                <b>Multilanguage</b>
            </Heading>
            <VStack mt={4} spacing={4} alignItems="flex-start">
                <Text>
                    {t('Demo text to be translated')} - (language should change
                    also in modal and toast)
                </Text>
                <Select
                    borderRadius={'md'}
                    size="sm"
                    width="auto"
                    value={i18n.language}
                    onChange={(e) => i18n.changeLanguage(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                >
                    {supportedLanguages.map((lang) => (
                        <option key={lang} value={lang}>
                            {languageNames[lang as keyof typeof languageNames]}
                        </option>
                    ))}
                </Select>
            </VStack>
        </Box>
    );
}
````

## Source: `examples/homepage/src/app/components/features/LanguageSelector/index.ts`

````typescript
export * from './LanguageSelector';
````

## Source: `examples/homepage/src/app/components/features/LanguagesSection/LanguagesSection.tsx`

````tsx
'use client';

import {
    Card,
    Grid,
    VStack,
    Heading,
    Text,
    Image,
    HStack,
    useColorMode,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { supportedLanguages, languageNames } from '../../../../../i18n';

interface LanguagesSectionProps {
    bg?: string;
    title: string;
    content: string;
}

// Map language codes to country codes for flag icons
const languageToCountryCode: Record<string, string> = {
    en: 'us',
    de: 'de',
    it: 'it',
    fr: 'fr',
    es: 'es',
    zh: 'cn',
    ja: 'jp',
};

// Generate CDN URL for flag (using flagcdn.com)
const getFlagUrl = (langCode: string): string => {
    const countryCode = languageToCountryCode[langCode] || langCode;
    return `https://flagcdn.com/w40/${countryCode}.png`;
};

export function LanguagesSection({
    bg = '#f0e8d8',
    title,
    content,
}: LanguagesSectionProps) {
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
                    {supportedLanguages.map((lang) => {
                        const flagUrl = getFlagUrl(lang);
                        const langName =
                            languageNames[lang as keyof typeof languageNames] ||
                            lang;

                        return (
                            <Image
                                key={lang}
                                src={flagUrl}
                                alt={langName}
                                height={6}
                                width="auto"
                                borderRadius="md"
                                border="1px solid"
                                borderColor={
                                    colorMode === 'dark'
                                        ? 'gray.600'
                                        : 'gray.200'
                                }
                            />
                        );
                    })}
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
````

## Source: `examples/homepage/src/app/components/features/LanguagesSection/index.ts`

````typescript
export * from './LanguagesSection';
````

## Source: `examples/homepage/src/app/components/features/LoginMethodsSection/LoginMethodsSection.tsx`

````tsx
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
````

## Source: `examples/homepage/src/app/components/features/LoginMethodsSection/index.ts`

````typescript
export * from './LoginMethodsSection';
````

## Source: `examples/homepage/src/app/components/features/LoginToContinueBox/LoginToContinueBox.tsx`

````tsx
'use client';

import { Button, Text, VStack, useColorMode } from '@chakra-ui/react';
import { useConnectModal } from '@vechain/vechain-kit';

export function LoginToContinueBox() {
    const { colorMode } = useColorMode();
    const { open } = useConnectModal();

    return (
        <VStack
            w="full"
            p={4}
            rounded="md"
            spacing={3}
            borderRadius="lg"
            boxShadow="xl"
            bg="whiteAlpha.100"
            backdropFilter="blur(10px)"
            zIndex={2}
        >
            <Text fontSize="lg" fontWeight="medium" textAlign="center">
                Connect your wallet to explore all features
            </Text>
            <Text
                fontSize="sm"
                color={colorMode === 'light' ? 'gray.600' : 'gray.400'}
                textAlign="center"
            >
                Sign in to access transaction examples, signing capabilities,
                profile customization and more.
            </Text>
            <Button width="full" onClick={() => open()}>
                Click here to sign in!
            </Button>
        </VStack>
    );
}
````

## Source: `examples/homepage/src/app/components/features/LoginToContinueBox/index.ts`

````typescript
export * from './LoginToContinueBox';
````

## Source: `examples/homepage/src/app/components/features/LoginUIControl/LoginUIControl.tsx`

````tsx
'use client';

import {
    VStack,
    Text,
    Box,
    Grid,
    Button,
    Icon,
    SimpleGrid,
} from '@chakra-ui/react';
import {
    WalletButton,
    useConnectModal,
    useDAppKitWalletModal,
    useLoginWithOAuth,
} from '@vechain/vechain-kit';
import { FcGoogle } from 'react-icons/fc';
import {
    FaApple,
    FaDiscord,
    FaGithub,
    FaLine,
    FaTiktok,
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import type { IconType } from 'react-icons';

// OAuth providers enabled in VeChain's Privy dashboard. Farcaster and
// WhatsApp are also enabled but use non-OAuth login flows.
const OAUTH_PROVIDERS: ReadonlyArray<{
    id:
        | 'google'
        | 'apple'
        | 'twitter'
        | 'discord'
        | 'github'
        | 'tiktok'
        | 'line';
    label: string;
    icon: IconType;
}> = [
    { id: 'google', label: 'Google', icon: FcGoogle },
    { id: 'apple', label: 'Apple', icon: FaApple },
    { id: 'twitter', label: 'X', icon: FaXTwitter },
    { id: 'discord', label: 'Discord', icon: FaDiscord },
    { id: 'github', label: 'GitHub', icon: FaGithub },
    { id: 'tiktok', label: 'TikTok', icon: FaTiktok },
    { id: 'line', label: 'LINE', icon: FaLine },
];

export const LoginUIControl = () => {
    const { open } = useConnectModal();
    const { open: openWalletModal } = useDAppKitWalletModal();
    const { initOAuth } = useLoginWithOAuth();

    return (
        <VStack spacing={6} align="stretch" w={'full'}>
            <Text textAlign="center">
                VeKit provides multiple ways to customize the login button
                and how we show the login options. Here are some examples of
                different login button variants.
            </Text>

            <VStack
                w={'full'}
                spacing={6}
                p={6}
                borderRadius="md"
                bg="whiteAlpha.50"
            >
                <Text fontWeight="bold">Login Button Variants</Text>
                <Grid
                    templateColumns={{
                        base: '1fr',
                        md: 'repeat(2, 1fr)',
                    }}
                    gap={8}
                    w="full"
                    justifyContent="space-between"
                >
                    {/* First Column Items */}
                    <VStack alignItems="flex-start" spacing={8}>
                        <VStack alignItems="flex-start" spacing={2}>
                            <Box w={'fit-content'}>
                                <WalletButton connectionVariant="modal" />
                            </Box>
                            <Text
                                fontSize="sm"
                                fontWeight="medium"
                                color="blue.300"
                                bg="whiteAlpha.100"
                                px={3}
                                py={1}
                                borderRadius="full"
                            >
                                variant: "modal"
                            </Text>
                        </VStack>

                        <VStack alignItems="flex-start" spacing={2}>
                            <Box w={'fit-content'}>
                                <WalletButton
                                    connectionVariant="modal"
                                    buttonStyle={{
                                        border: '2px solid #000000',
                                        boxShadow: '-2px 2px 3px 1px #00000038',
                                        background: '#f08098',
                                        color: 'white',
                                        _hover: {
                                            background: '#db607a',
                                            border: '1px solid #000000',
                                            boxShadow:
                                                '-3px 2px 3px 1px #00000038',
                                        },
                                        transition: 'all 0.2s ease',
                                    }}
                                />
                            </Box>
                            <Text
                                fontSize="sm"
                                fontWeight="medium"
                                color="blue.300"
                                bg="whiteAlpha.100"
                                px={3}
                                py={1}
                                borderRadius="full"
                            >
                                variant: "modal" (with custom styling)
                            </Text>
                        </VStack>
                    </VStack>

                    {/* Second Column Items */}
                    <VStack alignItems="flex-start" spacing={8}>
                        <VStack alignItems="flex-start" spacing={2}>
                            <Box w={'fit-content'}>
                                <WalletButton connectionVariant="popover" />
                            </Box>
                            <Text
                                fontSize="sm"
                                fontWeight="medium"
                                color="blue.300"
                                bg="whiteAlpha.100"
                                px={3}
                                py={1}
                                borderRadius="full"
                            >
                                variant: "popover" (desktop only)
                            </Text>
                        </VStack>

                        <VStack alignItems="flex-start" spacing={2}>
                            <Box w={'fit-content'}>
                                <Button onClick={() => open()}>
                                    Click me to login
                                </Button>
                            </Box>
                            <Text
                                fontSize="sm"
                                fontWeight="medium"
                                color="blue.300"
                                bg="whiteAlpha.100"
                                px={3}
                                py={1}
                                borderRadius="full"
                            >
                                custom button (with onClick)
                            </Text>
                        </VStack>

                        <VStack alignItems="flex-start" spacing={2}>
                            <Box w={'fit-content'}>
                                <Button onClick={openWalletModal}>
                                    Open only "Connect Wallet"
                                </Button>
                            </Box>
                            <Text
                                fontSize="sm"
                                fontWeight="medium"
                                color="blue.300"
                                bg="whiteAlpha.100"
                                px={3}
                                py={1}
                                borderRadius="full"
                            >
                                aka: dapp-kit connect modal
                            </Text>
                        </VStack>
                    </VStack>
                </Grid>

                <Text fontSize="sm" fontWeight="medium" color="blue.300">
                    Note: The modal variant is the default login button variant.
                    You can pass an additional description and Image to the
                    modal when configuring you the VeChainKitProvider.
                </Text>
            </VStack>

            <VStack
                w={'full'}
                spacing={6}
                p={6}
                borderRadius="md"
                bg="whiteAlpha.50"
            >
                <Text fontWeight="bold">OAuth Login Examples</Text>
                <SimpleGrid
                    columns={{ base: 1, sm: 2, md: 3 }}
                    spacing={3}
                    w="full"
                >
                    {OAUTH_PROVIDERS.map((p) => (
                        <Button
                            key={p.id}
                            onClick={() => initOAuth({ provider: p.id })}
                            leftIcon={<Icon as={p.icon} boxSize="20px" />}
                            colorScheme="gray"
                            variant="outline"
                            size="md"
                            justifyContent="flex-start"
                            _hover={{
                                bg: 'whiteAlpha.200',
                                borderColor: 'gray.400',
                            }}
                        >
                            {p.label}
                        </Button>
                    ))}
                </SimpleGrid>

                <Text fontSize="sm" fontWeight="medium" color="blue.300">
                    Note: These buttons use the useLoginWithOAuth hook. With a
                    privy prop on VeChainKitProvider, OAuth runs through your
                    own Privy app. Without it, the hook automatically routes
                    through the VeChain whitelabel cross-app host &mdash; so
                    these buttons work for any consumer dApp out of the box.
                </Text>
            </VStack>
        </VStack>
    );
};
````

## Source: `examples/homepage/src/app/components/features/LoginUIControl/index.ts`

````typescript
export * from './LoginUIControl';
````

## Source: `examples/homepage/src/app/components/features/QuickStartSection/QuickStartSection.tsx`

````tsx
'use client';

import {
    VStack,
    Heading,
    Text,
    Card,
    Box,
    HStack,
    IconButton,
    useColorMode,
    useColorModeValue,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LuCopy, LuCheck } from 'react-icons/lu';
import { Icon } from '@chakra-ui/react';

const COMMAND = 'npx create-vechain-dapp@latest';

function TerminalCodeBlock() {
    const { t } = useTranslation();
    const [copied, setCopied] = useState(false);

    const bgColor = useColorModeValue('#1a1a1a', '#0d1117');
    const textColor = useColorModeValue('#c9d1d9', '#c9d1d9');
    const promptColor = useColorModeValue('#58a6ff', '#58a6ff');
    const borderColor = useColorModeValue('#30363d', '#21262d');

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(COMMAND);
            setCopied(true);
            setTimeout(() => {
                setCopied(false);
            }, 2000);
        } catch {
            // Silently fail if clipboard access is not available
        }
    };

    return (
        <Box
            position="relative"
            bg={bgColor}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={borderColor}
            p={6}
            fontFamily="monospace"
            maxW="full"
            overflowX="auto"
        >
            <HStack spacing={4} align="flex-start">
                <Text color={promptColor} fontSize="md" fontWeight="bold">
                    $
                </Text>
                <Text color={textColor} fontSize="md" flex={1} textAlign="left">
                    {COMMAND}
                </Text>
                <IconButton
                    aria-label={t('Copy command')}
                    icon={<Icon as={copied ? LuCheck : LuCopy} />}
                    onClick={handleCopy}
                    size="sm"
                    variant="ghost"
                    color={textColor}
                    _hover={{
                        bg: 'rgba(255, 255, 255, 0.1)',
                    }}
                />
            </HStack>
            <Box mt={4} pt={4} borderTopWidth="1px" borderColor={borderColor}>
                <Text color={promptColor} fontSize="sm" mb={2} textAlign="left">
                    ? Select template ›
                </Text>
                <Text color={textColor} fontSize="sm" ml={4} textAlign="left">
                    ❯ VeKit Next.js Template (Chakra, React Query, SDK)
                </Text>
            </Box>
        </Box>
    );
}

export function QuickStartSection() {
    const { colorMode } = useColorMode();
    const { t } = useTranslation();

    return (
        <Card
            id="quick-start"
            variant="section"
            py={{ base: 16, md: 20 }}
            px={{ base: 4, md: 8 }}
        >
            <VStack
                spacing={8}
                align="center"
                maxW="4xl"
                mx="auto"
                w="full"
                textAlign="center"
            >
                <VStack spacing={4}>
                    <Heading
                        as="h2"
                        fontSize={{ base: '2xl', md: '3xl' }}
                        fontWeight="bold"
                        color={colorMode === 'dark' ? 'white' : 'gray.900'}
                    >
                        {t('Start building your new app now')}
                    </Heading>
                    <Text
                        fontSize={{ base: 'lg', md: 'xl' }}
                        color={colorMode === 'dark' ? 'gray.300' : 'gray.600'}
                        fontWeight="medium"
                    >
                        {t('One command, full stack.')}
                    </Text>
                </VStack>

                <Box w="full" maxW="2xl">
                    <TerminalCodeBlock />
                </Box>

                <Text
                    fontSize={{ base: 'md', md: 'lg' }}
                    color={colorMode === 'dark' ? 'gray.400' : 'gray.500'}
                    maxW="2xl"
                >
                    {t(
                        'Next.js, VeKit, Chakra UI, React Query, VeChain SDK, and more.',
                    )}
                </Text>
            </VStack>
        </Card>
    );
}
````

## Source: `examples/homepage/src/app/components/features/QuickStartSection/index.ts`

````typescript
export * from './QuickStartSection';
````

## Source: `examples/homepage/src/app/components/features/ScrollableInfoSections/ScrollableInfoSections.tsx`

````tsx
'use client';

import { useRef, useEffect, useState } from 'react';
import { Box, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { InfoSection } from '@/app/components/features/InfoSection';
import { LoginMethodsSection } from '../LoginMethodsSection';
import { LanguagesSection } from '../LanguagesSection';
import { AISection } from '../AISection';
import { BoostedDevSection } from '../BoostedDevSection';

interface ScrollableSection {
    bg?: string;
    title: string;
    content: string;
    imageSrc: string;
    imageAlt: string;
    imageWidth?: string;
    mobileImageSrc?: string;
    isLoginMethods?: boolean;
    isLanguages?: boolean;
    isAi?: boolean;
    isBoosted?: boolean;
}

export function ScrollableInfoSections() {
    const { t } = useTranslation();
    const sections: ScrollableSection[] = [
        {
            bg: '#e0daea',
            title: t('No blockchain plumbing'),
            content: t(
                'RPC endpoints, chain configs, connection handlers — pre-wired with sensible defaults so you can focus on your app.',
            ),
            imageSrc:
                'https://prod-vechainkit-docs-images-bucket.s3.eu-west-1.amazonaws.com/out.webm',
            mobileImageSrc:
                'https://prod-vechainkit-docs-images-bucket.s3.eu-west-1.amazonaws.com/previewed+(4).png',
            imageAlt: t('VeKit'),
            imageWidth: '950px',
        },
        {
            bg: '#dae8fb',
            title: t('Hooks, not boilerplate'),
            content: t(
                'Type-safe React hooks for wallets, balances, transactions, and contracts.',
            ),
            imageSrc: '',
            imageAlt: t('VeKit'),
            isBoosted: true,
        },
        {
            bg: '#e8e0d3',
            title: t('AI-native development'),
            content: t(
                'Plug VeChain expertise into your coding agent. Claude Code, Cursor, and any MCP-compatible agent get deep context on VeKit, smart contracts, VeBetterDAO, and more.',
            ),
            imageSrc: '',
            imageAlt: t('VeChain AI Skills'),
            isAi: true,
        },
        {
            bg: '#eae3d1',
            title: t('Yours to shape'),
            content: t(
                'Theme it, override it, or build on top — every screen, modal, and button is opt-in.',
            ),
            imageSrc:
                'https://prod-vechainkit-docs-images-bucket.s3.eu-west-1.amazonaws.com/image1+4.png',
            imageAlt: t('VeKit'),
            imageWidth: '600px',
        },
        {
            bg: '#dae8fb',
            title: t('Login your way'),
            content: t(
                'VeWorld, WalletConnect, social logins (Google, Apple, X, GitHub), passkeys, and more — pick what fits your users.',
            ),
            imageSrc:
                'https://prod-vechainkit-docs-images-bucket.s3.eu-west-1.amazonaws.com/kit1.png',
            imageAlt: t('Login methods'),
            imageWidth: '550px',
            isLoginMethods: true,
        },
        {
            bg: '#e1e5e4',
            title: t('Speaks 15 languages'),
            content: t(
                'Built-in translations sync both ways with your app — switch locale once, the kit follows.',
            ),
            imageSrc:
                'https://cdn.prod.website-files.com/685387e21f37b28674efb768/685c258fb5b73e62bd8de0c0_0e9040e92251da2f7c363a4f48682fee_5-4.webp',
            imageAlt: t('Multiple language support'),
            imageWidth: '400px',
            isLanguages: true,
        },
    ];

    const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [scrollProgresses, setScrollProgresses] = useState<number[]>(
        new Array(sections.length - 1).fill(0),
    );
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        const checkDesktop = () => {
            setIsDesktop(window.innerWidth >= 768);
        };

        checkDesktop();
        window.addEventListener('resize', checkDesktop);

        return () => window.removeEventListener('resize', checkDesktop);
    }, []);

    useEffect(() => {
        if (!isDesktop || sectionRefs.current.length < sections.length) {
            return;
        }

        const handleScroll = () => {
            const windowHeight = window.innerHeight;
            const newProgresses: number[] = [];

            // Calculate progress for each section pair
            for (let i = 0; i < sections.length - 1; i++) {
                const currentSection = sectionRefs.current[i];
                const nextSection = sectionRefs.current[i + 1];

                if (!currentSection || !nextSection) {
                    newProgresses.push(0);
                    continue;
                }

                const nextRect = nextSection.getBoundingClientRect();
                const nextSectionTop = nextRect.top;

                // Calculate progress: fade starts when next section enters viewport
                // and completes when it reaches the top
                const progress = Math.max(
                    0,
                    Math.min(1, (windowHeight - nextSectionTop) / windowHeight),
                );

                newProgresses.push(progress);
            }

            setScrollProgresses(newProgresses);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial calculation

        return () => window.removeEventListener('scroll', handleScroll);
    }, [isDesktop, sections.length]);

    const getSectionStyle = (index: number) => {
        const isLast = index === sections.length - 1;
        // Only the section being covered should fade
        // scrollProgresses[index] tracks how much the NEXT section has scrolled over this one
        const progress = isLast ? 0 : scrollProgresses[index];

        // Each section (except last) fades out and scales down as next section scrolls over it
        // The section scrolling over stays at opacity 1 (it's not affected by this progress value)
        const opacity = isDesktop && !isLast ? 1 - progress : 1;
        const scale = isDesktop && !isLast ? 1 - (1 - 0.85231) * progress : 1;
        const transform = isDesktop
            ? `translate3d(0px, 0px, 0px) scale3d(${scale}, ${scale}, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)`
            : 'none';

        return {
            willChange: isDesktop ? ('opacity, transform' as const) : 'auto',
            opacity,
            transform,
            ...(isDesktop && { transformStyle: 'preserve-3d' as const }),
        };
    };

    return (
        <VStack spacing={12} align="stretch">
            {sections.map((section, index) => {
                const isLast = index === sections.length - 1;
                // Later sections should have higher z-index so they can scroll over earlier ones
                const zIndex = isDesktop ? index + 1 : 'auto';

                return (
                    <Box
                        key={index}
                        ref={(el) => {
                            sectionRefs.current[index] = el;
                        }}
                        position={isDesktop && !isLast ? 'sticky' : 'relative'}
                        top={isDesktop && !isLast ? 0 : 'auto'}
                        zIndex={zIndex}
                        style={getSectionStyle(index)}
                    >
                        {section.isLoginMethods ? (
                            <LoginMethodsSection
                                bg={section.bg}
                                title={section.title}
                                content={section.content}
                            />
                        ) : section.isLanguages ? (
                            <LanguagesSection
                                bg={section.bg}
                                title={section.title}
                                content={section.content}
                            />
                        ) : section.isAi ? (
                            <AISection
                                bg={section.bg}
                                title={section.title}
                                content={section.content}
                            />
                        ) : section.isBoosted ? (
                            <BoostedDevSection
                                bg={section.bg}
                                title={section.title}
                                content={section.content}
                            />
                        ) : (
                            <InfoSection
                                bg={section.bg}
                                title={section.title}
                                content={section.content}
                                imageSrc={section.imageSrc}
                                imageAlt={section.imageAlt}
                                imageWidth={section.imageWidth}
                                mobileImageSrc={section.mobileImageSrc}
                            />
                        )}
                    </Box>
                );
            })}
        </VStack>
    );
}
````

## Source: `examples/homepage/src/app/components/features/ScrollableInfoSections/index.ts`

````typescript
export { ScrollableInfoSections } from './ScrollableInfoSections';
````

## Source: `examples/homepage/src/app/components/features/Signing/SigningExample.tsx`

````tsx
'use client';

import { ReactElement, useCallback } from 'react';
import {
    Button,
    VStack,
    Text,
    Code,
    useToast,
    SimpleGrid,
} from '@chakra-ui/react';
import {
    useWallet,
    useSignMessage,
    useSignTypedData,
    WalletButton,
} from '@vechain/vechain-kit';
import { LuFingerprint, LuCode } from 'react-icons/lu';
import { CollapsibleCard } from '../../ui/CollapsibleCard';
import { Link } from '@chakra-ui/react';

// Example EIP-712 typed data
const exampleTypedData = {
    domain: {
        name: 'VeChain Example',
        version: '1',
        chainId: 1,
    },
    types: {
        Person: [
            { name: 'name', type: 'string' },
            { name: 'wallet', type: 'address' },
        ],
    },
    message: {
        name: 'Alice',
        wallet: '0x0000000000000000000000000000000000000000',
    },
    primaryType: 'Person',
};

export function SigningExample(): ReactElement {
    const { connection, account } = useWallet();
    const toast = useToast();

    const {
        signMessage,
        isSigningPending: isMessageSignPending,
        signature: messageSignature,
    } = useSignMessage();

    const {
        signTypedData,
        isSigningPending: isTypedDataSignPending,
        signature: typedDataSignature,
    } = useSignTypedData();

    const handleSignMessage = useCallback(async () => {
        try {
            const signature = await signMessage('Hello VeChain!');
            toast({
                title: 'Message signed!',
                description: `Signature: ${signature.slice(0, 20)}...`,
                status: 'success',
                duration: 1000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: 'Signing failed',
                description:
                    error instanceof Error ? error.message : String(error),
                status: 'error',
                duration: 1000,
                isClosable: true,
            });
        }
    }, [signMessage, toast]);

    const handleSignTypedData = useCallback(async () => {
        try {
            const signature = await signTypedData(exampleTypedData, {
                signer: account?.address,
            });
            toast({
                title: 'Typed data signed!',
                description: `Signature: ${signature.slice(0, 20)}...`,
                status: 'success',
                duration: 1000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: 'Signing failed',
                description:
                    error instanceof Error ? error.message : String(error),
                status: 'error',
                duration: 1000,
                isClosable: true,
            });
        }
    }, [signTypedData, toast, account]);

    if (!connection.isConnected) {
        return (
            <CollapsibleCard
                title="Message Signing"
                icon={LuFingerprint}
                style={{ bg: 'whiteAlpha.100' }}
            >
                <VStack spacing={4}>
                    <Text>Connect your wallet to start signing messages</Text>
                    <WalletButton />
                </VStack>
            </CollapsibleCard>
        );
    }

    return (
        <CollapsibleCard
            defaultIsOpen={false}
            title="Message Signing"
            icon={LuFingerprint}
            style={{ bg: 'whiteAlpha.100' }}
        >
            <VStack spacing={6} align="stretch">
                <Text textAlign="center">
                    VeKit provides hooks for signing messages and typed
                    data. Try these examples to see signing in action.
                </Text>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    {/* Message Signing */}
                    <VStack
                        spacing={4}
                        p={6}
                        borderRadius="md"
                        bg="whiteAlpha.50"
                    >
                        <Text fontWeight="bold">Sign Message</Text>
                        <Button
                            onClick={handleSignMessage}
                            isLoading={isMessageSignPending}
                            w="full"
                        >
                            Sign "Hello VeChain!"
                        </Button>
                        {messageSignature && (
                            <Code
                                p={2}
                                borderRadius="md"
                                w="full"
                                fontSize="sm"
                            >
                                {messageSignature}
                            </Code>
                        )}
                    </VStack>

                    {/* Typed Data Signing */}
                    <VStack
                        spacing={4}
                        p={6}
                        borderRadius="md"
                        bg="whiteAlpha.50"
                    >
                        <Text fontWeight="bold">Sign Typed Data</Text>
                        <Button
                            onClick={handleSignTypedData}
                            isLoading={isTypedDataSignPending}
                            w="full"
                        >
                            Sign Typed Data
                        </Button>
                        {typedDataSignature && (
                            <Code
                                p={2}
                                borderRadius="md"
                                w="full"
                                fontSize="sm"
                            >
                                {typedDataSignature}
                            </Code>
                        )}
                    </VStack>
                </SimpleGrid>

                {/* Implementation Example */}
                <VStack spacing={4} p={6} borderRadius="md" bg="whiteAlpha.50">
                    <Text fontWeight="bold">Implementation</Text>
                    <Button
                        as={Link}
                        isExternal
                        href="https://github.com/vechain/vechain-kit/blob/main/examples/next-template/src/app/components/features/SigningExample/SigningExample.tsx"
                        w="full"
                        variant="outline"
                        rightIcon={<LuCode />}
                    >
                        View Code Example
                    </Button>
                    <Button
                        as={Link}
                        isExternal
                        href="https://docs.vechainkit.vechain.org/vechain-kit/sign-messages"
                        w="full"
                        variant="outline"
                        rightIcon={<LuFingerprint />}
                    >
                        Read Documentation
                    </Button>
                </VStack>
            </VStack>
        </CollapsibleCard>
    );
}
````

## Source: `examples/homepage/src/app/components/features/Signing/index.ts`

````typescript
export * from './SigningExample';
````

## Source: `examples/homepage/src/app/components/features/SmartAccountInfo/SmartAccountInfo.tsx`

````tsx
'use client';

import { SimpleGrid, VStack, Text, Icon } from '@chakra-ui/react';
import { LuShield, LuLock, LuShieldCheck } from 'react-icons/lu';
import { CollapsibleCard } from '../../ui/CollapsibleCard';

export function SmartAccountInfo() {
    return (
        <CollapsibleCard
            title="Smart Account Explained"
            icon={LuShield}
            style={{ bg: 'whiteAlpha.100' }}
        >
            <VStack spacing={6} align="stretch">
                <Text textAlign="center">
                    When using Privy authentication (direct or cross-app), a
                    Smart Account is automatically created and linked to your
                    wallet. This account becomes your primary identity on
                    VeChain, offering enhanced security and flexibility.
                </Text>

                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                    <VStack
                        spacing={4}
                        p={6}
                        borderRadius="md"
                        bg="whiteAlpha.50"
                    >
                        <Icon as={LuShield} boxSize={8} />
                        <Text fontWeight="bold">Secure Ownership</Text>
                        <Text fontSize="sm" textAlign="center">
                            Exclusively controlled by your Privy-secured wallet
                        </Text>
                    </VStack>

                    <VStack
                        spacing={4}
                        p={6}
                        borderRadius="md"
                        bg="whiteAlpha.50"
                    >
                        <Icon as={LuLock} boxSize={8} />
                        <Text fontWeight="bold">Transferable</Text>
                        <Text fontSize="sm" textAlign="center">
                            Transfer ownership to another wallet anytime
                        </Text>
                    </VStack>

                    <VStack
                        spacing={4}
                        p={6}
                        borderRadius="md"
                        bg="whiteAlpha.50"
                    >
                        <Icon as={LuShieldCheck} boxSize={8} />
                        <Text fontWeight="bold">Recovery</Text>
                        <Text fontSize="sm" textAlign="center">
                            Secure backup and recovery through Privy
                        </Text>
                    </VStack>
                </SimpleGrid>
            </VStack>
        </CollapsibleCard>
    );
}
````

## Source: `examples/homepage/src/app/components/features/SmartAccountInfo/index.ts`

````typescript
export * from './SmartAccountInfo';
````

## Source: `examples/homepage/src/app/components/features/TestimonialSection/TestimonialSection.tsx`

````tsx
'use client';

import { Card, Text, VStack, useColorMode } from '@chakra-ui/react';
import { LuQuote } from 'react-icons/lu';
import { Icon } from '@chakra-ui/react';

interface TestimonialSectionProps {
    quote: string;
    author?: string;
    mt?: number;
}

export function TestimonialSection({
    quote,
    author,
    mt,
}: TestimonialSectionProps) {
    const { colorMode } = useColorMode();

    return (
        <Card
            variant="section"
            py={{ base: 16, md: 20 }}
            px={{ base: 4, md: 8 }}
            mt={mt}
        >
            <VStack
                spacing={6}
                align="center"
                maxW="4xl"
                mx="auto"
                textAlign="center"
            >
                <Icon
                    as={LuQuote}
                    boxSize={12}
                    color={colorMode === 'dark' ? 'gray.400' : 'gray.300'}
                />
                <Text
                    fontSize={{ base: 'xl', md: '2xl' }}
                    fontWeight="medium"
                    color={colorMode === 'dark' ? 'gray.200' : 'gray.700'}
                    fontStyle="italic"
                    lineHeight="1.6"
                >
                    {quote}
                </Text>
                {author && (
                    <Text
                        fontSize="md"
                        color={colorMode === 'dark' ? 'gray.400' : 'gray.500'}
                    >
                        — {author}
                    </Text>
                )}
            </VStack>
        </Card>
    );
}
````

## Source: `examples/homepage/src/app/components/features/TestimonialSection/index.ts`

````typescript
export { TestimonialSection } from './TestimonialSection';
````

## Source: `examples/homepage/src/app/components/features/ThemeToggle/ThemeToggle.tsx`

````tsx
'use client';

import { Box, Button, useColorMode } from '@chakra-ui/react';

export function ThemeToggle() {
    const { colorMode, toggleColorMode } = useColorMode();

    return (
        <Box>
            <Button onClick={toggleColorMode}>
                Toggle {colorMode === 'light' ? 'Dark' : 'Light'} Mode
            </Button>
        </Box>
    );
}
````

## Source: `examples/homepage/src/app/components/features/ThemeToggle/index.ts`

````typescript
export * from './ThemeToggle';
````

## Source: `examples/homepage/src/app/components/features/TransactionExamples/TransactionExamples.tsx`

````tsx
'use client';

import { VStack, Text, SimpleGrid, Button, Link } from '@chakra-ui/react';
import { LuSend, LuCode } from 'react-icons/lu';
import { useCallback } from 'react';
import {
    useWallet,
    useThor,
    useBuildTransaction,
    useTransactionModal,
    useTransactionToast,
    TransactionModal,
    TransactionToast,
} from '@vechain/vechain-kit';
import { IB3TR__factory } from '@vechain/vechain-contract-types';
import { b3trMainnetAddress } from '../../../constants';

export function TransactionExamples() {
    const { account } = useWallet();
    const thor = useThor();

    const {
        sendTransaction,
        status,
        txReceipt,
        isTransactionPending,
        error,
        resetStatus,
    } = useBuildTransaction({
        clauseBuilder: () => {
            if (!account?.address) return [];

            return [
                {
                    ...thor.contracts
                        .load(b3trMainnetAddress, IB3TR__factory.abi)
                        .clause.transfer(account.address, BigInt('0')).clause,
                    comment: `This is a dummy transaction to test the transaction modal. Confirm to transfer 0 B3TR to ${account?.address}`,
                },
            ];
        },
        gasPadding: 0.25, //Testing with 25% padding
    });

    const {
        open: openTransactionModal,
        close: closeTransactionModal,
        isOpen: isTransactionModalOpen,
    } = useTransactionModal();

    const {
        open: openTransactionToast,
        close: closeTransactionToast,
        isOpen: isTransactionToastOpen,
    } = useTransactionToast();

    const handleTransactionWithToast = useCallback(async () => {
        openTransactionToast();
        await sendTransaction({});
    }, [sendTransaction, openTransactionToast]);

    const handleTransactionWithModal = useCallback(async () => {
        openTransactionModal();
        await sendTransaction({});
    }, [sendTransaction, openTransactionModal]);

    const handleTryAgain = useCallback(async () => {
        resetStatus();
        await sendTransaction({});
    }, [sendTransaction, resetStatus]);

    return (
        <VStack spacing={6} align="stretch">
            <Text textAlign="center">
                VeKit provides built-in transaction handling with UI
                components. Try these examples to see the transaction flow in
                action.
            </Text>

            <SimpleGrid columns={{ base: 1, md: 1 }} spacing={6}>
                <VStack spacing={4} p={6} borderRadius="md" bg="whiteAlpha.50">
                    <Text fontWeight="bold">Test Transactions</Text>
                    <VStack spacing={4} w="full">
                        <Button
                            onClick={handleTransactionWithToast}
                            isLoading={isTransactionPending}
                            isDisabled={isTransactionPending}
                            w="full"
                        >
                            Test with Toast
                        </Button>
                        <Button
                            onClick={handleTransactionWithModal}
                            isLoading={isTransactionPending}
                            isDisabled={isTransactionPending}
                            w="full"
                        >
                            Test with Modal
                        </Button>
                    </VStack>
                </VStack>

                <VStack spacing={4} p={6} borderRadius="md" bg="whiteAlpha.50">
                    <Text my={2} fontWeight="bold">
                        Implementation
                    </Text>
                    <Button
                        as={Link}
                        isExternal
                        href="https://github.com/vechain/vechain-kit/blob/main/examples/next-template/src/app/components/features/TransactionExamples/TransactionExamples.tsx"
                        w="full"
                        variant="outline"
                        rightIcon={<LuCode />}
                    >
                        View Code Example
                    </Button>
                    <Button
                        as={Link}
                        isExternal
                        href="https://docs.vechainkit.vechain.org/vechain-kit/send-transactions"
                        w="full"
                        variant="outline"
                        rightIcon={<LuSend />}
                    >
                        Read Docs
                    </Button>
                </VStack>
            </SimpleGrid>

            <TransactionToast
                isOpen={isTransactionToastOpen}
                onClose={closeTransactionToast}
                status={status}
                txError={error}
                txReceipt={txReceipt}
                onTryAgain={handleTryAgain}
                description={`This is a dummy transaction to test the transaction modal. Confirm to transfer 0 B3TR to ${account?.address}`}
            />

            <TransactionModal
                isOpen={isTransactionModalOpen}
                onClose={closeTransactionModal}
                status={status}
                txReceipt={txReceipt}
                onTryAgain={handleTryAgain}
                txError={error}
                uiConfig={{
                    title: 'Test Transaction',
                    description: `This is a dummy transaction to test the transaction modal. Confirm to transfer 0 B3TR to ${account?.address}`,
                    showShareOnSocials: true,
                    showExplorerButton: true,
                    isClosable: true,
                }}
            />
        </VStack>
    );
}
````

## Source: `examples/homepage/src/app/components/features/TransactionExamples/index.ts`

````typescript
export * from './TransactionExamples';
````

## Source: `examples/homepage/src/app/components/features/UIControls/UIControls.tsx`

````tsx
'use client';

import { VStack, Text, Button, Box, HStack, Grid } from '@chakra-ui/react';
import { WalletButton, useAccountModal } from '@vechain/vechain-kit';
import { LuPalette } from 'react-icons/lu';
import { CollapsibleCard } from '../../ui/CollapsibleCard';

export function UIControls() {
    const { open } = useAccountModal();

    return (
        <CollapsibleCard
            title="UI Customization Examples"
            icon={LuPalette}
            defaultIsOpen={false}
            style={{ bg: 'whiteAlpha.100' }}
        >
            <VStack spacing={6} align="stretch" w={'full'}>
                <Text textAlign="center">
                    VeKit provides multiple ways to customize the UI
                    components. Here are some examples of different button
                    styles and variants.
                </Text>

                <HStack w={'full'} justifyContent={'space-between'}>
                    {/* Mobile Variants */}
                    <HStack w={'full'} justifyContent={'center'}>
                        <VStack
                            w={'fit-content'}
                            spacing={6}
                            p={6}
                            borderRadius="md"
                            bg="whiteAlpha.50"
                        >
                            <Text fontWeight="bold">
                                Account Button Variants
                            </Text>
                            <Text
                                fontSize="sm"
                                textAlign="center"
                                color="gray.400"
                            >
                                Note: Some variants might look different based
                                on connection state and available data. Eg:
                                "iconDomainAndAssets" will show the assets only
                                if the user has assets. And same for domain
                                name.
                            </Text>
                            <Grid
                                templateColumns={{
                                    base: '1fr',
                                    md: 'repeat(2, 1fr)',
                                }}
                                gap={8}
                                w="full"
                                justifyContent="space-between"
                            >
                                {/* First Column Items */}
                                <VStack alignItems="flex-start" spacing={8}>
                                    <VStack alignItems="flex-start" spacing={2}>
                                        <Box w={'fit-content'}>
                                            <WalletButton
                                                mobileVariant="icon"
                                                desktopVariant="icon"
                                            />
                                        </Box>
                                        <Text
                                            fontSize="sm"
                                            fontWeight="medium"
                                            color="blue.300"
                                            bg="whiteAlpha.100"
                                            px={3}
                                            py={1}
                                            borderRadius="full"
                                        >
                                            variant: "icon"
                                        </Text>
                                    </VStack>

                                    <VStack alignItems="flex-start" spacing={2}>
                                        <Box w={'fit-content'}>
                                            <WalletButton
                                                mobileVariant="iconAndDomain"
                                                desktopVariant="iconAndDomain"
                                            />
                                        </Box>
                                        <Text
                                            fontSize="sm"
                                            fontWeight="medium"
                                            color="blue.300"
                                            bg="whiteAlpha.100"
                                            px={3}
                                            py={1}
                                            borderRadius="full"
                                        >
                                            variant: "iconAndDomain"
                                        </Text>
                                    </VStack>

                                    <VStack alignItems="flex-start" spacing={2}>
                                        <Box w={'fit-content'}>
                                            <WalletButton
                                                mobileVariant="iconDomainAndAddress"
                                                desktopVariant="iconDomainAndAddress"
                                            />
                                        </Box>
                                        <Text
                                            fontSize="sm"
                                            fontWeight="medium"
                                            color="blue.300"
                                            bg="whiteAlpha.100"
                                            px={3}
                                            py={1}
                                            borderRadius="full"
                                        >
                                            variant: "iconDomainAndAddress"
                                        </Text>
                                    </VStack>
                                </VStack>

                                {/* Second Column Items */}
                                <VStack alignItems={'flex-start'} spacing={8}>
                                    <VStack alignItems="flex-start" spacing={2}>
                                        <Box w={'fit-content'}>
                                            <WalletButton
                                                mobileVariant="iconDomainAndAssets"
                                                desktopVariant="iconDomainAndAssets"
                                            />
                                        </Box>
                                        <Text
                                            fontSize="sm"
                                            fontWeight="medium"
                                            color="blue.300"
                                            bg="whiteAlpha.100"
                                            px={3}
                                            py={1}
                                            borderRadius="full"
                                        >
                                            variant: "iconDomainAndAssets"
                                        </Text>
                                    </VStack>

                                    <VStack alignItems="flex-start" spacing={2}>
                                        <Box w={'fit-content'}>
                                            <WalletButton
                                                mobileVariant="iconDomainAndAssets"
                                                desktopVariant="iconDomainAndAssets"
                                                buttonStyle={{
                                                    border: '2px solid #000000',
                                                    boxShadow:
                                                        '-2px 2px 3px 1px #00000038',
                                                    background: '#f08098',
                                                    color: 'white',
                                                    _hover: {
                                                        background: '#db607a',
                                                        border: '1px solid #000000',
                                                        boxShadow:
                                                            '-3px 2px 3px 1px #00000038',
                                                    },
                                                    transition: 'all 0.2s ease',
                                                }}
                                            />
                                        </Box>
                                        <Text
                                            fontSize="sm"
                                            fontWeight="medium"
                                            color="blue.300"
                                            bg="whiteAlpha.100"
                                            px={3}
                                            py={1}
                                            borderRadius="full"
                                        >
                                            variant: "iconDomainAndAssets"
                                            (styled)
                                        </Text>
                                    </VStack>

                                    <VStack alignItems="flex-start" spacing={2}>
                                        <Button onClick={() => open()}>
                                            <Text>This is a custom button</Text>
                                        </Button>
                                        <Text
                                            fontSize="sm"
                                            fontWeight="medium"
                                            color="blue.300"
                                            bg="whiteAlpha.100"
                                            px={3}
                                            py={1}
                                            borderRadius="full"
                                        >
                                            no variant, custom button
                                        </Text>
                                    </VStack>
                                </VStack>
                            </Grid>
                        </VStack>
                    </HStack>
                </HStack>
            </VStack>
        </CollapsibleCard>
    );
}
````

## Source: `examples/homepage/src/app/components/features/UIControls/index.ts`

````typescript
export * from './UIControls';
````

## Source: `examples/homepage/src/app/components/features/WelcomeSection/WelcomeSection.tsx`

````tsx
'use client';

import {
    Container,
    Spinner,
    Text,
    useColorMode,
    VStack,
} from '@chakra-ui/react';
import { useWallet, WalletButton } from '@vechain/vechain-kit';
import { LuMousePointerClick } from 'react-icons/lu';

export function WelcomeSection() {
    const { connection } = useWallet();
    const { colorMode } = useColorMode();
    const isDarkMode = colorMode === 'dark';

    return (
        <Container alignItems={'center'} justifyContent={'center'}>
            <VStack spacing={10}>
                <Text
                    textAlign={'center'}
                    fontSize="xl"
                    fontWeight="bold"
                    className="text-animation"
                    bg={
                        isDarkMode
                            ? 'linear-gradient(45deg, #fafae6, #fafae6, #fff)'
                            : 'linear-gradient(45deg, #2B6CB0, #3182CE, #4299E1)'
                    }
                    backgroundClip="text"
                    color="transparent"
                >
                    Hi! I'm VeKit, a new way to access applications on
                    VeChain, and I'm here to show you my capabilities.
                </Text>
                {connection.isLoading ? (
                    <Spinner />
                ) : (
                    <VStack>
                        <WalletButton
                            mobileVariant="iconDomainAndAssets"
                            desktopVariant="iconDomainAndAssets"
                        />

                        <VStack
                            mt={4}
                            spacing={3}
                            animation="bounce-top 1s infinite"
                            transform="rotate(-10deg)"
                            justifyContent="center"
                            alignItems="center"
                            sx={{
                                '@keyframes bounce-top': {
                                    '0%, 100%': {
                                        transform: 'rotate(0deg) translateY(0)',
                                    },
                                    '50%': {
                                        transform:
                                            'rotate(0deg) translateY(-5px)',
                                    },
                                },
                            }}
                        >
                            <LuMousePointerClick
                                size={24}
                                color={
                                    colorMode === 'light'
                                        ? '#4A5568'
                                        : '#A0AEC0'
                                }
                            />

                            <Text
                                fontSize="sm"
                                color={
                                    colorMode === 'light'
                                        ? 'gray.600'
                                        : 'gray.400'
                                }
                            >
                                Click me!
                            </Text>
                        </VStack>
                    </VStack>
                )}
            </VStack>
        </Container>
    );
}
````

## Source: `examples/homepage/src/app/components/features/WelcomeSection/index.ts`

````typescript
export * from './WelcomeSection';
````

## Source: `examples/homepage/src/app/components/layout/Header/Header.tsx`

````tsx
'use client';

import {
    HStack,
    Image,
    Text,
    Card,
    useMediaQuery,
} from '@chakra-ui/react';
import { WalletButton, useWallet } from '@vechain/vechain-kit';
import { LanguageDropdown } from './LanguageDropdown';
import { useTranslation } from 'react-i18next';

const basePath = process.env.basePath ?? '';

export function Header() {
    // const { colorMode } = useColorMode();
    const [isMobile] = useMediaQuery('(max-width: 768px)');

    const { connection } = useWallet();

    const { t } = useTranslation();

    return (
        <HStack
            w="full"
            justifyContent="center"
            position="fixed"
            top={0}
            zIndex={10}
            py={4}
            px={{ base: 4, md: 8 }}
        >
            <Card
                variant="base"
                borderRadius="full"
                px={{ base: 4, md: 6 }}
                py={3}
                maxW="4xl"
                w="full"
                bg={'rgb(255, 255, 255)'}
                boxShadow={'0px 2px 4px 1px rgb(0 0 0 / 10%)'}
            >
                <HStack w="full" justifyContent="space-between" spacing={8}>
                    {/* Logo at start */}
                    <HStack
                        spacing={3}
                        flexShrink={0}
                        cursor="pointer"
                        onClick={() => {
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                    >
                        <Image
                            src={`${basePath}/images/logo.png`}
                            alt="VeKit"
                            height={8}
                            width="auto"
                        />
                        <Text
                            fontSize="lg"
                            fontWeight="bold"
                            color={'gray.900'}
                        >
                            VeKit
                        </Text>
                    </HStack>

                    {/* Navigation links centered */}
                    {/* {!isMobile && (
                        <HStack spacing={2} flex={1} justifyContent="center">
                            <Link
                                href="#features"
                                px={4}
                                py={2}
                                fontSize="sm"
                                fontWeight="medium"
                                color={
                                    colorMode === 'dark'
                                        ? 'gray.200'
                                        : 'gray.700'
                                }
                                borderRadius="md"
                                bg="transparent"
                                _hover={{
                                    bg:
                                        colorMode === 'dark'
                                            ? 'whiteAlpha.100'
                                            : 'gray.100',
                                    color:
                                        colorMode === 'dark'
                                            ? 'white'
                                            : 'gray.900',
                                }}
                                transition="all 0.2s"
                            >
                                Features
                            </Link>
                            <Link
                                href="https://docs.vechainkit.vechain.org/"
                                px={4}
                                py={2}
                                fontSize="sm"
                                fontWeight="medium"
                                color={
                                    colorMode === 'dark'
                                        ? 'gray.200'
                                        : 'gray.700'
                                }
                                borderRadius="md"
                                bg="transparent"
                                _hover={{
                                    bg:
                                        colorMode === 'dark'
                                            ? 'whiteAlpha.100'
                                            : 'gray.100',
                                    color:
                                        colorMode === 'dark'
                                            ? 'white'
                                            : 'gray.900',
                                }}
                                transition="all 0.2s"
                                isExternal
                            >
                                Docs
                            </Link>
                        </HStack>
                    )} */}

                    {/* Language dropdown and WalletButton at end */}
                    <HStack spacing={3} flexShrink={0}>
                        <WalletButton
                            mobileVariant="iconAndDomain"
                            desktopVariant="iconAndDomain"
                            buttonStyle={{
                                bg: 'rgb(243, 243, 243)',
                                rounded: 'full',
                                _hover: {
                                    bg: 'rgba(243, 243, 243, 0.67)',
                                },
                                transition: 'all 0.2s',
                            }}
                            label={t('Try me!')}
                        />
                        {/* Show on desktop always, on mobile only when not connected */}
                        {(!isMobile || !connection.isConnected) && (
                            <LanguageDropdown />
                        )}
                    </HStack>
                </HStack>
            </Card>
        </HStack>
    );
}
````

## Source: `examples/homepage/src/app/components/layout/Header/LanguageDropdown.tsx`

````tsx
'use client';

import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    HStack,
    Image,
    Text,
    Icon,
} from '@chakra-ui/react';
import { useCurrentLanguage } from '@vechain/vechain-kit';
import { supportedLanguages, languageNames } from '../../../../../i18n';
import { LuChevronDown } from 'react-icons/lu';

// Map language codes to country codes for flag icons
const languageToCountryCode: Record<string, string> = {
    en: 'us',
    de: 'de',
    it: 'it',
    fr: 'fr',
    es: 'es',
    zh: 'cn',
    ja: 'jp',
};

// Generate CDN URL for circle flag (using flagcdn.com)
const getFlagUrl = (langCode: string): string => {
    const countryCode = languageToCountryCode[langCode] || langCode;
    return `https://flagcdn.com/w40/${countryCode}.png`;
};

export function LanguageDropdown() {
    const { currentLanguage, setLanguage } = useCurrentLanguage();

    const currentFlagUrl = getFlagUrl(currentLanguage);
    const currentLanguageName =
        languageNames[currentLanguage as keyof typeof languageNames] ||
        currentLanguage;

    return (
        <Menu>
            <MenuButton
                as="button"
                style={{
                    backgroundColor: 'rgb(243, 243, 243)',
                    transition: 'all 0.2s',
                    borderRadius: '25px',
                    padding: '11px 16px',
                }}
            >
                <HStack spacing={2}>
                    <Image
                        src={currentFlagUrl}
                        alt={currentLanguageName}
                        width="20px"
                        height="20px"
                        borderRadius="full"
                        objectFit="cover"
                        border="1px solid"
                        borderColor="gray.200"
                    />
                    {/* <Text fontSize="sm" fontWeight="medium" color="gray.900">
                        {currentLanguageName}
                    </Text> */}
                    <Icon as={LuChevronDown} boxSize={4} color="gray.600" />
                </HStack>
            </MenuButton>
            <MenuList
                borderRadius="lg"
                border="1px solid"
                borderColor="gray.200"
                boxShadow="0px 2px 4px 1px rgb(0 0 0 / 10%)"
                minW="180px"
                py={2}
            >
                {supportedLanguages.map((lang) => {
                    const flagUrl = getFlagUrl(lang);
                    const langName =
                        languageNames[lang as keyof typeof languageNames] ||
                        lang;
                    const isSelected = lang === currentLanguage;

                    return (
                        <MenuItem
                            key={lang}
                            onClick={() => setLanguage(lang)}
                            bg={
                                isSelected
                                    ? 'rgba(0, 0, 0, 0.05)'
                                    : 'transparent'
                            }
                            _hover={{
                                bg: 'rgba(0, 0, 0, 0.08)',
                            }}
                            py={2}
                            px={3}
                        >
                            <HStack spacing={3} w="full">
                                <Image
                                    src={flagUrl}
                                    alt={langName}
                                    width="20px"
                                    height="20px"
                                    borderRadius="full"
                                    objectFit="cover"
                                    border="1px solid"
                                    borderColor="gray.200"
                                />
                                <Text
                                    fontSize="sm"
                                    fontWeight={
                                        isSelected ? 'semibold' : 'normal'
                                    }
                                >
                                    {langName}
                                </Text>
                            </HStack>
                        </MenuItem>
                    );
                })}
            </MenuList>
        </Menu>
    );
}
````

## Source: `examples/homepage/src/app/components/layout/Header/index.ts`

````typescript
export { Header } from './Header';
````

## Source: `examples/homepage/src/app/components/ui/Carousel/Carousel.tsx`

````tsx
'use client';

import { themeColors } from '@/app/theme/colors';
import { Box, Flex, HStack, Text, useBreakpointValue } from '@chakra-ui/react';
import {
    useRef,
    useEffect,
    useState,
    ReactNode,
    useCallback,
    useMemo,
} from 'react';

const PaginationButton = ({
    onClick,
    isActive,
    children,
}: {
    onClick: () => void;
    isActive: boolean;
    children: ReactNode;
}) => {
    return (
        <Text
            as="span"
            height="32px"
            width="32px"
            aspectRatio="1/1"
            display="flex"
            alignItems="center"
            justifyContent="center"
            bg={themeColors.secondary[200]}
            border="1px solid"
            borderColor={themeColors.secondary[300]}
            color={isActive ? 'gray.900' : 'gray.500'}
            borderRadius="full"
            onClick={isActive ? onClick : undefined}
            cursor={isActive ? 'pointer' : 'auto'}
            _hover={{
                bg: isActive
                    ? themeColors.secondary[100]
                    : themeColors.secondary[200],
            }}
            userSelect="none"
        >
            {children}
        </Text>
    );
};

interface CarouselProps<T> {
    items: T[];
    renderItem: (item: T, index: number) => ReactNode;
    itemWidth?: number;
    itemSpacing?: number;
    onItemClick?: (index: number, e?: React.MouseEvent) => void;
    onSelectItem?: (item: T) => void;
    wideMode?: boolean;
    blurSideItems?: boolean;
    isMobile?: boolean;
    infiniteLoop?: boolean;
}

export const Carousel = <T,>({
    items,
    renderItem,
    itemWidth = 300,
    itemSpacing = 0,
    onItemClick,
    onSelectItem,
    wideMode = true,
    blurSideItems = true,
    isMobile: _isMobile,
    infiniteLoop = false,
}: CarouselProps<T>) => {
    const breakpointValue = useBreakpointValue({ base: true, md: false });
    const isMobile = _isMobile ?? breakpointValue;

    // For infinite loop, we need to duplicate items
    const displayItems = useMemo(() => {
        if (infiniteLoop && items.length > 1) {
            return [...items, ...items, ...items];
        }
        return items;
    }, [items, infiniteLoop]);

    // Calculate the offset for infinite loop (start in the middle set)
    const infiniteOffset = useMemo(() => {
        if (infiniteLoop && items.length > 1) {
            return items.length;
        }
        return 0;
    }, [infiniteLoop, items.length]);

    const carouselRef = useRef<HTMLDivElement>(null);
    const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const rafRef = useRef<number | null>(null);
    const isScrollingRef = useRef(false);
    const lastScrollPositionRef = useRef(0);

    const [activeIndex, setActiveIndex] = useState(infiniteOffset);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [dragDistance, setDragDistance] = useState(0);
    const [clickedItemIndex, setClickedItemIndex] = useState<number | null>(
        null,
    );
    const [clickedOnButton, setClickedOnButton] = useState(false);
    const [clickedEvent, setClickedEvent] = useState<React.MouseEvent | null>(
        null,
    );

    // Helper function to convert display index to real index
    const getRealIndex = useCallback(
        (displayIndex: number): number => {
            if (!infiniteLoop || items.length === 0) return displayIndex;
            return displayIndex % items.length;
        },
        [infiniteLoop, items.length],
    );

    // Calculate item size
    const itemSize = itemWidth + itemSpacing;

    /**
     * Infinite-loop mode renders 3 copies of the list and sets `activeIndex` to the middle copy
     * (`infiniteOffset`). We must also align the DOM scroll position to that offset on mount,
     * otherwise the first navigation animates from 0 → middle copy (looks like a full rotation).
     */
    useEffect(() => {
        if (!infiniteLoop || items.length <= 1 || !carouselRef.current) return;

        const targetScrollLeft = infiniteOffset * itemSize;
        const el = carouselRef.current;

        // If we're already aligned (or close enough), do nothing.
        if (Math.abs(el.scrollLeft - targetScrollLeft) < 1) return;

        // Force an immediate jump without smooth scrolling for initial alignment.
        const previousScrollBehavior = el.style.scrollBehavior;
        el.style.scrollBehavior = 'auto';
        el.scrollLeft = targetScrollLeft;
        lastScrollPositionRef.current = targetScrollLeft;
        el.style.scrollBehavior = previousScrollBehavior;
    }, [infiniteLoop, items.length, infiniteOffset, itemSize]);

    // Get the real index for pagination display
    const realActiveIndex = useMemo(() => {
        return getRealIndex(activeIndex);
    }, [activeIndex, getRealIndex]);

    // Calculate the total width needed
    const totalWidth = useMemo(() => {
        if (displayItems.length === 1) return '100%';
        if (isMobile || wideMode) {
            return `${
                displayItems.length * itemWidth +
                (displayItems.length - 1) * itemSpacing
            }px`;
        }
        return `${
            displayItems.length * itemWidth +
            (displayItems.length - 1) * itemSpacing +
            (itemWidth + itemSpacing)
        }px`;
    }, [displayItems.length, itemWidth, itemSpacing, isMobile, wideMode]);

    const cardMargin = useMemo(() => {
        if (blurSideItems && !isMobile) {
            return `calc((100% - ${itemWidth}px) / 2)`;
        }
        return 0;
    }, [blurSideItems, itemWidth, isMobile]);

    const paginationDotsCount = useMemo(() => {
        return items.length - (isMobile || blurSideItems ? 0 : 2);
    }, [items.length, isMobile, blurSideItems]);

    const hidePagination = useMemo(() => {
        return !isMobile && paginationDotsCount < 2;
    }, [isMobile, paginationDotsCount]);

    const MAX_MOBILE_PAGINATION_DOTS = 20;

    const paginationDotsMapping = () => {
        if (isMobile && paginationDotsCount > MAX_MOBILE_PAGINATION_DOTS)
            return null;
        return Array.from({ length: paginationDotsCount }).map((_, index) => (
            <Box
                key={index}
                width="full"
                height="4px"
                borderRadius="full"
                bg={
                    index === realActiveIndex
                        ? themeColors.primary[500]
                        : themeColors.secondary[300]
                }
                mx={1}
                cursor="pointer"
                onClick={() => scrollToItem(index)}
                transition="background-color 0.3s ease"
                _hover={{
                    bg:
                        index === realActiveIndex
                            ? themeColors.primary[600]
                            : themeColors.secondary[400],
                }}
                hidden={
                    isMobile && paginationDotsCount > MAX_MOBILE_PAGINATION_DOTS
                }
            />
        ));
    };

    // Function to scroll to a specific item
    const scrollToItem = useCallback(
        (index: number) => {
            if (!carouselRef.current || items.length <= 1) return;

            let targetIndex: number;
            if (infiniteLoop) {
                // For infinite loop, find the closest instance of the target item
                const realIndex = index % items.length;
                const currentRealIndex = getRealIndex(activeIndex);

                // Calculate which set to use based on current position
                const currentDisplayIndex = activeIndex;
                const currentSet = Math.floor(
                    currentDisplayIndex / items.length,
                );

                // Try to stay in the same set or move to adjacent set
                let targetSet = currentSet;
                const diff = realIndex - currentRealIndex;

                // If wrapping around (going backwards), use previous set
                if (diff < -items.length / 2) {
                    targetSet = currentSet - 1;
                }
                // If wrapping around (going forwards), use next set
                else if (diff > items.length / 2) {
                    targetSet = currentSet + 1;
                }

                // Ensure we stay within bounds of displayItems
                const maxSet = Math.floor(
                    (displayItems.length - 1) / items.length,
                );
                targetSet = Math.max(0, Math.min(targetSet, maxSet));

                targetIndex = targetSet * items.length + realIndex;
            } else {
                const clampedIndex = Math.max(
                    0,
                    Math.min(index, items.length - 1),
                );
                targetIndex = clampedIndex;
            }

            const scrollPosition = targetIndex * itemSize;
            isScrollingRef.current = true;

            carouselRef.current.scrollTo({
                left: scrollPosition,
                behavior: 'smooth',
            });

            // Update active index after scroll animation
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
            scrollTimeoutRef.current = setTimeout(() => {
                setActiveIndex(targetIndex);
                const realIdx = getRealIndex(targetIndex);
                onSelectItem?.(items[realIdx]);
                isScrollingRef.current = false;
            }, 300);
        },
        [
            items,
            infiniteLoop,
            activeIndex,
            getRealIndex,
            itemSize,
            onSelectItem,
            displayItems.length,
        ],
    );

    // Detect which item is visible when scrolling
    const handleScroll = useCallback(() => {
        if (!carouselRef.current || items.length <= 1 || isDragging) return;

        // Cancel any pending RAF
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
        }

        // Use RAF for smooth scroll handling
        rafRef.current = requestAnimationFrame(() => {
            if (!carouselRef.current) return;

            const scrollPosition = carouselRef.current.scrollLeft;
            const newIndex = Math.round(scrollPosition / itemSize);

            let targetIndex: number;
            if (infiniteLoop) {
                // Allow continuous scrolling without bounds checking
                const maxIndex = displayItems.length - 1;
                const clampedIndex = Math.max(0, Math.min(newIndex, maxIndex));
                targetIndex = clampedIndex;
            } else {
                const clampedIndex = Math.max(
                    0,
                    Math.min(newIndex, items.length - 1),
                );
                targetIndex = clampedIndex;
            }

            // Only update if index changed significantly
            if (Math.abs(targetIndex - activeIndex) > 0) {
                setActiveIndex(targetIndex);
                const realIdx = getRealIndex(targetIndex);
                onSelectItem?.(items[realIdx]);
            }

            lastScrollPositionRef.current = scrollPosition;
        });
    }, [
        itemSize,
        activeIndex,
        items,
        displayItems.length,
        infiniteLoop,
        getRealIndex,
        onSelectItem,
        isDragging,
    ]);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (isMobile) return;

        const target = e.target as HTMLElement;
        const isButton = target.closest('button') !== null;
        const isLink = target.closest('a') !== null;
        const isInteractive = isButton || isLink;
        setClickedOnButton(isInteractive);

        if (isInteractive) {
            return;
        }

        setIsDragging(true);
        setStartX(e.pageX - (carouselRef.current?.offsetLeft || 0));
        setScrollLeft(carouselRef.current?.scrollLeft || 0);
        setDragDistance(0);

        const itemElement = target.closest('[data-item-index]');
        if (itemElement) {
            const index = parseInt(
                itemElement.getAttribute('data-item-index') || '-1',
                10,
            );
            setClickedItemIndex(index);
            setClickedEvent(e);
        } else {
            setClickedItemIndex(null);
            setClickedEvent(null);
        }

        e.preventDefault();
    };

    const handleMouseUp = () => {
        if (isMobile) return;

        if (clickedOnButton) {
            setClickedOnButton(false);
            setClickedItemIndex(null);
            setClickedEvent(null);
            return;
        }

        if (dragDistance <= 3 && clickedItemIndex !== null && onItemClick) {
            const realIdx = getRealIndex(clickedItemIndex);
            onItemClick(realIdx, clickedEvent || undefined);
            setIsDragging(false);
            setClickedItemIndex(null);
            setClickedEvent(null);
            return;
        }

        setIsDragging(false);
        setClickedItemIndex(null);
        setClickedEvent(null);

        // Snap to nearest item
        if (carouselRef.current && items.length > 1) {
            const scrollPosition = carouselRef.current.scrollLeft;
            const newIndex = Math.round(scrollPosition / itemSize);
            if (infiniteLoop) {
                const realIdx = getRealIndex(newIndex);
                scrollToItem(realIdx);
            } else {
                scrollToItem(newIndex);
            }
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (
            !isDragging ||
            isMobile ||
            !carouselRef.current ||
            items.length <= 1
        )
            return;

        const x = e.pageX - (carouselRef.current.offsetLeft || 0);
        const walk = (x - startX) * 1.5;
        let newScrollLeft = scrollLeft - walk;

        if (infiniteLoop) {
            carouselRef.current.scrollLeft = newScrollLeft;
        } else {
            const viewWidth = carouselRef.current.clientWidth;
            const maxScroll = carouselRef.current.scrollWidth - viewWidth;
            if (newScrollLeft < 0) newScrollLeft = 0;
            if (newScrollLeft > maxScroll) newScrollLeft = maxScroll;
            carouselRef.current.scrollLeft = newScrollLeft;
        }

        const currentDistance = Math.abs(x - startX);
        setDragDistance(currentDistance);

        e.preventDefault();
    };

    const handleMouseLeave = () => {
        if (isDragging) {
            setIsDragging(false);
            setClickedItemIndex(null);
            setClickedOnButton(false);
            setClickedEvent(null);

            if (carouselRef.current && items.length > 1) {
                const scrollPosition = carouselRef.current.scrollLeft;
                const newIndex = Math.round(scrollPosition / itemSize);
                if (infiniteLoop) {
                    const realIdx = getRealIndex(newIndex);
                    scrollToItem(realIdx);
                } else {
                    scrollToItem(newIndex);
                }
            }
        }
    };

    // Add scroll event listener
    useEffect(() => {
        const carousel = carouselRef.current;
        if (carousel) {
            carousel.addEventListener('scroll', handleScroll, {
                passive: true,
            });
            return () => {
                carousel.removeEventListener('scroll', handleScroll);
                if (rafRef.current) {
                    cancelAnimationFrame(rafRef.current);
                }
            };
        }
    }, [handleScroll]);

    // Call onSelectItem for initial item
    useEffect(() => {
        if (items.length > 0) {
            const realIdx = getRealIndex(activeIndex);
            onSelectItem?.(items[realIdx]);
        }
    }, []); // Only on mount

    // Calculate item styles based on distance from active index
    const getItemStyles = useCallback(
        (index: number) => {
            let distance: number;
            if (infiniteLoop && items.length > 1) {
                const realIndex1 = getRealIndex(index);
                const realIndex2 = getRealIndex(activeIndex);
                const diff = Math.abs(realIndex1 - realIndex2);
                distance = Math.min(diff, items.length - diff);
            } else {
                distance = Math.abs(index - activeIndex);
            }

            if (distance === 0 || !blurSideItems) {
                return {
                    transform: 'scale(1)',
                    filter: 'blur(0)',
                    opacity: 1,
                    zIndex: 2,
                };
            } else {
                return {
                    transform: 'scale(0.85)',
                    filter: 'blur(4px)',
                    opacity: 0.6,
                    zIndex: 0,
                };
            }
        },
        [infiniteLoop, items.length, getRealIndex, activeIndex, blurSideItems],
    );

    return (
        <Flex direction="column" width="full" align="center">
            <Box
                ref={carouselRef}
                overflowX="auto"
                width="full"
                maxWidth={'100%'}
                css={{
                    '&::-webkit-scrollbar': {
                        display: 'none',
                    },
                    scrollbarWidth: 'none',
                    cursor: !isMobile
                        ? isDragging
                            ? 'grabbing'
                            : 'grab'
                        : 'default',
                    userSelect: 'none',
                    scrollBehavior: 'smooth',
                }}
                px={5}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
                <Flex
                    direction="row"
                    justifyContent={
                        !isMobile && items.length <= 3 ? 'center' : 'flex-start'
                    }
                    pb={hidePagination ? 0 : 2}
                    width={!isMobile && items.length <= 3 ? '100%' : totalWidth}
                    position="relative"
                    ml={cardMargin}
                    mr={cardMargin}
                    pointerEvents={isDragging ? 'none' : 'auto'}
                >
                    {displayItems.map((item, itemIndex) => {
                        const styles = getItemStyles(itemIndex);
                        const realIndex = getRealIndex(itemIndex);
                        return (
                            <Box
                                key={`${itemIndex}-${realIndex}`}
                                minWidth={
                                    displayItems.length === 1
                                        ? '100%'
                                        : `${itemWidth}px`
                                }
                                maxWidth={
                                    displayItems.length === 1
                                        ? '100%'
                                        : `${itemWidth}px`
                                }
                                mr={
                                    itemIndex < displayItems.length - 1
                                        ? `${itemSpacing}px`
                                        : 0
                                }
                                data-item-index={itemIndex}
                                onClick={
                                    isMobile && onItemClick
                                        ? () => onItemClick(realIndex)
                                        : undefined
                                }
                                cursor={onItemClick ? 'pointer' : 'default'}
                                style={styles}
                                transition="all 0.3s ease-in-out"
                                justifyItems={
                                    displayItems.length === 1
                                        ? 'center'
                                        : 'flex-start'
                                }
                                _hover={{
                                    transform:
                                        !isDragging &&
                                        styles.transform.replace(
                                            'scale(',
                                            'scale(',
                                        ) === 'scale(1)'
                                            ? 'scale(1.05)'
                                            : styles.transform,
                                }}
                            >
                                {renderItem(item, realIndex)}
                            </Box>
                        );
                    })}
                </Flex>
            </Box>

            <HStack
                hidden={hidePagination}
                alignItems="center"
                justifyContent="center"
                w="full"
                gap={2}
                mt={{ base: 4, md: 2 }}
                px={4}
            >
                <PaginationButton
                    onClick={() => {
                        const nextIndex =
                            realActiveIndex - 1 < 0
                                ? items.length - 1
                                : realActiveIndex - 1;
                        scrollToItem(nextIndex);
                    }}
                    isActive={infiniteLoop || realActiveIndex > 0}
                >
                    ←
                </PaginationButton>
                <Flex
                    justify="center"
                    maxWidth={{
                        base: '256px',
                        md:
                            paginationDotsCount > MAX_MOBILE_PAGINATION_DOTS
                                ? 'full'
                                : '256px',
                    }}
                    w="full"
                >
                    {paginationDotsMapping()}
                </Flex>
                <PaginationButton
                    onClick={() => {
                        const nextIndex =
                            realActiveIndex + 1 >= items.length
                                ? 0
                                : realActiveIndex + 1;
                        scrollToItem(nextIndex);
                    }}
                    isActive={
                        infiniteLoop ||
                        realActiveIndex < paginationDotsCount - 1
                    }
                >
                    →
                </PaginationButton>
            </HStack>
        </Flex>
    );
};
````

## Source: `examples/homepage/src/app/components/ui/Carousel/index.ts`

````typescript
export { Carousel } from './Carousel';
````

## Source: `examples/homepage/src/app/components/ui/CollapsibleCard/CollapsibleCard.tsx`

````tsx
'use client';

import {
    Box,
    VStack,
    Heading,
    Icon,
    Collapse,
    HStack,
    IconButton,
    BoxProps,
} from '@chakra-ui/react';
import { useState } from 'react';
import { LuChevronDown, LuChevronUp } from 'react-icons/lu';

interface CollapsibleCardProps {
    title: string;
    icon?: React.ElementType;
    children: React.ReactNode;
    defaultIsOpen?: boolean;
    style?: BoxProps;
}

export function CollapsibleCard({
    title,
    icon,
    children,
    defaultIsOpen = false,
    style,
}: CollapsibleCardProps) {
    const [isOpen, setIsOpen] = useState(defaultIsOpen);

    return (
        <Box
            p={4}
            borderRadius="lg"
            boxShadow="xl"
            backdropFilter="blur(10px)"
            w="full"
            {...style}
        >
            <VStack spacing={6} align="stretch" justifyContent={'center'}>
                <HStack
                    justify="space-between"
                    align="center"
                    cursor={'pointer'}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <HStack spacing={2}>
                        {icon && <Icon as={icon} boxSize={6} />}
                        <Heading size="sm" textAlign="center">
                            {title}
                        </Heading>
                    </HStack>
                    <IconButton
                        aria-label={isOpen ? 'Collapse' : 'Expand'}
                        icon={isOpen ? <LuChevronUp /> : <LuChevronDown />}
                        variant="ghost"
                        size="sm"
                    />
                </HStack>
                <Collapse in={isOpen} animateOpacity>
                    {children}
                </Collapse>
            </VStack>
        </Box>
    );
}
````

## Source: `examples/homepage/src/app/components/ui/CollapsibleCard/index.ts`

````typescript
export * from './CollapsibleCard';
````

## Source: `examples/homepage/src/app/constants.ts`

````typescript
export const b3trMainnetAddress = '0x5ef79995FE8a89e0812330E4378eB2660ceDe699';
export const b3trTestnetAddress = '0x95761346d18244bb91664181bf91193376197088';
export const b3trAbi = [
    // Replace this with your actual transfer function ABI
    {
        inputs: [
            {
                name: 'recipient',
                type: 'address',
            },
            {
                name: 'amount',
                type: 'uint256',
            },
        ],
        name: 'transfer',
        outputs: [
            {
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
] as const;

export const ENV = {
    isDevelopment: process.env.NEXT_PUBLIC_NETWORK_TYPE === 'test',
    isProduction: process.env.NEXT_PUBLIC_NETWORK_TYPE === 'main',
};
````

## Source: `examples/homepage/src/app/globals.css`

````css
html,
body {
  margin: 0;
  width: 100%;
  height: 100%;
}

body {
  background-color: #FFFFFF;
  color: #272A2E;
}

/* Set background color based on Chakra UI color mode */
html[data-theme='dark'],
html[data-chakra-ui-color-mode='dark'],
[data-theme='dark'] {
  background-color: #121213 !important;
}

html[data-theme='dark'] body,
html[data-chakra-ui-color-mode='dark'] body,
[data-theme='dark'] body {
  background-color: #121213 !important;
  color: #F7FAFC !important;
}

html[data-theme='light'],
html[data-chakra-ui-color-mode='light'],
[data-theme='light'] {
  background-color: #FFFFFF !important;
}

html[data-theme='light'] body,
html[data-chakra-ui-color-mode='light'] body,
[data-theme='light'] body {
  background-color: #FFFFFF !important;
  color: #272A2E !important;
}
h2 {
  margin: 0;
}
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid #000;
  border-radius: 20px;
  padding: 20px;
}
.label {
  margin-top: 20px;
  margin-bottom: 10px;
}
````

## Source: `examples/homepage/src/app/languages/en.json`

````json
{
  "AI-native development": "AI-native development",
  "Any agent (Skills CLI)": "Any agent (Skills CLI)",
  "Apps Built with VeKit": "Apps Built with VeKit",
  "Are there any limitations?": "Are there any limitations?",
  "Ask Docs": "Ask Docs",
  "Auto-voting & relayer system.": "Auto-voting & relayer system.",
  "Available skills": "Available skills",
  "Build on VeChain, effortlessly": "Build on VeChain, effortlessly",
  "Built-in translations sync both ways with your app — switch locale once, the kit follows.": "Built-in translations sync both ways with your app — switch locale once, the kit follows.",
  "By developers, for developers.": "By developers, for developers.",
  "Can I customize the login methods shown to users?": "Can I customize the login methods shown to users?",
  "Claude Code": "Claude Code",
  "Color, fonts, background color, etc. You can create your own login button, and modal or use the provided one. You can decide to show or not the wallet or transaction modal, or show only specific contents (Send, Receive, Assets, Profile, etc.).": "Color, fonts, background color, etc. You can create your own login button, and modal or use the provided one. You can decide to show or not the wallet or transaction modal, or show only specific contents (Send, Receive, Assets, Profile, etc.).",
  "Copy command": "Copy command",
  "Core SDK, fee delegation, multi-clause transactions.": "Core SDK, fee delegation, multi-clause transactions.",
  "DAO": "DAO",
  "DeFi": "DeFi",
  "Demo text to be translated": "Demo text to be translated",
  "Discover all the possible ways to use the VeKit to build your next dApp.": "Discover all the possible ways to use the VeKit to build your next dApp.",
  "Energy": "Energy",
  "Explore the skills": "Explore the skills",
  "Frequently Asked Questions": "Frequently Asked Questions",
  "Frontend dApps, wallet, social login, hooks.": "Frontend dApps, wallet, social login, hooks.",
  "Gaming": "Gaming",
  "Get Started": "Get Started",
  "Give your coding agent deep VeChain domain knowledge — wallet UX, smart contracts, VeBetterDAO, StarGate, and more. Works with Claude Code, Cursor, and any agent.": "Give your coding agent deep VeChain domain knowledge — wallet UX, smart contracts, VeBetterDAO, StarGate, and more. Works with Claude Code, Cursor, and any agent.",
  "Hooks, not boilerplate": "Hooks, not boilerplate",
  "Index VeChain events and blocks for apps or analytics.": "Index VeChain events and blocks for apps or analytics.",
  "Introducing VeChain AI Skills": "Introducing VeChain AI Skills",
  "Is the kit free to use?": "Is the kit free to use?",
  "Lightweight integration to allow social login users to use the platform and manage their energy assets.": "Lightweight integration to allow social login users to use the platform and manage their energy assets.",
  "Login Methods": "Login Methods",
  "Login methods": "Login methods",
  "Login your way": "Login your way",
  "Multiple language support": "Multiple language support",
  "NFT staking, validators, delegation.": "NFT staking, validators, delegation.",
  "Next.js, VeKit, Chakra UI, React Query, VeChain SDK, and more.": "Next.js, VeKit, Chakra UI, React Query, VeChain SDK, and more.",
  "No blockchain plumbing": "No blockchain plumbing",
  "One command, full stack.": "One command, full stack.",
  "Playground": "Playground",
  "Plug VeChain expertise into your coding agent. Claude Code, Cursor, and any MCP-compatible agent get deep context on VeKit, smart contracts, VeBetterDAO, and more.": "Plug VeChain expertise into your coding agent. Claude Code, Cursor, and any MCP-compatible agent get deep context on VeKit, smart contracts, VeBetterDAO, and more.",
  "Pressure-tests your plan before you write code.": "Pressure-tests your plan before you write code.",
  "RPC endpoints, chain configs, connection handlers — pre-wired with sensible defaults so you can focus on your app.": "RPC endpoints, chain configs, connection handlers — pre-wired with sensible defaults so you can focus on your app.",
  "React hooks, pre-built UI, wallet integration, and social login — everything you need to ship a VeChain dApp.": "React hooks, pre-built UI, wallet integration, and social login — everything you need to ship a VeChain dApp.",
  "Scaffold a VeChain dApp in seconds.": "Scaffold a VeChain dApp in seconds.",
  "Scaffold a new VeChain dApp with social login, then add a B3TR reward distribution contract.": "Scaffold a new VeChain dApp with social login, then add a B3TR reward distribution contract.",
  "Ship VeChain dApps with AI": "Ship VeChain dApps with AI",
  "Solidity, Hardhat, testing, security.": "Solidity, Hardhat, testing, security.",
  "Speaks 15 languages": "Speaks 15 languages",
  "Staking": "Staking",
  "Start building your new app now": "Start building your new app now",
  "Supports only VeWorld, WalletConnect, and Sync2 wallets, and fully integrates VeKit UI into the app to enhance the user experience Profile and Wallet modals.": "Supports only VeWorld, WalletConnect, and Sync2 wallets, and fully integrates VeKit UI into the app to enhance the user experience Profile and Wallet modals.",
  "Sustainability": "Sustainability",
  "The VeKit is a fantastic foundation for building on VeChain, especially with its clean hooks and UI components.": "The VeKit is a fantastic foundation for building on VeChain, especially with its clean hooks and UI components.",
  "The kit supports Next.js and React.": "The kit supports Next.js and React.",
  "The user pays for the transactions. However, if you want to sponsor them (always or only in specific scenarios), you can use the fee delegation feature.": "The user pays for the transactions. However, if you want to sponsor them (always or only in specific scenarios), you can use the fee delegation feature.",
  "Theme it, override it, or build on top — every screen, modal, and button is opt-in.": "Theme it, override it, or build on top — every screen, modal, and button is opt-in.",
  "Trading": "Trading",
  "Try a prompt": "Try a prompt",
  "Try me!": "Try me!",
  "Try the playground": "Try the playground",
  "Type-safe React hooks for wallets, balances, transactions, and contracts.": "Type-safe React hooks for wallets, balances, transactions, and contracts.",
  "Uses VeKit end-to-end: login, wallet, hooks, and transaction components.": "Uses VeKit end-to-end: login, wallet, hooks, and transaction components.",
  "Uses VeKit only for the login flow and for the hooks to manage transactions.": "Uses VeKit only for the login flow and for the hooks to manage transactions.",
  "Uses VeKit to allow social login users to trade on the platform.": "Uses VeKit to allow social login users to trade on the platform.",
  "Uses its own Privy setup for social login OAuth2 based methods like Google and Apple.": "Uses its own Privy setup for social login OAuth2 based methods like Google and Apple.",
  "VeChain AI Skills": "VeChain AI Skills",
  "VeKit": "VeKit",
  "VeKit UI is fully integrated into the app, using a bottom sheet UX on mobile to enhance the user experience.": "VeKit UI is fully integrated into the app, using a bottom sheet UX on mobile to enhance the user experience.",
  "VeWorld deep-link integration.": "VeWorld deep-link integration.",
  "VeWorld, WalletConnect, social logins (Google, Apple, X, GitHub), passkeys, and more — pick what fits your users.": "VeWorld, WalletConnect, social logins (Google, Apple, X, GitHub), passkeys, and more — pick what fits your users.",
  "View on GitHub": "View on GitHub",
  "Visit": "Visit",
  "What are the supported frameworks?": "What are the supported frameworks?",
  "What can I customize?": "What can I customize?",
  "Who pays for the transactions?": "Who pays for the transactions?",
  "X2Earn apps, B3TR/VOT3, governance.": "X2Earn apps, B3TR/VOT3, governance.",
  "Yes — free for the shared VeChain + Privy integration. Bring your own Privy account if you want full control over the login UX (Privy pricing applies).": "Yes — free for the shared VeChain + Privy integration. Bring your own Privy account if you want full control over the login UX (Privy pricing applies).",
  "Yes. To support all login methods, use the kit's hooks (useSendTransaction, useSignMessage). For full control over the login UX, bring your own Privy account — the shared VeChain + Privy integration can't target specific social methods and always prompts for signatures.": "Yes. To support all login methods, use the kit's hooks (useSendTransaction, useSignMessage). For full control over the login UX, bring your own Privy account — the shared VeChain + Privy integration can't target specific social methods and always prompts for signatures.",
  "Yes. You can decide to use only veworld, or only social login methods. To maximize flexibility, you can also use your own Privy account and connect it to VeKit, allowing you to use OAuth2-based login methods like Google, Apple, Twitter, GitHub, etc. and completely customize the login experience.": "Yes. You can decide to use only veworld, or only social login methods. To maximize flexibility, you can also use your own Privy account and connect it to VeKit, allowing you to use OAuth2-based login methods like Google, Apple, Twitter, GitHub, etc. and completely customize the login experience.",
  "Yours to shape": "Yours to shape",
  "and more...": "and more...",
  "i18n translation management across locales.": "i18n translation management across locales.",
  "→ Agent picks the right skills automatically: create-vechain-dapp + vechain-kit + vebetterdao.": "→ Agent picks the right skills automatically: create-vechain-dapp + vechain-kit + vebetterdao."
}
````

## Source: `examples/homepage/src/app/layout.tsx`

````tsx
'use client';

import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import './globals.css';
import dynamic from 'next/dynamic';
import Script from 'next/script';
import { theme } from './theme';
// Initialize i18n
import '../../i18n';

const VechainKitProviderWrapper = dynamic(
    async () =>
        (await import('./providers/VechainKitProviderWrapper'))
            .VechainKitProviderWrapper,
    {
        ssr: false,
    },
);

const ForceLightMode = dynamic(
    async () => (await import('./components/ForceLightMode')).ForceLightMode,
    {
        ssr: false,
    },
);

function AppContent({ children }: { children: React.ReactNode }) {
    return (
        <>
            <ForceLightMode />
            <VechainKitProviderWrapper>{children}</VechainKitProviderWrapper>
        </>
    );
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const basePath = process.env.basePath ?? '';
    return (
        <html
            lang="en"
            suppressHydrationWarning={true}
            style={{
                scrollBehavior: 'smooth',
            }}
        >
            <head>
                <title>VeKit</title>
                <meta
                    name="description"
                    content="VeKit - Forget about the underlying blockchain infrastructure. We handle it for you."
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />

                <link
                    rel="icon"
                    href={`${basePath}/images/logo.png`}
                    type="image/png"
                />
                <link
                    rel="apple-touch-icon"
                    sizes="57x57"
                    href={`${basePath}/images/favicon/apple-touch-icon.png`}
                />
                <meta
                    name="msapplication-TileImage"
                    content={`${basePath}/images/favicon/apple-touch-icon.png`}
                />

                {/* Open Graph Metadata */}
                <meta name="title" property="og:title" content="VeKit" />
                <meta name="type" property="og:type" content="website" />
                <meta
                    property="og:url"
                    content="https://vechainkit.vechain.org/"
                />
                <meta
                    property="og:description"
                    content="VeKit - Forget about the underlying blockchain infrastructure. We handle it for you."
                />
                <meta property="og:site_name" content="VeKit" />
                <meta
                    property="og:image"
                    content={`https://prod-vechainkit-docs-images-bucket.s3.eu-west-1.amazonaws.com/banner-kit.png`}
                />
                <meta property="og:image:type" content="image/png" />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="og:image:alt" content="VeKit" />

                {/* Twitter Metadata */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="VeKit" />
                <meta
                    name="twitter:description"
                    content="VeKit - Forget about the underlying blockchain infrastructure. We handle it for you."
                />
                <meta
                    name="twitter:image"
                    content={`https://prod-vechainkit-docs-images-bucket.s3.eu-west-1.amazonaws.com/banner-kit.png`}
                />
                <meta name="twitter:image:alt" content="VeKit" />

                {/* Fonts */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap"
                    rel="stylesheet"
                />
                <link
                    href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap"
                    rel="stylesheet"
                />
                <ColorModeScript initialColorMode="light" />
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            (function() {
                                // Clear any cached dark mode preferences before React hydrates
                                const possibleKeys = [
                                    'chakra-ui-color-mode-vechain-kit-homepage',
                                    'chakra-ui-color-mode',
                                    'vechain-kit-homepage-color-mode'
                                ];
                                possibleKeys.forEach(function(key) {
                                    try {
                                        var stored = localStorage.getItem(key);
                                        if (stored && stored !== 'light') {
                                            localStorage.setItem(key, 'light');
                                        }
                                    } catch(e) {}
                                });
                            })();
                        `,
                    }}
                />
            </head>
            <body
                style={{
                    width: '100%',
                    height: '100%',
                }}
            >
                <ChakraProvider theme={theme}>
                    <AppContent>{children}</AppContent>
                </ChakraProvider>
                <Script
                    src="https://app.agent.veworld.ai/embed.js"
                    data-handle="dan"
                    data-agent="8f6b1d2e-4e0c-489b-abf1-bc8be68bd58a"
                    data-embed-key="am_embed_0v9q4uNohBrxupBgveikJBUibN-s4vwpdN8Jc7NSpdY"
                    strategy="afterInteractive"
                />
            </body>
        </html>
    );
}
````

## Source: `examples/homepage/src/app/page.tsx`

````tsx
'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const Home = dynamic(() => import('./pages/Home'), {
    ssr: false,
});

export default function Page() {
    return <Home />;
}
````

## Source: `examples/homepage/src/app/pages/Home.tsx`

````tsx
'use client';

import { type ReactElement, useRef } from 'react';
import {
    VStack,
    Text,
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
import { QuickStartSection } from '../components/features/QuickStartSection';
import { AISkillsSection } from '../components/features/AISkillsSection';
import { ScrollableInfoSections } from '@/app/components/features/ScrollableInfoSections';
import { FloatingGetStartedButton } from '@/app/components/features/FloatingGetStartedButton/FloatingGetStartedButton';

export default function Home(): ReactElement {
    const { colorMode } = useColorMode();
    const { t } = useTranslation();
    const heroSectionRef = useRef<HTMLDivElement>(null);
    const scrollableSectionsRef = useRef<HTMLDivElement>(null);

    const scrollToAiSkills = () => {
        const el = document.getElementById('ai-skills');
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

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
                        🎉​ {t('Introducing VeChain AI Skills')}
                    </Heading>

                    <Button
                        onClick={scrollToAiSkills}
                        variant="homepageSecondary"
                    >
                        {t('Explore the skills')} 👇​
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
                    'The VeKit is a fantastic foundation for building on VeChain, especially with its clean hooks and UI components.',
                )}
            />

            <AppShowcase />

            <QuickStartSection />

            <AISkillsSection />

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
````

## Source: `examples/homepage/src/app/providers/VechainKitProviderWrapper.tsx`

````tsx
'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { resources } from '../../../i18n';
import i18n from '../../../i18n';

// Dynamic import is used here for several reasons:
// 1. The VechainKit component uses browser-specific APIs that aren't available during server-side rendering
// 2. Code splitting - this component will only be loaded when needed, reducing initial bundle size
// 3. The 'ssr: false' option ensures this component is only rendered on the client side
const VeChainKitProvider = dynamic(
    async () => (await import('@vechain/vechain-kit')).VeChainKitProvider,
    {
        ssr: false,
    },
);

interface Props {
    children: React.ReactNode;
}

function LanguageSync({ children }: Props) {
    useEffect(() => {
        // Sync homepage i18n with VeChainKit language changes via localStorage
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'i18nextLng' && e.newValue) {
                const newLang = e.newValue;
                if (i18n.language !== newLang) {
                    i18n.changeLanguage(newLang);
                }
            }
        };

        // Listen to homepage i18n changes (from dropdown) and ensure localStorage is updated
        const handleLanguageChanged = (lng: string) => {
            if (typeof window !== 'undefined') {
                const stored = localStorage.getItem('i18nextLng');
                if (stored !== lng) {
                    localStorage.setItem('i18nextLng', lng);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        i18n.on('languageChanged', handleLanguageChanged);

        // Poll for changes (in case storage event doesn't fire)
        const interval = setInterval(() => {
            const stored = localStorage.getItem('i18nextLng');
            if (stored && stored !== i18n.language) {
                i18n.changeLanguage(stored);
            }
        }, 500);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            i18n.off('languageChanged', handleLanguageChanged);
            clearInterval(interval);
        };
    }, []);

    return <>{children}</>;
}

export function VechainKitProviderWrapper({ children }: Props) {
    const logo =
        'https://vechain-brand-assets.s3.eu-north-1.amazonaws.com/VeChain_Logomark_Light.png';

    const [kitLanguage, setKitLanguage] = useState<string>(
        typeof window !== 'undefined'
            ? localStorage.getItem('i18nextLng') || 'en'
            : 'en',
    );

    useEffect(() => {
        // Sync VeChainKit language prop with localStorage changes
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'i18nextLng' && e.newValue) {
                setKitLanguage(e.newValue);
            }
        };

        const storedLanguage =
            typeof window !== 'undefined'
                ? localStorage.getItem('i18nextLng')
                : null;
        if (storedLanguage) {
            setKitLanguage(storedLanguage);
        }

        window.addEventListener('storage', handleStorageChange);

        // Poll for changes
        const interval = setInterval(() => {
            const stored = localStorage.getItem('i18nextLng');
            if (stored && stored !== kitLanguage) {
                setKitLanguage(stored);
            }
        }, 500);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(interval);
        };
    }, [kitLanguage]);

    // Transform resources to match I18n type (extract translation objects)
    const homepageTranslations = Object.keys(resources).reduce((acc, lang) => {
        acc[lang] = resources[lang as keyof typeof resources].translation;
        return acc;
    }, {} as Record<string, Record<string, string>>);

    return (
        <VeChainKitProvider
            language={kitLanguage}
            i18n={homepageTranslations}
            theme={{
                textColor: '#272A2E',
                modal: {
                    backgroundColor: 'rgba(255, 255, 255)',
                    border: '1px solid rgba(39, 42, 46, 0.12)',
                    backdropFilter: 'blur(20px)',
                    rounded: '32px',
                    useBottomSheetOnMobile: true,
                },
                overlay: {
                    backgroundColor: 'rgba(0, 0, 0, 0.16)',
                    blur: 'blur(15px)',
                },
                buttons: {
                    secondaryButton: {
                        bg: 'rgb(243, 242, 242)',
                        color: 'rgb(25, 25, 25)',
                        border: 'none',
                    },
                    loginButton: {
                        border: '1px solid rgba(39, 42, 46, 0.12)',
                    },
                },
            }}
            // privy={{
            //     appId: process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
            //     clientId: process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID!,
            //     loginMethods: [
            //         'google',
            //         'apple',
            //         'twitter',
            //         'github',
            //         'farcaster',
            //         // 'email',
            //         'discord',
            //         'tiktok',
            //         // 'rabby_wallet',
            //         // 'coinbase_wallet',
            //         // 'rainbow',
            //         // 'metamask',
            //     ],
            //     appearance: {
            //         loginMessage: 'Select a login method',
            //         logo: logo,
            //     },
            //     embeddedWallets: {
            //         createOnLogin: 'all-users',
            //     },
            // }}

            dappKit={{
                allowedWallets: ['veworld', 'wallet-connect'],
                walletConnectOptions: {
                    projectId:
                        process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
                    metadata: {
                        name: 'VeChainKit Demo App',
                        description:
                            'This is a demo app to show you how the VechainKit works.',
                        url:
                            typeof window !== 'undefined'
                                ? window.location.origin
                                : '',
                        icons: [typeof window !== 'undefined' ? logo : ''],
                    },
                },
            }}
            loginMethods={[
                // { method: 'email', gridColumn: 4 },
                // { method: 'google', gridColumn: 4 },
                // { method: 'github', gridColumn: 4 },
                // { method: 'vechain', gridColumn: 4 },
                // { method: 'dappkit', gridColumn: 4 },
                // { method: 'ecosystem', gridColumn: 4 },
                // { method: 'passkey', gridColumn: 4 },
                // { method: 'more', gridColumn: 1 },
                { method: 'veworld', gridColumn: 4 },
                { method: 'google', gridColumn: 4 },
                { method: 'apple', gridColumn: 4 },
                // { method: 'more', gridColumn: 4 },
            ]}
            darkMode={false}
            network={{
                type: 'main',
                // nodeUrl: 'http://localhost:8669',
            }}
            allowCustomTokens={true}
        >
            <LanguageSync>{children}</LanguageSync>
        </VeChainKitProvider>
    );
}
````

## Source: `examples/homepage/src/app/theme/button.ts`

````typescript
import { ComponentStyleConfig } from '@chakra-ui/react';

export const ButtonStyle: ComponentStyleConfig = {
    // style object for base or default style
    baseStyle: {},
    // styles for different sizes ("sm", "md", "lg")
    sizes: {},
    // styles for different visual variants ("outline", "solid")
    variants: {
        primarySubtle: {
            bg: 'rgba(224, 233, 254, 1)',
            color: 'primary.500',
            _hover: {
                bg: 'rgba(224, 233, 254, 0.8)',
            },
        },
        testVariant: {
            bg: 'primary.300',
            color: 'white',
        },
        homepagePrimary: {
            columnGap: '.825rem',
            rowGap: '.825rem',
            bg: '#000',
            color: '#fff',
            borderRadius: '9999px',
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
            _hover: {
                bg: '#000',
                textDecoration: 'none',
                transform: 'translateY(-2px)',
            },
        },
        homepageSecondary: {
            columnGap: '8px',
            rowGap: '8px',
            bg: '#fff',
            border: '1px solid #000',
            borderRadius: '9999px',
            justifyContent: 'center',
            alignItems: 'center',
            px: '12px',
            py: '6px',
            display: 'flex',
            position: 'relative',
            _hover: {
                textDecoration: 'none',
            },
        },
    },
    // default values for 'size', 'variant' and 'colorScheme'
    defaultProps: {
        size: 'md',
        rounded: 'full',
        variant: 'solid',
    },
};
````

## Source: `examples/homepage/src/app/theme/card.ts`

````typescript
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';
import { cardAnatomy } from '@chakra-ui/anatomy';

const { definePartsStyle, defineMultiStyleConfig } =
    createMultiStyleConfigHelpers(cardAnatomy.keys);

// define custom styles for funky variant
const variants = {
    base: () =>
        definePartsStyle({
            container: {
                bg: '#FFF',
                borderWidth: '0px',
                borderColor: 'transparent',
            },
        }),
    filled: () =>
        definePartsStyle({
            container: {
                bg: '#FAFAFA',
            },
        }),
    baseWithBorder: () =>
        definePartsStyle({
            container: {
                bg: '#FFF',
                borderWidth: '1px',
                borderColor: 'gray.100',
            },
        }),
    secondaryBoxShadow: () =>
        definePartsStyle({
            container: {
                boxShadow: '0px 0px 1px 1px #00000017',
                bg: '#FFF',
                borderWidth: '1px',
                borderColor: 'gray.100',
            },
        }),
    articles: () =>
        definePartsStyle({
            container: {
                boxShadow: '0px 0px 1px 1px #00000017',
            },
        }),
    // Feature section variants with colored backgrounds
    featurePurple: () =>
        definePartsStyle({
            container: {
                bg: '#F5F3FF',
                borderWidth: '0px',
                borderColor: 'transparent',
            },
        }),
    featureBlue: () =>
        definePartsStyle({
            container: {
                bg: '#EFF6FF',
                borderWidth: '0px',
                borderColor: 'transparent',
            },
        }),
    featureBeige: () =>
        definePartsStyle({
            container: {
                bg: '#FEF9F3',
                borderWidth: '0px',
                borderColor: 'transparent',
            },
        }),
    featureGreen: () =>
        definePartsStyle({
            container: {
                bg: '#F0FDF4',
                borderWidth: '0px',
                borderColor: 'transparent',
            },
        }),
    featureGrey: () =>
        definePartsStyle({
            container: {
                bg: '#F9FAFB',
                borderWidth: '0px',
                borderColor: 'transparent',
            },
        }),
    featureDark: () =>
        definePartsStyle({
            container: {
                bg: '#1A1A1A',
                borderWidth: '0px',
                borderColor: 'transparent',
            },
        }),
    // Full-width section variant
    section: () =>
        definePartsStyle({
            container: {
                bg: 'transparent',
                borderWidth: '0px',
                borderColor: 'transparent',
                borderRadius: '0px',
                boxShadow: 'none',
            },
        }),
};

// export variants in the component theme
export const cardTheme = defineMultiStyleConfig({
    variants,
    defaultProps: {
        variant: 'base', // default is solid
    },
});
````

## Source: `examples/homepage/src/app/theme/colors.ts`

````typescript
export const lightPrimary = {
    '50': '#f0f9fe',
    '100': '#e1f3fd',
    '200': '#c3e7fb',
    '300': '#85d1f9',
    '400': '#4cbdf7',
    '500': '#23a9f6',
    '600': '#0d8bd4',
    '700': '#0b6ca6',
    '800': '#0a5178',
    '900': '#08354a',
    active: '#4cbdf7',
};

export const lightSecondary = {
    '50': '#ffffff',
    '100': '#F9F9FA',
    '200': '#e8e8ea',
    '300': '#d7d7da',
    '400': '#c6c6ca',
    '500': '#b5b5ba',
    '600': '#a4a4aa',
    '700': '#93939a',
    '800': '#82828a',
    '900': '#71717a',
};

export const lightTertiary = {
    100: '#e0f7fc',
    200: '#c2eff9',
    300: '#a3e7f6',
    400: '#85dff3',
    500: '#66d7f0',
    600: '#47cfed',
    700: '#29c7ea',
    800: '#0abfe7',
    900: '#00b7e0',
};

// Feature section background colors (inspired by Typeless design)
export const featureBackgrounds = {
    lightPurple: '#F5F3FF',
    lightBlue: '#EFF6FF',
    lightBeige: '#FEF9F3',
    lightGreen: '#F0FDF4',
    lightGrey: '#F9FAFB',
    white: '#FFFFFF',
    dark: '#1A1A1A',
};

export const themeColors = {
    primary: lightPrimary,
    secondary: lightSecondary,
    tertiary: lightTertiary,
    featureBackgrounds,
};
````

## Source: `examples/homepage/src/app/theme/index.ts`

````typescript
export * from "./theme";
````

## Source: `examples/homepage/src/app/theme/modal.ts`

````typescript
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } =
    createMultiStyleConfigHelpers(['modal']);

// define custom styles for funky variant
const variants = {
    base: definePartsStyle({}),
};

// export variants in the component theme
export const modalTheme = defineMultiStyleConfig({
    variants,
    defaultProps: {
        variant: 'base',
    },
});
````

## Source: `examples/homepage/src/app/theme/theme.tsx`

````tsx
import { extendTheme } from '@chakra-ui/react';
import { cardTheme } from './card';
import { ButtonStyle } from './button';
import { modalTheme } from './modal';
import { themeColors } from './colors';

const exampleTheme = {
    components: {
        Card: cardTheme,
        Button: ButtonStyle,
        Modal: modalTheme,
    },

    borderRadius: {
        card: '16px',
        button: '24px',
    },
    shadows: {
        card: '0px 2px 8px rgba(0, 0, 0, 0.05)',
    },
    //@ts-ignore
    fonts: {
        heading: `"Satoshi", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`,
        body: `"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`,
    },
    //@ts-ignore
    fontSizes: {
        hero: '4rem',
        'hero-mobile': '2.5rem',
    },
    //@ts-ignore
    space: {
        section: '120px',
        'section-mobile': '80px',
    },
};

export const theme = extendTheme({
    ...exampleTheme,
    config: {
        initialColorMode: 'light',
        useSystemColorMode: false,
        cssVarPrefix: 'vechain-kit-homepage',
    },
    colors: themeColors,
});
````

## Source: `examples/next-chakra-v3/next-env.d.ts`

````typescript
/// <reference types="next" />
/// <reference types="next/image-types/global" />
/// <reference path="./.next/types/routes.d.ts" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.
````

## Source: `examples/next-chakra-v3/package.json`

````json
{
    "name": "next-chakra-v3",
    "version": "0.1.0",
    "private": true,
    "scripts": {
        "build": "next build",
        "clean": "rm -rf .next dist .turbo",
        "dev": "next dev --turbopack --port 3010",
        "start": "next start"
    },
    "dependencies": {
        "@chakra-ui/react": "^3.26.0",
        "@emotion/react": "^11.14.0",
        "@emotion/styled": "^11.14.0",
        "@tanstack/react-query": "^5.64.2",
        "@vechain/vechain-kit": "workspace:*",
        "framer-motion": "^11.0.0",
        "next": "~16.2.3",
        "next-themes": "^0.4.6",
        "react": "^18",
        "react-dom": "^18",
        "react-icons": "^5.4.0"
    },
    "devDependencies": {
        "@types/node": "^20",
        "@types/react": "^18",
        "@types/react-dom": "^18",
        "typescript": "5.3.3"
    }
}
````

## Source: `examples/next-chakra-v3/src/app/layout.tsx`

````tsx
import { Providers } from './providers';

export const metadata = {
    title: 'VeChain Kit · Chakra v3 + next-themes repro',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
````

## Source: `examples/next-chakra-v3/src/app/page.tsx`

````tsx
'use client';
import {
    Box,
    Button,
    Code,
    HStack,
    Heading,
    Stack,
    Text,
} from '@chakra-ui/react';
import {
    useAccountModal,
    useConnectModal,
    useWallet,
} from '@vechain/vechain-kit';
import { ColorModeButton, useColorMode } from '@/components/ui/color-mode';

const short = (addr?: string) =>
    addr ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : '';

export default function Page() {
    const { open: openConnect } = useConnectModal();
    const { open: openAccount } = useAccountModal();
    const { account, connection, disconnect } = useWallet();
    const { colorMode } = useColorMode();

    const isConnected = connection.isConnected;

    return (
        <Stack gap={6} p={8} maxW="720px" mx="auto">
            <HStack justify="space-between">
                <Heading size="lg">VeChain Kit · Chakra v3 repro</Heading>
                <ColorModeButton />
            </HStack>

            <Text>
                Host is on Chakra v3 + next-themes. Current resolved theme:{' '}
                <Code>{colorMode ?? '—'}</Code>. Toggle the sun/moon icon and
                re-open the modals to inspect theme propagation into the kit.
            </Text>

            <HStack gap={3}>
                {!isConnected ? (
                    <Button colorPalette="blue" onClick={() => openConnect()}>
                        Open connect modal
                    </Button>
                ) : (
                    <>
                        <Button colorPalette="blue" onClick={() => openAccount()}>
                            Open account modal
                        </Button>
                        <Button variant="outline" onClick={() => disconnect()}>
                            Disconnect
                        </Button>
                    </>
                )}
            </HStack>

            {isConnected && (
                <Box
                    p={3}
                    rounded="md"
                    borderWidth="1px"
                    borderColor="border.secondary"
                >
                    <Text fontSize="sm">
                        Connected as <Code>{short(account?.address)}</Code> via{' '}
                        <Code>{connection.source.type}</Code>
                    </Text>
                </Box>
            )}

            <Box
                p={4}
                rounded="md"
                borderWidth="1px"
                borderColor="border.secondary"
                bg="card.subtle"
            >
                <Text fontWeight="bold">Host-rendered card</Text>
                <Text fontSize="sm">
                    This box uses the same Chakra v3 semantic tokens
                    (<Code>bg.primary</Code>, <Code>card.subtle</Code>,
                    <Code> border.secondary</Code>) that are passed into the
                    kit&apos;s theme prop. If everything is working, both kit
                    modals should track theme toggles in real time without a
                    refresh.
                </Text>
            </Box>
        </Stack>
    );
}
````

## Source: `examples/next-chakra-v3/src/app/providers.tsx`

````tsx
'use client';
import dynamic from 'next/dynamic';
import { Provider } from '@/components/ui/provider';

const VechainKitProviderWrapper = dynamic(
    async () =>
        (await import('@/providers/VechainKitProviderWrapper'))
            .VechainKitProviderWrapper,
    { ssr: false },
);

export function Providers({ children }: { readonly children: React.ReactNode }) {
    return (
        <Provider>
            <VechainKitProviderWrapper>{children}</VechainKitProviderWrapper>
        </Provider>
    );
}
````

## Source: `examples/next-chakra-v3/src/components/ui/color-mode.tsx`

````tsx
'use client';
import {
    ClientOnly,
    IconButton,
    IconButtonProps,
    Skeleton,
} from '@chakra-ui/react';
import {
    ThemeProvider,
    ThemeProviderProps,
    useTheme,
} from 'next-themes';
import * as React from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';

// Mirrors b3tr's color-mode wrapper exactly. next-themes provides the
// resolved theme; the kit receives `darkMode={colorMode === 'dark'}` from a
// consumer of this hook.
export interface ColorModeProviderProps extends ThemeProviderProps {}
export function ColorModeProvider(props: ColorModeProviderProps) {
    return (
        <ThemeProvider attribute="class" disableTransitionOnChange {...props} />
    );
}

export type ColorMode = 'light' | 'dark';
export interface UseColorModeReturn {
    colorMode: ColorMode;
    setColorMode: (colorMode: ColorMode) => void;
    toggleColorMode: () => void;
}

export function useColorMode(): UseColorModeReturn {
    const { resolvedTheme, setTheme, forcedTheme } = useTheme();
    const colorMode = forcedTheme || resolvedTheme;
    const toggleColorMode = () => {
        setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
    };
    return {
        colorMode: colorMode as ColorMode,
        setColorMode: setTheme as (m: ColorMode) => void,
        toggleColorMode,
    };
}

export function ColorModeIcon() {
    const { colorMode } = useColorMode();
    return colorMode === 'light' ? <FaMoon /> : <FaSun />;
}

interface ColorModeButtonProps extends Omit<IconButtonProps, 'aria-label'> {}

export const ColorModeButton = React.forwardRef<
    HTMLButtonElement,
    ColorModeButtonProps
>(function ColorModeButton(props, ref) {
    const { toggleColorMode } = useColorMode();
    return (
        <ClientOnly fallback={<Skeleton boxSize="8" />}>
            <IconButton
                onClick={toggleColorMode}
                variant="ghost"
                aria-label="Toggle color mode"
                ref={ref}
                {...props}
            >
                <ColorModeIcon />
            </IconButton>
        </ClientOnly>
    );
});
````

## Source: `examples/next-chakra-v3/src/components/ui/provider.tsx`

````tsx
'use client';
import { ChakraProvider } from '@chakra-ui/react';
import theme from '@/theme/theme';
import { ColorModeProvider, type ColorModeProviderProps } from './color-mode';

export function Provider(props: ColorModeProviderProps) {
    return (
        <ChakraProvider value={theme}>
            <ColorModeProvider {...props} />
        </ChakraProvider>
    );
}
````

## Source: `examples/next-chakra-v3/src/providers/VechainKitProviderWrapper.tsx`

````tsx
'use client';
import { useChakraContext, useToken } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import { useColorMode } from '@/components/ui/color-mode';

// Same dynamic-import-with-ssr-false pattern b3tr uses.
const VeChainKitProvider = dynamic(
    () =>
        import('@vechain/vechain-kit').then((mod) => mod.VeChainKitProvider),
    { ssr: false },
);

interface Props {
    readonly children: React.ReactNode;
}

export function VechainKitProviderWrapper({ children }: Props) {
    const { colorMode } = useColorMode();
    const isDarkMode = colorMode === 'dark';

    // KEY REPRODUCTION DETAIL: `useToken` in Chakra v3 returns the CSS
    // variable reference (e.g. `var(--vbd-colors-bg-primary)`), NOT the
    // resolved color. Its value flips at paint time based on
    // `html.class="dark"`. The kit must keep these references intact so they
    // stay reactive — any path inside the kit that snapshots the resolved
    // color (e.g. by appending a temp element to the DOM and reading
    // computed style) freezes the value at render time and breaks the
    // theme toggle for everything derived from it.
    // Chakra v3 quirk: `useToken('colors', 'bg.primary')` returns the
    // resolved literal value (e.g. `#1B1D1F`) at render time, NOT a CSS
    // variable reference. That snapshot is darkMode-frozen and breaks
    // theme toggling once it's piped into the kit. Use `sys.token.var(...)`
    // (or build `var(--vbd-colors-bg-primary)` by hand) so the value stays
    // reactive to host theme changes.
    const sys = useChakraContext();
    const tokVar = (path: string) =>
        sys.token.var(`colors.${path}`) as string;
    const bgPrimary = tokVar('bg.primary');
    const primaryDefault = tokVar('actions.primary.default');
    const primaryText = tokVar('actions.primary.text');
    const primaryHover = tokVar('actions.primary.hover');
    const secondaryDefault = tokVar('card.subtle');
    const secondaryHover = tokVar('card.hover');
    const borderSecondary = tokVar('border.secondary');
    // (still importing useToken for shape parity with b3tr's wrapper, even
    // though we don't call it — left as a reminder that this is the broken
    // path we're avoiding)
    void useToken;

    return (
        <VeChainKitProvider
            theme={{
                modal: {
                    backgroundColor: bgPrimary,
                    border: `1px solid ${borderSecondary}`,
                    useBottomSheetOnMobile: true,
                },
                buttons: {
                    primaryButton: {
                        bg: primaryDefault,
                        color: primaryText,
                        hoverBg: primaryHover,
                        rounded: 'full',
                    },
                    secondaryButton: {
                        border: `1px solid ${borderSecondary}`,
                        bg: secondaryDefault,
                        hoverBg: secondaryHover,
                    },
                },
            }}
            privy={{
                appId:
                    process.env.NEXT_PUBLIC_PRIVY_APP_ID ||
                    'cm4wxxujb022fyujl7g0thb21',
                clientId:
                    process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID ||
                    'client-WY5eXujRFovfkYSxufm6NM9CjAzeTqFw5tSd4hJPyA9nk',
                loginMethods: ['google', 'apple', 'twitter'],
                appearance: {
                    loginMessage: 'Select a login method',
                    logo: 'https://vechain-brand-assets.s3.eu-north-1.amazonaws.com/VeChain_Logomark_Light.png',
                },
                embeddedWallets: { createOnLogin: 'all-users' },
            }}
            dappKit={{
                allowedWallets: ['veworld', 'wallet-connect'],
                walletConnectOptions: {
                    projectId:
                        process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID ||
                        '06c045cd12ae0906fe5ad7d737fcdc04',
                    metadata: {
                        name: 'next-chakra-v3 repro',
                        description: 'Reproduces b3tr theme integration',
                        url:
                            typeof window !== 'undefined'
                                ? window.location.origin
                                : '',
                        icons: [],
                    },
                },
            }}
            loginMethods={[
                { method: 'veworld', gridColumn: 4 },
                { method: 'vechain', gridColumn: 4 },
                { method: 'dappkit', gridColumn: 4 },
                { method: 'ecosystem', gridColumn: 4 },
            ]}
            darkMode={isDarkMode}
            network={{ type: 'main' }}
        >
            {children}
        </VeChainKitProvider>
    );
}
````

## Source: `examples/next-chakra-v3/src/theme/theme.ts`

````typescript
import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

// Mirror b3tr's theme shape: a `cssVarsPrefix` and semantic tokens with
// `_dark` variants. The kit receives `useToken(...)` results from these
// tokens, which resolve to `var(--vbd-colors-*)` CSS variable references
// whose underlying value flips based on `html.class="dark"`.
const config = defineConfig({
    preflight: true,
    cssVarsPrefix: 'vbd',
    theme: {
        tokens: {
            colors: {
                gray: {
                    50: { value: '#F9F9FA' },
                    100: { value: '#F1F2F3' },
                    200: { value: '#E7E9EB' },
                    700: { value: '#363A3F' },
                    800: { value: '#272A2E' },
                    900: { value: '#1B1D1F' },
                },
                blue: {
                    400: { value: '#4D88FF' },
                    600: { value: '#004CFC' },
                    700: { value: '#003ECC' },
                },
            },
        },
        semanticTokens: {
            colors: {
                bg: {
                    primary: {
                        value: { base: 'white', _dark: '{colors.gray.900}' },
                    },
                    secondary: {
                        value: { base: '{colors.gray.50}', _dark: '#0F0F0F' },
                    },
                },
                actions: {
                    primary: {
                        default: {
                            value: {
                                base: '{colors.blue.600}',
                                _dark: '{colors.blue.400}',
                            },
                        },
                        hover: {
                            value: {
                                base: '{colors.blue.700}',
                                _dark: '{colors.blue.400}',
                            },
                        },
                        text: { value: { base: 'white', _dark: 'white' } },
                    },
                },
                card: {
                    subtle: {
                        value: {
                            base: '{colors.gray.50}',
                            _dark: '{colors.gray.700}',
                        },
                        hover: {
                            value: {
                                base: '{colors.gray.100}',
                                _dark: '{colors.gray.800}',
                            },
                        },
                    },
                },
                border: {
                    secondary: {
                        value: {
                            base: '{colors.gray.100}',
                            _dark: '{colors.gray.800}',
                        },
                    },
                },
                text: {
                    primary: {
                        value: { base: '{colors.gray.800}', _dark: 'white' },
                    },
                },
            },
        },
        globalCss: {
            'html,body': {
                bg: 'bg.secondary',
                color: 'text.primary',
                transition: 'background-color 0.2s, color 0.2s',
            },
        },
    },
});

const theme = createSystem(defaultConfig, config);
export default theme;
````

## Source: `examples/next-chakra-v3/tsconfig.json`

````json
{
    "compilerOptions": {
        "target": "ES2020",
        "lib": ["dom", "dom.iterable", "esnext"],
        "allowJs": true,
        "skipLibCheck": true,
        "strict": true,
        "noEmit": true,
        "esModuleInterop": true,
        "module": "esnext",
        "moduleResolution": "bundler",
        "resolveJsonModule": true,
        "isolatedModules": true,
        "jsx": "preserve",
        "incremental": true,
        "plugins": [{ "name": "next" }],
        "paths": {
            "@/*": ["./src/*"]
        }
    },
    "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
    "exclude": ["node_modules"]
}
````

## Source: `examples/next-template/i18n.ts`

````typescript
import i18n from 'i18next';
import { initReactI18next } from './node_modules/react-i18next';

// Import all language JSON files
import en from './src/app/languages/en.json';
import de from './src/app/languages/de.json';
import it from './src/app/languages/it.json';
import fr from './src/app/languages/fr.json';
import es from './src/app/languages/es.json';
import zh from './src/app/languages/zh.json';
import ja from './src/app/languages/ja.json';

// Define supported languages
export const supportedLanguages = ['en', 'de', 'it', 'fr', 'es', 'zh', 'ja'];

export const resources = {
    en: { translation: en },
    de: { translation: de },
    it: { translation: it },
    fr: { translation: fr },
    es: { translation: es },
    zh: { translation: zh },
    ja: { translation: ja },
};

// Language names mapping
export const languageNames = {
    en: 'English',
    de: 'Deutsch',
    it: 'Italiano',
    fr: 'Français',
    es: 'Español',
    zh: '中文',
    ja: '日本語',
};

// Custom language detector that checks localStorage first, then prop, then browser
const customLanguageDetector = {
    name: 'customDetector',
    lookup: (options?: { languages?: string[] } | undefined) => {
        // Check localStorage first (for persistence across page refreshes)
        if (typeof window !== 'undefined') {
            const storedLanguage = localStorage.getItem('i18nextLng');
            if (storedLanguage && supportedLanguages.includes(storedLanguage)) {
                return storedLanguage;
            }
        }

        const propLanguage = options?.languages?.[0];

        if (propLanguage && supportedLanguages.includes(propLanguage)) {
            return propLanguage;
        }

        // Get browser language
        const browserLang = navigator.language.split('-')[0];
        if (browserLang && supportedLanguages.includes(browserLang)) {
            return browserLang;
        }

        return 'en'; // fallback
    },
    cacheUserLanguage: (lng: string) => {
        localStorage.setItem('i18nextLng', lng);
    },
};

i18n.use({
    type: 'languageDetector',
    async: false,
    init: () => {},
    detect: customLanguageDetector.lookup,
    cacheUserLanguage: customLanguageDetector.cacheUserLanguage,
})
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
````

## Source: `examples/next-template/next-env.d.ts`

````typescript
/// <reference types="next" />
/// <reference types="next/image-types/global" />
/// <reference path="./.next/types/routes.d.ts" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.
````

## Source: `examples/next-template/package.json`

````json
{
    "name": "next-template",
    "version": "0.1.0",
    "private": true,
    "scripts": {
        "build": "next build",
        "clean": "rm -rf .next dist .turbo",
        "dev": "next dev --turbopack"
    },
    "dependencies": {
        "@chakra-ui/react": "2.8.2",
        "@emotion/react": "^11.13.5",
        "@emotion/styled": "^11.13.5",
        "@tanstack/react-query": "^5.64.2",
        "@vechain/vechain-contract-types": "1.4.1",
        "@vechain/vechain-kit": "workspace:*",
        "i18next": "^24.2.1",
        "i18next-browser-languagedetector": "^8.0.2",
        "next": "~16.2.3",
        "react": "^18",
        "react-dom": "^18",
        "react-i18next": "^15.4.0"
    },
    "devDependencies": {
        "@next/eslint-plugin-next": "^14.1.4",
        "@types/node": "^20",
        "@types/react": "^18",
        "@types/react-dom": "^18",
        "eslint": "^9.12.0",
        "eslint-config-next": "14.1.4",
        "typescript": "5.3.3"
    },
    "homepage": "https://vechain.github.io/next-template"
}
````

## Source: `examples/next-template/src/app/components/features/AccountInfo/AccountInfo.tsx`

````tsx
'use client';

import { Box, Heading, Text, Spinner } from '@chakra-ui/react';
import { useWallet, useGetB3trBalance } from '@vechain/vechain-kit';

export function AccountInfo() {
    const { smartAccount, connectedWallet } = useWallet();
    const { data: b3trBalance, isLoading: b3trBalanceLoading } =
        useGetB3trBalance(smartAccount.address ?? undefined);

    return (
        <>
            {smartAccount.address && (
                <Box>
                    <Heading size={'md'}>
                        <b>Smart Account</b>
                    </Heading>
                    <Text data-testid="smart-account-address">
                        Smart Account: {smartAccount.address}
                    </Text>
                    <Text data-testid="is-sa-deployed">
                        Deployed: {smartAccount.isDeployed.toString()}
                    </Text>
                    {b3trBalanceLoading ? (
                        <Spinner />
                    ) : (
                        <Text data-testid="b3tr-balance">
                            B3TR Balance: {b3trBalance?.formatted}
                        </Text>
                    )}
                </Box>
            )}

            <Box>
                <Heading size={'md'}>
                    <b>Wallet</b>
                </Heading>
                <Text data-testid="connected-wallet-address">
                    Address: {connectedWallet?.address}
                </Text>
            </Box>
        </>
    );
}
````

## Source: `examples/next-template/src/app/components/features/AccountInfo/index.ts`

````typescript
export * from './AccountInfo';
````

## Source: `examples/next-template/src/app/components/features/ConnectionInfo/ConnectionInfo.tsx`

````tsx
'use client';

import { Box, Heading, Text } from '@chakra-ui/react';
import { useWallet } from '@vechain/vechain-kit';

export function ConnectionInfo() {
    const { connection } = useWallet();

    return (
        <Box>
            <Heading size={'md'}>
                <b>Connection</b>
            </Heading>
            <Text data-testid="connection-type">Type: {connection.source.type}</Text>
            <Text data-testid="network">Network: {connection.network}</Text>
        </Box>
    );
}
````

## Source: `examples/next-template/src/app/components/features/ConnectionInfo/index.ts`

````typescript
export * from './ConnectionInfo';
````

## Source: `examples/next-template/src/app/components/features/CurrencySelector/CurrencySelector.tsx`

````tsx
'use client';

import { Box, Heading, VStack, Text, Select } from '@chakra-ui/react';
import { useCurrentCurrency, CURRENCY, CURRENCY_SYMBOLS } from '@vechain/vechain-kit';
import { useTranslation } from 'react-i18next';

const allCurrencies: CURRENCY[] = ['usd', 'eur', 'gbp'];

export function CurrencySelector() {
    const { t } = useTranslation();
    const { currentCurrency, setCurrency } = useCurrentCurrency();

    return (
        <Box>
            <Heading size={'md'}>
                <b>Currency Selection</b> (Bidirectional Sync)
            </Heading>
            <VStack mt={4} spacing={4} alignItems="flex-start">
                <Text>
                    Current currency: {CURRENCY_SYMBOLS[currentCurrency]} {currentCurrency.toUpperCase()}
                </Text>
                <Text fontSize="sm" color="gray.500">
                    Change currency here and it will sync to VeChainKit settings.
                    Changes in VeChainKit settings will also sync here.
                </Text>
                <Select
                    borderRadius={'md'}
                    size="sm"
                    width="auto"
                    value={currentCurrency}
                    onChange={(e) => setCurrency(e.target.value as CURRENCY)}
                    data-testid="select-currency"
                >
                    {allCurrencies.map((currency) => (
                        <option key={currency} value={currency}>
                            {CURRENCY_SYMBOLS[currency]} {currency.toUpperCase()}
                        </option>
                    ))}
                </Select>
            </VStack>
        </Box>
    );
}
````

## Source: `examples/next-template/src/app/components/features/CurrencySelector/index.ts`

````typescript
export * from './CurrencySelector';
````

## Source: `examples/next-template/src/app/components/features/DaoInfo/DaoInfo.tsx`

````tsx
'use client';

import { Box, Heading, Text } from '@chakra-ui/react';
import {
    useWallet,
    useCurrentAllocationsRoundId,
    useIsPerson,
} from '@vechain/vechain-kit';

export function DaoInfo() {
    const { account } = useWallet();
    const { data: currentAllocationsRoundId } = useCurrentAllocationsRoundId();
    const { data: isValidPassport } = useIsPerson(account?.address);

    return (
        <Box>
            <Heading size={'md'}>VeBetterDAO</Heading>
            <Text data-testid="current-allocation-round-id">
                Current Allocations Round ID: {currentAllocationsRoundId}
            </Text>
            <Text data-testid="is-passport-valid">
                Is Passport Valid: {isValidPassport?.toString()}
            </Text>
        </Box>
    );
}
````

## Source: `examples/next-template/src/app/components/features/DaoInfo/index.ts`

````typescript
export * from './DaoInfo';
````

## Source: `examples/next-template/src/app/components/features/LanguageSelector/LanguageSelector.tsx`

````tsx
'use client';

import { Box, Heading, VStack, Text, Select } from '@chakra-ui/react';
import { useTranslation } from '../../../../../node_modules/react-i18next';
import { languageNames, supportedLanguages } from '../../../../../i18n';
import { useCurrentLanguage } from '@vechain/vechain-kit';

export function LanguageSelector() {
    const { t, i18n } = useTranslation();
    const { currentLanguage, setLanguage } = useCurrentLanguage();

    return (
        <Box>
            <Heading size={'md'}>
                <b>Multilanguage</b> (Bidirectional Sync)
            </Heading>
            <VStack mt={4} spacing={4} alignItems="flex-start">
                <Text>
                    {t('Demo text to be translated')} - (language should change
                    also in modal and toast)
                </Text>
                <Text fontSize="sm" color="gray.500">
                    Current language: {currentLanguage}. Change language here and it will sync to VeChainKit settings.
                    Changes in VeChainKit settings will also sync here.
                </Text>
                <Select
                    borderRadius={'md'}
                    size="sm"
                    width="auto"
                    value={currentLanguage}
                    onChange={(e) => setLanguage(e.target.value)}
                    data-testid="select-language"
                >
                    {supportedLanguages.map((lang) => (
                        <option key={lang} value={lang}>
                            {languageNames[lang as keyof typeof languageNames]}
                        </option>
                    ))}
                </Select>
            </VStack>
        </Box>
    );
}
````

## Source: `examples/next-template/src/app/components/features/LanguageSelector/index.ts`

````typescript
export * from './LanguageSelector';
````

## Source: `examples/next-template/src/app/components/features/SigningExample/SigningExample.tsx`

````tsx
'use client';

import { ReactElement, useCallback } from 'react';
import {
    Button,
    VStack,
    Text,
    Code,
    useToast,
    Heading,
} from '@chakra-ui/react';
import {
    useWallet,
    useSignMessage,
    useSignTypedData,
    WalletButton,
} from '@vechain/vechain-kit';

// Example EIP-712 typed data
const exampleTypedData = {
    domain: {
        name: 'VeChain Example',
        version: '1',
        chainId: 1,
    },
    types: {
        Person: [
            { name: 'name', type: 'string' },
            { name: 'wallet', type: 'address' },
        ],
    },
    message: {
        name: 'Alice',
        wallet: '0x0000000000000000000000000000000000000000',
    },
    primaryType: 'Person',
};

export function SigningExample(): ReactElement {
    const { connection, account } = useWallet();
    const toast = useToast();

    const {
        signMessage,
        isSigningPending: isMessageSignPending,
        signature: messageSignature,
    } = useSignMessage();

    const {
        signTypedData,
        isSigningPending: isTypedDataSignPending,
        signature: typedDataSignature,
    } = useSignTypedData();

    const handleSignMessage = useCallback(async () => {
        try {
            const signature = await signMessage('Hello VeChain!');
            toast({
                title: 'Message signed!',
                description: `Signature: ${signature.slice(0, 20)}...`,
                status: 'success',
                duration: 1000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: 'Signing failed',
                description:
                    error instanceof Error ? error.message : String(error),
                status: 'error',
                duration: 1000,
                isClosable: true,
            });
        }
    }, [signMessage, toast]);

    const handleSignTypedData = useCallback(async () => {
        try {
            const signature = await signTypedData(exampleTypedData, {
                signer: account?.address,
            });
            toast({
                title: 'Typed data signed!',
                description: `Signature: ${signature.slice(0, 20)}...`,
                status: 'success',
                duration: 1000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: 'Signing failed',
                description:
                    error instanceof Error ? error.message : String(error),
                status: 'error',
                duration: 1000,
                isClosable: true,
            });
        }
    }, [signTypedData, toast, account]);

    if (!connection.isConnected) {
        return (
            <VStack spacing={4}>
                <Text>Connect your wallet to start signing messages</Text>
                <WalletButton />
            </VStack>
        );
    }

    return (
        <VStack spacing={6} align="stretch">
            <VStack align="stretch" spacing={4}>
                <Heading size="md">Sign Message</Heading>
                <Button
                    onClick={handleSignMessage}
                    isLoading={isMessageSignPending}
                    data-testid="sign-message-button"
                >
                    Sign "Hello VeChain!"
                </Button>
                {messageSignature && (
                    <Code p={2} borderRadius="md">
                        {messageSignature}
                    </Code>
                )}
            </VStack>

            <VStack align="stretch" spacing={4}>
                <Heading size="md">Sign Typed Data</Heading>
                <Button
                    onClick={handleSignTypedData}
                    isLoading={isTypedDataSignPending}
                    data-testid="sign-typed-data-button"
                >
                    Sign Typed Data
                </Button>
                {typedDataSignature && (
                    <Code p={2} borderRadius="md">
                        {typedDataSignature}
                    </Code>
                )}
            </VStack>
        </VStack>
    );
}
````

## Source: `examples/next-template/src/app/components/features/SigningExample/index.ts`

````typescript
export * from './SigningExample';
````

## Source: `examples/next-template/src/app/components/features/ThemeToggle/ThemeToggle.tsx`

````tsx
'use client';

import { Box, Button, useColorMode } from '@chakra-ui/react';

export function ThemeToggle() {
    const { colorMode, toggleColorMode } = useColorMode();

    return (
        <Box>
            <Button
                onClick={toggleColorMode}
                data-testid={`${colorMode === 'light' ? 'dark' : 'light'}-mode-button`}
            >
                Toggle {colorMode === 'light' ? 'Dark' : 'Light'} Mode
            </Button>
        </Box>
    );
}
````

## Source: `examples/next-template/src/app/components/features/ThemeToggle/index.ts`

````typescript
export * from './ThemeToggle';
````

## Source: `examples/next-template/src/app/components/features/TransactionExamples/TransactionExamples.tsx`

````tsx
'use client';

import { Box, Button, Heading, HStack } from '@chakra-ui/react';
import {
    useWallet,
    useThor,
    useBuildTransaction,
    useTransactionModal,
    useTransactionToast,
    TransactionModal,
    TransactionToast,
    useSendTransaction,
} from '@vechain/vechain-kit';
import { IB3TR__factory } from '@vechain/vechain-contract-types';
import { humanAddress } from '@vechain/vechain-kit/utils';
import { b3trMainnetAddress } from '../../../constants';
import { useCallback, useState } from 'react';

export function TransactionExamples() {
    const { account } = useWallet();
    const thor = useThor();

    const clauses = [
        {
            ...thor.contracts
                .load(b3trMainnetAddress, IB3TR__factory.abi)
                .clause.transfer(account?.address ?? '', BigInt('0')).clause,
            comment: `This is a dummy transaction to test the transaction modal. Confirm to transfer 0 B3TR to ${account?.address}`,
        },
    ];

    const callUseBuildTransaction = (delegationUrl?: string) => {
        return useBuildTransaction({
        clauseBuilder: () => {
            if (!account?.address) return [];

            return clauses;
        },
        refetchQueryKeys: [],
        onSuccess: () => {},
        onFailure: () => {},
        suggestedMaxGas: undefined,
        delegationUrl: delegationUrl,
    });}

    const callUseSendTransaction = (delegationUrl?: string) => {
        return useSendTransaction({
            signerAccountAddress: account?.address,
            delegationUrl: delegationUrl,
        });
    }

    const buildTransactionNoDelegation = callUseBuildTransaction();

    const delegationUrl = ""; // YOUR DELEGATION URL HERE

    const buildTransactionWithDelegation = callUseBuildTransaction(delegationUrl);

    const sendTransactionNoDelegation = callUseSendTransaction();

    const sendTransactionWithDelegation = callUseSendTransaction();

    const {
        open: openTransactionToast,
        close: closeTransactionToast,
        isOpen: isTransactionToastOpen,
    } = useTransactionToast();

    const {
        open: openTransactionModal,
        close: closeTransactionModal,
        isOpen: isTransactionModalOpen,
    } = useTransactionModal();

    // State to track which modal type is currently open
    const [currentModalType, setCurrentModalType] = useState<'useBuildTxWithDelegation' | 'useSendTxWithDelegation' | 'useBuildTxWithToast' | 'useSendTxWithToast' | null>(null);

    const handleTransactionWithToast = useCallback(async () => {
        setCurrentModalType('useBuildTxWithToast');
        openTransactionToast();
        await buildTransactionNoDelegation.sendTransaction({});
    }, [buildTransactionNoDelegation, openTransactionToast]);

    const handleBuildTransactionDelegatedWithModal = useCallback(async () => {
        setCurrentModalType('useBuildTxWithDelegation');
        openTransactionModal();
        await (buildTransactionWithDelegation.sendTransaction({}));
    }, [buildTransactionWithDelegation.sendTransaction, openTransactionModal]);

    const handleUseSendTransactionWithToast = useCallback(async () => {
        setCurrentModalType('useSendTxWithToast');
        openTransactionToast();
        await sendTransactionNoDelegation.sendTransaction(clauses);
    }, [sendTransactionNoDelegation.sendTransaction, openTransactionToast]);

    const handleSendTransactionDelegatedWithModal = useCallback(async () => {
        setCurrentModalType('useSendTxWithDelegation');
        openTransactionModal();
        await sendTransactionWithDelegation.sendTransaction(clauses, delegationUrl);
    }, [sendTransactionWithDelegation.sendTransaction, openTransactionModal]);

    const retryBuildTransactionDelegated = useCallback(async () => {
        buildTransactionWithDelegation.resetStatus();
        await buildTransactionWithDelegation.sendTransaction({});
    }, [buildTransactionWithDelegation.resetStatus, buildTransactionWithDelegation.sendTransaction]);

    const retryBuildTransactionNoDelegation = useCallback(async () => {
        buildTransactionNoDelegation.resetStatus();
        await buildTransactionNoDelegation.sendTransaction({});
    }, [buildTransactionNoDelegation.resetStatus, buildTransactionNoDelegation.sendTransaction]);

    const retrySendTransactionDelegated = useCallback(async () => {
        sendTransactionWithDelegation.resetStatus();
        await sendTransactionWithDelegation.sendTransaction(clauses, delegationUrl);
    }, [sendTransactionWithDelegation.resetStatus, sendTransactionWithDelegation.sendTransaction]);

    const retrySendTransactionNoDelegation = useCallback(async () => {
        sendTransactionNoDelegation.resetStatus();
        await sendTransactionNoDelegation.sendTransaction(clauses);
    }, [sendTransactionNoDelegation.resetStatus, sendTransactionNoDelegation.sendTransaction]);

    const closeModalAndReset = useCallback(() => {
        closeTransactionModal();
        setCurrentModalType(null);
    }, [closeTransactionModal]);

    return (
        <>
            <Box>
                <Heading size="md">
                    <b>Test Transactions</b>
                </Heading>
                <HStack mt={4} spacing={4}>
                    <Button
                        onClick={handleTransactionWithToast}
                        isLoading={buildTransactionNoDelegation.isTransactionPending}
                        isDisabled={buildTransactionNoDelegation.isTransactionPending}
                        data-testid="tx-with-toast-button"
                    >
                        useBuildTransaction with toast (no delegation)
                    </Button>
                    <Button
                        onClick={handleBuildTransactionDelegatedWithModal}
                        isLoading={buildTransactionWithDelegation.isTransactionPending}
                        isDisabled={buildTransactionWithDelegation.isTransactionPending}
                        data-testid="tx-with-modal-button"
                    >
                        useBuildTransaction with modal (delegated)
                    </Button>
                </HStack>
                <HStack mt={5} spacing={4}>
                    <Button
                        onClick={handleUseSendTransactionWithToast}
                        isLoading={sendTransactionNoDelegation.isTransactionPending}
                        isDisabled={sendTransactionNoDelegation.isTransactionPending}
                        data-testid="tx-with-toast-button"
                    >
                        useSendTransaction with toast (no delegation)
                    </Button>
                    <Button
                        onClick={handleSendTransactionDelegatedWithModal}
                        isLoading={sendTransactionWithDelegation.isTransactionPending}
                        isDisabled={sendTransactionWithDelegation.isTransactionPending}
                        data-testid="tx-with-modal-button"
                    >
                        useSendTransaction with modal (delegated)
                    </Button>
                </HStack>
            </Box>

            <TransactionToast
                isOpen={isTransactionToastOpen}
                onClose={closeTransactionToast}
                status={
                    currentModalType === 'useBuildTxWithToast'
                        ? buildTransactionNoDelegation.status
                        : sendTransactionNoDelegation.status
                }
                txError={
                    currentModalType === 'useBuildTxWithToast'
                        ? buildTransactionNoDelegation.error
                        : sendTransactionNoDelegation.error
                }
                txReceipt={
                    currentModalType === 'useBuildTxWithToast'
                        ? buildTransactionNoDelegation.txReceipt
                        : sendTransactionNoDelegation.txReceipt
                }
                onTryAgain={
                    currentModalType === 'useBuildTxWithToast'
                        ? retryBuildTransactionNoDelegation
                        : retrySendTransactionNoDelegation
                }
                description={`This is a dummy transaction to test the transaction modal. Confirm to transfer 0 B3TR to ${humanAddress(
                    account?.address ?? '',
                )}`}
            />

            {/* Single conditional modal that switches content based on currentModalType */}
            <TransactionModal
                isOpen={isTransactionModalOpen}
                onClose={closeModalAndReset}
                status={
                    currentModalType === 'useBuildTxWithDelegation'
                        ? buildTransactionWithDelegation.status ?? buildTransactionNoDelegation.status
                        : sendTransactionWithDelegation.status ?? sendTransactionNoDelegation.status
                }
                txReceipt={
                    currentModalType === 'useBuildTxWithDelegation'
                        ? buildTransactionWithDelegation.txReceipt ?? buildTransactionNoDelegation.txReceipt
                        : sendTransactionWithDelegation.txReceipt ?? sendTransactionNoDelegation.txReceipt
                }
                txError={
                    currentModalType === 'useBuildTxWithDelegation'
                        ? buildTransactionWithDelegation.error ?? buildTransactionNoDelegation.error
                        : sendTransactionWithDelegation.error ?? sendTransactionNoDelegation.error
                }
                onTryAgain={
                    currentModalType === 'useBuildTxWithDelegation'
                        ? retryBuildTransactionDelegated
                        : retrySendTransactionDelegated
                }
                uiConfig={{
                    title:
                        currentModalType === 'useBuildTxWithDelegation'
                            ? 'Test Transaction with DApp Sponsored'
                            : 'Test Transaction with useSendTransaction',
                    description: `This is a dummy transaction to test the transaction modal. Confirm to transfer 0 B3TR to ${humanAddress(
                        account?.address ?? '',
                    )}`,
                    showShareOnSocials: true,
                    showExplorerButton: true,
                    isClosable: true,
                }}
            />
        </>
    );
}
````

## Source: `examples/next-template/src/app/components/features/TransactionExamples/index.ts`

````typescript
export * from './TransactionExamples';
````

## Source: `examples/next-template/src/app/components/features/UIControls/UIControls.tsx`

````tsx
'use client';

import { Box, Button, Heading, HStack } from '@chakra-ui/react';
import { useColorMode } from '@chakra-ui/react';
import { useAccountModal } from '@vechain/vechain-kit';

export function UIControls() {
    const { toggleColorMode, colorMode } = useColorMode();
    const { open: openAccountModal } = useAccountModal();

    return (
        <Box>
            <Heading size={'md'}>
                <b>UI</b>
            </Heading>
            <HStack mt={4} spacing={4}>
                <Button
                    colorScheme="primary"
                    onClick={toggleColorMode}
                    data-testid={`${colorMode === 'dark' ? 'light' : 'dark' }-mode-button`}
                >
                    {colorMode === 'dark' ? 'Light mode' : 'Dark mode'}
                </Button>
                <Button
                    onClick={openAccountModal}
                    data-testid="account-modal-button"
                >
                    Account Modal
                </Button>
            </HStack>
        </Box>
    );
}
````

## Source: `examples/next-template/src/app/components/features/UIControls/index.ts`

````typescript
export * from './UIControls';
````

## Source: `examples/next-template/src/app/components/features/WelcomeSection/WelcomeSection.tsx`

````tsx
'use client';

import { Container, Text, VStack } from '@chakra-ui/react';
import { WalletButton } from '@vechain/vechain-kit';

export function WelcomeSection() {
    return (
        <Container alignItems={'center'} justifyContent={'center'}>
            <VStack spacing={10}>
                <Text textAlign={'center'}>
                    Hi! I'm VeChain Kit, a new way to access applications on
                    VeChain, and I'm here to show you my capabilities.
                </Text>
                <WalletButton
                    mobileVariant="iconDomainAndAssets"
                    desktopVariant="iconDomainAndAssets"
                />
            </VStack>
        </Container>
    );
}
````

## Source: `examples/next-template/src/app/components/features/WelcomeSection/index.ts`

````typescript
export * from './WelcomeSection';
````

## Source: `examples/next-template/src/app/constants.ts`

````typescript
export const b3trMainnetAddress = '0x5ef79995FE8a89e0812330E4378eB2660ceDe699';
export const b3trTestnetAddress = '0x95761346d18244bb91664181bf91193376197088';
export const b3trAbi = [
    // Replace this with your actual transfer function ABI
    {
        inputs: [
            {
                name: 'recipient',
                type: 'address',
            },
            {
                name: 'amount',
                type: 'uint256',
            },
        ],
        name: 'transfer',
        outputs: [
            {
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
] as const;

export const ENV = {
    isDevelopment: process.env.NEXT_PUBLIC_NETWORK_TYPE === 'test',
    isProduction: process.env.NEXT_PUBLIC_NETWORK_TYPE === 'main',
};
````

## Source: `examples/next-template/src/app/globals.css`

````css
body {
  margin: 0;
  display: flex;
  height: 100vh;
  align-items: center;
  justify-content: center;
}
h2 {
  margin: 0;
}
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid #000;
  border-radius: 20px;
  padding: 20px;
}
.label {
  margin-top: 20px;
  margin-bottom: 10px;
}
````

## Source: `examples/next-template/src/app/languages/en.json`

````json
{
    "Demo text to be translated": "Demo text to be translated"
}
````

## Source: `examples/next-template/src/app/layout.tsx`

````tsx
'use client';

import { ChakraProvider } from '@chakra-ui/react';
import './globals.css';
import dynamic from 'next/dynamic';
import { darkTheme } from './theme';

const VechainKitProviderWrapper = dynamic(
    async () =>
        (await import('./providers/VechainKitProviderWrapper'))
            .VechainKitProviderWrapper,
    {
        ssr: false,
    },
);

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning={true}>
            <head>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
            </head>
            <body>
                {/* Chakra UI Provider */}
                <ChakraProvider theme={darkTheme}>
                    {/* VechainKit Provider */}
                    <VechainKitProviderWrapper>
                        {children}
                    </VechainKitProviderWrapper>
                </ChakraProvider>
            </body>
        </html>
    );
}
````

## Source: `examples/next-template/src/app/page.tsx`

````tsx
'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const Home = dynamic(() => import('./pages/Home'), {
    ssr: false,
});

export default function Page() {
    return <Home />;
}
````

## Source: `examples/next-template/src/app/pages/Home.tsx`

````tsx
'use client';

import { type ReactElement } from 'react';
import { Container, Spinner, VStack } from '@chakra-ui/react';
import { useWallet, WalletButton } from '@vechain/vechain-kit';
import { AccountInfo } from '@/app/components/features/AccountInfo';
import { ConnectionInfo } from '@/app/components/features/ConnectionInfo';
import { DaoInfo } from '@/app/components/features/DaoInfo';
import { UIControls } from '@/app/components/features/UIControls';
import { LanguageSelector } from '@/app/components/features/LanguageSelector';
import { CurrencySelector } from '@/app/components/features/CurrencySelector';
import { TransactionExamples } from '@/app/components/features/TransactionExamples';
import { SigningExample } from '@/app/components/features/SigningExample/SigningExample';
import { WelcomeSection } from '../components/features/WelcomeSection';

export default function Home(): ReactElement {
    const { account, connection } = useWallet();

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
                <WalletButton
                    mobileVariant="iconDomainAndAssets"
                    desktopVariant="iconDomainAndAssets"
                />
                <AccountInfo />
                <ConnectionInfo />
                <DaoInfo />
                <UIControls />
                <LanguageSelector />
                <CurrencySelector />
                <TransactionExamples />
                <SigningExample />
            </VStack>
        </Container>
    );
}
````

## Source: `examples/next-template/src/app/providers/VechainKitProviderWrapper.tsx`

````tsx
'use client';

import { useCallback } from 'react';
import { useColorMode } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import '../../../i18n';
import { useTranslation } from 'react-i18next';

// Dynamic import is used here for several reasons:
// 1. The VechainKit component uses browser-specific APIs that aren't available during server-side rendering
// 2. Code splitting - this component will only be loaded when needed, reducing initial bundle size
// 3. The 'ssr: false' option ensures this component is only rendered on the client side
const VeChainKitProvider = dynamic(
    async () => (await import('@vechain/vechain-kit')).VeChainKitProvider,
    {
        ssr: false,
    },
);

interface Props {
    children: React.ReactNode;
}

export function VechainKitProviderWrapper({ children }: Props) {
    const { colorMode } = useColorMode();
    const { i18n } = useTranslation();

    const isDarkMode = colorMode === 'dark';

    // Listen to VeChainKit language changes and sync to host app's i18n
    const handleLanguageChange = useCallback(
        (language: string) => {
            i18n.changeLanguage(language);
        },
        [i18n],
    );

    // Listen to VeChainKit currency changes (can be used for host app state if needed)
    const handleCurrencyChange = useCallback(
        (_currency: 'usd' | 'eur' | 'gbp') => {
            // Currency changes are handled by VeChainKit internally
            // Add any host app-specific logic here if needed
        },
        [],
    );

    const coloredLogo =
        'https://vechain.org/wp-content/uploads/2025/02/VeChain_Icon_Quartz_300ppi.png';

    return (
        <VeChainKitProvider
            privy={{
                appId: process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
                clientId: process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID!,
                loginMethods: [
                    'google',
                    'apple',
                    'twitter',
                    'farcaster',
                    'email',
                    'discord',
                    'tiktok',
                    // 'rabby_wallet',
                    // 'coinbase_wallet',
                    // 'rainbow',
                    // 'phantom',
                    // 'metamask',
                ],
                appearance: {
                    loginMessage: 'Select a login method',
                    logo: coloredLogo,
                },
                embeddedWallets: {
                    createOnLogin: 'all-users',
                },
            }}
            dappKit={{
                allowedWallets: ['veworld', 'wallet-connect'],
                walletConnectOptions: {
                    projectId:
                        process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
                    metadata: {
                        name: 'VeChainKit Demo App',
                        description:
                            'This is a demo app to show you how the VechainKit works.',
                        url:
                            typeof window !== 'undefined'
                                ? window.location.origin
                                : '',
                        icons: [
                            typeof window !== 'undefined' ? coloredLogo : '',
                        ],
                    },
                },
            }}
            loginMethods={[
                { method: 'veworld', gridColumn: 4 },
                { method: 'google', gridColumn: 4 },
                { method: 'apple', gridColumn: 4 },
                { method: 'more', gridColumn: 4 },
            ]}
            loginModalUI={
                {
                    //description:
                    //   'Choose between social login through VeChain or by connecting your wallet.',
                }
            }
            darkMode={isDarkMode}
            onLanguageChange={handleLanguageChange}
            onCurrencyChange={handleCurrencyChange}
            // network={{
            //     type: process.env.NEXT_PUBLIC_NETWORK_TYPE,
            // }}
            allowCustomTokens={true}
            allowCommunityTokens={true}
            legalDocuments={{
                termsAndConditions: [
                    {
                        url: 'https://vechainkit.vechain.org/terms',
                        version: 1,
                        required: true,
                        displayName: 'Example T&C',
                    },
                ],
            }}
        >
            {children}
        </VeChainKitProvider>
    );
}
````

## Source: `examples/next-template/src/app/theme/button.ts`

````typescript
import { ComponentStyleConfig } from '@chakra-ui/react';

export const ButtonStyle: ComponentStyleConfig = {
    // style object for base or default style
    baseStyle: {},
    // styles for different sizes ("sm", "md", "lg")
    sizes: {},
    // styles for different visual variants ("outline", "solid")
    variants: {
        primarySubtle: {
            bg: 'rgba(224, 233, 254, 1)',
            color: 'primary.500',
            _hover: {
                bg: 'rgba(224, 233, 254, 0.8)',
            },
        },
        testVariant: {
            bg: 'primary.300',
            color: 'white',
        },
    },
    // default values for 'size', 'variant' and 'colorScheme'
    defaultProps: {
        size: 'md',
        rounded: 'full',
        variant: 'solid',
    },
};
````

## Source: `examples/next-template/src/app/theme/card.ts`

````typescript
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';
import { cardAnatomy } from '@chakra-ui/anatomy';

const { definePartsStyle, defineMultiStyleConfig } =
    createMultiStyleConfigHelpers(cardAnatomy.keys);

// define custom styles for funky variant
const variants = {
    base: () =>
        definePartsStyle({
            container: {
                bg: '#FFF',
                borderWidth: '0px',
                borderColor: 'transparent',
            },
        }),
    filled: () =>
        definePartsStyle({
            container: {
                bg: '#FAFAFA',
            },
        }),
    baseWithBorder: () =>
        definePartsStyle({
            container: {
                bg: '#FFF',
                borderWidth: '1px',
                borderColor: 'gray.100',
            },
        }),
    secondaryBoxShadow: () =>
        definePartsStyle({
            container: {
                boxShadow: '0px 0px 1px 1px #00000017',
                bg: '#FFF',
                borderWidth: '1px',
                borderColor: 'gray.100',
            },
        }),
    articles: () =>
        definePartsStyle({
            container: {
                boxShadow: '0px 0px 1px 1px #00000017',
            },
        }),
};

// export variants in the component theme
export const cardTheme = defineMultiStyleConfig({
    variants,
    defaultProps: {
        variant: 'base', // default is solid
    },
});
````

## Source: `examples/next-template/src/app/theme/colors.ts`

````typescript
export const lightPrimary = {
    '50': '#f0f9fe',
    '100': '#e1f3fd',
    '200': '#c3e7fb',
    '300': '#85d1f9',
    '400': '#4cbdf7',
    '500': '#23a9f6',
    '600': '#0d8bd4',
    '700': '#0b6ca6',
    '800': '#0a5178',
    '900': '#08354a',
    active: '#4cbdf7',
};

export const lightSecondary = {
    '50': '#ffffff',
    '100': '#F9F9FA',
    '200': '#e8e8ea',
    '300': '#d7d7da',
    '400': '#c6c6ca',
    '500': '#b5b5ba',
    '600': '#a4a4aa',
    '700': '#93939a',
    '800': '#82828a',
    '900': '#71717a',
};

export const lightTertiary = {
    100: '#e0f7fc',
    200: '#c2eff9',
    300: '#a3e7f6',
    400: '#85dff3',
    500: '#66d7f0',
    600: '#47cfed',
    700: '#29c7ea',
    800: '#0abfe7',
    900: '#00b7e0',
};

export const themeColors = {
    primary: lightPrimary,
    secondary: lightSecondary,
    tertiary: lightTertiary,
};
````

## Source: `examples/next-template/src/app/theme/index.ts`

````typescript
export * from "./theme";
````

## Source: `examples/next-template/src/app/theme/modal.ts`

````typescript
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } =
    createMultiStyleConfigHelpers(['modal']);

// define custom styles for funky variant
const variants = {
    base: definePartsStyle({}),
};

// export variants in the component theme
export const modalTheme = defineMultiStyleConfig({
    variants,
    defaultProps: {
        variant: 'base',
    },
});
````

## Source: `examples/next-template/src/app/theme/theme.tsx`

````tsx
import { extendTheme } from '@chakra-ui/react';
import { cardTheme } from './card';
import { ButtonStyle } from './button';
import { modalTheme } from './modal';
import { themeColors } from './colors';

const exampleTheme = {
    components: {
        Card: cardTheme,
        Button: ButtonStyle,
        Modal: modalTheme,
    },

    semanticTokens: {
        colors: {
            'chakra-body-text': {
                _dark: '#7F7FAC', // Added dark mode text color
                _light: '#1A202C',
            },
            'chakra-body-bg': {
                _dark: '#1A202C', // Added dark mode background color
                _light: '#FFFFFF',
            },
        },
    },
    borderRadius: {
        card: '16px',
        button: '24px',
    },
    shadows: {
        card: '0px 2px 8px rgba(0, 0, 0, 0.05)',
    },
    //@ts-ignore
    fonts: {
        heading: `"Instrument Sans Variable", sans-serif`,
        body: `"Inter Variable", sans-serif`,
    },
};

export const darkTheme = extendTheme({
    ...exampleTheme,
    config: {
        initialColorMode: 'dark',
        useSystemColorMode: false,
        cssVarPrefix: 'example',
    },

    colors: themeColors,
});
````

## Source: `examples/next-template/tsconfig.json`

````json
{
    "compilerOptions": {
        "target": "es5",
        "lib": ["dom", "dom.iterable", "esnext"],
        "allowJs": true,
        "skipLibCheck": true,
        "strict": true,
        "noEmit": true,
        "esModuleInterop": true,
        "module": "ESNext",
        "moduleResolution": "bundler",
        "resolveJsonModule": true,
        "allowImportingTsExtensions": true,
        "isolatedModules": true,
        "jsx": "preserve",
        "incremental": true,
        "tsBuildInfoFile": ".next/.tsbuildinfo",
        // Performance optimizations
        "assumeChangesOnlyAffectDirectDependencies": true,
        "plugins": [
            {
                "name": "next"
            }
        ],
        "paths": {
            "@/*": ["./src/*"],
            "@vechain-kit/*": ["../../packages/vechain-kit/src/*"]
        }
    },
    "include": [
        "next-env.d.ts",
        "**/*.ts",
        "**/*.tsx",
        ".next/types/**/*.ts",
        "dist/types/**/*.ts",
    ],
    "exclude": ["node_modules", ".next", "dist"],
    "ts-node": {
        "compilerOptions": {
            "module": "CommonJS"
        }
    }
}
````

## Source: `examples/playground/src/app/(playground)/ai-skills/page.tsx`

````tsx
'use client';

import { VStack } from '@chakra-ui/react';
import { AISkillsSection } from '../../components/features/AISkills/AISkillsSection';

export default function AISkillsPage() {
    return (
        <VStack align="stretch" spacing={6}>
            <AISkillsSection />
        </VStack>
    );
}
````

## Source: `examples/playground/src/app/(playground)/connect/page.tsx`

````tsx
'use client';

import { Heading, Text, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { DemoSection } from '../../components/demo/DemoSection';
import {
    WalletButtonVariants,
    OAuthGrid,
} from '../../components/features/Connect';

const WALLET_BUTTON_SNIPPET = `import { WalletButton, useConnectModal } from '@vechain/vechain-kit';

// 1. Default modal variant
<WalletButton />

// 2. Popover (desktop only)
<WalletButton connectionVariant="popover" />

// 3. Custom button style
<WalletButton
    buttonStyle={{
        background: '#f08098',
        color: 'white',
        border: '2px solid #000',
    }}
/>

// 4. Fully custom button
const { open } = useConnectModal();
<Button onClick={() => open()}>Sign in</Button>
`;

const OAUTH_SNIPPET = `import { useLoginWithOAuth } from '@vechain/vechain-kit';

function GoogleLogin() {
    const { initOAuth } = useLoginWithOAuth();
    return (
        <Button onClick={() => initOAuth({ provider: 'google' })}>
            Continue with Google
        </Button>
    );
}
`;

export default function ConnectPage() {
    const { t } = useTranslation();

    return (
        <VStack align="stretch" spacing={6}>
            <VStack align="stretch" spacing={2}>
                <Heading size="lg">{t('Connect & Auth')}</Heading>
                <Text opacity={0.7}>
                    {t(
                        'Drop-in wallet UI, plus a hook-first API to roll your own.',
                    )}
                </Text>
            </VStack>

            <DemoSection
                title={t('WalletButton variants')}
                description={t(
                    'One component, multiple presentation modes. Style it freely or replace it with your own button + useConnectModal.',
                )}
                hooks={['WalletButton', 'useConnectModal', 'useDAppKitWalletModal']}
                status="STABLE"
                code={WALLET_BUTTON_SNIPPET}
                aiPrompt={t(
                    'Add a "Sign in" button to my Next.js app header using WalletButton from @vechain/vechain-kit. Use the modal variant. Style it to match my design system (pink primary, rounded-full). On mobile, show only the icon variant.',
                )}
                aiSkills={['vechain-kit']}
            >
                <WalletButtonVariants />
            </DemoSection>

            <DemoSection
                title={t('Social login providers')}
                description={t(
                    'OAuth runs through your Privy app, or falls back to the VeChain whitelabel cross-app host out of the box.',
                )}
                hooks={['useLoginWithOAuth']}
                code={OAUTH_SNIPPET}
                aiPrompt={t(
                    'Add a "Continue with Google" and "Continue with Apple" button to my login screen using useLoginWithOAuth from @vechain/vechain-kit. Show the brand icons (FcGoogle, FaApple) and keep them as outline buttons.',
                )}
                aiSkills={['vechain-kit']}
            >
                <OAuthGrid />
            </DemoSection>
        </VStack>
    );
}
````

## Source: `examples/playground/src/app/(playground)/data/page.tsx`

````tsx
'use client';

import {
    Heading,
    HStack,
    Skeleton,
    Tag,
    Text,
    useColorMode,
    VStack,
} from '@chakra-ui/react';
import {
    useCurrentAllocationsRoundId,
    useGetB3trBalance,
    useGetTokenUsdPrice,
    useGetVot3Balance,
    useIsPerson,
    useWallet,
} from '@vechain/vechain-kit';
import { useTranslation } from 'react-i18next';
import { DemoSection } from '../../components/demo/DemoSection';
import { ConnectGate } from '../../components/demo/ConnectGate';

interface DataRowProps {
    label: string;
    value?: React.ReactNode;
    loading?: boolean;
    suffix?: string;
}

function DataRow({ label, value, loading, suffix }: DataRowProps) {
    const { colorMode } = useColorMode();
    return (
        <HStack
            justify="space-between"
            py={2}
            px={3}
            borderRadius="md"
            bg={colorMode === 'light' ? 'gray.50' : 'whiteAlpha.50'}
        >
            <Text fontSize="sm" fontWeight="medium">
                {label}
            </Text>
            {loading ? (
                <Skeleton h="14px" w="80px" />
            ) : (
                <HStack spacing={1}>
                    <Text fontFamily="mono" fontSize="sm">
                        {value ?? '—'}
                    </Text>
                    {suffix && (
                        <Text fontSize="xs" opacity={0.6}>
                            {suffix}
                        </Text>
                    )}
                </HStack>
            )}
        </HStack>
    );
}

const BALANCE_SNIPPET = `import {
    useGetB3trBalance,
    useGetVot3Balance,
} from '@vechain/vechain-kit';

function Balances({ address }) {
    const { data: b3tr, isLoading: l1 } = useGetB3trBalance(address);
    const { data: vot3, isLoading: l2 } = useGetVot3Balance(address);
    return (
        <ul>
            <li>B3TR: {l1 ? '…' : b3tr?.formatted}</li>
            <li>VOT3: {l2 ? '…' : vot3?.formatted}</li>
        </ul>
    );
}
`;

const PRICE_SNIPPET = `import { useGetTokenUsdPrice } from '@vechain/vechain-kit';

function VetPrice() {
    const { data: price } = useGetTokenUsdPrice('VET');
    return <p>VET / USD: \${price?.toFixed(4)}</p>;
}
`;

const VBD_SNIPPET = `import {
    useCurrentAllocationsRoundId,
    useIsPerson,
} from '@vechain/vechain-kit';

const { data: roundId } = useCurrentAllocationsRoundId();
const { data: isPerson } = useIsPerson(address);
`;

export default function DataPage() {
    const { t } = useTranslation();
    const { account } = useWallet();
    const address = account?.address ?? '';

    const { data: b3tr, isLoading: l1 } = useGetB3trBalance(address);
    const { data: vot3, isLoading: l2 } = useGetVot3Balance(address);
    const { data: vetPrice, isLoading: l3 } = useGetTokenUsdPrice('VET');
    const { data: roundId } = useCurrentAllocationsRoundId();
    const { data: isPerson } = useIsPerson(address);

    return (
        <VStack align="stretch" spacing={6}>
            <VStack align="stretch" spacing={2}>
                <Heading size="lg">{t('Reading Data')}</Heading>
                <Text opacity={0.7}>
                    {t(
                        'React Query hooks for on-chain data — efficient caching, automatic refetching, ready to compose.',
                    )}
                </Text>
            </VStack>

            <ConnectGate feature={t('Reading Data')}>
                <DemoSection
                    title={t('Account balances')}
                    description={t(
                        'B3TR and VOT3 balances for the connected address.',
                    )}
                    hooks={['useGetB3trBalance', 'useGetVot3Balance']}
                    code={BALANCE_SNIPPET}
                    aiPrompt={t(
                        'Build a "Portfolio" card that shows B3TR and VOT3 balances for the connected user via useGetB3trBalance and useGetVot3Balance from @vechain/vechain-kit. Show a Chakra UI Skeleton while loading, format numbers with thousand separators, and add a "Refresh" button that invalidates the queries.',
                    )}
                    aiSkills={['vechain-kit']}
                >
                    <VStack align="stretch" spacing={2}>
                        <DataRow
                            label={t('B3TR Balance')}
                            value={b3tr?.formatted ?? '0'}
                            loading={l1}
                        />
                        <DataRow
                            label={t('VOT3 Balance')}
                            value={vot3?.formatted ?? '0'}
                            loading={l2}
                        />
                    </VStack>
                </DemoSection>

                <DemoSection
                    title={t('Token prices')}
                    description={t(
                        'Live USD price from the kit price oracle.',
                    )}
                    hooks={['useGetTokenUsdPrice']}
                    code={PRICE_SNIPPET}
                    aiPrompt={t(
                        'Show the live VET/USD price in my app header using useGetTokenUsdPrice from @vechain/vechain-kit. Format it as $X.XXXX, refresh every 30 seconds, and add a tooltip that says "Powered by VeChain Kit".',
                    )}
                    aiSkills={['vechain-kit']}
                >
                    <DataRow
                        label={t('VET Price')}
                        value={vetPrice ? `$${vetPrice.toFixed(4)}` : '—'}
                        loading={l3}
                    />
                </DemoSection>

                <DemoSection
                    title={t('VeBetterDAO')}
                    description={t(
                        'Round metadata and passport validity for the connected account.',
                    )}
                    hooks={[
                        'useCurrentAllocationsRoundId',
                        'useIsPerson',
                    ]}
                    code={VBD_SNIPPET}
                    aiPrompt={t(
                        'In my X2Earn app, gate reward submission behind a valid VeBetterDAO passport. Use useIsPerson from @vechain/vechain-kit. If the user is not a valid person, show a banner explaining how to get one. Also display the current allocations round id with useCurrentAllocationsRoundId.',
                    )}
                    aiSkills={['vechain-kit', 'vebetterdao']}
                >
                    <VStack align="stretch" spacing={2}>
                        <DataRow
                            label={t('Current round')}
                            value={roundId ?? '—'}
                        />
                        <HStack
                            justify="space-between"
                            py={2}
                            px={3}
                            borderRadius="md"
                        >
                            <Text fontSize="sm" fontWeight="medium">
                                {t('Valid passport')}
                            </Text>
                            <Tag
                                size="sm"
                                colorScheme={isPerson ? 'green' : 'gray'}
                            >
                                {isPerson === undefined
                                    ? '—'
                                    : isPerson
                                    ? t('Yes')
                                    : t('No')}
                            </Tag>
                        </HStack>
                    </VStack>
                </DemoSection>
            </ConnectGate>
        </VStack>
    );
}
````

## Source: `examples/playground/src/app/(playground)/getting-started/page.tsx`

````tsx
'use client';

import {
    Box,
    Heading,
    SimpleGrid,
    Text,
    useColorMode,
    VStack,
    Icon,
    HStack,
} from '@chakra-ui/react';
import {
    LuLogIn,
    LuPenLine,
    LuArrowLeftRight,
    LuDatabase,
    LuPalette,
    LuShield,
    LuSparkles,
    LuArrowRight,
} from 'react-icons/lu';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Hero } from '../../components/demo/Hero';
import { InstallSnippet } from '../../components/demo/InstallSnippet';
import { CodeBlock } from '../../components/demo/CodeBlock';
import { DemoSection } from '../../components/demo/DemoSection';
import { IconType } from 'react-icons';

const PROVIDER_SNIPPET = `import { VeChainKitProvider } from '@vechain/vechain-kit';

export function Providers({ children }) {
    return (
        <VeChainKitProvider
            network={{ type: 'main' }}
            loginMethods={[
                { method: 'vechain', gridColumn: 4 },
                { method: 'dappkit', gridColumn: 4 },
                { method: 'email', gridColumn: 2 },
                { method: 'google', gridColumn: 2 },
            ]}
            dappKit={{
                allowedWallets: ['veworld', 'wallet-connect', 'sync2'],
                walletConnectOptions: {
                    projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID!,
                    metadata: {
                        name: 'My VeChain App',
                        description: 'A dApp built with VeChain Kit',
                        url: 'https://example.com',
                        icons: ['https://example.com/icon.png'],
                    },
                },
            }}
            darkMode
        >
            {children}
        </VeChainKitProvider>
    );
}
`;

interface FeatureProps {
    icon: IconType;
    title: string;
    description: string;
}

function FeatureTile({ icon, title, description }: FeatureProps) {
    const { colorMode } = useColorMode();
    return (
        <VStack
            align="flex-start"
            spacing={2}
            p={4}
            borderRadius="md"
            borderWidth="1px"
            borderColor={
                colorMode === 'light' ? 'gray.200' : 'whiteAlpha.200'
            }
            bg={colorMode === 'light' ? 'white' : 'whiteAlpha.50'}
        >
            <Icon
                as={icon}
                boxSize={5}
                color={colorMode === 'light' ? 'blue.500' : 'blue.300'}
            />
            <Text fontWeight="semibold" fontSize="sm">
                {title}
            </Text>
            <Text fontSize="xs" opacity={0.7}>
                {description}
            </Text>
        </VStack>
    );
}

export default function GettingStartedPage() {
    const { t } = useTranslation();

    return (
        <VStack align="stretch" spacing={8}>
            <Hero />

            <Box>
                <Heading size="md" mb={3}>
                    {t('What you get')}
                </Heading>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={3}>
                    <FeatureTile
                        icon={LuLogIn}
                        title={t('Connect & Auth')}
                        description={t(
                            'VeWorld, WalletConnect, social logins via Privy.',
                        )}
                    />
                    <FeatureTile
                        icon={LuShield}
                        title={t('Smart Account')}
                        description={t(
                            'Gas-less first action, recoverable, transferable.',
                        )}
                    />
                    <FeatureTile
                        icon={LuArrowLeftRight}
                        title={t('Transactions')}
                        description={t(
                            'Single & multi-clause txs with fee delegation.',
                        )}
                    />
                    <FeatureTile
                        icon={LuPenLine}
                        title={t('Signing')}
                        description={t(
                            'Personal messages and EIP-712 typed data.',
                        )}
                    />
                    <FeatureTile
                        icon={LuDatabase}
                        title={t('Reading Data')}
                        description={t(
                            'Balances, prices, VeBetterDAO and more.',
                        )}
                    />
                    <FeatureTile
                        icon={LuPalette}
                        title={t('Theming & i18n')}
                        description={t(
                            'Dark mode, custom themes, 15+ languages.',
                        )}
                    />
                </SimpleGrid>
            </Box>

            <DemoSection
                title={t('🚀 Start a new VeChain dApp')}
                description={t(
                    'The recommended path. Hand this prompt to your coding agent — it will read the VeChain skills and scaffold the entire project, provider included.',
                )}
                status="NEW"
                aiPrompt={t(
                    'Scaffold a new VeChain dApp for me using create-vechain-dapp, with:\n- VeChain Kit pre-wired (Privy social login: Google + email, plus VeWorld and WalletConnect)\n- Chakra UI v3 (with next-themes) and dark mode by default — follow the next-chakra-v3 example in the vechain-kit repo for wiring the kit\'s `theme` prop via `useChakraContext().token.var(...)` so theme tokens stay reactive\n- A landing page that shows the connected user\'s address, B3TR balance, and a "Send B3TR" button\n- A GitHub Pages deploy workflow ready to use\n\nName the project "my-vechain-dapp". When done, run `yarn dev` and tell me the URL.',
                )}
                aiSkills={['create-vechain-dapp', 'vechain-kit']}
            />

            <Box opacity={0.95}>
                <DemoSection
                    title={t('Or: add VeChain Kit to an existing project')}
                    description={t(
                        'Already have a Next.js app? Install the package, then either follow the provider snippet below or use the AI prompt to wire it up automatically.',
                    )}
                    hooks={['VeChainKitProvider']}
                    code={PROVIDER_SNIPPET}
                    aiPrompt={t(
                        'I already have a Next.js app and I want to add VeChain Kit to it.\n\n1. Install @vechain/vechain-kit and any required peer deps.\n2. Find my root layout (app/layout.tsx for App Router or pages/_app.tsx for Pages Router) and wrap it with VeChainKitProvider.\n3. Enable Privy social login (Google + email), VeWorld and WalletConnect.\n4. Read Privy keys from NEXT_PUBLIC_PRIVY_* and the WalletConnect projectId from NEXT_PUBLIC_WC_PROJECT_ID.\n5. Add a <WalletButton /> to my existing header.\n6. Don\'t change my existing Chakra theme.\n\nIf you hit peer-dependency conflicts, stop and tell me before applying any fix.',
                    )}
                    aiSkills={['vechain-kit']}
                >
                    <VStack align="stretch" spacing={4}>
                        <Text fontSize="sm" opacity={0.7}>
                            {t('Install the package manually:')}
                        </Text>
                        <InstallSnippet />
                    </VStack>
                </DemoSection>
            </Box>

            <Link href="/ai-skills" style={{ textDecoration: 'none' }}>
                <Box
                    p={5}
                    borderRadius="lg"
                    borderWidth="1px"
                    borderColor="blue.200"
                    bg="blue.50"
                    _dark={{
                        bg: 'whiteAlpha.50',
                        borderColor: 'whiteAlpha.300',
                    }}
                    _hover={{
                        transform: 'translateY(-2px)',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        shadow: 'md',
                    }}
                    cursor="pointer"
                >
                    <HStack spacing={4} align="flex-start">
                        <Icon
                            as={LuSparkles}
                            boxSize={6}
                            color="blue.500"
                            mt={1}
                            _dark={{ color: 'blue.300' }}
                        />
                        <VStack align="flex-start" spacing={1} flex={1}>
                            <HStack>
                                <Text fontWeight="semibold">
                                    {t('Ship VeChain dApps with AI')}
                                </Text>
                                <Text
                                    fontSize="xs"
                                    fontWeight="bold"
                                    letterSpacing="wider"
                                    textTransform="uppercase"
                                    px={2}
                                    py={0.5}
                                    borderRadius="full"
                                    bg="pink.500"
                                    color="white"
                                >
                                    {t('New')}
                                </Text>
                            </HStack>
                            <Text fontSize="sm" opacity={0.8}>
                                {t(
                                    'Install 11 VeChain skills in Claude Code, Cursor or any agent — domain knowledge for wallet UX, smart contracts, VeBetterDAO and more.',
                                )}
                            </Text>
                        </VStack>
                        <Icon as={LuArrowRight} boxSize={5} mt={1} />
                    </HStack>
                </Box>
            </Link>

            <HStack
                p={4}
                borderRadius="md"
                bg="gray.100"
                color="gray.700"
                _dark={{ bg: 'whiteAlpha.100', color: 'gray.300' }}
                spacing={3}
                align="flex-start"
            >
                <Text fontSize="sm">
                    {t(
                        'Use the sidebar to explore each capability. Pages with the wallet icon need a connection — sign in from the top bar.',
                    )}
                </Text>
            </HStack>
        </VStack>
    );
}
````

## Source: `examples/playground/src/app/(playground)/identity/page.tsx`

````tsx
'use client';

import { Heading, Text, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { DemoSection } from '../../components/demo/DemoSection';
import { ConnectGate } from '../../components/demo/ConnectGate';
import { IdentityPanel } from '../../components/features/Identity/IdentityPanel';
import { ConnectionInfo } from '../../components/features/ConnectionInfo';

const USE_WALLET_SNIPPET = `import { useWallet } from '@vechain/vechain-kit';

function Profile() {
    const { account, smartAccount, connectedWallet, connection } = useWallet();

    if (!account) return <p>Not connected</p>;

    return (
        <div>
            <p>Address: {account.address}</p>
            <p>Domain: {account.domain ?? 'none'}</p>
            <p>Smart account: {smartAccount.address}</p>
            <p>Source: {connection.source.type}</p>
        </div>
    );
}
`;

export default function IdentityPage() {
    const { t } = useTranslation();

    return (
        <VStack align="stretch" spacing={6}>
            <VStack align="stretch" spacing={2}>
                <Heading size="lg">{t('Identity')}</Heading>
                <Text opacity={0.7}>
                    {t(
                        'Inspect the connected account, its smart account, domain and connection source.',
                    )}
                </Text>
            </VStack>

            <ConnectGate feature={t('Identity')}>
                <DemoSection
                    title={t('Account details')}
                    description={t(
                        'Everything useWallet() exposes about the current session.',
                    )}
                    hooks={['useWallet']}
                    code={USE_WALLET_SNIPPET}
                    aiPrompt={t(
                        'Build a "ProfileCard" component that uses useWallet from @vechain/vechain-kit to show the connected user\'s address, VET domain, smart account address (with a "Deployed" tag), and a copy-to-clipboard button on each address. Truncate long addresses like 0x1234…abcd. Use Chakra UI v3.',
                    )}
                    aiSkills={['vechain-kit']}
                >
                    <IdentityPanel />
                </DemoSection>

                <DemoSection
                    title={t('Connection source')}
                    description={t(
                        'How the user is authenticated — direct wallet, Privy, or cross-app.',
                    )}
                    hooks={['useWallet']}
                    aiPrompt={t(
                        'Show a small badge in my app header indicating how the user is connected (Privy, Privy cross-app, or direct wallet). Read connection.source.type from useWallet and pick a color: blue for wallet, purple for privy, pink for cross-app.',
                    )}
                    aiSkills={['vechain-kit']}
                >
                    <ConnectionInfo />
                </DemoSection>
            </ConnectGate>
        </VStack>
    );
}
````

## Source: `examples/playground/src/app/(playground)/layout.tsx`

````tsx
'use client';

import { Box, Flex, useColorMode } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { Sidebar } from '../components/layout/Sidebar';
import { TopBar } from '../components/layout/TopBar';

export default function PlaygroundLayout({
    children,
}: {
    children: ReactNode;
}) {
    const { colorMode } = useColorMode();

    return (
        <Flex
            minH="100vh"
            bg={colorMode === 'light' ? 'gray.50' : '#0c0c10'}
        >
            <Box
                as="nav"
                display={{ base: 'none', md: 'block' }}
                w="260px"
                position="sticky"
                top={0}
                h="100vh"
                flexShrink={0}
            >
                <Sidebar />
            </Box>

            <Flex direction="column" flex={1} minW={0}>
                <TopBar />
                <Box
                    as="main"
                    flex={1}
                    px={{ base: 4, md: 8 }}
                    py={{ base: 6, md: 8 }}
                    maxW="6xl"
                    w="full"
                    mx="auto"
                >
                    {children}
                </Box>
            </Flex>
        </Flex>
    );
}
````

## Source: `examples/playground/src/app/(playground)/modals/page.tsx`

````tsx
'use client';

import { Heading, Text, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { DemoSection } from '../../components/demo/DemoSection';
import { ConnectGate } from '../../components/demo/ConnectGate';
import { ModalCatalog } from '../../components/features/ModalCatalog';

const MODAL_SNIPPET = `import { useSendTokenModal } from '@vechain/vechain-kit';

function SendButton() {
    const { open } = useSendTokenModal();
    return <Button onClick={() => open()}>Send tokens</Button>;
}
`;

export default function ModalsPage() {
    const { t } = useTranslation();

    return (
        <VStack align="stretch" spacing={6}>
            <VStack align="stretch" spacing={2}>
                <Heading size="lg">{t('Modals')}</Heading>
                <Text opacity={0.7}>
                    {t(
                        'Every feature in the kit ships as both a hook and a modal. Trigger them from your own UI.',
                    )}
                </Text>
            </VStack>

            <ConnectGate feature={t('Modals')}>
                <DemoSection
                    title={t('Modal catalog')}
                    description={t(
                        'Click any card to open the corresponding modal in isolated view. Each card lists the hook that opens it.',
                    )}
                    code={MODAL_SNIPPET}
                    aiPrompt={t(
                        'Add a quick-action row to my dashboard with three buttons: "Send", "Receive", and "Swap". Each opens the corresponding modal from @vechain/vechain-kit (useSendTokenModal, useReceiveModal, useSwapTokenModal). Use icons from react-icons/lu.',
                    )}
                    aiSkills={['vechain-kit']}
                >
                    <ModalCatalog />
                </DemoSection>
            </ConnectGate>
        </VStack>
    );
}
````

## Source: `examples/playground/src/app/(playground)/resources/page.tsx`

````tsx
'use client';

import { Heading, Text, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { ResourceList } from '../../components/features/Resources/ResourceList';

export default function ResourcesPage() {
    const { t } = useTranslation();

    return (
        <VStack align="stretch" spacing={6}>
            <VStack align="stretch" spacing={2}>
                <Heading size="lg">{t('Resources')}</Heading>
                <Text opacity={0.7}>
                    {t(
                        'Documentation, source code and integrations to go further with VeChain Kit.',
                    )}
                </Text>
            </VStack>

            <ResourceList />
        </VStack>
    );
}
````

## Source: `examples/playground/src/app/(playground)/signing/page.tsx`

````tsx
'use client';

import { Button, Heading, HStack, Text, useToast, VStack } from '@chakra-ui/react';
import {
    useSignMessage,
    useSignTypedData,
    useWallet,
} from '@vechain/vechain-kit';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { DemoSection } from '../../components/demo/DemoSection';
import { ConnectGate } from '../../components/demo/ConnectGate';
import { SignatureOutput } from '../../components/features/Signing/SignatureOutput';

const exampleTypedData = {
    domain: {
        name: 'VeChain Example',
        version: '1',
        chainId: 1,
    },
    types: {
        Person: [
            { name: 'name', type: 'string' },
            { name: 'wallet', type: 'address' },
        ],
    },
    message: {
        name: 'Alice',
        wallet: '0x0000000000000000000000000000000000000000',
    },
    primaryType: 'Person',
};

const SIGN_MESSAGE_SNIPPET = `import { useSignMessage } from '@vechain/vechain-kit';

function SignButton() {
    const { signMessage, signature, isSigningPending } = useSignMessage();

    return (
        <>
            <Button
                onClick={() => signMessage('Hello VeChain!')}
                isLoading={isSigningPending}
            >
                Sign message
            </Button>
            {signature && <code>{signature}</code>}
        </>
    );
}
`;

const SIGN_TYPED_DATA_SNIPPET = `import { useSignTypedData } from '@vechain/vechain-kit';

const typedData = {
    domain: { name: 'VeChain Example', version: '1', chainId: 1 },
    types: { Person: [{ name: 'name', type: 'string' }, { name: 'wallet', type: 'address' }] },
    primaryType: 'Person',
    message: { name: 'Alice', wallet: '0x000...' },
};

function SignTypedButton() {
    const { signTypedData, signature, isSigningPending } = useSignTypedData();
    return (
        <Button
            onClick={() => signTypedData(typedData)}
            isLoading={isSigningPending}
        >
            Sign typed data
        </Button>
    );
}
`;

function SignMessageDemo() {
    const { t } = useTranslation();
    const toast = useToast();
    const {
        signMessage,
        signature,
        isSigningPending,
    } = useSignMessage();

    const handle = useCallback(async () => {
        try {
            await signMessage('Hello VeChain!');
            toast({
                title: t('Message signed!'),
                status: 'success',
                duration: 1200,
            });
        } catch (e) {
            toast({
                title: t('Signing failed'),
                description: e instanceof Error ? e.message : String(e),
                status: 'error',
                duration: 1500,
            });
        }
    }, [signMessage, toast, t]);

    return (
        <VStack align="stretch" spacing={3}>
            <HStack>
                <Button onClick={handle} isLoading={isSigningPending}>
                    {t('Sign "Hello VeChain!"')}
                </Button>
            </HStack>
            <SignatureOutput signature={signature} />
        </VStack>
    );
}

function SignTypedDataDemo() {
    const { t } = useTranslation();
    const toast = useToast();
    const { account } = useWallet();
    const {
        signTypedData,
        signature,
        isSigningPending,
    } = useSignTypedData();

    const handle = useCallback(async () => {
        try {
            await signTypedData(exampleTypedData, {
                signer: account?.address,
            });
            toast({
                title: t('Typed data signed!'),
                status: 'success',
                duration: 1200,
            });
        } catch (e) {
            toast({
                title: t('Signing failed'),
                description: e instanceof Error ? e.message : String(e),
                status: 'error',
                duration: 1500,
            });
        }
    }, [signTypedData, account, toast, t]);

    return (
        <VStack align="stretch" spacing={3}>
            <HStack>
                <Button onClick={handle} isLoading={isSigningPending}>
                    {t('Sign typed data')}
                </Button>
            </HStack>
            <SignatureOutput signature={signature} />
        </VStack>
    );
}

export default function SigningPage() {
    const { t } = useTranslation();

    return (
        <VStack align="stretch" spacing={6}>
            <VStack align="stretch" spacing={2}>
                <Heading size="lg">{t('Signing')}</Heading>
                <Text opacity={0.7}>
                    {t(
                        'Sign plain messages or structured EIP-712 typed data — works for both wallet and embedded users.',
                    )}
                </Text>
            </VStack>

            <ConnectGate feature={t('Signing')}>
                <DemoSection
                    title={t('Personal sign')}
                    description={t(
                        'A simple message signature. Useful for proving ownership of an address.',
                    )}
                    hooks={['useSignMessage']}
                    code={SIGN_MESSAGE_SNIPPET}
                    aiPrompt={t(
                        'Add a "Verify ownership" button to my app that signs a server-issued nonce message using useSignMessage from @vechain/vechain-kit. After signing, POST the signature + the connected address to /api/verify so the backend can confirm ownership.',
                    )}
                    aiSkills={['vechain-kit', 'vechain-dev']}
                >
                    <SignMessageDemo />
                </DemoSection>

                <DemoSection
                    title={t('EIP-712 typed data')}
                    description={t(
                        'Structured signing — the standard for off-chain order books, permits and gasless approvals.',
                    )}
                    hooks={['useSignTypedData']}
                    code={SIGN_TYPED_DATA_SNIPPET}
                    aiPrompt={t(
                        'Build an EIP-712 typed-data sign flow using useSignTypedData from @vechain/vechain-kit. The schema is an Order({ trader: address, amount: uint256, expiry: uint256 }). After signing, log the signature so I can wire it into my marketplace backend.',
                    )}
                    aiSkills={['vechain-kit', 'vechain-dev']}
                >
                    <SignTypedDataDemo />
                </DemoSection>
            </ConnectGate>
        </VStack>
    );
}
````

## Source: `examples/playground/src/app/(playground)/smart-account/page.tsx`

````tsx
'use client';

import { Button, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import { useUpgradeSmartAccountModal } from '@vechain/vechain-kit';
import { useTranslation } from 'react-i18next';
import { LuRefreshCw } from 'react-icons/lu';
import { DemoSection } from '../../components/demo/DemoSection';
import { ConnectGate } from '../../components/demo/ConnectGate';
import { SmartAccountInfo } from '../../components/features/SmartAccountInfo';

const UPGRADE_SNIPPET = `import { useUpgradeSmartAccountModal } from '@vechain/vechain-kit';

function UpgradeButton() {
    const { open } = useUpgradeSmartAccountModal();
    return <Button onClick={open}>Upgrade smart account</Button>;
}
`;

function UpgradeButtonInline() {
    const { open } = useUpgradeSmartAccountModal();
    const { t } = useTranslation();
    return (
        <HStack>
            <Button leftIcon={<LuRefreshCw />} onClick={open}>
                {t('Open upgrade modal')}
            </Button>
        </HStack>
    );
}

export default function SmartAccountPage() {
    const { t } = useTranslation();

    return (
        <VStack align="stretch" spacing={6}>
            <VStack align="stretch" spacing={2}>
                <Heading size="lg">{t('Smart Account')}</Heading>
                <Text opacity={0.7}>
                    {t(
                        'Automatic smart account for Privy users. Gas-less first action, recoverable, transferable.',
                    )}
                </Text>
            </VStack>

            <DemoSection
                title={t('How smart accounts work')}
                description={t(
                    'A primer on the ownership and recovery model.',
                )}
                aiPrompt={t(
                    'Explain to me how smart accounts work in @vechain/vechain-kit when a user signs in with Privy. Cover: when the smart account gets deployed, who owns it, how recovery works, and how to read it via useWallet().',
                )}
                aiSkills={['vechain-kit', 'vechain-dev']}
            >
                <SmartAccountInfo />
            </DemoSection>

            <ConnectGate feature={t('Smart Account')}>
                <DemoSection
                    title={t('Upgrade smart account')}
                    description={t(
                        'Migrate the smart account to the latest version when a new release is published.',
                    )}
                    hooks={['useUpgradeSmartAccountModal']}
                    code={UPGRADE_SNIPPET}
                    aiPrompt={t(
                        'Add an "Upgrade smart account" item to my settings menu that opens the upgrade modal from useUpgradeSmartAccountModal in @vechain/vechain-kit. Only show it if the user is connected with Privy and the smart account version is behind the latest.',
                    )}
                    aiSkills={['vechain-kit']}
                >
                    <UpgradeButtonInline />
                </DemoSection>
            </ConnectGate>
        </VStack>
    );
}
````

## Source: `examples/playground/src/app/(playground)/theming/page.tsx`

````tsx
'use client';

import {
    Button,
    Heading,
    HStack,
    Icon,
    Select,
    Text,
    useColorMode,
    VStack,
} from '@chakra-ui/react';
import { useAccountModal } from '@vechain/vechain-kit';
import { LuMoon, LuSun } from 'react-icons/lu';
import { useTranslation } from 'react-i18next';
import { languageNames, supportedLanguages } from '../../../../i18n';
import { DemoSection } from '../../components/demo/DemoSection';

const THEME_SNIPPET = `import { ChakraProvider, useColorMode } from '@chakra-ui/react';
import { darkTheme } from './theme';

// 1. Wrap the app
<ChakraProvider theme={darkTheme}>{children}</ChakraProvider>

// 2. Toggle anywhere
const { colorMode, toggleColorMode } = useColorMode();
<Button onClick={toggleColorMode}>
    {colorMode === 'light' ? 'Dark' : 'Light'} mode
</Button>
`;

const I18N_SNIPPET = `import { useTranslation } from 'react-i18next';

function Greeting() {
    const { t, i18n } = useTranslation();
    return (
        <>
            <p>{t('Welcome')}</p>
            <select
                value={i18n.language}
                onChange={(e) => i18n.changeLanguage(e.target.value)}
            >
                <option value="en">English</option>
                <option value="it">Italiano</option>
                <option value="ja">日本語</option>
            </select>
        </>
    );
}
`;

function ThemeDemo() {
    const { colorMode, toggleColorMode } = useColorMode();
    const { t } = useTranslation();
    return (
        <HStack spacing={3}>
            <Button
                leftIcon={<Icon as={colorMode === 'light' ? LuMoon : LuSun} />}
                onClick={toggleColorMode}
            >
                {colorMode === 'light'
                    ? t('Switch to dark mode')
                    : t('Switch to light mode')}
            </Button>
            <Text fontSize="sm" opacity={0.7}>
                {t('Current mode')}: <strong>{colorMode}</strong>
            </Text>
        </HStack>
    );
}

function I18nDemo() {
    const { t, i18n } = useTranslation();
    const { open: openAccountModal } = useAccountModal();

    return (
        <VStack align="stretch" spacing={3}>
            <Text fontSize="sm">{t('Demo text to be translated')}</Text>
            <HStack spacing={2}>
                <Select
                    size="sm"
                    width="auto"
                    value={i18n.language}
                    onChange={(e) => i18n.changeLanguage(e.target.value)}
                >
                    {supportedLanguages.map((lang) => (
                        <option key={lang} value={lang}>
                            {languageNames[
                                lang as keyof typeof languageNames
                            ] ?? lang}
                        </option>
                    ))}
                </Select>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openAccountModal()}
                >
                    {t('Check language in account modal')}
                </Button>
            </HStack>
        </VStack>
    );
}

export default function ThemingPage() {
    const { t } = useTranslation();

    return (
        <VStack align="stretch" spacing={6}>
            <VStack align="stretch" spacing={2}>
                <Heading size="lg">{t('Theming & i18n')}</Heading>
                <Text opacity={0.7}>
                    {t(
                        'Light/dark mode + multi-language support, fully integrated with Chakra and react-i18next.',
                    )}
                </Text>
            </VStack>

            <DemoSection
                title={t('Dark / light mode')}
                description={t(
                    'Powered by Chakra `useColorMode`. The whole kit (including modals) follows the active mode.',
                )}
                hooks={['useColorMode']}
                code={THEME_SNIPPET}
                aiPrompt={t(
                    'Add a dark/light mode toggle to my Next.js + Chakra UI v3 app using next-themes. Persist the choice in localStorage and respect prefers-color-scheme on first visit. Show a sun/moon icon button in the header.',
                )}
                aiSkills={['vechain-kit']}
            >
                <ThemeDemo />
            </DemoSection>

            <DemoSection
                title={t('Multi-language support')}
                description={t(
                    'react-i18next ships with the kit. Add your keys, pick the languages you support, and translate.',
                )}
                hooks={['useTranslation']}
                code={I18N_SNIPPET}
                aiPrompt={t(
                    'Set up react-i18next in my Next.js app with English, Italian and Japanese. Create JSON files under src/app/languages/, detect the browser language with a localStorage fallback, and add a flag-based dropdown in the header to switch.',
                )}
                aiSkills={['vechain-kit', 'translate']}
            >
                <I18nDemo />
            </DemoSection>
        </VStack>
    );
}
````

## Source: `examples/playground/src/app/(playground)/transactions/page.tsx`

````tsx
'use client';

import {
    Button,
    Heading,
    HStack,
    Text,
    VStack,
} from '@chakra-ui/react';
import { useCallback } from 'react';
import {
    TransactionModal,
    TransactionToast,
    useBuildTransaction,
    useThor,
    useTransactionModal,
    useTransactionToast,
    useWallet,
} from '@vechain/vechain-kit';
import { IB3TR__factory } from '@vechain/vechain-contract-types';
import { useTranslation } from 'react-i18next';
import { b3trMainnetAddress } from '../../constants';
import { DemoSection } from '../../components/demo/DemoSection';
import { ConnectGate } from '../../components/demo/ConnectGate';
import { TxResultPanel } from '../../components/features/Transactions/TxResultPanel';

const TX_SNIPPET = `import {
    useBuildTransaction,
    useTransactionModal,
} from '@vechain/vechain-kit';
import { IB3TR__factory } from '@vechain/vechain-contract-types';

function SendButton({ to, amount }) {
    const thor = useThor();
    const { sendTransaction, status, txReceipt, error } = useBuildTransaction({
        clauseBuilder: () => [
            {
                ...thor.contracts
                    .load(B3TR_ADDRESS, IB3TR__factory.abi)
                    .clause.transfer(to, amount).clause,
                comment: 'Send B3TR',
            },
        ],
        gasPadding: 0.25,
    });

    const { open } = useTransactionModal();

    return (
        <Button onClick={() => { open(); sendTransaction({}); }}>
            Send
        </Button>
    );
}
`;

function TransactionDemo() {
    const { t } = useTranslation();
    const { account } = useWallet();
    const thor = useThor();

    const {
        sendTransaction,
        status,
        txReceipt,
        isTransactionPending,
        error,
        resetStatus,
    } = useBuildTransaction({
        clauseBuilder: () => {
            if (!account?.address) return [];
            return [
                {
                    ...thor.contracts
                        .load(b3trMainnetAddress, IB3TR__factory.abi)
                        .clause.transfer(account.address, BigInt('0')).clause,
                    comment: t(
                        'Dummy transaction: transfer 0 B3TR to your own address.',
                    ),
                },
            ];
        },
        gasPadding: 0.25,
    });

    const {
        open: openTransactionModal,
        close: closeTransactionModal,
        isOpen: isTransactionModalOpen,
    } = useTransactionModal();

    const {
        open: openTransactionToast,
        close: closeTransactionToast,
        isOpen: isTransactionToastOpen,
    } = useTransactionToast();

    const handleWithToast = useCallback(async () => {
        openTransactionToast();
        await sendTransaction({});
    }, [sendTransaction, openTransactionToast]);

    const handleWithModal = useCallback(async () => {
        openTransactionModal();
        await sendTransaction({});
    }, [sendTransaction, openTransactionModal]);

    const handleTryAgain = useCallback(async () => {
        resetStatus();
        await sendTransaction({});
    }, [resetStatus, sendTransaction]);

    return (
        <VStack align="stretch" spacing={4}>
            <Text fontSize="sm">
                {t(
                    'Send a 0-value B3TR transfer to your own address. Costs nothing, just exercises the full flow.',
                )}
            </Text>

            <HStack spacing={3} flexWrap="wrap">
                <Button
                    onClick={handleWithToast}
                    isLoading={isTransactionPending}
                >
                    {t('Test with Toast')}
                </Button>
                <Button
                    onClick={handleWithModal}
                    isLoading={isTransactionPending}
                    variant="outline"
                >
                    {t('Test with Modal')}
                </Button>
            </HStack>

            <TxResultPanel
                status={status}
                txReceipt={txReceipt}
                error={error}
                onTryAgain={handleTryAgain}
            />

            <TransactionToast
                isOpen={isTransactionToastOpen}
                onClose={closeTransactionToast}
                status={status}
                txError={error}
                txReceipt={txReceipt}
                onTryAgain={handleTryAgain}
                description={t(
                    'Dummy transaction: transfer 0 B3TR to your own address.',
                )}
            />

            <TransactionModal
                isOpen={isTransactionModalOpen}
                onClose={closeTransactionModal}
                status={status}
                txReceipt={txReceipt}
                onTryAgain={handleTryAgain}
                txError={error}
                uiConfig={{
                    title: t('Test Transaction'),
                    description: t(
                        'Dummy transaction: transfer 0 B3TR to your own address.',
                    ),
                    showShareOnSocials: true,
                    showExplorerButton: true,
                    isClosable: true,
                }}
            />
        </VStack>
    );
}

export default function TransactionsPage() {
    const { t } = useTranslation();

    return (
        <VStack align="stretch" spacing={6}>
            <VStack align="stretch" spacing={2}>
                <Heading size="lg">{t('Transactions')}</Heading>
                <Text opacity={0.7}>
                    {t(
                        'Build, send and track transactions with built-in UI (toast or modal) and fee delegation.',
                    )}
                </Text>
            </VStack>

            <ConnectGate feature={t('Transactions')}>
                <DemoSection
                    title={t('Send a test transaction')}
                    description={t(
                        'Two UI modes share the same useBuildTransaction state. Pick whichever fits your design.',
                    )}
                    hooks={[
                        'useBuildTransaction',
                        'useTransactionModal',
                        'useTransactionToast',
                    ]}
                    status="STABLE"
                    code={TX_SNIPPET}
                    aiPrompt={t(
                        'Build a "Send B3TR" form in my Next.js app that takes a recipient address and an amount, then sends the transaction using useBuildTransaction from @vechain/vechain-kit. Show progress in a transaction modal via useTransactionModal. Validate the address is a valid 0x… format and amount > 0 before sending. Use IB3TR__factory.abi from @vechain/vechain-contract-types for the clause builder.',
                    )}
                    aiSkills={['vechain-kit', 'vechain-dev']}
                >
                    <TransactionDemo />
                </DemoSection>
            </ConnectGate>
        </VStack>
    );
}
````

## Source: `examples/playground/src/app/components/demo/AIPromptBlock.tsx`

````tsx
'use client';

import {
    Box,
    Button,
    Divider,
    HStack,
    Icon,
    Text,
    useColorMode,
    useToast,
    VStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { LuCheck, LuCopy, LuSparkles } from 'react-icons/lu';
import { useTranslation } from 'react-i18next';

interface AIPromptBlockProps {
    prompt: string;
    requiredSkills?: string[];
}

const SKILL_REPO_BASE =
    'https://github.com/vechain/vechain-ai-skills/tree/main/skills';

function buildPreamble(skills: string[], lead: string, task: string): string {
    if (skills.length === 0) return '';
    const bullets = skills
        .map((s) => `- ${s}: ${SKILL_REPO_BASE}/${s}`)
        .join('\n');
    return `${lead}\n${bullets}\n\n${task}\n\n`;
}

export function AIPromptBlock({ prompt, requiredSkills = [] }: AIPromptBlockProps) {
    const { colorMode } = useColorMode();
    const { t } = useTranslation();
    const toast = useToast();
    const [copied, setCopied] = useState(false);

    const trimmed = prompt.replace(/^\n+|\n+$/g, '');
    const preamble = buildPreamble(
        requiredSkills,
        t(
            'Before doing anything, read these VeChain AI Skills so you follow current conventions:',
        ),
        t('Now the task:'),
    );
    const fullText = preamble + trimmed;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(fullText);
            setCopied(true);
            toast({
                title: t('Prompt copied!'),
                description: t(
                    'Paste it into Claude Code, Cursor or any AI agent.',
                ),
                status: 'success',
                duration: 1800,
                position: 'bottom-right',
                isClosable: true,
            });
            setTimeout(() => setCopied(false), 1800);
        } catch {
            toast({
                title: t('Copy failed'),
                status: 'error',
                duration: 1500,
            });
        }
    };

    const bgGradient =
        colorMode === 'light'
            ? 'linear(135deg, #f0f4ff 0%, #fce4ff 100%)'
            : 'linear(135deg, rgba(56,52,140,0.25) 0%, rgba(124,58,237,0.18) 50%, rgba(236,72,153,0.15) 100%)';

    const borderColor = colorMode === 'light' ? 'purple.200' : 'whiteAlpha.300';
    const headerColor = colorMode === 'light' ? 'purple.700' : 'purple.200';
    const bodyColor = colorMode === 'light' ? 'gray.800' : 'gray.100';
    const subduedColor = colorMode === 'light' ? 'gray.600' : 'gray.400';
    const linkColor = colorMode === 'light' ? 'purple.600' : 'purple.300';

    return (
        <VStack align="stretch" spacing={3} w="full">
            <Box
                w="full"
                borderRadius="lg"
                borderWidth="1px"
                borderColor={borderColor}
                bgGradient={bgGradient}
                overflow="hidden"
            >
                <HStack
                    justify="space-between"
                    px={4}
                    py={3}
                    borderBottomWidth="1px"
                    borderBottomColor={borderColor}
                >
                    <HStack spacing={2}>
                        <Icon as={LuSparkles} boxSize={4} color={headerColor} />
                        <Text
                            fontSize="xs"
                            fontWeight="bold"
                            letterSpacing="wider"
                            textTransform="uppercase"
                            color={headerColor}
                        >
                            {t('AI prompt')}
                        </Text>
                    </HStack>
                    <Button
                        size="xs"
                        variant="ghost"
                        leftIcon={<Icon as={copied ? LuCheck : LuCopy} />}
                        onClick={handleCopy}
                        color={headerColor}
                        _hover={{ bg: 'whiteAlpha.300' }}
                    >
                        {copied ? t('Copied!') : t('Copy prompt')}
                    </Button>
                </HStack>

                <VStack align="stretch" spacing={3} px={4} py={4}>
                    {requiredSkills.length > 0 && (
                        <>
                            <Box>
                                <Text
                                    fontSize="xs"
                                    fontWeight="semibold"
                                    color={subduedColor}
                                    textTransform="uppercase"
                                    letterSpacing="0.06em"
                                    mb={1}
                                >
                                    {t(
                                        'Before doing anything, read these VeChain AI Skills so you follow current conventions:',
                                    )}
                                </Text>
                                <VStack
                                    align="stretch"
                                    spacing={1}
                                    pl={2}
                                    mt={1}
                                >
                                    {requiredSkills.map((skill) => (
                                        <HStack key={skill} spacing={2}>
                                            <Text
                                                fontSize="sm"
                                                color={bodyColor}
                                                fontFamily="mono"
                                            >
                                                •
                                            </Text>
                                            <Text
                                                fontFamily="mono"
                                                fontSize="sm"
                                                color={bodyColor}
                                                fontWeight="semibold"
                                            >
                                                {skill}:
                                            </Text>
                                            <Text
                                                as="a"
                                                href={`${SKILL_REPO_BASE}/${skill}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                fontFamily="mono"
                                                fontSize="xs"
                                                color={linkColor}
                                                wordBreak="break-all"
                                                _hover={{
                                                    textDecoration: 'underline',
                                                }}
                                            >
                                                {`${SKILL_REPO_BASE}/${skill}`}
                                            </Text>
                                        </HStack>
                                    ))}
                                </VStack>
                            </Box>
                            <Divider borderColor={borderColor} />
                            <Text
                                fontSize="xs"
                                fontWeight="semibold"
                                color={subduedColor}
                                textTransform="uppercase"
                                letterSpacing="0.06em"
                            >
                                {t('Now the task:')}
                            </Text>
                        </>
                    )}
                    <Text
                        whiteSpace="pre-wrap"
                        fontSize={{ base: 'sm', md: 'md' }}
                        color={bodyColor}
                        lineHeight={1.6}
                    >
                        {trimmed}
                    </Text>
                </VStack>
            </Box>

            <HStack
                spacing={2}
                fontSize="xs"
                color={colorMode === 'light' ? 'gray.600' : 'gray.400'}
            >
                <Icon as={LuSparkles} boxSize={3} />
                <Text>
                    {t(
                        'Tip: install VeChain AI Skills first so your agent picks up domain context automatically.',
                    )}
                </Text>
            </HStack>
        </VStack>
    );
}
````

## Source: `examples/playground/src/app/components/demo/CodeBlock.tsx`

````tsx
'use client';

import {
    Box,
    HStack,
    IconButton,
    Text,
    useColorMode,
    useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { Highlight, themes } from 'prism-react-renderer';
import { LuCopy, LuCheck } from 'react-icons/lu';
import { useTranslation } from 'react-i18next';

interface CodeBlockProps {
    code: string;
    language?: string;
    label?: string;
}

export function CodeBlock({
    code,
    language = 'tsx',
    label,
}: CodeBlockProps) {
    const { colorMode } = useColorMode();
    const { t } = useTranslation();
    const toast = useToast();
    const [copied, setCopied] = useState(false);

    const theme = colorMode === 'light' ? themes.github : themes.nightOwl;
    const trimmed = code.replace(/^\n+|\n+$/g, '');

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(trimmed);
            setCopied(true);
            toast({
                title: t('Copied!'),
                status: 'success',
                duration: 1200,
                isClosable: true,
                position: 'bottom-right',
            });
            setTimeout(() => setCopied(false), 1500);
        } catch {
            toast({
                title: t('Copy failed'),
                status: 'error',
                duration: 1500,
                isClosable: true,
            });
        }
    };

    return (
        <Box
            borderRadius="md"
            overflow="hidden"
            borderWidth="1px"
            borderColor={colorMode === 'light' ? 'gray.200' : 'whiteAlpha.200'}
            bg={colorMode === 'light' ? 'gray.50' : 'rgba(13, 17, 23, 0.95)'}
            w="full"
        >
            <HStack
                justify="space-between"
                px={3}
                py={2}
                borderBottomWidth="1px"
                borderBottomColor={
                    colorMode === 'light' ? 'gray.200' : 'whiteAlpha.200'
                }
            >
                <Text
                    fontSize="xs"
                    fontFamily="mono"
                    opacity={0.7}
                    textTransform="uppercase"
                    letterSpacing="0.05em"
                >
                    {label ?? language}
                </Text>
                <IconButton
                    aria-label={t('Copy')}
                    size="xs"
                    variant="ghost"
                    icon={copied ? <LuCheck /> : <LuCopy />}
                    onClick={handleCopy}
                />
            </HStack>
            <Box overflowX="auto" px={4} py={3}>
                <Highlight code={trimmed} language={language} theme={theme}>
                    {({
                        className,
                        style,
                        tokens,
                        getLineProps,
                        getTokenProps,
                    }) => (
                        <pre
                            className={className}
                            style={{
                                ...style,
                                background: 'transparent',
                                margin: 0,
                                fontFamily:
                                    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                                fontSize: '13px',
                                lineHeight: 1.55,
                            }}
                        >
                            {tokens.map((line, i) => (
                                <div
                                    key={i}
                                    {...getLineProps({ line })}
                                    style={{ display: 'table-row' }}
                                >
                                    <span
                                        style={{
                                            display: 'table-cell',
                                            paddingRight: '1rem',
                                            opacity: 0.4,
                                            userSelect: 'none',
                                            textAlign: 'right',
                                            minWidth: '2ch',
                                        }}
                                    >
                                        {i + 1}
                                    </span>
                                    <span style={{ display: 'table-cell' }}>
                                        {line.map((token, key) => (
                                            <span
                                                key={key}
                                                {...getTokenProps({ token })}
                                            />
                                        ))}
                                    </span>
                                </div>
                            ))}
                        </pre>
                    )}
                </Highlight>
            </Box>
        </Box>
    );
}
````

## Source: `examples/playground/src/app/components/demo/ConnectGate.tsx`

````tsx
'use client';

import { ReactNode } from 'react';
import { useWallet } from '@vechain/vechain-kit';
import { LoginToContinueBox } from '../features/LoginToContinueBox';
import { useTranslation } from 'react-i18next';

interface ConnectGateProps {
    feature: string;
    children: ReactNode;
}

export function ConnectGate({ feature, children }: ConnectGateProps) {
    const { account } = useWallet();
    const { t } = useTranslation();

    if (account) return <>{children}</>;

    return (
        <LoginToContinueBox
            title={t('Connect to try {{feature}}', { feature })}
            description={t(
                'Sign in with a VeChain wallet or social account to unlock this demo.',
            )}
        />
    );
}
````

## Source: `examples/playground/src/app/components/demo/CopyAddress.tsx`

````tsx
'use client';

import {
    HStack,
    IconButton,
    Text,
    useColorMode,
    useToast,
} from '@chakra-ui/react';
import { LuCopy } from 'react-icons/lu';
import { useTranslation } from 'react-i18next';

interface CopyAddressProps {
    address: string;
    truncate?: boolean;
    fontSize?: string;
}

function shorten(address: string) {
    if (address.length <= 12) return address;
    return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export function CopyAddress({
    address,
    truncate = true,
    fontSize = 'sm',
}: CopyAddressProps) {
    const { colorMode } = useColorMode();
    const { t } = useTranslation();
    const toast = useToast();

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(address);
            toast({
                title: t('Copied!'),
                status: 'success',
                duration: 1200,
                isClosable: true,
                position: 'bottom-right',
            });
        } catch {
            toast({
                title: t('Copy failed'),
                status: 'error',
                duration: 1500,
            });
        }
    };

    return (
        <HStack spacing={1}>
            <Text
                fontFamily="mono"
                fontSize={fontSize}
                color={colorMode === 'light' ? 'gray.700' : 'gray.300'}
            >
                {truncate ? shorten(address) : address}
            </Text>
            <IconButton
                aria-label={t('Copy')}
                size="xs"
                variant="ghost"
                icon={<LuCopy />}
                onClick={handleCopy}
            />
        </HStack>
    );
}
````

## Source: `examples/playground/src/app/components/demo/DemoSection.tsx`

````tsx
'use client';

import {
    Box,
    Heading,
    HStack,
    Icon,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Text,
    VStack,
    useColorMode,
    Wrap,
    WrapItem,
} from '@chakra-ui/react';
import { ReactNode } from 'react';
import { LuSparkles } from 'react-icons/lu';
import { useTranslation } from 'react-i18next';
import { CodeBlock } from './CodeBlock';
import { HookBadge } from './HookBadge';
import { Status, StatusBadge } from './StatusBadge';
import { AIPromptBlock } from './AIPromptBlock';

interface DemoSectionProps {
    title: string;
    description?: string;
    hooks?: string[];
    status?: Status;
    code?: string;
    codeLanguage?: string;
    aiPrompt?: string;
    aiSkills?: string[];
    children?: ReactNode;
}

export function DemoSection({
    title,
    description,
    hooks = [],
    status,
    code,
    codeLanguage = 'tsx',
    aiPrompt,
    aiSkills,
    children,
}: DemoSectionProps) {
    const { colorMode } = useColorMode();
    const { t } = useTranslation();

    const hasCode = Boolean(code);
    const hasAI = Boolean(aiPrompt);
    const tabCount = (children ? 1 : 0) + (hasCode ? 1 : 0) + (hasAI ? 1 : 0);

    return (
        <Box
            as="section"
            w="full"
            borderRadius="lg"
            borderWidth="1px"
            borderColor={colorMode === 'light' ? 'gray.200' : 'whiteAlpha.200'}
            bg={colorMode === 'light' ? 'white' : 'whiteAlpha.50'}
            overflow="hidden"
        >
            <VStack
                align="stretch"
                spacing={4}
                p={{ base: 4, md: 6 }}
                borderBottomWidth={tabCount > 0 ? '1px' : 0}
                borderBottomColor={
                    colorMode === 'light' ? 'gray.100' : 'whiteAlpha.100'
                }
            >
                <HStack
                    justify="space-between"
                    align="flex-start"
                    flexWrap="wrap"
                    spacing={3}
                >
                    <Heading size="md" fontWeight="semibold">
                        {title}
                    </Heading>
                    {status && <StatusBadge status={status} />}
                </HStack>

                {description && (
                    <Text
                        fontSize="sm"
                        color={colorMode === 'light' ? 'gray.600' : 'gray.300'}
                    >
                        {description}
                    </Text>
                )}

                {hooks.length > 0 && (
                    <Wrap spacing={2}>
                        {hooks.map((h) => (
                            <WrapItem key={h}>
                                <HookBadge name={h} />
                            </WrapItem>
                        ))}
                    </Wrap>
                )}
            </VStack>

            {tabCount > 1 ? (
                <Tabs variant="line" colorScheme="blue" size="sm" isLazy>
                    <TabList px={{ base: 2, md: 4 }}>
                        {children && (
                            <Tab fontWeight="medium">{t('Live demo')}</Tab>
                        )}
                        {hasCode && (
                            <Tab fontWeight="medium">{t('View code')}</Tab>
                        )}
                        {hasAI && (
                            <Tab fontWeight="medium">
                                <HStack spacing={1.5}>
                                    <Icon as={LuSparkles} boxSize={3.5} />
                                    <Text>{t('AI prompt')}</Text>
                                </HStack>
                            </Tab>
                        )}
                    </TabList>
                    <TabPanels>
                        {children && (
                            <TabPanel p={{ base: 4, md: 6 }}>
                                {children}
                            </TabPanel>
                        )}
                        {hasCode && (
                            <TabPanel p={{ base: 3, md: 4 }}>
                                <CodeBlock
                                    code={code!}
                                    language={codeLanguage}
                                />
                            </TabPanel>
                        )}
                        {hasAI && (
                            <TabPanel p={{ base: 3, md: 4 }}>
                                <AIPromptBlock
                                    prompt={aiPrompt!}
                                    requiredSkills={aiSkills}
                                />
                            </TabPanel>
                        )}
                    </TabPanels>
                </Tabs>
            ) : tabCount === 1 ? (
                <Box p={{ base: 4, md: 6 }}>
                    {children}
                    {hasCode && !children && (
                        <CodeBlock code={code!} language={codeLanguage} />
                    )}
                    {hasAI && !children && !hasCode && (
                        <AIPromptBlock
                            prompt={aiPrompt!}
                            requiredSkills={aiSkills}
                        />
                    )}
                </Box>
            ) : null}
        </Box>
    );
}
````

## Source: `examples/playground/src/app/components/demo/Hero.tsx`

````tsx
'use client';

import {
    Box,
    Button,
    Heading,
    HStack,
    Icon,
    Text,
    VStack,
    useColorMode,
} from '@chakra-ui/react';
import { LuGithub, LuBook, LuSparkles } from 'react-icons/lu';
import { useTranslation } from 'react-i18next';
import { WalletButton, useWallet } from '@vechain/vechain-kit';

export function Hero() {
    const { colorMode } = useColorMode();
    const { t } = useTranslation();
    const { account } = useWallet();

    return (
        <Box
            position="relative"
            borderRadius="2xl"
            overflow="hidden"
            px={{ base: 6, md: 12 }}
            py={{ base: 10, md: 16 }}
            bgGradient={
                colorMode === 'light'
                    ? 'linear(135deg, blue.50 0%, white 50%, purple.50 100%)'
                    : 'linear(135deg, rgba(35,169,246,0.18) 0%, rgba(20,20,30,0.6) 50%, rgba(127,86,217,0.18) 100%)'
            }
            borderWidth="1px"
            borderColor={
                colorMode === 'light' ? 'blue.100' : 'whiteAlpha.200'
            }
        >
            <VStack align="flex-start" spacing={6} maxW="2xl">
                <HStack
                    px={3}
                    py={1}
                    borderRadius="full"
                    bg={colorMode === 'light' ? 'blue.100' : 'whiteAlpha.200'}
                    fontSize="xs"
                    fontWeight="semibold"
                    letterSpacing="0.06em"
                    textTransform="uppercase"
                    color={colorMode === 'light' ? 'blue.700' : 'blue.200'}
                    spacing={2}
                >
                    <Icon as={LuSparkles} boxSize={3} />
                    <Text>{t('AI-friendly playground')}</Text>
                </HStack>

                <Heading
                    size={{ base: 'xl', md: '2xl' }}
                    lineHeight={1.15}
                    fontWeight="bold"
                >
                    {t('The complete toolkit for VeChain dApps')}
                </Heading>

                <Text
                    fontSize={{ base: 'md', md: 'lg' }}
                    color={colorMode === 'light' ? 'gray.700' : 'gray.300'}
                >
                    {t(
                        'Every demo ships with three things: a live preview, the code, and a ready-made prompt you can paste into Claude Code, Cursor or any AI agent.',
                    )}
                </Text>

                <HStack spacing={3} flexWrap="wrap">
                    {!account && (
                        <WalletButton
                            mobileVariant="iconDomainAndAssets"
                            desktopVariant="iconDomainAndAssets"
                            label={t('Connect wallet')}
                        />
                    )}
                    <Button
                        as="a"
                        href="https://docs.vechainkit.vechain.org/"
                        target="_blank"
                        rel="noopener noreferrer"
                        leftIcon={<Icon as={LuBook} />}
                        variant="outline"
                    >
                        {t('Read the docs')}
                    </Button>
                    <Button
                        as="a"
                        href="https://github.com/vechain/vechain-kit"
                        target="_blank"
                        rel="noopener noreferrer"
                        leftIcon={<Icon as={LuGithub} />}
                        variant="ghost"
                    >
                        {t('GitHub')}
                    </Button>
                </HStack>
            </VStack>
        </Box>
    );
}
````

## Source: `examples/playground/src/app/components/demo/HookBadge.tsx`

````tsx
'use client';

import { Link, Tag, TagLabel, useColorMode } from '@chakra-ui/react';

interface HookBadgeProps {
    name: string;
}

const DOCS_BASE = 'https://docs.vechainkit.vechain.org';

function docsUrlFor(name: string) {
    return `${DOCS_BASE}/?q=${encodeURIComponent(name)}`;
}

export function HookBadge({ name }: HookBadgeProps) {
    const { colorMode } = useColorMode();

    return (
        <Link
            href={docsUrlFor(name)}
            isExternal
            _hover={{ textDecoration: 'none' }}
        >
            <Tag
                size="sm"
                borderRadius="full"
                fontFamily="mono"
                fontSize="xs"
                bg={colorMode === 'light' ? 'blue.50' : 'whiteAlpha.100'}
                color={colorMode === 'light' ? 'blue.700' : 'blue.200'}
                borderWidth="1px"
                borderColor={
                    colorMode === 'light' ? 'blue.200' : 'whiteAlpha.300'
                }
                _hover={{
                    bg: colorMode === 'light' ? 'blue.100' : 'whiteAlpha.200',
                }}
                cursor="pointer"
            >
                <TagLabel>{name}</TagLabel>
            </Tag>
        </Link>
    );
}
````

## Source: `examples/playground/src/app/components/demo/InstallSnippet.tsx`

````tsx
'use client';

import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { CodeBlock } from './CodeBlock';

const COMMANDS: Array<{ name: string; cmd: string }> = [
    { name: 'yarn', cmd: 'yarn add @vechain/vechain-kit' },
    { name: 'npm', cmd: 'npm install @vechain/vechain-kit' },
    { name: 'pnpm', cmd: 'pnpm add @vechain/vechain-kit' },
];

export function InstallSnippet() {
    return (
        <Tabs variant="soft-rounded" colorScheme="blue" size="sm">
            <TabList>
                {COMMANDS.map((c) => (
                    <Tab key={c.name}>{c.name}</Tab>
                ))}
            </TabList>
            <TabPanels>
                {COMMANDS.map((c) => (
                    <TabPanel key={c.name} px={0} pt={3}>
                        <CodeBlock code={c.cmd} language="bash" label={c.name} />
                    </TabPanel>
                ))}
            </TabPanels>
        </Tabs>
    );
}
````

## Source: `examples/playground/src/app/components/demo/StatusBadge.tsx`

````tsx
'use client';

import { Tag, TagLabel } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

export type Status = 'NEW' | 'BETA' | 'ALPHA' | 'STABLE';

interface StatusBadgeProps {
    status: Status;
}

const COLOR_SCHEMES: Record<Status, string> = {
    NEW: 'pink',
    BETA: 'purple',
    ALPHA: 'orange',
    STABLE: 'green',
};

export function StatusBadge({ status }: StatusBadgeProps) {
    const { t } = useTranslation();
    const labels: Record<Status, string> = {
        NEW: t('New'),
        BETA: t('Beta'),
        ALPHA: t('Alpha'),
        STABLE: t('Stable'),
    };

    return (
        <Tag
            size="sm"
            borderRadius="full"
            colorScheme={COLOR_SCHEMES[status]}
            textTransform="uppercase"
            fontWeight="bold"
            letterSpacing="0.05em"
            fontSize="2xs"
        >
            <TagLabel>{labels[status]}</TagLabel>
        </Tag>
    );
}
````

## Source: `examples/playground/src/app/components/demo/index.ts`

````typescript
export { CodeBlock } from './CodeBlock';
export { HookBadge } from './HookBadge';
export { StatusBadge } from './StatusBadge';
export type { Status } from './StatusBadge';
export { CopyAddress } from './CopyAddress';
export { DemoSection } from './DemoSection';
export { Hero } from './Hero';
export { InstallSnippet } from './InstallSnippet';
export { ConnectGate } from './ConnectGate';
export { AIPromptBlock } from './AIPromptBlock';
````

## Source: `examples/playground/src/app/components/features/AISkills/AISkillsSection.tsx`

````tsx
'use client';

import {
    Box,
    Button,
    Heading,
    HStack,
    Icon,
    IconButton,
    SimpleGrid,
    Stack,
    Text,
    useColorMode,
    useColorModeValue,
    VStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LuCheck, LuCopy, LuGithub, LuSparkles } from 'react-icons/lu';

const CLI_COMMAND = 'npx skills add vechain/vechain-ai-skills';
const CLAUDE_COMMAND = '/plugin marketplace add vechain/vechain-ai-skills';
const REPO_URL = 'https://github.com/vechain/vechain-ai-skills';

const SKILLS: { name: string; descKey: string }[] = [
    {
        name: 'vechain-dev',
        descKey: 'Core SDK, fee delegation, multi-clause transactions.',
    },
    {
        name: 'vechain-kit',
        descKey: 'Frontend dApps, wallet, social login, hooks.',
    },
    {
        name: 'smart-contract-development',
        descKey: 'Solidity, Hardhat, testing, security.',
    },
    {
        name: 'vebetterdao',
        descKey: 'X2Earn apps, B3TR/VOT3, governance.',
    },
    {
        name: 'stargate',
        descKey: 'NFT staking, validators, delegation.',
    },
    {
        name: 'create-vechain-dapp',
        descKey: 'Scaffold a VeChain dApp in seconds.',
    },
    {
        name: 'vechain-react-native-dev',
        descKey: 'VeWorld deep-link integration.',
    },
    {
        name: 'indexer-core',
        descKey: 'Index VeChain events and blocks for apps or analytics.',
    },
    {
        name: 'auto-voting-relayers',
        descKey: 'Auto-voting & relayer system.',
    },
    {
        name: 'translate',
        descKey: 'i18n translation management across locales.',
    },
    {
        name: 'grill-me',
        descKey: 'Pressure-tests your plan before you write code.',
    },
];

function TerminalBlock({ command, label }: { command: string; label: string }) {
    const { t } = useTranslation();
    const [copied, setCopied] = useState(false);

    const bgColor = useColorModeValue('#1a1a1a', '#0d1117');
    const textColor = '#c9d1d9';
    const promptColor = '#58a6ff';
    const borderColor = useColorModeValue('#30363d', '#21262d');
    const labelColor = useColorModeValue('gray.600', 'gray.400');

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(command);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // ignore
        }
    };

    return (
        <VStack align="stretch" spacing={2} w="full">
            <Text
                fontSize="sm"
                fontWeight="medium"
                color={labelColor}
                textAlign="left"
            >
                {label}
            </Text>
            <Box
                position="relative"
                bg={bgColor}
                borderRadius="lg"
                borderWidth="1px"
                borderColor={borderColor}
                p={4}
                fontFamily="monospace"
                w="full"
                overflowX="auto"
            >
                <HStack spacing={3} align="center">
                    <Text color={promptColor} fontSize="md" fontWeight="bold">
                        $
                    </Text>
                    <Text
                        color={textColor}
                        fontSize={{ base: 'sm', md: 'md' }}
                        flex={1}
                        textAlign="left"
                    >
                        {command}
                    </Text>
                    <IconButton
                        aria-label={t('Copy command')}
                        icon={<Icon as={copied ? LuCheck : LuCopy} />}
                        onClick={handleCopy}
                        size="sm"
                        variant="ghost"
                        color={textColor}
                        _hover={{ bg: 'rgba(255, 255, 255, 0.1)' }}
                    />
                </HStack>
            </Box>
        </VStack>
    );
}

function PromptExample() {
    const { t } = useTranslation();
    const { colorMode } = useColorMode();

    const bubbleBg = useColorModeValue('#f6f8fa', '#161b22');
    const bubbleBorder = useColorModeValue('#d0d7de', '#30363d');
    const userBg = useColorModeValue('#dae8fb', '#1f6feb');
    const userColor = useColorModeValue('gray.900', 'white');
    const agentColor = useColorModeValue('gray.700', 'gray.300');

    return (
        <Box
            w="full"
            borderWidth="1px"
            borderColor={bubbleBorder}
            borderRadius="xl"
            bg={bubbleBg}
            p={{ base: 5, md: 7 }}
        >
            <VStack align="stretch" spacing={4}>
                <HStack align="flex-start" spacing={3}>
                    <Icon
                        as={LuSparkles}
                        boxSize={5}
                        mt={1}
                        color={
                            colorMode === 'dark' ? 'blue.300' : 'blue.500'
                        }
                    />
                    <Box
                        bg={userBg}
                        color={userColor}
                        px={4}
                        py={3}
                        borderRadius="lg"
                        flex={1}
                    >
                        <Text fontSize={{ base: 'sm', md: 'md' }}>
                            {t(
                                'Scaffold a new VeChain dApp with social login, then add a B3TR reward distribution contract.',
                            )}
                        </Text>
                    </Box>
                </HStack>
                <Text
                    fontSize={{ base: 'sm', md: 'md' }}
                    color={agentColor}
                    pl={8}
                >
                    {t(
                        '→ Agent picks the right skills automatically: create-vechain-dapp + vechain-kit + vebetterdao.',
                    )}
                </Text>
            </VStack>
        </Box>
    );
}

function SkillCard({ name, description }: { name: string; description: string }) {
    const { colorMode } = useColorMode();
    const bg = useColorModeValue('white', '#161b22');
    const borderColor = useColorModeValue('#d0d7de', '#30363d');
    const nameColor = useColorModeValue('gray.900', 'white');
    const descColor = useColorModeValue('gray.600', 'gray.400');

    return (
        <Box
            bg={bg}
            borderWidth="1px"
            borderColor={borderColor}
            borderRadius="lg"
            px={4}
            py={3}
            transition="transform 0.15s ease, box-shadow 0.15s ease"
            _hover={{
                transform: 'translateY(-2px)',
                boxShadow:
                    colorMode === 'dark'
                        ? '0 4px 12px rgba(0,0,0,0.4)'
                        : '0 4px 12px rgba(0,0,0,0.08)',
            }}
        >
            <VStack align="start" spacing={1}>
                <Text
                    fontFamily="monospace"
                    fontSize="sm"
                    fontWeight="bold"
                    color={nameColor}
                >
                    {name}
                </Text>
                <Text fontSize="xs" color={descColor}>
                    {description}
                </Text>
            </VStack>
        </Box>
    );
}

export function AISkillsSection() {
    const { colorMode } = useColorMode();
    const { t } = useTranslation();

    return (
        <VStack
            spacing={10}
            align="stretch"
            w="full"
        >
            <VStack spacing={4} align="flex-start">
                <HStack spacing={2}>
                    <Icon
                        as={LuSparkles}
                        boxSize={5}
                        color={
                            colorMode === 'dark' ? 'blue.300' : 'blue.500'
                        }
                    />
                    <Text
                        fontSize="sm"
                        fontWeight="bold"
                        letterSpacing="wider"
                        textTransform="uppercase"
                        color={
                            colorMode === 'dark' ? 'blue.300' : 'blue.500'
                        }
                    >
                        {t('VeChain AI Skills')}
                    </Text>
                </HStack>
                <Heading
                    as="h2"
                    fontSize={{ base: '2xl', md: '3xl' }}
                    fontWeight="bold"
                >
                    {t('Ship VeChain dApps with AI')}
                </Heading>
                <Text
                    fontSize={{ base: 'md', md: 'lg' }}
                    color={
                        colorMode === 'dark' ? 'gray.300' : 'gray.600'
                    }
                    maxW="3xl"
                >
                    {t(
                        'Give your coding agent deep VeChain domain knowledge — wallet UX, smart contracts, VeBetterDAO, StarGate, and more. Works with Claude Code, Cursor, and any agent.',
                    )}
                </Text>
            </VStack>

            <Stack
                direction={{ base: 'column', md: 'row' }}
                spacing={4}
                w="full"
                align="stretch"
            >
                <TerminalBlock
                    command={CLI_COMMAND}
                    label={t('Any agent (Skills CLI)')}
                />
                <TerminalBlock
                    command={CLAUDE_COMMAND}
                    label={t('Claude Code')}
                />
            </Stack>

            <VStack spacing={4} w="full" align="stretch">
                <Text
                    fontSize="sm"
                    fontWeight="bold"
                    letterSpacing="wider"
                    textTransform="uppercase"
                    color={
                        colorMode === 'dark' ? 'gray.400' : 'gray.500'
                    }
                >
                    {t('Available skills')}
                </Text>
                <SimpleGrid
                    columns={{ base: 1, sm: 2, lg: 3 }}
                    spacing={3}
                    w="full"
                >
                    {SKILLS.map((skill) => (
                        <SkillCard
                            key={skill.name}
                            name={skill.name}
                            description={t(skill.descKey)}
                        />
                    ))}
                </SimpleGrid>
            </VStack>

            <VStack spacing={4} w="full" align="flex-start">
                <Text
                    fontSize="sm"
                    fontWeight="bold"
                    letterSpacing="wider"
                    textTransform="uppercase"
                    color={
                        colorMode === 'dark' ? 'gray.400' : 'gray.500'
                    }
                >
                    {t('Try a prompt')}
                </Text>
                <PromptExample />
            </VStack>

            <Button
                as="a"
                href={REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                size="lg"
                leftIcon={<Icon as={LuGithub} />}
                alignSelf="flex-start"
            >
                {t('View on GitHub')}
            </Button>
        </VStack>
    );
}
````

## Source: `examples/playground/src/app/components/features/AISkills/index.ts`

````typescript
export { AISkillsSection } from './AISkillsSection';
````

## Source: `examples/playground/src/app/components/features/AccountInfo/AccountInfo.tsx`

````tsx
'use client';

import { useTranslation } from 'react-i18next';
import { IdentityPanel } from '../Identity/IdentityPanel';
import { Text, VStack } from '@chakra-ui/react';

export function AccountInfo() {
    const { t } = useTranslation();

    return (
        <VStack align="stretch" spacing={4}>
            <Text fontSize="sm" opacity={0.7}>
                {t(
                    'Smart accounts are not deployed on login but only after the first action — no gas spent until you need it.',
                )}
            </Text>
            <IdentityPanel />
        </VStack>
    );
}
````

## Source: `examples/playground/src/app/components/features/AccountInfo/index.ts`

````typescript
export * from './AccountInfo';
````

## Source: `examples/playground/src/app/components/features/Connect/OAuthGrid.tsx`

````tsx
'use client';

import { Button, Icon, SimpleGrid } from '@chakra-ui/react';
import { useLoginWithOAuth } from '@vechain/vechain-kit';
import { FcGoogle } from 'react-icons/fc';
import {
    FaApple,
    FaDiscord,
    FaGithub,
    FaLine,
    FaTiktok,
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import type { IconType } from 'react-icons';

type OAuthProvider =
    | 'google'
    | 'apple'
    | 'twitter'
    | 'discord'
    | 'github'
    | 'tiktok'
    | 'line';

export const OAUTH_PROVIDERS: ReadonlyArray<{
    id: OAuthProvider;
    label: string;
    icon: IconType;
}> = [
    { id: 'google', label: 'Google', icon: FcGoogle },
    { id: 'apple', label: 'Apple', icon: FaApple },
    { id: 'twitter', label: 'X', icon: FaXTwitter },
    { id: 'discord', label: 'Discord', icon: FaDiscord },
    { id: 'github', label: 'GitHub', icon: FaGithub },
    { id: 'tiktok', label: 'TikTok', icon: FaTiktok },
    { id: 'line', label: 'LINE', icon: FaLine },
];

export function OAuthGrid() {
    const { initOAuth } = useLoginWithOAuth();

    return (
        <SimpleGrid columns={{ base: 2, sm: 3, md: 4 }} spacing={3} w="full">
            {OAUTH_PROVIDERS.map((p) => (
                <Button
                    key={p.id}
                    onClick={() => initOAuth({ provider: p.id })}
                    leftIcon={<Icon as={p.icon} boxSize="18px" />}
                    variant="outline"
                    size="md"
                    justifyContent="flex-start"
                >
                    {p.label}
                </Button>
            ))}
        </SimpleGrid>
    );
}
````

## Source: `examples/playground/src/app/components/features/Connect/WalletButtonVariants.tsx`

````tsx
'use client';

import {
    Box,
    Button,
    SimpleGrid,
    Text,
    useColorMode,
    VStack,
} from '@chakra-ui/react';
import {
    WalletButton,
    useConnectModal,
    useDAppKitWalletModal,
} from '@vechain/vechain-kit';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface VariantCardProps {
    label: string;
    children: ReactNode;
}

function VariantCard({ label, children }: VariantCardProps) {
    const { colorMode } = useColorMode();
    return (
        <VStack
            align="flex-start"
            spacing={3}
            p={4}
            borderRadius="md"
            borderWidth="1px"
            borderColor={
                colorMode === 'light' ? 'gray.200' : 'whiteAlpha.200'
            }
            bg={colorMode === 'light' ? 'gray.50' : 'whiteAlpha.50'}
            minH="120px"
            w="full"
        >
            <Box w="fit-content">{children}</Box>
            <Text
                fontSize="xs"
                fontFamily="mono"
                px={2}
                py={1}
                borderRadius="full"
                bg={colorMode === 'light' ? 'blue.50' : 'whiteAlpha.100'}
                color={colorMode === 'light' ? 'blue.700' : 'blue.200'}
            >
                {label}
            </Text>
        </VStack>
    );
}

export function WalletButtonVariants() {
    const { t } = useTranslation();
    const { open: openConnectModal } = useConnectModal();
    const { open: openDappKitWalletModal } = useDAppKitWalletModal();

    return (
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
            <VariantCard label='variant="modal"'>
                <WalletButton connectionVariant="modal" />
            </VariantCard>

            <VariantCard label='variant="popover" (desktop only)'>
                <WalletButton connectionVariant="popover" />
            </VariantCard>

            <VariantCard label={t('Custom styling (buttonStyle prop)')}>
                <WalletButton
                    connectionVariant="modal"
                    buttonStyle={{
                        border: '2px solid #000000',
                        boxShadow: '-2px 2px 3px 1px #00000038',
                        background: '#f08098',
                        color: 'white',
                        _hover: {
                            background: '#db607a',
                            border: '1px solid #000000',
                            boxShadow: '-3px 2px 3px 1px #00000038',
                        },
                        transition: 'all 0.2s ease',
                    }}
                />
            </VariantCard>

            <VariantCard label="useConnectModal()">
                <Button onClick={() => openConnectModal()}>
                    {t('Open VeChain Kit modal')}
                </Button>
            </VariantCard>

            <VariantCard label="useDAppKitWalletModal()">
                <Button onClick={() => openDappKitWalletModal()}>
                    {t('Open dapp-kit only modal')}
                </Button>
            </VariantCard>
        </SimpleGrid>
    );
}
````

## Source: `examples/playground/src/app/components/features/Connect/index.ts`

````typescript
export { WalletButtonVariants } from './WalletButtonVariants';
export { OAuthGrid } from './OAuthGrid';
````

## Source: `examples/playground/src/app/components/features/ConnectionInfo/ConnectionInfo.tsx`

````tsx
'use client';

import {
    HStack,
    Tag,
    Text,
    useColorMode,
    VStack,
} from '@chakra-ui/react';
import { useWallet } from '@vechain/vechain-kit';
import { useTranslation } from 'react-i18next';

export function ConnectionInfo() {
    const { connection } = useWallet();
    const { colorMode } = useColorMode();
    const { t } = useTranslation();

    if (!connection) return null;

    const description = (() => {
        switch (connection.source.type) {
            case 'privy':
                return t(
                    "You're connected using Privy authentication, which provides a dedicated user management system for this application.",
                );
            case 'privy-cross-app':
                return t(
                    "You're connected through the VeChain cross-app ecosystem, sharing authentication with other VeChain apps.",
                );
            case 'wallet':
                return t(
                    "You're connected directly through a Web3 wallet (VeWorld, Sync2, or WalletConnect).",
                );
            default:
                return t('Connection type not recognized.');
        }
    })();

    return (
        <VStack
            align="stretch"
            spacing={3}
            p={5}
            borderRadius="md"
            borderWidth="1px"
            borderColor={
                colorMode === 'light' ? 'gray.200' : 'whiteAlpha.200'
            }
            bg={colorMode === 'light' ? 'gray.50' : 'whiteAlpha.50'}
        >
            <HStack spacing={4} flexWrap="wrap">
                <HStack spacing={2}>
                    <Text fontSize="sm" opacity={0.7}>
                        {t('Source')}:
                    </Text>
                    <Tag size="sm" colorScheme="blue">
                        {connection.source.type}
                    </Tag>
                </HStack>
                <HStack spacing={2}>
                    <Text fontSize="sm" opacity={0.7}>
                        {t('Network')}:
                    </Text>
                    <Tag size="sm" colorScheme="purple">
                        {connection.network}
                    </Tag>
                </HStack>
            </HStack>
            <Text fontSize="sm">{description}</Text>
        </VStack>
    );
}
````

## Source: `examples/playground/src/app/components/features/ConnectionInfo/index.ts`

````typescript
export * from './ConnectionInfo';
````

## Source: `examples/playground/src/app/components/features/DaoInfo/DaoInfo.tsx`

````tsx
'use client';

import {
    HStack,
    SimpleGrid,
    Tag,
    Text,
    useColorMode,
    VStack,
} from '@chakra-ui/react';
import {
    useCurrentAllocationsRoundId,
    useIsPerson,
    useWallet,
} from '@vechain/vechain-kit';
import { useTranslation } from 'react-i18next';

interface DataRowProps {
    label: string;
    children: React.ReactNode;
}

function DataRow({ label, children }: DataRowProps) {
    return (
        <HStack justify="space-between" w="full" py={2}>
            <Text fontSize="sm" opacity={0.7}>
                {label}
            </Text>
            <HStack spacing={2}>{children}</HStack>
        </HStack>
    );
}

export function DaoInfo() {
    const { t } = useTranslation();
    const { colorMode } = useColorMode();
    const { account } = useWallet();
    const { data: currentAllocationsRoundId } = useCurrentAllocationsRoundId();
    const { data: isValidPassport } = useIsPerson(account?.address);

    return (
        <VStack
            align="stretch"
            spacing={2}
            p={5}
            borderRadius="md"
            borderWidth="1px"
            borderColor={
                colorMode === 'light' ? 'gray.200' : 'whiteAlpha.200'
            }
            bg={colorMode === 'light' ? 'gray.50' : 'whiteAlpha.50'}
            divider={undefined}
        >
            <SimpleGrid columns={{ base: 1, md: 2 }} spacingX={6}>
                <DataRow label={t('Current round')}>
                    <Tag size="sm" colorScheme="blue">
                        {currentAllocationsRoundId ?? '—'}
                    </Tag>
                </DataRow>
                <DataRow label={t('Valid passport')}>
                    <Tag
                        size="sm"
                        colorScheme={isValidPassport ? 'green' : 'gray'}
                    >
                        {isValidPassport === undefined
                            ? '—'
                            : isValidPassport
                            ? t('Yes')
                            : t('No')}
                    </Tag>
                </DataRow>
            </SimpleGrid>
        </VStack>
    );
}
````

## Source: `examples/playground/src/app/components/features/DaoInfo/index.ts`

````typescript
export * from './DaoInfo';
````

## Source: `examples/playground/src/app/components/features/Identity/IdentityPanel.tsx`

````tsx
'use client';

import {
    Box,
    HStack,
    SimpleGrid,
    Tag,
    Text,
    useColorMode,
    VStack,
} from '@chakra-ui/react';
import { useWallet } from '@vechain/vechain-kit';
import { LuWallet, LuWalletCards } from 'react-icons/lu';
import { useTranslation } from 'react-i18next';
import { CopyAddress } from '../../demo/CopyAddress';

interface InfoBlockProps {
    title: string;
    icon: typeof LuWallet;
    children: React.ReactNode;
}

function InfoBlock({ title, icon: IconCmp, children }: InfoBlockProps) {
    const { colorMode } = useColorMode();
    return (
        <VStack
            align="flex-start"
            spacing={3}
            p={5}
            borderRadius="md"
            borderWidth="1px"
            borderColor={
                colorMode === 'light' ? 'gray.200' : 'whiteAlpha.200'
            }
            bg={colorMode === 'light' ? 'gray.50' : 'whiteAlpha.50'}
            w="full"
        >
            <HStack>
                <Box
                    as={IconCmp}
                    boxSize={5}
                    color={colorMode === 'light' ? 'blue.500' : 'blue.300'}
                />
                <Text fontWeight="semibold">{title}</Text>
            </HStack>
            {children}
        </VStack>
    );
}

export function IdentityPanel() {
    const { t } = useTranslation();
    const { account, smartAccount, connectedWallet, connection } = useWallet();

    if (!account) return null;

    return (
        <VStack align="stretch" spacing={4} w="full">
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                {smartAccount.address && (
                    <InfoBlock
                        title={t('Smart Account')}
                        icon={LuWalletCards}
                    >
                        <VStack align="flex-start" spacing={2}>
                            <CopyAddress address={smartAccount.address} />
                            <HStack>
                                <Text fontSize="xs" opacity={0.7}>
                                    {t('Deployed')}:
                                </Text>
                                <Tag
                                    size="sm"
                                    colorScheme={
                                        smartAccount.isDeployed
                                            ? 'green'
                                            : 'gray'
                                    }
                                >
                                    {smartAccount.isDeployed
                                        ? t('Yes')
                                        : t('No')}
                                </Tag>
                            </HStack>
                        </VStack>
                    </InfoBlock>
                )}

                <InfoBlock
                    title={
                        connection.isConnectedWithPrivy
                            ? t('Embedded Wallet')
                            : t('Wallet')
                    }
                    icon={LuWallet}
                >
                    {connectedWallet?.address && (
                        <CopyAddress address={connectedWallet.address} />
                    )}
                </InfoBlock>
            </SimpleGrid>

            {account.domain && (
                <Box
                    p={3}
                    borderRadius="md"
                    bg="green.50"
                    color="green.700"
                    borderWidth="1px"
                    borderColor="green.200"
                    fontSize="sm"
                    _dark={{
                        bg: 'green.900',
                        color: 'green.100',
                        borderColor: 'green.700',
                    }}
                >
                    {t('VET Domain')}: <strong>{account.domain}</strong>
                </Box>
            )}
        </VStack>
    );
}
````

## Source: `examples/playground/src/app/components/features/LoginToContinueBox/LoginToContinueBox.tsx`

````tsx
'use client';

import { Button, Text, VStack, useColorMode } from '@chakra-ui/react';
import { useConnectModal } from '@vechain/vechain-kit';
import { useTranslation } from 'react-i18next';

interface LoginToContinueBoxProps {
    title?: string;
    description?: string;
    ctaLabel?: string;
}

export function LoginToContinueBox({
    title,
    description,
    ctaLabel,
}: LoginToContinueBoxProps = {}) {
    const { colorMode } = useColorMode();
    const { open } = useConnectModal();
    const { t } = useTranslation();

    const resolvedTitle =
        title ?? t('Connect your wallet to explore all features');
    const resolvedDescription =
        description ??
        t(
            'Sign in to access transaction examples, signing capabilities, profile customization and more.',
        );
    const resolvedCta = ctaLabel ?? t('Click here to sign in!');

    return (
        <VStack
            w="full"
            p={{ base: 5, md: 6 }}
            spacing={3}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={
                colorMode === 'light' ? 'gray.200' : 'whiteAlpha.200'
            }
            bg={colorMode === 'light' ? 'gray.50' : 'whiteAlpha.50'}
        >
            <Text fontSize="lg" fontWeight="semibold" textAlign="center">
                {resolvedTitle}
            </Text>
            <Text
                fontSize="sm"
                color={colorMode === 'light' ? 'gray.600' : 'gray.400'}
                textAlign="center"
            >
                {resolvedDescription}
            </Text>
            <Button width="full" onClick={() => open()}>
                {resolvedCta}
            </Button>
        </VStack>
    );
}
````

## Source: `examples/playground/src/app/components/features/LoginToContinueBox/index.ts`

````typescript
export * from './LoginToContinueBox';
````

## Source: `examples/playground/src/app/components/features/ModalCatalog/ModalCard.tsx`

````tsx
'use client';

import {
    Box,
    HStack,
    Icon,
    Text,
    useColorMode,
    VStack,
} from '@chakra-ui/react';
import { ReactNode } from 'react';
import { IconType } from 'react-icons';
import { HookBadge } from '../../demo/HookBadge';

interface ModalCardProps {
    title: string;
    description: ReactNode;
    icon: IconType;
    hook?: string;
    highlight?: boolean;
    onClick: () => void;
}

export function ModalCard({
    title,
    description,
    icon,
    hook,
    highlight,
    onClick,
}: ModalCardProps) {
    const { colorMode } = useColorMode();

    const borderColor = highlight
        ? 'blue.500'
        : colorMode === 'light'
        ? 'gray.200'
        : 'whiteAlpha.200';

    return (
        <Box
            onClick={onClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onClick();
                }
            }}
            p={4}
            borderRadius="md"
            borderWidth="1px"
            borderColor={borderColor}
            bg={colorMode === 'light' ? 'white' : 'whiteAlpha.50'}
            _hover={{
                transform: 'translateY(-2px)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                shadow: 'md',
                bg: colorMode === 'light' ? 'gray.50' : 'whiteAlpha.100',
            }}
            cursor="pointer"
            height="full"
        >
            <VStack spacing={3} align="start" h="full">
                <Icon
                    as={icon}
                    boxSize={6}
                    color={colorMode === 'light' ? 'blue.500' : 'blue.300'}
                />
                <Text fontWeight="semibold">{title}</Text>
                <Text
                    fontSize="sm"
                    color={colorMode === 'light' ? 'gray.600' : 'gray.400'}
                    flex={1}
                >
                    {description}
                </Text>
                {hook && (
                    <HStack spacing={2} mt="auto">
                        <HookBadge name={hook} />
                    </HStack>
                )}
            </VStack>
        </Box>
    );
}
````

## Source: `examples/playground/src/app/components/features/ModalCatalog/ModalCatalog.tsx`

````tsx
'use client';

import { SimpleGrid } from '@chakra-ui/react';
import {
    useChooseNameModal,
    useExploreEcosystemModal,
    useFAQModal,
    useNotificationsModal,
    useProfileModal,
    useReceiveModal,
    useSendTokenModal,
    useSettingsModal,
    useSwapTokenModal,
    useUpgradeSmartAccountModal,
    useWallet,
    useWalletModal,
} from '@vechain/vechain-kit';
import {
    LuArrowDownToLine,
    LuArrowLeftRight,
    LuBell,
    LuCircleHelp,
    LuRefreshCw,
    LuSettings,
    LuSquareUser,
    LuUser,
    LuUserCog,
    LuWallet,
} from 'react-icons/lu';
import { useTranslation } from 'react-i18next';
import { ModalCard } from './ModalCard';

export function ModalCatalog() {
    const { account } = useWallet();
    const { t } = useTranslation();

    const { open: openWalletModal } = useWalletModal();
    const { open: openProfileModal } = useProfileModal();
    const { open: openSettingsModal } = useSettingsModal();
    const { open: openChooseNameModal } = useChooseNameModal();
    const { open: openSendTokenModal } = useSendTokenModal();
    const { open: openSwapTokenModal } = useSwapTokenModal();
    const { open: openReceiveModal } = useReceiveModal();
    const { open: openExploreEcosystemModal } = useExploreEcosystemModal();
    const { open: openNotificationsModal } = useNotificationsModal();
    const { open: openFAQModal } = useFAQModal();
    const { open: openUpgradeSmartAccountModal } =
        useUpgradeSmartAccountModal();

    const cards = [
        {
            title: t('Wallet'),
            description: t('Manage your wallet and your assets'),
            icon: LuWallet,
            hook: 'useWalletModal',
            onClick: () => openWalletModal({ isolatedView: true }),
        },
        {
            title: t('Profile'),
            description: t(
                'Show and customize the user profile: avatar, display name, bio and more.',
            ),
            icon: LuUser,
            hook: 'useProfileModal',
            onClick: () => openProfileModal({ isolatedView: true }),
        },
        {
            title: t('Settings'),
            description: t('Manage your settings and your preferences'),
            icon: LuSettings,
            hook: 'useSettingsModal',
            onClick: () => openSettingsModal({ isolatedView: true }),
        },
        {
            title: t('Set VET Domain'),
            description: t(
                'Replace your complex address with a memorable .vet domain name',
            ),
            icon: LuSquareUser,
            hook: 'useChooseNameModal',
            highlight: !!account && !account.domain,
            onClick: () => openChooseNameModal({ isolatedView: true }),
        },
        {
            title: t('Transfer Assets'),
            description: t(
                'Send and receive VET, VTHO, and other tokens seamlessly',
            ),
            icon: LuArrowLeftRight,
            hook: 'useSendTokenModal',
            onClick: () => openSendTokenModal({ isolatedView: true }),
        },
        {
            title: t('Swap Tokens'),
            description: t('Swap between tokens with best available rates'),
            icon: LuArrowLeftRight,
            hook: 'useSwapTokenModal',
            onClick: () => openSwapTokenModal({ isolatedView: true }),
        },
        {
            title: t('Receive Assets'),
            description: t('Receive VET, VTHO, and other tokens from anyone'),
            icon: LuArrowDownToLine,
            hook: 'useReceiveModal',
            onClick: () => openReceiveModal({ isolatedView: true }),
        },
        {
            title: t('Explore Ecosystem'),
            description: t(
                'Explore other apps built on VeChain, and add shortcuts for faster access.',
            ),
            icon: LuUserCog,
            hook: 'useExploreEcosystemModal',
            onClick: () => openExploreEcosystemModal({ isolatedView: true }),
        },
        {
            title: t('Notifications'),
            description: t(
                'Stay updated with the kit or ecosystem updates, and account alerts',
            ),
            icon: LuBell,
            hook: 'useNotificationsModal',
            onClick: () => openNotificationsModal({ isolatedView: true }),
        },
        {
            title: t('FAQ'),
            description: t('Find answers to common questions about VeChain'),
            icon: LuCircleHelp,
            hook: 'useFAQModal',
            onClick: () => openFAQModal({ isolatedView: true }),
        },
        {
            title: t('Upgrade Smart Account'),
            description: t(
                'Upgrade your smart account to the latest version',
            ),
            icon: LuRefreshCw,
            hook: 'useUpgradeSmartAccountModal',
            onClick: openUpgradeSmartAccountModal,
        },
    ];

    return (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
            {cards.map((c) => (
                <ModalCard key={c.title} {...c} />
            ))}
        </SimpleGrid>
    );
}
````

## Source: `examples/playground/src/app/components/features/ModalCatalog/index.ts`

````typescript
export { ModalCatalog } from './ModalCatalog';
export { ModalCard } from './ModalCard';
````

## Source: `examples/playground/src/app/components/features/Resources/ResourceList.tsx`

````tsx
'use client';

import {
    Box,
    Heading,
    HStack,
    Icon,
    Link,
    SimpleGrid,
    Text,
    useColorMode,
    VStack,
} from '@chakra-ui/react';
import {
    LuBook,
    LuGithub,
    LuLightbulb,
    LuPackage,
    LuServer,
    LuSparkles,
} from 'react-icons/lu';
import { IconType } from 'react-icons';
import { useTranslation } from 'react-i18next';

interface Resource {
    title: string;
    description: string;
    href: string;
    icon: IconType;
}

export function ResourceList() {
    const { colorMode } = useColorMode();
    const { t } = useTranslation();

    const resources: Resource[] = [
        {
            title: t('VeChain AI Skills'),
            description: t(
                'Install 11 VeChain skills in Claude Code, Cursor or any agent so it ships dApps with domain knowledge baked in.',
            ),
            href: 'https://github.com/vechain/vechain-ai-skills',
            icon: LuSparkles,
        },
        {
            title: t('Documentation'),
            description: t(
                'Full reference for components, hooks and providers.',
            ),
            href: 'https://docs.vechainkit.vechain.org/',
            icon: LuBook,
        },
        {
            title: t('MCP endpoint'),
            description: t(
                'Plug VeChain Kit docs into Claude, Cursor and any MCP-compatible client.',
            ),
            href: 'https://docs.vechainkit.vechain.org/~gitbook/mcp',
            icon: LuServer,
        },
        {
            title: t('GitHub repository'),
            description: t(
                'Source code, examples and the playground you are using right now.',
            ),
            href: 'https://github.com/vechain/vechain-kit',
            icon: LuGithub,
        },
        {
            title: t('npm package'),
            description: t('Install @vechain/vechain-kit from the registry.'),
            href: 'https://www.npmjs.com/package/@vechain/vechain-kit',
            icon: LuPackage,
        },
        {
            title: t('Request a feature'),
            description: t(
                'Missing a building block? Open an issue and tell us about it.',
            ),
            href: 'https://github.com/vechain/vechain-kit/issues/new',
            icon: LuLightbulb,
        },
    ];

    return (
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
            {resources.map((r) => (
                <Link
                    key={r.title}
                    href={r.href}
                    isExternal
                    _hover={{ textDecoration: 'none' }}
                >
                    <Box
                        p={5}
                        borderRadius="md"
                        borderWidth="1px"
                        borderColor={
                            colorMode === 'light'
                                ? 'gray.200'
                                : 'whiteAlpha.200'
                        }
                        bg={colorMode === 'light' ? 'white' : 'whiteAlpha.50'}
                        _hover={{
                            transform: 'translateY(-2px)',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            shadow: 'md',
                        }}
                        height="full"
                    >
                        <VStack align="flex-start" spacing={2}>
                            <HStack spacing={3}>
                                <Icon
                                    as={r.icon}
                                    boxSize={5}
                                    color={
                                        colorMode === 'light'
                                            ? 'blue.500'
                                            : 'blue.300'
                                    }
                                />
                                <Heading size="sm">{r.title}</Heading>
                            </HStack>
                            <Text
                                fontSize="sm"
                                color={
                                    colorMode === 'light'
                                        ? 'gray.600'
                                        : 'gray.400'
                                }
                            >
                                {r.description}
                            </Text>
                        </VStack>
                    </Box>
                </Link>
            ))}
        </SimpleGrid>
    );
}
````

## Source: `examples/playground/src/app/components/features/Signing/SignatureOutput.tsx`

````tsx
'use client';

import {
    Box,
    HStack,
    IconButton,
    Text,
    useColorMode,
    useToast,
} from '@chakra-ui/react';
import { LuCopy } from 'react-icons/lu';
import { useTranslation } from 'react-i18next';

interface SignatureOutputProps {
    signature?: string | null;
}

export function SignatureOutput({ signature }: SignatureOutputProps) {
    const { colorMode } = useColorMode();
    const { t } = useTranslation();
    const toast = useToast();

    if (!signature) return null;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(signature);
            toast({
                title: t('Copied!'),
                status: 'success',
                duration: 1200,
                isClosable: true,
                position: 'bottom-right',
            });
        } catch {
            toast({ title: t('Copy failed'), status: 'error', duration: 1500 });
        }
    };

    return (
        <Box
            w="full"
            p={3}
            borderRadius="md"
            borderWidth="1px"
            borderColor={
                colorMode === 'light' ? 'gray.200' : 'whiteAlpha.200'
            }
            bg={colorMode === 'light' ? 'gray.50' : 'rgba(13, 17, 23, 0.6)'}
        >
            <HStack justify="space-between" mb={1}>
                <Text fontSize="xs" opacity={0.7} textTransform="uppercase">
                    {t('Signature')}
                </Text>
                <IconButton
                    aria-label={t('Copy')}
                    icon={<LuCopy />}
                    size="xs"
                    variant="ghost"
                    onClick={handleCopy}
                />
            </HStack>
            <Text fontFamily="mono" fontSize="xs" wordBreak="break-all">
                {signature}
            </Text>
        </Box>
    );
}
````

## Source: `examples/playground/src/app/components/features/Signing/index.ts`

````typescript
export { SignatureOutput } from './SignatureOutput';
````

## Source: `examples/playground/src/app/components/features/SmartAccountInfo/SmartAccountInfo.tsx`

````tsx
'use client';

import { SimpleGrid, VStack, Text, Icon, useColorMode } from '@chakra-ui/react';
import { LuShield, LuLock, LuShieldCheck } from 'react-icons/lu';
import { useTranslation } from 'react-i18next';

interface PerkProps {
    icon: typeof LuShield;
    title: string;
    description: string;
}

function Perk({ icon, title, description }: PerkProps) {
    const { colorMode } = useColorMode();
    return (
        <VStack
            spacing={3}
            p={5}
            borderRadius="md"
            borderWidth="1px"
            borderColor={
                colorMode === 'light' ? 'gray.200' : 'whiteAlpha.200'
            }
            bg={colorMode === 'light' ? 'gray.50' : 'whiteAlpha.50'}
            align="flex-start"
        >
            <Icon
                as={icon}
                boxSize={6}
                color={colorMode === 'light' ? 'blue.500' : 'blue.300'}
            />
            <Text fontWeight="semibold">{title}</Text>
            <Text
                fontSize="sm"
                color={colorMode === 'light' ? 'gray.600' : 'gray.300'}
            >
                {description}
            </Text>
        </VStack>
    );
}

export function SmartAccountInfo() {
    const { t } = useTranslation();

    return (
        <VStack spacing={4} align="stretch">
            <Text
                fontSize="sm"
                color="inherit"
                opacity={0.85}
            >
                {t(
                    'When using Privy authentication (direct or cross-app), a Smart Account is automatically created and linked to your wallet. This account becomes your primary identity on VeChain, offering enhanced security and flexibility.',
                )}
            </Text>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                <Perk
                    icon={LuShield}
                    title={t('Secure Ownership')}
                    description={t(
                        'Exclusively controlled by your Privy-secured wallet',
                    )}
                />
                <Perk
                    icon={LuLock}
                    title={t('Transferable')}
                    description={t(
                        'Transfer ownership to another wallet anytime',
                    )}
                />
                <Perk
                    icon={LuShieldCheck}
                    title={t('Recovery')}
                    description={t(
                        'Secure backup and recovery through Privy',
                    )}
                />
            </SimpleGrid>
        </VStack>
    );
}
````

## Source: `examples/playground/src/app/components/features/SmartAccountInfo/index.ts`

````typescript
export * from './SmartAccountInfo';
````

## Source: `examples/playground/src/app/components/features/Transactions/TxResultPanel.tsx`

````tsx
'use client';

import {
    Box,
    Button,
    HStack,
    Link,
    Tag,
    Text,
    useColorMode,
    VStack,
} from '@chakra-ui/react';
import { LuExternalLink } from 'react-icons/lu';
import { useTranslation } from 'react-i18next';
import { CopyAddress } from '../../demo/CopyAddress';

type TxStatus =
    | 'idle'
    | 'pending'
    | 'waitingConfirmation'
    | 'success'
    | 'error'
    | 'unknown';

interface TxResultPanelProps {
    status: TxStatus | string;
    txReceipt?: {
        meta?: { txID?: string; blockNumber?: number };
        gasUsed?: number;
    } | null;
    error?: Error | { reason?: string; message?: string } | null;
    explorerBaseUrl?: string;
    onTryAgain?: () => void;
}

const STATUS_SCHEME: Record<string, string> = {
    idle: 'gray',
    pending: 'yellow',
    waitingConfirmation: 'yellow',
    success: 'green',
    error: 'red',
    unknown: 'gray',
};

export function TxResultPanel({
    status,
    txReceipt,
    error,
    explorerBaseUrl = 'https://explore.vechain.org/transactions',
    onTryAgain,
}: TxResultPanelProps) {
    const { colorMode } = useColorMode();
    const { t } = useTranslation();

    if (status === 'idle') return null;

    const txID = txReceipt?.meta?.txID;
    const errorMessage =
        error && 'reason' in error
            ? (error as { reason?: string }).reason
            : error?.message;

    return (
        <VStack
            align="stretch"
            spacing={3}
            p={4}
            borderRadius="md"
            borderWidth="1px"
            borderColor={
                colorMode === 'light' ? 'gray.200' : 'whiteAlpha.200'
            }
            bg={colorMode === 'light' ? 'gray.50' : 'whiteAlpha.50'}
            w="full"
        >
            <HStack justify="space-between">
                <Text fontSize="sm" fontWeight="semibold">
                    {t('Transaction status')}
                </Text>
                <Tag
                    size="sm"
                    colorScheme={STATUS_SCHEME[status as string] ?? 'gray'}
                    textTransform="uppercase"
                >
                    {status}
                </Tag>
            </HStack>

            {txID && (
                <Box>
                    <Text fontSize="xs" opacity={0.7} mb={1}>
                        {t('Transaction ID')}
                    </Text>
                    <HStack>
                        <CopyAddress address={txID} />
                        <Link
                            href={`${explorerBaseUrl}/${txID}`}
                            isExternal
                            color="blue.400"
                            fontSize="sm"
                        >
                            <HStack spacing={1}>
                                <Text>{t('View on explorer')}</Text>
                                <LuExternalLink size={14} />
                            </HStack>
                        </Link>
                    </HStack>
                </Box>
            )}

            {txReceipt?.gasUsed != null && (
                <HStack>
                    <Text fontSize="xs" opacity={0.7}>
                        {t('Gas used')}:
                    </Text>
                    <Text fontSize="sm" fontFamily="mono">
                        {txReceipt.gasUsed.toLocaleString()}
                    </Text>
                </HStack>
            )}

            {errorMessage && (
                <Box>
                    <Text fontSize="xs" opacity={0.7} mb={1}>
                        {t('Error')}
                    </Text>
                    <Text fontSize="sm" color="red.400">
                        {errorMessage}
                    </Text>
                </Box>
            )}

            {(status === 'error' || status === 'unknown') && onTryAgain && (
                <Button size="sm" variant="outline" onClick={onTryAgain}>
                    {t('Try again')}
                </Button>
            )}
        </VStack>
    );
}
````

## Source: `examples/playground/src/app/components/layout/Header/LanguageDropdown.tsx`

````tsx
'use client';

import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    HStack,
    Image,
    Text,
    Icon,
    useColorMode,
    IconButton,
} from '@chakra-ui/react';
import { useCurrentLanguage } from '@vechain/vechain-kit';
import { supportedLanguages, languageNames } from '../../../../../i18n';
import { LuChevronDown } from 'react-icons/lu';

// Map language codes to country codes for flag icons
const languageToCountryCode: Record<string, string> = {
    en: 'us',
    de: 'de',
    it: 'it',
    fr: 'fr',
    es: 'es',
    zh: 'cn',
    ja: 'jp',
};

// Generate CDN URL for circle flag (using flagcdn.com)
const getFlagUrl = (langCode: string): string => {
    const countryCode = languageToCountryCode[langCode] || langCode;
    return `https://flagcdn.com/w40/${countryCode}.png`;
};

export function LanguageDropdown() {
    const { colorMode } = useColorMode();
    const { currentLanguage, setLanguage } = useCurrentLanguage();

    const currentFlagUrl = getFlagUrl(currentLanguage);
    const currentLanguageName =
        languageNames[currentLanguage as keyof typeof languageNames] ||
        currentLanguage;

    const isDarkMode = colorMode === 'dark';

    return (
        <Menu>
            <MenuButton
                as={IconButton}
                borderRadius="xl"
                aria-label="Select language"
                p={2}
                icon={
                    <HStack spacing={2}>
                        <Image
                            src={currentFlagUrl}
                            alt={currentLanguageName}
                            width="20px"
                            height="20px"
                            borderRadius="full"
                            objectFit="cover"
                            border="1px solid"
                            borderColor={
                                isDarkMode
                                    ? 'rgba(255, 255, 255, 0.2)'
                                    : 'gray.200'
                            }
                        />
                        <Icon as={LuChevronDown} boxSize={4} />
                    </HStack>
                }
            />
            <MenuList
                borderRadius="lg"
                border="1px solid"
                borderColor={
                    isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'gray.200'
                }
                bg={isDarkMode ? 'rgba(21, 21, 21)' : 'white'}
                boxShadow={
                    isDarkMode
                        ? '0px 2px 4px 1px rgb(0 0 0 / 40%)'
                        : '0px 2px 4px 1px rgb(0 0 0 / 10%)'
                }
                minW="180px"
                py={2}
            >
                {supportedLanguages.map((lang) => {
                    const flagUrl = getFlagUrl(lang);
                    const langName =
                        languageNames[lang as keyof typeof languageNames] ||
                        lang;
                    const isSelected = lang === currentLanguage;

                    return (
                        <MenuItem
                            key={lang}
                            onClick={() => setLanguage(lang)}
                            bg={
                                isSelected
                                    ? isDarkMode
                                        ? 'rgba(255, 255, 255, 0.1)'
                                        : 'rgba(0, 0, 0, 0.05)'
                                    : 'transparent'
                            }
                            _hover={{
                                bg: isDarkMode
                                    ? 'rgba(255, 255, 255, 0.15)'
                                    : 'rgba(0, 0, 0, 0.08)',
                            }}
                            py={2}
                            px={3}
                        >
                            <HStack spacing={3} w="full">
                                <Image
                                    src={flagUrl}
                                    alt={langName}
                                    width="20px"
                                    height="20px"
                                    borderRadius="full"
                                    objectFit="cover"
                                    border="1px solid"
                                    borderColor={
                                        isDarkMode
                                            ? 'rgba(255, 255, 255, 0.2)'
                                            : 'gray.200'
                                    }
                                />
                                <Text
                                    fontSize="sm"
                                    fontWeight={
                                        isSelected ? 'semibold' : 'normal'
                                    }
                                    color={isDarkMode ? 'white' : 'gray.900'}
                                >
                                    {langName}
                                </Text>
                            </HStack>
                        </MenuItem>
                    );
                })}
            </MenuList>
        </Menu>
    );
}
````

## Source: `examples/playground/src/app/components/layout/Header/index.ts`

````typescript
export { LanguageDropdown } from './LanguageDropdown';
````

## Source: `examples/playground/src/app/components/layout/MobileNav.tsx`

````tsx
'use client';

import {
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Sidebar } from './Sidebar';

interface MobileNavProps {
    isOpen: boolean;
    onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
    const { t } = useTranslation();

    return (
        <Drawer
            isOpen={isOpen}
            placement="left"
            onClose={onClose}
            size="xs"
        >
            <DrawerOverlay />
            <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>{t('Menu')}</DrawerHeader>
                <DrawerBody p={0}>
                    <Sidebar onItemClick={onClose} />
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    );
}
````

## Source: `examples/playground/src/app/components/layout/NavItem.tsx`

````tsx
'use client';

import { HStack, Icon, Text, useColorMode } from '@chakra-ui/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { IconType } from 'react-icons';
import { useTranslation } from 'react-i18next';
import { StatusBadge, type Status } from '../demo/StatusBadge';

interface NavItemProps {
    href: string;
    icon: IconType;
    label: string;
    status?: Status;
    onSelect?: () => void;
}

export function NavItem({ href, icon, label, status, onSelect }: NavItemProps) {
    const { colorMode } = useColorMode();
    const pathname = usePathname();
    const { t } = useTranslation();

    const normalized = pathname?.replace(/\/$/, '') ?? '';
    const active =
        normalized === href || normalized.endsWith(href);

    const activeBg = colorMode === 'light' ? 'blue.50' : 'whiteAlpha.200';
    const activeColor = colorMode === 'light' ? 'blue.700' : 'blue.200';
    const idleColor = colorMode === 'light' ? 'gray.700' : 'gray.200';
    const hoverBg = colorMode === 'light' ? 'gray.100' : 'whiteAlpha.100';

    return (
        <Link
            href={href}
            onClick={onSelect}
            style={{ width: '100%', textDecoration: 'none' }}
        >
            <HStack
                spacing={3}
                px={3}
                py={2}
                borderRadius="md"
                bg={active ? activeBg : 'transparent'}
                color={active ? activeColor : idleColor}
                fontWeight={active ? 'semibold' : 'medium'}
                _hover={{ bg: active ? activeBg : hoverBg }}
                transition="background 0.15s"
                cursor="pointer"
            >
                <Icon as={icon} boxSize={4} />
                <Text fontSize="sm" flex={1}>
                    {t(label)}
                </Text>
                {status && <StatusBadge status={status} />}
            </HStack>
        </Link>
    );
}
````

## Source: `examples/playground/src/app/components/layout/Sidebar.tsx`

````tsx
'use client';

import {
    Box,
    HStack,
    Image,
    Text,
    VStack,
    useColorMode,
} from '@chakra-ui/react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { NavItem } from './NavItem';
import { NAV_GROUPS } from './navItems';

interface SidebarProps {
    onItemClick?: () => void;
}

export function Sidebar({ onItemClick }: SidebarProps) {
    const { colorMode } = useColorMode();
    const { t } = useTranslation();
    const basePath = process.env.basePath ?? '';

    return (
        <VStack
            as="aside"
            align="stretch"
            spacing={6}
            p={4}
            h="full"
            w="full"
            bg={colorMode === 'light' ? 'white' : '#0c0c10'}
            borderRightWidth={{ base: 0, md: '1px' }}
            borderRightColor={
                colorMode === 'light' ? 'gray.200' : 'whiteAlpha.200'
            }
            overflowY="auto"
        >
            <Link
                href="/getting-started"
                style={{ textDecoration: 'none' }}
                onClick={onItemClick}
            >
                <HStack spacing={3} pl={2} pt={1}>
                    <Image
                        src={`${basePath}/images/logo.png`}
                        alt="VeKit"
                        height={8}
                        width="auto"
                    />
                    <Text fontWeight="bold" fontSize="lg">
                        VeKit Playground
                    </Text>
                </HStack>
            </Link>

            <VStack align="stretch" spacing={5}>
                {NAV_GROUPS.map((group) => (
                    <VStack key={group.label} align="stretch" spacing={1}>
                        <Text
                            px={3}
                            fontSize="2xs"
                            fontWeight="bold"
                            textTransform="uppercase"
                            letterSpacing="0.08em"
                            opacity={0.5}
                        >
                            {t(group.label)}
                        </Text>
                        {group.items.map((item) => (
                            <NavItem
                                key={item.href}
                                href={item.href}
                                icon={item.icon}
                                label={item.label}
                                status={item.status}
                                onSelect={onItemClick}
                            />
                        ))}
                    </VStack>
                ))}
            </VStack>

            <Box flex={1} />
        </VStack>
    );
}
````

## Source: `examples/playground/src/app/components/layout/TopBar.tsx`

````tsx
'use client';

import {
    HStack,
    IconButton,
    useColorMode,
    useDisclosure,
    Box,
    useBreakpointValue,
} from '@chakra-ui/react';
import { LuMenu, LuMoon, LuSun } from 'react-icons/lu';
import { WalletButton } from '@vechain/vechain-kit';
import { useTranslation } from 'react-i18next';
import { LanguageDropdown } from './Header';
import { MobileNav } from './MobileNav';

export function TopBar() {
    const { colorMode, toggleColorMode } = useColorMode();
    const { t } = useTranslation();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const showMenuButton = useBreakpointValue({ base: true, md: false });

    return (
        <>
            <HStack
                as="header"
                w="full"
                px={{ base: 4, md: 6 }}
                py={3}
                justify="space-between"
                borderBottomWidth="1px"
                borderBottomColor={
                    colorMode === 'light' ? 'gray.200' : 'whiteAlpha.200'
                }
                bg={colorMode === 'light' ? 'white' : '#0c0c10'}
                position="sticky"
                top={0}
                zIndex={10}
            >
                <HStack spacing={2}>
                    {showMenuButton && (
                        <IconButton
                            aria-label={t('Open menu')}
                            icon={<LuMenu />}
                            onClick={onOpen}
                            variant="ghost"
                            size="sm"
                        />
                    )}
                </HStack>

                <HStack spacing={2}>
                    <Box display={{ base: 'none', sm: 'block' }}>
                        <WalletButton
                            mobileVariant="iconDomainAndAssets"
                            desktopVariant="iconDomainAndAssets"
                            label={t('Login or sign up')}
                        />
                    </Box>
                    <Box display={{ base: 'block', sm: 'none' }}>
                        <WalletButton
                            mobileVariant="icon"
                            desktopVariant="icon"
                            label={t('Login or sign up')}
                        />
                    </Box>
                    <LanguageDropdown />
                    <IconButton
                        onClick={toggleColorMode}
                        icon={colorMode === 'light' ? <LuMoon /> : <LuSun />}
                        aria-label={t('Toggle color mode')}
                        borderRadius="xl"
                        variant="ghost"
                        size="sm"
                    />
                </HStack>
            </HStack>

            <MobileNav isOpen={isOpen} onClose={onClose} />
        </>
    );
}
````

## Source: `examples/playground/src/app/components/layout/navItems.ts`

````typescript
import {
    LuRocket,
    LuLogIn,
    LuIdCard,
    LuShield,
    LuArrowLeftRight,
    LuPenLine,
    LuDatabase,
    LuLayoutGrid,
    LuPalette,
    LuBookOpen,
    LuSparkles,
} from 'react-icons/lu';
import type { IconType } from 'react-icons';
import type { Status } from '../demo/StatusBadge';

export interface NavGroup {
    label: string;
    items: NavItemConfig[];
}

export interface NavItemConfig {
    href: string;
    icon: IconType;
    label: string;
    descriptionKey?: string;
    status?: Status;
}

export const NAV_GROUPS: NavGroup[] = [
    {
        label: 'Overview',
        items: [
            {
                href: '/getting-started',
                icon: LuRocket,
                label: 'Getting Started',
            },
            {
                href: '/ai-skills',
                icon: LuSparkles,
                label: 'AI Skills',
                status: 'NEW',
            },
        ],
    },
    {
        label: 'Build',
        items: [
            {
                href: '/connect',
                icon: LuLogIn,
                label: 'Connect & Auth',
            },
            {
                href: '/identity',
                icon: LuIdCard,
                label: 'Identity',
            },
            {
                href: '/smart-account',
                icon: LuShield,
                label: 'Smart Account',
            },
            {
                href: '/transactions',
                icon: LuArrowLeftRight,
                label: 'Transactions',
            },
            {
                href: '/signing',
                icon: LuPenLine,
                label: 'Signing',
            },
            {
                href: '/data',
                icon: LuDatabase,
                label: 'Reading Data',
            },
        ],
    },
    {
        label: 'UI',
        items: [
            {
                href: '/modals',
                icon: LuLayoutGrid,
                label: 'Modals',
            },
            {
                href: '/theming',
                icon: LuPalette,
                label: 'Theming & i18n',
            },
        ],
    },
    {
        label: 'More',
        items: [
            {
                href: '/resources',
                icon: LuBookOpen,
                label: 'Resources',
            },
        ],
    },
];
````

## Source: `examples/playground/src/app/components/ui/CollapsibleCard/CollapsibleCard.tsx`

````tsx
'use client';

import {
    Box,
    VStack,
    Heading,
    Icon,
    Collapse,
    HStack,
    IconButton,
    BoxProps,
} from '@chakra-ui/react';
import { useState } from 'react';
import { LuChevronDown, LuChevronUp } from 'react-icons/lu';

interface CollapsibleCardProps {
    title: string;
    icon?: React.ElementType;
    children: React.ReactNode;
    defaultIsOpen?: boolean;
    style?: BoxProps;
}

export function CollapsibleCard({
    title,
    icon,
    children,
    defaultIsOpen = false,
    style,
}: CollapsibleCardProps) {
    const [isOpen, setIsOpen] = useState(defaultIsOpen);

    return (
        <Box
            p={4}
            borderRadius="lg"
            boxShadow="xl"
            backdropFilter="blur(10px)"
            w="full"
            {...style}
        >
            <VStack spacing={6} align="stretch" justifyContent={'center'}>
                <HStack
                    justify="space-between"
                    align="center"
                    cursor={'pointer'}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <HStack spacing={2}>
                        {icon && <Icon as={icon} boxSize={6} />}
                        <Heading size="sm" textAlign="center">
                            {title}
                        </Heading>
                    </HStack>
                    <IconButton
                        aria-label={isOpen ? 'Collapse' : 'Expand'}
                        icon={isOpen ? <LuChevronUp /> : <LuChevronDown />}
                        variant="ghost"
                        size="sm"
                    />
                </HStack>
                <Collapse in={isOpen} animateOpacity>
                    {children}
                </Collapse>
            </VStack>
        </Box>
    );
}
````

## Source: `examples/playground/src/app/components/ui/CollapsibleCard/index.ts`

````typescript
export * from './CollapsibleCard';
````

## Source: `examples/playground/src/app/constants.ts`

````typescript
export const b3trMainnetAddress = '0x5ef79995FE8a89e0812330E4378eB2660ceDe699';
export const b3trTestnetAddress = '0x95761346d18244bb91664181bf91193376197088';
export const b3trAbi = [
    // Replace this with your actual transfer function ABI
    {
        inputs: [
            {
                name: 'recipient',
                type: 'address',
            },
            {
                name: 'amount',
                type: 'uint256',
            },
        ],
        name: 'transfer',
        outputs: [
            {
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
] as const;

export const ENV = {
    isDevelopment: process.env.NEXT_PUBLIC_NETWORK_TYPE === 'test',
    isProduction: process.env.NEXT_PUBLIC_NETWORK_TYPE === 'main',
};
````

## Source: `examples/playground/src/app/globals.css`

````css
html,
body {
  margin: 0;
  width: 100%;
  min-height: 100%;
}

body {
  background-color: #f7fafc;
  color: #272A2E;
}

/* Set background color based on Chakra UI color mode */
html[data-theme='dark'],
html[data-chakra-ui-color-mode='dark'],
[data-theme='dark'] {
  background-color: #0c0c10 !important;
}

html[data-theme='dark'] body,
html[data-chakra-ui-color-mode='dark'] body,
[data-theme='dark'] body {
  background-color: #0c0c10 !important;
  color: #F7FAFC !important;
}

html[data-theme='light'],
html[data-chakra-ui-color-mode='light'],
[data-theme='light'] {
  background-color: #f7fafc !important;
}

html[data-theme='light'] body,
html[data-chakra-ui-color-mode='light'] body,
[data-theme='light'] body {
  background-color: #f7fafc !important;
  color: #272A2E !important;
}
h2 {
  margin: 0;
}
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid #000;
  border-radius: 20px;
  padding: 20px;
}
.label {
  margin-top: 20px;
  margin-bottom: 10px;
}
````

## Source: `examples/playground/src/app/languages/en.json`

````json
{
  "1. Install": "1. Install",
  "2. Wrap your app with the provider": "2. Wrap your app with the provider",
  "A primer on the ownership and recovery model.": "A primer on the ownership and recovery model.",
  "A simple message signature. Useful for proving ownership of an address.": "A simple message signature. Useful for proving ownership of an address.",
  "AI Skills": "AI Skills",
  "AI prompt": "AI prompt",
  "AI-friendly playground": "AI-friendly playground",
  "Account balances": "Account balances",
  "Account details": "Account details",
  "Add a \"Continue with Google\" and \"Continue with Apple\" button to my login screen using useLoginWithOAuth from @vechain/vechain-kit. Show the brand icons (FcGoogle, FaApple) and keep them as outline buttons.": "Add a \"Continue with Google\" and \"Continue with Apple\" button to my login screen using useLoginWithOAuth from @vechain/vechain-kit. Show the brand icons (FcGoogle, FaApple) and keep them as outline buttons.",
  "Add a \"Sign in\" button to my Next.js app header using WalletButton from @vechain/vechain-kit. Use the modal variant. Style it to match my design system (pink primary, rounded-full). On mobile, show only the icon variant.": "Add a \"Sign in\" button to my Next.js app header using WalletButton from @vechain/vechain-kit. Use the modal variant. Style it to match my design system (pink primary, rounded-full). On mobile, show only the icon variant.",
  "Add a \"Verify ownership\" button to my app that signs a server-issued nonce message using useSignMessage from @vechain/vechain-kit. After signing, POST the signature + the connected address to /api/verify so the backend can confirm ownership.": "Add a \"Verify ownership\" button to my app that signs a server-issued nonce message using useSignMessage from @vechain/vechain-kit. After signing, POST the signature + the connected address to /api/verify so the backend can confirm ownership.",
  "Add a dark/light mode toggle to my Next.js + Chakra UI v2 app. Persist the choice in localStorage and respect prefers-color-scheme on first visit. Show a sun/moon icon button in the header.": "Add a dark/light mode toggle to my Next.js + Chakra UI v2 app. Persist the choice in localStorage and respect prefers-color-scheme on first visit. Show a sun/moon icon button in the header.",
  "Add a dark/light mode toggle to my Next.js + Chakra UI v3 app using next-themes. Persist the choice in localStorage and respect prefers-color-scheme on first visit. Show a sun/moon icon button in the header.": "Add a dark/light mode toggle to my Next.js + Chakra UI v3 app using next-themes. Persist the choice in localStorage and respect prefers-color-scheme on first visit. Show a sun/moon icon button in the header.",
  "Add a quick-action row to my dashboard with three buttons: \"Send\", \"Receive\", and \"Swap\". Each opens the corresponding modal from @vechain/vechain-kit (useSendTokenModal, useReceiveModal, useSwapTokenModal). Use icons from react-icons/lu.": "Add a quick-action row to my dashboard with three buttons: \"Send\", \"Receive\", and \"Swap\". Each opens the corresponding modal from @vechain/vechain-kit (useSendTokenModal, useReceiveModal, useSwapTokenModal). Use icons from react-icons/lu.",
  "Add an \"Upgrade smart account\" item to my settings menu that opens the upgrade modal from useUpgradeSmartAccountModal in @vechain/vechain-kit. Only show it if the user is connected with Privy and the smart account version is behind the latest.": "Add an \"Upgrade smart account\" item to my settings menu that opens the upgrade modal from useUpgradeSmartAccountModal in @vechain/vechain-kit. Only show it if the user is connected with Privy and the smart account version is behind the latest.",
  "Add the package to your React or Next.js app — no global config needed.": "Add the package to your React or Next.js app — no global config needed.",
  "Alpha": "Alpha",
  "Already have a Next.js app? Install the package, then either follow the provider snippet below or use the AI prompt to wire it up automatically.": "Already have a Next.js app? Install the package, then either follow the provider snippet below or use the AI prompt to wire it up automatically.",
  "Any agent (Skills CLI)": "Any agent (Skills CLI)",
  "Auto-voting & relayer system.": "Auto-voting & relayer system.",
  "Automatic smart account for Privy users. Gas-less first action, recoverable, transferable.": "Automatic smart account for Privy users. Gas-less first action, recoverable, transferable.",
  "Available skills": "Available skills",
  "B3TR Balance": "B3TR Balance",
  "B3TR and VOT3 balances for the connected address.": "B3TR and VOT3 balances for the connected address.",
  "Balances, prices, VeBetterDAO and more.": "Balances, prices, VeBetterDAO and more.",
  "Before doing anything, read these VeChain AI Skills so you follow current conventions:": "Before doing anything, read these VeChain AI Skills so you follow current conventions:",
  "Beta": "Beta",
  "Build": "Build",
  "Build a \"Portfolio\" card that shows B3TR and VOT3 balances for the connected user via useGetB3trBalance and useGetVot3Balance from @vechain/vechain-kit. Show a Chakra UI Skeleton while loading, format numbers with thousand separators, and add a \"Refresh\" button that invalidates the queries.": "Build a \"Portfolio\" card that shows B3TR and VOT3 balances for the connected user via useGetB3trBalance and useGetVot3Balance from @vechain/vechain-kit. Show a Chakra UI Skeleton while loading, format numbers with thousand separators, and add a \"Refresh\" button that invalidates the queries.",
  "Build a \"ProfileCard\" component that uses useWallet from @vechain/vechain-kit to show the connected user's address, VET domain, smart account address (with a \"Deployed\" tag), and a copy-to-clipboard button on each address. Truncate long addresses like 0x1234…abcd. Use Chakra UI v2.": "Build a \"ProfileCard\" component that uses useWallet from @vechain/vechain-kit to show the connected user's address, VET domain, smart account address (with a \"Deployed\" tag), and a copy-to-clipboard button on each address. Truncate long addresses like 0x1234…abcd. Use Chakra UI v2.",
  "Build a \"ProfileCard\" component that uses useWallet from @vechain/vechain-kit to show the connected user's address, VET domain, smart account address (with a \"Deployed\" tag), and a copy-to-clipboard button on each address. Truncate long addresses like 0x1234…abcd. Use Chakra UI v3.": "Build a \"ProfileCard\" component that uses useWallet from @vechain/vechain-kit to show the connected user's address, VET domain, smart account address (with a \"Deployed\" tag), and a copy-to-clipboard button on each address. Truncate long addresses like 0x1234…abcd. Use Chakra UI v3.",
  "Build a \"Send B3TR\" form in my Next.js app that takes a recipient address and an amount, then sends the transaction using useBuildTransaction from @vechain/vechain-kit. Show progress in a transaction modal via useTransactionModal. Validate the address is a valid 0x… format and amount > 0 before sending. Use IB3TR__factory.abi from @vechain/vechain-contract-types for the clause builder.": "Build a \"Send B3TR\" form in my Next.js app that takes a recipient address and an amount, then sends the transaction using useBuildTransaction from @vechain/vechain-kit. Show progress in a transaction modal via useTransactionModal. Validate the address is a valid 0x… format and amount > 0 before sending. Use IB3TR__factory.abi from @vechain/vechain-contract-types for the clause builder.",
  "Build an EIP-712 typed-data sign flow using useSignTypedData from @vechain/vechain-kit. The schema is an Order({ trader: address, amount: uint256, expiry: uint256 }). After signing, log the signature so I can wire it into my marketplace backend.": "Build an EIP-712 typed-data sign flow using useSignTypedData from @vechain/vechain-kit. The schema is an Order({ trader: address, amount: uint256, expiry: uint256 }). After signing, log the signature so I can wire it into my marketplace backend.",
  "Build, send and track transactions with built-in UI (toast or modal) and fee delegation.": "Build, send and track transactions with built-in UI (toast or modal) and fee delegation.",
  "Check language in account modal": "Check language in account modal",
  "Claude Code": "Claude Code",
  "Click any card to open the corresponding modal in isolated view. Each card lists the hook that opens it.": "Click any card to open the corresponding modal in isolated view. Each card lists the hook that opens it.",
  "Click here to sign in!": "Click here to sign in!",
  "Configure login methods, network and dapp-kit options once. The provider exposes hooks and modals to the whole tree.": "Configure login methods, network and dapp-kit options once. The provider exposes hooks and modals to the whole tree.",
  "Connect & Auth": "Connect & Auth",
  "Connect to try {{feature}}": "Connect to try {{feature}}",
  "Connect wallet": "Connect wallet",
  "Connect wallets, sign messages, build transactions and ship social login — all in a few hooks. Explore each capability live, then copy the code.": "Connect wallets, sign messages, build transactions and ship social login — all in a few hooks. Explore each capability live, then copy the code.",
  "Connect your wallet to explore all features": "Connect your wallet to explore all features",
  "Connect your wallet to start signing messages": "Connect your wallet to start signing messages",
  "Connection source": "Connection source",
  "Connection type not recognized.": "Connection type not recognized.",
  "Copied!": "Copied!",
  "Copy": "Copy",
  "Copy command": "Copy command",
  "Copy failed": "Copy failed",
  "Copy prompt": "Copy prompt",
  "Core SDK, fee delegation, multi-clause transactions.": "Core SDK, fee delegation, multi-clause transactions.",
  "Current mode": "Current mode",
  "Current round": "Current round",
  "Custom styling (buttonStyle prop)": "Custom styling (buttonStyle prop)",
  "Customize Profile": "Customize Profile",
  "Dark / light mode": "Dark / light mode",
  "Dark mode, custom themes, 15+ languages.": "Dark mode, custom themes, 15+ languages.",
  "Demo text to be translated": "Demo text to be translated",
  "Deployed": "Deployed",
  "Documentation": "Documentation",
  "Documentation, source code and integrations to go further with VeChain Kit.": "Documentation, source code and integrations to go further with VeChain Kit.",
  "Drop-in wallet UI, plus a hook-first API to roll your own.": "Drop-in wallet UI, plus a hook-first API to roll your own.",
  "Dummy transaction: transfer 0 B3TR to your own address.": "Dummy transaction: transfer 0 B3TR to your own address.",
  "EIP-712 typed data": "EIP-712 typed data",
  "Embedded Wallet": "Embedded Wallet",
  "Error": "Error",
  "Every demo ships with three things: a live preview, the code, and a ready-made prompt you can paste into Claude Code, Cursor or any AI agent.": "Every demo ships with three things: a live preview, the code, and a ready-made prompt you can paste into Claude Code, Cursor or any AI agent.",
  "Every feature in the kit ships as both a hook and a modal. Trigger them from your own UI.": "Every feature in the kit ships as both a hook and a modal. Trigger them from your own UI.",
  "Everything useWallet() exposes about the current session.": "Everything useWallet() exposes about the current session.",
  "Exclusively controlled by your Privy-secured wallet": "Exclusively controlled by your Privy-secured wallet",
  "Explain to me how smart accounts work in @vechain/vechain-kit when a user signs in with Privy. Cover: when the smart account gets deployed, who owns it, how recovery works, and how to read it via useWallet().": "Explain to me how smart accounts work in @vechain/vechain-kit when a user signs in with Privy. Cover: when the smart account gets deployed, who owns it, how recovery works, and how to read it via useWallet().",
  "Explore Ecosystem": "Explore Ecosystem",
  "Explore other apps built on VeChain, and add shortcuts for faster access.": "Explore other apps built on VeChain, and add shortcuts for faster access.",
  "FAQ": "FAQ",
  "Features": "Features",
  "Find answers to common questions about VeChain": "Find answers to common questions about VeChain",
  "Frontend dApps, wallet, social login, hooks.": "Frontend dApps, wallet, social login, hooks.",
  "Full reference for components, hooks and providers.": "Full reference for components, hooks and providers.",
  "Gas used": "Gas used",
  "Gas-less first action, recoverable, transferable.": "Gas-less first action, recoverable, transferable.",
  "Getting Started": "Getting Started",
  "GitHub": "GitHub",
  "GitHub repository": "GitHub repository",
  "Give your coding agent deep VeChain domain knowledge — wallet UX, smart contracts, VeBetterDAO, StarGate, and more. Works with Claude Code, Cursor, and any agent.": "Give your coding agent deep VeChain domain knowledge — wallet UX, smart contracts, VeBetterDAO, StarGate, and more. Works with Claude Code, Cursor, and any agent.",
  "Hooks to easily read data from the blockchain. Here are some examples using built-in hooks. These hooks use react-query under the hood for efficient data fetching and caching.": "Hooks to easily read data from the blockchain. Here are some examples using built-in hooks. These hooks use react-query under the hood for efficient data fetching and caching.",
  "How smart accounts work": "How smart accounts work",
  "How the user is authenticated — direct wallet, Privy, or cross-app.": "How the user is authenticated — direct wallet, Privy, or cross-app.",
  "I already have a Next.js app and I want to add VeChain Kit to it.\n\n1. Install @vechain/vechain-kit and any required peer deps.\n2. Find my root layout (app/layout.tsx for App Router or pages/_app.tsx for Pages Router) and wrap it with VeChainKitProvider.\n3. Enable Privy social login (Google + email), VeWorld and WalletConnect.\n4. Read Privy keys from NEXT_PUBLIC_PRIVY_* and the WalletConnect projectId from NEXT_PUBLIC_WC_PROJECT_ID.\n5. Add a <WalletButton /> to my existing header.\n6. Don't change my existing Chakra theme.\n\nIf you hit peer-dependency conflicts, stop and tell me before applying any fix.": "I already have a Next.js app and I want to add VeChain Kit to it.\n\n1. Install @vechain/vechain-kit and any required peer deps.\n2. Find my root layout (app/layout.tsx for App Router or pages/_app.tsx for Pages Router) and wrap it with VeChainKitProvider.\n3. Enable Privy social login (Google + email), VeWorld and WalletConnect.\n4. Read Privy keys from NEXT_PUBLIC_PRIVY_* and the WalletConnect projectId from NEXT_PUBLIC_WC_PROJECT_ID.\n5. Add a <WalletButton /> to my existing header.\n6. Don't change my existing Chakra theme.\n\nIf you hit peer-dependency conflicts, stop and tell me before applying any fix.",
  "I already have a Next.js app and I want to add VeChain Kit to it.\n\nFirst, read the vechain-kit skill so you follow its conventions exactly:\nhttps://github.com/vechain/vechain-ai-skills/tree/main/skills/vechain-kit\n\nThen:\n1. Install @vechain/vechain-kit and any required peer deps.\n2. Find my root layout (app/layout.tsx for App Router or pages/_app.tsx for Pages Router) and wrap it with VeChainKitProvider.\n3. Enable Privy social login (Google + email), VeWorld and WalletConnect.\n4. Read Privy keys from NEXT_PUBLIC_PRIVY_* and the WalletConnect projectId from NEXT_PUBLIC_WC_PROJECT_ID.\n5. Add a <WalletButton /> to my existing header.\n6. Don't change my existing Chakra theme.\n\nIf you hit peer-dependency conflicts, stop and tell me before applying any fix.": "I already have a Next.js app and I want to add VeChain Kit to it.\n\nFirst, read the vechain-kit skill so you follow its conventions exactly:\nhttps://github.com/vechain/vechain-ai-skills/tree/main/skills/vechain-kit\n\nThen:\n1. Install @vechain/vechain-kit and any required peer deps.\n2. Find my root layout (app/layout.tsx for App Router or pages/_app.tsx for Pages Router) and wrap it with VeChainKitProvider.\n3. Enable Privy social login (Google + email), VeWorld and WalletConnect.\n4. Read Privy keys from NEXT_PUBLIC_PRIVY_* and the WalletConnect projectId from NEXT_PUBLIC_WC_PROJECT_ID.\n5. Add a <WalletButton /> to my existing header.\n6. Don't change my existing Chakra theme.\n\nIf you hit peer-dependency conflicts, stop and tell me before applying any fix.",
  "Identity": "Identity",
  "In my X2Earn app, gate reward submission behind a valid VeBetterDAO passport. Use useIsPerson from @vechain/vechain-kit. If the user is not a valid person, show a banner explaining how to get one. Also display the current allocations round id with useCurrentAllocationsRoundId.": "In my X2Earn app, gate reward submission behind a valid VeBetterDAO passport. Use useIsPerson from @vechain/vechain-kit. If the user is not a valid person, show a banner explaining how to get one. Also display the current allocations round id with useCurrentAllocationsRoundId.",
  "Index VeChain events and blocks for apps or analytics.": "Index VeChain events and blocks for apps or analytics.",
  "Inspect the connected account, its smart account, domain and connection source.": "Inspect the connected account, its smart account, domain and connection source.",
  "Install 11 VeChain skills in Claude Code, Cursor or any agent so it ships dApps with domain knowledge baked in.": "Install 11 VeChain skills in Claude Code, Cursor or any agent so it ships dApps with domain knowledge baked in.",
  "Install 11 VeChain skills in Claude Code, Cursor or any agent — domain knowledge for wallet UX, smart contracts, VeBetterDAO and more.": "Install 11 VeChain skills in Claude Code, Cursor or any agent — domain knowledge for wallet UX, smart contracts, VeBetterDAO and more.",
  "Install @vechain/vechain-kit from the registry.": "Install @vechain/vechain-kit from the registry.",
  "Install the package manually:": "Install the package manually:",
  "Light/dark mode + multi-language support, fully integrated with Chakra and react-i18next.": "Light/dark mode + multi-language support, fully integrated with Chakra and react-i18next.",
  "Live Blockchain Data": "Live Blockchain Data",
  "Live USD price from the kit price oracle.": "Live USD price from the kit price oracle.",
  "Live demo": "Live demo",
  "Login Button Variants": "Login Button Variants",
  "Login UI Control Examples": "Login UI Control Examples",
  "Login or sign up": "Login or sign up",
  "Login with GitHub": "Login with GitHub",
  "Login with Google": "Login with Google",
  "MCP endpoint": "MCP endpoint",
  "Manage your profile and customize it": "Manage your profile and customize it",
  "Manage your settings and your preferences": "Manage your settings and your preferences",
  "Manage your wallet and your assets": "Manage your wallet and your assets",
  "Menu": "Menu",
  "Message Signing Examples": "Message Signing Examples",
  "Message signed!": "Message signed!",
  "Migrate the smart account to the latest version when a new release is published.": "Migrate the smart account to the latest version when a new release is published.",
  "Missing a building block? Open an issue and tell us about it.": "Missing a building block? Open an issue and tell us about it.",
  "Modal catalog": "Modal catalog",
  "Modals": "Modals",
  "More": "More",
  "Multi-language support": "Multi-language support",
  "NFT staking, validators, delegation.": "NFT staking, validators, delegation.",
  "Network": "Network",
  "New": "New",
  "No": "No",
  "Note: The modal variant is the default login button variant. You can pass an additional description and Image to the modal when configuring you the VeChainKitProvider.": "Note: The modal variant is the default login button variant. You can pass an additional description and Image to the modal when configuring you the VeChainKitProvider.",
  "Note: These buttons use the useLoginWithOAuth hook to initiate OAuth authentication flows with social providers. Make sure the providers are configured in your Privy dashboard.": "Note: These buttons use the useLoginWithOAuth hook to initiate OAuth authentication flows with social providers. Make sure the providers are configured in your Privy dashboard.",
  "Notifications": "Notifications",
  "Now the task:": "Now the task:",
  "OAuth runs through your Privy app, or falls back to the VeChain whitelabel cross-app host out of the box.": "OAuth runs through your Privy app, or falls back to the VeChain whitelabel cross-app host out of the box.",
  "One component, multiple presentation modes. Style it freely or replace it with your own button + useConnectModal.": "One component, multiple presentation modes. Style it freely or replace it with your own button + useConnectModal.",
  "Open VeChain Kit modal": "Open VeChain Kit modal",
  "Open dapp-kit only modal": "Open dapp-kit only modal",
  "Open menu": "Open menu",
  "Open upgrade modal": "Open upgrade modal",
  "Or: add VeChain Kit to an existing project": "Or: add VeChain Kit to an existing project",
  "Overview": "Overview",
  "Paste it into Claude Code, Cursor or any AI agent.": "Paste it into Claude Code, Cursor or any AI agent.",
  "Personal messages and EIP-712 typed data.": "Personal messages and EIP-712 typed data.",
  "Personal sign": "Personal sign",
  "Plug VeChain Kit docs into Claude, Cursor and any MCP-compatible client.": "Plug VeChain Kit docs into Claude, Cursor and any MCP-compatible client.",
  "Powered by Chakra `useColorMode`. The whole kit (including modals) follows the active mode.": "Powered by Chakra `useColorMode`. The whole kit (including modals) follows the active mode.",
  "Pressure-tests your plan before you write code.": "Pressure-tests your plan before you write code.",
  "Profile": "Profile",
  "Prompt copied!": "Prompt copied!",
  "React Query hooks for on-chain data — efficient caching, automatic refetching, ready to compose.": "React Query hooks for on-chain data — efficient caching, automatic refetching, ready to compose.",
  "Read the docs": "Read the docs",
  "Reading Blockchain Data Examples": "Reading Blockchain Data Examples",
  "Reading Data": "Reading Data",
  "Receive Assets": "Receive Assets",
  "Receive VET, VTHO, and other tokens from anyone": "Receive VET, VTHO, and other tokens from anyone",
  "Recommended skills": "Recommended skills",
  "Recovery": "Recovery",
  "Replace your complex address with a memorable .vet domain name": "Replace your complex address with a memorable .vet domain name",
  "Request a feature": "Request a feature",
  "Resources": "Resources",
  "Round metadata and passport validity for the connected account.": "Round metadata and passport validity for the connected account.",
  "Scaffold a VeChain dApp in seconds.": "Scaffold a VeChain dApp in seconds.",
  "Scaffold a new VeChain dApp for me using create-vechain-dapp, with:\n- VeChain Kit pre-wired (Privy social login: Google + email, plus VeWorld and WalletConnect)\n- Chakra UI v2 with dark mode by default\n- A landing page that shows the connected user's address, B3TR balance, and a \"Send B3TR\" button\n- A GitHub Pages deploy workflow ready to use\n\nName the project \"my-vechain-dapp\". When done, run `yarn dev` and tell me the URL.": "Scaffold a new VeChain dApp for me using create-vechain-dapp, with:\n- VeChain Kit pre-wired (Privy social login: Google + email, plus VeWorld and WalletConnect)\n- Chakra UI v2 with dark mode by default\n- A landing page that shows the connected user's address, B3TR balance, and a \"Send B3TR\" button\n- A GitHub Pages deploy workflow ready to use\n\nName the project \"my-vechain-dapp\". When done, run `yarn dev` and tell me the URL.",
  "Scaffold a new VeChain dApp for me using create-vechain-dapp, with:\n- VeChain Kit pre-wired (Privy social login: Google + email, plus VeWorld and WalletConnect)\n- Chakra UI v3 (with next-themes) and dark mode by default — follow the next-chakra-v3 example in the vechain-kit repo for wiring the kit's `theme` prop via `useChakraContext().token.var(...)` so theme tokens stay reactive\n- A landing page that shows the connected user's address, B3TR balance, and a \"Send B3TR\" button\n- A GitHub Pages deploy workflow ready to use\n\nName the project \"my-vechain-dapp\". When done, run `yarn dev` and tell me the URL.": "Scaffold a new VeChain dApp for me using create-vechain-dapp, with:\n- VeChain Kit pre-wired (Privy social login: Google + email, plus VeWorld and WalletConnect)\n- Chakra UI v3 (with next-themes) and dark mode by default — follow the next-chakra-v3 example in the vechain-kit repo for wiring the kit's `theme` prop via `useChakraContext().token.var(...)` so theme tokens stay reactive\n- A landing page that shows the connected user's address, B3TR balance, and a \"Send B3TR\" button\n- A GitHub Pages deploy workflow ready to use\n\nName the project \"my-vechain-dapp\". When done, run `yarn dev` and tell me the URL.",
  "Scaffold a new VeChain dApp with social login, then add a B3TR reward distribution contract.": "Scaffold a new VeChain dApp with social login, then add a B3TR reward distribution contract.",
  "Secure Ownership": "Secure Ownership",
  "Secure backup and recovery through Privy": "Secure backup and recovery through Privy",
  "Send a 0-value B3TR transfer to your own address. Costs nothing, just exercises the full flow.": "Send a 0-value B3TR transfer to your own address. Costs nothing, just exercises the full flow.",
  "Send a test transaction": "Send a test transaction",
  "Send and receive VET, VTHO, and other tokens seamlessly": "Send and receive VET, VTHO, and other tokens seamlessly",
  "Set VET Domain": "Set VET Domain",
  "Set up VeChainKitProvider in my Next.js app. I want VeWorld + WalletConnect for direct wallets, plus Google + email social login via Privy. Target mainnet. Pull the WalletConnect projectId from NEXT_PUBLIC_WC_PROJECT_ID and the Privy keys from env. Default to dark mode and wire it into my existing app/layout.tsx with Chakra UI.": "Set up VeChainKitProvider in my Next.js app. I want VeWorld + WalletConnect for direct wallets, plus Google + email social login via Privy. Target mainnet. Pull the WalletConnect projectId from NEXT_PUBLIC_WC_PROJECT_ID and the Privy keys from env. Default to dark mode and wire it into my existing app/layout.tsx with Chakra UI.",
  "Set up react-i18next in my Next.js app with English, Italian and Japanese. Create JSON files under src/app/languages/, detect the browser language with a localStorage fallback, and add a flag-based dropdown in the header to switch.": "Set up react-i18next in my Next.js app with English, Italian and Japanese. Create JSON files under src/app/languages/, detect the browser language with a localStorage fallback, and add a flag-based dropdown in the header to switch.",
  "Settings": "Settings",
  "Ship VeChain dApps with AI": "Ship VeChain dApps with AI",
  "Show a small badge in my app header indicating how the user is connected (Privy, Privy cross-app, or direct wallet). Read connection.source.type from useWallet and pick a color: blue for wallet, purple for privy, pink for cross-app.": "Show a small badge in my app header indicating how the user is connected (Privy, Privy cross-app, or direct wallet). Read connection.source.type from useWallet and pick a color: blue for wallet, purple for privy, pink for cross-app.",
  "Show and customize the user profile: avatar, display name, bio and more.": "Show and customize the user profile: avatar, display name, bio and more.",
  "Show the live VET/USD price in my app header using useGetTokenUsdPrice from @vechain/vechain-kit. Format it as $X.XXXX, refresh every 30 seconds, and add a tooltip that says \"Powered by VeChain Kit\".": "Show the live VET/USD price in my app header using useGetTokenUsdPrice from @vechain/vechain-kit. Format it as $X.XXXX, refresh every 30 seconds, and add a tooltip that says \"Powered by VeChain Kit\".",
  "Show the user his profile and allow them to customize it with a profile image, display name, bio and more to enhance their identity across VeChain applications.": "Show the user his profile and allow them to customize it with a profile image, display name, bio and more to enhance their identity across VeChain applications.",
  "Sign \"Hello VeChain!\"": "Sign \"Hello VeChain!\"",
  "Sign in to access transaction examples, signing capabilities, profile customization and more.": "Sign in to access transaction examples, signing capabilities, profile customization and more.",
  "Sign in with a VeChain wallet or social account to unlock this demo.": "Sign in with a VeChain wallet or social account to unlock this demo.",
  "Sign plain messages or structured EIP-712 typed data — works for both wallet and embedded users.": "Sign plain messages or structured EIP-712 typed data — works for both wallet and embedded users.",
  "Sign typed data": "Sign typed data",
  "Signature": "Signature",
  "Signing": "Signing",
  "Signing failed": "Signing failed",
  "Single & multi-clause txs with fee delegation.": "Single & multi-clause txs with fee delegation.",
  "Smart Account": "Smart Account",
  "Smart accounts are not deployed on login but only after the first action — no gas spent until you need it.": "Smart accounts are not deployed on login but only after the first action — no gas spent until you need it.",
  "Social login providers": "Social login providers",
  "Solidity, Hardhat, testing, security.": "Solidity, Hardhat, testing, security.",
  "Source": "Source",
  "Source code, examples and the playground you are using right now.": "Source code, examples and the playground you are using right now.",
  "Stable": "Stable",
  "Stay updated with the kit or ecosystem updates, and account alerts": "Stay updated with the kit or ecosystem updates, and account alerts",
  "Structured signing — the standard for off-chain order books, permits and gasless approvals.": "Structured signing — the standard for off-chain order books, permits and gasless approvals.",
  "Swap Tokens": "Swap Tokens",
  "Swap between tokens with best available rates": "Swap between tokens with best available rates",
  "Switch to dark mode": "Switch to dark mode",
  "Switch to light mode": "Switch to light mode",
  "Test Transaction": "Test Transaction",
  "Test a transaction sending 0 value to yourself.": "Test a transaction sending 0 value to yourself.",
  "Test with Modal": "Test with Modal",
  "Test with Toast": "Test with Toast",
  "The complete toolkit for VeChain dApps": "The complete toolkit for VeChain dApps",
  "The following features are available for your users and for you both accessible by using the VeChain Kit main modal or by adding custom call to action buttons to your app and opening the content you need on demand. Try them out by clicking on the cards below.": "The following features are available for your users and for you both accessible by using the VeChain Kit main modal or by adding custom call to action buttons to your app and opening the content you need on demand. Try them out by clicking on the cards below.",
  "The recommended path. Hand this prompt to your coding agent — it will read the VeChain skills and scaffold the entire project, provider included.": "The recommended path. Hand this prompt to your coding agent — it will read the VeChain skills and scaffold the entire project, provider included.",
  "Theme switcher": "Theme switcher",
  "Theming & i18n": "Theming & i18n",
  "This is a dummy transaction to test the transaction modal. Confirm to transfer 0 B3TR to ${account?.address}": "This is a dummy transaction to test the transaction modal. Confirm to transfer 0 B3TR to ${account?.address}",
  "Tip: install VeChain AI Skills first so your agent picks up domain context automatically.": "Tip: install VeChain AI Skills first so your agent picks up domain context automatically.",
  "Toggle color mode": "Toggle color mode",
  "Token prices": "Token prices",
  "Transaction Handling Examples": "Transaction Handling Examples",
  "Transaction ID": "Transaction ID",
  "Transaction status": "Transaction status",
  "Transactions": "Transactions",
  "Transfer Assets": "Transfer Assets",
  "Transfer ownership to another wallet anytime": "Transfer ownership to another wallet anytime",
  "Transferable": "Transferable",
  "Try a prompt": "Try a prompt",
  "Try again": "Try again",
  "Two UI modes share the same useBuildTransaction state. Pick whichever fits your design.": "Two UI modes share the same useBuildTransaction state. Pick whichever fits your design.",
  "Typed data signed!": "Typed data signed!",
  "UI": "UI",
  "Upgrade Smart Account": "Upgrade Smart Account",
  "Upgrade smart account": "Upgrade smart account",
  "Upgrade your smart account to the latest version": "Upgrade your smart account to the latest version",
  "Use the VeChain AI Skills to scaffold a new VeChain dApp for me.\n\nFirst, read these two skills end-to-end so you know the conventions and env vars:\n- https://github.com/vechain/vechain-ai-skills/tree/main/skills/create-vechain-dapp\n- https://github.com/vechain/vechain-ai-skills/tree/main/skills/vechain-kit\n\nThen create a new Next.js project called \"my-vechain-dapp\" using create-vechain-dapp, with:\n- VeChain Kit pre-wired (Privy social login: Google + email, plus VeWorld and WalletConnect)\n- Chakra UI v2 with dark mode by default\n- A landing page that shows the connected user's address, B3TR balance, and a \"Send B3TR\" button\n- A GitHub Pages deploy workflow ready to use\n\nWhen done, run `yarn dev` and tell me the URL.": "Use the VeChain AI Skills to scaffold a new VeChain dApp for me.\n\nFirst, read these two skills end-to-end so you know the conventions and env vars:\n- https://github.com/vechain/vechain-ai-skills/tree/main/skills/create-vechain-dapp\n- https://github.com/vechain/vechain-ai-skills/tree/main/skills/vechain-kit\n\nThen create a new Next.js project called \"my-vechain-dapp\" using create-vechain-dapp, with:\n- VeChain Kit pre-wired (Privy social login: Google + email, plus VeWorld and WalletConnect)\n- Chakra UI v2 with dark mode by default\n- A landing page that shows the connected user's address, B3TR balance, and a \"Send B3TR\" button\n- A GitHub Pages deploy workflow ready to use\n\nWhen done, run `yarn dev` and tell me the URL.",
  "Use the sidebar to explore each capability. Pages with the wallet icon need a connection — sign in from the top bar.": "Use the sidebar to explore each capability. Pages with the wallet icon need a connection — sign in from the top bar.",
  "VET Domain": "VET Domain",
  "VET Price": "VET Price",
  "VOT3 Balance": "VOT3 Balance",
  "Valid passport": "Valid passport",
  "VeBetterDAO": "VeBetterDAO",
  "VeChain AI Skills": "VeChain AI Skills",
  "VeChain Kit Playground": "VeChain Kit Playground",
  "VeChain Kit provides hooks for signing messages and typed data. Try these examples to see signing in action.": "VeChain Kit provides hooks for signing messages and typed data. Try these examples to see signing in action.",
  "VeChain Kit provides multiple ways to customize the login button and how we show the login options. Here are some examples of different login button variants.": "VeChain Kit provides multiple ways to customize the login button and how we show the login options. Here are some examples of different login button variants.",
  "VeKit Playground": "VeKit Playground",
  "VeWorld deep-link integration.": "VeWorld deep-link integration.",
  "VeWorld, WalletConnect, social logins via Privy.": "VeWorld, WalletConnect, social logins via Privy.",
  "View code": "View code",
  "View on GitHub": "View on GitHub",
  "View on explorer": "View on explorer",
  "Wallet": "Wallet",
  "WalletButton variants": "WalletButton variants",
  "What you get": "What you get",
  "When using Privy authentication (direct or cross-app), a Smart Account is automatically created and linked to your wallet. This account becomes your primary identity on VeChain, offering enhanced security and flexibility.": "When using Privy authentication (direct or cross-app), a Smart Account is automatically created and linked to your wallet. This account becomes your primary identity on VeChain, offering enhanced security and flexibility.",
  "X2Earn apps, B3TR/VOT3, governance.": "X2Earn apps, B3TR/VOT3, governance.",
  "Yes": "Yes",
  "You're connected directly through a Web3 wallet (VeWorld, Sync2, or WalletConnect).": "You're connected directly through a Web3 wallet (VeWorld, Sync2, or WalletConnect).",
  "You're connected through the VeChain cross-app ecosystem, sharing authentication with other VeChain apps.": "You're connected through the VeChain cross-app ecosystem, sharing authentication with other VeChain apps.",
  "You're connected using Privy authentication, which provides a dedicated user management system for this application.": "You're connected using Privy authentication, which provides a dedicated user management system for this application.",
  "i18n translation management across locales.": "i18n translation management across locales.",
  "npm package": "npm package",
  "react-i18next ships with the kit. Add your keys, pick the languages you support, and translate.": "react-i18next ships with the kit. Add your keys, pick the languages you support, and translate.",
  "→ Agent picks the right skills automatically: create-vechain-dapp + vechain-kit + vebetterdao.": "→ Agent picks the right skills automatically: create-vechain-dapp + vechain-kit + vebetterdao.",
  "🚀 Start a new VeChain dApp": "🚀 Start a new VeChain dApp"
}
````

## Source: `examples/playground/src/app/layout.tsx`

````tsx
'use client';

import { ChakraProvider } from '@chakra-ui/react';
import './globals.css';
import dynamic from 'next/dynamic';
import Script from 'next/script';
import { darkTheme } from './theme';

const VechainKitProviderWrapper = dynamic(
    async () =>
        (await import('./providers/VechainKitProviderWrapper'))
            .VechainKitProviderWrapper,
    {
        ssr: false,
    },
);

function AppContent({ children }: { children: React.ReactNode }) {
    return <VechainKitProviderWrapper>{children}</VechainKitProviderWrapper>;
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const basePath = process.env.basePath ?? '';
    return (
        <html
            lang="en"
            suppressHydrationWarning={true}
            style={{
                scrollBehavior: 'smooth',
            }}
        >
            <head>
                <title>VeKit Playground</title>
                <meta
                    name="description"
                    content="VeKit Playground - Live demos, code snippets and ready-made AI prompts for shipping VeChain dApps."
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />
                <link
                    rel="icon"
                    href={`${basePath}/images/logo.png`}
                    type="image/png"
                />
                <link
                    rel="apple-touch-icon"
                    sizes="57x57"
                    href={`${basePath}/images/favicon/apple-touch-icon.png`}
                />
                <meta
                    name="msapplication-TileImage"
                    content={`${basePath}/images/favicon/apple-touch-icon.png`}
                />

                {/* Open Graph Metadata */}
                <meta
                    name="title"
                    property="og:title"
                    content="VeKit Playground"
                />
                <meta name="type" property="og:type" content="website" />
                <meta
                    property="og:url"
                    content="https://playground.vechainkit.vechain.org/"
                />
                <meta
                    property="og:description"
                    content="VeKit Playground - Live demos, code snippets and ready-made AI prompts for shipping VeChain dApps."
                />
                <meta property="og:site_name" content="VeKit Playground" />
                <meta
                    property="og:image"
                    content="https://playground.vechainkit.vechain.org/images/banner-playground.png"
                />
                <meta property="og:image:type" content="image/png" />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="og:image:alt" content="VeKit Playground" />

                {/* Twitter Metadata */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="VeKit Playground" />
                <meta
                    name="twitter:description"
                    content="VeKit Playground - Live demos, code snippets and ready-made AI prompts for shipping VeChain dApps."
                />
                <meta
                    name="twitter:image"
                    content="https://playground.vechainkit.vechain.org/images/banner-playground.png"
                />
                <meta name="twitter:image:alt" content="VeKit Playground" />

                {/* Fonts */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap"
                    rel="stylesheet"
                />
                <link
                    href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body
                style={{
                    width: '100%',
                    height: '100%',
                }}
            >
                <ChakraProvider theme={darkTheme}>
                    <AppContent>{children}</AppContent>
                </ChakraProvider>
                <Script
                    src="https://app.agent.veworld.ai/embed.js"
                    data-handle="dan"
                    data-agent="8f6b1d2e-4e0c-489b-abf1-bc8be68bd58a"
                    data-embed-key="am_embed_0v9q4uNohBrxupBgveikJBUibN-s4vwpdN8Jc7NSpdY"
                    strategy="afterInteractive"
                />
            </body>
        </html>
    );
}
````

## Source: `examples/playground/src/app/page.tsx`

````tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Page() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/getting-started');
    }, [router]);

    return null;
}
````

## Source: `examples/playground/src/app/providers/VechainKitProviderWrapper.tsx`

````tsx
'use client';

import { useColorMode } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { resources } from '../../../i18n';
import i18n from '../../../i18n';

// Dynamic import is used here for several reasons:
// 1. The VechainKit component uses browser-specific APIs that aren't available during server-side rendering
// 2. Code splitting - this component will only be loaded when needed, reducing initial bundle size
// 3. The 'ssr: false' option ensures this component is only rendered on the client side
const VeChainKitProvider = dynamic(
    async () => (await import('@vechain/vechain-kit')).VeChainKitProvider,
    {
        ssr: false,
    },
);

interface Props {
    children: React.ReactNode;
}

function LanguageSync({ children }: Props) {
    useEffect(() => {
        // Sync playground i18n with VeChainKit language changes via localStorage
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'i18nextLng' && e.newValue) {
                const newLang = e.newValue;
                if (i18n.language !== newLang) {
                    i18n.changeLanguage(newLang);
                }
            }
        };

        // Listen to playground i18n changes (from dropdown) and ensure localStorage is updated
        const handleLanguageChanged = (lng: string) => {
            if (typeof window !== 'undefined') {
                const stored = localStorage.getItem('i18nextLng');
                if (stored !== lng) {
                    localStorage.setItem('i18nextLng', lng);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        i18n.on('languageChanged', handleLanguageChanged);

        // Poll for changes (in case storage event doesn't fire)
        const interval = setInterval(() => {
            const stored = localStorage.getItem('i18nextLng');
            if (stored && stored !== i18n.language) {
                i18n.changeLanguage(stored);
            }
        }, 500);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            i18n.off('languageChanged', handleLanguageChanged);
            clearInterval(interval);
        };
    }, []);

    return <>{children}</>;
}

export function VechainKitProviderWrapper({ children }: Props) {
    const { colorMode } = useColorMode();
    const isDarkMode = colorMode === 'dark';

    const logo =
        'https://vechain-brand-assets.s3.eu-north-1.amazonaws.com/VeChain_Logomark_Light.png';

    const [kitLanguage, setKitLanguage] = useState<string>(
        typeof window !== 'undefined'
            ? localStorage.getItem('i18nextLng') || 'en'
            : 'en',
    );

    useEffect(() => {
        // Sync VeChainKit language prop with localStorage changes
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'i18nextLng' && e.newValue) {
                setKitLanguage(e.newValue);
            }
        };

        const storedLanguage =
            typeof window !== 'undefined'
                ? localStorage.getItem('i18nextLng')
                : null;
        if (storedLanguage) {
            setKitLanguage(storedLanguage);
        }

        window.addEventListener('storage', handleStorageChange);

        // Poll for changes
        const interval = setInterval(() => {
            const stored = localStorage.getItem('i18nextLng');
            if (stored && stored !== kitLanguage) {
                setKitLanguage(stored);
            }
        }, 500);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(interval);
        };
    }, [kitLanguage]);

    // Transform resources to match I18n type (extract translation objects)
    const playgroundTranslations = Object.keys(resources).reduce(
        (acc, lang) => {
            acc[lang] = resources[lang as keyof typeof resources].translation;
            return acc;
        },
        {} as Record<string, Record<string, string>>,
    );

    const theme = isDarkMode
        ? {
              textColor: 'white',
              modal: {
                  backgroundColor: 'rgba(21, 21, 21)',
                  border: '1px solid rgba(255, 255, 255, 0.20)',
                  backdropFilter: 'blur(20px)',
                  rounded: '32px',
                  useBottomSheetOnMobile: true,
              },
              overlay: {
                  backgroundColor: 'rgba(0, 0, 0, 0.24)',
                  blur: 'blur(15px)',
              },
              buttons: {
                  secondaryButton: {
                      bg: 'rgb(255 255 255 / 4%)',
                      color: 'white',
                  },
              },
          }
        : {
              textColor: '#272A2E',
              modal: {
                  backgroundColor: 'rgba(255, 255, 255)',
                  border: '1px solid rgba(39, 42, 46, 0.12)',
                  backdropFilter: 'blur(20px)',
                  rounded: '32px',
                  useBottomSheetOnMobile: true,
              },
              overlay: {
                  backgroundColor: 'rgba(0, 0, 0, 0.16)',
                  blur: 'blur(15px)',
              },
              buttons: {
                  secondaryButton: {
                      bg: 'rgba(39, 42, 46, 0.08)',
                      color: '#272A2E',
                  },
                  loginButton: {
                      border: '1px solid rgba(39, 42, 46, 0.12)',
                  },
              },
          };

    return (
        <VeChainKitProvider
            theme={theme}
            language={kitLanguage}
            i18n={playgroundTranslations}
            // privy={{
            //     appId: process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
            //     clientId: process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID!,
            //     loginMethods: [
            //         'google',
            //         'apple',
            //         'twitter',
            //         'github',
            //         'farcaster',
            //         // 'email',
            //         'discord',
            //         'tiktok',
            //         // 'rabby_wallet',
            //         // 'coinbase_wallet',
            //         // 'rainbow',
            //         // 'metamask',
            //     ],
            //     appearance: {
            //         loginMessage: 'Select a login method',
            //         logo: logo,
            //     },
            //     embeddedWallets: {
            //         createOnLogin: 'all-users',
            //     },
            // }}

            dappKit={{
                allowedWallets: ['veworld', 'wallet-connect'],
                walletConnectOptions: {
                    projectId:
                        process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
                    metadata: {
                        name: 'VeChainKit Demo App',
                        description:
                            'This is a demo app to show you how the VechainKit works.',
                        url:
                            typeof window !== 'undefined'
                                ? window.location.origin
                                : '',
                        icons: [typeof window !== 'undefined' ? logo : ''],
                    },
                },
            }}
            loginMethods={[
                { method: 'veworld', gridColumn: 4 },
                { method: 'google', gridColumn: 4 },
                { method: 'apple', gridColumn: 4 },
                { method: 'more', gridColumn: 4 },
                // { method: 'vechain', gridColumn: 4 },
                // { method: 'github', gridColumn: 4 },
                // { method: 'dappkit', gridColumn: 4 },
                // { method: 'ecosystem', gridColumn: 4 },

                // { method: 'google', gridColumn: 4 },
                // { method: 'apple', gridColumn: 4 },
                // { method: 'passkey', gridColumn: 4 },
                // { method: 'more', gridColumn: 1 },
            ]}
            darkMode={isDarkMode}
            network={{
                type: 'main',
                // nodeUrl: 'http://localhost:8669',
            }}
            allowCustomTokens={true}
            // contractAddresses={{
            //     b3trContractAddress:
            //         '0x026771d1be764467f8bdb78bb230df10c924b00d',
            //     vot3ContractAddress:
            //         '0xf7a08af15cb3501feee53ebe11f4428a966fa459',
            // }}
            // feeDelegation={{
            //     delegatorUrl: process.env.NEXT_PUBLIC_DELEGATOR_URL!,
            // }}
        >
            <LanguageSync>{children}</LanguageSync>
        </VeChainKitProvider>
    );
}
````

## Source: `examples/playground/src/app/theme/button.ts`

````typescript
import { ComponentStyleConfig } from '@chakra-ui/react';

export const ButtonStyle: ComponentStyleConfig = {
    // style object for base or default style
    baseStyle: {},
    // styles for different sizes ("sm", "md", "lg")
    sizes: {},
    // styles for different visual variants ("outline", "solid")
    variants: {
        primarySubtle: {
            bg: 'rgba(224, 233, 254, 1)',
            color: 'primary.500',
            _hover: {
                bg: 'rgba(224, 233, 254, 0.8)',
            },
        },
        testVariant: {
            bg: 'primary.300',
            color: 'white',
        },
    },
    // default values for 'size', 'variant' and 'colorScheme'
    defaultProps: {
        size: 'md',
        rounded: 'full',
        variant: 'solid',
    },
};
````

## Source: `examples/playground/src/app/theme/card.ts`

````typescript
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';
import { cardAnatomy } from '@chakra-ui/anatomy';

const { definePartsStyle, defineMultiStyleConfig } =
    createMultiStyleConfigHelpers(cardAnatomy.keys);

// define custom styles for funky variant
const variants = {
    base: () =>
        definePartsStyle({
            container: {
                bg: '#FFF',
                borderWidth: '0px',
                borderColor: 'transparent',
            },
        }),
    filled: () =>
        definePartsStyle({
            container: {
                bg: '#FAFAFA',
            },
        }),
    baseWithBorder: () =>
        definePartsStyle({
            container: {
                bg: '#FFF',
                borderWidth: '1px',
                borderColor: 'gray.100',
            },
        }),
    secondaryBoxShadow: () =>
        definePartsStyle({
            container: {
                boxShadow: '0px 0px 1px 1px #00000017',
                bg: '#FFF',
                borderWidth: '1px',
                borderColor: 'gray.100',
            },
        }),
    articles: () =>
        definePartsStyle({
            container: {
                boxShadow: '0px 0px 1px 1px #00000017',
            },
        }),
};

// export variants in the component theme
export const cardTheme = defineMultiStyleConfig({
    variants,
    defaultProps: {
        variant: 'base', // default is solid
    },
});
````

## Source: `examples/playground/src/app/theme/colors.ts`

````typescript
export const lightPrimary = {
    '50': '#f0f9fe',
    '100': '#e1f3fd',
    '200': '#c3e7fb',
    '300': '#85d1f9',
    '400': '#4cbdf7',
    '500': '#23a9f6',
    '600': '#0d8bd4',
    '700': '#0b6ca6',
    '800': '#0a5178',
    '900': '#08354a',
    active: '#4cbdf7',
};

export const lightSecondary = {
    '50': '#ffffff',
    '100': '#F9F9FA',
    '200': '#e8e8ea',
    '300': '#d7d7da',
    '400': '#c6c6ca',
    '500': '#b5b5ba',
    '600': '#a4a4aa',
    '700': '#93939a',
    '800': '#82828a',
    '900': '#71717a',
};

export const lightTertiary = {
    100: '#e0f7fc',
    200: '#c2eff9',
    300: '#a3e7f6',
    400: '#85dff3',
    500: '#66d7f0',
    600: '#47cfed',
    700: '#29c7ea',
    800: '#0abfe7',
    900: '#00b7e0',
};

export const themeColors = {
    primary: lightPrimary,
    secondary: lightSecondary,
    tertiary: lightTertiary,
};
````

## Source: `examples/playground/src/app/theme/index.ts`

````typescript
export * from "./theme";
````

## Source: `examples/playground/src/app/theme/modal.ts`

````typescript
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } =
    createMultiStyleConfigHelpers(['modal']);

// define custom styles for funky variant
const variants = {
    base: definePartsStyle({}),
};

// export variants in the component theme
export const modalTheme = defineMultiStyleConfig({
    variants,
    defaultProps: {
        variant: 'base',
    },
});
````

## Source: `examples/playground/src/app/theme/theme.tsx`

````tsx
import { extendTheme } from '@chakra-ui/react';
import { cardTheme } from './card';
import { ButtonStyle } from './button';
import { modalTheme } from './modal';
import { themeColors } from './colors';

const exampleTheme = {
    components: {
        Card: cardTheme,
        Button: ButtonStyle,
        Modal: modalTheme,
    },

    borderRadius: {
        card: '16px',
        button: '24px',
    },
    shadows: {
        card: '0px 2px 8px rgba(0, 0, 0, 0.05)',
    },
    //@ts-ignore
    fonts: {
        heading: `"Satoshi", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`,
        body: `"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`,
    },
};

export const darkTheme = extendTheme({
    ...exampleTheme,
    config: {
        initialColorMode: 'dark',
        useSystemColorMode: false,
        cssVarPrefix: 'example',
    },
    colors: themeColors,
});
````

## Source: `examples/test-tailwind-vck/src/app/globals.css`

````css
/* Define CSS layers with VeChain Kit having lower priority */
@layer vechain-kit, host-app;

/* Import Tailwind CSS */
@import "tailwindcss";

/* Host app custom styles in their own layer for priority */
@layer host-app {
    /* Use a very distinctive font to make it obvious if VeChain Kit overrides it */
    body {
        font-family: 'Comic Sans MS', 'Chalkboard SE', 'Marker Felt', cursive;
        font-weight: bold;
    }

    /* Make headings even more distinctive */
    h1, h2, h3, h4, h5, h6 {
        font-family: 'Papyrus', 'Bradley Hand', fantasy;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
    }
}
````

## Source: `examples/test-tailwind-vck/src/app/layout.tsx`

````tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
````

## Source: `examples/test-tailwind-vck/src/app/page.tsx`

````tsx
'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { VeChainKitProvider, WalletButton } from '@vechain/vechain-kit';

export default function ImageUploadApp() {
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [imageInfo, setImageInfo] = useState<{
        name: string;
        size: string;
        type: string;
    } | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (file: File) => {
        if (file && file.type.startsWith('image/')) {
            const url = URL.createObjectURL(file);
            setUploadedImage(url);
            setImageInfo({
                name: file.name,
                size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
                type: file.type,
            });
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleImageUpload(file);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            handleImageUpload(file);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const clearImage = () => {
        if (uploadedImage) {
            URL.revokeObjectURL(uploadedImage);
        }
        setUploadedImage(null);
        setImageInfo(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <VeChainKitProvider
            feeDelegation={{
                delegatorUrl: process.env.NEXT_PUBLIC_DELEGATOR_URL!,
            }}
            dappKit={{
                allowedWallets: ['veworld', 'wallet-connect', 'sync2'],
                walletConnectOptions: {
                    projectId:
                        process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
                    metadata: {
                        name: 'VeChainKit Demo App',
                        description:
                            'This is a demo app to show you how the VechainKit works.',
                        url:
                            typeof window !== 'undefined'
                                ? window.location.origin
                                : '',
                        icons: [
                            typeof window !== 'undefined'
                                ? 'https://i.ibb.co/7G4PQNZ/vechain-kit-logo-colored-circle.png'
                                : '',
                        ],
                    },
                },
            }}
            loginMethods={[
                // { method: 'email', gridColumn: 4 },
                // { method: 'google', gridColumn: 4 },
                { method: 'vechain', gridColumn: 4 },
                { method: 'dappkit', gridColumn: 4 },
                { method: 'ecosystem', gridColumn: 4 },
                // { method: 'passkey', gridColumn: 1 },
                // { method: 'more', gridColumn: 1 },
            ]}
            loginModalUI={{
                description:
                    'Choose between social login through VeChain or by connecting your wallet.',
            }}
            darkMode={false}
            language={'en'}
            network={{
                type: process.env.NEXT_PUBLIC_NETWORK_TYPE,
            }}
            allowCustomTokens={true}
            legalDocuments={{
                termsAndConditions: [
                    {
                        url: 'https://vechainkit.vechain.org/terms',
                        version: 1,
                        required: true,
                        displayName: 'Example T&C',
                    },
                ],
            }}
        >
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="container mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            Image Upload Demo
                        </h1>
                        <p className="text-gray-600">
                            Test Tailwind CSS with vechain-kit integration
                        </p>

                        {/* vechain-kit Integration Test */}
                        <div className="flex justify-center gap-4 items-center mb-4">
                            <WalletButton />
                            <span className="text-sm text-gray-500">
                                ← vechain-kit component
                            </span>
                        </div>

                        {/* Link to style test */}
                        <div className="text-center">
                            <a
                                href="/style-test"
                                className="text-blue-600 hover:text-blue-700 underline text-sm"
                            >
                                View comprehensive style test →
                            </a>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="max-w-2xl mx-auto">
                        {/* Upload Area */}
                        <div
                            className={`
              border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
              ${
                  isDragging
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
              }
            `}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                        >
                            <div className="space-y-4">
                                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                    <svg
                                        className="w-8 h-8 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                        />
                                    </svg>
                                </div>

                                <div>
                                    <p className="text-lg font-semibold text-gray-900">
                                        Drop your image here
                                    </p>
                                    <p className="text-gray-500">or</p>
                                </div>

                                <button
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                                >
                                    Choose File
                                </button>

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />

                                <p className="text-sm text-gray-400">
                                    Supports: JPG, PNG, GIF, WebP
                                </p>
                            </div>
                        </div>

                        {/* Image Preview */}
                        {uploadedImage && (
                            <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Preview
                                    </h3>
                                    <button
                                        onClick={clearImage}
                                        className="text-red-600 hover:text-red-700 font-medium"
                                    >
                                        Clear
                                    </button>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden border-4 border-purple-500">
                                            <Image
                                                src={uploadedImage}
                                                alt="Uploaded preview"
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h4 className="font-medium text-gray-900">
                                            File Info
                                        </h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">
                                                    Name:
                                                </span>
                                                <span className="font-medium text-gray-900 truncate ml-2">
                                                    {imageInfo?.name}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">
                                                    Size:
                                                </span>
                                                <span className="font-medium text-gray-900">
                                                    {imageInfo?.size}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">
                                                    Type:
                                                </span>
                                                <span className="font-medium text-gray-900">
                                                    {imageInfo?.type}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="pt-4">
                                            <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
                                                Save to Gallery
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Feature Cards */}
                        <div className="grid md:grid-cols-3 gap-4 mt-8">
                            <div className="bg-white rounded-lg p-4 shadow-md">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                                    <svg
                                        className="w-5 h-5 text-blue-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-1">
                                    Drag & Drop
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Easy file upload with drag and drop support
                                </p>
                            </div>

                            <div className="bg-white rounded-lg p-4 shadow-md">
                                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                                    <svg
                                        className="w-5 h-5 text-green-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13 10V3L4 14h7v7l9-11h-7z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-1">
                                    Fast Preview
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Instant image preview and file information
                                </p>
                            </div>

                            <div className="bg-white rounded-lg p-4 shadow-md">
                                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                                    <svg
                                        className="w-5 h-5 text-purple-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-1">
                                    Multiple Formats
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Support for JPG, PNG, GIF, and WebP
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </VeChainKitProvider>
    );
}
````

## Source: `examples/test-tailwind-vck/src/app/style-test.tsx`

````tsx
'use client';
import { WalletButton } from '@vechain/vechain-kit';
import { useEffect, useState } from 'react';
export default function StyleTest() {
    const [testResults, setTestResults] = useState<{
        tailwindStyles: { [key: string]: string };
        imageStyles: { [key: string]: string };
        layerAnalysis: string[];
        conflictStatus: 'good' | 'warning' | 'error';
    }>({
        tailwindStyles: {},
        imageStyles: {},
        layerAnalysis: [],
        conflictStatus: 'good',
    });
    useEffect(() => {
        const runStyleTests = () => {
            const analysis: string[] = [];
            let conflictStatus: 'good' | 'warning' | 'error' = 'good';
            // Test 1: Check if CSS layers are defined correctly
            const stylesheets = Array.from(document.styleSheets);
            let layersFound = false;
            let hostAppLayerFound = false;
            stylesheets.forEach((sheet) => {
                try {
                    const rules = Array.from(sheet.cssRules || []);
                    rules.forEach((rule) => {
                        const ruleText = rule.cssText;

                        // Check for layer definitions
                        if (ruleText.includes('@layer vechain-kit, host-app')) {
                            layersFound = true;
                            analysis.push('✅ CSS layers defined correctly');
                        }

                        if (
                            ruleText.includes('@layer host-app') &&
                            ruleText.includes('@tailwind')
                        ) {
                            hostAppLayerFound = true;
                            analysis.push(
                                '✅ Tailwind CSS wrapped in host-app layer',
                            );
                        }

                        // Check for VeChain Kit styles in correct layer
                        if (
                            ruleText.includes('vechain-kit') &&
                            !ruleText.includes('@layer host-app')
                        ) {
                            // VeChain Kit styles detected in correct layer
                        }

                        // Check for problematic global styles
                        if (
                            ruleText.includes('body {') &&
                            ruleText.includes('font-family') &&
                            ruleText.includes('var(--chakra') &&
                            !ruleText.includes('@layer')
                        ) {
                            analysis.push(
                                '⚠️ Found Chakra body styles outside layer system',
                            );
                            conflictStatus = 'warning';
                        }
                    });
                } catch {
                    // Cross-origin stylesheets
                }
            });
            if (!layersFound) {
                analysis.push('❌ CSS layers not properly defined');
                conflictStatus = 'error';
            }

            if (!hostAppLayerFound) {
                analysis.push('❌ Tailwind not wrapped in host-app layer');
                conflictStatus = 'error';
            }
            // Test 2: Check actual computed styles
            const body = document.body;
            const bodyStyles = window.getComputedStyle(body);

            const testImg = document.querySelector(
                '[data-test="border-test"]',
            ) as HTMLElement;
            const imgStyles = testImg ? window.getComputedStyle(testImg) : null;

            const gradientDiv = document.querySelector(
                '[data-test="gradient-test"]',
            ) as HTMLElement;
            const gradientStyles = gradientDiv
                ? window.getComputedStyle(gradientDiv)
                : null;
            // Test 3: Font family should be controlled by host app
            const fontFamily = bodyStyles.fontFamily;
            if (
                fontFamily.includes('Arial') ||
                fontFamily.includes('system-ui')
            ) {
                analysis.push('✅ Host app font family preserved');
            } else if (fontFamily.includes('var(--chakra')) {
                analysis.push('❌ Chakra font variables overriding host app');
                conflictStatus = 'error';
            }
            // Test 4: Image borders should work correctly
            if (imgStyles && imgStyles.borderStyle === 'solid') {
                analysis.push('✅ Image border styles working correctly');
            } else {
                analysis.push('⚠️ Image border styles might be affected');
                conflictStatus = 'warning';
            }

            // Test 5: Tailwind gradients should work
            if (
                gradientStyles &&
                gradientStyles.backgroundImage.includes('gradient')
            ) {
                analysis.push('✅ Tailwind gradients working correctly');
            } else {
                analysis.push('❌ Tailwind gradients not working');
                conflictStatus = 'error';
            }

            setTestResults({
                tailwindStyles: {
                    fontFamily: bodyStyles.fontFamily,
                    backgroundColor: bodyStyles.backgroundColor,
                    color: bodyStyles.color,
                },
                imageStyles: imgStyles
                    ? {
                          borderStyle: imgStyles.borderStyle,
                          borderWidth: imgStyles.borderWidth,
                          borderColor: imgStyles.borderColor,
                      }
                    : {},
                layerAnalysis: analysis,
                conflictStatus,
            });
        };

        // Run tests after a delay to ensure all styles are loaded
        const timer = setTimeout(runStyleTests, 2000);
        return () => clearTimeout(timer);
    }, []);

    const statusColor = {
        good: 'border-green-500 bg-green-50',
        warning: 'border-yellow-500 bg-yellow-50',
        error: 'border-red-500 bg-red-50',
    }[testResults.conflictStatus];

    const statusIcon = {
        good: '✅',
        warning: '⚠️',
        error: '❌',
    }[testResults.conflictStatus];
    const statusText = {
        good: 'All tests passed! CSS layers working correctly.',
        warning: 'Some minor issues detected.',
        error: 'Style conflicts detected!',
    }[testResults.conflictStatus];

    return (
        <div
            className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100"
            data-test="gradient-test"
        >
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
                    VeChain KTailwind CSS Integration Test
                </h1>

                {/* Status Summary */}
                <div className={`border-2 rounded-lg p-6 mb-8 ${statusColor}`}>
                    <h2 className="text-2xl font-bold mb-4">
                        {statusIcon} Test Results: {statusText}
                    </h2>

                    <div className="space-y-2">
                        {testResults.layerAnalysis.map((result, index) => (
                            <div key={index} className="text-sm font-mono">
                                {result}
                            </div>
                        ))}
                    </div>
                </div>
                {/* Visual Tests */}
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-xl font-bold mb-4">
                            Tailwind Components
                        </h3>
                        <div className="space-y-4">
                            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-lg">
                                Gradient Background (should work)
                            </div>

                            <img
                                data-test="border-test"
                                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100'
fill='%23e5e7eb'/%3E%3C/svg%3E"
                                alt="Border test"
                                className="border-4 border-blue-500 rounded"
                                style={{ width: '100px', height: '100px' }}
                            />
                            <p className="text-sm text-gray-600">
                                Image with Tailwind border (should show blue
                                border)
                            </p>

                            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors">
                                Tailwind Button
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-xl font-bold mb-4">
                            VeChain Kit Components
                        </h3>
                        <div className="space-y-4">
                            <WalletButton />
                            <p className="text-sm text-gray-600">
                                VeChain Kit wallet button (should not affect
                                Tailwind styles)
                            </p>
                        </div>
                    </div>
                </div>

                {/* Technical Details */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gray-800 text-white rounded-lg p-6">
                        <h3 className="text-lg font-bold mb-3">
                            Body Computed Styles
                        </h3>
                        <pre className="text-xs overflow-auto">
                            {JSON.stringify(
                                testResults.tailwindStyles,
                                null,
                                2,
                            )}
                        </pre>
                    </div>

                    <div className="bg-gray-800 text-white rounded-lg p-6">
                        <h3 className="text-lg font-bold mb-3">
                            Image Computed Styles
                        </h3>
                        <pre className="text-xs overflow-auto">
                            {JSON.stringify(testResults.imageStyles, null, 2)}
                        </pre>
                    </div>
                </div>
                {/* Instructions */}
                <div className="bg-blue-100 border border-blue-300 rounded-lg p-6 mt-8">
                    <h3 className="text-lg font-bold mb-3">
                        How to Verify Success:
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-sm">
                        <li>
                            The gradient background should be visible (blue to
                            indigo)
                        </li>
                        <li>The test image should have a solid blue border</li>
                        <li>
                            The VeChain Kit wallet button should render properly
                        </li>
                        <li>
                            Font family should be Arial or system-ui (not Chakra
                            fonts)
                        </li>
                        <li>
                            All test results above should show ✅ (green
                            checkmarks)
                        </li>
                        <li>
                            No ❌ (red X) or excessive ⚠️ (warnings) should
                            appear
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
````

## Source: `examples/test-tailwind-vck/src/app/style-test/page.tsx`

````tsx
'use client';

import { VeChainKitProvider, WalletButton } from '@vechain/vechain-kit';
import { useEffect, useState } from 'react';

function StyleTestContent() {
    const [testResults, setTestResults] = useState<{
        tailwindStyles: { [key: string]: string };
        imageStyles: { [key: string]: string };
        layerAnalysis: string[];
        conflictStatus: 'good' | 'warning' | 'error';
    }>({
        tailwindStyles: {},
        imageStyles: {},
        layerAnalysis: [],
        conflictStatus: 'good',
    });

    useEffect(() => {
        const runStyleTests = () => {
            const analysis: string[] = [];
            let conflictStatus: 'good' | 'warning' | 'error' = 'good';

            // Test 1: Check if CSS layers are defined correctly
            const stylesheets = Array.from(document.styleSheets);
            let layersFound = false;
            let hostAppLayerFound = false;

            stylesheets.forEach((sheet) => {
                try {
                    const rules = Array.from(sheet.cssRules || []);
                    rules.forEach((rule) => {
                        const ruleText = rule.cssText;

                        // Check for layer definitions
                        if (ruleText.includes('@layer vechain-kit, host-app')) {
                            layersFound = true;
                            analysis.push('✅ CSS layers defined correctly');
                        }

                        if (
                            ruleText.includes('@layer host-app') &&
                            (ruleText.includes('@tailwind') ||
                                ruleText.includes('@import "tailwindcss"') ||
                                ruleText.includes('tailwindcss'))
                        ) {
                            hostAppLayerFound = true;
                            analysis.push(
                                '✅ Tailwind CSS wrapped in host-app layer',
                            );
                        }

                        // Also check if we're inside a host-app layer context
                        if (
                            ruleText.includes('@layer host-app') &&
                            ruleText.includes('body')
                        ) {
                            hostAppLayerFound = true;
                        }

                        // Check for vechain-kit styles in correct layer
                        if (
                            ruleText.includes('vechain-kit') &&
                            !ruleText.includes('@layer host-app')
                        ) {
                            // vechain-kit styles detected in correct layer
                        }
                        // problematic global styles
                        if (
                            ruleText.includes('body {') &&
                            ruleText.includes('font-family') &&
                            ruleText.includes('var(--chakra') &&
                            !ruleText.includes('@layer')
                        ) {
                            analysis.push(
                                '⚠️ Found Chakra body styles outside layer system',
                            );
                            conflictStatus = 'warning';
                        }
                    });
                } catch (e: any) {
                    // cross-origin stylesheets
                }
            });

            if (!layersFound) {
                analysis.push('❌ CSS layers not properly defined');
                conflictStatus = 'error';
            }

            // For Tailwind v4, we just need to ensure layers are defined and styles work
            if (!hostAppLayerFound && layersFound) {
                // Check if Tailwind styles are actually working
                const testElement =
                    document.querySelector('.bg-gradient-to-br');
                if (testElement) {
                    analysis.push(
                        '✅ Tailwind CSS v4 working with layer system',
                    );
                    hostAppLayerFound = true;
                }
            }

            if (!hostAppLayerFound) {
                analysis.push('❌ Tailwind not wrapped in host-app layer');
                conflictStatus = 'error';
            }

            // Test 2: Check actual computed styles
            const body = document.body;
            const bodyStyles = window.getComputedStyle(body);

            const testImg = document.querySelector(
                '[data-test="border-test"]',
            ) as HTMLElement;
            const imgStyles = testImg ? window.getComputedStyle(testImg) : null;

            const gradientDiv = document.querySelector(
                '[data-test="gradient-test"]',
            ) as HTMLElement;
            const gradientStyles = gradientDiv
                ? window.getComputedStyle(gradientDiv)
                : null;

            // Test 3: Font family should be controlled by host app
            const fontFamily = bodyStyles.fontFamily;
            if (
                fontFamily.includes('Arial') ||
                fontFamily.includes('system-ui')
            ) {
                analysis.push('✅ Host app font family preserved');
            } else if (fontFamily.includes('var(--chakra')) {
                analysis.push('❌ Chakra font variables overriding host app');
                conflictStatus = 'error';
            }

            // Test 4: Image borders should work correctly
            if (imgStyles && imgStyles.borderStyle === 'solid') {
                analysis.push('✅ Image border styles working correctly');
            } else {
                analysis.push('⚠️ Image border styles might be affected');
                conflictStatus = 'warning';
            }

            // Test 5: Tailwind gradients should work
            if (
                gradientStyles &&
                gradientStyles.backgroundImage.includes('gradient')
            ) {
                analysis.push('✅ Tailwind gradients working correctly');
            } else {
                analysis.push('❌ Tailwind gradients not working');
                conflictStatus = 'error';
            }

            setTestResults({
                tailwindStyles: {
                    fontFamily: bodyStyles.fontFamily,
                    backgroundColor: bodyStyles.backgroundColor,
                    color: bodyStyles.color,
                },
                imageStyles: imgStyles
                    ? {
                          borderStyle: imgStyles.borderStyle,
                          borderWidth: imgStyles.borderWidth,
                          borderColor: imgStyles.borderColor,
                      }
                    : {},
                layerAnalysis: analysis,
                conflictStatus,
            });
        };

        // Run tests after a delay to ensure all styles are loaded
        const timer = setTimeout(runStyleTests, 2000);
        return () => clearTimeout(timer);
    }, []);

    const statusColor = {
        good: 'border-green-500 bg-green-50',
        warning: 'border-yellow-500 bg-yellow-50',
        error: 'border-red-500 bg-red-50',
    }[testResults.conflictStatus];

    const statusIcon = {
        good: '✅',
        warning: '⚠️',
        error: '❌',
    }[testResults.conflictStatus];

    const statusText = {
        good: 'All tests passed! CSS layers working correctly.',
        warning: 'Some minor issues detected.',
        error: 'Style conflicts detected!',
    }[testResults.conflictStatus];

    return (
        <div
            className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100"
            data-test="gradient-test"
        >
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
                    vechain-kit + Tailwind CSS Integration Test
                </h1>

                {/* Status Summary */}
                <div className={`border-2 rounded-lg p-6 mb-8 ${statusColor}`}>
                    <h2 className="text-2xl font-bold mb-4">
                        {statusIcon} Test Results: {statusText}
                    </h2>

                    <div className="space-y-2">
                        {testResults.layerAnalysis.map((result, index) => (
                            <div key={index} className="text-sm font-mono">
                                {result}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Visual Tests */}
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-xl font-bold mb-4">
                            Tailwind Components
                        </h3>
                        <div className="space-y-4">
                            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-lg">
                                Gradient Background (should work)
                            </div>

                            <img
                                data-test="border-test"
                                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23e5e7eb'/%3E%3C/svg%3E"
                                alt="Border test"
                                className="border-4 border-red-500 rounded"
                                style={{ width: '100px', height: '100px' }}
                            />
                            <p className="text-sm text-gray-600">
                                Image with Tailwind border (should show red
                                border)
                            </p>

                            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors">
                                Tailwind Button
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-xl font-bold mb-4">
                            vechain-kit Components
                        </h3>
                        <div className="space-y-4">
                            <WalletButton />
                            <p className="text-sm text-gray-600">
                                vechain-kit wallet button (should not affect
                                Tailwind styles)
                            </p>
                        </div>
                    </div>
                </div>

                {/* Technical Details */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gray-800 text-white rounded-lg p-6">
                        <h3 className="text-lg font-bold mb-3">
                            Body Computed Styles
                        </h3>
                        <pre className="text-xs overflow-auto">
                            {JSON.stringify(
                                testResults.tailwindStyles,
                                null,
                                2,
                            )}
                        </pre>
                    </div>

                    <div className="bg-gray-800 text-white rounded-lg p-6">
                        <h3 className="text-lg font-bold mb-3">
                            Image Computed Styles
                        </h3>
                        <pre className="text-xs overflow-auto">
                            {JSON.stringify(testResults.imageStyles, null, 2)}
                        </pre>
                    </div>
                </div>

                {/* Instructions */}
                <div className="bg-blue-100 border border-blue-300 rounded-lg p-6 mt-8">
                    <h3 className="text-lg font-bold mb-3">
                        How to Verify Success:
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-sm">
                        <li>
                            The gradient background should be visible (blue to
                            indigo)
                        </li>
                        <li>The test image should have a solid blue border</li>
                        <li>
                            The vechain-kit wallet button should render properly
                        </li>
                        <li>
                            Font family should be Arial or system-ui (not Chakra
                            fonts)
                        </li>
                        <li>
                            All test results above should show ✅ (green
                            checkmarks)
                        </li>
                        <li>
                            No ❌ (red X) or excessive ⚠️ (warnings) should
                            appear
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default function StyleTest() {
    return (
        <VeChainKitProvider
            feeDelegation={{
                delegatorUrl: process.env.NEXT_PUBLIC_DELEGATOR_URL!,
            }}
            dappKit={{
                allowedWallets: ['veworld', 'wallet-connect', 'sync2'],
                walletConnectOptions: {
                    projectId:
                        process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
                    metadata: {
                        name: 'VeChainKit Demo App',
                        description:
                            'This is a demo app to show you how the VechainKit works.',
                        url:
                            typeof window !== 'undefined'
                                ? window.location.origin
                                : '',
                        icons: [
                            typeof window !== 'undefined'
                                ? 'https://i.ibb.co/7G4PQNZ/vechain-kit-logo-colored-circle.png'
                                : '',
                        ],
                    },
                },
            }}
            loginMethods={[
                { method: 'vechain', gridColumn: 4 },
                { method: 'dappkit', gridColumn: 4 },
                { method: 'ecosystem', gridColumn: 4 },
            ]}
            loginModalUI={{
                description:
                    'Choose between social login through VeChain or by connecting your wallet.',
            }}
            darkMode={false}
            language={'en'}
            network={{
                type: process.env.NEXT_PUBLIC_NETWORK_TYPE,
            }}
            allowCustomTokens={true}
            legalDocuments={{
                termsAndConditions: [
                    {
                        url: 'https://vechainkit.vechain.org/terms',
                        version: 1,
                        required: true,
                        displayName: 'Example T&C',
                    },
                ],
            }}
        >
            <StyleTestContent />
        </VeChainKitProvider>
    );
}
````
