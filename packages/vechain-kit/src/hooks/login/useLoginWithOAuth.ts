import {
    useLoginWithOAuth as usePrivyLoginWithOAuth,
    useCreateWallet,
    OAuthProviderType,
} from '@privy-io/react-auth';
import { useCallback } from 'react';

interface OAuthOptions {
    provider: OAuthProviderType;
}

// Module-level variable shared across all hook instances
let hasCreatedWallet = false;

export const useLoginWithOAuth = () => {
    const { createWallet } = useCreateWallet();

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
        try {
            await privyInitOAuth({ provider });
        } catch (error) {
            throw error;
        }
    };

    return { initOAuth };
};
