import { ThorClient, useDAppKitWallet, useWallet } from '@/hooks';
import { usePrivyWalletProvider } from '@/providers';
import { getConfig } from '@/config';
import { VeChainAbstractSigner, VeChainProvider } from '@vechain/sdk-network';
import { useCallback } from 'react';
import { SmartAccountSigner } from '@/signers/SmartAccountSigner';

export const useSigner = () => {
    const { signer: dappKitSigner } = useDAppKitWallet();
    const { sendTransaction } = usePrivyWalletProvider();
    const { connection, smartAccount } = useWallet();

    const getSigner = useCallback((): VeChainAbstractSigner | null => {
        const config = getConfig(connection.network);

        const provider = new VeChainProvider(ThorClient.at(config.nodeUrl));

        if (connection.isConnectedWithDappKit) {
            return dappKitSigner;
        } else if (connection.isConnectedWithPrivy) {
            return new SmartAccountSigner(
                {
                    address: smartAccount?.address,
                    sendTransaction: sendTransaction,
                },
                provider,
            );
        }
        return null;
    }, [
        connection.isConnectedWithDappKit,
        dappKitSigner,
        connection.isConnectedWithPrivy,
        smartAccount,
        connection.network,
        sendTransaction,
    ]);

    const signer = getSigner();

    return signer;
};
