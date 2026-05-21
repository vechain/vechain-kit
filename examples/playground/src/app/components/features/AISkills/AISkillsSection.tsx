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
