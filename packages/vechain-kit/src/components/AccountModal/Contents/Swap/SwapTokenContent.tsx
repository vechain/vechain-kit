import {
    Container,
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    VStack,
    Text,
    useColorMode,
    ModalFooter,
    Image,
    Button,
    Icon,
} from '@chakra-ui/react';
import {
    FadeInViewFromBottom,
    ModalBackButton,
    StickyHeaderContainer,
} from '@/components/common';
import { AccountModalContentTypes } from '../../Types';
import { FaExternalLinkAlt } from 'react-icons/fa';

type Props = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
};

export const SwapTokenContent = ({ setCurrentContent }: Props) => {
    const { colorMode } = useColorMode();
    const isDark = colorMode === 'dark';

    return (
        <FadeInViewFromBottom>
            <StickyHeaderContainer>
                <ModalHeader
                    fontSize={'md'}
                    fontWeight={'500'}
                    textAlign={'center'}
                    color={isDark ? '#dfdfdd' : '#4d4d4d'}
                >
                    Swap
                </ModalHeader>
                <ModalBackButton onClick={() => setCurrentContent('main')} />
                <ModalCloseButton />
            </StickyHeaderContainer>

            <FadeInViewFromBottom>
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
                                BetterSwap is VeChain's trusted decentralized
                                exchange (DEX) for seamless token swaps.
                                Effortlessly trade VeChain assets in a secure,
                                fast, and user-friendly environment. Click below
                                to get started!
                            </Text>
                        </VStack>
                    </ModalBody>
                </Container>
            </FadeInViewFromBottom>

            <ModalFooter>
                <Button
                    px={4}
                    width="full"
                    height="60px"
                    variant="solid"
                    borderRadius="xl"
                    onClick={() => {
                        window.open('https://swap.tbc.vet/', '_blank');
                    }}
                >
                    Launch BetterSwap
                    <Icon as={FaExternalLinkAlt} ml={2} />
                </Button>
            </ModalFooter>
        </FadeInViewFromBottom>
    );
};
