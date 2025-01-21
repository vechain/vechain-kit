import { GridItem, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { IoIosFingerPrint } from 'react-icons/io';
import { LoginLoadingModal, ConnectionButton } from '@/components';
import { useTranslation } from 'react-i18next';
import { useLoginWithPasskey } from '@/hooks';

type Props = {
    isDark: boolean;
    gridColumn?: number;
};

export const PasskeyLoginButton = ({ isDark, gridColumn = 1 }: Props) => {
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
            console.error(error);
            setLoginError(
                error instanceof Error
                    ? error.message
                    : t('Failed to connect with Passkey'),
            );
        }
    };

    return (
        <>
            <GridItem colSpan={gridColumn} w={'full'}>
                <ConnectionButton
                    isDark={isDark}
                    onClick={handleLoginWithPasskey}
                    icon={IoIosFingerPrint}
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
                onTryAgain={handleLoginWithPasskey}
            />
        </>
    );
};
