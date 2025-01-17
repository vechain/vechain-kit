import { Text, VStack } from '@chakra-ui/react';
import { useWallet } from '@/hooks';
import { humanAddress } from '@/utils';

type WalletDisplayProps = {
    variant: 'icon' | 'iconAndDomain' | 'iconDomainAndAddress';
};

export const WalletDisplay = ({ variant }: WalletDisplayProps) => {
    const { account } = useWallet();

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

    return (
        <VStack
            justifyContent="flex-start"
            spacing={0}
            alignItems="flex-start"
            textAlign="left"
        >
            {account.domain && (
                <Text fontSize="sm" w="100%" fontWeight={'bold'}>
                    {account.domain}
                </Text>
            )}
            <Text
                mt={account.domain ? '5px' : 0}
                fontSize={account.domain ? 'xs' : 'sm'}
                fontWeight={account.domain ? '400' : 'bold'}
                w="100%"
                opacity={account.domain ? 0.5 : 1}
            >
                {humanAddress(account.address ?? '', 2, 4)}
            </Text>
        </VStack>
    );
};
