'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const Home = dynamic(() => import('./pages/Home'), {
    ssr: false,
});

export default function Page() {
    return <Home />;
}
