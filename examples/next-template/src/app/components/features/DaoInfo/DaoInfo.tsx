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
            <Text>
                Current Allocations Round ID: {currentAllocationsRoundId}
            </Text>
            <Text>Selected GM NFT: {gmId === '0' ? 'None' : gmId}</Text>
            <Text>
                Participated in Governance:{' '}
                {participatedInGovernance?.toString()}
            </Text>
            <Text>Is Passport Valid: {isValidPassport?.toString()}</Text>
        </Box>
    );
}
