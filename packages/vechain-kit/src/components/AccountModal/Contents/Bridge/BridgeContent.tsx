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

type Props = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
};

export const BridgeContent = ({ setCurrentContent }: Props) => {
    const { t } = useTranslation();
    const { darkMode: isDark } = useVeChainKitConfig();

    return (
        <>
            <StickyHeaderContainer>
                <ModalHeader
                    fontSize={'md'}
                    fontWeight={'500'}
                    textAlign={'center'}
                    color={isDark ? '#dfdfdd' : '#4d4d4d'}
                >
                    {t('Bridge')}
                </ModalHeader>
                <ModalBackButton onClick={() => setCurrentContent('main')} />
                <ModalCloseButton />
            </StickyHeaderContainer>

            <Container maxW={'container.lg'}>
                <ModalBody>
                    <VStack spacing={6} align="center" w="full">
                        <Image
                            src={'https://swap.vechain.energy/assets/logo.svg'}
                            alt="bridge token"
                            w={'200px'}
                            h={'200px'}
                            borderRadius={'xl'}
                        />

                        <Text fontSize="sm" textAlign="center">
                            {t(
                                "Exchange your digital assets between VeChain and other blockchain networks easily and securely. You can also buy VET (VeChain's digital currency) directly using regular money like US dollars or euros through trusted partners, who ensure safe and compliant transactions.",
                            )}
                        </Text>
                    </VStack>
                </ModalBody>
            </Container>

            <ModalFooter>
                <Button
                    px={4}
                    width="full"
                    height="60px"
                    variant="solid"
                    borderRadius="xl"
                    onClick={() => {
                        window.open('https://swap.vechain.energy/', '_blank');
                    }}
                >
                    {t('Launch vechain.energy')}
                    <Icon as={FaExternalLinkAlt} ml={2} />
                </Button>
            </ModalFooter>
        </>
    );
};
