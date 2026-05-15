import {
    Button,
    GridItem,
    Icon,
    Input,
    InputGroup,
    InputLeftElement,
    useDisclosure,
    useToken,
    VStack,
} from '@chakra-ui/react';
import { useLoginWithEmail } from '@privy-io/react-auth';
import { useState } from 'react';
import { LuMail } from 'react-icons/lu';
import { EmailCodeVerificationModal } from '../../EmailCodeVerificationModal/EmailCodeVerificationModal';
import { useTranslation } from 'react-i18next';
import { useVeChainKitConfig } from '@/providers';
import { useLoginWithVeChain } from '@/hooks';
import { ConnectionButton } from '@/components';

export const EmailLoginButton = () => {
    const { privy } = useVeChainKitConfig();
    if (!privy) {
        return <EmailLoginCrossAppButton />;
    }
    return <EmailLoginPrivyButton />;
};

/** Inline email input -> OTP modal flow, powered by the host app's Privy. */
const EmailLoginPrivyButton = () => {
    const { t } = useTranslation();
    const { darkMode: isDark } = useVeChainKitConfig();

    const [email, setEmail] = useState('');

    const { sendCode, state: emailState } = useLoginWithEmail({});

    const emailCodeVerificationModal = useDisclosure();

    const handleSendCode = async () => {
        await sendCode({ email });
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

/** Button that hands the email/OTP flow off to the VeChain whitelabel
 *  cross-app host (used when the consumer dApp has no Privy config). */
const EmailLoginCrossAppButton = () => {
    const { t } = useTranslation();
    const { darkMode: isDark } = useVeChainKitConfig();
    const { login: loginViaCrossApp } = useLoginWithVeChain();

    const [stroke, strokeStrong, hoverBg] = useToken('colors', [
        'vechain-kit-border-button',
        'vechain-kit-border-hover',
        'vechain-kit-button-secondary-bg',
    ]);

    return (
        <GridItem colSpan={4} w={'full'}>
            <ConnectionButton
                isDark={isDark}
                onClick={async () => {
                    await loginViaCrossApp({ intent: 'email' });
                }}
                icon={LuMail}
                iconWidth={'24px'}
                text={t('Continue with Email')}
                style={{
                    bg: 'transparent',
                    border: `1px solid ${stroke}`,
                    _hover: {
                        bg: hoverBg,
                        borderColor: strokeStrong,
                        opacity: 1,
                    },
                }}
            />
        </GridItem>
    );
};
