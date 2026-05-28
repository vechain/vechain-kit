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
