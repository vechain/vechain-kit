import {
    UseSendTransactionReturnValue,
    getAvatarOfAddressQueryKey,
    getDomainsOfAddressQueryKey,
    getEnsRecordExistsQueryKey,
    getTextRecordsQueryKey,
    getVechainDomainQueryKey,
    getAvatarQueryKey,
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
import { useRefreshMetadata } from '../wallet/useRefreshMetadata';

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
    const { refresh: refreshMetadata } = useRefreshMetadata(
        subdomain + '.' + domain,
        account?.address ?? '',
    );

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
        const fullDomain = `${subdomain}.${domain}`;
        const address = account?.address ?? '';

        // First invalidate all related queries
        await Promise.all([
            queryClient.invalidateQueries({
                queryKey: getVechainDomainQueryKey(address),
            }),
            queryClient.invalidateQueries({
                queryKey: getVechainDomainQueryKey(fullDomain),
            }),
            queryClient.invalidateQueries({
                queryKey: getEnsRecordExistsQueryKey(subdomain),
            }),
            queryClient.invalidateQueries({
                queryKey: getDomainsOfAddressQueryKey(address, '.vet'),
            }),
            queryClient.invalidateQueries({
                queryKey: getDomainsOfAddressQueryKey(address, '.veworld.vet'),
            }),
            queryClient.invalidateQueries({
                queryKey: getTextRecordsQueryKey(fullDomain),
            }),
        ]);

        // Use the dedicated metadata refresh utility which properly handles avatar queries
        await refreshMetadata();

        // Also ensure domains are properly refetched
        await Promise.all([
            queryClient.refetchQueries({
                queryKey: getVechainDomainQueryKey(address),
            }),
            queryClient.refetchQueries({
                queryKey: getVechainDomainQueryKey(fullDomain),
            }),
            queryClient.refetchQueries({
                queryKey: getDomainsOfAddressQueryKey(address, '.vet'),
            }),
            queryClient.refetchQueries({
                queryKey: getDomainsOfAddressQueryKey(address, '.veworld.vet'),
            }),
            queryClient.refetchQueries({
                queryKey: getAvatarQueryKey(
                    subdomain + '.' + domain,
                    network.type,
                ),
            }),
            queryClient.refetchQueries({
                queryKey: getTextRecordsQueryKey(fullDomain),
            }),
            queryClient.refetchQueries({
                queryKey: getEnsRecordExistsQueryKey(subdomain),
            }),
            queryClient.refetchQueries({
                queryKey: getAvatarOfAddressQueryKey(address),
            }),
        ]);

        onSuccess?.();
    }, [
        onSuccess,
        subdomain,
        domain,
        queryClient,
        account,
        network.type,
        refreshMetadata,
    ]);

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
