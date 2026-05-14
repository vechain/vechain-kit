import {
    Box,
    Button,
    ModalBody,
    ModalCloseButton,
    ModalFooter,
    ModalHeader,
    Text,
    VStack,
    useToken,
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { ModalBackButton, StickyHeaderContainer } from '@/components/common';
import React, { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

type LoadingContentProps = {
    loadingText?: string;
    title?: string;
    onTryAgain?: () => void;
    onClose: () => void;
    onGoBack: () => void;
    showBackButton?: boolean;
    /**
     * Icon to render inside the 64×64 spinner ring. Optional — when omitted
     * the ring shows on its own.
     */
    providerIcon?: ReactNode;
};

const spin = keyframes`
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
`;

/**
 * Centered 64×64 spinner ring (3px stroke, top arc coloured with --m-accent)
 * with the provider icon centered inside. Below the ring: an accent-colored
 * "Waiting for signature…" headline and the hint copy. A persistent Cancel
 * link at the bottom returns the user where they came from.
 */
export const LoadingContent = ({
    loadingText,
    title,
    onTryAgain,
    onClose,
    onGoBack,
    showBackButton = true,
    providerIcon,
}: LoadingContentProps) => {
    const { t } = useTranslation();
    const [showTimeout, setShowTimeout] = React.useState(false);
    const [accent, ringTrack] = useToken('colors', [
        'vechain-kit-accent',
        'vechain-kit-border-button',
    ]);

    React.useEffect(() => {
        const timer = setTimeout(() => setShowTimeout(true), 7000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <StickyHeaderContainer>
                <ModalHeader>
                    {showBackButton && <ModalBackButton onClick={onGoBack} />}
                    {title ?? t('Connecting...')}
                    <ModalCloseButton onClick={onClose} />
                </ModalHeader>
            </StickyHeaderContainer>

            <ModalBody>
                <VStack
                    align={'center'}
                    spacing={4}
                    py={6}
                    role={'status'}
                    aria-live={'polite'}
                >
                    <Box position={'relative'} w={'64px'} h={'64px'}>
                        <Box
                            position={'absolute'}
                            inset={0}
                            borderRadius={'full'}
                            border={'3px solid'}
                            borderColor={ringTrack}
                        />
                        <Box
                            position={'absolute'}
                            inset={0}
                            borderRadius={'full'}
                            border={'3px solid transparent'}
                            borderTopColor={accent}
                            animation={`${spin} 0.8s linear infinite`}
                        />
                        {providerIcon && (
                            <Box
                                position={'absolute'}
                                inset={0}
                                display={'flex'}
                                alignItems={'center'}
                                justifyContent={'center'}
                            >
                                {providerIcon}
                            </Box>
                        )}
                    </Box>

                    <Text
                        fontSize={'14px'}
                        fontWeight={500}
                        color={accent}
                        textAlign={'center'}
                    >
                        {t('Waiting for signature...')}
                    </Text>

                    {loadingText && (
                        <Text
                            fontSize={'sm'}
                            textAlign={'center'}
                            opacity={0.7}
                        >
                            {loadingText}
                        </Text>
                    )}

                    {showTimeout && (
                        <Text
                            color={'orange.300'}
                            fontSize={'sm'}
                            textAlign={'center'}
                            pt={1}
                        >
                            {t('This is taking longer than expected.')}
                        </Text>
                    )}
                </VStack>
            </ModalBody>
            <ModalFooter justifyContent={'center'}>
                <Button
                    variant={'ghost'}
                    size={'sm'}
                    fontSize={'12px'}
                    fontWeight={500}
                    textTransform={'uppercase'}
                    letterSpacing={'0.08em'}
                    color={'vechain-kit-text-secondary'}
                    onClick={onTryAgain ?? onGoBack}
                >
                    {t('Cancel')}
                </Button>
            </ModalFooter>
        </>
    );
};
