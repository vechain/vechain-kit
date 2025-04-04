import {
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    VStack,
    Text,
    Button,
    Box,
    ModalFooter,
    Icon,
    Link,
    HStack,
} from '@chakra-ui/react';
import { StickyHeaderContainer } from '@/components/common';
import { AccountModalContentTypes } from '../../Types';
import { useTranslation } from 'react-i18next';
import { useVeChainKitConfig } from '@/providers';
import { getConfig } from '@/config';
import { GoLinkExternal } from 'react-icons/go';
import { IoIosCheckmarkCircleOutline } from 'react-icons/io';
import { ShareButtons } from '@/components/TransactionModal';

export type SuccessfulOperationContentProps = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
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
    const { network, darkMode } = useVeChainKitConfig();
    const explorerUrl = getConfig(network.type).explorerUrl;
    const socialDescription = `${explorerUrl}/${txId}`;

    return (
        <Box>
            <StickyHeaderContainer>
                <ModalHeader>{title}</ModalHeader>
                <ModalCloseButton />
            </StickyHeaderContainer>

            <ModalBody>
                <VStack align={'center'} p={6} spacing={3}>
                    <Icon
                        as={IoIosCheckmarkCircleOutline}
                        fontSize={'100px'}
                        color={darkMode ? '#00ff45de' : '#10ba3e'}
                        data-testid="success-icon"
                    />

                    {description && (
                        <Text fontSize="sm" textAlign="center">
                            {description}
                        </Text>
                    )}

                    {showSocialButtons && txId && (
                        <VStack mt={2} spacing={3}>
                            <Text
                                fontSize="sm"
                                fontWeight={'bold'}
                                opacity={0.5}
                            >
                                {t('Share on')}
                            </Text>
                            <ShareButtons
                                descriptionEncoded={socialDescription}
                            />
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
                                <Icon size={'sm'} as={GoLinkExternal} />
                            </HStack>
                        </Link>
                    )}
                </VStack>
            </ModalFooter>
        </Box>
    );
};
