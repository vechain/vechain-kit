import { useQuery } from '@tanstack/react-query';

export const FetchPrivyStatus = async (): Promise<string | null> => {
    try {
        const response = await fetch('https://status.privy.io/summary.json');

        if (!response.ok) {
            throw new Error('Failed to fetch Privy status');
        }

        const data = await response.json();
        return data.page.status ?? null;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
};

export const useFetchPrivyStatus = () => {
    return useQuery({
        queryKey: ['PRIVY_STATUS'],
        queryFn: FetchPrivyStatus
    });
};
