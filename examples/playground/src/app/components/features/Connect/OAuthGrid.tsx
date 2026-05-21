'use client';

import { Button, Icon, SimpleGrid } from '@chakra-ui/react';
import { useLoginWithOAuth } from '@vechain/vechain-kit';
import { FcGoogle } from 'react-icons/fc';
import {
    FaApple,
    FaDiscord,
    FaGithub,
    FaLine,
    FaTiktok,
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import type { IconType } from 'react-icons';

type OAuthProvider =
    | 'google'
    | 'apple'
    | 'twitter'
    | 'discord'
    | 'github'
    | 'tiktok'
    | 'line';

export const OAUTH_PROVIDERS: ReadonlyArray<{
    id: OAuthProvider;
    label: string;
    icon: IconType;
}> = [
    { id: 'google', label: 'Google', icon: FcGoogle },
    { id: 'apple', label: 'Apple', icon: FaApple },
    { id: 'twitter', label: 'X', icon: FaXTwitter },
    { id: 'discord', label: 'Discord', icon: FaDiscord },
    { id: 'github', label: 'GitHub', icon: FaGithub },
    { id: 'tiktok', label: 'TikTok', icon: FaTiktok },
    { id: 'line', label: 'LINE', icon: FaLine },
];

export function OAuthGrid() {
    const { initOAuth } = useLoginWithOAuth();

    return (
        <SimpleGrid columns={{ base: 2, sm: 3, md: 4 }} spacing={3} w="full">
            {OAUTH_PROVIDERS.map((p) => (
                <Button
                    key={p.id}
                    onClick={() => initOAuth({ provider: p.id })}
                    leftIcon={<Icon as={p.icon} boxSize="18px" />}
                    variant="outline"
                    size="md"
                    justifyContent="flex-start"
                >
                    {p.label}
                </Button>
            ))}
        </SimpleGrid>
    );
}
