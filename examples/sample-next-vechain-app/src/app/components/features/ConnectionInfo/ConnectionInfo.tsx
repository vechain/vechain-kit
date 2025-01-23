'use client';

import { Box, Heading, Text } from '@chakra-ui/react';
import { useWallet } from '@vechain/vechain-kit';

export function ConnectionInfo() {
    const { connection } = useWallet();

    return (
        <Box>
            <Heading size={'md'}>
                <b>Connection</b>
            </Heading>
            <Text>Type: {connection.source.type}</Text>
            <Text>Network: {connection.network}</Text>
        </Box>
    );
}
