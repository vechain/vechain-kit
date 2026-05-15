'use client';

import {
    Box,
    Code,
    Container,
    Heading,
    ListItem,
    Stack,
    Text,
    UnorderedList,
} from '@chakra-ui/react';

export default function LandingPage() {
    return (
        <Container maxW="2xl" py={16}>
            <Stack spacing={6}>
                <Heading size="lg">VeChain Cross-App Connect</Heading>
                <Text>
                    Whitelabel host for Privy cross-app connection and
                    transaction flows. This page is not opened directly by
                    users.
                </Text>
                <Box>
                    <Heading size="sm" mb={2}>
                        Routes
                    </Heading>
                    <UnorderedList spacing={1}>
                        <ListItem>
                            <Code>/cross-app/connect</Code> &mdash; handles
                            connection requests
                        </ListItem>
                        <ListItem>
                            <Code>/cross-app/transact</Code> &mdash; handles
                            transaction / signing requests
                        </ListItem>
                    </UnorderedList>
                </Box>
            </Stack>
        </Container>
    );
}
