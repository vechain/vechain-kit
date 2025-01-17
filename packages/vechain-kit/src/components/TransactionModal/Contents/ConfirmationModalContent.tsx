import { VStack, Text, Spinner, Progress } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { useWallet } from '@/hooks';
import { FadeInViewFromBottom } from '@/components/common';
import { TransactionProgress } from '@/types';
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
    progress?: TransactionProgress;
};

export const ConfirmationModalContent = ({
    title = 'Waiting for confirmation',
    progress,
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

            <FadeInViewFromBottom>
                <Container maxW={'container.lg'}>
                    <ModalBody>
                        <VStack align={'center'} p={6} gap={6}>
                            <Spinner my={10} size="xl" />
                            {connection.isConnectedWithCrossApp && progress ? (
                                <>
                                    <Progress
                                        value={
                                            (progress.currentStep /
                                                progress.totalSteps) *
                                            100
                                        }
                                        width="100%"
                                        borderRadius="xl"
                                    />
                                    <Text fontSize="sm" align={'center'}>
                                        Step {progress.currentStep} of{' '}
                                        {progress.totalSteps}
                                    </Text>
                                    {progress.currentStepDescription && (
                                        <Text
                                            fontSize="sm"
                                            align={'center'}
                                            color="gray.500"
                                        >
                                            {progress.currentStepDescription}
                                        </Text>
                                    )}
                                </>
                            ) : (
                                <Text fontSize="sm" align={'center'}>
                                    {connection.isConnectedWithPrivy
                                        ? 'Please do not close this window, it will take just a few seconds.'
                                        : 'Please confirm the transaction in your wallet.'}
                                </Text>
                            )}
                        </VStack>
                    </ModalBody>
                </Container>
            </FadeInViewFromBottom>
        </FadeInViewFromBottom>
    );
};
