import {
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    VStack,
    Button,
    ModalFooter,
    useDisclosure,
    Text,
} from '@chakra-ui/react';
import { ModalBackButton, StickyHeaderContainer } from '@/components/common';
import { AccountModalContentTypes } from '../../Types';
import { TransactionModal } from '@/components/TransactionModal';
import { useClaimVeWorldSubdomain } from '@/hooks/api/vetDomains/useClaimVeWorldSubdomain';
import { useTranslation } from 'react-i18next';
import { useVeChainKitConfig } from '@/providers';

export type ChooseNameSummaryContentProps = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
    name: string;
    isOwnDomain: boolean;
};

export const ChooseNameSummaryContent = ({
    setCurrentContent,
    name,
    isOwnDomain,
}: ChooseNameSummaryContentProps) => {
    const { t } = useTranslation();
    const { darkMode: isDark } = useVeChainKitConfig();
    const transactionModal = useDisclosure();

    const { sendTransaction, status, txReceipt, error, progress } =
        useClaimVeWorldSubdomain({
            subdomain: name,
            domain: 'veworld.vet',
            alreadyOwned: isOwnDomain,
        });

    const handleConfirm = async () => {
        transactionModal.onOpen();
        try {
            await sendTransaction();
        } catch (error) {
            console.error('Transaction failed:', error);
            transactionModal.onClose();
        }
    };

    return (
        <>
            <StickyHeaderContainer>
                <ModalHeader
                    fontSize={'md'}
                    fontWeight={'500'}
                    textAlign={'center'}
                    color={isDark ? '#dfdfdd' : '#4d4d4d'}
                >
                    {t('Confirm Name')}
                </ModalHeader>
                <ModalBackButton
                    onClick={() =>
                        setCurrentContent({
                            type: 'choose-name-search',
                            props: {
                                setCurrentContent,
                                name,
                            },
                        })
                    }
                />
                <ModalCloseButton />
            </StickyHeaderContainer>

            <ModalBody>
                <VStack spacing={4} w="full" textAlign="center">
                    <Text fontSize="lg">
                        {t('Are you sure you want to set your domain name to')}
                    </Text>
                    <Text fontSize="xl" fontWeight="bold" color="blue.500">
                        {`${name}.veworld.vet`}
                    </Text>
                </VStack>
            </ModalBody>

            <ModalFooter gap={4}>
                <Button
                    px={4}
                    width="full"
                    height="48px"
                    variant="outline"
                    borderRadius="xl"
                    onClick={() =>
                        setCurrentContent({
                            type: 'choose-name-search',
                            props: {
                                setCurrentContent,
                                name,
                            },
                        })
                    }
                >
                    {t('Cancel')}
                </Button>
                <Button
                    px={4}
                    width="full"
                    height="48px"
                    variant="solid"
                    borderRadius="xl"
                    colorScheme="blue"
                    onClick={handleConfirm}
                >
                    {t('Confirm')}
                </Button>
            </ModalFooter>

            <TransactionModal
                isOpen={transactionModal.isOpen}
                onClose={() => {
                    transactionModal.onClose();
                    setCurrentContent('main');
                }}
                status={status}
                txId={txReceipt?.meta.txID}
                errorDescription={error?.reason ?? 'Unknown error'}
                showExplorerButton={true}
                showSocialButtons={true}
                showTryAgainButton={true}
                progress={progress}
                onTryAgain={handleConfirm}
            />
        </>
    );
};
