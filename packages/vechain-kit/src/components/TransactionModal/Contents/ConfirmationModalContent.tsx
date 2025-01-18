import {
    VStack,
    Text,
    Spinner,
    Progress,
    Button,
    Icon,
    ModalFooter,
} from '@chakra-ui/react';
import { ReactNode, useState, useEffect } from 'react';
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
import { MdOutlineRefresh } from 'react-icons/md';

export type ConfirmationModalContentProps = {
    title?: ReactNode;
    progress?: TransactionProgress;
    onTryAgain?: () => void;
};

export const ConfirmationModalContent = ({
    title = 'Waiting for confirmation',
    progress,
    onTryAgain,
}: ConfirmationModalContentProps) => {
    const { connection } = useWallet();
    const { colorMode } = useColorMode();
    const isDark = colorMode === 'dark';
    const [showTimeout, setShowTimeout] = useState(false);

    useEffect(() => {
        setShowTimeout(false);
        const timer = setTimeout(() => {
            setShowTimeout(true);
        }, 7000);

        return () => clearTimeout(timer);
    }, [progress?.currentStep]);

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
                                    {showTimeout && (
                                        <Text
                                            fontSize="sm"
                                            align={'center'}
                                            color="orange.300"
                                        >
                                            This is taking longer than expected.
                                        </Text>
                                    )}
                                </>
                            ) : (
                                <>
                                    {!showTimeout ? (
                                        <Text fontSize="sm" align={'center'}>
                                            {connection.isConnectedWithSocialLogin
                                                ? 'Please do not close this window, it will take just a few seconds.'
                                                : 'Please confirm the transaction in your wallet.'}
                                        </Text>
                                    ) : (
                                        <VStack mt={4} spacing={2}>
                                            <Text
                                                color="orange.300"
                                                size="sm"
                                                textAlign={'center'}
                                            >
                                                This is taking longer than
                                                expected.
                                            </Text>
                                            <Text
                                                size="sm"
                                                textAlign={'center'}
                                            >
                                                You may want to try establishing
                                                the transaction again.
                                            </Text>
                                        </VStack>
                                    )}
                                </>
                            )}
                        </VStack>
                    </ModalBody>
                </Container>
            </FadeInViewFromBottom>

            <ModalFooter justifyContent={'center'}>
                {showTimeout && onTryAgain && (
                    <Button variant="secondary" onClick={onTryAgain}>
                        <Icon mr={2} size={'sm'} as={MdOutlineRefresh} />
                        Try again
                    </Button>
                )}
            </ModalFooter>
        </FadeInViewFromBottom>
    );
};
