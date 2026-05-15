'use client';
import dynamic from 'next/dynamic';
import { Provider } from '@/components/ui/provider';

const VechainKitProviderWrapper = dynamic(
    async () =>
        (await import('@/providers/VechainKitProviderWrapper'))
            .VechainKitProviderWrapper,
    { ssr: false },
);

export function Providers({ children }: { readonly children: React.ReactNode }) {
    return (
        <Provider>
            <VechainKitProviderWrapper>{children}</VechainKitProviderWrapper>
        </Provider>
    );
}
