import { GridItem } from '@chakra-ui/react';
import { useState } from 'react';
import { VechainLogoDark, VechainLogoLight } from '@/assets';
import { ConnectionButton, LoginLoadingModal, SocialIcons } from '@/components';
import { useLoginWithVeChain } from '@/hooks';
import { useDisclosure } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { IconType } from 'react-icons';

type Props = {
    isDark: boolean;
    gridColumn?: number;
};

export const VeChainLoginButton = ({ isDark, gridColumn }: Props) => {
    const { t } = useTranslation();
    const { login: loginWithVeChain } = useLoginWithVeChain();
    const [loginError, setLoginError] = useState<string>();
    const loginLoadingModal = useDisclosure();

    const handleLoginWithVeChain = async () => {
        loginLoadingModal.onOpen();
        try {
            setLoginError(undefined);

            await loginWithVeChain();

            loginLoadingModal.onClose();
        } catch (error) {
            console.error(t('Login failed:'), error);
            setLoginError(
                error instanceof Error
                    ? error.message
                    : t('Failed to connect with VeChain'),
            );
        }
    };

    return (
        <>
            <GridItem colSpan={gridColumn ? gridColumn : 4} w={'full'}>
                <ConnectionButton
                    isDark={isDark}
                    onClick={handleLoginWithVeChain}
                    icon={
                        isDark
                            ? (VechainLogoLight as IconType)
                            : (VechainLogoDark as IconType)
                    }
                    text={t('Use social login with VeChain')}
                    variant={'loginWithVechain'}
                    rightIcon={<SocialIcons />}
                />
            </GridItem>

            <LoginLoadingModal
                isOpen={loginLoadingModal.isOpen}
                onClose={() => {
                    loginLoadingModal.onClose();
                }}
                onTryAgain={handleLoginWithVeChain}
                error={loginError}
                title={t('Connecting to VeChain')}
                loadingText={t(
                    'Please approve the request in the connection request window...',
                )}
            />
        </>
    );
};
