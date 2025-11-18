import { GridItem, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { LuFingerprint } from 'react-icons/lu';
import { LoginLoadingModal, ConnectionButton } from '@/components';
import { useTranslation } from 'react-i18next';
import { useLoginWithPasskey } from '@/hooks';

type Props = {
    isDark: boolean;
    gridColumn?: number;
};

export const PasskeyLoginButton = ({ isDark, gridColumn }: Props) => {
    const { t } = useTranslation();
    const { loginWithPasskey } = useLoginWithPasskey();
    const [loginError, setLoginError] = useState<string>();
    const loginLoadingModal = useDisclosure();

    const handleLoginWithPasskey = async () => {
        loginLoadingModal.onOpen();
        try {
            setLoginError(undefined);
            await loginWithPasskey();
            loginLoadingModal.onClose();
        } catch (error) {
            const errorMsg =
                error instanceof Error ? error.message.toLowerCase() : '';

            if (errorMsg.includes('not found')) {
                console.error(error);
                setLoginError(
                    error instanceof Error
                        ? error.message
                        : t('Failed to connect with Passkey'),
                );
            }
        }
    };

    const handleTryAgain = () => {
        handleLoginWithPasskey();
    };

    return (
        <>
            <GridItem colSpan={gridColumn} w={'full'}>
                <ConnectionButton
                    isDark={isDark}
                    onClick={handleLoginWithPasskey}
                    icon={LuFingerprint}
                    text={
                        gridColumn && gridColumn >= 2 ? t('Passkey') : undefined
                    }
                />
            </GridItem>

            <LoginLoadingModal
                isOpen={loginLoadingModal.isOpen}
                onClose={() => {
                    loginLoadingModal.onClose();
                }}
                error={loginError}
                title={t('Connecting with Passkey')}
                loadingText={t('Please complete the passkey authentication...')}
                onTryAgain={handleTryAgain}
            />
        </>
    );
};
