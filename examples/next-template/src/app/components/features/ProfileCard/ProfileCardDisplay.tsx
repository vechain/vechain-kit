'use client';

import { Box } from '@chakra-ui/react';
import { useWallet, ProfileCard } from '@vechain/vechain-kit';

export function ProfileCardDisplay() {
    const { account } = useWallet();

    return (
        <Box>
            <ProfileCard
                address={account?.address ?? ''}
                showHeader={true}
                showLinks={true}
                showDescription={true}
                showDisplayName={true}
                showEdit={true}
            />
        </Box>
    );
}
