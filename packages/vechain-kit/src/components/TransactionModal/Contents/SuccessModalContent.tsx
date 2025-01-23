import {
    Text,
    VStack,
    ModalCloseButton,
    Link,
    Icon,
    ModalHeader,
    ModalFooter,
    ModalBody,
    Button,
    HStack,
} from '@chakra-ui/react';
import { ShareButtons } from '../Components/ShareButtons';
import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { FcCheckmark } from 'react-icons/fc';
import { StickyHeaderContainer } from '@/components/common';
import { useVeChainKitConfig } from '@/providers';
import { getConfig } from '@/config';
import { useTranslation } from 'react-i18next';
import { GoLinkExternal } from 'react-icons/go';

export type SuccessModalContentProps = {
    title?: ReactNode;
    showSocialButtons?: boolean;
    socialDescriptionEncoded?: string;
    showExplorerButton?: boolean;
    txId?: string;
    onClose?: () => void;
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
    title,
    showSocialButtons = false,
    showExplorerButton = false,
    txId,
    socialDescriptionEncoded,
    onClose,
}: SuccessModalContentProps) => {
    const { t } = useTranslation();
    const { darkMode: isDark } = useVeChainKitConfig();

    const { network } = useVeChainKitConfig();
    const explorerUrl = getConfig(network.type).explorerUrl;

    const socialDescription =
        socialDescriptionEncoded ?? `${explorerUrl}/${txId}`;

    return (
        <>
            <StickyHeaderContainer>
                <ModalHeader
                    fontSize={'md'}
                    fontWeight={'500'}
                    textAlign={'center'}
                    color={isDark ? '#dfdfdd' : '#4d4d4d'}
                >
                    {title ?? t('Transaction completed!')}
                </ModalHeader>
                <ModalCloseButton />
            </StickyHeaderContainer>

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
                        <Icon as={FcCheckmark} fontSize={'100px'} />
                    </motion.div>

                    {showSocialButtons && (
                        <VStack>
                            <Text fontSize="sm">
                                {t('Share your transaction')}
                            </Text>
                            <ShareButtons
                                descriptionEncoded={socialDescription}
                            />
                        </VStack>
                    )}
                </VStack>
            </ModalBody>

            <ModalFooter justifyContent={'center'}>
                <VStack w={'full'} spacing={4}>
                    <Button onClick={onClose} variant="vechainKitSecondary">
                        {t('Close')}
                    </Button>

                    {showExplorerButton && txId && (
                        <Link
                            href={`${explorerUrl}/${txId}`}
                            isExternal
                            opacity={0.5}
                            fontSize={'14px'}
                            textDecoration={'underline'}
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
            </ModalFooter>
        </>
    );
};
