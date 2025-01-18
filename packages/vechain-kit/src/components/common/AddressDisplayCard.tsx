import {
    Box,
    Text,
    HStack,
    VStack,
    Image,
    useColorMode,
} from '@chakra-ui/react';
import { humanAddress } from '@/utils';

type AddressDisplayCardProps = {
    label: string;
    address: string;
    domain?: string;
    imageSrc: string;
    imageAlt?: string;
    hideAddress?: boolean;
};

export const AddressDisplayCard = ({
    label,
    address,
    domain,
    imageSrc,
    imageAlt = 'Account',
    hideAddress = false,
}: AddressDisplayCardProps) => {
    const { colorMode } = useColorMode();
    const isDark = colorMode === 'dark';

    return (
        <Box
            w="full"
            p={4}
            borderRadius="lg"
            bg={isDark ? '#ffffff0f' : 'gray.50'}
            wordBreak="break-word"
        >
            <Text fontSize="sm" fontWeight="bold" mb={2}>
                {label}
            </Text>
            <HStack minH={'50px'}>
                <Image
                    src={imageSrc}
                    alt={imageAlt}
                    boxSize="40px"
                    borderRadius="xl"
                />
                <VStack align="start" spacing={0}>
                    {domain ? (
                        <>
                            <Text fontWeight="medium" fontSize="sm">
                                {domain}
                            </Text>
                            {!hideAddress && (
                                <Text fontSize="xs" opacity={0.5}>
                                    {humanAddress(address, 6, 4)}
                                </Text>
                            )}
                        </>
                    ) : (
                        <Text fontWeight="medium" fontSize="sm">
                            {humanAddress(address, 6, 4)}
                        </Text>
                    )}
                </VStack>
            </HStack>
        </Box>
    );
};
