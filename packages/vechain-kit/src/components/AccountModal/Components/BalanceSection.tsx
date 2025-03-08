import { Heading, VStack, HStack, Icon, IconButton } from '@chakra-ui/react';
import { useBalances, useRefreshBalances, useWallet } from '@/hooks';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { VscRefresh } from 'react-icons/vsc';
import { AssetIcons } from '@/components/WalletButton/AssetIcons';
import { MdOutlineNavigateNext } from 'react-icons/md';

const compactFormatter = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 2,
});

export const BalanceSection = ({
    mb,
    mt,
    onAssetsClick,
}: {
    mb?: number;
    mt?: number;
    onAssetsClick?: () => void;
}) => {
    const { t } = useTranslation();
    const { account } = useWallet();
    const { isLoading, totalBalance } = useBalances({
        address: account?.address ?? '',
    });

    const { refresh } = useRefreshBalances();
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await refresh();
        setTimeout(() => {
            setIsRefreshing(false);
        }, 1500);
    };

    return (
        <VStack w="full" justifyContent={'start'} spacing={2} mt={mt} mb={mb}>
            <Heading size={'xs'} fontWeight={'500'} w={'full'} opacity={0.5}>
                {t('Balance')}
            </Heading>
            <HStack
                w={'full'}
                justifyContent={'flex-start'}
                alignItems={'baseline'}
                role="group"
            >
                <Heading size={'3xl'} fontWeight={'500'}>
                    ${compactFormatter.format(totalBalance ?? 0)}
                </Heading>

                <IconButton
                    aria-label="Refresh balances"
                    size={'xl'}
                    ml={'10px'}
                    variant="link"
                    onClick={handleRefresh}
                    icon={<Icon as={VscRefresh} boxSize={6} />}
                    isLoading={isLoading || isRefreshing}
                    alignItems="center"
                    display={
                        isLoading || isRefreshing
                            ? 'inline-flex'
                            : { base: 'inline-flex', md: 'none' }
                    }
                    _groupHover={{ display: 'inline-flex' }}
                />
            </HStack>
            <HStack w={'full'} justifyContent={'flex-start'}>
                <AssetIcons
                    onClick={onAssetsClick}
                    maxIcons={10}
                    iconSize={20}
                    address={account?.address ?? ''}
                    showNoAssetsWarning={true}
                    rightIcon={
                        <Icon
                            as={MdOutlineNavigateNext}
                            boxSize={5}
                            opacity={0.5}
                            marginLeft={2}
                        />
                    }
                    style={{
                        mt: 2,
                        backgroundColor: 'whiteAlpha.200',
                        borderRadius: 'xl',
                        p: 2,
                        cursor: 'pointer',
                        _hover: {
                            backgroundColor: 'whiteAlpha.300',
                        },
                    }}
                />
            </HStack>
        </VStack>
    );
};
