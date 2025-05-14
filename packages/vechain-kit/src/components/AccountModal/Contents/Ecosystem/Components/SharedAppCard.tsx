import { Card, CardBody, Image, Text, VStack, Box } from '@chakra-ui/react';
import { notFoundImage } from '@/utils';
import React from 'react';
import { CategoryLabel } from './CategoryLabel';

export type SharedAppCardProps = {
    name?: string;
    imageUrl: string;
    linkUrl: string;
    category?: string;
    logoComponent?: JSX.Element;
    onClick: () => void;
    size?: 'sm' | 'md';
};

export const SharedAppCard = ({
    name,
    imageUrl,
    logoComponent,
    category,
    onClick,
    size = 'md',
}: SharedAppCardProps) => {
    return (
        <Card
            variant="vechainKitAppCard"
            _hover={{ opacity: 0.8 }}
            cursor="pointer"
            onClick={onClick}
            position="relative"
        >
            {category && (
                <Box position="absolute" top="2" right="2" zIndex="1">
                    <CategoryLabel category={category} />
                </Box>
            )}
            <CardBody p={size === 'sm' ? 2 : 4} alignItems="center">
                <VStack spacing={2} h="100%" justifyContent="space-between">
                    {logoComponent
                        ? logoComponent
                        : imageUrl && (
                              <Image
                                  src={imageUrl}
                                  fallbackSrc={notFoundImage}
                                  alt={name}
                                  height="90px"
                                  objectFit="contain"
                                  rounded="full"
                              />
                          )}
                    {name && (
                        <Text
                            fontWeight="medium"
                            wordBreak="break-word"
                            noOfLines={1}
                            textAlign="center"
                            w="full"
                        >
                            {name}
                        </Text>
                    )}
                </VStack>
            </CardBody>
        </Card>
    );
};
