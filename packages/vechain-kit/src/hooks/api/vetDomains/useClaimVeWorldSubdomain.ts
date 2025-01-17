import {
    UseSendTransactionReturnValue,
    getVetDomainQueryKey,
    useSendTransaction,
    useWallet,
} from '@/hooks';
import { useCallback } from 'react';
import {
    IReverseRegistrar__factory,
    SubdomainClaimer__factory,
} from '@/contracts/typechain-types';
import { useQueryClient } from '@tanstack/react-query';
import { getConfig } from '@/config';
import { useVeChainKitConfig } from '@/providers';

type useClaimVeWorldSubdomainProps = {
    subdomain: string;
    domain: string;
    onSuccess?: () => void;
    onSuccessMessageTitle?: number;
};

type useClaimVeWorldSubdomainReturnValue = {
    sendTransaction: () => Promise<void>;
} & Omit<UseSendTransactionReturnValue, 'sendTransaction'>;

const SubdomainClaimerInterface = SubdomainClaimer__factory.createInterface();
const ReverseRegistrarInterface = IReverseRegistrar__factory.createInterface();

export const useClaimVeWorldSubdomain = ({
    subdomain,
    domain,
    onSuccess,
}: useClaimVeWorldSubdomainProps): useClaimVeWorldSubdomainReturnValue => {
    const queryClient = useQueryClient();
    const { account } = useWallet();
    const { network } = useVeChainKitConfig();

    const buildClauses = useCallback(async () => {
        if (!subdomain) throw new Error('Invalid subdomain');

        const clausesArray: any[] = [];

        clausesArray.push({
            to: getConfig(network.type).veWorldSubdomainClaimerContractAddress,
            value: '0x0',
            data: SubdomainClaimerInterface.encodeFunctionData('claim', [
                subdomain,
                getConfig(network.type).vetDomainsPublicResolverAddress,
            ]),
            comment: `Claim ${subdomain}`,
            abi: SubdomainClaimerInterface.getFunction('claim'),
        });

        clausesArray.push({
            to: getConfig(network.type).vetDomainsReverseRegistrarAddress,
            value: '0x0',
            data: ReverseRegistrarInterface.encodeFunctionData('setName', [
                subdomain + '.' + domain,
            ]),
            comment: `Set name ${subdomain}.${domain}`,
            abi: ReverseRegistrarInterface.getFunction('setName'),
        });

        return clausesArray;
    }, [subdomain]);

    //Refetch queries to update ui after the tx is confirmed
    const handleOnSuccess = useCallback(async () => {
        // Clear the domain cache
        localStorage.removeItem('vechainDomainCache');

        // Invalidate immediately without refetching
        queryClient.invalidateQueries({
            queryKey: getVetDomainQueryKey(account.address ?? ''),
            refetchType: 'none',
        });

        queryClient.invalidateQueries({
            queryKey: getVetDomainQueryKey(subdomain + '.' + domain),
            refetchType: 'none',
        });

        // Refetch after 3 seconds
        setTimeout(() => {
            queryClient.refetchQueries({
                queryKey: getVetDomainQueryKey(account.address ?? ''),
            });
            queryClient.refetchQueries({
                queryKey: getVetDomainQueryKey(subdomain + '.' + domain),
            });
        }, 5000);

        onSuccess?.();
    }, [onSuccess, subdomain, domain, queryClient, account.address]);

    const result = useSendTransaction({
        signerAccountAddress: account.address,
        privyUIOptions: {
            title: 'Sign to confirm',
            description: `Claim ${subdomain}`,
            buttonText: 'Sign',
        },
        onTxConfirmed: handleOnSuccess,
    });

    return {
        ...result,
        sendTransaction: async () => {
            return result.sendTransaction(await buildClauses());
        },
    };
};
