import {
    Button,
    Box,
    HStack,
    VStack,
    Text,
    Icon,
    Image,
    Tag,
    useColorMode,
} from '@chakra-ui/react';
import { ElementType } from 'react';
import { useTranslation } from 'react-i18next';

interface ActionButtonProps {
    title: string;
    description: string;
    onClick: () => void;
    leftIcon?: ElementType;
    rightIcon?: ElementType;
    leftImage?: string;
    backgroundColor?: string;
    border?: string;
    hide?: boolean;
    _hover?: object;
    showComingSoon?: boolean;
    isDisabled?: boolean;
    stacked?: boolean;
}

export const ActionButton = ({
    leftIcon,
    rightIcon,
    title,
    description,
    onClick,
    leftImage,
    hide = false,
    showComingSoon = false,
    backgroundColor,
    _hover,
    isDisabled = false,
    stacked = false,
}: ActionButtonProps) => {
    const { t } = useTranslation();
    const { colorMode } = useColorMode();
    const baseBackgroundColor =
        backgroundColor ?? colorMode === 'dark'
            ? 'whiteAlpha.100'
            : '#00000005';
    return (
        <Button
            w={'full'}
            minH={'70px'}
            h={'fit-content'}
            py={stacked ? 0 : 4}
            onClick={onClick}
            display={hide ? 'none' : 'flex'}
            isDisabled={showComingSoon || isDisabled}
            bgColor={baseBackgroundColor}
            _hover={_hover}
        >
            <HStack w={'full'} justify={'space-between'}>
                <Box minW={'40px'}>
                    {leftImage ? (
                        <Image src={leftImage} alt="left-image" />
                    ) : (
                        <Icon as={leftIcon} fontSize={'25px'} />
                    )}
                </Box>
                <VStack
                    textAlign={'left'}
                    w={'full'}
                    flex={1}
                    justifyContent={'flex-start'}
                    alignItems={'flex-start'}
                >
                    <HStack justify={'flex-start'}>
                        <Text fontSize={'sm'} fontWeight={'400'}>
                            {title}
                        </Text>
                        {showComingSoon && (
                            <Tag size="sm" colorScheme="red">
                                {t('Coming Soon!')}
                            </Tag>
                        )}
                    </HStack>

                    <Text
                        fontSize={'xs'}
                        fontWeight={'400'}
                        opacity={0.5}
                        overflowWrap={'break-word'}
                        wordBreak={'break-word'}
                        whiteSpace={'normal'}
                        w={'full'}
                        pr={rightIcon ? '0px' : '10px'}
                    >
                        {description}
                    </Text>
                </VStack>

                {rightIcon && (
                    <VStack minW={'40px'} justifyContent={'flex-end'}>
                        <Icon as={rightIcon} fontSize={'20px'} opacity={0.5} />
                    </VStack>
                )}
            </HStack>
        </Button>
    );
};
