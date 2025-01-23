import { Card, CardBody, Image, Text, VStack } from '@chakra-ui/react';
import { notFoundImage } from '@/utils';

type SharedAppCardProps = {
    name: string;
    imageUrl: string;
    linkUrl: string;
    onClick: () => void;
};

export const SharedAppCard = ({
    name,
    imageUrl,
    onClick,
}: SharedAppCardProps) => {
    return (
        <Card
            variant="vechainKitAppCard"
            _hover={{ opacity: 0.8 }}
            cursor="pointer"
            onClick={onClick}
        >
            <CardBody p={4} alignItems="center">
                <VStack
                    spacing={3}
                    align="center"
                    justify="center"
                    width="100%"
                >
                    {imageUrl && (
                        <Image
                            src={imageUrl}
                            fallbackSrc={notFoundImage}
                            alt={name}
                            width="100%"
                            height="100px"
                            objectFit="contain"
                            rounded="12px"
                        />
                    )}
                    <Text
                        position="absolute"
                        bottom={'5px'}
                        fontWeight="medium"
                        wordBreak="break-word"
                        noOfLines={1}
                        width="90%"
                        textAlign="center"
                    >
                        {name}
                    </Text>
                </VStack>
            </CardBody>
        </Card>
    );
};
