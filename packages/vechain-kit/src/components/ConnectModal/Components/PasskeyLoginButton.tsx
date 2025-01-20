import { GridItem, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { useLoginWithPasskey } from '@privy-io/react-auth';
import { IoIosFingerPrint } from 'react-icons/io';
import { LoginLoadingModal, ConnectionButton } from '@/components';
import { useTranslation } from 'react-i18next';

type Props = {
    isDark: boolean;
};

export const PasskeyLoginButton = ({ isDark }: Props) => {
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
            <GridItem colSpan={1} w={'full'}>
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
