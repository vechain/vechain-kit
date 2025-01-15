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
} from '@chakra-ui/react';
import { ReactNode } from 'react';
import { usePrivyWalletProvider } from '@/providers';
import { EXPLORER_URL } from '@/utils';
import { FadeInViewFromBottom } from '@/components/common';
import { StickyHeaderContainer } from '@/components/common';

export type LoadingModalContentProps = {
    title?: ReactNode;
    showExplorerButton?: boolean;
    txId?: string;
};

export const LoadingModalContent = ({
    title = 'Sending Transaction...',
    showExplorerButton,
    txId,
}: LoadingModalContentProps) => {
    const { chainId } = usePrivyWalletProvider();
    const { colorMode } = useColorMode();
    const isDark = colorMode === 'dark';
    const explorerUrl = EXPLORER_URL[chainId as keyof typeof EXPLORER_URL];

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

                            {!txId && (
                                <Text fontSize="sm" align={'center'}>
                                    {
                                        'This may take a few seconds. You can close this window and check the status later.'
                                    }
                                </Text>
                            )}
                        </VStack>
                    </ModalBody>
                </Container>
            </FadeInViewFromBottom>
        </FadeInViewFromBottom>
    );
};
