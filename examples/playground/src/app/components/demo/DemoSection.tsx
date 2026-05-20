'use client';

import {
    Box,
    Heading,
    HStack,
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
import { useTranslation } from 'react-i18next';
import { CodeBlock } from './CodeBlock';
import { HookBadge } from './HookBadge';
import { Status, StatusBadge } from './StatusBadge';

interface DemoSectionProps {
    title: string;
    description?: string;
    hooks?: string[];
    status?: Status;
    code?: string;
    codeLanguage?: string;
    children?: ReactNode;
}

export function DemoSection({
    title,
    description,
    hooks = [],
    status,
    code,
    codeLanguage = 'tsx',
    children,
}: DemoSectionProps) {
    const { colorMode } = useColorMode();
    const { t } = useTranslation();

    const hasCode = Boolean(code);

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
                borderBottomWidth={hasCode || children ? '1px' : 0}
                borderBottomColor={
                    colorMode === 'light' ? 'gray.100' : 'whiteAlpha.100'
                }
            >
                <HStack justify="space-between" align="flex-start" flexWrap="wrap" spacing={3}>
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

            {children && hasCode ? (
                <Tabs
                    variant="line"
                    colorScheme="blue"
                    size="sm"
                    isLazy
                >
                    <TabList px={{ base: 2, md: 4 }}>
                        <Tab fontWeight="medium">{t('Live demo')}</Tab>
                        <Tab fontWeight="medium">{t('View code')}</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel p={{ base: 4, md: 6 }}>{children}</TabPanel>
                        <TabPanel p={{ base: 3, md: 4 }}>
                            <CodeBlock code={code!} language={codeLanguage} />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            ) : children ? (
                <Box p={{ base: 4, md: 6 }}>{children}</Box>
            ) : hasCode ? (
                <Box p={{ base: 3, md: 4 }}>
                    <CodeBlock code={code!} language={codeLanguage} />
                </Box>
            ) : null}
        </Box>
    );
}
