import { AccountModal, ConnectModal } from '@/components';
import { useDAppKitWallet, useWallet } from '@/hooks';
import { useVeChainKitConfig, VechainKitThemeProvider } from '@/providers';
import {
    Button,
    ButtonProps,
    useDisclosure,
    useMediaQuery,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { ConnectPopover } from '../ConnectModal';
import { ConnectedWallet } from './ConnectedWallet';
import { WalletButtonTooltipProps, WalletDisplayVariant } from './types';

export type WalletButtonProps = {
    mobileVariant?: WalletDisplayVariant;
    desktopVariant?: WalletDisplayVariant;
    buttonStyle?: ButtonProps;
    connectionVariant?: 'modal' | 'popover';
    tooltipProps?: WalletButtonTooltipProps;
};

export const WalletButton = ({
    mobileVariant = 'iconAndDomain',
    desktopVariant = 'iconDomainAndAddress',
    buttonStyle,
    connectionVariant = 'modal',
    tooltipProps,
}: WalletButtonProps) => {
    const { t } = useTranslation();
    const { darkMode } = useVeChainKitConfig();

    const { connection, account } = useWallet();
    const { setSource, connect } = useDAppKitWallet();

    const [isMobile] = useMediaQuery('(max-width: 768px)');

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
            ) : connectionVariant === 'popover' && !isMobile ? (
                <ConnectPopover
                    isLoading={connection.isLoading}
                    buttonStyle={buttonStyle}
                    tooltipProps={tooltipProps}
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
