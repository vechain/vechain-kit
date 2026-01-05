import {
    Heading,
    VStack,
    HStack,
    Icon,
    IconButton,
    Button,
    useToken,
} from '@chakra-ui/react';
import { useRefreshBalances, useWallet, useTotalBalance, LocalStorageKey } from '@/hooks';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LuRefreshCw } from 'react-icons/lu';
import { AssetIcons } from '@/components/WalletButton/AssetIcons';
import { LuChevronRight } from 'react-icons/lu';
import { GoEye, GoEyeClosed } from 'react-icons/go';
import { getLocalStorageItem, setLocalStorageItem } from '@/utils/ssrUtils';

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
    const { formattedBalance, isLoading } = useTotalBalance({
        address: account?.address ?? '',
    });

    const { refresh } = useRefreshBalances();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await refresh();
        setTimeout(() => {
            setIsRefreshing(false);
        }, 1500);
    };
    const [showAssets, setShowAssets] = useState(() => {
        try {
            const stored = getLocalStorageItem(LocalStorageKey.SHOW_ASSETS);
            return stored ? JSON.parse(stored) : true;
        } catch (error) {
            console.error(error);
            return true;
        }
    });
    useEffect(() => {
        setLocalStorageItem(LocalStorageKey.SHOW_ASSETS, String(showAssets));
    }, [showAssets]);

    return (
        <VStack w="full" justifyContent={'start'} spacing={1} mt={mt} mb={mb}>
            <HStack
                w={'full'}
                justifyContent={'space-between'}
                alignItems={'center'}
                spacing={0}
                role="group"
            >
                <Heading
                    size={'xs'}
                    fontWeight={'800'}
                    color={textSecondary}
                    textTransform={'uppercase'}
                    letterSpacing={1.2}
                    ml={'5px'}
                >
                    {t('Assets')}
                </Heading>

                <HStack
                    spacing={0}
                    alignItems="center"
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
                    <IconButton
                        aria-label="Show/hide assets"
                        variant="ghost"
                        size="sm"
                        opacity={0.5}
                        _hover={{ opacity: 0.8 }}
                        onClick={() => setShowAssets(!showAssets)}
                        icon={<Icon as={showAssets ? GoEye : GoEyeClosed} boxSize={4} />}
                    />
                </HStack>
            </HStack>

            <Button
                onClick={onAssetsClick}
                h="fit-content"
                variant="vechainKitSecondary"
            >
                <VStack
                    spacing={2}
                    w="full"
                    justifyContent="flex-start"
                    alignItems="flex-start"
                    mt={4}
                    mb={4}
                >
                    <Heading size={'2xl'} fontWeight={'700'}>
                        { showAssets ? formattedBalance : formattedBalance[0] + '*'.repeat(formattedBalance.slice(1).length) }
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
            </Button>
        </VStack>
    );
};
