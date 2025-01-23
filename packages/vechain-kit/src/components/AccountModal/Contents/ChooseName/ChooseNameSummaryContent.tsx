import {
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    VStack,
    Button,
    ModalFooter,
    useDisclosure,
    Icon,
} from '@chakra-ui/react';
import {
    ModalBackButton,
    StickyHeaderContainer,
    AddressDisplayCard,
} from '@/components/common';
import { AccountModalContentTypes } from '../../Types';
import { useWallet } from '@/hooks';
import { TransactionModal } from '@/components/TransactionModal';
import { useClaimVeWorldSubdomain } from '@/hooks/api/vetDomains/useClaimVeWorldSubdomain';
import { GiConfirmed } from 'react-icons/gi';
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
    const { account } = useWallet();
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
                <VStack spacing={4} w="full">
                    <AddressDisplayCard
                        label={t('Current')}
                        address={account?.address ?? ''}
                        domain={account?.domain}
                        imageSrc={account?.image ?? ''}
                        imageAlt="Current account"
                        hideAddress={true}
                    />

                    <AddressDisplayCard
                        label={t('New Name')}
                        address={account?.address ?? ''}
                        domain={`${name}.veworld.vet`}
                        imageSrc={account?.image ?? ''}
                        imageAlt="Account"
                        hideAddress={true}
                    />
                </VStack>
            </ModalBody>

            <ModalFooter>
                <Button
                    px={4}
                    width="full"
                    height="60px"
                    variant="solid"
                    borderRadius="xl"
                    colorScheme="blue"
                    onClick={handleConfirm}
                    rightIcon={<Icon as={GiConfirmed} />}
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
