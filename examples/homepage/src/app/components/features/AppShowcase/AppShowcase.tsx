'use client';

import { Card, Heading, Text, VStack } from '@chakra-ui/react';
import { Carousel } from '@/app/components/ui/Carousel';
import { AppCard } from './AppCard';
import { apps, AppData } from './appData';

export function AppShowcase() {
    return (
        <Card
            variant="section"
            py={{ base: 16, md: 20 }}
            px={{ base: 4, md: 8 }}
        >
            <VStack spacing={8} align="stretch" maxW="7xl" mx="auto" w="full">
                <Heading as="h2" size="lg" textAlign="center">
                    Apps Built with VeChain Kit
                </Heading>

                <Text textAlign="center" fontSize="lg" color="gray.500">
                    Discover all the possible ways to use the VeChain Kit to
                    build your next dApp.
                </Text>

                <Carousel<AppData>
                    items={apps}
                    renderItem={(app) => <AppCard app={app} />}
                    itemWidth={350}
                    itemSpacing={24}
                    wideMode={true}
                    blurSideItems={true}
                    infiniteLoop={true}
                />
            </VStack>
        </Card>
    );
}
