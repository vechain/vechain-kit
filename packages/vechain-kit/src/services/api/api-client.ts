import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

export interface ApiClientConfig {
    baseUrl: string;
    headers?: Record<string, string>;
    timeout?: number;
}

export class ApiClient {
    private axiosInstance: AxiosInstance;

    constructor(config: ApiClientConfig) {
        this.axiosInstance = axios.create({
            baseURL: config.baseUrl,
            timeout: config.timeout || 30000, // 30s default
            headers: {
                'Content-Type': 'application/json',
                ...config.headers,
            },
        });
    }

    async request<T>(endpoint: string, options: AxiosRequestConfig = {}): Promise<T> {
        try {
            const response = await this.axiosInstance.request<T>({
                url: endpoint,
                ...options,
            });

            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.code === 'ECONNABORTED') {
                    throw new Error('Request timeout');
                }
                if (error.response) {
                    throw new Error(
                        `API request failed: ${error.response.status} ${error.response.statusText}`,
                    );
                }
                throw new Error(error.message || 'Network error occurred');
            }

            throw new Error('Unknown error occurred');
        }
    }

    async get<T>(endpoint: string): Promise<T> {
        return this.request<T>(endpoint, { method: 'GET' });
    }

    async post<T>(endpoint: string, data?: unknown): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'POST',
            data,
        });
    }
}
