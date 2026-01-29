'use client';

import { Box, Heading, Text } from '@chakra-ui/react';
import { useWallet } from '@vechain/vechain-kit/hooks';

export function ConnectionInfo() {
    const { connection } = useWallet();

    return (
        <Box>
            <Heading size={'md'}>
                <b>Connection</b>
            </Heading>
            <Text data-testid="connection-type">Type: {connection.source.type}</Text>
            <Text data-testid="network">Network: {connection.network}</Text>
        </Box>
    );
}
