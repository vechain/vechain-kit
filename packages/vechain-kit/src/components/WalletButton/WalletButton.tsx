import { Button, HStack, Image, Text, useDisclosure } from '@chakra-ui/react';
import { useWallet } from '@/hooks';
import { ConnectModal, AccountModal, LoginLoadingModal } from '@/components';
import { humanAddress } from '@/utils';
import { useLoginWithOAuth, usePrivy } from '@privy-io/react-auth';
import { useEffect } from 'react';
import { useWallet as useDappKitWallet } from '@vechain/dapp-kit-react';

export const WalletButton = () => {
    const { connection, account } = useWallet();
    const { setSource, connect } = useDappKitWallet();
    const { authenticated, user, createWallet } = usePrivy();

    const connectModal = useDisclosure();
    const accountModal = useDisclosure();

    const { loading: isLoadingLoginOAuth } = useLoginWithOAuth({});

    const handleConnect = () => {
        // Social login does not work inside veworld explorer,
        // so we need to force connection to veworld
        if (connection.isInAppBrowser) {
            setSource('veworld');
            connect();
        } else {
            connectModal.onOpen();
        }
    };

    // If the user authenticates directly with google, we need to wait for success
    // and if it's first time we create an embedded wallet for the user
    useEffect(() => {
        const embeddedWallet = user?.wallet?.address;

        const asyncCreateWallet = async () => {
            await createWallet();
        };

        if (authenticated && !isLoadingLoginOAuth && !embeddedWallet) {
            try {
                asyncCreateWallet();
            } catch (error) {
                // if user already has an embedded wallet, this will throw an error
                console.error(error);
            }
        }
    }, [authenticated, isLoadingLoginOAuth, user]);

    return (
        <>
            {connection.isConnected ? (
                <Button onClick={accountModal.onOpen} p={'9px 12px'}>
                    <HStack>
                        <Image
                            className="address-icon mobile"
                            src={account.image ?? ''}
                            alt="wallet"
                            width={23}
                            height={23}
                            borderRadius="50%"
                        />
                        {account.domain ? (
                            <Text
                                fontSize="sm"
                                display={{ base: 'none', md: 'block' }}
                            >
                                {account.domain}
                            </Text>
                        ) : (
                            <Text
                                fontSize="sm"
                                display={{ base: 'none', md: 'block' }}
                            >
                                {humanAddress(account.address ?? '', 6, 4)}
                            </Text>
                        )}
                    </HStack>
                </Button>
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

            <LoginLoadingModal
                isOpen={isLoadingLoginOAuth}
                onClose={() => {}}
            />
        </>
    );
};
