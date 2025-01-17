import { GridItem, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { useLoginWithPasskey } from '@privy-io/react-auth';
import { IoIosFingerPrint } from 'react-icons/io';
import { ConnectionButton } from '@/components';
import { LoginLoadingModal } from '@/components';

type Props = {
    isDark: boolean;
};

export const PasskeyLoginButton = ({ isDark }: Props) => {
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
                    : 'Failed to connect with Passkey',
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
                title="Connecting with Passkey"
                loadingText="Please complete the passkey authentication..."
            />
        </>
    );
};
