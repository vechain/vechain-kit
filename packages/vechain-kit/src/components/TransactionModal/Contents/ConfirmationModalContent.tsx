import { VStack, Text, Spinner } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { useWallet } from '../../../hooks';
import { FadeInViewFromBottom } from '@/components/common';
import {
    ModalHeader,
    ModalCloseButton,
    Container,
    ModalBody,
    useColorMode,
} from '@chakra-ui/react';
import { StickyHeaderContainer } from '@/components/common';

export type ConfirmationModalContentProps = {
    title?: ReactNode;
};

export const ConfirmationModalContent = ({
    title = 'Waiting for confirmation',
}: ConfirmationModalContentProps) => {
    const { connection } = useWallet();
    const { colorMode } = useColorMode();
    const isDark = colorMode === 'dark';

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
            <Container maxW={'container.lg'}>
                <ModalBody>
                    <VStack align={'center'} p={6} gap={6}>
                        <Spinner my={10} size="xl" />
                        <Text fontSize="sm" align={'center'}>
                            {connection.isConnectedWithPrivy
                                ? 'Please do not close this window, it will take just a few seconds.'
                                : 'Please confirm the transaction in your wallet.'}
                        </Text>
                    </VStack>
                </ModalBody>
            </Container>
        </FadeInViewFromBottom>
    );
};
