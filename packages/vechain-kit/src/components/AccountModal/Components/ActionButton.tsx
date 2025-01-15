import {
    Button,
    Box,
    HStack,
    VStack,
    Text,
    Icon,
    Image,
    Tag,
} from '@chakra-ui/react';
import { ElementType } from 'react';
import { FadeInView } from '../../common';

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
}: ActionButtonProps) => {
    return (
        <FadeInView>
            <Button
                w={'full'}
                minH={'70px'}
                h={'fit-content'}
                py={4}
                onClick={onClick}
                display={hide ? 'none' : 'flex'}
                isDisabled={showComingSoon}
                bgColor={backgroundColor}
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
                        <Text w={'full'} fontSize={'sm'} fontWeight={'400'}>
                            {title}
                        </Text>

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
                        {showComingSoon && (
                            <Tag size="sm" colorScheme="red">
                                Coming Soon!
                            </Tag>
                        )}
                    </VStack>

                    {rightIcon && (
                        <VStack minW={'40px'} justifyContent={'flex-end'}>
                            <Icon
                                as={rightIcon}
                                fontSize={'20px'}
                                opacity={0.5}
                            />
                        </VStack>
                    )}
                </HStack>
            </Button>
        </FadeInView>
    );
};
