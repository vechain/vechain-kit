import { GridItem } from '@chakra-ui/react';
import { useState } from 'react';
import { VechainLogo } from '@/assets';
import { ConnectionButton, LoginLoadingModal } from '@/components';
import { usePrivyCrossAppSdk } from '@/providers/PrivyCrossAppProvider';
import { VECHAIN_PRIVY_APP_ID } from '@/utils';
import { useDisclosure } from '@chakra-ui/react';

type Props = {
    isDark: boolean;
};

export const VeChainLoginButton = ({ isDark }: Props) => {
    const { login: loginWithVeChain } = usePrivyCrossAppSdk();
    const [loginError, setLoginError] = useState<string>();
    const loginLoadingModal = useDisclosure();

    const handleLoginWithVeChain = async () => {
        loginLoadingModal.onOpen();
        try {
            setLoginError(undefined);
            await loginWithVeChain(VECHAIN_PRIVY_APP_ID);
            loginLoadingModal.onClose();
        } catch (error) {
            console.error('Login failed:', error);
            setLoginError(
                error instanceof Error
                    ? error.message
                    : 'Failed to connect with VeChain',
            );
        }
    };

    return (
        <>
            <GridItem colSpan={4} w={'full'}>
                <ConnectionButton
                    isDark={isDark}
                    onClick={handleLoginWithVeChain}
                    customIcon={
                        <VechainLogo boxSize={'20px'} isDark={isDark} />
                    }
                    text="Login with VeChain"
                />
            </GridItem>

            <LoginLoadingModal
                isOpen={loginLoadingModal.isOpen}
                onClose={() => {
                    loginLoadingModal.onClose();
                }}
                onTryAgain={handleLoginWithVeChain}
                error={loginError}
                title="Connecting with VeChain"
                loadingText="Please approve the request in the connection request window..."
            />
        </>
    );
};
