'use client';

import { useMemo } from 'react';
import { createClient } from '@privy-io/cross-app-provider/connect';

export const useCrossAppClient = () =>
    useMemo(() => {
        const privyDomain = process.env.NEXT_PUBLIC_PRIVY_DOMAIN;
        if (!privyDomain) {
            throw new Error(
                'NEXT_PUBLIC_PRIVY_DOMAIN is required. Set it to the whitelabel ' +
                    'auth subdomain provisioned in the Privy dashboard (e.g. ' +
                    'https://privy.your-app.privy.dev).',
            );
        }
        return createClient({
            appId: process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
            appClientId: process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID,
            privyDomain,
        });
    }, []);
