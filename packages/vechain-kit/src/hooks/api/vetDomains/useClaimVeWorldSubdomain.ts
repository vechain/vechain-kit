import {
    UseSendTransactionReturnValue,
    getAvatarOfAddressQueryKey,
    getDomainsOfAddressQueryKey,
    getEnsRecordExistsQueryKey,
    getTextRecordsQueryKey,
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
import { ethers } from 'ethers';

type useClaimVeWorldSubdomainProps = {
    subdomain: string;
    domain: string;
    onSuccess?: () => void;
    onError?: () => void;
    onSuccessMessageTitle?: number;
    alreadyOwned?: boolean;
    isUnsetting?: boolean;
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
    onError,
    alreadyOwned = false,
    isUnsetting = false,
}: useClaimVeWorldSubdomainProps): useClaimVeWorldSubdomainReturnValue => {
    const queryClient = useQueryClient();
    const { account } = useWallet();
    const { network } = useVeChainKitConfig();

    const buildClauses = useCallback(async () => {
        const clausesArray: any[] = [];

        // When unsetting domain, we only need to call setName with an empty string
        if (isUnsetting) {
            clausesArray.push({
                to: getConfig(network.type).vetDomainsReverseRegistrarAddress,
                value: '0x0',
                data: ReverseRegistrarInterface.encodeFunctionData('setName', [
                    '',
                ]),
                comment: `Unsetting your current VeChain nickname of the account ${humanAddress(
                    account?.address ?? '',
                    4,
                    4,
                )}`,
                abi: ReverseRegistrarInterface.getFunction('setName'),
            });

            return clausesArray;
        }

        if (!subdomain) throw new Error('Invalid subdomain');

        const fullDomain = `${subdomain}.${domain}`;

        // Always unset current nickname first
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

        if (alreadyOwned) {
            // For already owned domains, set the name in the reverse registrar
            clausesArray.push({
                to: getConfig(network.type).vetDomainsReverseRegistrarAddress,
                value: '0x0',
                data: ReverseRegistrarInterface.encodeFunctionData('setName', [
                    fullDomain,
                ]),
                comment: `Setting your VeChain nickname to ${fullDomain}`,
                abi: ReverseRegistrarInterface.getFunction('setName'),
            });

            // Also set the address in the public resolver
            const PublicResolverInterface = new ethers.Interface([
                'function setAddr(bytes32 node, address addr)',
            ]);

            // Calculate the namehash for the domain
            const domainNode = ethers.namehash(fullDomain);

            clausesArray.push({
                to: getConfig(network.type).vetDomainsPublicResolverAddress,
                value: '0x0',
                data: PublicResolverInterface.encodeFunctionData('setAddr', [
                    domainNode,
                    account?.address || '',
                ]),
                comment: `Setting the address for ${fullDomain} to ${humanAddress(
                    account?.address ?? '',
                    4,
                    4,
                )}`,
                abi: PublicResolverInterface.getFunction('setAddr'),
            });
        } else {
            if (isVeWorldDomain(domain)) {
                // For new domains, claim the subdomain
                clausesArray.push({
                    to: getConfig(network.type)
                        .veWorldSubdomainClaimerContractAddress,
                    value: '0x0',
                    data: SubdomainClaimerInterface.encodeFunctionData(
                        'claim',
                        [
                            subdomain,
                            getConfig(network.type)
                                .vetDomainsPublicResolverAddress,
                        ],
                    ),
                    comment: `Claim VeChain subdomain: ${subdomain}.${domain}`,
                    abi: SubdomainClaimerInterface.getFunction('claim'),
                });

                clausesArray.push({
                    to: getConfig(network.type)
                        .vetDomainsReverseRegistrarAddress,
                    value: '0x0',
                    data: ReverseRegistrarInterface.encodeFunctionData(
                        'setName',
                        [subdomain + '.' + domain],
                    ),
                    comment: `Set ${subdomain}.${domain} as the VeChain nickname of the account ${humanAddress(
                        account?.address ?? '',
                        4,
                        4,
                    )}`,
                    abi: ReverseRegistrarInterface.getFunction('setName'),
                });
            } else {
                throw new Error(
                    'primary .vet domains buying is not supported yet',
                );
            }
        }

        return clausesArray;
    }, [
        subdomain,
        domain,
        alreadyOwned,
        isUnsetting,
        account?.address,
        network.type,
    ]);

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
                '.veworld.vet',
            ),
            refetchType: 'none',
        });
        queryClient.cancelQueries({
            queryKey: getDomainsOfAddressQueryKey(
                account?.address ?? '',
                '.vet',
            ),
            refetchType: 'none',
        });

        queryClient.cancelQueries({
            queryKey: getAvatarOfAddressQueryKey(account?.address ?? ''),
            refetchType: 'none',
        });

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
                '.vet',
            ),
        });

        queryClient.refetchQueries({
            queryKey: getDomainsOfAddressQueryKey(
                account?.address ?? '',
                '.veworld.vet',
            ),
        });

        queryClient.invalidateQueries({
            queryKey: getAvatarOfAddressQueryKey(account?.address ?? ''),
        });

        queryClient.refetchQueries({
            queryKey: getAvatarOfAddressQueryKey(account?.address ?? ''),
        });

        queryClient.invalidateQueries({
            queryKey: getTextRecordsQueryKey(subdomain + '.' + domain),
        });

        queryClient.refetchQueries({
            queryKey: getTextRecordsQueryKey(subdomain + '.' + domain),
        });

        onSuccess?.();
    }, [onSuccess, subdomain, domain, queryClient, account]);

    const result = useSendTransaction({
        signerAccountAddress: account?.address ?? '',
        privyUIOptions: {
            title: 'Sign to claim your VeChain nickname',
            description: `Claim ${subdomain} as your VeChain nickname`,
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

const isVeWorldDomain = (domain: string) => {
    return domain.endsWith('veworld.vet');
};
