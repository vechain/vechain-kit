import { Box, Text, VStack, useToken } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import {
    useBetterSwapLpPositions,
    useNavigatorPosition,
    useStargatePositions,
    useWallet,
} from '@/hooks';
import { StargateCard } from './StakingCards/StargateCard';
import { NavigatorsCard } from './StakingCards/NavigatorsCard';
import { BetterSwapLpCard } from './StakingCards/BetterSwapLpCard';

export const StakingTab = () => {
    const { t } = useTranslation();
    const { account } = useWallet();
    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');

    const stargate = useStargatePositions(account?.address);
    const navigators = useNavigatorPosition(account?.address);
    const lp = useBetterSwapLpPositions(account?.address);

    const hasAnyStargate = stargate.positions.length > 0;
    const hasNavigator = navigators.isNavigator || navigators.isDelegated;
    const hasLp = lp.positions.length > 0;

    const isLoading =
        stargate.isLoading || navigators.isLoading || lp.isLoading;
    const hasAny = hasAnyStargate || hasNavigator || hasLp;

    if (!isLoading && !hasAny) {
        return (
            <Box py={6} textAlign="center">
                <Text color={textSecondary}>
                    {t('No staking positions yet')}
                </Text>
            </Box>
        );
    }

    return (
        <VStack spacing={3} align="stretch" w="full">
            {hasAnyStargate && <StargateCard />}
            {hasNavigator && <NavigatorsCard />}
            {hasLp && <BetterSwapLpCard />}
        </VStack>
    );
};
