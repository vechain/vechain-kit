import {
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    VStack,
    Text,
    Button,
    ModalFooter,
    Icon,
    Link,
    HStack,
    useToken,
} from '@chakra-ui/react';
import { StickyHeaderContainer } from '@/components/common';
import { useTranslation } from 'react-i18next';
import { useVeChainKitConfig } from '@/providers';
import { motion } from 'framer-motion';
import { getConfig } from '../../../config';
import { LuExternalLink, LuCircleCheck } from 'react-icons/lu';
import { ShareButtons } from '@/components/TransactionModal';
import { UpgradeSmartAccountModalContentsTypes } from '../UpgradeSmartAccountModal';

export type SuccessfulOperationContentProps = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<UpgradeSmartAccountModalContentsTypes>
    >;
    txId?: string;
    title: string;
    description?: string;
    onDone: () => void;
    showSocialButtons?: boolean;
};

export const SuccessfulOperationContent = ({
    txId,
    title,
    description,
    onDone,
    showSocialButtons = false,
}: SuccessfulOperationContentProps) => {
    const { t } = useTranslation();
    const { network } = useVeChainKitConfig();
    const explorerUrl = getConfig(network.type).explorerUrl;
    const socialDescription = `${explorerUrl}/${txId}`;

    const successColor = useToken('colors', 'vechain-kit-success');

    return (
        <>
            <StickyHeaderContainer>
                <ModalHeader>{title}</ModalHeader>
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
                        <Icon
                            as={LuCircleCheck}
                            fontSize={'100px'}
                            color={successColor}
                        />
                    </motion.div>

                    {description && (
                        <Text fontSize="sm" textAlign="center">
                            {description}
                        </Text>
                    )}

                    {showSocialButtons && txId && (
                        <VStack mt={2}>
                            <Text fontSize="xs">{t('Share on')}</Text>
                            <ShareButtons description={socialDescription} />
                        </VStack>
                    )}
                </VStack>
            </ModalBody>

            <ModalFooter justifyContent={'center'}>
                <VStack width="full" spacing={4}>
                    <Button
                        onClick={onDone}
                        variant="vechainKitSecondary"
                        width="full"
                    >
                        {t('Done')}
                    </Button>

                    {txId && (
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
                                <Icon size={16} as={LuExternalLink} />
                            </HStack>
                        </Link>
                    )}
                </VStack>
            </ModalFooter>
        </>
    );
};
