import {
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    VStack,
    Text,
    useColorMode,
    Input,
    InputGroup,
    Box,
    Button,
    ModalFooter,
    InputRightElement,
} from '@chakra-ui/react';
import {
    FadeInViewFromBottom,
    ModalBackButton,
    StickyHeaderContainer,
} from '@/components/common';
import { AccountModalContentTypes } from '../../Types';
import { useState, useEffect } from 'react';
import { useEnsRecordExists, useWallet } from '@/hooks';

export type ChooseNameSearchContentProps = {
    name: string;
    setCurrentContent: (content: AccountModalContentTypes) => void;
};

export const ChooseNameSearchContent = ({
    name: initialName,
    setCurrentContent,
}: ChooseNameSearchContentProps) => {
    const { account, connection } = useWallet();
    const { colorMode } = useColorMode();
    const isDark = colorMode === 'dark';
    const [name, setName] = useState(initialName);
    const [error, setError] = useState<string | null>(null);
    const [isAvailable, setIsAvailable] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);

    const { data: domainData, isLoading } = useEnsRecordExists(
        name,
        'veworld.vet',
    );

    useEffect(() => {
        if (!hasInteracted) return;

        if (name.length < 3) {
            setError('Name must be at least 3 characters long');
            setIsAvailable(false);
        } else if (domainData?.address) {
            setError('This domain is already taken');
            setIsAvailable(false);
        } else if (!isLoading) {
            setError(null);
            setIsAvailable(true);
        }
    }, [name, hasInteracted, domainData, isLoading]);

    const handleContinue = () => {
        if (isAvailable && !error) {
            setCurrentContent({
                type: 'choose-name-summary',
                props: {
                    name,
                    setCurrentContent,
                },
            });
        }
    };

    return (
        <FadeInViewFromBottom>
            <StickyHeaderContainer>
                <ModalHeader
                    fontSize={'md'}
                    fontWeight={'500'}
                    textAlign={'center'}
                    color={isDark ? '#dfdfdd' : '#4d4d4d'}
                >
                    Choose Name
                </ModalHeader>
                <ModalBackButton
                    onClick={() =>
                        // if the user has a domain, go to accounts
                        connection.isConnectedWithDappKit
                            ? setCurrentContent('settings')
                            : account.domain
                            ? setCurrentContent('smart-account')
                            : setCurrentContent('choose-name')
                    }
                />
                <ModalCloseButton />
            </StickyHeaderContainer>

            <FadeInViewFromBottom>
                <ModalBody>
                    <VStack spacing={4} align="stretch">
                        <InputGroup size="lg">
                            <Input
                                placeholder="Enter your name"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    if (!hasInteracted) setHasInteracted(true);
                                }}
                                paddingRight="120px"
                                fontSize="lg"
                                height="60px"
                                bg={isDark ? '#1a1a1a' : 'white'}
                                border={`1px solid ${
                                    isDark ? '#ffffff29' : '#ebebeb'
                                }`}
                                _hover={{
                                    border: `1px solid ${
                                        isDark ? '#ffffff40' : '#e0e0e0'
                                    }`,
                                }}
                                _focus={{
                                    border: `1px solid ${
                                        isDark ? '#ffffff60' : '#d0d0d0'
                                    }`,
                                    boxShadow: 'none',
                                }}
                                isInvalid={!!error}
                            />
                            <InputRightElement
                                width="auto"
                                paddingRight="12px"
                                h={'full'}
                            >
                                <Box
                                    mr={4}
                                    fontSize="sm"
                                    color={
                                        isDark ? 'whiteAlpha.800' : 'gray.500'
                                    }
                                >
                                    .veworld.vet
                                </Box>
                            </InputRightElement>
                        </InputGroup>

                        {error && hasInteracted && (
                            <Text color="red.500" fontSize="sm">
                                {error}
                            </Text>
                        )}

                        {!error && hasInteracted && name.length >= 3 && (
                            <Text
                                fontSize="sm"
                                color={isAvailable ? 'green.500' : 'red.500'}
                                fontWeight="500"
                            >
                                {isAvailable ? 'AVAILABLE' : 'UNAVAILABLE'}
                            </Text>
                        )}
                    </VStack>
                </ModalBody>

                <ModalFooter>
                    <Button
                        px={4}
                        width="full"
                        height="60px"
                        variant="solid"
                        borderRadius="xl"
                        isDisabled={!isAvailable || !!error}
                        onClick={handleContinue}
                    >
                        Continue
                    </Button>
                </ModalFooter>
            </FadeInViewFromBottom>
        </FadeInViewFromBottom>
    );
};
