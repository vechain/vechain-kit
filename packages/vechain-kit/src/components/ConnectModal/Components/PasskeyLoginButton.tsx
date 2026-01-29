import { GridItem } from '@chakra-ui/react';
import { LuFingerprint } from 'react-icons/lu';
// Import directly to avoid circular dependency with components barrel
import { ConnectionButton } from './ConnectionButton';
import { useTranslation } from 'react-i18next';
import { useLoginWithPasskey } from '../../../hooks';
// Import from types/modal to avoid circular dependency
import type { ConnectModalContentsTypes } from '../../../types/modal';
import React from 'react';

type Props = {
    isDark: boolean;
    gridColumn?: number;
    setCurrentContent: React.Dispatch<
        React.SetStateAction<ConnectModalContentsTypes>
    >;
};

export const PasskeyLoginButton = ({
    isDark,
    gridColumn,
    setCurrentContent,
}: Props) => {
    const { t } = useTranslation();
    const { loginWithPasskey } = useLoginWithPasskey();

    const handleLoginWithPasskey = async () => {
        setCurrentContent({
            type: 'loading',
            props: {
                title: t('Connecting with Passkey'),
                loadingText: t('Please complete the passkey authentication...'),
                onTryAgain: handleLoginWithPasskey,
            },
        });
        try {
            await loginWithPasskey();
        } catch (error) {
            const errorMsg =
                error instanceof Error ? error.message.toLowerCase() : '';

            // Log specific error types for debugging
            if (errorMsg.includes('not found')) {
                console.error(error);
            }

            setCurrentContent({
                type: 'error',
                props: {
                    error:
                        error instanceof Error
                            ? error.message
                            : t('Failed to connect with Passkey'),
                    onTryAgain: handleLoginWithPasskey,
                },
            });
        }
    };

    return (
        <GridItem colSpan={gridColumn} w={'full'}>
            <ConnectionButton
                isDark={isDark}
                onClick={handleLoginWithPasskey}
                icon={LuFingerprint}
                text={gridColumn && gridColumn >= 2 ? t('Passkey') : undefined}
            />
        </GridItem>
    );
};
