import {
    Container,
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    VStack,
    Text,
    ModalFooter,
    Image,
    Button,
    Icon,
} from '@chakra-ui/react';
import { ModalBackButton, StickyHeaderContainer } from '@/components/common';
import { AccountModalContentTypes } from '../../Types';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useVeChainKitConfig } from '@/providers';
import { Analytics } from '@/utils/mixpanelClientInstance';
import { useEffect } from 'react';

type Props = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
};

export const BridgeContent = ({ setCurrentContent }: Props) => {
    const { t } = useTranslation();
    const { darkMode: isDark } = useVeChainKitConfig();

    useEffect(() => {
        Analytics.bridge.opened();
    }, []);

    const handleLaunchVeChainEnergy = () => {
        Analytics.bridge.launchVeChainEnergy();
        window.open('https://swap.vechain.energy/', '_blank');
    };

    return (
        <>
            <StickyHeaderContainer>
                <ModalHeader>{t('Bridge')}</ModalHeader>
                <ModalBackButton onClick={() => setCurrentContent('main')} />
                <ModalCloseButton />
            </StickyHeaderContainer>

            <Container maxW={'container.lg'}>
                <ModalBody>
                    <VStack spacing={6} align="center" w="full">
                        <Image
                            src={
                                isDark
                                    ? 'https://static.vechain.energy/logo-dark.svg'
                                    : 'https://static.vechain.energy/logo-light.svg'
                            }
                            alt="bridge token"
                            w={'200px'}
                            h={'200px'}
                            borderRadius={'xl'}
                        />

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
                    <Icon as={FaExternalLinkAlt} ml={2} />
                </Button>
            </ModalFooter>
        </>
    );
};
