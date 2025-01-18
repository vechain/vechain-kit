import {
    Button,
    Box,
    HStack,
    VStack,
    Text,
    Icon,
    Image,
    useColorMode,
    Tag,
} from '@chakra-ui/react';
import { ElementType } from 'react';
import { humanAddress } from '../../../utils';
import { useTranslation } from 'react-i18next';

interface AccountDetailsButtonProps {
    title: string;
    address: string;
    onClick: () => void;
    leftIcon?: ElementType;
    rightIcon?: ElementType;
    leftImage?: string;
    backgroundColor?: string;
    border?: string;
    isActive?: boolean;
}

export const AccountDetailsButton = ({
    leftIcon,
    rightIcon,
    title,
    address,
    onClick,
    leftImage,
    isActive = false,
}: AccountDetailsButtonProps) => {
    const { t } = useTranslation();
    const { colorMode } = useColorMode();
    const isDark = colorMode === 'dark';

    return (
        <Button
            w={'full'}
            minH={'70px'}
            h={'fit-content'}
            py={4}
            onClick={onClick}
            backgroundColor={isDark ? 'transparent' : 'transparent'}
            border={`1px solid ${isDark ? '#ffffff29' : '#ebebeb'}`}
        >
            <HStack w={'full'} justify={'space-between'}>
                <Box minW={'40px'}>
                    {leftImage ? (
                        <Image
                            src={leftImage}
                            w={'25px'}
                            h={'25px'}
                            alt="left-image"
                        />
                    ) : (
                        <Icon as={leftIcon} fontSize={'25px'} />
                    )}
                </Box>
                <VStack textAlign={'left'} w={'full'} flex={1}>
                    <HStack
                        w={'full'}
                        spacing={2}
                        justifyContent={'flex-start'}
                    >
                        <Text fontSize={'sm'} fontWeight={'400'}>
                            {title}
                        </Text>
                    </HStack>
                    <Text
                        fontSize={'sm'}
                        fontWeight={'500'}
                        opacity={0.5}
                        overflowWrap={'break-word'}
                        wordBreak={'break-word'}
                        whiteSpace={'normal'}
                        w={'full'}
                    >
                        {humanAddress(address, 6, 4)}
                    </Text>
                </VStack>
                <VStack minW={'40px'} justifyContent={'flex-end'}>
                    <HStack justifyContent={'flex-end'} minW={'40px'}>
                        {isActive && (
                            <Tag size={'sm'} colorScheme={'green'}>
                                {t('Active')}
                            </Tag>
                        )}
                        <Icon as={rightIcon} fontSize={'20px'} opacity={0.5} />
                    </HStack>
                </VStack>
            </HStack>
        </Button>
    );
};
