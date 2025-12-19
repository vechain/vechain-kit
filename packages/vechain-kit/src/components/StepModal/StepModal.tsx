import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import {
    Card,
    CardBody,
    Text,
    useMediaQuery,
    ModalCloseButton,
    ModalHeader,
} from '@chakra-ui/react';
import { BaseModal, StickyHeaderContainer, ModalBackButton } from '../common';

export type Step<T extends string> = {
    key: T;
    content: ReactNode;
    title?: string;
    description?: string;
};

export type StepModalProps<T extends string> = {
    isOpen: boolean;
    onClose: () => void;
    steps: Step<T>[];
    goToPrevious: () => void;
    goToNext?: () => void;
    setActiveStep: (step: number) => void;
    activeStep: number;
    disableBackButton?: boolean;
    disableCloseButton?: boolean;
    closeOnOverlayClick?: boolean;
    isCloseable?: boolean;
};

export const StepModal = <T extends string>({
    isOpen,
    onClose,
    steps,
    activeStep,
    goToPrevious,
    setActiveStep,
    disableBackButton,
    disableCloseButton,
    closeOnOverlayClick = true,
    isCloseable = true,
}: StepModalProps<T>) => {
    const handleClose = () => {
        // reset the active step to 0
        setActiveStep(0);
        // close the modal
        onClose();
    };
    const [isDesktop] = useMediaQuery('(min-width: 1060px)');

    const currentStepContent = steps[activeStep];

    const isFirstStep = activeStep === 0;

    const showHeader =
        (!isFirstStep && !disableBackButton) ||
        currentStepContent?.title ||
        (isDesktop && !disableCloseButton);

    if (!currentStepContent) {
        return null;
    }

    return (
        <BaseModal
            closeOnOverlayClick={closeOnOverlayClick}
            isOpen={isOpen}
            onClose={handleClose}
            isCloseable={isCloseable}
            blockScrollOnMount={true}
        >
            <Card p={0} bg="none">
                <CardBody p={0}>
                    {showHeader ? (
                        <StickyHeaderContainer>
                            {currentStepContent?.title ? (
                                <ModalHeader>
                                    {currentStepContent.title}
                                </ModalHeader>
                            ) : null}

                            {!isFirstStep && !disableBackButton ? (
                                <ModalBackButton onClick={goToPrevious} />
                            ) : null}

                            {isDesktop && !disableCloseButton ? (
                                <ModalCloseButton onClick={onClose} />
                            ) : null}
                        </StickyHeaderContainer>
                    ) : null}
                    {currentStepContent?.description ? (
                        <Text
                            fontSize={{ base: 14, md: 16 }}
                            fontWeight={400}
                            px={4}
                        >
                            {currentStepContent?.description}
                        </Text>
                    ) : null}

                    <motion.div
                        initial="hidden"
                        animate="visible"
                        key={currentStepContent.key}
                        style={{ width: '100%' }}
                    >
                        {currentStepContent.content}
                    </motion.div>
                </CardBody>
            </Card>
        </BaseModal>
    );
};
