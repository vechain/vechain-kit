import {
    Button,
    GridItem,
    Icon,
    Input,
    InputGroup,
    InputLeftElement,
    useDisclosure,
    VStack,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    CloseButton,
    Box,
    Flex,
} from '@chakra-ui/react';
import { useLoginWithEmail } from '@privy-io/react-auth';
import { useState } from 'react';
import { LuMail } from 'react-icons/lu';
import { EmailCodeVerificationModal } from '../../EmailCodeVerificationModal/EmailCodeVerificationModal';
import { useTranslation } from 'react-i18next';
import { useVeChainKitConfig } from '@/providers';
import { Analytics } from '@/utils/mixpanelClientInstance';
import { VeLoginMethod } from '@/types/mixPanel';

export const EmailLoginButton = () => {
    const { t } = useTranslation();
    const { darkMode: isDark } = useVeChainKitConfig();

    // Email login
    const [email, setEmail] = useState('');
    const [privyError, setPrivyError] = useState<Error | null>(null);
    const [gmailError, setGmailError] = useState<Error | null>(null);
    const { sendCode, state: emailState } = useLoginWithEmail({onError: (error) => {
        setPrivyError(new Error(error));
    }});

    const emailCodeVerificationModal = useDisclosure();

    const handleSendCode = async () => {
        Analytics.auth.flowStarted(VeLoginMethod.EMAIL);
        Analytics.auth.methodSelected(VeLoginMethod.EMAIL);
        if (email.endsWith('@gmail.com')) {
            setGmailError(new Error('Use Social Login with VeChain'));
            return;
        }
        await sendCode({ email });
        // onClose();
        emailCodeVerificationModal.onOpen();
    };

    return (
        <>
            <GridItem colSpan={4} w={'full'}>
                <VStack spacing={3} w="full">
                {(gmailError || privyError) && (
                    <Alert status="error" alignItems="flex-start">
                        <AlertIcon mt={1} />
                        <Flex justify="space-between" width="100%">
                            <Box>
                                <AlertTitle>Error!</AlertTitle>
                                <AlertDescription>
                                    {gmailError
                                        ? 'Sign into Google using Social Login with VeChain'
                                        : privyError?.message || 'An error occurred'}
                                </AlertDescription>
                            </Box>
                            <CloseButton
                                position="relative"
                                onClick={() => {
                                    setPrivyError(null);
                                    setGmailError(null);
                                    setEmail('');
                                }}
                            />
                        </Flex>
                    </Alert>
                )}
                    <InputGroup size="lg" w="full" position="relative">
                        <InputLeftElement
                            pointerEvents="none"
                            height="100%"
                            pl={4}
                        >
                            <Icon
                                as={LuMail}
                                color={
                                    isDark ? 'whiteAlpha.600' : 'blackAlpha.700'
                                }
                                w={'20px'}
                                h={'20px'}
                                position="absolute"
                                top="50%"
                                transform="translateY(-50%)"
                            />
                        </InputLeftElement>
                        <Input
                            placeholder={t('your@email.com')}
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setPrivyError(null);
                                setGmailError(null);
                                
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSendCode();
                                }
                            }}
                            variant={'loginIn'}
                            fontSize={'16px'}
                            fontWeight={'400'}
                            backgroundColor={isDark ? 'transparent' : '#ffffff'}
                            border={`1px solid ${isDark ? '#ffffff0a' : '#e2e8f0'}`}
                            p={6}
                            borderRadius="full"
                            w={'full'}
                            pl={12}
                            pr={'120px'}
                            _focus={{
                                borderColor: 'blue.500',
                                boxShadow: 'none'
                            }}
                        />
                        <Button
                            aria-label="Send code"
                            type="submit"
                            position="absolute"
                            right={2}
                            top="50%"
                            transform="translateY(-50%)"
                            zIndex={2}
                            variant="solid"
                            bg="blue.100"
                            color="blue.600"
                            _hover={{ bg: 'blue.200' }}
                            size="md"
                            height="40px"
                            px={6}
                            borderRadius="full"
                            isLoading={emailState.status === 'sending-code'}
                            onClick={handleSendCode}
                            isDisabled={!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)}
                        >
                            {t('Submit')}
                        </Button>
                    </InputGroup>
                </VStack>
            </GridItem>

            <EmailCodeVerificationModal
                isOpen={emailCodeVerificationModal.isOpen}
                onClose={emailCodeVerificationModal.onClose}
                onResend={() => sendCode({ email })}
                email={email}
                isLoading={emailState.status === 'sending-code'}
            />
        </>
    );
};
