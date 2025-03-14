import {
    Button,
    GridItem,
    Icon,
    Input,
    InputGroup,
    InputLeftElement,
    useDisclosure,
    VStack,
} from '@chakra-ui/react';
import { useLoginWithEmail } from '@privy-io/react-auth';
import { useState } from 'react';
import { LuMail } from 'react-icons/lu';
import { EmailCodeVerificationModal } from '../../EmailCodeVerificationModal/EmailCodeVerificationModal';
import { useTranslation } from 'react-i18next';
import { useVeChainKitConfig } from '@/providers';
import { AuthTracking } from '@/utils/mixpanelClientInstance';
import { VeLoginMethod } from '@/types';

export const EmailLoginButton = () => {
    const { t } = useTranslation();
    const { darkMode: isDark } = useVeChainKitConfig();

    // Email login
    const [email, setEmail] = useState('');

    const { sendCode, state: emailState } = useLoginWithEmail({});

    const emailCodeVerificationModal = useDisclosure();

    const handleSendCode = async () => {
        AuthTracking.loginMethodSelected(VeLoginMethod.EMAIL);
        await sendCode({ email });
        // onClose();
        emailCodeVerificationModal.onOpen();
    };

    return (
        <>
            <GridItem colSpan={4} w={'full'}>
                <VStack spacing={3} w="full">
                    <InputGroup size="lg" w="full">
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
                            />
                        </InputLeftElement>
                        <Input
                            placeholder={t('your@email.com')}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            variant={'loginIn'}
                            fontSize={'16px'}
                            fontWeight={'400'}
                            backgroundColor={isDark ? 'transparent' : '#ffffff'}
                            border={`1px solid ${
                                isDark ? '#ffffff0a' : '#ebebeb'
                            }`}
                            p={6}
                            borderRadius={16}
                            w={'full'}
                            pl={12}
                        />
                        <Button
                            aria-label="Send code"
                            position="absolute"
                            right={2}
                            top="50%"
                            transform="translateY(-50%)"
                            zIndex={2}
                            variant="ghost"
                            size="sm"
                            px={6}
                            borderRadius="full"
                            isLoading={emailState.status === 'sending-code'}
                            onClick={handleSendCode}
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
