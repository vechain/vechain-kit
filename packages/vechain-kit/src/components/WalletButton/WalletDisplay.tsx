import { useWallet } from '@/hooks';
import { humanAddress, humanDomain } from '@/utils';
import { HStack, Spinner, Text, useMediaQuery, VStack } from '@chakra-ui/react';
import { useMemo } from 'react';

import { AssetIcons } from './AssetIcons';
import { WalletDisplayVariant } from './types';

type WalletDisplayProps = {
    variant: WalletDisplayVariant;
};

export const WalletDisplay = ({ variant }: WalletDisplayProps) => {
    const { account } = useWallet();
    const [isSmallMobile] = useMediaQuery('(max-width: 480px)');

    const accountDomain = useMemo(() => {
        const isLongDomain = account?.domain && account.domain.length > 18;
        return isSmallMobile && isLongDomain
            ? humanDomain(account?.domain ?? '', 18, 0)
            : account?.domain;
    }, [isSmallMobile, account?.domain]);

    if (!account) return <Spinner />;

    if (variant === 'icon') {
        return null;
    }

    if (variant === 'iconAndDomain') {
        return account.domain ? (
            <Text fontSize="sm">{accountDomain}</Text>
        ) : (
            <Text fontSize="sm">
                {humanAddress(account.address ?? '', 6, 4)}
            </Text>
        );
    }

    if (variant === 'iconDomainAndAssets') {
        return (
            <HStack spacing={4}>
                <VStack spacing={0} alignItems="flex-start">
                    {account.domain && (
                        <Text fontSize="sm" fontWeight="bold">
                            {accountDomain}
                        </Text>
                    )}
                    <Text
                        fontSize={account.domain ? 'xs' : 'sm'}
                        opacity={account.domain ? 0.5 : 1}
                    >
                        {humanAddress(account.address ?? '', 4, 4)}
                    </Text>
                </VStack>
                <AssetIcons address={account.address ?? ''} maxIcons={3} />
            </HStack>
        );
    }

    return (
        <VStack spacing={0} alignItems="flex-start">
            {account.domain && (
                <Text fontSize="sm" fontWeight="bold">
                    {accountDomain}
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
