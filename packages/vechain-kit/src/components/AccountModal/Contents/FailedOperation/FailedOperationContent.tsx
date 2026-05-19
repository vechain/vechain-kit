import {
    Button,
    HStack,
    Icon,
    Link,
    Text,
    useToken,
} from '@chakra-ui/react';
import { LuExternalLink } from 'react-icons/lu';
import { StatusScreen } from '@/components/common';
import { AccountModalContentTypes } from '../../Types';
import { useTranslation } from 'react-i18next';
import { useVeChainKitConfig } from '@/providers';
import { getConfig } from '@/config';

export type FailedOperationContentProps = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
    txId?: string;
    title: string;
    description?: string;
    onDone: () => void;
};

export const FailedOperationContent = ({
    txId,
    title,
    description,
    onDone,
}: FailedOperationContentProps) => {
    const { t } = useTranslation();
    const { network } = useVeChainKitConfig();
    const explorerUrl = getConfig(network.type).explorerUrl;

    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');

    return (
        <StatusScreen
            status={'error'}
            title={title}
            description={description}
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
