'use client';

import { Box, Image, Stack, Text } from '@chakra-ui/react';
import { RequesterChip } from './RequesterChip';

type Props = {
    title?: string;
    subtitle?: string;
    /**
     * Requester dApp's callbackUrl. When provided, renders a chip with the
     * site's favicon + hostname under the title to identify who's asking
     * to connect.
     */
    requesterUrl?: string;
};

export function VechainHeader({
    title = 'Log in to VeChain',
    subtitle,
    requesterUrl,
}: Props) {
    // Render BOTH wordmarks and toggle via Chakra's _light / _dark CSS
    // pseudo selectors. Avoids the React-state flicker we'd get if we
    // picked the src from useColorMode() (SSR default vs client value).
    return (
        <Stack spacing={4} align="center" pt={6} pb={2}>
            <Box height="32px" display="flex" alignItems="center">
                <Image
                    src="/brand/vechain-wordmark-dark.svg"
                    alt="VeChain"
                    height="32px"
                    width="auto"
                    draggable={false}
                    sx={{
                        _light: { display: 'block' },
                        _dark: { display: 'none' },
                    }}
                />
                <Image
                    src="/brand/vechain-wordmark-light.svg"
                    alt="VeChain"
                    height="32px"
                    width="auto"
                    draggable={false}
                    sx={{
                        _light: { display: 'none' },
                        _dark: { display: 'block' },
                    }}
                />
            </Box>
            <Stack spacing={2} align="center" textAlign="center" maxW="sm">
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
                {requesterUrl && <RequesterChip url={requesterUrl} />}
            </Stack>
        </Stack>
    );
}
