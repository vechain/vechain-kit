'use client';

import { Box, Heading, Text } from '@chakra-ui/react';
import {
    useWallet,
    useCurrentAllocationsRoundId,
    useIsPerson,
} from '@vechain/vechain-kit/hooks';

export function DaoInfo() {
    const { account } = useWallet();
    const { data: currentAllocationsRoundId } = useCurrentAllocationsRoundId();
    const { data: isValidPassport } = useIsPerson(account?.address);

    return (
        <Box>
            <Heading size={'md'}>VeBetterDAO</Heading>
            <Text data-testid="current-allocation-round-id">
                Current Allocations Round ID: {currentAllocationsRoundId}
            </Text>
            <Text data-testid="is-passport-valid">
                Is Passport Valid: {isValidPassport?.toString()}
            </Text>
        </Box>
    );
}
