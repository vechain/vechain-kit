import { GridItem, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { IoIosFingerPrint } from 'react-icons/io';
import { LoginLoadingModal, ConnectionButton } from '@/components';
import { useTranslation } from 'react-i18next';
import { useLoginWithPasskey } from '@/hooks';
import { Analytics } from '@/utils/mixpanelClientInstance';
import { VeLoginMethod } from '@/types/mixPanel';

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
        Analytics.auth.flowStarted(VeLoginMethod.PASSKEY);
        Analytics.auth.methodSelected(VeLoginMethod.PASSKEY);
        loginLoadingModal.onOpen();
        try {
            setLoginError(undefined);
            await loginWithPasskey();
            loginLoadingModal.onClose();
        } catch (error) {
            const errorMsg =
                error instanceof Error ? error.message.toLowerCase() : '';

            if (errorMsg.includes('not found')) {
                Analytics.auth.dropOff('passkey-prompt');
            } else if (errorMsg.includes('abort')) {
                Analytics.auth.dropOff('passkey-authentication');
            } else {
                Analytics.auth.failed(VeLoginMethod.PASSKEY, errorMsg);
            }

            console.error(error);
            setLoginError(
                error instanceof Error
                    ? error.message
                    : t('Failed to connect with Passkey'),
            );
        }
    };

    const handleTryAgain = () => {
        Analytics.auth.tryAgain(VeLoginMethod.PASSKEY);
        handleLoginWithPasskey();
    };

    return (
        <>
            <GridItem colSpan={gridColumn} w={'full'}>
                <ConnectionButton
                    isDark={isDark}
                    onClick={handleLoginWithPasskey}
                    icon={IoIosFingerPrint}
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
