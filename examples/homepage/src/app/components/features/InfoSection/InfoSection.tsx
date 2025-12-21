'use client';

import {
    Card,
    Grid,
    VStack,
    Heading,
    Text,
    Image,
    Box,
    useColorMode,
    useBreakpointValue,
} from '@chakra-ui/react';

interface InfoSectionProps {
    bg?: string;
    title: string;
    content: string;
    imageSrc: string;
    imageAlt: string;
    imageWidth?: string;
    mobileImageSrc?: string;
}

const isVideoFile = (src: string): boolean => {
    return /\.(mp4|webm|ogg|mov)$/i.test(src);
};

export function InfoSection({
    bg = '#e0daea',
    title,
    content,
    imageSrc,
    imageAlt,
    imageWidth = '450px',
    mobileImageSrc,
}: InfoSectionProps) {
    const { colorMode } = useColorMode();
    const finalImageSrc = useBreakpointValue({
        base: mobileImageSrc || imageSrc,
        md: imageSrc,
    });
    const isVideo = isVideoFile(finalImageSrc || imageSrc);

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

                {isVideo ? (
                    <Box
                        as="video"
                        src={finalImageSrc || imageSrc}
                        autoPlay
                        loop
                        muted
                        playsInline
                        w={['100%', imageWidth]}
                        borderRadius="md"
                        sx={{
                            backgroundColor: 'transparent',
                            background: 'transparent',
                            display: 'block',
                        }}
                    />
                ) : (
                    <Image
                        src={finalImageSrc || imageSrc}
                        alt={imageAlt}
                        w={['100%', imageWidth]}
                        sx={{
                            width: '100%',
                            height: 'auto',
                            display: 'block',
                            WebkitMaskImage:
                                'radial-gradient(ellipse at center, rgba(0,0,0,1) 80%, rgba(0,0,0,0) 99%, rgba(0,0,0,0) 95%)',
                            maskImage:
                                'radial-gradient(ellipse at center, rgba(0,0,0,1) 80%,rgba(0,0,0,0) 99%, rgba(0,0,0,0) 95%)',
                        }}
                    />
                )}
            </Grid>
        </Card>
    );
}
