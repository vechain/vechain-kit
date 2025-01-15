import {
    VStack,
    Text,
    ModalCloseButton,
    Button,
    Link,
    Icon,
    ModalHeader,
    Container,
    ModalBody,
    useColorMode,
} from '@chakra-ui/react';
import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { MdOutlineErrorOutline } from 'react-icons/md';
import { FadeInViewFromBottom } from '@/components/common';
import { StickyHeaderContainer } from '@/components/common';
import { getConfig } from '@/config';

export type ErrorModalContentProps = {
    title?: ReactNode;
    description?: string;
    showTryAgainButton?: boolean;
    onTryAgain?: () => void;
    showExplorerButton?: boolean;
    txId?: string;
};

export const ErrorModalContent = ({
    title = 'Something went wrong',
    description = 'Something went wrong 😕',
    showTryAgainButton = false,
    onTryAgain = () => {},
    showExplorerButton,
    txId,
}: ErrorModalContentProps) => {
    const { colorMode } = useColorMode();
    const isDark = colorMode === 'dark';
    const { explorerUrl } = getConfig();

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
                        <VStack align={'center'} p={6} gap={0}>
                            <VStack gap={4}>
                                <motion.div
                                    transition={{
                                        duration: 4,
                                        ease: 'easeInOut',
                                        repeat: Infinity,
                                    }}
                                    animate={{
                                        scale: [1, 1.1, 1],
                                    }}
                                >
                                    <Icon
                                        as={MdOutlineErrorOutline}
                                        color={'red'}
                                        fontSize={'100px'}
                                    />
                                </motion.div>
                                {description && (
                                    <Text size="sm">{description}</Text>
                                )}
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
                                {showTryAgainButton && (
                                    <Button
                                        variant={'outline'}
                                        onClick={onTryAgain}
                                    >
                                        {'Try again'}
                                    </Button>
                                )}
                            </VStack>
                        </VStack>
                    </ModalBody>
                </Container>
            </FadeInViewFromBottom>
        </FadeInViewFromBottom>
    );
};
