import {
    VStack,
    Text,
    Spinner,
    Button,
    Icon,
    ModalFooter,
    Box,
} from '@chakra-ui/react';
import { ReactNode, useState, useEffect } from 'react';
import { useWallet } from '@/hooks';
import { ModalHeader, ModalCloseButton, ModalBody } from '@chakra-ui/react';
import { StickyHeaderContainer } from '@/components/common';
import { MdOutlineRefresh } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { useVeChainKitConfig } from '@/providers';

export type ConfirmationModalContentProps = {
    title?: ReactNode;
    onTryAgain?: () => void;
};

export const ConfirmationModalContent = ({
    title,
    onTryAgain,
}: ConfirmationModalContentProps) => {
    const { t } = useTranslation();
    const { connection } = useWallet();
    const { darkMode: isDark } = useVeChainKitConfig();
    const [showTimeout, setShowTimeout] = useState(false);

    useEffect(() => {
        setShowTimeout(false);
        const timer = setTimeout(() => {
            setShowTimeout(true);
        }, 9000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <Box>
            <StickyHeaderContainer>
                <ModalHeader
                    fontSize={'md'}
                    fontWeight={'500'}
                    textAlign={'center'}
                    color={isDark ? '#dfdfdd' : '#4d4d4d'}
                >
                    {title || t('Waiting for confirmation')}
                </ModalHeader>
                <ModalCloseButton />
            </StickyHeaderContainer>

            <ModalBody>
                <VStack align={'center'} p={6} gap={6}>
                    <Spinner my={10} size="xl" />

                    {!showTimeout ? (
                        <Text fontSize="sm" align={'center'}>
                            {connection.isConnectedWithSocialLogin
                                ? t(
                                      'Please do not close this window, it will take just a few seconds.',
                                  )
                                : t(
                                      'Please confirm the transaction in your wallet.',
                                  )}
                        </Text>
                    ) : (
                        <VStack mt={4} spacing={2}>
                            <Text
                                color="orange.300"
                                size="sm"
                                textAlign={'center'}
                            >
                                {t('This is taking longer than expected.')}
                            </Text>
                            <Text size="sm" textAlign={'center'}>
                                {t(
                                    'You may want to try establishing the transaction again.',
                                )}
                            </Text>
                        </VStack>
                    )}
                </VStack>
            </ModalBody>

            <ModalFooter justifyContent={'center'}>
                {showTimeout && onTryAgain && (
                    <Button variant="vechainKitSecondary" onClick={onTryAgain}>
                        <Icon mr={2} size={'sm'} as={MdOutlineRefresh} />
                        {t('Try again')}
                    </Button>
                )}
            </ModalFooter>
        </Box>
    );
};
