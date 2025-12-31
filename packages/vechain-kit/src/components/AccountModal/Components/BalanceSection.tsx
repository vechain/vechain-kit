import {
    Heading,
    VStack,
    HStack,
    Icon,
    Button,
    useToken,
} from '@chakra-ui/react';
import { useWallet, useTotalBalance } from '@/hooks';
import { useTranslation } from 'react-i18next';
import { AssetIcons } from '@/components/WalletButton/AssetIcons';
import { LuChevronRight } from 'react-icons/lu';

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
    const { formattedBalance } = useTotalBalance({
        address: account?.address ?? '',
    });

    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');

    return (
        <VStack w="full" justifyContent={'start'} spacing={1} mt={mt} mb={mb}>
            <VStack
                w={'full'}
                justifyContent={'flex-start'}
                alignItems={'flex-start'}
                spacing={2}
                p={2}
            >
                <Heading
                    size={'xs'}
                    fontWeight={'800'}
                    color={textSecondary}
                    textTransform={'uppercase'}
                    letterSpacing={1.2}
                >
                    {t('Balance')}
                </Heading>
                <Heading size={'2xl'} fontWeight={'700'}>
                    {formattedBalance}
                </Heading>
            </VStack>

            <Button
                onClick={onAssetsClick}
                h="fit-content"
                variant="vechainKitSecondary"
                p={2}
            >
                <HStack
                    w={'full'}
                    justifyContent={'flex-start'}
                    data-testid="all-assets-button"
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
            </Button>
        </VStack>
    );
};
