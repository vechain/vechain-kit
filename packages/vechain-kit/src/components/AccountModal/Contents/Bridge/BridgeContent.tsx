import {
    Container,
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    VStack,
    Text,
    ModalFooter,
    Button,
    Icon,
} from '@chakra-ui/react';
import { ModalBackButton, StickyHeaderContainer } from '../../../common';
import { AccountModalContentTypes } from '../../Types';
import { LuExternalLink } from 'react-icons/lu';
import { useTranslation } from 'react-i18next';
// Direct import to avoid circular dependency via providers barrel export
import { useVeChainKitConfig } from '../../../../providers/VeChainKitProvider';
import { VechainEnergy } from '../../../../assets';
import { useAccountModalOptions } from '../../../../hooks/modals/useAccountModalOptions';
import { VECHAIN_ENERGY_SWAP_BASE_URL } from '../../../../constants';

type Props = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
};

export const BridgeContent = ({ setCurrentContent }: Props) => {
    const { t } = useTranslation();
    const { darkMode: isDark } = useVeChainKitConfig();
    const { isolatedView } = useAccountModalOptions();

    const handleLaunchVeChainEnergy = () => {
        window.open(VECHAIN_ENERGY_SWAP_BASE_URL, '_blank');
    };

    return (
        <>
            <StickyHeaderContainer>
                <ModalHeader>{t('Bridge')}</ModalHeader>
                {!isolatedView && (
                    <ModalBackButton onClick={() => setCurrentContent('main')} />
                )}
                <ModalCloseButton />
            </StickyHeaderContainer>

            <Container maxW={'container.lg'}>
                <ModalBody>
                    <VStack spacing={6} align="center" w="full">
                        <VechainEnergy isDark={isDark} borderRadius={'xl'} />

                        <Text fontSize="sm" textAlign="center">
                            {t(
                                'Exchange your digital assets between VeChain and other blockchain networks easily and securely. Swaps are executed through partners that leverage both decentralized and centralized exchanges to convert tokens.',
                            )}
                        </Text>
                    </VStack>
                </ModalBody>
            </Container>

            <ModalFooter>
                <Button
                    variant="vechainKitSecondary"
                    onClick={handleLaunchVeChainEnergy}
                >
                    {t('Launch vechain.energy')}
                    <Icon as={LuExternalLink} ml={2} />
                </Button>
            </ModalFooter>
        </>
    );
};
