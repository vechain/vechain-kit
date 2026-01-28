import {
    Card,
    CardBody,
    HStack,
    VStack,
    Text,
    IconButton,
    Icon,
    useToken,
    Box,
} from '@chakra-ui/react';
import { AccountAvatar } from '../../../../common';
import { humanAddress, humanDomain } from '../../../../../utils';
import { useTotalBalance, useWalletMetadata } from '../../../../../hooks';
import { StoredWallet } from '../../../../../hooks/api/wallet/useWalletStorage';
import { LuTrash2, LuCheck } from 'react-icons/lu';
import { useTranslation } from 'react-i18next';
// Direct import to avoid circular dependency via providers barrel export
import { useVeChainKitConfig } from '../../../../../providers/VeChainKitProvider';

type Props = {
    wallet: StoredWallet;
    isActive: boolean;
    onSelect: () => void;
    onRemove: () => void;
    showRemove?: boolean;
};

export const WalletCard = ({
    wallet,
    isActive,
    onSelect,
    onRemove,
    showRemove = true,
}: Props) => {
    const { t } = useTranslation();
    const { network } = useVeChainKitConfig();
    const { formattedBalance, isLoading: isLoadingBalance } = useTotalBalance({
        address: wallet.address,
    });
    const {
        domain,
        image,
        isLoading: isLoadingMetadata,
    } = useWalletMetadata(wallet.address, network.type);

    const textPrimary = useToken('colors', 'vechain-kit-text-primary');
    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');
    const borderColor = useToken('colors', 'vechain-kit-border');

    const isLoading = isLoadingBalance || isLoadingMetadata;

    return (
        <Card
            variant="vechainKitWalletCard"
            onClick={onSelect}
            borderWidth={isActive ? '2px' : '1px'}
            borderColor={isActive ? 'vechain-kit-primary' : borderColor}
            _hover={{
                borderColor: isActive
                    ? 'vechain-kit-primary'
                    : 'vechain-kit-text-secondary',
            }}
        >
            <CardBody p={4}>
                <HStack spacing={3} w="full" justifyContent="space-between">
                    <HStack spacing={3} flex={1} minW={0}>
                        <AccountAvatar
                            wallet={{
                                address: wallet.address,
                                domain: domain ?? undefined,
                                image: image ?? undefined,
                                isLoadingMetadata,
                            }}
                            props={{ width: 10, height: 10 }}
                        />
                        <VStack
                            spacing={0}
                            alignItems="flex-start"
                            flex={1}
                            minW={0}
                        >
                            <Text
                                fontSize="sm"
                                fontWeight="medium"
                                color={textPrimary}
                                noOfLines={1}
                            >
                                {domain
                                    ? humanDomain(domain, 22, 0)
                                    : humanAddress(wallet.address, 6, 4)}
                            </Text>
                            <Text
                                fontSize="xs"
                                color={textSecondary}
                                noOfLines={1}
                            >
                                {isLoading ? t('Loading...') : formattedBalance}
                            </Text>
                        </VStack>
                    </HStack>
                    {isActive && (
                        <Box>
                            <Icon
                                as={LuCheck}
                                boxSize={5}
                                color="vechain-kit-primary"
                            />
                        </Box>
                    )}
                    {showRemove && !isActive && (
                        <IconButton
                            aria-label={t('Remove wallet')}
                            icon={<Icon as={LuTrash2} />}
                            variant="vechainKitSecondary"
                            height="30px"
                            w="30px"
                            borderRadius="5px"
                            onClick={(e) => {
                                e.stopPropagation();
                                onRemove();
                            }}
                        />
                    )}
                </HStack>
            </CardBody>
        </Card>
    );
};
