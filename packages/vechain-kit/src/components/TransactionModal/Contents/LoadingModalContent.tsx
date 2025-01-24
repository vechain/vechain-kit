import {
    Link,
    ModalCloseButton,
    Spinner,
    Text,
    VStack,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Icon,
    Box,
} from '@chakra-ui/react';
import { ReactNode, useState, useEffect } from 'react';
import { useVeChainKitConfig } from '@/providers';
import { StickyHeaderContainer } from '@/components/common';
import { getConfig } from '@/config';
import { MdOutlineRefresh } from 'react-icons/md';
import { useTranslation } from 'react-i18next';

export type LoadingModalContentProps = {
    title?: ReactNode;
    showExplorerButton?: boolean;
    txId?: string;
    onTryAgain?: () => void;
};

export const LoadingModalContent = ({
    title,
    showExplorerButton,
    txId,
    onTryAgain,
}: LoadingModalContentProps) => {
    const { t } = useTranslation();
    const { network } = useVeChainKitConfig();
    const { darkMode: isDark } = useVeChainKitConfig();
    const explorerUrl = getConfig(network.type).explorerUrl;
    const [showTimeout, setShowTimeout] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowTimeout(true);
        }, 12000);

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
                    {title ?? t('Sending Transaction...')}
                </ModalHeader>
                <ModalCloseButton />
            </StickyHeaderContainer>

            <ModalBody>
                <VStack align={'center'} p={6}>
                    <Spinner my={10} size="xl" />
                    {showExplorerButton && txId && (
                        <Link
                            href={`${explorerUrl}/transactions/${txId}`}
                            isExternal
                            opacity={0.5}
                            fontSize={'14px'}
                            textDecoration={'underline'}
                        >
                            {t('View on the explorer')}
                        </Link>
                    )}

                    {!showTimeout && !txId && (
                        <Text fontSize="sm" align={'center'}>
                            {t(
                                'This may take a few seconds. You can close this window and check the status later.',
                            )}
                        </Text>
                    )}

                    {showTimeout && !txId && (
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
                {showTimeout && onTryAgain && !txId && (
                    <Button variant="vechainKitSecondary" onClick={onTryAgain}>
                        <Icon mr={2} size={'sm'} as={MdOutlineRefresh} />
                        {t('Try again')}
                    </Button>
                )}
            </ModalFooter>
        </Box>
    );
};
