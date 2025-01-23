import {
    Button,
    VStack,
    Text,
    HStack,
    PinInput,
    PinInputField,
    Icon,
    ModalFooter,
    ModalBody,
    ModalHeader,
    ModalCloseButton,
    Container,
} from '@chakra-ui/react';
import { MdEmail } from 'react-icons/md';
import { BaseModal, StickyHeaderContainer } from '../common';
import { useEffect, useState } from 'react';
import { useLoginWithEmail } from '@privy-io/react-auth';
import { useTranslation } from 'react-i18next';
import { useVeChainKitConfig } from '@/providers';

type Props = {
    email: string;
    onResend: () => void;
    isLoading: boolean;
    isOpen: boolean;
    onClose: () => void;
};

export const EmailCodeVerificationModal = ({
    email,
    onResend,
    isLoading,
    isOpen,
    onClose,
}: Props) => {
    const { t } = useTranslation();
    const { darkMode: isDark } = useVeChainKitConfig();
    const [code, setCode] = useState('');
    const [error, setError] = useState<string | null>(null);
    const { loginWithCode } = useLoginWithEmail({});

    useEffect(() => {
        if (code.length === 6) {
            loginWithCode({ code })
                .then(() => {
                    onClose();
                })
                .catch((error) => {
                    setError(error.message);
                });
        }
    }, [code]);

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} trapFocus={false}>
            <StickyHeaderContainer>
                <ModalHeader
                    fontSize={'md'}
                    fontWeight={'500'}
                    textAlign={'center'}
                    color={isDark ? '#dfdfdd' : '#4d4d4d'}
                    justifyContent={'center'}
                    alignItems={'center'}
                    display={'flex'}
                    gap={2}
                >
                    {t('Enter confirmation code')}
                </ModalHeader>
                <ModalCloseButton />
            </StickyHeaderContainer>

            <Container maxW={'container.lg'}>
                <ModalBody>
                    <VStack spacing={2}>
                        <Icon
                            as={MdEmail}
                            w="48px"
                            h="48px"
                            color={isDark ? 'whiteAlpha.700' : 'gray.600'}
                        />

                        <Text
                            fontSize="xs"
                            color={isDark ? 'whiteAlpha.700' : 'gray.600'}
                            textAlign="center"
                        >
                            {t(
                                'Please check {{email}} for an email from privy.io and enter your code below.',
                                {
                                    email,
                                },
                            )}
                        </Text>
                        <HStack spacing={2} justify="center" mt={4}>
                            <PinInput
                                value={code}
                                onChange={setCode}
                                otp
                                size="lg"
                                isInvalid={!!error}
                                errorBorderColor="red.500"
                            >
                                <PinInputField
                                    borderRadius="12px"
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
                                    backgroundColor={
                                        isDark ? 'transparent' : '#ffffff'
                                    }
                                />
                                <PinInputField
                                    borderRadius="12px"
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
                                    backgroundColor={
                                        isDark ? 'transparent' : '#ffffff'
                                    }
                                />
                                <PinInputField
                                    borderRadius="12px"
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
                                    backgroundColor={
                                        isDark ? 'transparent' : '#ffffff'
                                    }
                                />
                                <PinInputField
                                    borderRadius="12px"
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
                                    backgroundColor={
                                        isDark ? 'transparent' : '#ffffff'
                                    }
                                />
                                <PinInputField
                                    borderRadius="12px"
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
                                    backgroundColor={
                                        isDark ? 'transparent' : '#ffffff'
                                    }
                                />
                                <PinInputField
                                    borderRadius="12px"
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
                                    backgroundColor={
                                        isDark ? 'transparent' : '#ffffff'
                                    }
                                />
                            </PinInput>
                        </HStack>
                        {error && (
                            <Text color="red.500" fontSize="xs">
                                {error}
                            </Text>
                        )}
                    </VStack>
                </ModalBody>
                <ModalFooter>
                    <Text
                        w="100%"
                        textAlign="center"
                        fontSize="14px"
                        color={isDark ? 'whiteAlpha.700' : 'gray.600'}
                    >
                        {t("Didn't get an email?")}{' '}
                        <Button
                            variant="link"
                            color="blue.500"
                            fontSize="14px"
                            onClick={onResend}
                            isLoading={isLoading}
                        >
                            {t('Resend code')}
                        </Button>
                    </Text>
                </ModalFooter>
            </Container>
        </BaseModal>
    );
};
