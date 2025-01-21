import {
    VStack,
    Text,
    ModalCloseButton,
    Button,
    Link,
    Icon,
    ModalHeader,
    ModalBody,
    ModalFooter,
    HStack,
} from '@chakra-ui/react';
import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useVeChainKitConfig } from '@/providers';
import { MdOutlineErrorOutline, MdOutlineRefresh } from 'react-icons/md';
import { FadeInViewFromBottom } from '@/components/common';
import { StickyHeaderContainer } from '@/components/common';
import { getConfig } from '@/config';
import { useTranslation } from 'react-i18next';
import { GoLinkExternal } from 'react-icons/go';

export type ErrorModalContentProps = {
    title?: ReactNode;
    description?: string;
    showTryAgainButton?: boolean;
    onTryAgain?: () => void;
    showExplorerButton?: boolean;
    txId?: string;
    onClose?: () => void;
};

export const ErrorModalContent = ({
    title,
    description,
    showTryAgainButton = false,
    onTryAgain,
    showExplorerButton,
    txId,
    onClose,
}: ErrorModalContentProps) => {
    const { t } = useTranslation();
    const { network } = useVeChainKitConfig();
    const { darkMode: isDark } = useVeChainKitConfig();
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
                <ModalBody>
                    <VStack align={'center'} p={6} spacing={3}>
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
                            {description ?? t('An unexpected error occurred.')}
                        </Text>

                        {showExplorerButton && txId && (
                            <Link
                                href={`${explorerUrl}/${txId}`}
                                isExternal
                                opacity={0.5}
                                fontSize={'14px'}
                                textDecoration={'underline'}
                                mt={4}
                            >
                                <HStack
                                    spacing={1}
                                    alignItems={'center'}
                                    w={'full'}
                                    justifyContent={'center'}
                                >
                                    <Text>
                                        {t('View transaction on the explorer')}
                                    </Text>
                                    <Icon size={'sm'} as={GoLinkExternal} />
                                </HStack>
                            </Link>
                        )}
                    </VStack>
                </ModalBody>

                <ModalFooter justifyContent={'center'}>
                    <VStack w={'full'} spacing={4}>
                        {showTryAgainButton && onTryAgain && (
                            <Button
                                variant="vechainKitSecondary"
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

                        <Button onClick={onClose} variant="vechainKitSecondary">
                            {t('Close')}
                        </Button>
                    </VStack>
                </ModalFooter>
            </FadeInViewFromBottom>
        </FadeInViewFromBottom>
    );
};
