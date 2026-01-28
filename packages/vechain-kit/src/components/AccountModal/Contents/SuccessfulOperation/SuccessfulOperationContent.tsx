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
import { StickyHeaderContainer } from '../../../common';
import { AccountModalContentTypes } from '../../Types';
import { useTranslation } from 'react-i18next';
// Direct import to avoid circular dependency via providers barrel export
import { useVeChainKitConfig } from '../../../../providers/VeChainKitContext';
import { getConfig } from '../../../../config';
import { LuExternalLink, LuCircleCheck } from 'react-icons/lu';
import { ShareButtons } from '../../../TransactionModal';

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
    const { network } = useVeChainKitConfig();
    const explorerUrl = getConfig(network.type).explorerUrl;
    const socialDescription = `${explorerUrl}/${txId}`;

    const successColor = useToken('colors', 'vechain-kit-success');
    const textPrimary = useToken('colors', 'vechain-kit-text-primary');
    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');

    return (
        <>
            <StickyHeaderContainer>
                <ModalHeader>{title}</ModalHeader>
                <ModalCloseButton />
            </StickyHeaderContainer>

            <ModalBody>
                <VStack align={'center'} p={6} spacing={3}>
                    <Icon
                        as={LuCircleCheck}
                        fontSize={'100px'}
                        color={successColor}
                        data-testid="success-icon"
                    />

                    {description && (
                        <Text
                            fontSize="sm"
                            textAlign="center"
                            color={textPrimary}
                        >
                            {description}
                        </Text>
                    )}

                    {showSocialButtons && txId && (
                        <VStack mt={2} spacing={3}>
                            <Text
                                fontSize="sm"
                                fontWeight={'bold'}
                                color={textSecondary}
                            >
                                {t('Share on')}
                            </Text>
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
                                <Text color={textSecondary}>
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
