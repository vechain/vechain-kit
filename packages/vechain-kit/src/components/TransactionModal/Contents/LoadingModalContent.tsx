import {
    Link,
    ModalCloseButton,
    Spinner,
    Text,
    VStack,
    ModalHeader,
    Container,
    ModalBody,
    useColorMode,
    ModalFooter,
    Button,
    Icon,
} from '@chakra-ui/react';
import { ReactNode, useState, useEffect } from 'react';
import { useVeChainKitConfig } from '@/providers';
import { FadeInViewFromBottom } from '@/components/common';
import { StickyHeaderContainer } from '@/components/common';
import { getConfig } from '@/config';
import { MdOutlineRefresh } from 'react-icons/md';

export type LoadingModalContentProps = {
    title?: ReactNode;
    showExplorerButton?: boolean;
    txId?: string;
    onTryAgain?: () => void;
};

export const LoadingModalContent = ({
    title = 'Sending Transaction...',
    showExplorerButton,
    txId,
    onTryAgain,
}: LoadingModalContentProps) => {
    const { network } = useVeChainKitConfig();
    const { colorMode } = useColorMode();
    const isDark = colorMode === 'dark';
    const explorerUrl = getConfig(network.type).explorerUrl;
    const [showTimeout, setShowTimeout] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowTimeout(true);
        }, 12000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <FadeInViewFromBottom>
            <StickyHeaderContainer>
                <ModalHeader
                    fontSize={'md'}
                    fontWeight={'500'}
                    textAlign={'center'}
                    color={isDark ? '#dfdfdd' : '#4d4d4d'}
                >
                    {title}
                </ModalHeader>
                <ModalCloseButton />
            </StickyHeaderContainer>

            <FadeInViewFromBottom>
                <Container maxW={'container.lg'}>
                    <ModalBody>
                        <VStack align={'center'} p={6}>
                            <Spinner my={10} size="xl" />
                            {showExplorerButton && txId && (
                                <Link
                                    href={`${explorerUrl}/transactions/${txId}`}
                                    isExternal
                                    color="gray.500"
                                    fontSize={'14px'}
                                    textDecoration={'underline'}
                                >
                                    {'View it on the explorer'}
                                </Link>
                            )}

                            {!showTimeout && !txId && (
                                <Text fontSize="sm" align={'center'}>
                                    {
                                        'This may take a few seconds. You can close this window and check the status later.'
                                    }
                                </Text>
                            )}

                            {showTimeout && !txId && (
                                <VStack mt={4} spacing={2}>
                                    <Text
                                        color="orange.300"
                                        size="sm"
                                        textAlign={'center'}
                                    >
                                        This is taking longer than expected.
                                    </Text>
                                    <Text size="sm" textAlign={'center'}>
                                        You may want to try establishing the
                                        transaction again.
                                    </Text>
                                </VStack>
                            )}
                        </VStack>
                    </ModalBody>
                </Container>
            </FadeInViewFromBottom>

            <ModalFooter justifyContent={'center'}>
                {showTimeout && onTryAgain && !txId && (
                    <Button variant="secondary" onClick={onTryAgain}>
                        <Icon mr={2} size={'sm'} as={MdOutlineRefresh} />
                        Try again
                    </Button>
                )}
            </ModalFooter>
        </FadeInViewFromBottom>
    );
};
