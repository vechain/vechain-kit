import {
    Text,
    VStack,
    ModalCloseButton,
    Link,
    Icon,
    ModalHeader,
    useColorMode,
    ModalFooter,
    Container,
    ModalBody,
} from '@chakra-ui/react';
import { ShareButtons } from '../Components/ShareButtons';
import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { EXPLORER_URL } from '@/utils';
import { FcCheckmark } from 'react-icons/fc';
import {
    FadeInViewFromBottom,
    StickyHeaderContainer,
} from '@/components/common';
import { useGetChainId } from '@/hooks';

export type SuccessModalContentProps = {
    title?: ReactNode;
    showSocialButtons?: boolean;
    socialDescriptionEncoded?: string;
    showExplorerButton?: boolean;
    txId?: string;
};

/**
 * SuccessModalContent is a component that shows a success message with a lottie animation and share buttons
 * @param {SuccessModalContentProps} props - The props of the component
 * @param {string} props.title - The title of the modal
 * @param {boolean} props.showSocialButtons - Whether to show the social media share buttons
 * @param {boolean} props.showExplorerButton - Whether to show the explorer button
 * @param {string} props.txId - The transaction ID to link to the explorer
 * @param {string} props.socialDescriptionEncoded - The encoded description to share on social media
 * @returns {React.ReactElement} The SuccessModalContent component
 */
export const SuccessModalContent = ({
    title = 'Transaction completed!',
    showSocialButtons = false,
    showExplorerButton = false,
    txId,
    socialDescriptionEncoded,
}: SuccessModalContentProps) => {
    const { colorMode } = useColorMode();
    const isDark = colorMode === 'dark';

    const { data: chainId } = useGetChainId();
    const explorerUrl = EXPLORER_URL[chainId as keyof typeof EXPLORER_URL];

    const socialDescription =
        socialDescriptionEncoded ?? `${explorerUrl}/${txId}`;

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
                                <Icon as={FcCheckmark} fontSize={'100px'} />
                            </motion.div>

                            {showSocialButtons && (
                                <VStack>
                                    <Text fontSize="sm">
                                        {'Share your transaction'}
                                    </Text>
                                    <ShareButtons
                                        descriptionEncoded={socialDescription}
                                    />
                                </VStack>
                            )}
                        </VStack>
                    </ModalBody>

                    <ModalFooter justifyContent={'center'}>
                        {showExplorerButton && txId && (
                            <Link
                                href={`${explorerUrl}/${txId}`}
                                isExternal
                                color="gray.500"
                                fontSize={'14px'}
                                textDecoration={'underline'}
                            >
                                {'View it on the explorer'}
                            </Link>
                        )}
                    </ModalFooter>
                </Container>
            </FadeInViewFromBottom>
        </FadeInViewFromBottom>
    );
};
