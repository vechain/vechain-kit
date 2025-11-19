import {
    Heading,
    VStack,
    HStack,
    Icon,
    IconButton,
    Box,
} from '@chakra-ui/react';
import { useRefreshBalances, useWallet, useTotalBalance } from '@/hooks';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LuRefreshCw } from 'react-icons/lu';
import { AssetIcons } from '@/components/WalletButton/AssetIcons';
import { LuChevronRight } from 'react-icons/lu';
import { useVeChainKitConfig } from '@/providers';

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
    const { t } = useTranslation();
    const { account } = useWallet();
    const { formattedBalance, isLoading } = useTotalBalance({
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
        <VStack w="full" justifyContent={'start'} spacing={1} mt={mt} mb={mb}>
            <HStack
                w={'full'}
                justifyContent={'flex-start'}
                alignItems={'center'}
                spacing={2}
                role="group"
            >
                <Heading size={'xs'} fontWeight={'500'} opacity={0.5}>
                    {t('Assets')}
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
                        icon={<Icon as={LuRefreshCw} boxSize={4} />}
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

            <VStack
                onClick={onAssetsClick}
                width="100%"
                mt={1}
                backgroundColor={isDark ? '#ffffff0a' : 'blackAlpha.50'}
                borderRadius="xl"
                p={3}
                cursor="pointer"
                _hover={{
                    backgroundColor: isDark ? '#ffffff12' : 'blackAlpha.200',
                }}
                justifyContent="flex-start"
                alignItems="flex-start"
                spacing={2}
                transition="all 0.2s"
            >
                <Heading size={'2xl'} fontWeight={'700'}>
                    {formattedBalance}
                </Heading>

                <HStack
                    w={'full'}
                    justifyContent={'flex-start'}
                    data-testid="all-assets-button"
                    mt={2}
                >
                    <AssetIcons
                        style={{
                            width: '100%',
                            justifyContent: 'space-between',
                        }}
                        maxIcons={10}
                        iconSize={26}
                        iconsGap={3}
                        address={account?.address ?? ''}
                        showNoAssetsWarning={true}
                        rightIcon={
                            <Icon
                                as={LuChevronRight}
                                boxSize={5}
                                opacity={0.5}
                                marginLeft={2}
                            />
                        }
                    />
                </HStack>
            </VStack>
        </VStack>
    );
};
