'use client';

import { Box, Heading, Text } from '@chakra-ui/react';
import {
    useWallet,
    useCurrentAllocationsRoundId,
    useParticipatedInGovernance,
} from '@vechain/vechain-kit';

export function DaoInfo() {
    const { account } = useWallet();
    const { data: currentAllocationsRoundId } = useCurrentAllocationsRoundId();
    const { data: participatedInGovernance } = useParticipatedInGovernance(
        account?.address ?? '',
    );

    return (
        <Box>
            <Heading size={'md'}>VeBetterDAO</Heading>
            <Text data-testid="current-allocation-round-id">
                Current Allocations Round ID: {currentAllocationsRoundId}
            </Text>
            <Text data-testid="participated-in-governance">
                Participated in Governance:{' '}
                {participatedInGovernance?.toString()}
            </Text>
        </Box>
    );
}
