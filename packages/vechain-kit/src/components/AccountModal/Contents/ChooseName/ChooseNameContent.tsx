import {
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    VStack,
    Text,
    useColorMode,
    Button,
    Icon,
} from '@chakra-ui/react';
import {
    FadeInViewFromBottom,
    ModalBackButton,
    StickyHeaderContainer,
} from '@/components/common';
import { AccountModalContentTypes } from '../../Types';
import { FaRegAddressCard } from 'react-icons/fa';

type Props = {
    setCurrentContent: (content: AccountModalContentTypes) => void;
};

export const ChooseNameContent = ({ setCurrentContent }: Props) => {
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
                    Choose your account name
                </ModalHeader>
                <ModalBackButton
                    onClick={() => setCurrentContent('settings')}
                />
                <ModalCloseButton />
            </StickyHeaderContainer>

            <FadeInViewFromBottom>
                <ModalBody>
                    <VStack spacing={6} align="center" py={8}>
                        <Icon
                            as={FaRegAddressCard}
                            boxSize={16}
                            opacity={0.5}
                            color={isDark ? 'whiteAlpha.800' : 'gray.600'}
                        />
                        <VStack spacing={2}>
                            <Text
                                fontSize="lg"
                                fontWeight="500"
                                textAlign="center"
                            >
                                Finally say goodbye to 0x addresses
                            </Text>
                            <Text
                                fontSize="md"
                                opacity={0.7}
                                textAlign="center"
                                px={4}
                            >
                                Name your account to make it easier to exchange
                                assets
                            </Text>
                        </VStack>

                        <Button
                            width="full"
                            height="60px"
                            variant="solid"
                            borderRadius="xl"
                            onClick={() =>
                                setCurrentContent({
                                    type: 'choose-name-search',
                                    props: {
                                        name: '',
                                        setCurrentContent: setCurrentContent,
                                    },
                                })
                            }
                        >
                            Choose name
                        </Button>
                    </VStack>
                </ModalBody>
            </FadeInViewFromBottom>
        </FadeInViewFromBottom>
    );
};
