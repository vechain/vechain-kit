import {
    Heading,
    VStack,
    HStack,
    Icon,
    IconButton,
    Box,
} from '@chakra-ui/react';
import { useBalances, useRefreshBalances, useWallet, useCurrency } from '@/hooks';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { VscRefresh } from 'react-icons/vsc';
import { AssetIcons } from '@/components/WalletButton/AssetIcons';
import { MdOutlineNavigateNext } from 'react-icons/md';
import { useVeChainKitConfig } from '@/providers';
import { Analytics } from '@/utils/mixpanelClientInstance';

export const BalanceSection = ({
    mb,
    mt,
    onAssetsClick,
}: {
    mb?: number;
    mt?: number;
    onAssetsClick?: () => void;
}) => {
    const { darkMode: isDark } = useVeChainKitConfig();
    const { currentCurrency, getBalanceInCurrency } = useCurrency();
    const { t } = useTranslation();
    const { account } = useWallet();
    const { isLoading, totalBalanceUsd, totalBalanceEur, totalBalanceGbp } = useBalances({
        address: account?.address ?? '',
    });

    const { refresh } = useRefreshBalances();
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = async () => {
        Analytics.wallet.balanceRefreshed();
        setIsRefreshing(true);
        await refresh();
        setTimeout(() => {
            setIsRefreshing(false);
        }, 1500);
    };
    const compactFormatter = new Intl.NumberFormat('en-US', {
        notation: 'compact',
        compactDisplay: 'short',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        style: 'currency',
        currency: currentCurrency,
    });

    return (
        <VStack w="full" justifyContent={'start'} spacing={2} mt={mt} mb={mb}>
            <Heading size={'xs'} fontWeight={'500'} w={'full'} opacity={0.5}>
                {t('Balance')}
            </Heading>
            <HStack
                w={'full'}
                justifyContent={'space-between'}
                alignItems={'baseline'}
                role="group"
            >
                <Heading size={'2xl'} fontWeight={'700'}>
                    {compactFormatter.format(getBalanceInCurrency(currentCurrency, {
                        totalBalanceEur,
                        totalBalanceGbp,
                        totalBalanceUsd
                    }) ?? 0)}
                </Heading>

                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    w="32px"
                    h="32px"
                >
                    <IconButton
                        aria-label="Refresh balances"
                        variant="ghost"
                        size="sm"
                        opacity={0.5}
                        _hover={{ opacity: 0.8 }}
                        onClick={handleRefresh}
                        icon={<Icon as={VscRefresh} boxSize={4} />}
                        isLoading={isLoading || isRefreshing}
                        sx={{
                            '& > span.chakra-button__spinner': {
                                width: '16px',
                                height: '16px',
                                position: 'absolute',
                            },
                        }}
                    />
                </Box>
            </HStack>
            <HStack w={'full'} justifyContent={'flex-start'}>
                <AssetIcons
                    onClick={onAssetsClick}
                    maxIcons={10}
                    iconSize={26}
                    iconsGap={3}
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
                        width: '100%',
                        mt: 2,
                        backgroundColor: isDark ? '#ffffff0a' : 'blackAlpha.50',
                        borderRadius: 'xl',
                        p: 3,
                        cursor: 'pointer',
                        _hover: {
                            backgroundColor: isDark
                                ? '#ffffff12'
                                : 'blackAlpha.200',
                        },
                        justifyContent: 'space-between',
                    }}
                />
            </HStack>
        </VStack>
    );
};
