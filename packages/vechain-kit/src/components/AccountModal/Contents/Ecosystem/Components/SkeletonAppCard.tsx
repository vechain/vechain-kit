import { Card, CardBody, VStack, Skeleton } from '@chakra-ui/react';

export const SkeletonAppCard = () => {
    return (
        <Card variant="vechainKitAppCard">
            <CardBody p={4} alignItems="center">
                <VStack
                    spacing={3}
                    align="center"
                    justify="center"
                    width="100%"
                >
                    <Skeleton height="100px" width="100%" rounded="12px" />
                    <Skeleton height="20px" width="80%" rounded="md" />
                </VStack>
            </CardBody>
        </Card>
    );
};
