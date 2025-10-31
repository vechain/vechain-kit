import { useQuery } from '@tanstack/react-query';

export const fetchPrivyStatus = async (): Promise<string> => {
    try {
        const response = await fetch('https://status.privy.io/summary.json');

        if (!response.ok) {
            throw new Error('Failed to fetch Privy status');
        }

        const data = await response.json();
        return data.page.status ?? 'No data';
    } catch (error) {
        console.error("Error fetching data:", error);
        return 'Error fetching data';
    }
};

export const useFetchPrivyStatus = () => {
    return useQuery({
        queryKey: ['PRIVY_STATUS'],
        queryFn: fetchPrivyStatus,
        retry: (failureCount, error) => {
            // Don't retry on cancellation errors
            if (error instanceof Error) {
                const errorMessage = error.message.toLowerCase();
                if (errorMessage.includes('cancel') || errorMessage.includes('abort')) {
                    return false;
                }
            }
            // Retry network errors up to 2 times
            return failureCount < 2;
        },
        gcTime: 1000 * 60 * 5, // 5 minutes
        staleTime: 1000 * 60, // 1 minute
    });
};
