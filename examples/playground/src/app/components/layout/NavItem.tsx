'use client';

import { HStack, Icon, Text, useColorMode } from '@chakra-ui/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { IconType } from 'react-icons';
import { useTranslation } from 'react-i18next';

interface NavItemProps {
    href: string;
    icon: IconType;
    label: string;
    onSelect?: () => void;
}

export function NavItem({ href, icon, label, onSelect }: NavItemProps) {
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
                <Text fontSize="sm">{t(label)}</Text>
            </HStack>
        </Link>
    );
}
