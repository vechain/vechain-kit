import {
    ModalBody,
    ModalHeader,
    ModalCloseButton,
    Spinner,
    VStack,
    Text,
    ModalFooter,
    Icon,
    Button,
} from '@chakra-ui/react';
import { StickyHeaderContainer, ModalBackButton } from '../../common';
import { LuRefreshCw } from 'react-icons/lu';
import React from 'react';
import { useTranslation } from 'react-i18next';

type LoadingContentProps = {
    loadingText?: string;
    title?: string;
    onTryAgain?: () => void;
    onClose: () => void;
    onGoBack: () => void;
    showBackButton?: boolean;
};

export const LoadingContent = ({
    loadingText,
    title,
    onTryAgain,
    onClose,
    onGoBack,
    showBackButton = true,
}: LoadingContentProps) => {
    const { t } = useTranslation();
    const [showTimeout, setShowTimeout] = React.useState(false);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setShowTimeout(true);
        }, 7000);

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
                    p={6}
                    gap={0}
                    w={'full'}
                    justifyContent={'center'}
                    minH={'150px'}
                >
                    <Spinner size="xl" />
                </VStack>
                {loadingText && !showTimeout && (
                    <Text size="sm" textAlign={'center'}>
                        {loadingText}
                    </Text>
                )}
                {showTimeout && (
                    <VStack mt={4} spacing={2}>
                        <Text color="orange.300" size="sm" textAlign={'center'}>
                            {t('This is taking longer than expected.')}
                        </Text>
                        <Text size="sm" textAlign={'center'}>
                            {t(
                                'You may want to try establishing the connection again.',
                            )}
                        </Text>
                    </VStack>
                )}
            </ModalBody>
            <ModalFooter justifyContent={'center'}>
                {showTimeout && (
                    <Button variant="vechainKitPrimary" onClick={onTryAgain}>
                        <Icon mr={2} as={LuRefreshCw} />
                        {t('Try again')}
                    </Button>
                )}
            </ModalFooter>
        </>
    );
};
