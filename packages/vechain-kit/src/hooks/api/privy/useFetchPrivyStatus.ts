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
        return 'ERROR_FETCHING';
    }
};

export const useFetchPrivyStatus = () => {
    return useQuery({
        queryKey: ['PRIVY_STATUS'],
        queryFn: fetchPrivyStatus
    });
};
