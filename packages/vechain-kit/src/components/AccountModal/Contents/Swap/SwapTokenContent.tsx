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
import { Analytics } from '@/utils/mixpanelClientInstance';
import { useEffect } from 'react';

type Props = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
};

export const SwapTokenContent = ({ setCurrentContent }: Props) => {
    useEffect(() => {
        Analytics.swap.pageOpened();
    }, []);

    const { t } = useTranslation();

    const handleLaunchBetterSwap = () => {
        Analytics.swap.launchBetterSwap();
        window.open('https://swap.tbc.vet/', '_blank');
    };

    return (
        <>
            <StickyHeaderContainer>
                <ModalHeader>{t('Swap')}</ModalHeader>
                <ModalBackButton onClick={() => setCurrentContent('main')} />
                <ModalCloseButton />
            </StickyHeaderContainer>

            <Container maxW={'container.lg'}>
                <ModalBody>
                    <VStack spacing={6} align="center" w="full">
                        <Image
                            src={'https://i.ibb.co/S75JGc9/download-1.png'}
                            alt="swap token"
                            w={'200px'}
                            h={'200px'}
                            borderRadius={'xl'}
                        />

                        <Text fontSize="sm" textAlign="center">
                            {t(
                                "BetterSwap is VeChain's trusted decentralized exchange (DEX) for seamless token swaps. Effortlessly trade VeChain assets in a secure, fast, and user-friendly environment. Click below to get started!",
                            )}
                        </Text>
                    </VStack>
                </ModalBody>
            </Container>

            <ModalFooter>
                <Button
                    variant="vechainKitSecondary"
                    onClick={handleLaunchBetterSwap}
                >
                    {t('Launch BetterSwap')}
                    <Icon as={FaExternalLinkAlt} ml={2} />
                </Button>
            </ModalFooter>
        </>
    );
};
