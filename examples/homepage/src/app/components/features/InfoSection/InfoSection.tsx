'use client';

import {
    Card,
    Grid,
    VStack,
    Heading,
    Text,
    Image,
    useColorMode,
} from '@chakra-ui/react';

interface InfoSectionProps {
    bg?: string;
    title: string;
    content: string;
    imageSrc: string;
    imageAlt: string;
    imageWidth?: string;
}

export function InfoSection({
    bg = '#e0daea',
    title,
    content,
    imageSrc,
    imageAlt,
    imageWidth = '450px',
}: InfoSectionProps) {
    const { colorMode } = useColorMode();

    return (
        <Card
            px={[0, 20]}
            py={[0, 20]}
            mx={[4, '5%']}
            borderRadius={25}
            bg={bg}
            minH={'550px'}
            justifyContent={'center'}
        >
            <Grid
                templateColumns={['repeat(1, 1fr)', 'repeat(2, 1fr)']}
                gap={4}
                placeItems={'center center'}
                alignItems={'center'}
            >
                <VStack spacing={4} align="start" p={10}>
                    <Heading
                        as="h2"
                        fontSize="3xl"
                        fontWeight="bold"
                        color={colorMode === 'dark' ? 'white' : 'gray.900'}
                    >
                        {title}
                    </Heading>
                    <Text
                        fontSize="lg"
                        color={colorMode === 'dark' ? 'gray.400' : 'gray.600'}
                    >
                        {content}
                    </Text>
                </VStack>

                <Image src={imageSrc} alt={imageAlt} w={['80%', imageWidth]} />
            </Grid>
        </Card>
    );
}
