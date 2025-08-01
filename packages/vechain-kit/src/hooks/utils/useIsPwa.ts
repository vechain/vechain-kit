import { useEffect, useState } from 'react';
import { isBrowser } from '@/utils/ssrUtils';

export const useIsPWA = () => {
    // set to true by default to avoid flickering
    const [isPWA, setIsPWA] = useState(true);

    useEffect(() => {
        // Skip PWA check during SSR
        if (!isBrowser()) {
            setIsPWA(false);
            return;
        }

        const checkIsPWA = () => {
            const isStandalone =
                window.matchMedia('(display-mode: standalone)').matches ||
                (window as any).standalone ||
                document.referrer.includes('android-app://');
            setIsPWA(isStandalone);
        };

        checkIsPWA();

        window.addEventListener('resize', checkIsPWA);

        return () => {
            window.removeEventListener('resize', checkIsPWA);
        };
    }, []);

    return isPWA;
};
