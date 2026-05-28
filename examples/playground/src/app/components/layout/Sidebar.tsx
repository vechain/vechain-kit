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
