'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { ThorClient } from '@vechain/sdk-network';

/**
 * Context for providing Thor client when DAppKit is not configured.
 * This is a fallback provider that creates a Thor client from the node URL.
 */
const ThorContext = createContext<ThorClient | null>(null);

export interface ThorProviderProps {
    children: React.ReactNode;
    nodeUrl: string;
}

/**
 * Fallback Thor provider for when DAppKit is not configured.
 * Provides a Thor client created from the node URL.
 */
export const ThorProvider = ({ children, nodeUrl }: ThorProviderProps) => {
    const thor = useMemo(() => ThorClient.at(nodeUrl), [nodeUrl]);

    return (
        <ThorContext.Provider value={thor}>{children}</ThorContext.Provider>
    );
};

/**
 * Hook to access the fallback Thor client.
 * Returns null if neither DAppKit nor ThorProvider is available.
 */
export const useFallbackThor = (): ThorClient | null => {
    return useContext(ThorContext);
};
