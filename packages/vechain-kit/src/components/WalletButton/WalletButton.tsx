import {
    Button,
    ButtonProps,
    useDisclosure,
    useMediaQuery,
} from '@chakra-ui/react';
import { useWallet, useDAppKitWallet, useDAppKitWalletModal } from '@/hooks';
import { ConnectModal, AccountModal } from '@/components';
import { ConnectedWallet } from './ConnectedWallet';
import { WalletDisplayVariant } from './types';
import { useTranslation } from 'react-i18next';
import { useVeChainKitConfig, VechainKitThemeProvider } from '@/providers';
import { ConnectPopover } from '../ConnectModal';

export type WalletButtonProps = {
    mobileVariant?: WalletDisplayVariant;
    desktopVariant?: WalletDisplayVariant;
    buttonStyle?: ButtonProps;
    connectionVariant?: 'modal' | 'popover';
};

export const WalletButton = ({
    mobileVariant = 'iconAndDomain',
    desktopVariant = 'iconDomainAndAddress',
    buttonStyle,
    connectionVariant = 'modal',
}: WalletButtonProps) => {
    const { t } = useTranslation();
    const { darkMode, loginMethods } = useVeChainKitConfig();

    const hasOnlyDappKit =
        loginMethods?.length === 1 && loginMethods[0].method === 'dappkit';

    const { connection, account } = useWallet();
    const { setSource, connect } = useDAppKitWallet();

    const [isMobile] = useMediaQuery('(max-width: 768px)');

    const connectModal = useDisclosure();
    const accountModal = useDisclosure();
    const { open: openDappKit } = useDAppKitWalletModal();

    const handleConnect = () => {
        if (connection.isInAppBrowser) {
            setSource('veworld');
            connect();
        } else if (hasOnlyDappKit) {
            openDappKit();
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
            ) : connectionVariant === 'popover' && !isMobile ? (
                <ConnectPopover
                    isLoading={connection.isLoading}
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
