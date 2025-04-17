'use client';

import { Box, Heading, Text } from '@chakra-ui/react';
import {
    useWallet,
    useCurrentAllocationsRoundId,
    useSelectedGmNft,
    useParticipatedInGovernance,
    useIsPerson,
} from '@vechain/vechain-kit';

export function DaoInfo() {
    const { account } = useWallet();
    const { data: currentAllocationsRoundId } = useCurrentAllocationsRoundId();
    const { gmId } = useSelectedGmNft(account?.address ?? '');
    const { data: participatedInGovernance } = useParticipatedInGovernance(
        account?.address ?? '',
    );
    const { data: isValidPassport } = useIsPerson(account?.address);

    return (
        <Box>
            <Heading size={'md'}>VeBetterDAO</Heading>
            <Text data-testid="current-allocation-round-id">
                Current Allocations Round ID: {currentAllocationsRoundId}
            </Text>
            <Text data-testid="selected-gm-nft">
                Selected GM NFT: {gmId === '0' ? 'None' : gmId}
            </Text>
            <Text data-testid="participated-in-governance">
                Participated in Governance:{' '}
                {participatedInGovernance?.toString()}
            </Text>
            <Text data-testid="is-passport-valid">
                Is Passport Valid: {isValidPassport?.toString()}
            </Text>
        </Box>
    );
}
