import {
    UseSendTransactionReturnValue,
    useSendTransaction,
    useWallet,
} from '@/hooks';
import { useCallback } from 'react';
import { IReverseRegistrar__factory } from '@/contracts/typechain-types';
import { getConfig } from '@/config';
import { useVeChainKitConfig } from '@/providers';
import { humanAddress } from '@/utils';
import { useInvalidateDomainQueries } from './utils/useInvalidateDomainQueries';

type useUnsetDomainProps = {
    onSuccess?: () => void;
    onError?: () => void;
};

type useUnsetDomainReturnValue = {
    sendTransaction: () => Promise<void>;
} & Omit<UseSendTransactionReturnValue, 'sendTransaction'>;

const ReverseRegistrarInterface = IReverseRegistrar__factory.createInterface();

/**
 * Hook for unsetting any domain name (both .veworld.vet and .vet domains)
 *
 * This hook is a dedicated implementation for the unset functionality
 * that was previously part of the claim hooks.
 */
export const useUnsetDomain = ({
    onSuccess,
    onError,
}: useUnsetDomainProps): useUnsetDomainReturnValue => {
    const invalidateDomainQueries = useInvalidateDomainQueries();
    const { account } = useWallet();
    const { network } = useVeChainKitConfig();

    const buildClauses = useCallback(async () => {
        const clausesArray: any[] = [];

        // When unsetting domain, we only need to call setName with an empty string
        clausesArray.push({
            to: getConfig(network.type).vetDomainsReverseRegistrarAddress,
            value: '0x0',
            data: ReverseRegistrarInterface.encodeFunctionData('setName', ['']),
            comment: `Unsetting your current VeChain nickname of the account ${humanAddress(
                account?.address ?? '',
                4,
                4,
            )}`,
            abi: ReverseRegistrarInterface.getFunction('setName'),
        });

        return clausesArray;
    }, [account?.address, network.type]);

    // Refetch queries to update UI after the tx is confirmed
    const handleOnSuccess = useCallback(async () => {
        await invalidateDomainQueries();

        onSuccess?.();
    }, [onSuccess]);

    const result = useSendTransaction({
        signerAccountAddress: account?.address ?? '',
        privyUIOptions: {
            title: 'Sign to unset your VeChain nickname',
            description: 'Unset your current VeChain nickname',
            buttonText: 'Sign to continue',
        },
        onTxConfirmed: handleOnSuccess,
        onTxFailedOrCancelled: onError,
    });

    return {
        ...result,
        sendTransaction: async () => {
            return result.sendTransaction(await buildClauses());
        },
    };
};
