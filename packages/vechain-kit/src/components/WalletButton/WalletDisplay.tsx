import { Spinner, Text, VStack, HStack } from '@chakra-ui/react';
import { useWallet } from '@/hooks';
import { humanAddress } from '@/utils';
import { AssetIcons } from './AssetIcons';
import { WalletDisplayVariant } from './types';

type WalletDisplayProps = {
    variant: WalletDisplayVariant;
};

export const WalletDisplay = ({ variant }: WalletDisplayProps) => {
    const { account } = useWallet();

    if (!account) return <Spinner />;

    if (variant === 'icon') {
        return null;
    }

    if (variant === 'iconAndDomain') {
        return account.domain ? (
            <Text fontSize="sm">{account.domain}</Text>
        ) : (
            <Text fontSize="sm">
                {humanAddress(account.address ?? '', 4, 4)}
            </Text>
        );
    }

    if (variant === 'iconDomainAndAssets') {
        return (
            <HStack spacing={2}>
                <VStack spacing={0} alignItems="flex-start">
                    {account.domain && (
                        <Text fontSize="sm" fontWeight="bold">
                            {account.domain}
                        </Text>
                    )}
                    <Text
                        fontSize={account.domain ? 'xs' : 'sm'}
                        opacity={account.domain ? 0.5 : 1}
                    >
                        {humanAddress(account.address ?? '', 4, 4)}
                    </Text>
                </VStack>
                <AssetIcons ml={2} address={account.address} maxIcons={3} />
            </HStack>
        );
    }

    return (
        <VStack spacing={0} alignItems="flex-start">
            {account.domain && (
                <Text fontSize="sm" fontWeight="bold">
                    {account.domain}
                </Text>
            )}
            <Text
                fontSize={account.domain ? 'xs' : 'sm'}
                opacity={account.domain ? 0.5 : 1}
            >
                {humanAddress(account.address ?? '', 4, 4)}
            </Text>
        </VStack>
    );
};
