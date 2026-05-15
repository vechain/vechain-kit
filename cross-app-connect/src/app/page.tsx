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
import { VechainHeader } from './components/VechainHeader';

export default function LandingPage() {
    return (
        <Container maxW="2xl" py={12}>
            <Stack spacing={8}>
                <VechainHeader
                    title="VeChain Cross-App Connect"
                    subtitle="Whitelabel host for Privy cross-app connection and transaction flows."
                />
                <Box>
                    <Heading
                        size="sm"
                        mb={2}
                        color="text-strong"
                        fontFamily="heading"
                    >
                        Routes
                    </Heading>
                    <UnorderedList spacing={1} color="text-muted">
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
                <Text fontSize="sm" color="text-subtle" textAlign="center">
                    This page isn&apos;t opened directly by users.
                </Text>
            </Stack>
        </Container>
    );
}
