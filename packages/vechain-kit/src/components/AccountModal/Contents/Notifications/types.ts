export type Notification = {
    id: string;
    title: string;
    description: string;
    timestamp: number;
    status: 'success' | 'info' | 'warning' | 'error';
    isRead: boolean;
};
