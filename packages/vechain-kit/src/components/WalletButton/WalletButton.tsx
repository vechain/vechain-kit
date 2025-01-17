import { Button, useDisclosure } from '@chakra-ui/react';
import { useWallet } from '@/hooks';
import { useWallet as useDappKitWallet } from '@vechain/dapp-kit-react';
import { usePrivy } from '@privy-io/react-auth';
import { useEffect } from 'react';
import { ConnectModal, AccountModal } from '@/components';
import { ConnectedWallet } from './ConnectedWallet';
import { WalletButtonProps } from './types';

export const WalletButton = ({
    mobileVariant = 'iconAndDomain',
    desktopVariant = 'iconAndDomain',
}: WalletButtonProps) => {
    const { connection } = useWallet();
    const { setSource, connect } = useDappKitWallet();
    const { authenticated, user, createWallet } = usePrivy();

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

    useEffect(() => {
        const embeddedWallet = user?.wallet?.address;

        const asyncCreateWallet = async () => {
            await createWallet();
        };

        if (authenticated && !connection.isConnecting && !embeddedWallet) {
            try {
                asyncCreateWallet();
            } catch (error) {
                console.error(error);
            }
        }
    }, [authenticated, connection, user]);

    return (
        <>
            {connection.isConnected ? (
                <ConnectedWallet
                    mobileVariant={mobileVariant}
                    desktopVariant={desktopVariant}
                    onOpen={accountModal.onOpen}
                />
            ) : (
                <Button onClick={handleConnect}>Login</Button>
            )}

            <ConnectModal
                isOpen={connectModal.isOpen}
                onClose={connectModal.onClose}
            />
            <AccountModal
                isOpen={accountModal.isOpen}
                onClose={accountModal.onClose}
            />
        </>
    );
};
