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
} from '@chakra-ui/react';
import { StickyHeaderContainer } from '../../../common';
import { AccountModalContentTypes } from '../../Types';
import { useTranslation } from 'react-i18next';
import { useVeChainKitConfig } from '../../../../providers';
import { getConfig } from '../../../../config';
import { LuExternalLink, LuCircleAlert } from 'react-icons/lu';

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
    const { network, darkMode } = useVeChainKitConfig();
    const explorerUrl = getConfig(network.type).explorerUrl;

    return (
        <>
            <StickyHeaderContainer>
                <ModalHeader>{title}</ModalHeader>
                <ModalCloseButton />
            </StickyHeaderContainer>

            <ModalBody>
                <VStack align={'center'} p={6} spacing={3}>
                    <Icon
                        as={LuCircleAlert}
                        fontSize={'100px'}
                        color={darkMode ? 'red.400' : 'red.500'}
                        data-testid="error-icon"
                    />

                    {description && (
                        <Text fontSize="sm" textAlign="center">
                            {description}
                        </Text>
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
