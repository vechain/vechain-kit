'use client';

import { ReactNode } from 'react';
import { useWallet } from '@vechain/vechain-kit';
import { LoginToContinueBox } from '../features/LoginToContinueBox';
import { useTranslation } from 'react-i18next';

interface ConnectGateProps {
    feature: string;
    children: ReactNode;
}

export function ConnectGate({ feature, children }: ConnectGateProps) {
    const { account } = useWallet();
    const { t } = useTranslation();

    if (account) return <>{children}</>;

    return (
        <LoginToContinueBox
            title={t('Connect to try {{feature}}', { feature })}
            description={t(
                'Sign in with a VeChain wallet or social account to unlock this demo.',
            )}
        />
    );
}
