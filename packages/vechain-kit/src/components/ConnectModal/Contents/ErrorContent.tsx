import {
    Box,
    Button,
    HStack,
    Icon,
    ModalBody,
    ModalCloseButton,
    ModalFooter,
    ModalHeader,
    Text,
    VStack,
} from '@chakra-ui/react';
import { StickyHeaderContainer, ModalBackButton } from '@/components/common';
import { LuCircleAlert } from 'react-icons/lu';
import { useTranslation } from 'react-i18next';

type ErrorContentProps = {
    error: string;
    onClose: () => void;
    onTryAgain: () => void;
    onGoBack: () => void;
};

/**
 * Error view per spec:
 *  - 56×56 soft-red circle with an alert glyph
 *  - "Couldn't connect" headline at 18px Bold
 *  - Plain message body
 *  - Back (secondary) + Try again (primary) side-by-side
 */
export const ErrorContent = ({
    error,
    onClose,
    onTryAgain,
    onGoBack,
}: ErrorContentProps) => {
    const { t } = useTranslation();

    const errorRed = '#ef4444';
    const errorBg = 'rgba(239, 68, 68, 0.12)';

    return (
        <>
            <StickyHeaderContainer>
                <ModalHeader>
                    <ModalBackButton onClick={onGoBack} />
                    {t("Couldn't connect")}
                    <ModalCloseButton onClick={onClose} />
                </ModalHeader>
            </StickyHeaderContainer>

            <ModalBody>
                <VStack align={'center'} spacing={4} py={4}>
                    <Box
                        w={'56px'}
                        h={'56px'}
                        borderRadius={'full'}
                        bg={errorBg}
                        display={'flex'}
                        alignItems={'center'}
                        justifyContent={'center'}
                    >
                        <Icon
                            as={LuCircleAlert}
                            color={errorRed}
                            w={'28px'}
                            h={'28px'}
                        />
                    </Box>

                    <Text
                        fontSize={'18px'}
                        fontWeight={700}
                        textAlign={'center'}
                    >
                        {t("Couldn't connect")}
                    </Text>

                    <Text
                        fontSize={'sm'}
                        textAlign={'center'}
                        opacity={0.7}
                        px={2}
                    >
                        {error}
                    </Text>
                </VStack>
            </ModalBody>

            <ModalFooter>
                <HStack w={'full'} spacing={3}>
                    <Button
                        variant={'vechainKitSecondary'}
                        flex={1}
                        h={'52px'}
                        borderRadius={'16px'}
                        onClick={onGoBack}
                    >
                        {t('Back')}
                    </Button>
                    <Button
                        variant={'vechainKitPrimary'}
                        flex={1}
                        h={'52px'}
                        borderRadius={'16px'}
                        onClick={onTryAgain}
                    >
                        {t('Try again')}
                    </Button>
                </HStack>
            </ModalFooter>
        </>
    );
};
