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
import { useVeChainKitConfig } from '@/providers';
import { MdOutlineErrorOutline, MdOutlineRefresh } from 'react-icons/md';
import { FadeInViewFromBottom } from '@/components/common';
import { StickyHeaderContainer } from '@/components/common';
import { getConfig } from '@/config';
import { useTranslation } from 'react-i18next';

export type ErrorModalContentProps = {
    title?: ReactNode;
    description?: string;
    showTryAgainButton?: boolean;
    onTryAgain?: () => void;
    showExplorerButton?: boolean;
    txId?: string;
};

export const ErrorModalContent = ({
    title,
    description,
    showTryAgainButton = false,
    onTryAgain,
    showExplorerButton,
    txId,
}: ErrorModalContentProps) => {
    const { t } = useTranslation();
    const { network } = useVeChainKitConfig();
    const { colorMode } = useColorMode();
    const isDark = colorMode === 'dark';
    const explorerUrl = getConfig(network.type).explorerUrl;

    return (
        <FadeInViewFromBottom>
            <StickyHeaderContainer>
                <ModalHeader
                    fontSize={'md'}
                    fontWeight={'500'}
                    textAlign={'center'}
                    color={isDark ? '#dfdfdd' : '#4d4d4d'}
                >
                    {title ?? t('Something went wrong')}
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

                                <Text size="sm" textAlign={'center'}>
                                    {description ??
                                        t('An unexpected error occurred.')}
                                </Text>

                                {showExplorerButton && txId && (
                                    <Link
                                        href={`${explorerUrl}/${txId}`}
                                        isExternal
                                        color="gray.500"
                                        fontSize={'14px'}
                                        textDecoration={'underline'}
                                    >
                                        {t('View transaction on the explorer')}
                                    </Link>
                                )}
                                {showTryAgainButton && onTryAgain && (
                                    <Button
                                        variant="secondary"
                                        onClick={onTryAgain}
                                    >
                                        <Icon
                                            mr={2}
                                            size={'sm'}
                                            as={MdOutlineRefresh}
                                        />
                                        {t('Try again')}
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
