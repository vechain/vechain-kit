import {
    UseSendTransactionReturnValue,
    getDomainsOfAddressQueryKey,
    getEnsRecordExistsQueryKey,
    getVechainDomainQueryKey,
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
import { humanAddress } from '@/utils';

type useClaimVeWorldSubdomainProps = {
    subdomain: string;
    domain: string;
    onSuccess?: () => void;
    onSuccessMessageTitle?: number;
    alreadyOwned?: boolean;
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
    alreadyOwned = false,
}: useClaimVeWorldSubdomainProps): useClaimVeWorldSubdomainReturnValue => {
    const queryClient = useQueryClient();
    const { account } = useWallet();
    const { network } = useVeChainKitConfig();

    const buildClauses = useCallback(async () => {
        if (!subdomain) throw new Error('Invalid subdomain');

        const clausesArray: any[] = [];

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

        if (!alreadyOwned) {
            clausesArray.push({
                to: getConfig(network.type)
                    .veWorldSubdomainClaimerContractAddress,
                value: '0x0',
                data: SubdomainClaimerInterface.encodeFunctionData('claim', [
                    subdomain,
                    getConfig(network.type).vetDomainsPublicResolverAddress,
                ]),
                comment: `Claim VeChain subdomain: ${subdomain}.${domain}`,
                abi: SubdomainClaimerInterface.getFunction('claim'),
            });
        }

        clausesArray.push({
            to: getConfig(network.type).vetDomainsReverseRegistrarAddress,
            value: '0x0',
            data: ReverseRegistrarInterface.encodeFunctionData('setName', [
                subdomain + '.' + domain,
            ]),
            comment: `Set ${subdomain}.${domain} as the VeChain nickname of the account ${humanAddress(
                account?.address ?? '',
                4,
                4,
            )}`,
            abi: ReverseRegistrarInterface.getFunction('setName'),
        });

        return clausesArray;
    }, [subdomain, domain, account?.address, alreadyOwned]);

    //Refetch queries to update ui after the tx is confirmed
    const handleOnSuccess = useCallback(async () => {
        // Invalidate immediately without refetching
        queryClient.cancelQueries({
            queryKey: getVechainDomainQueryKey(account?.address ?? ''),
            refetchType: 'none',
        });

        queryClient.cancelQueries({
            queryKey: getVechainDomainQueryKey(subdomain + '.' + domain),
            refetchType: 'none',
        });

        queryClient.cancelQueries({
            queryKey: getEnsRecordExistsQueryKey(subdomain),
            refetchType: 'none',
        });

        queryClient.cancelQueries({
            queryKey: getDomainsOfAddressQueryKey(
                account?.address ?? '',
                domain,
            ),
            refetchType: 'none',
        });

        // Refetch after 3 seconds
        setTimeout(() => {
            queryClient.invalidateQueries({
                queryKey: getVechainDomainQueryKey(account?.address ?? ''),
                refetchType: 'none',
            });

            queryClient.invalidateQueries({
                queryKey: getVechainDomainQueryKey(subdomain + '.' + domain),
                refetchType: 'none',
            });

            queryClient.refetchQueries({
                queryKey: getVechainDomainQueryKey(account?.address ?? ''),
            });
            queryClient.refetchQueries({
                queryKey: getVechainDomainQueryKey(subdomain + '.' + domain),
            });

            queryClient.invalidateQueries({
                queryKey: getEnsRecordExistsQueryKey(subdomain),
            });

            queryClient.refetchQueries({
                queryKey: getEnsRecordExistsQueryKey(subdomain),
            });

            queryClient.refetchQueries({
                queryKey: getDomainsOfAddressQueryKey(
                    account?.address ?? '',
                    domain,
                ),
            });
        }, 2000);

        onSuccess?.();
    }, [onSuccess, subdomain, domain, queryClient, account?.address]);

    const result = useSendTransaction({
        signerAccountAddress: account?.address ?? '',
        privyUIOptions: {
            title: 'Sign to claim your VeChain nickname',
            description: `Claim ${subdomain} as your VeChain nickname`,
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
