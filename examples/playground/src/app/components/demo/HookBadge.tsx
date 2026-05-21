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
