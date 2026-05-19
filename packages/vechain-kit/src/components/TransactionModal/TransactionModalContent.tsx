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
    Spinner,
    useToken,
} from '@chakra-ui/react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useVeChainKitConfig } from '@/providers';
import { getConfig } from '@/config';
import { LuExternalLink, LuRefreshCw } from 'react-icons/lu';
import { ShareButtons } from './Components/ShareButtons';
import { StatusScreen, StickyHeaderContainer } from '../common';
import { TransactionModalProps } from './TransactionModal';

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

    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');
    const textPrimary = useToken('colors', 'vechain-kit-text-primary');

    const errorMessage = useMemo(() => {
        if (!txError) return null;
        return (
            (txError as unknown as { reason?: string }).reason ||
            t('Something went wrong. Please try again.')
        );
    }, [txError, t]);

    const explorerUrl = getConfig(network.type).explorerUrl;
    const socialDescription = `${explorerUrl}/${txReceipt?.meta.txID}`;

    const explorerLink = uiConfig?.showExplorerButton &&
        txReceipt?.meta.txID && (
            <Link
                href={`${explorerUrl}/${txReceipt.meta.txID}`}
                isExternal
                opacity={0.6}
                fontSize={'14px'}
                textDecoration={'underline'}
            >
                <HStack
                    spacing={1}
                    alignItems={'center'}
                    justifyContent={'center'}
                >
                    <Text color={textSecondary}>
                        {t('View transaction on the explorer')}
                    </Text>
                    <Icon as={LuExternalLink} boxSize={'14px'} />
                </HStack>
            </Link>
        );

    const closeButton = (
        <Button onClick={onClose} variant={'ghost'} width={'full'}>
            {t('Close')}
        </Button>
    );

    // Treat the in-flight wallet step as `pending` visually so the spinner
    // doesn't disappear and reappear between "waiting for user signature"
    // and "waiting for chain confirmation".
    const isSendingTransaction = status === 'waitingConfirmation';
    const effectiveStatus = isSendingTransaction ? 'pending' : status;

    if (effectiveStatus === 'success') {
        return (
            <StatusScreen
                status={'success'}
                title={t('Transaction successful!')}
                bodyExtras={
                    uiConfig?.showShareOnSocials && txReceipt?.meta.txID ? (
                        <VStack spacing={3} pt={1}>
                            <Text
                                fontSize={'12px'}
                                fontWeight={600}
                                color={textSecondary}
                                textTransform={'uppercase'}
                                letterSpacing={'0.06em'}
                            >
                                {t('Share on')}
                            </Text>
                            <ShareButtons description={socialDescription} />
                        </VStack>
                    ) : undefined
                }
                actions={closeButton}
                footerExtras={explorerLink || undefined}
            />
        );
    }

    if (effectiveStatus === 'error') {
        return (
            <StatusScreen
                status={'error'}
                title={t('Something went wrong')}
                description={errorMessage ?? t('An unexpected error occurred.')}
                actions={
                    <VStack spacing={3} width={'full'}>
                        {onTryAgain && (
                            <Button
                                variant={'vechainKitPrimary'}
                                onClick={onTryAgain}
                                width={'full'}
                            >
                                <Icon mr={2} as={LuRefreshCw} />
                                {t('Try again')}
                            </Button>
                        )}
                        {closeButton}
                    </VStack>
                }
                footerExtras={explorerLink || undefined}
            />
        );
    }

    // Pending and ready states keep the legacy layout — they're transient
    // and don't benefit from the badge treatment. Pending in particular
    // needs the spinner front-and-centre, not an icon-in-disc.
    const titleNode =
        effectiveStatus === 'pending'
            ? uiConfig?.title ??
              (isSendingTransaction
                  ? t('Sending Transaction...')
                  : t('Waiting for confirmation'))
            : uiConfig?.title ?? t('Confirm transaction');

    const descriptionNode =
        effectiveStatus === 'pending'
            ? isSendingTransaction
                ? t(
                      'Transaction is being processed, it can take up to 15 seconds.',
                  )
                : uiConfig?.description ??
                  t('Please confirm the transaction in your wallet.')
            : uiConfig?.description ??
              t('Confirm the transaction in your wallet to complete it.');

    return (
        <>
            <StickyHeaderContainer>
                <ModalHeader textAlign={'center'}>{titleNode}</ModalHeader>
                <ModalCloseButton
                    isDisabled={
                        effectiveStatus === 'pending' && !uiConfig?.isClosable
                    }
                />
            </StickyHeaderContainer>

            <ModalBody>
                <VStack align={'center'} px={6} py={4} spacing={5}>
                    {effectiveStatus === 'pending' &&
                        (uiConfig?.loadingIcon ?? (
                            <Spinner
                                size={'xl'}
                                data-testid={'pending-spinner-modal'}
                            />
                        ))}

                    {descriptionNode && (
                        <Text
                            fontSize={'14px'}
                            lineHeight={'1.5'}
                            textAlign={'center'}
                            color={textPrimary}
                            maxW={'36ch'}
                        >
                            {descriptionNode}
                        </Text>
                    )}
                </VStack>
            </ModalBody>

            <ModalFooter justifyContent={'center'}>
                <VStack width={'full'} spacing={3}>
                    {effectiveStatus === 'ready' && (
                        <Button
                            onClick={onTryAgain}
                            variant={'vechainKitPrimary'}
                            width={'full'}
                        >
                            {t('Confirm')}
                        </Button>
                    )}
                    {effectiveStatus === 'ready' && closeButton}
                    {explorerLink}
                </VStack>
            </ModalFooter>
        </>
    );
};
