import {
    Button,
    Box,
    HStack,
    VStack,
    Text,
    Icon,
    Image,
    Tag,
    ButtonProps,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { IconType } from 'react-icons';

type ActionButtonProps = {
    title: string;
    description?: string;
    onClick: () => void;
    leftIcon?: IconType;
    rightIcon?: IconType;
    leftImage?: string;
    backgroundColor?: string;
    border?: string;
    hide?: boolean;
    _hover?: object;
    showComingSoon?: boolean;
    isDisabled?: boolean;
    stacked?: boolean;
    isLoading?: boolean;
    loadingText?: string;
    style?: ButtonProps;
    extraContent?: React.ReactNode;
    dataTestId?: string;
    variant?: string;
};

export const ActionButton = ({
    leftIcon,
    rightIcon,
    title,
    onClick,
    leftImage,
    hide = false,
    showComingSoon = false,
    backgroundColor,
    _hover,
    isDisabled = false,
    stacked = false,
    isLoading,
    loadingText,
    style,
    extraContent,
    dataTestId,
    variant = 'actionButton',
}: ActionButtonProps) => {
    const { t } = useTranslation();
    
    // Map actionButton to vechainKitSecondary for consistency
    // Maintain backward compatibility by allowing override
    const standardVariant = variant === 'actionButton' ? 'vechainKitSecondary' : variant;
    
    return (
        <Button
            variant={standardVariant}
            py={stacked ? 0 : 2}
            minHeight="50px"
            height="fit-content"
            p={0}
            onClick={onClick}
            display={hide ? 'none' : 'flex'}
            isDisabled={showComingSoon || isDisabled}
            isLoading={isLoading}
            loadingText={loadingText}
            bgColor={backgroundColor}
            _hover={_hover}
            data-testid={dataTestId}
            {...style}
        >
            <HStack w={'full'} justify={'space-between'} alignItems={'center'}>
                <Box minW={'40px'} h={'20px'}>
                    {leftImage ? (
                        <Image
                            src={leftImage}
                            w={'30px'}
                            h={'30px'}
                            borderRadius={'full'}
                            alt="left-image"
                            alignSelf={'end'}
                            objectFit="cover"
                        />
                    ) : (
                        <Icon
                            as={leftIcon}
                            fontSize={'20px'}
                            h={'full'}
                            alignContent={'center'}
                        />
                    )}
                </Box>
                <VStack
                    textAlign={'left'}
                    w={'full'}
                    flex={1}
                    justifyContent={'flex-start'}
                    alignItems={'flex-start'}
                >
                    <HStack justify={'flex-start'} alignItems={'baseline'}>
                        <Text fontSize={'sm'} fontWeight={'400'}>
                            {title}
                        </Text>
                        {showComingSoon && (
                            <Tag size="sm" colorScheme="red">
                                {t('Coming Soon!')}
                            </Tag>
                        )}
                        {extraContent}
                    </HStack>

                    {/* <Text
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
                    </Text> */}
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
