import { Button, ButtonProps, useDisclosure } from '@chakra-ui/react';
import { useWallet } from '@/hooks';
import { useWallet as useDappKitWallet } from '@vechain/dapp-kit-react';
import { ConnectModal, AccountModal } from '@/components';
import { ConnectedWallet } from './ConnectedWallet';
import { WalletDisplayVariant } from './types';
import { useTranslation } from 'react-i18next';
import { useVeChainKitConfig, VechainKitThemeProvider } from '@/providers';

export type WalletButtonProps = {
    mobileVariant?: WalletDisplayVariant;
    desktopVariant?: WalletDisplayVariant;
    buttonStyle?: ButtonProps;
};

export const WalletButton = ({
    mobileVariant = 'iconAndDomain',
    desktopVariant = 'iconDomainAndAddress',
    buttonStyle,
}: WalletButtonProps) => {
    const { t } = useTranslation();
    const { darkMode } = useVeChainKitConfig();

    const { connection, account } = useWallet();
    const { setSource, connect } = useDappKitWallet();

    const connectModal = useDisclosure();
    const accountModal = useDisclosure();

    const handleConnect = () => {
        if (connection.isInAppBrowser) {
            setSource('veworld');
            connect();
        } else {
            connectModal.onOpen();
        }
    };

    return (
        <VechainKitThemeProvider darkMode={darkMode}>
            {connection.isConnected && !!account ? (
                <ConnectedWallet
                    mobileVariant={mobileVariant}
                    desktopVariant={desktopVariant}
                    onOpen={accountModal.onOpen}
                    buttonStyle={buttonStyle}
                />
            ) : (
                <Button
                    isLoading={connection.isLoading}
                    onClick={handleConnect}
                    {...buttonStyle}
                >
                    {t('Login')}
                </Button>
            )}

            <ConnectModal
                isOpen={connectModal.isOpen}
                onClose={connectModal.onClose}
            />
            <AccountModal
                isOpen={accountModal.isOpen}
                onClose={accountModal.onClose}
            />
        </VechainKitThemeProvider>
    );
};
