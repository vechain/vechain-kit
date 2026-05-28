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
