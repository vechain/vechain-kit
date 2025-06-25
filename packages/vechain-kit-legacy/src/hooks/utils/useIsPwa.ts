import { useEffect, useState } from 'react';

export const useIsPWA = () => {
    // set to true by default to avoid flickering
    const [isPWA, setIsPWA] = useState(true);

    useEffect(() => {
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
