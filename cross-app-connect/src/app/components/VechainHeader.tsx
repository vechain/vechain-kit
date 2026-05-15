'use client';

import { Image, Stack, Text, useColorMode } from '@chakra-ui/react';

type Props = {
    title?: string;
    subtitle?: string;
};

export function VechainHeader({
    title = 'Log in to VeChain',
    subtitle,
}: Props) {
    const { colorMode } = useColorMode();
    // Light wordmark on dark surfaces, dark wordmark on light surfaces.
    const src =
        colorMode === 'dark'
            ? '/brand/vechain-wordmark-light.svg'
            : '/brand/vechain-wordmark-dark.svg';

    return (
        <Stack spacing={4} align="center" pt={6} pb={2}>
            <Image
                src={src}
                alt="VeChain"
                height="32px"
                width="auto"
                draggable={false}
            />
            <Stack spacing={1} align="center" textAlign="center" maxW="sm">
                <Text
                    fontFamily="heading"
                    fontWeight={600}
                    fontSize="lg"
                    color="text-strong"
                >
                    {title}
                </Text>
                {subtitle && (
                    <Text fontSize="sm" color="text-muted">
                        {subtitle}
                    </Text>
                )}
            </Stack>
        </Stack>
    );
}
