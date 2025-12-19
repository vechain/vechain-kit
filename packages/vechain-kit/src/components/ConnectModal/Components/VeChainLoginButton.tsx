import { GridItem } from '@chakra-ui/react';
import { VechainLogoDark, VechainLogoLight } from '@/assets';
import { ConnectionButton, SocialIcons } from '@/components';
import { useLoginWithVeChain } from '@/hooks';
import { useTranslation } from 'react-i18next';
import { IconType } from 'react-icons';
import { ConnectModalContentsTypes } from '../ConnectModal';
import React from 'react';

type Props = {
    isDark: boolean;
    gridColumn?: number;
    setCurrentContent: React.Dispatch<
        React.SetStateAction<ConnectModalContentsTypes>
    >;
};

export const VeChainLoginButton = ({
    isDark,
    gridColumn,
    setCurrentContent,
}: Props) => {
    const { t } = useTranslation();
    const { login: loginWithVeChain } = useLoginWithVeChain();

    const handleLoginWithVeChain = async () => {
        setCurrentContent({
            type: 'loading',
            props: {
                title: t('Connecting to VeChain'),
                loadingText: t(
                    'Please approve the request in the connection request window...',
                ),
                onTryAgain: handleLoginWithVeChain,
            },
        });
        try {
            await loginWithVeChain();
        } catch (error) {
            console.error(t('Login failed:'), error);
            setCurrentContent({
                type: 'error',
                props: {
                    error:
                        error instanceof Error
                            ? error.message
                            : t('Failed to connect with VeChain'),
                    onTryAgain: handleLoginWithVeChain,
                },
            });
        }
    };

    return (
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
    );
};
