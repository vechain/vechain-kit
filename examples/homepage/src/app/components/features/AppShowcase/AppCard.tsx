'use client';

import {
    Box,
    Flex,
    VStack,
    HStack,
    Text,
    Button,
    Image,
    Badge,
    Card,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { AppData } from './appData';

interface AppCardProps {
    app: AppData;
}

// Theme colors matching ScrollableInfoSections
const cardBackgroundColors = [
    '#e0daea', // light purple
    '#dae8fb', // light blue
    '#eae3d1', // light beige
    '#f0e8d8', // light tan
    '#e1e5e4', // light grey-green
    '#e0daea', // light purple (repeat)
    '#dae8fb', // light blue (repeat)
];

// Get a consistent color for each app based on its id
const getCardBgColor = (appId: string): string => {
    const appIds = [
        'stargate',
        'vebetter',
        'cleanify',
        'betterswap',
        'vetrade',
        'velottery',
        'solarwise',
    ];
    const appIndex = appIds.indexOf(appId);
    return cardBackgroundColors[appIndex >= 0 ? appIndex : 0];
};

export function AppCard({ app }: AppCardProps) {
    const { t } = useTranslation();
    const cardBg = getCardBgColor(app.id);

    return (
        <Card
            bg={cardBg}
            borderRadius="25px"
            overflow="hidden"
            boxShadow="lg"
            width="100%"
            height="100%"
            display="flex"
            flexDirection="column"
            p={0}
        >
            {/* Image Banner */}
            <Box
                position="relative"
                width="100%"
                height="200px"
                overflow="hidden"
                borderRadius="25px 25px 0 0"
            >
                <Image
                    src={app.image}
                    alt={app.name}
                    width="100%"
                    height="100%"
                    objectFit="cover"
                />
            </Box>

            {/* Card Body */}
            <VStack spacing={0} align="stretch" flex={1} p={6}>
                {/* Logo, Name, Tag, and Description */}
                <VStack spacing={4} align="stretch" flex={1}>
                    {/* Logo, Name, and Tag */}
                    <Flex justify="space-between" align="center">
                        <HStack spacing={3}>
                            <Image
                                src={app.logo}
                                alt={`${app.name} logo`}
                                width="40px"
                                height="40px"
                                borderRadius="md"
                                bg="white"
                                p={1}
                            />
                            <Text
                                fontSize="xl"
                                fontWeight="bold"
                                color="gray.900"
                            >
                                {app.name}
                            </Text>
                        </HStack>
                        <Badge
                            bg="white"
                            color="gray.700"
                            px={3}
                            py={1}
                            borderRadius="full"
                            fontSize="xs"
                            fontWeight="medium"
                            boxShadow="sm"
                        >
                            {app.tag}
                        </Badge>
                    </Flex>

                    {/* Description */}
                    <Text
                        fontSize="md"
                        color="gray.700"
                        lineHeight="1.6"
                        noOfLines={10}
                        whiteSpace="pre-line"
                    >
                        {app.description}
                    </Text>
                </VStack>

                {/* Visit Button */}
                <Button
                    as="a"
                    href={app.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    bg="gray.900"
                    color="white"
                    _hover={{
                        bg: 'gray.800',
                    }}
                    borderRadius="xl"
                    size="md"
                    width="100%"
                    fontWeight="medium"
                    textDecoration="none"
                    mt={4}
                >
                    {t('Visit')}
                </Button>
            </VStack>
        </Card>
    );
}
