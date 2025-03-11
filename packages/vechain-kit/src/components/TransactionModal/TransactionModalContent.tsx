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
    Spinner,
} from '@chakra-ui/react';
import { ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useVeChainKitConfig } from '@/providers';
import { getConfig } from '@/config';
import { GoLinkExternal } from 'react-icons/go';
import { IoIosCheckmarkCircleOutline } from 'react-icons/io';
import { MdOutlineErrorOutline, MdOutlineRefresh } from 'react-icons/md';
import { ShareButtons } from './Components/ShareButtons';
import { StickyHeaderContainer } from '../common';
import { TransactionModalProps } from './TransactionModal';

type StatusConfig = {
    title: ReactNode;
    icon: ReactNode;
    description: string;
};

export const TransactionModalContent = ({
    status,
    uiConfig,
    onTryAgain,
    txReceipt,
    txError,
    onClose,
}: Omit<TransactionModalProps, 'isOpen'>) => {
    const { t } = useTranslation();
    const { network } = useVeChainKitConfig();

    const errorMessage = useMemo(() => {
        if (!txError) return null;
        return (
            (txError as any).reason ||
            t('Something went wrong. Please try again.')
        );
    }, [txError, t]);

    const getStatusConfig = (): StatusConfig => {
        // overwrite status to avoid flickering
        const isSendingTransaction = status === 'waitingConfirmation';
        if (isSendingTransaction) {
            status = 'pending';
        }
        switch (status) {
            case 'pending':
                return {
                    title:
                        uiConfig?.title ??
                        (isSendingTransaction
                            ? t('Sending Transaction...')
                            : t('Waiting for confirmation')),
                    icon: uiConfig?.loadingIcon ?? <Spinner size="xl" />,
                    description: isSendingTransaction
                        ? t(
                              'Transaction is being processed, it can take up to 15 seconds.',
                          )
                        : uiConfig?.description ??
                          t('Please confirm the transaction in your wallet.'),
                };
            case 'error':
                return {
                    title: uiConfig?.title ?? t('Something went wrong'),
                    icon: uiConfig?.errorIcon ?? (
                        <Icon
                            as={MdOutlineErrorOutline}
                            color="red"
                            fontSize="100px"
                        />
                    ),
                    description:
                        errorMessage ?? t('An unexpected error occurred.'),
                };
            case 'success':
                return {
                    title: uiConfig?.title ?? t('Transaction completed!'),
                    icon: uiConfig?.successIcon ?? (
                        <Icon
                            as={IoIosCheckmarkCircleOutline}
                            color="#22c55e"
                            fontSize="100px"
                        />
                    ),
                    description: '',
                };
            case 'ready':
                return {
                    title: uiConfig?.title ?? t('Confirm transaction'),
                    icon: null,
                    description:
                        uiConfig?.description ??
                        t(
                            'Confirm the transaction in your wallet to complete it.',
                        ),
                };
            default:
                return {
                    title: '',
                    icon: null,
                    description: '',
                };
        }
    };

    const statusConfig = getStatusConfig();
    const socialDescription = `${getConfig(network.type).explorerUrl}/${
        txReceipt?.meta.txID
    }`;

    return (
        <Box>
            <StickyHeaderContainer>
                <ModalHeader>{statusConfig.title}</ModalHeader>
                <ModalCloseButton
                    isDisabled={status === 'pending' && !uiConfig?.isClosable}
                />
            </StickyHeaderContainer>

            <ModalBody>
                <VStack align="center" p={6} spacing={3}>
                    {statusConfig.icon}

                    {status === 'success' && uiConfig?.showShareOnSocials && (
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

                    {statusConfig.description && (
                        <Text
                            fontSize={status === 'ready' ? 'md' : 'sm'}
                            textAlign="center"
                            color={status === 'error' ? 'red' : 'inherit'}
                            mt={5}
                            style={{
                                lineBreak: 'anywhere',
                            }}
                        >
                            {statusConfig.description}
                        </Text>
                    )}
                </VStack>
            </ModalBody>

            <ModalFooter justifyContent="center">
                <VStack width="full" spacing={4}>
                    {status === 'error' && !!onTryAgain && (
                        <Button
                            variant="vechainKitPrimary"
                            onClick={onTryAgain}
                            width="full"
                        >
                            <Icon mr={2} as={MdOutlineRefresh} />
                            {t('Try again')}
                        </Button>
                    )}

                    {status === 'ready' && (
                        <Button
                            onClick={onTryAgain}
                            variant="vechainKitPrimary"
                            width="full"
                        >
                            {t('Confirm')}
                        </Button>
                    )}

                    {(status === 'success' ||
                        status === 'error' ||
                        status === 'ready') && (
                        <Button
                            onClick={onClose}
                            variant="vechainKitSecondary"
                            width="full"
                        >
                            {t('Close')}
                        </Button>
                    )}

                    {uiConfig?.showExplorerButton && txReceipt?.meta.txID && (
                        <Link
                            href={`${getConfig(network.type).explorerUrl}/${
                                txReceipt?.meta.txID
                            }`}
                            isExternal
                            opacity={0.5}
                            fontSize="14px"
                            textDecoration="underline"
                        >
                            <HStack
                                spacing={1}
                                alignItems="center"
                                w="full"
                                justifyContent="center"
                            >
                                <Text>
                                    {t('View transaction on the explorer')}
                                </Text>
                                <Icon size="sm" as={GoLinkExternal} />
                            </HStack>
                        </Link>
                    )}
                </VStack>
            </ModalFooter>
        </Box>
    );
};
