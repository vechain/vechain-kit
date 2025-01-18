import {
    Button,
    Link,
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    Text,
    VStack,
    useColorMode,
    Icon,
    HStack,
    Heading,
    Tag,
} from '@chakra-ui/react';
import { FaExternalLinkAlt } from 'react-icons/fa';
import {
    FadeInViewFromBottom,
    ModalBackButton,
    StickyHeaderContainer,
} from '@/components/common';
import { useVeChainKitConfig } from '@/providers';
import { VechainLogoHorizontal } from '@/assets';
import { FAQAccordion } from './FAQAccordion';

type Props = {
    onGoBack: () => void;
};

export const FAQContent = ({ onGoBack }: Props) => {
    const { colorMode } = useColorMode();
    const isDark = colorMode === 'dark';

    const { network } = useVeChainKitConfig();

    return (
        <FadeInViewFromBottom>
            <StickyHeaderContainer>
                <ModalHeader
                    fontSize={'md'}
                    fontWeight={'500'}
                    textAlign={'center'}
                    color={isDark ? '#dfdfdd' : '#4d4d4d'}
                >
                    Info
                </ModalHeader>
                <ModalBackButton onClick={onGoBack} />
                <ModalCloseButton />
            </StickyHeaderContainer>

            <FadeInViewFromBottom>
                <ModalBody>
                    <VStack spacing={6} align="stretch">
                        <VStack>
                            <HStack justify={'center'}>
                                <VechainLogoHorizontal
                                    isDark={isDark}
                                    w={'200px'}
                                />
                            </HStack>
                            <Text
                                fontSize="sm"
                                opacity={0.7}
                                textAlign={'center'}
                            >
                                Welcome! Here you can manage your wallet, send
                                tokens, and interact with the VeChain blockchain
                                and its applications.
                            </Text>
                        </VStack>

                        <HStack justify={'center'}>
                            <Tag
                                size={'sm'}
                                colorScheme={'blue'}
                                width={'fit-content'}
                                justifyContent={'center'}
                                padding={'10px'}
                            >
                                Network: {network.type}
                            </Tag>
                        </HStack>

                        <Heading
                            fontSize={'md'}
                            fontWeight={'500'}
                            textAlign={'center'}
                            mt={4}
                            mb={1}
                        >
                            Frequently asked questions
                        </Heading>

                        <FAQAccordion />

                        <Button
                            as={Link}
                            href="https://vechain-foundation-san-marino.gitbook.io/social-login-dappkit-privy/~/changes/3deX4SvayBeNDBaxivMg"
                            isExternal
                            variant="outline"
                            rightIcon={<Icon as={FaExternalLinkAlt} />}
                            size="lg"
                            height="60px"
                            mt={4}
                        >
                            For developers
                        </Button>
                    </VStack>
                </ModalBody>
            </FadeInViewFromBottom>
        </FadeInViewFromBottom>
    );
};
