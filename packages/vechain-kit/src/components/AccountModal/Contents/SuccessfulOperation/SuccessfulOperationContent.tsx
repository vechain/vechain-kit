import {
    Button,
    HStack,
    Icon,
    Link,
    Text,
    VStack,
    useToken,
} from '@chakra-ui/react';
import { LuExternalLink } from 'react-icons/lu';
import { StatusScreen } from '@/components/common';
import { AccountModalContentTypes } from '../../Types';
import { useTranslation } from 'react-i18next';
import { useVeChainKitConfig } from '@/providers';
import { getConfig } from '@/config';
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
    const { network } = useVeChainKitConfig();
    const explorerUrl = getConfig(network.type).explorerUrl;
    const socialDescription = `${explorerUrl}/${txId}`;

    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');

    return (
        <StatusScreen
            status={'success'}
            title={title}
            description={description}
            bodyExtras={
                showSocialButtons && txId ? (
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
            actions={
                <Button
                    onClick={onDone}
                    variant={'vechainKitSecondary'}
                    width={'full'}
                >
                    {t('Done')}
                </Button>
            }
            footerExtras={
                txId ? (
                    <Link
                        href={`${explorerUrl}/${txId}`}
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
                ) : undefined
            }
        />
    );
};
