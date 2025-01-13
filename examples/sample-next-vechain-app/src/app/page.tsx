'use client';

import { Container } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import React from 'react';

const Home = dynamic(() => import('./pages/Home'), {
    ssr: false,
});

export default function Page() {
    return (
        <Container maxWidth="container.sm">
            <Home />
        </Container>
    );
}
