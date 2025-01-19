import React, { ReactNode } from 'react';
import {
    QueryClient,
    QueryClientProvider,
    QueryClientContext,
} from '@tanstack/react-query';

// Singleton instance for internal QueryClient
let internalQueryClient: QueryClient | null = null;

// Function to safely get the QueryClient
export function getOrCreateQueryClient(): QueryClient {
    if (!internalQueryClient) {
        internalQueryClient = new QueryClient({
            defaultOptions: {
                queries: {
                    retry: 0,
                    staleTime: 30000,
                    refetchOnWindowFocus: true,
                    refetchOnMount: true,
                    refetchOnReconnect: true,
                    refetchInterval: false,
                    refetchIntervalInBackground: false,
                },
            },
        });
    }
    return internalQueryClient;
}

// A wrapper component to ensure a QueryClientProvider exists
interface EnsureQueryClientProps {
    children: ReactNode;
}

export const EnsureQueryClient = ({ children }: EnsureQueryClientProps) => {
    try {
        // Attempt to use the existing QueryClient context
        const existingQueryClient = React.useContext(QueryClientContext);

        if (existingQueryClient) {
            return <>{children}</>;
        }
    } catch (e) {
        // Handle any potential errors
        // eslint-disable-next-line no-console
        console.log(e);
    }

    // If no QueryClient exists or there was an error, provide one
    const queryClient = getOrCreateQueryClient();
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
};
