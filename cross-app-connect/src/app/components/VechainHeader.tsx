'use client';

import { Box, HStack, Icon, Image, Stack, Text } from '@chakra-ui/react';
import type { IconType } from 'react-icons';
import { RequesterChip } from './RequesterChip';

type Props = {
    title?: string;
    /**
     * Optional icon rendered alongside the title. Used on the transact
     * screen to anchor a security framing (LuShieldCheck / LuShieldAlert /
     * LuShieldX depending on risk).
     */
    titleIcon?: IconType;
    /**
     * Color token for the title icon. Defaults to 'accent'. The transact
     * screen passes 'orange.400' / 'red.400' on cautioned / dangerous
     * transactions so the icon swaps in tandem with the verb.
     */
    titleIconColor?: string;
    subtitle?: string;
    /**
     * Requester dApp's callbackUrl. When provided, renders a chip with the
     * site's favicon + hostname under the title to identify who's asking
     * to connect.
     */
    requesterUrl?: string;
};

export function VechainHeader({
    title = 'Log in to your wallet',
    titleIcon,
    titleIconColor = 'accent',
    subtitle,
    requesterUrl,
}: Props) {
    // Render BOTH logomarks and toggle via Chakra's _light / _dark CSS
    // pseudo selectors. Avoids the React-state flicker we'd get if we
    // picked the src from useColorMode() (SSR default vs client value).
    return (
        <Stack spacing={4} align="center" pt={6} pb={2}>
            <Box boxSize="48px" display="flex" alignItems="center">
                <Image
                    src="/brand/vechain-logomark-light.png"
                    alt="VeChain"
                    boxSize="48px"
                    draggable={false}
                />
            </Box>
            <Stack spacing={2} align="center" textAlign="center" maxW="sm">
                <HStack spacing={2} align="center">
                    {titleIcon && (
                        <Icon
                            as={titleIcon}
                            color={titleIconColor}
                            boxSize="18px"
                            aria-hidden
                        />
                    )}
                    <Text
                        fontFamily="heading"
                        fontWeight={600}
                        fontSize="2xl"
                        color="text-strong"
                    >
                        {title}
                    </Text>
                </HStack>

                {subtitle && (
                    <Text fontSize="lg" color="text-muted">
                        {subtitle}
                    </Text>
                )}

                {requesterUrl && <RequesterChip url={requesterUrl} />}
            </Stack>
        </Stack>
    );
}
