import {
    useLoginWithOAuth as usePrivyLoginWithOAuth,
    useCreateWallet,
    OAuthProviderType,
} from '@privy-io/react-auth';
import { useCallback } from 'react';
import { useVeChainKitConfig } from '@/providers';
import { useLoginWithVeChain } from './useLoginWithVeChain';
import type { CrossAppLoginIntent } from '@/providers/PrivyCrossAppProvider';

interface OAuthOptions {
    provider: OAuthProviderType;
}

// Module-level variable shared across all hook instances
let hasCreatedWallet = false;

const CROSS_APP_INTENT_PROVIDERS = new Set<OAuthProviderType>([
    'google',
    'apple',
    'twitter',
    'discord',
    'github',
    'spotify',
    'instagram',
    'tiktok',
    'line',
    'linkedin',
]);

export const useLoginWithOAuth = () => {
    const { privy } = useVeChainKitConfig();
    const { createWallet } = useCreateWallet();
    const { login: loginViaCrossApp } = useLoginWithVeChain();

    // Memoize the onComplete callback to prevent recreation on every render
    const handleComplete = useCallback(
        async ({ isNewUser }: { isNewUser: boolean }) => {
            // When using initOAuth Privy does not create an embedded wallet automatically.
            // So we need to create a wallet manually.
            if (isNewUser && !hasCreatedWallet) {
                // Set the flag BEFORE the async operation to prevent race conditions
                hasCreatedWallet = true;

                try {
                    await createWallet();
                } catch (error) {
                    // Reset flag on error so it can be retried
                    hasCreatedWallet = false;
                    console.error('Failed to create wallet:', error);
                    throw error;
                }
            }
        },
        [createWallet],
    );

    const { initOAuth: privyInitOAuth } = usePrivyLoginWithOAuth({
        onComplete: handleComplete,
    });

    const initOAuth = async ({ provider }: OAuthOptions) => {
        // When the consumer dApp doesn't supply a `privy` prop, route
        // supported OAuth providers through the VeChain whitelabel cross-app
        // flow instead of Privy directly (whose dummy app id can't service
        // a real OAuth handshake).
        if (!privy) {
            if (CROSS_APP_INTENT_PROVIDERS.has(provider)) {
                await loginViaCrossApp({
                    intent: provider as CrossAppLoginIntent,
                });
                return;
            }
            throw new Error(
                `OAuth provider "${provider}" requires a Privy configuration. ` +
                    `Supported without Privy via the VeChain whitelabel host: ` +
                    `${[...CROSS_APP_INTENT_PROVIDERS].join(', ')}.`,
            );
        }

        await privyInitOAuth({ provider });
    };

    return { initOAuth };
};
