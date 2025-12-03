'use client';

import {
    Card,
    Grid,
    VStack,
    Heading,
    Text,
    Image,
    useColorMode,
    Button,
    Link,
} from '@chakra-ui/react';

interface InfoSectionProps {
    bg?: string;
    title: string;
    content: string;
    imageSrc: string;
    imageAlt: string;
    button?: {
        text: string;
        href?: string;
        onClick?: () => void;
        isExternal?: boolean;
    };
}

export function InfoSection({
    bg = '#e0daea',
    title,
    content,
    imageSrc,
    imageAlt,
    button,
}: InfoSectionProps) {
    const { colorMode } = useColorMode();

    return (
        <Card
            px={[0, 20]}
            py={[0, 40]}
            mx={[4, '250px']}
            borderRadius={25}
            bg={bg}
        >
            <Grid
                templateColumns={['repeat(1, 1fr)', 'repeat(2, 1fr)']}
                gap={4}
                placeItems={'center stretch'}
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
                    {button && (
                        <Button
                            as={button.href ? Link : undefined}
                            href={button.href}
                            onClick={button.onClick}
                            isExternal={button.isExternal}
                            variant="homepageSecondary"
                        >
                            {button.text}
                        </Button>
                    )}
                </VStack>

                <Image src={imageSrc} alt={imageAlt} />
            </Grid>
        </Card>
    );
}
