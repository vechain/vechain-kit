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
