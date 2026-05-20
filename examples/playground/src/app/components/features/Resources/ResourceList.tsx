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
