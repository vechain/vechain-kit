import { Button, useDisclosure, useMediaQuery } from '@chakra-ui/react';
import { useWallet, useDAppKitWallet, useDAppKitWalletModal } from '../../hooks';
// Import directly to avoid circular dependency with components barrel
import { ConnectModal } from '../ConnectModal/ConnectModal';
import { AccountModal } from '../AccountModal/AccountModal';
import { ConnectedWallet } from './ConnectedWallet';
// Import type from types.ts to avoid circular dependency with ConnectedWallet
import type { WalletButtonProps } from './types';
// Direct imports to avoid circular dependency through barrel exports
import { useVeChainKitConfig } from '../../providers/VeChainKitContext';
import { VechainKitThemeProvider } from '../../providers/VechainKitThemeProvider';
import { ConnectPopover } from '../ConnectModal';

// Re-export for backward compatibility
export type { WalletButtonProps } from './types';

export const WalletButton = ({
    mobileVariant = 'iconAndDomain',
    desktopVariant = 'iconDomainAndAddress',
    buttonStyle,
    connectionVariant = 'modal',
    label = 'Login',
}: WalletButtonProps) => {
    const { darkMode, loginMethods, theme } = useVeChainKitConfig();

    const hasOnlyDappKit =
        loginMethods?.length === 1 && loginMethods[0].method === 'dappkit';

    const { connection, account } = useWallet();
    const { setSource, connectV2 } = useDAppKitWallet();

    const [isMobile] = useMediaQuery('(max-width: 768px)');

    const connectModal = useDisclosure();
    const accountModal = useDisclosure();
    const { open: openDappKit } = useDAppKitWalletModal();

    const handleConnect = () => {
        if (connection.isInAppBrowser) {
            setSource('veworld');
            connectV2(null);
        } else if (hasOnlyDappKit) {
            openDappKit();
        } else {
            connectModal.onOpen();
        }
    };

    return (
        <VechainKitThemeProvider darkMode={darkMode} theme={theme}>
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
                    {label}
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
