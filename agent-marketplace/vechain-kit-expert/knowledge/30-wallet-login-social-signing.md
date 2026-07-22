# VeChain Kit — Wallets, login, social accounts, and signing

Connection state, wallet sources, Privy and cross-app login, embedded wallets, smart-account identity, message signing, and generic fee delegation.

> Generated from the VeChain Kit repository. File paths are preserved so answers can cite the source.
> VeChain Kit commit: `f8f32209bf76b08a0e459f534c9fb488a9e5fd00`. VeChain AI Skills commit: `b0d8b8f0dbb97cf4224840f7ee7a2eaadea677f2`.

## Source: `packages/vechain-kit/src/components/ConnectModal/Components/ConnectionButton.tsx`

````tsx
import { Button, ButtonProps, HStack, Icon, Text } from '@chakra-ui/react';
import { ReactElement } from 'react';
import { IconType } from 'react-icons';

interface ConnectionButtonProps {
    isDark: boolean;
    onClick: () => void;
    text?: string;
    icon?: IconType;
    customIcon?: ReactElement;
    rightIcon?: ReactElement;
    style?: ButtonProps;
    variant?: string;
    iconWidth?: string;
}

/**
 * Login provider button — uses the three-slot layout from the design spec:
 *   [ 24px icon ] [ label flex=1 ] [ optional trailing slot ]
 *
 * - Height ~52px, padding 14px 18px, gap 14px
 * - Icon-only mode (no `text`) keeps the legacy compact layout
 */
export const ConnectionButton = ({
    onClick,
    text,
    icon,
    customIcon,
    rightIcon,
    style,
    variant = 'loginIn',
    iconWidth = '24px',
}: ConnectionButtonProps) => {
    if (!text) {
        return (
            <Button {...style} variant={variant} w={'full'} onClick={onClick}>
                {customIcon ? (
                    customIcon
                ) : (
                    <Icon as={icon} w={'20px'} h={'20px'} />
                )}
            </Button>
        );
    }

    return (
        <Button
            {...style}
            variant={variant}
            w={'full'}
            h={'52px'}
            px={'18px'}
            py={'14px'}
            onClick={onClick}
            _active={{ transform: 'scale(0.99)' }}
        >
            <HStack
                w={'full'}
                spacing={'14px'}
                justify={'flex-start'}
                align={'center'}
            >
                {customIcon ? (
                    customIcon
                ) : (
                    <Icon as={icon} w={iconWidth} h={iconWidth} flexShrink={0} />
                )}
                <Text
                    flex={1}
                    textAlign={'left'}
                    fontSize={'15px'}
                    fontWeight={600}
                    letterSpacing={'-0.005em'}
                    noOfLines={1}
                >
                    {text}
                </Text>
                {rightIcon}
            </HStack>
        </Button>
    );
};
````

## Source: `packages/vechain-kit/src/components/ConnectModal/Components/ConnectionOptionsStack.tsx`

````tsx
import {
    Button,
    Grid,
    GridItem,
    Icon,
    Stack,
} from '@chakra-ui/react';
import { LuChevronDown } from 'react-icons/lu';
import { EmailLoginButton } from './EmailLoginButton';
import { LoginWithGoogleButton } from './LoginWithGoogleButton';
import { LoginWithAppleButton } from './LoginWithAppleButton';
import { LoginWithGithubButton } from './LoginWithGithubButton';
import { VeChainWithPrivyLoginButton } from './VeChainWithPrivyLoginButton';
import { VeChainLoginButton } from './VeChainLoginButton';
import { PasskeyLoginButton } from './PasskeyLoginButton';
import { DappKitButton } from './DappKitButton';
import { VeWorldButton } from './VeWorldButton';
import { Sync2Button } from './Sync2Button';
import { WalletConnectButton } from './WalletConnectButton';
import { useLoginModalContent } from '@/hooks';
import { useVeChainKitConfig } from '@/providers';
import { ConnectModalContentsTypes } from '../ConnectModal';
import React from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<ConnectModalContentsTypes>
    >;
};


export const ConnectionOptionsStack = ({ setCurrentContent }: Props) => {
    const { t } = useTranslation();
    const { loginMethods, darkMode: isDark } = useVeChainKitConfig();

    const {
        showGoogleLogin,
        showAppleLogin,
        showEmailLogin,
        showPasskey,
        showVeChainLogin,
        showDappKit,
        showVeWorld,
        showSync2,
        showWalletConnect,
        showMoreLogin,
        showGithubLogin,
        isOfficialVeChainApp,
    } = useLoginModalContent();

    // Determine which method renders as the recommended primary CTA
    // (filled-inverted surface + RecommendedDot). Two sources, in order:
    //   1. Explicit: any entry with `isPrimary: true` (excluding `more`,
    //      which is a footer link, not a button).
    //   2. Implicit fallback: the first visible method in the array, so an
    //      opt-out dev who doesn't think about emphasis still gets a
    //      sensible default.
    const isMethodVisible = (method: string): boolean => {
        switch (method) {
            case 'email':
                return showEmailLogin;
            case 'google':
                return showGoogleLogin;
            case 'apple':
                return showAppleLogin;
            case 'github':
                return showGithubLogin;
            case 'passkey':
                return showPasskey;
            case 'vechain':
                return showVeChainLogin;
            case 'dappkit':
                return showDappKit;
            case 'veworld':
                return showVeWorld;
            case 'sync2':
                return showSync2;
            case 'wallet-connect':
                return showWalletConnect;
            default:
                return false;
        }
    };
    const explicitPrimary = loginMethods?.find(
        (m) => m.isPrimary && m.method !== 'more' && isMethodVisible(m.method),
    )?.method;
    const implicitPrimary = loginMethods?.find(({ method }) =>
        isMethodVisible(method),
    )?.method;
    const primaryMethod = explicitPrimary ?? implicitPrimary;

    const renderMethod = (
        method: string,
        gridColumn: number | undefined,
    ): React.ReactNode => {
        const isPrimary = method === primaryMethod;
        switch (method) {
            case 'email':
                return showEmailLogin && <EmailLoginButton key="email" />;
            case 'google':
                return (
                    showGoogleLogin && (
                        <LoginWithGoogleButton
                            key="google"
                            isDark={isDark}
                            gridColumn={gridColumn}
                            isPrimary={isPrimary}
                        />
                    )
                );
            case 'apple':
                return (
                    showAppleLogin && (
                        <LoginWithAppleButton
                            key="apple"
                            isDark={isDark}
                            gridColumn={gridColumn}
                            isPrimary={isPrimary}
                        />
                    )
                );
            case 'github':
                return (
                    showGithubLogin && (
                        <LoginWithGithubButton
                            key="github"
                            isDark={isDark}
                            gridColumn={gridColumn}
                            isPrimary={isPrimary}
                        />
                    )
                );
            case 'vechain':
                return (
                    showVeChainLogin &&
                    (isOfficialVeChainApp ? (
                        <VeChainWithPrivyLoginButton
                            key="vechain"
                            isDark={isDark}
                            gridColumn={gridColumn}
                        />
                    ) : (
                        <VeChainLoginButton
                            key="vechain"
                            isDark={isDark}
                            gridColumn={gridColumn}
                            setCurrentContent={setCurrentContent}
                        />
                    ))
                );
            case 'passkey':
                return (
                    showPasskey && (
                        <PasskeyLoginButton
                            key="passkey"
                            isDark={isDark}
                            gridColumn={gridColumn}
                            setCurrentContent={setCurrentContent}
                        />
                    )
                );
            case 'dappkit':
                return (
                    showDappKit && (
                        <DappKitButton
                            key="dappkit"
                            isDark={isDark}
                            gridColumn={gridColumn}
                        />
                    )
                );
            case 'veworld':
                return (
                    showVeWorld && (
                        <VeWorldButton
                            key="veworld"
                            isDark={isDark}
                            gridColumn={gridColumn ?? 4}
                            setCurrentContent={setCurrentContent}
                            isPrimary={isPrimary}
                        />
                    )
                );
            case 'sync2':
                return (
                    showSync2 && (
                        <Sync2Button
                            key="sync2"
                            isDark={isDark}
                            gridColumn={gridColumn ?? 4}
                            setCurrentContent={setCurrentContent}
                        />
                    )
                );
            case 'wallet-connect':
                return (
                    showWalletConnect && (
                        <WalletConnectButton
                            key="wallet-connect"
                            isDark={isDark}
                            gridColumn={gridColumn ?? 4}
                            setCurrentContent={setCurrentContent}
                        />
                    )
                );
            case 'more':
                return (
                    showMoreLogin && (
                        <GridItem
                            key="more"
                            colSpan={gridColumn ?? 4}
                            w={'full'}
                            display={'flex'}
                            justifyContent={'center'}
                            pt={3}
                        >
                            <Button
                                variant={'link'}
                                size={'sm'}
                                fontWeight={500}
                                rightIcon={
                                    <Icon as={LuChevronDown} ml={'-1'} />
                                }
                                onClick={() =>
                                    setCurrentContent({
                                        type: 'more',
                                        props: {},
                                    })
                                }
                            >
                                {t('More options')}
                            </Button>
                        </GridItem>
                    )
                );
            default:
                return null;
        }
    };

    return (
        <Stack spacing={4} w={'full'} align={'center'}>
            <Grid templateColumns="repeat(4, 1fr)" gap={2} w={'full'}>
                {loginMethods?.map(({ method, gridColumn }) =>
                    renderMethod(method, gridColumn),
                )}
            </Grid>
        </Stack>
    );
};
````

## Source: `packages/vechain-kit/src/components/ConnectModal/Components/DappKitButton.tsx`

````tsx
import { GridItem, Icon } from '@chakra-ui/react';
import { useDAppKitWalletModal } from '@/hooks';
import { ConnectionButton } from '@/components';
import { useTranslation } from 'react-i18next';
import { LuArrowRight, LuWallet } from 'react-icons/lu';
import { useEffect } from 'react';
import { useWallet as useDappKitWallet } from '@vechain/dapp-kit-react';
import { VeWorldLogoDark, VeWorldLogoLight } from '@/assets';
import { IconType } from 'react-icons';
import { useVeChainKitConfig } from '@/providers';

type Props = {
    isDark: boolean;
    gridColumn?: number;
};

export const DappKitButton = ({ isDark, gridColumn = 2 }: Props) => {
    const { t } = useTranslation();
    const { open: openDappKitModal, onConnectionStatusChange } =
        useDAppKitWalletModal();
    const { dappKit } = useVeChainKitConfig();
    const { source } = useDappKitWallet();

    // Determine the button text based on the source
    const buttonText = !dappKit?.allowedWallets?.includes('sync2')
        ? t('Connect with VeWorld wallet')
        : t('Connect wallet');

    useEffect(() => {
        const handleConnectionChange = (
            address: string | null,
            error?: Error,
        ) => {
            if (!address) {
                if (error?.message) {
                    console.error(error?.message);
                }
                return { ...(source && { source }) };
            }
            // Wallet activation is now handled in useWallet.ts
            // When a wallet connects, it will automatically be set as active
        };
        onConnectionStatusChange(handleConnectionChange);
    }, [onConnectionStatusChange, source]);
    const handleDappKitClick = () => {
        openDappKitModal();
    };

    return (
        <GridItem colSpan={gridColumn ? gridColumn : 2} w={'full'}>
            <ConnectionButton
                isDark={isDark}
                onClick={handleDappKitClick}
                icon={
                    !dappKit?.allowedWallets?.includes('sync2')
                        ? ((isDark
                              ? VeWorldLogoLight
                              : VeWorldLogoDark) as IconType)
                        : (LuWallet as IconType)
                }
                iconWidth={'27px'}
                text={gridColumn >= 2 ? buttonText : undefined}
                rightIcon={
                    (dappKit?.allowedWallets?.includes('sync2') && (
                        <Icon as={LuArrowRight} />
                    )) ||
                    undefined
                }
            />
        </GridItem>
    );
};
````

## Source: `packages/vechain-kit/src/components/ConnectModal/Components/EcosystemButton.tsx`

````tsx
import { Button } from '@chakra-ui/react';
import { ConnectModalContentsTypes } from '@/components';
import { useTranslation } from 'react-i18next';
import { PrivyAppInfo } from '@/types';

type Props = {
    isDark: boolean;
    appsInfo: PrivyAppInfo[];
    isLoading: boolean;
    gridColumn?: number;
    setCurrentContent: React.Dispatch<
        React.SetStateAction<ConnectModalContentsTypes>
    >;
};

export const EcosystemButton = ({
    appsInfo,
    isLoading,
    setCurrentContent,
}: Props) => {
    const { t } = useTranslation();

    return (
        <Button
            fontSize={'sm'}
            variant="link"
            onClick={() =>
                setCurrentContent({
                    type: 'ecosystem',
                    props: { appsInfo, isLoading },
                })
            }
        >
            {t('Already have an x2earn app wallet?')}
        </Button>
    );
};
````

## Source: `packages/vechain-kit/src/components/ConnectModal/Components/EmailLoginButton.tsx`

````tsx
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

/**
 * Inline email input + OTP modal flow. Requires a host-supplied privy
 * prop because VeChain's own Privy app has email disabled, so the
 * whitelabel cross-app host can't accept email-based logins. When
 * the consumer dApp has no privy, useLoginModalContent hides this
 * button entirely.
 */
export const EmailLoginButton = () => {
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
````

## Source: `packages/vechain-kit/src/components/ConnectModal/Components/LoginWithAppleButton.tsx`

````tsx
import { GridItem, Icon, useToken } from '@chakra-ui/react';
import { FaApple } from 'react-icons/fa';
import { ConnectionButton } from '@/components';
import { useTranslation } from 'react-i18next';
import { useLoginWithOAuth } from '@/hooks';
import { RecommendedDot } from './RecommendedDot';
import { primaryButtonStyle } from './primaryButtonStyle';

type Props = {
    isDark: boolean;
    gridColumn?: number;
    /** When true, render as the recommended primary CTA. See VeWorldButton. */
    isPrimary?: boolean;
};

/** Secondary outline by default; recommended primary when `isPrimary`. The
 *  Apple glyph flips to match the surface (text color on outline, inverted
 *  on the filled primary). */
export const LoginWithAppleButton = ({
    isDark,
    gridColumn,
    isPrimary = false,
}: Props) => {
    const { t } = useTranslation();
    const { initOAuth } = useLoginWithOAuth();

    const [stroke, strokeStrong, hoverBg, textPrimary] = useToken('colors', [
        'vechain-kit-border-button',
        'vechain-kit-border-hover',
        'vechain-kit-button-secondary-bg',
        'vechain-kit-text-primary',
    ]);

    const style = isPrimary
        ? primaryButtonStyle(isDark)
        : {
              bg: 'transparent',
              border: `1px solid ${stroke}`,
              _hover: {
                  bg: hoverBg,
                  borderColor: strokeStrong,
                  opacity: 1,
              },
          };

    // On a filled primary surface, the surface is inverted vs. the modal —
    // so the Apple glyph needs the opposite contrast of the outline case.
    const glyphColor = isPrimary
        ? isDark
            ? '#0E0D18'
            : '#ffffff'
        : textPrimary;

    return (
        <GridItem colSpan={gridColumn ?? 4} w={'full'}>
            <ConnectionButton
                isDark={isDark}
                onClick={async () => {
                    await initOAuth({ provider: 'apple' });
                }}
                customIcon={
                    <Icon
                        as={FaApple}
                        w={'24px'}
                        h={'24px'}
                        color={glyphColor}
                    />
                }
                text={t('Continue with Apple')}
                rightIcon={isPrimary ? <RecommendedDot /> : undefined}
                style={style}
            />
        </GridItem>
    );
};
````

## Source: `packages/vechain-kit/src/components/ConnectModal/Components/LoginWithGithubButton.tsx`

````tsx
import { GridItem } from '@chakra-ui/react';
import { LuGithub } from 'react-icons/lu';
import { ConnectionButton } from '@/components';
import { useTranslation } from 'react-i18next';
import { useLoginWithOAuth } from '@/hooks';
import { RecommendedDot } from './RecommendedDot';
import { primaryButtonStyle } from './primaryButtonStyle';

type Props = {
    isDark: boolean;
    gridColumn?: number;
    /** When true, render as the recommended primary CTA. See VeWorldButton. */
    isPrimary?: boolean;
};

export const LoginWithGithubButton = ({
    isDark,
    gridColumn,
    isPrimary = false,
}: Props) => {
    const { t } = useTranslation();
    const { initOAuth } = useLoginWithOAuth();

    return (
        <GridItem colSpan={gridColumn ?? 4} w={'full'}>
            <ConnectionButton
                isDark={isDark}
                onClick={async () => {
                    await initOAuth({
                        provider: 'github',
                    });
                }}
                icon={LuGithub}
                text={t('Continue with Github')}
                rightIcon={isPrimary ? <RecommendedDot /> : undefined}
                style={isPrimary ? primaryButtonStyle(isDark) : undefined}
            />
        </GridItem>
    );
};
````

## Source: `packages/vechain-kit/src/components/ConnectModal/Components/LoginWithGoogleButton.tsx`

````tsx
import { GridItem, useToken } from '@chakra-ui/react';
import { FcGoogle } from 'react-icons/fc';
import { ConnectionButton } from '@/components';
import { useTranslation } from 'react-i18next';
import { useLoginWithOAuth } from '@/hooks';
import { RecommendedDot } from './RecommendedDot';
import { primaryButtonStyle } from './primaryButtonStyle';

type Props = {
    isDark: boolean;
    gridColumn?: number;
    /** When true, render as the recommended primary CTA. See VeWorldButton. */
    isPrimary?: boolean;
};

/** Secondary outline button by default; recommended primary when `isPrimary`. */
export const LoginWithGoogleButton = ({
    isDark,
    gridColumn,
    isPrimary = false,
}: Props) => {
    const { t } = useTranslation();
    const { initOAuth } = useLoginWithOAuth();

    const [stroke, strokeStrong, hoverBg] = useToken('colors', [
        'vechain-kit-border-button',
        'vechain-kit-border-hover',
        'vechain-kit-button-secondary-bg',
    ]);

    const style = isPrimary
        ? primaryButtonStyle(isDark)
        : {
              bg: 'transparent',
              border: `1px solid ${stroke}`,
              _hover: {
                  bg: hoverBg,
                  borderColor: strokeStrong,
                  opacity: 1,
              },
          };

    return (
        <GridItem colSpan={gridColumn ?? 4} w={'full'}>
            <ConnectionButton
                isDark={isDark}
                onClick={async () => {
                    await initOAuth({ provider: 'google' });
                }}
                icon={FcGoogle}
                iconWidth={'24px'}
                text={t('Continue with Google')}
                rightIcon={isPrimary ? <RecommendedDot /> : undefined}
                style={style}
            />
        </GridItem>
    );
};
````

## Source: `packages/vechain-kit/src/components/ConnectModal/Components/PasskeyLoginButton.tsx`

````tsx
import { GridItem } from '@chakra-ui/react';
import { LuFingerprint } from 'react-icons/lu';
import { ConnectionButton } from '@/components';
import { useTranslation } from 'react-i18next';
import { useLoginWithPasskey } from '@/hooks';
import { ConnectModalContentsTypes } from '../ConnectModal';
import React from 'react';

type Props = {
    isDark: boolean;
    gridColumn?: number;
    setCurrentContent: React.Dispatch<
        React.SetStateAction<ConnectModalContentsTypes>
    >;
};

export const PasskeyLoginButton = ({
    isDark,
    gridColumn,
    setCurrentContent,
}: Props) => {
    const { t } = useTranslation();
    const { loginWithPasskey } = useLoginWithPasskey();

    const handleLoginWithPasskey = async () => {
        setCurrentContent({
            type: 'loading',
            props: {
                title: t('Connecting with Passkey'),
                loadingText: t('Please complete the passkey authentication...'),
                onTryAgain: handleLoginWithPasskey,
            },
        });
        try {
            await loginWithPasskey();
        } catch (error) {
            const errorMsg =
                error instanceof Error ? error.message.toLowerCase() : '';

            // Log specific error types for debugging
            if (errorMsg.includes('not found')) {
                console.error(error);
            }

            setCurrentContent({
                type: 'error',
                props: {
                    error:
                        error instanceof Error
                            ? error.message
                            : t('Failed to connect with Passkey'),
                    onTryAgain: handleLoginWithPasskey,
                },
            });
        }
    };

    return (
        <GridItem colSpan={gridColumn} w={'full'}>
            <ConnectionButton
                isDark={isDark}
                onClick={handleLoginWithPasskey}
                icon={LuFingerprint}
                text={gridColumn && gridColumn >= 2 ? t('Passkey') : undefined}
            />
        </GridItem>
    );
};
````

## Source: `packages/vechain-kit/src/components/ConnectModal/Components/PrivyButton.tsx`

````tsx
import { GridItem, Icon } from '@chakra-ui/react';
import { LuEllipsis, LuArrowRight } from 'react-icons/lu';
import { ConnectionButton } from '@/components';
import { useTranslation } from 'react-i18next';

type Props = {
    isDark: boolean;
    onViewMoreLogin: () => void;
    gridColumn?: number;
};

export const PrivyButton = ({ isDark, onViewMoreLogin, gridColumn }: Props) => {
    const { t } = useTranslation();
    return (
        <GridItem colSpan={gridColumn} w={'full'}>
            <ConnectionButton
                isDark={isDark}
                onClick={onViewMoreLogin}
                icon={LuEllipsis}
                text={gridColumn && gridColumn >= 2 ? t('More') : undefined}
                rightIcon={<Icon as={LuArrowRight} />}
            />
        </GridItem>
    );
};
````

## Source: `packages/vechain-kit/src/components/ConnectModal/Components/RecommendedDot.tsx`

````tsx
import { Box } from '@chakra-ui/react';

// Brand green from the design system. Reserved for the recommended-provider
// indicator only — do not reuse for other status surfaces.
const DOT_COLOR = '#16a34a';

/**
 * 6px green dot with a 3px halo (18% alpha). Lives in the trailing slot of
 * the primary VeWorld button.
 */
export const RecommendedDot = () => (
    <Box
        w={'6px'}
        h={'6px'}
        borderRadius={'full'}
        bg={DOT_COLOR}
        boxShadow={`0 0 0 3px ${DOT_COLOR}2e`}
        mr={'3px'}
        flexShrink={0}
        aria-hidden
    />
);
````

## Source: `packages/vechain-kit/src/components/ConnectModal/Components/Sync2Button.tsx`

````tsx
import { GridItem } from '@chakra-ui/react';
import { LuWallet } from 'react-icons/lu';
import { useTranslation } from 'react-i18next';
import React from 'react';
import { ConnectionButton } from '@/components';
import { useConnectWithDappKitSource } from '@/hooks';
import { ConnectModalContentsTypes } from '../ConnectModal';

type Props = {
    isDark: boolean;
    gridColumn?: number;
    setCurrentContent: React.Dispatch<
        React.SetStateAction<ConnectModalContentsTypes>
    >;
};

export const Sync2Button = ({
    isDark,
    gridColumn = 4,
    setCurrentContent,
}: Props) => {
    const { t } = useTranslation();
    const { connect } = useConnectWithDappKitSource('sync2', setCurrentContent);

    return (
        <GridItem colSpan={gridColumn} w={'full'}>
            <ConnectionButton
                isDark={isDark}
                onClick={connect}
                icon={LuWallet}
                text={gridColumn >= 2 ? t('Continue with Sync2') : undefined}
            />
        </GridItem>
    );
};
````

## Source: `packages/vechain-kit/src/components/ConnectModal/Components/VeChainLoginButton.tsx`

````tsx
import { GridItem } from '@chakra-ui/react';
import { VechainLogoDark, VechainLogoLight } from '@/assets';
import { ConnectionButton, SocialIcons } from '@/components';
import { useLoginWithVeChain } from '@/hooks';
import { useTranslation } from 'react-i18next';
import { IconType } from 'react-icons';
import { ConnectModalContentsTypes } from '../ConnectModal';
import React from 'react';

type Props = {
    isDark: boolean;
    gridColumn?: number;
    setCurrentContent: React.Dispatch<
        React.SetStateAction<ConnectModalContentsTypes>
    >;
};

export const VeChainLoginButton = ({
    isDark,
    gridColumn,
    setCurrentContent,
}: Props) => {
    const { t } = useTranslation();
    const { login: loginWithVeChain } = useLoginWithVeChain();

    const handleLoginWithVeChain = async () => {
        setCurrentContent({
            type: 'loading',
            props: {
                title: t('Connecting to VeChain'),
                loadingText: t(
                    'Please approve the request in the connection request window...',
                ),
                onTryAgain: handleLoginWithVeChain,
            },
        });
        try {
            await loginWithVeChain();
        } catch (error) {
            console.error(t('Login failed:'), error);
            setCurrentContent({
                type: 'error',
                props: {
                    error:
                        error instanceof Error
                            ? error.message
                            : t('Failed to connect with VeChain'),
                    onTryAgain: handleLoginWithVeChain,
                },
            });
        }
    };

    return (
        <GridItem colSpan={gridColumn ? gridColumn : 4} w={'full'}>
            <ConnectionButton
                isDark={isDark}
                onClick={handleLoginWithVeChain}
                icon={
                    isDark
                        ? (VechainLogoLight as IconType)
                        : (VechainLogoDark as IconType)
                }
                text={t('Login with social')}
                variant={'loginWithVechain'}
                rightIcon={<SocialIcons />}
            />
        </GridItem>
    );
};
````

## Source: `packages/vechain-kit/src/components/ConnectModal/Components/VeChainWithPrivyLoginButton.tsx`

````tsx
import { GridItem } from '@chakra-ui/react';
import { VechainLogoDark, VechainLogoLight } from '@/assets';
import { ConnectionButton, SocialIcons } from '@/components';
import { usePrivy } from '@/hooks';
import { useTranslation } from 'react-i18next';
import { IconType } from 'react-icons';

type Props = {
    isDark: boolean;
    gridColumn?: number;
};

/// This button is used to login with VeChain using Privy on
/// platforms like VeBetterDAO and VeChain Kit Homepage.
/// It is a very specific scenario.
export const VeChainWithPrivyLoginButton = ({ isDark, gridColumn }: Props) => {
    const { t } = useTranslation();
    const { login: viewMoreLogin } = usePrivy();

    return (
        <GridItem colSpan={gridColumn ? gridColumn : 4} w={'full'}>
            <ConnectionButton
                isDark={isDark}
                onClick={viewMoreLogin}
                icon={
                    isDark
                        ? (VechainLogoLight as IconType)
                        : (VechainLogoDark as IconType)
                }
                text={t('Login with social')}
                variant={'loginWithVechain'}
                rightIcon={<SocialIcons />}
            />
        </GridItem>
    );
};
````

## Source: `packages/vechain-kit/src/components/ConnectModal/Components/VeWorldButton.tsx`

````tsx
import { GridItem, useToken } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import React from 'react';
import { ConnectionButton } from '@/components';
import { useConnectWithDappKitSource } from '@/hooks';
import { VeWorldLogoDark, VeWorldLogoLight } from '@/assets';
import { ConnectModalContentsTypes } from '../ConnectModal';
import { RecommendedDot } from './RecommendedDot';
import { primaryButtonStyle } from './primaryButtonStyle';

type Props = {
    isDark: boolean;
    gridColumn?: number;
    setCurrentContent: React.Dispatch<
        React.SetStateAction<ConnectModalContentsTypes>
    >;
    /**
     * When true, render as the recommended primary CTA: filled inverted
     * surface + RecommendedDot. When false, render as an outline secondary.
     * The stack flips this on the first visible login method, so VeWorld
     * is primary only when it's first in `loginMethods`.
     */
    isPrimary?: boolean;
};

export const VeWorldButton = ({
    isDark,
    gridColumn = 4,
    setCurrentContent,
    isPrimary = false,
}: Props) => {
    const { t } = useTranslation();
    const { connect } = useConnectWithDappKitSource('veworld', setCurrentContent);

    const [stroke, strokeStrong, hoverBg] = useToken('colors', [
        'vechain-kit-border-button',
        'vechain-kit-border-hover',
        'vechain-kit-button-secondary-bg',
    ]);

    // Logo always reads against the surface beneath it: primary uses the
    // inverted-bg variant; outline uses the same-as-text variant.
    const Logo = isPrimary
        ? isDark
            ? VeWorldLogoDark
            : VeWorldLogoLight
        : isDark
        ? VeWorldLogoLight
        : VeWorldLogoDark;

    const style = isPrimary
        ? primaryButtonStyle(isDark)
        : {
              bg: 'transparent',
              border: `1px solid ${stroke}`,
              _hover: {
                  bg: hoverBg,
                  borderColor: strokeStrong,
                  opacity: 1,
              },
          };

    return (
        <GridItem colSpan={gridColumn} w={'full'}>
            <ConnectionButton
                isDark={isDark}
                onClick={connect}
                customIcon={<Logo w={'24px'} h={'24px'} />}
                text={
                    gridColumn >= 2 ? t('Continue with VeWorld') : undefined
                }
                rightIcon={isPrimary ? <RecommendedDot /> : undefined}
                style={style}
            />
        </GridItem>
    );
};
````

## Source: `packages/vechain-kit/src/components/ConnectModal/Components/WalletConnectButton.tsx`

````tsx
import { GridItem } from '@chakra-ui/react';
import { LuQrCode } from 'react-icons/lu';
import { useTranslation } from 'react-i18next';
import React from 'react';
import { ConnectionButton } from '@/components';
import { useConnectWithDappKitSource } from '@/hooks';
import { ConnectModalContentsTypes } from '../ConnectModal';

type Props = {
    isDark: boolean;
    gridColumn?: number;
    setCurrentContent: React.Dispatch<
        React.SetStateAction<ConnectModalContentsTypes>
    >;
};

export const WalletConnectButton = ({
    isDark,
    gridColumn = 4,
    setCurrentContent,
}: Props) => {
    const { t } = useTranslation();
    const { connect } = useConnectWithDappKitSource(
        'wallet-connect',
        setCurrentContent,
    );

    return (
        <GridItem colSpan={gridColumn} w={'full'}>
            <ConnectionButton
                isDark={isDark}
                onClick={connect}
                icon={LuQrCode}
                text={
                    gridColumn >= 2
                        ? t('Continue with WalletConnect')
                        : undefined
                }
            />
        </GridItem>
    );
};
````

## Source: `packages/vechain-kit/src/components/ConnectModal/Components/primaryButtonStyle.ts`

````typescript
import type { ButtonProps } from '@chakra-ui/react';

/**
 * The "recommended provider" style — filled with inverted contrast against
 * the modal surface (dark on light mode, white on dark mode). Originally
 * baked into `VeWorldButton`, now shared so it can move to whichever method
 * is first in `loginMethods` (the kit treats the first entry as the primary
 * CTA, regardless of which provider it is).
 *
 * Intentionally does NOT consume `theme.buttons.primaryButton.{bg,color}`
 * — devs who themed their primary button (e.g. brand blue) shouldn't end
 * up with a blue Google or Apple button. The brand glyph + label have to
 * stay recognisable.
 */
export const primaryButtonStyle = (isDark: boolean): ButtonProps => {
    const bg = isDark ? '#ffffff' : '#0E0D18';
    const color = isDark ? '#0E0D18' : '#ffffff';
    return {
        bg,
        color,
        border: 'none',
        _hover: { bg, opacity: 0.92 },
    };
};
````

## Source: `packages/vechain-kit/src/components/ConnectModal/ConnectModal.tsx`

````tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Box } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { MainContent } from './Contents/MainContent';
import { BaseModal } from '@/components/common';
import { FAQContent } from '../AccountModal';
import {
    EcosystemContent,
    LoadingContent,
    ErrorContent,
    MoreOptionsContent,
} from './Contents';
import { PrivyAppInfo } from '@/types';
import { useWallet } from '@/hooks';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    initialContent?: ConnectModalContentsTypes;
    preventAutoClose?: boolean;
};

export type ConnectModalContentsTypes =
    | 'main'
    | 'faq'
    | {
          type: 'ecosystem';
          props: {
              appsInfo: PrivyAppInfo[];
              isLoading: boolean;
              showBackButton?: boolean;
          };
      }
    | {
          type: 'loading';
          props: {
              title?: string;
              loadingText?: string;
              onTryAgain?: () => void;
              showBackButton?: boolean;
          };
      }
    | {
          type: 'error';
          props: {
              error: string;
              onTryAgain: () => void;
          };
      }
    | {
          type: 'more';
          props: {
              showBackButton?: boolean;
          };
      };

// Stable key derived from a content value, used to retrigger the cross-fade
// animation when the user transitions between views.
const contentKey = (c: ConnectModalContentsTypes | undefined): string => {
    if (!c) return 'main';
    if (typeof c === 'string') return c;
    return c.type;
};

const fadeIn = keyframes`
    from { opacity: 0; transform: translateY(4px); }
    to   { opacity: 1; transform: translateY(0); }
`;

export const ConnectModal = ({
    isOpen,
    onClose,
    initialContent = 'main',
    preventAutoClose = false,
}: Props) => {
    const { connection } = useWallet();
    const [currentContent, setCurrentContent] =
        useState<ConnectModalContentsTypes>(initialContent);

    useEffect(() => {
        if (isOpen) {
            setCurrentContent(initialContent);
        }
    }, [isOpen, initialContent, setCurrentContent]);

    useEffect(() => {
        if (connection.isConnected && isOpen && !preventAutoClose) {
            onClose();
        }
    }, [connection.isConnected, isOpen, onClose, preventAutoClose]);

    const renderContent = () => {
        if (!currentContent) {
            return <MainContent setCurrentContent={setCurrentContent} />;
        }

        switch (currentContent) {
            case 'main':
                return <MainContent setCurrentContent={setCurrentContent} />;
            case 'faq':
                return (
                    <FAQContent onGoBack={() => setCurrentContent('main')} />
                );
        }

        if (typeof currentContent === 'object' && 'type' in currentContent) {
            switch (currentContent.type) {
                case 'ecosystem':
                    return (
                        <EcosystemContent
                            onClose={onClose}
                            appsInfo={currentContent.props.appsInfo}
                            isLoading={currentContent.props.isLoading}
                            setCurrentContent={setCurrentContent}
                            showBackButton={currentContent.props.showBackButton}
                        />
                    );
                case 'loading':
                    return (
                        <LoadingContent
                            title={currentContent.props.title}
                            loadingText={currentContent.props.loadingText}
                            onTryAgain={currentContent.props.onTryAgain}
                            onClose={onClose}
                            onGoBack={() => setCurrentContent('main')}
                            showBackButton={
                                currentContent.props.showBackButton
                            }
                        />
                    );
                case 'error':
                    return (
                        <ErrorContent
                            error={currentContent.props.error}
                            onClose={onClose}
                            onTryAgain={currentContent.props.onTryAgain}
                            onGoBack={() => setCurrentContent('main')}
                        />
                    );
                case 'more':
                    return (
                        <MoreOptionsContent
                            onClose={onClose}
                            setCurrentContent={setCurrentContent}
                            showBackButton={
                                currentContent.props.showBackButton
                            }
                        />
                    );
            }
        }

        return null;
    };

    const rendered = renderContent();
    const key = useMemo(() => contentKey(currentContent), [currentContent]);

    const content = rendered ?? (
        <MainContent setCurrentContent={setCurrentContent} />
    );

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            allowExternalFocus={true}
            blockScrollOnMount={true}
            mobileMinHeight={'260px'}
            mobileMaxHeight={'520px'}
            desktopMinHeight={'250px'}
            desktopMaxHeight={'520px'}
        >
            {/* 250ms fade + 4px translate cross-fade between views.
                `key` retriggers the animation on each transition. */}
            <Box
                key={key}
                animation={`${fadeIn} 250ms cubic-bezier(0.4, 0, 0.2, 1)`}
            >
                {content}
            </Box>
        </BaseModal>
    );
};
````

## Source: `packages/vechain-kit/src/components/ConnectModal/ConnectPopover.tsx`

````tsx
import {
    Button,
    ButtonProps,
    HStack,
    Icon,
    Popover,
    PopoverBody,
    PopoverContent,
    PopoverFooter,
    PopoverTrigger,
} from '@chakra-ui/react';
import { ConnectionOptionsStack } from './Components/ConnectionOptionsStack';
import { useTranslation } from 'react-i18next';
import { LuChevronDown } from 'react-icons/lu';
import { EcosystemButton } from './Components';
import { useVeChainKitConfig } from '@/providers';
import { useFetchAppInfo, useConnectModal } from '@/hooks';
import { ConnectModalContentsTypes } from './ConnectModal';
import { useCallback } from 'react';
import { SetStateAction } from 'react';

type ConnectPopoverProps = {
    isLoading: boolean;
    buttonStyle?: ButtonProps;
};

export const ConnectPopover = ({
    isLoading,
    buttonStyle,
}: ConnectPopoverProps) => {
    const { t } = useTranslation();
    const {
        loginMethods,
        darkMode: isDark,
        privyEcosystemAppIDS,
    } = useVeChainKitConfig();
    const showEcosystemButton = loginMethods?.some(
        ({ method }) => method === 'ecosystem',
    );
    const { open: openConnectModal } = useConnectModal();

    const { data: appsInfo, isLoading: isEcosystemAppsLoading } =
        useFetchAppInfo(privyEcosystemAppIDS);

    // Function to handle content changes from popover - opens ConnectModal
    // When opened from popover, we don't show back button
    const handleSetContent = useCallback(
        (
            content:
                | ConnectModalContentsTypes
                | SetStateAction<ConnectModalContentsTypes>,
        ) => {
            // Handle function form of SetStateAction
            const resolvedContent =
                typeof content === 'function'
                    ? content('main') // Use 'main' as previous state (won't be used anyway)
                    : content;

            // If content is ecosystem or loading, set showBackButton to false
            if (
                typeof resolvedContent === 'object' &&
                'type' in resolvedContent
            ) {
                if (resolvedContent.type === 'ecosystem') {
                    openConnectModal({
                        type: 'ecosystem',
                        props: {
                            ...resolvedContent.props,
                            showBackButton: false,
                        },
                    });
                } else if (resolvedContent.type === 'loading') {
                    openConnectModal({
                        type: 'loading',
                        props: {
                            ...resolvedContent.props,
                            showBackButton: false,
                        },
                    });
                } else {
                    // Error type or other - don't modify props
                    openConnectModal(resolvedContent);
                }
            } else {
                // String type (main, faq, etc.)
                openConnectModal(resolvedContent);
            }
        },
        [openConnectModal],
    );

    return (
        <Popover
            placement="bottom-start"
            size={'xl'}
            closeOnBlur={false}
            variant="vechainKitBase"
        >
            {({ isOpen }) => (
                <>
                    <PopoverTrigger>
                        <Button
                            isLoading={isLoading}
                            {...buttonStyle}
                            isActive={isOpen}
                        >
                            {t('Login')}
                            <Icon
                                ml={2}
                                as={LuChevronDown}
                                transform={
                                    isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                                }
                                transition="transform 0.2s"
                            />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                        <PopoverBody>
                            <ConnectionOptionsStack
                                setCurrentContent={handleSetContent}
                            />
                        </PopoverBody>
                        {/* Only render the footer when there's actually
                            something to show — an empty PopoverFooter adds
                            ~15px of dead space below the More-options link. */}
                        {showEcosystemButton && (
                            <PopoverFooter borderTop={'none'} pt={1} pb={3}>
                                <HStack justify={'center'} w={'full'}>
                                    <EcosystemButton
                                        isDark={isDark}
                                        appsInfo={Object.values(appsInfo || {})}
                                        isLoading={isEcosystemAppsLoading}
                                        setCurrentContent={handleSetContent}
                                    />
                                </HStack>
                            </PopoverFooter>
                        )}
                    </PopoverContent>
                </>
            )}
        </Popover>
    );
};
````

## Source: `packages/vechain-kit/src/components/ConnectModal/Contents/EcosystemContent.tsx`

````tsx
import {
    Box,
    Button,
    Image,
    ModalBody,
    ModalCloseButton,
    ModalFooter,
    ModalHeader,
    Spinner,
    Text,
    VStack,
    useToken,
} from '@chakra-ui/react';
import { ModalBackButton, StickyHeaderContainer } from '@/components/common';
import { useCrossAppConnectionCache } from '@/hooks';
import { usePrivyCrossAppSdk } from '@/providers/PrivyCrossAppProvider';
import { useTranslation } from 'react-i18next';
import { PrivyAppInfo } from '@/types';
import { isRejectionError } from '@/utils/stringUtils';
import { ConnectModalContentsTypes } from '../ConnectModal';
type Props = {
    onClose: () => void;
    appsInfo: PrivyAppInfo[];
    isLoading: boolean;
    setCurrentContent: React.Dispatch<
        React.SetStateAction<ConnectModalContentsTypes>
    >;
    showBackButton?: boolean;
};

export const EcosystemContent = ({
    onClose,
    appsInfo,
    isLoading,
    setCurrentContent,
    showBackButton = true,
}: Props) => {
    const { t } = useTranslation();

    // Use semantic token for text color (buttons use variants now)
    const textColor = useToken('colors', 'vechain-kit-text-primary');

    const { setConnectionCache } = useCrossAppConnectionCache();

    // Login with Vechain - Cross app account login
    const { login: loginWithCrossApp } = usePrivyCrossAppSdk();

    const connectWithVebetterDaoApps = async (
        appId: string,
        appName: string,
    ) => {
        setCurrentContent({
            type: 'loading',
            props: {
                title: `${t('Connecting with')} ${appName}`,
                loadingText: t(
                    'Please approve the request in the connection request window...',
                ),
                onTryAgain: () => {
                    connectWithVebetterDaoApps(appId, appName);
                },
            },
        });
        try {
            await loginWithCrossApp(appId);
            setConnectionCache({
                name: appName,
                logoUrl: appsInfo.find((app) => app.id === appId)?.logo_url,
                appId: appId,
                website: appsInfo.find((app) => app.id === appId)?.website,
            });
            onClose();
        } catch (error) {
            const errorMsg = (error as { message?: string })?.message;

            // Handle user rejection or other errors
            if (errorMsg && isRejectionError(errorMsg)) {
                setCurrentContent({
                    type: 'ecosystem',
                    props: { appsInfo, isLoading: false },
                });
                return;
            }

            // If it's an Error instance, return it, otherwise create new Error
            const errorToShow =
                error instanceof Error
                    ? error
                    : new Error(
                          'An unexpected issue occurred while logging in with this app. Please try again or contact support.',
                      );

            setCurrentContent({
                type: 'error',
                props: {
                    error: errorToShow.message,
                    onTryAgain: () => {
                        connectWithVebetterDaoApps(appId, appName);
                    },
                },
            });
        }
    };

    return (
        <Box>
            <>
                <StickyHeaderContainer>
                    <ModalHeader>
                        {showBackButton && (
                            <ModalBackButton
                                onClick={() => setCurrentContent('main')}
                            />
                        )}
                        {t('Already have an x2earn app wallet?')}
                        <ModalCloseButton onClick={onClose} />
                    </ModalHeader>
                </StickyHeaderContainer>

                <ModalBody>
                    {isLoading && (
                        <VStack
                            minH={'200px'}
                            w={'full'}
                            justifyContent={'center'}
                        >
                            <Spinner />
                        </VStack>
                    )}

                    {!isLoading && appsInfo && (
                        <VStack spacing={4} w={'full'} pb={6}>
                            {appsInfo.map((appInfo) => (
                                <Button
                                    key={appInfo.id}
                                    variant="loginIn"
                                    fontSize={'14px'}
                                    fontWeight={'400'}
                                    p={6}
                                    borderRadius={16}
                                    w={'full'}
                                    onClick={() => {
                                        connectWithVebetterDaoApps(
                                            appInfo.id,
                                            appInfo.name,
                                        );
                                    }}
                                    justifyContent={'flex-start'}
                                >
                                    <Image
                                        src={appInfo.logo_url}
                                        alt={appInfo.name}
                                        w={'30px'}
                                    />
                                    <Text ml={5}>{appInfo.name}</Text>
                                </Button>
                            ))}
                        </VStack>
                    )}

                    {!isLoading && !appsInfo && (
                        <Text textAlign={'center'} color={textColor}>
                            {t(
                                'No application from VeChain ecosystem is available to login.',
                            )}
                        </Text>
                    )}
                </ModalBody>
                <ModalFooter pt={0} />
            </>
        </Box>
    );
};
````

## Source: `packages/vechain-kit/src/components/ConnectModal/Contents/ErrorContent.tsx`

````tsx
import {
    Box,
    Button,
    HStack,
    Icon,
    ModalBody,
    ModalCloseButton,
    ModalFooter,
    ModalHeader,
    Text,
    VStack,
    useToken,
} from '@chakra-ui/react';
import { StickyHeaderContainer, ModalBackButton } from '@/components/common';
import { LuCircleAlert } from 'react-icons/lu';
import { useTranslation } from 'react-i18next';

type ErrorContentProps = {
    error: string;
    onClose: () => void;
    onTryAgain: () => void;
    onGoBack: () => void;
};

/**
 * Error view per spec:
 *  - 56×56 soft-red circle with an alert glyph
 *  - "Couldn't connect" headline at 18px Bold
 *  - Plain message body
 *  - Back (secondary) + Try again (primary) side-by-side
 */
export const ErrorContent = ({
    error,
    onClose,
    onTryAgain,
    onGoBack,
}: ErrorContentProps) => {
    const { t } = useTranslation();

    const [errorRed, errorBg] = useToken('colors', [
        'vechain-kit-error',
        'vechain-kit-error-bg',
    ]);

    return (
        <>
            <StickyHeaderContainer>
                <ModalHeader>
                    <ModalBackButton onClick={onGoBack} />
                    {t("Couldn't connect")}
                    <ModalCloseButton onClick={onClose} />
                </ModalHeader>
            </StickyHeaderContainer>

            <ModalBody>
                <VStack align={'center'} spacing={4} py={4}>
                    <Box
                        w={'56px'}
                        h={'56px'}
                        borderRadius={'full'}
                        bg={errorBg}
                        display={'flex'}
                        alignItems={'center'}
                        justifyContent={'center'}
                    >
                        <Icon
                            as={LuCircleAlert}
                            color={errorRed}
                            w={'28px'}
                            h={'28px'}
                        />
                    </Box>

                    <Text
                        fontSize={'18px'}
                        fontWeight={700}
                        textAlign={'center'}
                    >
                        {t("Couldn't connect")}
                    </Text>

                    <Text
                        fontSize={'sm'}
                        textAlign={'center'}
                        opacity={0.7}
                        px={2}
                    >
                        {error}
                    </Text>
                </VStack>
            </ModalBody>

            <ModalFooter>
                <HStack w={'full'} spacing={3}>
                    <Button
                        variant={'vechainKitSecondary'}
                        flex={1}
                        h={'52px'}
                        borderRadius={'16px'}
                        onClick={onGoBack}
                    >
                        {t('Back')}
                    </Button>
                    <Button
                        variant={'vechainKitPrimary'}
                        flex={1}
                        h={'52px'}
                        borderRadius={'16px'}
                        onClick={onTryAgain}
                    >
                        {t('Try again')}
                    </Button>
                </HStack>
            </ModalFooter>
        </>
    );
};
````

## Source: `packages/vechain-kit/src/components/ConnectModal/Contents/LoadingContent.tsx`

````tsx
import {
    Box,
    Button,
    ModalBody,
    ModalCloseButton,
    ModalFooter,
    ModalHeader,
    Text,
    VStack,
    useToken,
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { ModalBackButton, StickyHeaderContainer } from '@/components/common';
import React, { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

type LoadingContentProps = {
    loadingText?: string;
    title?: string;
    onTryAgain?: () => void;
    onClose: () => void;
    onGoBack: () => void;
    showBackButton?: boolean;
    /**
     * Icon to render inside the 64×64 spinner ring. Optional — when omitted
     * the ring shows on its own.
     */
    providerIcon?: ReactNode;
};

const spin = keyframes`
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
`;

/**
 * Centered 64×64 spinner ring (3px stroke, top arc coloured with --m-accent)
 * with the provider icon centered inside. Below the ring: an accent-colored
 * "Waiting for signature…" headline and the hint copy. A persistent Cancel
 * link at the bottom returns the user where they came from.
 */
export const LoadingContent = ({
    loadingText,
    title,
    // onTryAgain is part of the props shape but unused — Cancel only goes
    // back. Kept on the type so callers don't have to remove it from the
    // ConnectModalContentsTypes.loading.props discriminated union.
    onClose,
    onGoBack,
    showBackButton = true,
    providerIcon,
}: LoadingContentProps) => {
    const { t } = useTranslation();
    const [showTimeout, setShowTimeout] = React.useState(false);
    const [accent, ringTrack] = useToken('colors', [
        'vechain-kit-accent',
        'vechain-kit-border-button',
    ]);

    React.useEffect(() => {
        const timer = setTimeout(() => setShowTimeout(true), 7000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <StickyHeaderContainer>
                <ModalHeader>
                    {showBackButton && <ModalBackButton onClick={onGoBack} />}
                    {title ?? t('Connecting...')}
                    <ModalCloseButton onClick={onClose} />
                </ModalHeader>
            </StickyHeaderContainer>

            <ModalBody>
                <VStack
                    align={'center'}
                    spacing={4}
                    py={6}
                    role={'status'}
                    aria-live={'polite'}
                >
                    <Box position={'relative'} w={'64px'} h={'64px'}>
                        <Box
                            position={'absolute'}
                            inset={0}
                            borderRadius={'full'}
                            border={'3px solid'}
                            borderColor={ringTrack}
                        />
                        <Box
                            position={'absolute'}
                            inset={0}
                            borderRadius={'full'}
                            border={'3px solid transparent'}
                            borderTopColor={accent}
                            animation={`${spin} 0.8s linear infinite`}
                        />
                        {providerIcon && (
                            <Box
                                position={'absolute'}
                                inset={0}
                                display={'flex'}
                                alignItems={'center'}
                                justifyContent={'center'}
                            >
                                {providerIcon}
                            </Box>
                        )}
                    </Box>

                    <Text
                        fontSize={'14px'}
                        fontWeight={500}
                        color={accent}
                        textAlign={'center'}
                    >
                        {t('Waiting for signature...')}
                    </Text>

                    {loadingText && (
                        <Text
                            fontSize={'sm'}
                            textAlign={'center'}
                            opacity={0.7}
                        >
                            {loadingText}
                        </Text>
                    )}

                    {showTimeout && (
                        <Text
                            color={'orange.300'}
                            fontSize={'sm'}
                            textAlign={'center'}
                            pt={1}
                        >
                            {t('This is taking longer than expected.')}
                        </Text>
                    )}
                </VStack>
            </ModalBody>
            <ModalFooter justifyContent={'center'}>
                <Button
                    variant={'ghost'}
                    size={'sm'}
                    fontSize={'12px'}
                    fontWeight={500}
                    textTransform={'uppercase'}
                    letterSpacing={'0.08em'}
                    color={'vechain-kit-text-secondary'}
                    // Cancel returns to where the user came from. Falling back
                    // to onTryAgain would re-trigger the wallet prompt, which
                    // is the opposite of cancelling.
                    onClick={onGoBack}
                >
                    {t('Cancel')}
                </Button>
            </ModalFooter>
        </>
    );
};
````

## Source: `packages/vechain-kit/src/components/ConnectModal/Contents/MainContent.tsx`

````tsx
import {
    HStack,
    Image,
    ModalBody,
    ModalCloseButton,
    ModalFooter,
    ModalHeader,
    Text,
    useToken,
} from '@chakra-ui/react';
import { useVeChainKitConfig } from '@/providers';
import { ModalFAQButton, StickyHeaderContainer } from '@/components/common';
import { ConnectModalContentsTypes } from '../ConnectModal';
import React from 'react';
import { useFetchAppInfo } from '@/hooks';
import { useTranslation } from 'react-i18next';
import { ConnectionOptionsStack } from '../Components/ConnectionOptionsStack';
import { EcosystemButton } from '../Components/EcosystemButton';

type Props = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<ConnectModalContentsTypes>
    >;
};

export const MainContent = ({ setCurrentContent }: Props) => {
    const { t } = useTranslation();

    const { loginModalUI, darkMode: isDark } = useVeChainKitConfig();
    const { loginMethods, privyEcosystemAppIDS } = useVeChainKitConfig();
    const { data: appsInfo, isLoading: isEcosystemAppsLoading } =
        useFetchAppInfo(privyEcosystemAppIDS);

    const textColor = useToken('colors', 'vechain-kit-text-secondary');

    const handleFAQClick = () => {
        setCurrentContent('faq');
    };

    const showEcosystemButton = loginMethods?.some(
        ({ method }) => method === 'ecosystem',
    );

    return (
        <>
            <StickyHeaderContainer>
                <ModalFAQButton onClick={handleFAQClick} />
                <ModalHeader>{t('Log in or sign up')}</ModalHeader>
                <ModalCloseButton />
            </StickyHeaderContainer>

            {loginModalUI?.logo && (
                <HStack justify={'center'}>
                    <Image
                        src={loginModalUI.logo || '/images/favicon.png'}
                        maxW={'180px'}
                        maxH={'90px'}
                        m={8}
                        alt="logo"
                    />
                </HStack>
            )}

            <ModalBody>
                {loginModalUI?.description && (
                    <HStack
                        spacing={4}
                        w={'full'}
                        justify={'center'}
                        mb={'24px'}
                        px={4}
                    >
                        <Text
                            color={textColor}
                            fontSize={'sm'}
                            textAlign={'center'}
                        >
                            {loginModalUI?.description}
                        </Text>
                    </HStack>
                )}
                <ConnectionOptionsStack setCurrentContent={setCurrentContent} />
            </ModalBody>

            {showEcosystemButton ? (
                <ModalFooter>
                    <HStack justify={'center'} w={'full'}>
                        <EcosystemButton
                            isDark={isDark}
                            appsInfo={Object.values(appsInfo || {})}
                            isLoading={isEcosystemAppsLoading}
                            setCurrentContent={setCurrentContent}
                        />
                    </HStack>
                </ModalFooter>
            ) : (
                <ModalFooter pt={0} pb={'5px'} />
            )}
        </>
    );
};
````

## Source: `packages/vechain-kit/src/components/ConnectModal/Contents/MoreOptionsContent.tsx`

````tsx
import {
    Box,
    Button,
    Grid,
    GridItem,
    HStack,
    Icon,
    Image,
    Input,
    InputGroup,
    InputLeftElement,
    ModalBody,
    ModalCloseButton,
    ModalFooter,
    ModalHeader,
    Spinner,
    Text,
    VStack,
    useToken,
} from '@chakra-ui/react';
import { IconType } from 'react-icons';
import {
    LuChevronRight,
    LuEllipsis,
    LuFingerprint,
    LuMail,
    LuQrCode,
    LuWallet,
} from 'react-icons/lu';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLoginWithEmail } from '@privy-io/react-auth';
import { ModalBackButton, StickyHeaderContainer } from '@/components/common';
import {
    useCrossAppConnectionCache,
    useFetchAppInfo,
    useLoginWithOAuth,
    useLoginWithPasskey,
    useLoginWithVeChain,
    usePrivy,
    useConnectWithDappKitSource,
} from '@/hooks';
import { useVeChainKitConfig } from '@/providers';
import { usePrivyCrossAppSdk } from '@/providers/PrivyCrossAppProvider';
import { isRejectionError } from '@/utils/stringUtils';
import { VeWorldLogoDark, VeWorldLogoLight } from '@/assets';
import { ConnectModalContentsTypes } from '../ConnectModal';
import { EmailCodeVerificationModal } from '../../EmailCodeVerificationModal/EmailCodeVerificationModal';
import { useDisclosure } from '@chakra-ui/react';
import { WalletSource } from '@vechain/dapp-kit';
import { FaApple } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { LuGithub } from 'react-icons/lu';

type Props = {
    onClose: () => void;
    setCurrentContent: React.Dispatch<
        React.SetStateAction<ConnectModalContentsTypes>
    >;
    showBackButton?: boolean;
};

const NATIVE_PRIVY_METHODS = new Set([
    'google',
    'apple',
    'email',
    'github',
    'passkey',
]);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Section eyebrow — uppercase 11px Bold, 0.12em letter-spacing per spec. */
const SectionLabel = ({ children }: { children: React.ReactNode }) => {
    const color = useToken('colors', 'vechain-kit-text-secondary');
    return (
        <Text
            fontSize={'11px'}
            fontWeight={700}
            color={color}
            textTransform={'uppercase'}
            letterSpacing={'0.12em'}
            px={1}
            mb={2}
        >
            {children}
        </Text>
    );
};

/** Provider list row. Icon tile (36×36) + label + right chevron. */
const ProviderRow = ({
    icon,
    customIcon,
    label,
    onClick,
    iconBg,
    iconColor,
}: {
    icon?: IconType;
    customIcon?: React.ReactElement;
    label: string;
    onClick: () => void;
    iconBg?: string;
    iconColor?: string;
}) => {
    const hoverBg = useToken('colors', 'vechain-kit-button-secondary-bg');
    return (
        <Button
            variant={'ghost'}
            w={'full'}
            h={'auto'}
            py={'10px'}
            px={'12px'}
            borderRadius={'14px'}
            justifyContent={'flex-start'}
            onClick={onClick}
            _hover={{ bg: hoverBg }}
            _active={{ bg: hoverBg, transform: 'scale(0.99)' }}
        >
            <HStack w={'full'} spacing={3}>
                <HStack
                    w={'36px'}
                    h={'36px'}
                    borderRadius={'10px'}
                    bg={iconBg ?? 'transparent'}
                    justify={'center'}
                    align={'center'}
                    flexShrink={0}
                >
                    {customIcon ? (
                        customIcon
                    ) : icon ? (
                        <Icon
                            as={icon}
                            w={'18px'}
                            h={'18px'}
                            color={iconColor}
                        />
                    ) : null}
                </HStack>
                <Text
                    flex={1}
                    textAlign={'left'}
                    fontSize={'15px'}
                    fontWeight={600}
                    letterSpacing={'-0.005em'}
                >
                    {label}
                </Text>
                <Icon as={LuChevronRight} opacity={0.4} />
            </HStack>
        </Button>
    );
};

/** Wallet row variant that wires up the dapp-kit connection flow internally. */
const WalletRow = ({
    source,
    label,
    icon,
    customIcon,
    iconBg,
    iconColor,
    setCurrentContent,
}: {
    source: WalletSource;
    label: string;
    icon?: IconType;
    customIcon?: React.ReactElement;
    iconBg?: string;
    iconColor?: string;
    setCurrentContent: React.Dispatch<
        React.SetStateAction<ConnectModalContentsTypes>
    >;
}) => {
    const { connect } = useConnectWithDappKitSource(source, setCurrentContent);
    return (
        <ProviderRow
            icon={icon}
            customIcon={customIcon}
            label={label}
            onClick={connect}
            iconBg={iconBg}
            iconColor={iconColor}
        />
    );
};

export const MoreOptionsContent = ({
    onClose,
    setCurrentContent,
    showBackButton = true,
}: Props) => {
    const { t } = useTranslation();
    const {
        privy,
        privyEcosystemAppIDS,
        dappKit,
        loginMethods,
        darkMode: isDark,
    } = useVeChainKitConfig();
    // Brand-locked inverted-contrast surface used by the VeWorld and Apple
    // icon tiles. Intentionally not theme-driven — devs that customised
    // `theme.buttons.primaryButton` shouldn't end up with a tinted VeWorld
    // logo tile.
    const brandInverseBg = isDark ? '#ffffff' : '#0E0D18';
    const brandInverseFg = isDark ? '#0E0D18' : '#ffffff';
    const { data: appsInfo, isLoading: isEcosystemAppsLoading } =
        useFetchAppInfo(privyEcosystemAppIDS);

    const { login: viewMoreLogin } = usePrivy();
    const { initOAuth } = useLoginWithOAuth();
    const { loginWithPasskey } = useLoginWithPasskey();
    const { setConnectionCache } = useCrossAppConnectionCache();
    const { login: loginWithCrossApp } = usePrivyCrossAppSdk();
    const { login: loginWithVeChain } = useLoginWithVeChain();

    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');

    const onMainGrid = (method: string) =>
        loginMethods?.some((m) => m.method === method) ?? false;

    const allowedWallets = dappKit?.allowedWallets ?? [];
    const privyLoginMethods = (privy?.loginMethods ?? []) as readonly string[];

    const showVeWorldHere =
        allowedWallets.includes('veworld') && !onMainGrid('veworld');
    const showSync2Here =
        allowedWallets.includes('sync2') && !onMainGrid('sync2');
    // WalletConnect also needs a `walletConnectOptions.projectId` — without
    // one the WC SDK rejects at connect time, so advertising the option in
    // the More-options sub-view is misleading.
    const showWalletConnectHere =
        allowedWallets.includes('wallet-connect') &&
        !!dappKit?.walletConnectOptions?.projectId &&
        !onMainGrid('wallet-connect');
    const showWalletsSection =
        showVeWorldHere || showSync2Here || showWalletConnectHere;

    const showGoogleHere =
        privyLoginMethods.includes('google') && !onMainGrid('google');
    const showAppleHere =
        privyLoginMethods.includes('apple') && !onMainGrid('apple');
    const showEmailHere =
        privyLoginMethods.includes('email') && !onMainGrid('email');
    const showGithubHere =
        privyLoginMethods.includes('github') && !onMainGrid('github');
    const showPasskeyHere =
        !!privy &&
        privyLoginMethods.includes('passkey') &&
        !onMainGrid('passkey');
    const hasNonNativePrivyMethod = privyLoginMethods.some(
        (m) => !NATIVE_PRIVY_METHODS.has(m),
    );
    const showSocialsSection =
        !!privy &&
        (showGoogleHere ||
            showAppleHere ||
            showEmailHere ||
            showGithubHere ||
            showPasskeyHere ||
            hasNonNativePrivyMethod);

    const ecosystemApps = Object.values(appsInfo || {});
    // Ecosystem apps are gated on `privyEcosystemAppIDS` being configured,
    // not on `!!privy` — the cross-app SDK doesn't need the consuming dApp
    // to own a Privy account, and the apps' name/logo come from Privy's
    // public app-info endpoint, so this works fine in the no-Privy case
    // too.
    const showEcosystemSection =
        (privyEcosystemAppIDS?.length ?? 0) > 0 &&
        (isEcosystemAppsLoading || ecosystemApps.length > 0);

    // The "Continue with VeChain" cross-app picker. Works without a `privy`
    // prop because it routes through the whitelabel popup (VECHAIN_PRIVY_APP_ID).
    // Surface it in the More sub-view whenever the dev didn't pin `vechain`
    // to the main grid — without Privy + without this row, an opt-out dapp
    // that ships {google, apple, more} would leave the user with no path to
    // the broader VeChain picker.
    const showVeChainHere = !onMainGrid('vechain');

    const handleLoginWithVeChain = async () => {
        setCurrentContent({
            type: 'loading',
            props: {
                title: t('Connecting to VeChain'),
                loadingText: t(
                    'Please approve the request in the connection request window...',
                ),
                onTryAgain: handleLoginWithVeChain,
            },
        });
        try {
            await loginWithVeChain();
        } catch (error) {
            setCurrentContent({
                type: 'error',
                props: {
                    error:
                        error instanceof Error
                            ? error.message
                            : t('Failed to connect with VeChain'),
                    onTryAgain: handleLoginWithVeChain,
                },
            });
        }
    };

    const handleLoginWithPasskey = async () => {
        setCurrentContent({
            type: 'loading',
            props: {
                title: t('Connecting with Passkey'),
                loadingText: t('Please complete the passkey authentication...'),
                onTryAgain: handleLoginWithPasskey,
            },
        });
        try {
            await loginWithPasskey();
        } catch (error) {
            setCurrentContent({
                type: 'error',
                props: {
                    error:
                        error instanceof Error
                            ? error.message
                            : t('Failed to connect with Passkey'),
                    onTryAgain: handleLoginWithPasskey,
                },
            });
        }
    };

    const connectWithEcosystemApp = async (appId: string, appName: string) => {
        setCurrentContent({
            type: 'loading',
            props: {
                title: `${t('Connecting with')} ${appName}`,
                loadingText: t(
                    'Please approve the request in the connection request window...',
                ),
                onTryAgain: () => {
                    connectWithEcosystemApp(appId, appName);
                },
            },
        });
        try {
            await loginWithCrossApp(appId);
            const matched = ecosystemApps.find((app) => app.id === appId);
            setConnectionCache({
                name: appName,
                logoUrl: matched?.logo_url,
                appId,
                website: matched?.website,
            });
            onClose();
        } catch (error) {
            const errorMsg = (error as { message?: string })?.message;
            if (errorMsg && isRejectionError(errorMsg)) {
                // Carry forward the same showBackButton flag we were rendered
                // with, so popover-launched flows (where showBackButton=false)
                // don't suddenly grow a back arrow after a rejection.
                setCurrentContent({
                    type: 'more',
                    props: { showBackButton },
                });
                return;
            }
            const errorToShow =
                error instanceof Error
                    ? error
                    : new Error(
                          'An unexpected issue occurred while logging in with this app. Please try again or contact support.',
                      );
            setCurrentContent({
                type: 'error',
                props: {
                    error: errorToShow.message,
                    onTryAgain: () => {
                        connectWithEcosystemApp(appId, appName);
                    },
                },
            });
        }
    };

    // Inline email — same flow as EmailLoginButton, rendered compact per spec.
    const [email, setEmail] = useState('');
    const { sendCode, state: emailState } = useLoginWithEmail({});
    const emailVerification = useDisclosure();
    const isEmailValid = EMAIL_RE.test(email);
    const submitEmail = async () => {
        if (!isEmailValid) return;
        try {
            await sendCode({ email });
            emailVerification.onOpen();
        } catch (err) {
            // sendCode rejections were previously swallowed. Surface the
            // failure in the modal's error sub-view so the user can retry.
            const message =
                err instanceof Error
                    ? err.message
                    : t('Failed to connect, please try again later.');
            console.error('sendCode failed', err);
            setCurrentContent({
                type: 'error',
                props: {
                    error: message,
                    onTryAgain: () => {
                        void submitEmail();
                    },
                },
            });
        }
    };

    const [stroke, accent, textPrimary, secondaryBg] = useToken('colors', [
        'vechain-kit-border-button',
        'vechain-kit-accent',
        'vechain-kit-text-primary',
        'vechain-kit-button-secondary-bg',
    ]);

    return (
        <Box>
            <StickyHeaderContainer>
                <ModalHeader>
                    {showBackButton && (
                        <ModalBackButton
                            onClick={() => setCurrentContent('main')}
                        />
                    )}
                    {t('More options')}
                    <ModalCloseButton onClick={onClose} />
                </ModalHeader>
            </StickyHeaderContainer>

            <ModalBody>
                <VStack spacing={6} w={'full'} align={'stretch'}>
                    {showWalletsSection && (
                        <Box>
                            <SectionLabel>{t('Other wallets')}</SectionLabel>
                            <VStack spacing={1} w={'full'} align={'stretch'}>
                                {showVeWorldHere && (
                                    <WalletRow
                                        source={'veworld'}
                                        label={t('Continue with VeWorld')}
                                        customIcon={
                                            // Logos have hardcoded fill —
                                            // `color` prop has no effect.
                                            // Pick the variant that contrasts
                                            // with the icon-tile background.
                                            isDark ? (
                                                <VeWorldLogoDark
                                                    w={'20px'}
                                                    h={'20px'}
                                                />
                                            ) : (
                                                <VeWorldLogoLight
                                                    w={'20px'}
                                                    h={'20px'}
                                                />
                                            )
                                        }
                                        iconBg={brandInverseBg}
                                        setCurrentContent={setCurrentContent}
                                    />
                                )}
                                {showSync2Here && (
                                    <WalletRow
                                        source={'sync2'}
                                        label={t('Continue with Sync2')}
                                        icon={LuWallet}
                                        iconBg={secondaryBg}
                                        iconColor={textPrimary}
                                        setCurrentContent={setCurrentContent}
                                    />
                                )}
                                {showWalletConnectHere && (
                                    <WalletRow
                                        source={'wallet-connect'}
                                        label={t(
                                            'Continue with WalletConnect',
                                        )}
                                        icon={LuQrCode}
                                        iconBg={'#3B99FC'}
                                        iconColor={'#ffffff'}
                                        setCurrentContent={setCurrentContent}
                                    />
                                )}
                            </VStack>
                        </Box>
                    )}

                    {showVeChainHere && (
                        <Box>
                            <SectionLabel>
                                {t('View more socials')}
                            </SectionLabel>
                            <VStack spacing={1} w={'full'} align={'stretch'}>
                                <ProviderRow
                                    icon={LuEllipsis}
                                    label={t('View more')}
                                    onClick={handleLoginWithVeChain}
                                    iconBg={secondaryBg}
                                    iconColor={textPrimary}
                                />
                            </VStack>
                        </Box>
                    )}

                    {showSocialsSection && (
                        <Box>
                            <SectionLabel>{t('Other sign-in')}</SectionLabel>
                            <VStack spacing={1} w={'full'} align={'stretch'}>
                                {showGoogleHere && (
                                    <ProviderRow
                                        icon={FcGoogle}
                                        label={t('Continue with Google')}
                                        onClick={() =>
                                            initOAuth({ provider: 'google' })
                                        }
                                        iconBg={'#ffffff'}
                                    />
                                )}
                                {showAppleHere && (
                                    <ProviderRow
                                        icon={FaApple}
                                        label={t('Continue with Apple')}
                                        onClick={() =>
                                            initOAuth({ provider: 'apple' })
                                        }
                                        iconBg={brandInverseBg}
                                        iconColor={brandInverseFg}
                                    />
                                )}
                                {showGithubHere && (
                                    <ProviderRow
                                        icon={LuGithub}
                                        label={t('Continue with Github')}
                                        onClick={() =>
                                            initOAuth({ provider: 'github' })
                                        }
                                        iconBg={'#24292e'}
                                        iconColor={'#ffffff'}
                                    />
                                )}
                                {showPasskeyHere && (
                                    <ProviderRow
                                        icon={LuFingerprint}
                                        label={t('Passkey')}
                                        onClick={handleLoginWithPasskey}
                                        iconBg={secondaryBg}
                                        iconColor={textPrimary}
                                    />
                                )}
                                {showEmailHere && (
                                    <Box px={'2px'} pt={1}>
                                        <InputGroup size={'md'}>
                                            <InputLeftElement
                                                pointerEvents={'none'}
                                                h={'100%'}
                                                pl={3}
                                            >
                                                <Icon
                                                    as={LuMail}
                                                    w={'14px'}
                                                    h={'14px'}
                                                    opacity={0.6}
                                                />
                                            </InputLeftElement>
                                            <Input
                                                type={'email'}
                                                placeholder={t(
                                                    'your@email.com',
                                                )}
                                                value={email}
                                                onChange={(e) =>
                                                    setEmail(e.target.value)
                                                }
                                                onKeyDown={(e) => {
                                                    if (
                                                        e.key === 'Enter' &&
                                                        isEmailValid
                                                    )
                                                        submitEmail();
                                                }}
                                                fontSize={'14px'}
                                                pl={'34px'}
                                                pr={'72px'}
                                                h={'44px'}
                                                borderRadius={'9999px'}
                                                bg={'transparent'}
                                                borderColor={stroke}
                                                _hover={{
                                                    borderColor: stroke,
                                                }}
                                                _focus={{
                                                    borderColor: accent,
                                                    boxShadow: 'none',
                                                }}
                                            />
                                            <Button
                                                position={'absolute'}
                                                right={1}
                                                top={'50%'}
                                                transform={'translateY(-50%)'}
                                                zIndex={2}
                                                variant={'ghost'}
                                                size={'sm'}
                                                borderRadius={'9999px'}
                                                fontSize={'13px'}
                                                fontWeight={600}
                                                color={
                                                    isEmailValid
                                                        ? accent
                                                        : textSecondary
                                                }
                                                isDisabled={!isEmailValid}
                                                isLoading={
                                                    emailState.status ===
                                                    'sending-code'
                                                }
                                                onClick={submitEmail}
                                            >
                                                {t('Submit')}
                                            </Button>
                                        </InputGroup>
                                    </Box>
                                )}
                                {hasNonNativePrivyMethod && (
                                    <ProviderRow
                                        icon={LuEllipsis}
                                        label={t('More options')}
                                        onClick={viewMoreLogin}
                                        iconBg={secondaryBg}
                                        iconColor={textPrimary}
                                    />
                                )}
                            </VStack>
                        </Box>
                    )}

                    {showEcosystemSection && (
                        <Box>
                            <SectionLabel>{t('Ecosystem apps')}</SectionLabel>
                            {isEcosystemAppsLoading ? (
                                <HStack
                                    minH={'60px'}
                                    w={'full'}
                                    justifyContent={'center'}
                                >
                                    <Spinner />
                                </HStack>
                            ) : (
                                <Grid
                                    templateColumns={'repeat(3, 1fr)'}
                                    gap={3}
                                    w={'full'}
                                >
                                    {ecosystemApps.map((appInfo) => (
                                        <GridItem key={appInfo.id}>
                                            <Button
                                                variant={'ghost'}
                                                w={'full'}
                                                h={'auto'}
                                                py={2}
                                                onClick={() =>
                                                    connectWithEcosystemApp(
                                                        appInfo.id,
                                                        appInfo.name,
                                                    )
                                                }
                                                _hover={{ bg: secondaryBg }}
                                                borderRadius={'12px'}
                                            >
                                                <VStack
                                                    spacing={1.5}
                                                    align={'center'}
                                                    w={'full'}
                                                >
                                                    <Image
                                                        src={appInfo.logo_url}
                                                        alt={appInfo.name}
                                                        w={'38px'}
                                                        h={'38px'}
                                                        borderRadius={'10px'}
                                                        objectFit={'cover'}
                                                    />
                                                    <Text
                                                        fontSize={'11px'}
                                                        fontWeight={600}
                                                        noOfLines={1}
                                                        maxW={'full'}
                                                    >
                                                        {appInfo.name}
                                                    </Text>
                                                </VStack>
                                            </Button>
                                        </GridItem>
                                    ))}
                                </Grid>
                            )}
                        </Box>
                    )}

                    {!showVeChainHere &&
                        !showWalletsSection &&
                        !showSocialsSection &&
                        !showEcosystemSection && (
                            <Text
                                textAlign={'center'}
                                color={textSecondary}
                                py={8}
                            >
                                {t('No additional login options available.')}
                            </Text>
                        )}
                </VStack>
            </ModalBody>
            <ModalFooter pt={0} pb={'5px'} />

            <EmailCodeVerificationModal
                isOpen={emailVerification.isOpen}
                onClose={emailVerification.onClose}
                onResend={() => sendCode({ email })}
                email={email}
                isLoading={emailState.status === 'sending-code'}
            />
        </Box>
    );
};
````

## Source: `packages/vechain-kit/src/hooks/api/wallet/useWallet.ts`

````typescript
'use client';

import {
    Wallet as PrivyWallet,
    useLoginWithOAuth,
    usePrivy,
    User,
} from '@privy-io/react-auth';
import {
    useGetChainId,
    useGetNodeUrl,
    useGetAccountVersion,
    useDAppKitWallet,
    useSmartAccount,
    useCrossAppConnectionCache,
} from '@/hooks';
import { compareAddresses, VECHAIN_PRIVY_APP_ID } from '@/utils';
import { ConnectionSource, SmartAccount, Wallet } from '@/types';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';
import { useAccount } from 'wagmi';
import { usePrivyCrossAppSdk } from '@/providers/PrivyCrossAppProvider';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useWalletMetadata } from './useWalletMetadata';
import { useWalletStorage } from './useWalletStorage';
import { isBrowser } from '@/utils/ssrUtils';
import { getVechainDomainQueryKey } from '@/hooks/api/vetDomains/useVechainDomain';
import { getAvatarOfAddressQueryKey } from '@/hooks/api/vetDomains/useGetAvatarOfAddress';

// Normalize addresses to lowercase at the `useWallet` boundary so that the
// case returned by `account.address` / `connectedWallet.address` is stable
// across vechain-kit versions and dapp-kit connect flows (v1 certificate vs
// v2 `wallet_requestPermissions`, which may return mixed case).
// Downstream consumers (React Query keys, app-side caches, stored wallets)
// historically treated the address as lowercase; returning a checksummed
// address here would break that contract and silently invalidate caches
// when switching between vechain-kit versions on the same domain.
// Strict EIP-55 callers must opt-in explicitly via `Address.checksum`.
const normalizeAddress = (addr: string): string => addr.toLowerCase();

export type UseWalletReturnType = {
    // This will be the smart account if connected with privy, otherwise it will be wallet connected with dappkit
    account: Wallet;

    // The wallet in use between dappKitWallet, embeddedWallet and crossAppWallet
    connectedWallet: Wallet;

    /** All accounts approved by the wallet (dapp-kit multi-account); single
     * entry for Privy / cross-app. The active one is `account`. */
    accounts: NonNullable<Wallet>[];

    /** Switch active account without reopening the wallet picker. No-op for
     * Privy / cross-app. */
    setActiveAccount: (address: string) => void;

    // Every user connected with privy has one
    smartAccount: SmartAccount;

    // Privy user if user is connected with privy
    privyUser: User | null;

    // Connection status
    connection: {
        isConnected: boolean;
        isLoading: boolean;
        isConnectedWithSocialLogin: boolean;
        isConnectedWithDappKit: boolean;
        isConnectedWithCrossApp: boolean;
        isConnectedWithPrivy: boolean;
        isConnectedWithVeChain: boolean;
        source: ConnectionSource;
        isInAppBrowser: boolean;
        nodeUrl: string;
        delegatorUrl?: string;
        chainId?: string;
        network: NETWORK_TYPE;
    };

    // Disconnect function
    disconnect: () => Promise<void>;
};

export const useWallet = (): UseWalletReturnType => {
    const {
        address: crossAppAddress,
        isConnected: isConnectedWithCrossApp,
        isConnecting: isConnectingWithCrossApp,
        isReconnecting: isReconnectingWithCrossApp,
    } = useAccount();
    const { logout: disconnectCrossApp } = usePrivyCrossAppSdk();
    const { loading: isLoadingLoginOAuth } = useLoginWithOAuth({});
    const { feeDelegation, network, privy } = useVeChainKitConfig();
    const { user, authenticated, logout, ready } = usePrivy();
    const { data: chainId } = useGetChainId();
    const {
        account: dappKitAccount,
        accounts: dappKitAccountsRaw,
        setActiveAccount: dappKitSetActiveAccount,
        disconnect: dappKitDisconnect,
    } = useDAppKitWallet();

    // Fall back to `[dappKitAccount]` for dapp-kit-react < 2.2.0 or when
    // v2 persistence didn't populate `addresses`.
    const dappKitAccounts: string[] = useMemo(() => {
        if (dappKitAccountsRaw && dappKitAccountsRaw.length > 0)
            return dappKitAccountsRaw;
        return dappKitAccount ? [dappKitAccount] : [];
    }, [dappKitAccountsRaw, dappKitAccount]);
    const { getConnectionCache, clearConnectionCache } =
        useCrossAppConnectionCache();
    const connectionCache = getConnectionCache();
    const {
        initializeCurrentWallet,
        getActiveWallet,
        saveWallet,
        getStoredWallets,
        setActiveWallet: setActiveWalletStorage,
        removeWallet,
    } = useWalletStorage();

    const queryClient = useQueryClient();

    const nodeUrl = useGetNodeUrl();

    // Check if in-app browser (calculate before using in useState)
    const isInAppBrowser = useMemo(
        () => (isBrowser() ? Boolean(window.vechain?.isInAppBrowser) : false),
        [],
    );

    // Connection states
    const isConnectedWithDappKit = !!dappKitAccount;
    const isConnectedWithSocialLogin = authenticated && !!user;
    const isConnectedWithPrivy =
        isConnectedWithSocialLogin || isConnectedWithCrossApp;

    const isConnectedWithVeChain =
        (isConnectedWithSocialLogin && privy?.appId === VECHAIN_PRIVY_APP_ID) ||
        (isConnectedWithCrossApp &&
            connectionCache?.ecosystemApp?.appId === VECHAIN_PRIVY_APP_ID);

    const isLoading =
        isConnectingWithCrossApp ||
        isReconnectingWithCrossApp ||
        isLoadingLoginOAuth ||
        !ready;

    // Add a single connection state that considers all factors
    const [isConnected, setIsConnected] = useState(false);

    // Connection type
    const connectionSource: ConnectionSource = isConnectedWithCrossApp
        ? {
              type: 'privy-cross-app',
              displayName: 'Ecosystem',
          }
        : isConnectedWithDappKit
        ? {
              type: 'wallet',
              displayName: 'Wallet',
          }
        : {
              type: 'privy',
              displayName: 'Social Login',
          };

    useEffect(() => {
        const isNowConnected =
            isConnectedWithDappKit ||
            isConnectedWithSocialLogin ||
            isConnectedWithCrossApp;

        if (isConnected !== isNowConnected) {
            setIsConnected(isNowConnected);

            // Only clear cache and dispatch event when disconnecting
            if (!isNowConnected) {
                // Clear any cached wallet data
                clearConnectionCache();
                // Dispatch event to trigger re-renders
                if (isBrowser()) {
                    window.dispatchEvent(new Event('wallet_disconnected'));
                }
            }
        }
    }, [
        isConnectedWithDappKit,
        isConnectedWithSocialLogin,
        isConnectedWithCrossApp,
        clearConnectionCache,
        isConnected,
    ]);

    // Get embedded wallet
    const privyEmbeddedWallet = user?.linkedAccounts?.find(
        (account) =>
            account.type === 'wallet' && account.connectorType === 'embedded',
    ) as PrivyWallet;
    const privyEmbeddedWalletAddress = privyEmbeddedWallet?.address;

    // Get connected and selected accounts
    const connectedWalletAddress = isConnectedWithDappKit
        ? dappKitAccount
        : isConnectedWithCrossApp
        ? crossAppAddress
        : privyEmbeddedWalletAddress;

    // Invalidate VNS/avatar queries on dapp-kit v2 connect — `connectV2` only
    // sets `state.address`, it doesn't trigger the VNS lookup v1 did.
    useEffect(() => {
        if (!dappKitAccount) return;
        queryClient.invalidateQueries({
            queryKey: getVechainDomainQueryKey(dappKitAccount),
        });
        queryClient.invalidateQueries({
            queryKey: getAvatarOfAddressQueryKey(dappKitAccount),
        });
    }, [dappKitAccount, queryClient]);

    // Cross-version compat: dapp-kit v2 (`wallet_requestPermissions`) and
    // older builds of this kit may persist mixed-case, non-EIP-55 addresses
    // under both `dappkit@vechain/v2/*` (dapp-kit) and
    // `vechain_kit_wallets_*` / `vechain_kit_active_wallet_*` (kit). Older
    // vechain-kit consumers on the same origin read those keys verbatim and
    // then hit `ethers.isAddress()` strict EIP-55 checks downstream
    // (balance/domain/avatar all fail). Normalize every relevant entry to
    // lowercase so any reader — old or new — gets a uniformly safe value.
    useEffect(() => {
        if (!isBrowser() || !isConnectedWithDappKit || !dappKitAccount) return;

        const normalizeStringEntry = (key: string) => {
            try {
                const v = window.localStorage.getItem(key);
                if (v && v !== v.toLowerCase()) {
                    window.localStorage.setItem(key, v.toLowerCase());
                }
            } catch {
                /* ignore: localStorage may be unavailable */
            }
        };

        const normalizeJsonArrayEntry = (key: string) => {
            try {
                const v = window.localStorage.getItem(key);
                if (!v) return;
                const parsed = JSON.parse(v);
                if (
                    Array.isArray(parsed) &&
                    parsed.some(
                        (a) => typeof a === 'string' && a !== a.toLowerCase(),
                    )
                ) {
                    window.localStorage.setItem(
                        key,
                        JSON.stringify(
                            parsed.map((a) =>
                                typeof a === 'string' ? a.toLowerCase() : a,
                            ),
                        ),
                    );
                }
            } catch {
                /* ignore: malformed JSON or unavailable storage */
            }
        };

        const normalizeStoredWalletsEntry = (key: string) => {
            try {
                const v = window.localStorage.getItem(key);
                if (!v) return;
                const parsed = JSON.parse(v);
                if (!Array.isArray(parsed)) return;
                const next = parsed.map((w) => {
                    if (
                        w &&
                        typeof w === 'object' &&
                        typeof w.address === 'string'
                    ) {
                        return { ...w, address: w.address.toLowerCase() };
                    }
                    return w;
                });
                const changed = next.some(
                    (w, i) =>
                        w?.address !== (parsed[i] as { address?: string })?.address,
                );
                if (changed) {
                    window.localStorage.setItem(key, JSON.stringify(next));
                }
            } catch {
                /* ignore */
            }
        };

        normalizeStringEntry('dappkit@vechain/v2/account');
        normalizeJsonArrayEntry('dappkit@vechain/v2/accounts');
        normalizeStringEntry(`vechain_kit_active_wallet_${network.type}`);
        normalizeStoredWalletsEntry(`vechain_kit_wallets_${network.type}`);
    }, [
        isConnectedWithDappKit,
        dappKitAccount,
        dappKitAccountsRaw,
        network.type,
    ]);

    // For desktop dappkit wallets, check if there's a stored active wallet
    // Use state to track active wallet so it updates immediately on switch
    const [storedActiveWalletAddress, setStoredActiveWalletAddress] = useState<
        string | null
    >(() => {
        if (isConnectedWithDappKit && !isInAppBrowser) {
            return getActiveWallet();
        }
        return null;
    });

    // Update stored active wallet when it changes in storage
    // Also reset when disconnecting
    useEffect(() => {
        if (isConnectedWithDappKit && !isInAppBrowser) {
            const activeWallet = getActiveWallet();
            setStoredActiveWalletAddress(activeWallet);
        } else {
            // Reset when disconnected or in-app browser
            setStoredActiveWalletAddress(null);
        }
    }, [isConnectedWithDappKit, isInAppBrowser, getActiveWallet]);

    // Track if a wallet switch is in progress to prevent overriding the user's selection
    const [isWalletSwitchInProgress, setIsWalletSwitchInProgress] =
        useState(false);

    // Listen for wallet switch events
    useEffect(() => {
        if (!isBrowser() || !isConnectedWithDappKit || isInAppBrowser) return;

        const handleWalletSwitch = (
            event: CustomEvent<{ address: string }>,
        ) => {
            setIsWalletSwitchInProgress(true);
            setStoredActiveWalletAddress(event.detail.address);
            // Reset the flag after a short delay to allow the connection to update
            setTimeout(() => {
                setIsWalletSwitchInProgress(false);
            }, 1000);
        };

        window.addEventListener(
            'wallet_switched',
            handleWalletSwitch as EventListener,
        );
        return () => {
            window.removeEventListener(
                'wallet_switched',
                handleWalletSwitch as EventListener,
            );
        };
    }, [isConnectedWithDappKit, isInAppBrowser]);

    // Always prioritize the stored active wallet from cache when switching
    // Use connected wallet when:
    // 1. No stored active wallet exists (new connection)
    // 2. Connected wallet is not in stored wallets list (new wallet after disconnect)
    // 3. A switch is NOT in progress AND connected wallet differs from stored (reconnection with different wallet)
    const storedWallets = getStoredWallets();
    const isConnectedWalletInStoredList = storedWallets.some(
        (w) =>
            w.address.toLowerCase() === connectedWalletAddress?.toLowerCase(),
    );

    // Always read the stored active wallet directly from storage to ensure consistency
    // This avoids race conditions with state updates
    const currentStoredActiveWallet =
        isConnectedWithDappKit && !isInAppBrowser ? getActiveWallet() : null;

    const effectiveConnectedWalletAddress =
        // If switch is in progress, always use stored active wallet
        isWalletSwitchInProgress && currentStoredActiveWallet
            ? currentStoredActiveWallet
            : // If stored active wallet exists and connected wallet is in stored list, use stored (switch scenario)
            currentStoredActiveWallet && isConnectedWalletInStoredList
            ? currentStoredActiveWallet
            : // Otherwise use connected wallet (new connection or reconnection with different wallet)
              connectedWalletAddress;

    // Get smart account
    const { data: smartAccount } = useSmartAccount(
        effectiveConnectedWalletAddress ?? '',
    );

    // TODO: here we will need to check if the owner of the wallet owns a smart account
    const activeAddress = isConnectedWithDappKit
        ? effectiveConnectedWalletAddress
        : smartAccount?.address;

    const activeAccountMetadata = useWalletMetadata(
        activeAddress ?? '',
        network.type,
    );

    const connectedMetadata = useWalletMetadata(
        effectiveConnectedWalletAddress ?? '',
        network.type,
    );
    const smartAccountMetadata = useWalletMetadata(
        smartAccount?.address ?? '',
        network.type,
    );

    const dappKitAccountsRef = useRef(dappKitAccounts);
    dappKitAccountsRef.current = dappKitAccounts;

    // Reconcile kit storage with the dapp-kit approved set.
    //   - dapp-kit v2 (`accounts` populated): full multi-account set.
    //   - dapp-kit v1 / single-account flow (`accounts` missing or empty):
    //     fall back to `[dappKitAccount]`. This handles the recovery case
    //     where the user disconnected from an older vechain-kit on the
    //     same origin and re-logged in with a single account — without
    //     pruning here, `vechain_kit_wallets_*` keeps stale multi-account
    //     entries written by a previous v2 session and the old kit's UI
    //     surfaces accounts the wallet no longer approves.
    useEffect(() => {
        if (
            !isConnectedWithDappKit ||
            isInAppBrowser ||
            !dappKitAccount
        ) {
            return;
        }

        const approvedAddresses: string[] =
            dappKitAccountsRaw && dappKitAccountsRaw.length > 0
                ? dappKitAccountsRaw
                : [dappKitAccount];

        const stored = getStoredWallets();
        const approvedLower = new Set(
            approvedAddresses.map((a) => a.toLowerCase()),
        );
        const storedLower = new Set(
            stored.map((w) => w.address.toLowerCase()),
        );

        approvedAddresses.forEach((addr) => {
            if (!storedLower.has(addr.toLowerCase())) saveWallet(addr);
        });
        stored.forEach((w) => {
            if (!approvedLower.has(w.address.toLowerCase()))
                removeWallet(w.address);
        });
    }, [
        isConnectedWithDappKit,
        isInAppBrowser,
        dappKitAccount,
        dappKitAccountsRaw,
        getStoredWallets,
        saveWallet,
        removeWallet,
    ]);

    // Track recently removed wallets to prevent them from being set as active again
    const recentlyRemovedWalletsRef = useRef<Set<string>>(new Set());

    // Listen for wallet removal events
    useEffect(() => {
        if (!isBrowser() || !isConnectedWithDappKit || isInAppBrowser) return;

        const handleWalletRemoved = (
            event: CustomEvent<{ address: string }>,
        ) => {
            // Track removed wallet for 5 seconds to prevent it from being set as active
            recentlyRemovedWalletsRef.current.add(
                event.detail.address.toLowerCase(),
            );
            setTimeout(() => {
                recentlyRemovedWalletsRef.current.delete(
                    event.detail.address.toLowerCase(),
                );
            }, 5000);
        };

        window.addEventListener(
            'wallet_removed',
            handleWalletRemoved as EventListener,
        );
        return () => {
            window.removeEventListener(
                'wallet_removed',
                handleWalletRemoved as EventListener,
            );
        };
    }, [isConnectedWithDappKit, isInAppBrowser]);

    // Save/initialize wallet in storage when connected via dappkit and not in-app browser
    // Set the connected wallet as active when it's a new wallet or new connection
    useEffect(() => {
        if (
            isConnectedWithDappKit &&
            !isInAppBrowser &&
            connectedWalletAddress &&
            activeAccountMetadata &&
            !activeAccountMetadata.isLoading
        ) {
            // Don't save or set as active if this wallet was recently removed
            // This prevents re-adding wallets that the user just removed
            const wasRecentlyRemoved = recentlyRemovedWalletsRef.current.has(
                connectedWalletAddress.toLowerCase(),
            );
            if (wasRecentlyRemoved) {
                return;
            }

            // Check if this is a new wallet BEFORE saving (since saveWallet adds it to storage)
            const currentStoredWallets = getStoredWallets();
            const isNewWallet = !currentStoredWallets.some(
                (w) =>
                    w.address.toLowerCase() ===
                    connectedWalletAddress.toLowerCase(),
            );

            // First try to initialize (only saves if no wallets exist and sets as active)
            initializeCurrentWallet(connectedWalletAddress);
            // Always save/update the wallet (in case it already exists or is a new connection)
            saveWallet(connectedWalletAddress);

            // Check if this is a new connection or a switch
            // When switching, storedActiveWalletAddress is updated immediately via wallet_switched event
            // and isWalletSwitchInProgress is set to true
            // We should NOT override the stored active wallet when switching
            const isNewConnection = !storedActiveWalletAddress;
            const isSameAsStoredActive =
                storedActiveWalletAddress &&
                storedActiveWalletAddress.toLowerCase() ===
                    connectedWalletAddress.toLowerCase();

            // Set as active if:
            // 1. It's a new wallet (not in stored wallets list) - always set as active for better UX, OR
            // 2. It's a new connection (no stored active wallet), OR
            // 3. The connected wallet matches the stored active wallet (same wallet, just ensuring it's saved), AND
            // 4. A wallet switch is NOT in progress (to prevent overriding user's selection during switch)
            if (
                (isNewWallet || isNewConnection || isSameAsStoredActive) &&
                !isWalletSwitchInProgress
            ) {
                setActiveWalletStorage(connectedWalletAddress);
            }
        }
    }, [
        isConnectedWithDappKit,
        isInAppBrowser,
        connectedWalletAddress,
        activeAccountMetadata?.domain,
        activeAccountMetadata?.image,
        activeAccountMetadata?.isLoading,
        initializeCurrentWallet,
        saveWallet,
        setActiveWalletStorage,
        storedActiveWalletAddress,
        getStoredWallets,
    ]);

    // Ensure the stored active wallet is saved when it changes
    // Metadata will be fetched dynamically when needed
    useEffect(() => {
        if (
            isConnectedWithDappKit &&
            !isInAppBrowser &&
            storedActiveWalletAddress &&
            storedActiveWalletAddress.toLowerCase() ===
                effectiveConnectedWalletAddress?.toLowerCase()
        ) {
            // Ensure the stored active wallet is saved
            saveWallet(storedActiveWalletAddress);
        }
    }, [
        isConnectedWithDappKit,
        isInAppBrowser,
        storedActiveWalletAddress,
        effectiveConnectedWalletAddress,
        saveWallet,
    ]);

    const account = activeAddress
        ? {
              address: normalizeAddress(activeAddress),
              domain: activeAccountMetadata.domain,
              image: activeAccountMetadata.image,
              isLoadingMetadata: activeAccountMetadata.isLoading,
              metadata: activeAccountMetadata.records,
          }
        : null;

    const connectedWallet = connectedWalletAddress
        ? {
              address: normalizeAddress(connectedWalletAddress),
              domain: connectedMetadata.domain,
              image: connectedMetadata.image,
              isLoadingMetadata: connectedMetadata.isLoading,
              metadata: connectedMetadata.records,
          }
        : null;

    // Approved-accounts list surfaced to consumers (dapp-kit only; Privy /
    // cross-app always have a single wallet).
    const accountsList: NonNullable<Wallet>[] = useMemo(() => {
        if (isConnectedWithDappKit) {
            return dappKitAccounts.map((addr) => ({
                address: normalizeAddress(addr),
                domain: undefined,
                image: undefined,
                isLoadingMetadata: false,
                metadata: undefined,
            }));
        }
        return connectedWallet ? [connectedWallet] : [];
    }, [isConnectedWithDappKit, dappKitAccounts, connectedWallet]);

    const setActiveAccount = useCallback(
        (address: string) => {
            if (!isConnectedWithDappKit) return;
            if (typeof dappKitSetActiveAccount === 'function') {
                try {
                    dappKitSetActiveAccount(address);
                } catch (e) {
                    console.error(
                        'setActiveAccount: dapp-kit rejected the address',
                        e,
                    );
                    return;
                }
            }
            if (!isInAppBrowser) {
                setActiveWalletStorage(address);
                setStoredActiveWalletAddress(address);
                if (isBrowser()) {
                    window.dispatchEvent(
                        new CustomEvent('wallet_switched', {
                            detail: { address },
                        }),
                    );
                }
            }
        },
        [
            isConnectedWithDappKit,
            isInAppBrowser,
            dappKitSetActiveAccount,
            setActiveWalletStorage,
        ],
    );

    // Get smart account version
    const { data: smartAccountVersion } = useGetAccountVersion(
        smartAccount?.address ?? '',
        connectedWallet?.address ?? '',
    );

    const hasActiveSmartAccount =
        !!smartAccount?.address &&
        !!account?.address &&
        compareAddresses(smartAccount?.address, account?.address);

    // Modify the disconnect function to ensure state updates
    const disconnect = useCallback(async () => {
        try {
            // First set connection state to false
            setIsConnected(false);

            // Then perform disconnection logic. `dappKitDisconnect` already
            // wipes both `dappkit@vechain/v2/*` and the legacy
            // `dappkit@vechain/*` keys; we add the kit-side storage cleanup
            // below so a logout always leaves a clean slate (no stale
            // multi-account list surfacing on the next login, regardless of
            // which vechain-kit version connects next on the same origin).
            if (isConnectedWithDappKit) {
                dappKitDisconnect();
            } else if (isConnectedWithSocialLogin) {
                await logout();
            } else if (isConnectedWithCrossApp) {
                await disconnectCrossApp();
            }

            if (isBrowser()) {
                try {
                    window.localStorage.removeItem(
                        `vechain_kit_wallets_${network.type}`,
                    );
                    window.localStorage.removeItem(
                        `vechain_kit_active_wallet_${network.type}`,
                    );
                } catch {
                    /* ignore: localStorage may be unavailable */
                }
            }

            clearConnectionCache();
            if (isBrowser()) {
                window.dispatchEvent(new Event('wallet_disconnected'));
            }
        } catch (error) {
            console.error('Error during disconnect:', error);
        }
    }, [
        isConnectedWithDappKit,
        dappKitDisconnect,
        isConnectedWithSocialLogin,
        logout,
        isConnectedWithCrossApp,
        disconnectCrossApp,
        clearConnectionCache,
        network.type,
    ]);

    return {
        account,
        accounts: accountsList,
        setActiveAccount,
        smartAccount: {
            address: smartAccount?.address ?? '',
            domain: smartAccountMetadata.domain,
            image: smartAccountMetadata.image,
            isDeployed: smartAccount?.isDeployed ?? false,
            isActive: hasActiveSmartAccount,
            version: smartAccountVersion?.version ?? null,
            isLoadingMetadata: smartAccountMetadata.isLoading,
            metadata: smartAccountMetadata.records,
        },
        connectedWallet,
        privyUser: user,
        connection: {
            isLoading,
            isConnected,
            isConnectedWithSocialLogin,
            isConnectedWithDappKit,
            isConnectedWithCrossApp,
            isConnectedWithPrivy,
            isConnectedWithVeChain,
            source: connectionSource,
            isInAppBrowser,
            nodeUrl,
            delegatorUrl: feeDelegation?.delegatorUrl,
            chainId: chainId,
            network: network.type,
        },
        disconnect,
    };
};
````

## Source: `packages/vechain-kit/src/hooks/api/wallet/useWalletMetadata.ts`

````typescript
import { NETWORK_TYPE } from '@/config/network';
import {
    useVechainDomain,
    useGetTextRecords,
    useGetAvatarOfAddress,
} from '@/hooks';
import { convertUriToUrl } from '@/utils';
import { ENSRecords } from '@/types';

export const useWalletMetadata = (
    address: string,
    networkType: NETWORK_TYPE,
) => {
    const { data: domain, isLoading: isLoadingVechainDomain } =
        useVechainDomain(address ?? '');
    const { data: avatar, isLoading: isLoadingMetadata } =
        useGetAvatarOfAddress(address ?? '');
    const { data: textRecords, isLoading: isLoadingRecords } =
        useGetTextRecords(domain?.domain ?? '');
    const headerUrl = textRecords?.header
        ? convertUriToUrl(textRecords.header, networkType)
        : null;

    return {
        domain: domain?.domain,
        image: avatar,
        records: {
            ...textRecords,
            header: headerUrl,
        } as ENSRecords,
        isLoading:
            isLoadingVechainDomain || isLoadingMetadata || isLoadingRecords,
    };
};
````

## Source: `packages/vechain-kit/src/hooks/api/wallet/useWalletStorage.ts`

````typescript
import { useCallback } from 'react';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';
import {
    getLocalStorageItem,
    setLocalStorageItem,
    removeLocalStorageItem,
    isBrowser,
} from '@/utils/ssrUtils';

export type StoredWallet = {
    address: string;
    connectedAt: number;
    isActive: boolean;
};

export const useWalletStorage = () => {
    const { network } = useVeChainKitConfig();

    const getStorageKeys = useCallback((networkType: NETWORK_TYPE) => {
        return {
            wallets: `vechain_kit_wallets_${networkType}`,
            activeWallet: `vechain_kit_active_wallet_${networkType}`,
        };
    }, []);

    const getStoredWallets = useCallback((): StoredWallet[] => {
        if (!isBrowser()) return [];

        const keys = getStorageKeys(network.type);
        const cached = getLocalStorageItem(keys.wallets);
        if (!cached) return [];
        try {
            const parsed = JSON.parse(cached) as StoredWallet[];
            // Migrate legacy mixed-case entries on read so every consumer
            // (including older vechain-kit versions on the same origin)
            // works with lowercase.
            return parsed.map((w) => ({
                ...w,
                address:
                    typeof w.address === 'string'
                        ? w.address.toLowerCase()
                        : w.address,
            }));
        } catch {
            return [];
        }
    }, [network.type, getStorageKeys]);

    const getActiveWallet = useCallback((): string | null => {
        if (!isBrowser()) return null;

        const keys = getStorageKeys(network.type);
        const stored = getLocalStorageItem(keys.activeWallet);
        return stored ? stored.toLowerCase() : null;
    }, [network.type, getStorageKeys]);

    // Normalize at the storage boundary: older vechain-kit consumers on the
    // same origin pass these addresses to `ethers.isAddress()` (strict
    // EIP-55) — mixed-case input there silently fails avatar/domain/balance
    // fetches. Persisting lowercase keeps cross-version reads safe.
    const saveWallet = useCallback(
        (address: string) => {
            if (!isBrowser()) return;

            const normalized = address.toLowerCase();
            const keys = getStorageKeys(network.type);
            const wallets = getStoredWallets();
            const existingIndex = wallets.findIndex(
                (w) => w.address.toLowerCase() === normalized,
            );

            const walletToSave: StoredWallet = {
                address: normalized,
                connectedAt:
                    existingIndex >= 0
                        ? wallets[existingIndex].connectedAt
                        : Date.now(),
                isActive: false,
            };

            if (existingIndex >= 0) {
                wallets[existingIndex] = walletToSave;
            } else {
                wallets.push(walletToSave);
            }

            setLocalStorageItem(keys.wallets, JSON.stringify(wallets));
        },
        [network.type, getStorageKeys, getStoredWallets],
    );

    const setActiveWallet = useCallback(
        (address: string) => {
            if (!isBrowser()) return;

            const normalized = address.toLowerCase();
            const keys = getStorageKeys(network.type);
            const wallets = getStoredWallets();

            const updatedWallets = wallets.map((w) => ({
                ...w,
                address: w.address.toLowerCase(),
                isActive: w.address.toLowerCase() === normalized,
            }));

            setLocalStorageItem(keys.wallets, JSON.stringify(updatedWallets));
            setLocalStorageItem(keys.activeWallet, normalized);
        },
        [network.type, getStorageKeys, getStoredWallets],
    );

    const removeWallet = useCallback(
        (address: string) => {
            if (!isBrowser()) return;

            const keys = getStorageKeys(network.type);
            const wallets = getStoredWallets();
            const updatedWallets = wallets.filter(
                (w) => w.address.toLowerCase() !== address.toLowerCase(),
            );

            setLocalStorageItem(keys.wallets, JSON.stringify(updatedWallets));

            // If removed wallet was active, clear active wallet
            const activeWallet = getActiveWallet();
            if (
                activeWallet &&
                activeWallet.toLowerCase() === address.toLowerCase()
            ) {
                removeLocalStorageItem(keys.activeWallet);
            }

            // Dispatch event to notify that a wallet was removed
            // This prevents useWallet from setting it as active again if it's still connected
            if (isBrowser()) {
                window.dispatchEvent(
                    new CustomEvent('wallet_removed', { detail: { address } }),
                );
            }
        },
        [network.type, getStorageKeys, getStoredWallets, getActiveWallet],
    );

    const initializeCurrentWallet = useCallback(
        (address: string) => {
            if (!isBrowser()) return;

            const wallets = getStoredWallets();
            if (wallets.length === 0) {
                // No wallets stored, save current wallet
                saveWallet(address);
                setActiveWallet(address);
            }
        },
        [getStoredWallets, saveWallet, setActiveWallet],
    );

    return {
        getStoredWallets,
        getActiveWallet,
        saveWallet,
        setActiveWallet,
        removeWallet,
        initializeCurrentWallet,
    };
};
````

## Source: `packages/vechain-kit/src/hooks/generic-delegator/useEstimateAllTokens.ts`

````typescript
import { useQuery } from '@tanstack/react-query';
import { GasTokenType } from '@/types';
import {
    useSmartAccount,
    useWallet,
    estimateGas,
    useGetAccountVersion,
    computeCorrectedTotalGasNoFeePayer,
    convertGasToGasTokenAmount,
} from '@/hooks';
import { useVeChainKitConfig } from '@/providers';
import { TransactionClause } from '@vechain/sdk-core';
import { ThorClient } from '@vechain/sdk-network';
import { getConfig } from '@/config';

export interface UseEstimateAllTokensParams {
    clauses: TransactionClause[];
    tokens: GasTokenType[];
    enabled?: boolean;
}

export const useEstimateAllTokens = ({
    clauses,
    tokens,
    enabled = true,
}: UseEstimateAllTokensParams) => {
    const { connectedWallet } = useWallet();
    const { data: smartAccount } = useSmartAccount(
        connectedWallet?.address ?? '',
    );
    const { data: smartAccountVersion } = useGetAccountVersion(
        smartAccount?.address ?? '',
        connectedWallet?.address ?? '',
    );
    const { feeDelegation, network } = useVeChainKitConfig();
    const thor = ThorClient.at(getConfig(network.type).nodeUrl);

    return useQuery({
        queryKey: [
            'gas-estimation-all-tokens',
            JSON.stringify(clauses),
            JSON.stringify(tokens),
        ],
        queryFn: async () => {
            const estimates: Record<
                GasTokenType,
                { cost: number; loading: boolean; error?: string }
            > = {} as any;

            // Local gas estimate is token-agnostic — compute once,
            // bounded by a timeout so a slow node can't hang the UI.
            const totalGasNoFeePayer = await computeCorrectedTotalGasNoFeePayer({
                thor,
                clauses,
                smartAccountAddress: smartAccount?.address ?? '',
                version: smartAccountVersion?.version ?? 0,
            });

            await Promise.all(
                tokens.map(async (token) => {
                    try {
                        const estimation = await estimateGas(
                            smartAccount?.address ?? '',
                            feeDelegation?.genericDelegatorUrl ?? '',
                            clauses,
                            token,
                            'medium',
                        );
                        const correctedCost =
                            totalGasNoFeePayer !== null
                                ? convertGasToGasTokenAmount({
                                      totalGasNoFeePayer,
                                      gasToken: token,
                                      estimationResponse: estimation,
                                  })
                                : (estimation.transactionCost ?? 0) * 2;
                        estimates[token] = {
                            cost: correctedCost || 0,
                            loading: false,
                        };
                    } catch (error) {
                        estimates[token] = {
                            cost: 0,
                            loading: false,
                            error:
                                error instanceof Error
                                    ? error.message
                                    : 'Unknown error',
                        };
                    }
                }),
            );

            return estimates;
        },
        enabled:
            enabled &&
            clauses.length > 0 &&
            !!smartAccount?.address &&
            !!feeDelegation?.genericDelegatorUrl &&
            tokens.length > 0,
        staleTime: 30 * 1000,
        gcTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,
    });
};
````

## Source: `packages/vechain-kit/src/hooks/generic-delegator/useGasTokenSelection.ts`

````typescript
import { useCallback } from 'react';
import { LocalStorageKey, useSyncableLocalStorage } from '../cache';
import { GasTokenPreferences, GasTokenType } from '@/types/gasToken';
import {
    DEFAULT_GAS_TOKEN_PREFERENCES,
    SUPPORTED_GAS_TOKENS,
} from '@/utils/constants';

export const useGasTokenSelection = () => {
    const [preferences, setPreferences] =
        useSyncableLocalStorage<GasTokenPreferences>(
            LocalStorageKey.GAS_TOKEN_PREFERENCES,
            DEFAULT_GAS_TOKEN_PREFERENCES,
        );

    const updatePreferences = useCallback(
        (updates: Partial<GasTokenPreferences>) => {
            setPreferences((prev) => ({ ...prev, ...updates }));
        },
        [setPreferences],
    );

    // updates the token priority and the available tokens in the order of the token priority but can only order the token that are in the available tokens
    const reorderTokenPriority = useCallback(
        (newOrder: GasTokenType[]) => {
            setPreferences((prev) => {
                const newAvailableGasTokens = newOrder.filter(
                    (t) =>
                        prev.availableGasTokens.includes(t) &&
                        !prev.excludedTokens.includes(t),
                );
                return {
                    ...prev,
                    tokenPriority: newOrder,
                    availableGasTokens: newAvailableGasTokens,
                    gasTokenToUse:
                        newAvailableGasTokens[0] ?? prev.gasTokenToUse,
                };
            });
        },
        [setPreferences],
    );

    const toggleTokenExclusion = useCallback(
        (token: GasTokenType) => {
            setPreferences((prev) => {
                const isExcluded = prev.excludedTokens.includes(token);
                const newExcluded = isExcluded
                    ? prev.excludedTokens.filter((t) => t !== token)
                    : [...prev.excludedTokens, token];
                // pop the token from the available tokens if it is in excluded tokens, else add the token back to available tokens in the order of the token priority
                const tokenPriorityPosition = prev.tokenPriority.indexOf(token);
                const newAvailableTokens = isExcluded
                    ? [
                          ...prev.availableGasTokens.slice(
                              0,
                              tokenPriorityPosition,
                          ),
                          token,
                          ...prev.availableGasTokens.slice(
                              tokenPriorityPosition,
                          ),
                      ]
                    : prev.availableGasTokens.filter((t) => t !== token);

                return {
                    ...prev,
                    excludedTokens: newExcluded,
                    availableGasTokens: newAvailableTokens,
                    gasTokenToUse: newAvailableTokens[0] ?? prev.gasTokenToUse,
                };
            });
        },
        [setPreferences],
    );

    return {
        preferences,
        supportedTokens: SUPPORTED_GAS_TOKENS,
        updatePreferences,
        reorderTokenPriority,
        toggleTokenExclusion,
    };
};
````

## Source: `packages/vechain-kit/src/hooks/generic-delegator/useGenericDelegator.ts`

````typescript
import {
    Transaction,
    HexUInt,
    TransactionClause
} from '@vechain/sdk-core';
import * as nc_utils from '@noble/curves/abstract/utils';
import { GasTokenType, TransactionSpeed, DepositAccount, EstimationResponse, Wallet } from '@/types';
import { SmartAccountReturnType, useGasTokenSelection, useWallet, useSmartAccount, useBuildClauses, useGetAccountVersion } from '@/hooks';
import { IERC20__factory } from '@vechain/vechain-contract-types';
import { parseEther } from 'viem';
import { randomTransactionUser, SUPPORTED_GAS_TOKENS } from '@/utils';
import { ThorClient } from '@vechain/sdk-network';
import { getConfig } from '@/config';
import { useVeChainKitConfig } from '@/providers';
import { useCallback } from 'react';

/**
 * Safety multiplier applied on top of the locally-estimated gas to absorb
 * variance between simulation and on-chain execution. Mirrors VeWorld
 * mobile's heuristic.
 */
export const GENERIC_DELEGATOR_GAS_SAFETY_MULTIPLIER = 1.1;

/**
 * Fixed gas cost for the extra transfer clause that pays the generic
 * delegator's deposit account. VET transfers are bare value transfers
 * (~21k), ERC-20 transfers (VTHO, B3TR) are ~50-55k depending on the
 * recipient cold/warm state.
 */
export const GENERIC_DELEGATOR_FEE_PAYER_OVERHEAD_GAS: Record<GasTokenType, number> = {
    VET: 21_000,
    VTHO: 55_000,
    B3TR: 55_000,
};

/**
 * Gas overhead added on top of the raw user-clause estimate to account for
 * the smart-account `executeWithAuthorization` / `executeBatchWithAuthorization`
 * wrapper (signature verification, calldata decoding, per-clause dispatch).
 */
export const GENERIC_DELEGATOR_WRAPPER_OVERHEAD_GAS: Record<number, number> = {
    1: 80_000,
    3: 120_000,
};

const getWrapperOverheadGas = (version: number): number =>
    GENERIC_DELEGATOR_WRAPPER_OVERHEAD_GAS[version] ??
    GENERIC_DELEGATOR_WRAPPER_OVERHEAD_GAS[3];

export const estimateGas = async (
    signerAddress: string,
    genericDelegatorUrl: string,
    clauses: any[],
    token: GasTokenType,
    speed: TransactionSpeed,
) => {
    const estimateUrl = new URL(
        `estimate/clauses/${token.toLowerCase()}`,
        genericDelegatorUrl,
    );
    estimateUrl.searchParams.set('type', 'smartaccount');
    estimateUrl.searchParams.set('speed', speed);

    const response = await fetch(estimateUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            clauses: clauses,
            signer: signerAddress,
        }),
    });
    const data = await response.json();
    return data;
};

export const getDepositAccount = async (
    genericDelegatorUrl: string,
): Promise<DepositAccount> => {
    const depositAccountUrl = new URL('deposit/account', genericDelegatorUrl);
    const response = await fetch(depositAccountUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const data = await response.json();
    return data;
};

export const delegateAuthorized = async (encodedSignedTx: string, origin: string, token: GasTokenType, genericDelegatorUrl: string) => {
    const delegateAuthorizedUrl = new URL(
        `sign/transaction/authorized/${token.toLowerCase()}`,
        genericDelegatorUrl,
    );
    const response = await fetch(delegateAuthorizedUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            raw: encodedSignedTx,
            origin: origin,
            token: token.toLowerCase(),
        }),
    });
    const data = await response.json();
    return data;
}

// Helper to estimate gas and build transaction body
export const estimateAndBuildTxBody = async (
    clauses: TransactionClause[],
    thor: ThorClient,
    randomTransactionUser: Wallet,
    isDelegated: boolean
) => {
    const gasResult = await thor.gas.estimateGas(
        clauses,
        randomTransactionUser?.address ?? '',
        { gasPadding: 1 },
    );
    const parsedGasLimit = Math.max(
        gasResult.totalGas,
        0,
    );

    return await thor.transactions.buildTransactionBody(
        clauses,
        parsedGasLimit,
        { isDelegated: isDelegated }
    );
};

/**
 * Hard timeout (ms) applied to the local Thor gas estimation. Stops the
 * fee-estimation UI from hanging if the node is slow or unreachable.
 */
export const GENERIC_DELEGATOR_LOCAL_ESTIMATE_TIMEOUT_MS = 6_000;

const withTimeout = <T>(
    promise: Promise<T>,
    ms: number,
): Promise<T | null> =>
    new Promise<T | null>((resolve) => {
        const timer = setTimeout(() => resolve(null), ms);
        promise
            .then((value) => {
                clearTimeout(timer);
                resolve(value);
            })
            .catch(() => {
                clearTimeout(timer);
                resolve(null);
            });
    });

/**
 * Run the local Thor gas estimation for the user's raw clauses (caller =
 * smart account) and return the gas-token-agnostic total: raw gas + wrapper
 * overhead, padded by the safety multiplier. Returns `null` if the
 * simulation reverts, times out, or returns a non-positive number — the
 * caller should then fall back to a delegator-derived estimate.
 *
 * The output is independent of the gas token, so callers iterating over
 * a token-priority list should call this once and reuse the result.
 */
export const computeCorrectedTotalGasNoFeePayer = async ({
    thor,
    clauses,
    smartAccountAddress,
    version,
    timeoutMs = GENERIC_DELEGATOR_LOCAL_ESTIMATE_TIMEOUT_MS,
}: {
    thor: ThorClient;
    clauses: TransactionClause[];
    smartAccountAddress: string;
    version: number;
    timeoutMs?: number;
}): Promise<number | null> => {
    const rawGasResult = await withTimeout(
        thor.gas.estimateGas(clauses, smartAccountAddress),
        timeoutMs,
    );

    const rawGas = rawGasResult?.totalGas;
    if (!rawGas || rawGas <= 0) {
        return null;
    }

    const wrapperOverhead = getWrapperOverheadGas(version);
    return Math.ceil(
        (rawGas + wrapperOverhead) * GENERIC_DELEGATOR_GAS_SAFETY_MULTIPLIER,
    );
};

/**
 * Convert a gas number (without the fee-payer transfer overhead) into the
 * gas-token amount required to cover the transaction, using the per-gas
 * rate returned by the delegator's `/estimate/clauses` response (which is
 * accurate even when the absolute gas number from the same response is
 * not). Adds the gas-token-specific fee-payer transfer overhead.
 */
export const convertGasToGasTokenAmount = ({
    totalGasNoFeePayer,
    gasToken,
    estimationResponse,
}: {
    totalGasNoFeePayer: number;
    gasToken: GasTokenType;
    estimationResponse: EstimationResponse;
}): number => {
    const totalGas =
        totalGasNoFeePayer +
        GENERIC_DELEGATOR_FEE_PAYER_OVERHEAD_GAS[gasToken];

    let gasTokenPerGas = 0;
    if (
        estimationResponse.transactionCost &&
        estimationResponse.estimatedGas &&
        estimationResponse.estimatedGas > 0
    ) {
        gasTokenPerGas =
            estimationResponse.transactionCost /
            estimationResponse.estimatedGas;
    } else if (estimationResponse.vthoPerGasAtSpeed) {
        const rate = estimationResponse.rate ?? 1;
        const serviceFee = estimationResponse.serviceFee ?? 0;
        gasTokenPerGas =
            estimationResponse.vthoPerGasAtSpeed * rate * (1 + serviceFee);
    }

    if (!gasTokenPerGas || gasTokenPerGas <= 0) {
        return 0;
    }

    return totalGas * gasTokenPerGas;
};

/**
 * Compute the gas-token amount the smart account must transfer to the
 * generic delegator's deposit account to cover the transaction.
 *
 * The delegator's `/estimate/clauses` endpoint simulates the user's raw
 * clauses as if executed directly by the smart account, with no
 * `executeWithAuthorization` wrapper and no embedded-wallet signature, so
 * it under-estimates (and for NFT-heavy clauses can revert outright). We
 * trust its **rate** information (the gas-token-per-gas ratio is just a
 * market price and doesn't depend on the gas amount) but recompute the
 * gas number locally — including the wrapper overhead, fee-payer overhead,
 * and a 10% safety multiplier — and reapply the rate.
 */
export const computeCorrectedGasTokenCost = async ({
    thor,
    clauses,
    smartAccountAddress,
    version,
    estimationResponse,
    gasToken,
    timeoutMs,
}: {
    thor: ThorClient;
    clauses: TransactionClause[];
    smartAccountAddress: string;
    version: number;
    estimationResponse: EstimationResponse;
    gasToken: GasTokenType;
    timeoutMs?: number;
}): Promise<number> => {
    const fallbackCost = (estimationResponse.transactionCost ?? 0) * 2;

    const totalGasNoFeePayer = await computeCorrectedTotalGasNoFeePayer({
        thor,
        clauses,
        smartAccountAddress,
        version,
        timeoutMs,
    });
    if (totalGasNoFeePayer === null) {
        return fallbackCost;
    }

    const cost = convertGasToGasTokenAmount({
        totalGasNoFeePayer,
        gasToken,
        estimationResponse,
    });
    return cost > 0 ? cost : fallbackCost;
};

/**
 * Sign the final transaction with the given private key and signature
 * returned by the generic delegator.
 * @param decodedTx The decoded transaction returned by the generic delegator.
 * @param gasPayerSignature The signature returned by the generic delegator.
 * @returns The signed final transaction.
 */
export function signVip191Transaction(decodedTx: Transaction, gasPayerSignature: string) {
    return Transaction.of(
        decodedTx.body,
        nc_utils.concatBytes(
            decodedTx.signature ?? new Uint8Array(),
            HexUInt.of(gasPayerSignature.slice(2)).bytes
        )
    )
}

export function decodeRawTx(raw: any, isSigned: boolean) {
    return Transaction.decode(
        HexUInt.of(raw.slice(2)).bytes,
        isSigned
    );
}

/**
 * This function is used to send a transaction using the generic delegator.
 * It will build the necessary clauses, estimate the gas, and send the transaction.
 * @param clauses The clauses to send in the transaction.
 * @param genericDelegatorUrl The URL of the generic delegator.
 * @returns
 */
export const useGenericDelegator = () => {
    const { connectedWallet } = useWallet();
    const { data: smartAccount } = useSmartAccount(
        connectedWallet?.address ?? '',
    );
    const { data: smartAccountVersion } = useGetAccountVersion(
        smartAccount?.address ?? '',
        connectedWallet?.address ?? '',
    );
    const { preferences } = useGasTokenSelection();
    const ERC20Interface = IERC20__factory.createInterface();
    const { network } = useVeChainKitConfig();
    const { buildClausesWithAuth } = useBuildClauses();
    const thor = ThorClient.at(getConfig(network.type).nodeUrl);

    const sendTransactionUsingGenericDelegator = useCallback(async ({
        clauses,
        genericDelegatorUrl
    }: {
        clauses: TransactionClause[];
        genericDelegatorUrl: string;
    }): Promise<string> => {
        try {
            const gasToken = preferences.gasTokenToUse;
            const gasEstimationResponse: EstimationResponse = await estimateGas(
                smartAccount?.address ?? '',
                genericDelegatorUrl,
                clauses as TransactionClause[],
                gasToken,
                'medium',
            );

            const depositAccount: DepositAccount = await getDepositAccount(genericDelegatorUrl);

            const correctedTransactionCost = await computeCorrectedGasTokenCost({
                thor,
                clauses,
                smartAccountAddress: smartAccount?.address ?? '',
                version: smartAccountVersion?.version ?? 0,
                estimationResponse: gasEstimationResponse,
                gasToken,
            });

            const transferAmountWei = parseEther(
                correctedTransactionCost.toString(),
            ).toString();

            const transferToGenericDelegatorClause = {
                to: gasToken === 'VET'
                    ? depositAccount.depositAccount
                    : SUPPORTED_GAS_TOKENS[gasToken as GasTokenType].address,
                value: gasToken === 'VET' ? transferAmountWei : '0x0',
                data: gasToken === 'VET'
                    ? '0x'
                    : ERC20Interface.encodeFunctionData('transfer', [
                          depositAccount.depositAccount,
                          transferAmountWei,
                      ]),
                comment: `Transfer ${correctedTransactionCost} ${gasToken} to ${depositAccount.depositAccount}`,
                abi: gasToken === 'VET' ? undefined : ERC20Interface.getFunction('transfer'),
            };

            const finalExecuteWithAuthorizationClauses = await buildClausesWithAuth({
                clauses: [...clauses, transferToGenericDelegatorClause as TransactionClause],
                smartAccount: smartAccount as SmartAccountReturnType,
                version: smartAccountVersion?.version ?? 0,
            });

            const txBody = await estimateAndBuildTxBody(
                finalExecuteWithAuthorizationClauses as TransactionClause[],
                thor,
                randomTransactionUser,
                true
            );

            const rawSignedTx = await Transaction.of(txBody).signAsSender(HexUInt.of(randomTransactionUser.privateKey).bytes);

            const encodedSignedTx = HexUInt.of(rawSignedTx.encoded).toString()

            const gasPayerResponse: {
                signature: string;
                address: string;
                raw: string;
                origin: string;
            } = await delegateAuthorized(encodedSignedTx, randomTransactionUser.address, gasToken, genericDelegatorUrl);

            const finalTxSigned = signVip191Transaction(rawSignedTx, gasPayerResponse.signature);

            const simulatedTransaction = {
                clauses: finalExecuteWithAuthorizationClauses as TransactionClause[],
                simulateTransactionOptions: {
                    caller: randomTransactionUser.address ?? '',
                    gasPayer: gasPayerResponse.address,
                }
            };

            const simulatedTx1 = await thor.transactions.simulateTransaction(
                simulatedTransaction.clauses,
                {
                    ...simulatedTransaction.simulateTransactionOptions
                }
            );

            for (let i = 0; i < simulatedTx1.length; i++) {
                if (simulatedTx1[i].reverted) {
                    throw new Error(simulatedTx1[i].vmError);
                }
            }
            // Send the transaction
            const sendTransactionResult = await thor.transactions.sendTransaction(finalTxSigned);

            return sendTransactionResult.id;
        } catch (error) {
            console.error('Error sending transaction using generic delegator', error);
        }
        throw new Error('Failed to send transaction using generic delegator, no gas tokens have sufficient balance or are enabled in Gas Token Preferences');
    }, [
        preferences,
        smartAccount,
        smartAccountVersion,
        buildClausesWithAuth,
        thor,
        randomTransactionUser,
    ]);
    return {
        sendTransactionUsingGenericDelegator,
    };
}
````

## Source: `packages/vechain-kit/src/hooks/generic-delegator/useGenericDelegatorFeeEstimation.ts`

````typescript
import { useQuery } from '@tanstack/react-query';
import { EstimationResponse } from '@/types/gasEstimation';
import { EnhancedClause, GasTokenType } from '@/types';
import {
    useSmartAccount,
    useWallet,
    estimateGas,
    useTokenBalances,
    useGasTokenSelection,
    useGetAccountVersion,
    computeCorrectedTotalGasNoFeePayer,
    convertGasToGasTokenAmount,
} from '@/hooks';
import { useVeChainKitConfig } from '@/providers';
import { TransactionClause } from '@vechain/sdk-core';
import { ThorClient } from '@vechain/sdk-network';
import { getConfig } from '@/config';

export interface useGenericDelegatorFeeEstimationParams {
    clauses: EnhancedClause[];
    enabled?: boolean;
    tokens: string[]; // Array of tokens to try in order
    sendingAmount?: string; // Amount being sent
    sendingTokenSymbol?: string; // Symbol of token being sent
}

export const useGenericDelegatorFeeEstimation = ({
    clauses,
    enabled = true,
    tokens,
    sendingAmount,
    sendingTokenSymbol,
}: useGenericDelegatorFeeEstimationParams) => {
    const { connectedWallet, account } = useWallet();
    const { data: smartAccount } = useSmartAccount(
        connectedWallet?.address ?? '',
    );
    const { data: smartAccountVersion } = useGetAccountVersion(
        smartAccount?.address ?? '',
        connectedWallet?.address ?? '',
    );
    const { feeDelegation, network } = useVeChainKitConfig();
    const { balances } = useTokenBalances(account?.address ?? '');
    const { updatePreferences } = useGasTokenSelection();
    const thor = ThorClient.at(getConfig(network.type).nodeUrl);
    // Only include essential data in query key to prevent unnecessary refetches
    const queryKey = ['gas-estimation', JSON.stringify(clauses), JSON.stringify(tokens), sendingAmount, sendingTokenSymbol];

    return useQuery<EstimationResponse & { usedToken: string }, Error>({
        queryKey,
        queryFn: async () => {
            // Run the local Thor gas estimate ONCE — the gas number is
            // token-agnostic so we shouldn't pay for it inside the loop.
            // Bounded by a timeout so a slow / unreachable node can't
            // hang the fee-estimation UI forever; on timeout/failure each
            // token falls back to a delegator-derived value.
            const totalGasNoFeePayer = await computeCorrectedTotalGasNoFeePayer({
                thor,
                clauses: clauses as TransactionClause[],
                smartAccountAddress: smartAccount?.address ?? '',
                version: smartAccountVersion?.version ?? 0,
            });

            let lastError: Error | null = null;
            // Try each token in sequence until one succeeds AND has sufficient balance
            for (const token of tokens) {
                try {
                    const estimation = await estimateGas(
                        smartAccount?.address ?? '',
                        feeDelegation?.genericDelegatorUrl ?? '',
                        clauses as TransactionClause[],
                        token as GasTokenType,
                        'medium',
                    );
                    // The delegator's `transactionCost` is computed from a
                    // simulation that omits the smart-account auth wrapper
                    // and can underestimate (or revert outright). Reapply the
                    // delegator's per-gas rate to our locally-estimated gas
                    // number so the UI agrees with the actual send path.
                    const gasCost =
                        totalGasNoFeePayer !== null
                            ? convertGasToGasTokenAmount({
                                  totalGasNoFeePayer,
                                  gasToken: token as GasTokenType,
                                  estimationResponse: estimation,
                              })
                            : (estimation.transactionCost ?? 0) * 2;
                    const tokenBalance = Number(balances.find(t => t.symbol === token)?.balance || 0);
                    // If sending the same token as gas token, need balance for both
                    // If no sendingAmount is provided, we're only checking for gas fees
                    const additionalAmount = (sendingAmount && sendingTokenSymbol && token === sendingTokenSymbol)
                        ? Number(sendingAmount)
                        : 0;
                    const requiredBalance = gasCost + additionalAmount;

                    if (tokenBalance >= requiredBalance) {
                        // Has enough balance, return this token
                        updatePreferences({ gasTokenToUse: token as GasTokenType });
                        return { ...estimation, transactionCost: gasCost, usedToken: token };
                    }
                    // Not enough balance, try next token
                    lastError = new Error(`Insufficient ${token} balance: has ${tokenBalance}, needs ${requiredBalance}`);
                } catch (error) {
                    lastError = error as Error;
                }
            }
            throw lastError || new Error('All gas tokens failed estimation or have insufficient balance');
        },
        enabled: enabled && clauses.length > 0 && !!smartAccount?.address && !!feeDelegation?.genericDelegatorUrl && tokens.length > 0 && balances.length > 0,
        staleTime: 30 * 1000,
        gcTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,
        retry: false,
        retryDelay: 1000,
    });
};
````

## Source: `packages/vechain-kit/src/hooks/login/useConnectWithDappKitSource.ts`

````typescript
import { WalletSource } from '@vechain/dapp-kit';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDAppKitWallet, useDAppKitWalletModal } from '@/hooks';
import { isRejectionError } from '@/utils/stringUtils';
import type { ConnectModalContentsTypes } from '@/components';

type SetCurrentContent = React.Dispatch<
    React.SetStateAction<ConnectModalContentsTypes>
>;

const sourceDisplayName: Record<WalletSource, string> = {
    veworld: 'VeWorld',
    sync2: 'Sync2',
    sync: 'Sync',
    'wallet-connect': 'WalletConnect',
};

/**
 * VeWorld Universal Link entry point. Hitting this URL on a phone with
 * VeWorld installed opens the dApp inside VeWorld's in-app browser; on
 * desktop or on a phone without the app it lands on the install page.
 * Mirrors the fallback used by dapp-kit-ui's ConnectModal when
 * `window.vechain` is missing.
 */
const VEWORLD_UNIVERSAL_LINK = 'https://www.veworld.com/discover/browser/ul/';

const extractErrorMessage = (err: unknown): string => {
    if (typeof err === 'string') return err;
    if (err instanceof Error) return err.message;
    if (err && typeof err === 'object') {
        const maybe = err as { message?: unknown; reason?: unknown };
        if (typeof maybe.message === 'string') return maybe.message;
        if (typeof maybe.reason === 'string') return maybe.reason;
        try {
            return JSON.stringify(err);
        } catch {
            return '';
        }
    }
    return '';
};

/**
 * Drives a dapp-kit wallet connection (setSource + connect) while reflecting
 * progress in the ConnectModal's local sub-content state (loading/error).
 */
export const useConnectWithDappKitSource = (
    source: WalletSource,
    setCurrentContent: SetCurrentContent,
) => {
    const { t } = useTranslation();
    const {
        setSource,
        connect: connectV1,
        connectV2,
    } = useDAppKitWallet();
    const { close: closeDappKitModal } = useDAppKitWalletModal();

    const connect = useCallback(async () => {
        const displayName = sourceDisplayName[source] ?? source;

        const tryAgain = () => {
            void connect();
        };

        // When VeWorld is selected but the extension isn't injected, fall
        // back to the Universal Link — opens the dApp inside VeWorld mobile
        // on phones, the install page on desktop. Same behavior as
        // dapp-kit-ui's ConnectModal.
        if (
            source === 'veworld' &&
            typeof window !== 'undefined' &&
            !window.vechain
        ) {
            window.open(
                `${VEWORLD_UNIVERSAL_LINK}${encodeURIComponent(
                    window.location.href,
                )}`,
                '_self',
            );
            return;
        }

        setCurrentContent({
            type: 'loading',
            props: {
                title: `${t('Connecting with')} ${displayName}`,
                // Hint copy below the "Waiting for signature…" headline.
                // Different message for WC since the wallet may live on a
                // different device — user has to scan first.
                loadingText:
                    source === 'wallet-connect'
                        ? t('Scan the QR code with your wallet to continue.')
                        : t(
                              'Open your wallet and confirm the connection request.',
                          ),
                onTryAgain: tryAgain,
            },
        });

        try {
            setSource(source);

            // ConnectModal closes automatically when useWallet flips
            // `connection.isConnected` to true.
            if (source === 'veworld') {
                await connectV2(null);
            } else {
                await connectV1();
            }

            // WalletConnect side-effect: setSource('wallet-connect') +
            // connect() causes dapp-kit's signer to call
            // CustomWalletConnectModal.openModal({uri}), which fires
            // `vdk-open-wc-qrcode` and pops dapp-kit-ui's own
            // <vdk-connect-modal> with the QR. That modal only
            // auto-closes when the user clicks through dapp-kit-ui's
            // source picker — since we drive connect from here, we have
            // to close it ourselves. If we don't, the QR modal stays up
            // post-handshake and the user's only out (clicking X) hits
            // dapp-kit-ui's `handleClose`, which calls `wallet.disconnect()`
            // whenever `walletConnectQRcode` is set — i.e. closing the
            // stuck modal disconnects the user we just connected.
            if (source === 'wallet-connect') {
                closeDappKitModal();
            }
            // Our own ConnectModal closes automatically when useWallet
            // flips `connection.isConnected` to true.
        } catch (err) {
            const errorMsg = extractErrorMessage(err);
            if (isRejectionError(errorMsg)) {
                // User dismissed the wallet prompt — drop back to the main grid.
                setCurrentContent('main');
                return;
            }
            setCurrentContent({
                type: 'error',
                props: {
                    error:
                        errorMsg ||
                        t('Failed to connect, please try again later.'),
                    onTryAgain: tryAgain,
                },
            });
        }
    }, [
        source,
        setSource,
        connectV1,
        connectV2,
        closeDappKitModal,
        setCurrentContent,
        t,
    ]);

    return { connect };
};
````

## Source: `packages/vechain-kit/src/hooks/login/useLoginWithOAuth.ts`

````typescript
import {
    useLoginWithOAuth as usePrivyLoginWithOAuth,
    useCreateWallet,
    OAuthProviderType,
} from '@privy-io/react-auth';
import { useCallback } from 'react';
import { useVeChainKitConfig } from '@/providers';
import { useLoginWithVeChain } from './useLoginWithVeChain';
import type { CrossAppLoginIntent } from '@/providers/PrivyCrossAppProvider';

interface OAuthOptions {
    provider: OAuthProviderType;
}

// Module-level variable shared across all hook instances
let hasCreatedWallet = false;

// Providers enabled in VeChain's Privy app that the whitelabel
// cross-app-connect host can handle via `useLoginWithOAuth`. Spotify /
// Instagram / LinkedIn are NOT in this set because they are disabled in
// the VeChain Privy dashboard; calling them would 4xx at the provider.
// Farcaster and WhatsApp are enabled but use different login flows.
const CROSS_APP_INTENT_PROVIDERS = new Set<OAuthProviderType>([
    'google',
    'apple',
    'twitter',
    'discord',
    'github',
    'tiktok',
    'line',
]);

export const useLoginWithOAuth = () => {
    const { privy } = useVeChainKitConfig();
    const { createWallet } = useCreateWallet();
    const { login: loginViaCrossApp } = useLoginWithVeChain();

    // Memoize the onComplete callback to prevent recreation on every render
    const handleComplete = useCallback(
        async ({ isNewUser }: { isNewUser: boolean }) => {
            // When using initOAuth Privy does not create an embedded wallet automatically.
            // So we need to create a wallet manually.
            if (isNewUser && !hasCreatedWallet) {
                // Set the flag BEFORE the async operation to prevent race conditions
                hasCreatedWallet = true;

                try {
                    await createWallet();
                } catch (error) {
                    // Reset flag on error so it can be retried
                    hasCreatedWallet = false;
                    console.error('Failed to create wallet:', error);
                    throw error;
                }
            }
        },
        [createWallet],
    );

    const { initOAuth: privyInitOAuth } = usePrivyLoginWithOAuth({
        onComplete: handleComplete,
    });

    const initOAuth = async ({ provider }: OAuthOptions) => {
        // When the consumer dApp doesn't supply a `privy` prop, route
        // supported OAuth providers through the VeChain whitelabel cross-app
        // flow instead of Privy directly (whose dummy app id can't service
        // a real OAuth handshake).
        if (!privy) {
            if (CROSS_APP_INTENT_PROVIDERS.has(provider)) {
                await loginViaCrossApp({
                    intent: provider as CrossAppLoginIntent,
                });
                return;
            }
            throw new Error(
                `OAuth provider "${provider}" requires a Privy configuration. ` +
                    `Supported without Privy via the VeChain whitelabel host: ` +
                    `${[...CROSS_APP_INTENT_PROVIDERS].join(', ')}.`,
            );
        }

        await privyInitOAuth({ provider });
    };

    return { initOAuth };
};
````

## Source: `packages/vechain-kit/src/hooks/login/useLoginWithPasskey.ts`

````typescript
import { useLoginWithPasskey as usePrivyLoginWithPasskey } from '@privy-io/react-auth';

export const useLoginWithPasskey = () => {
    const { loginWithPasskey: privyLoginWithPasskey } =
        usePrivyLoginWithPasskey();

    const loginWithPasskey = async () => {
        try {
            await privyLoginWithPasskey();
        } catch (error) {
            throw error;
        }
    };

    return { loginWithPasskey };
};
````

## Source: `packages/vechain-kit/src/hooks/login/useLoginWithVeChain.ts`

````typescript
import {
    usePrivyCrossAppSdk,
    type CrossAppLoginIntent,
} from '@/providers/PrivyCrossAppProvider';

export type { CrossAppLoginIntent };
import { useCrossAppConnectionCache } from '@/hooks/cache/useCrossAppConnectionCache';
import { useFetchAppInfo } from '@/hooks';
import { VECHAIN_PRIVY_APP_ID } from '@/utils';
import { handlePopupError } from '@/utils/handlePopupError';
import { VEBETTERDAO_GOVERNANCE_BASE_URL } from '@/constants';

export type UseLoginWithVeChainOptions = {
    /**
     * Pre-select a login method on the VeChain whitelabel connect page.
     * When set, the user skips the provider picker and jumps straight into
     * the matching OAuth flow (or email form for `'email'`).
     */
    intent?: CrossAppLoginIntent;
};

export const useLoginWithVeChain = () => {
    const { login: loginWithVeChain } = usePrivyCrossAppSdk();
    const { setConnectionCache } = useCrossAppConnectionCache();
    const { data: appsInfo } = useFetchAppInfo([VECHAIN_PRIVY_APP_ID]);

    const login = async (options?: UseLoginWithVeChainOptions) => {
        try {
            await loginWithVeChain(VECHAIN_PRIVY_APP_ID, options);

            setConnectionCache({
                name: 'VeChain',
                logoUrl: appsInfo?.[VECHAIN_PRIVY_APP_ID]?.logo_url,
                appId: VECHAIN_PRIVY_APP_ID,
                website: VEBETTERDAO_GOVERNANCE_BASE_URL,
            });

        } catch (error) {
            throw handlePopupError({
                error,
                mobileBrowserPopupMessage:
                    "Your mobile browser blocked the login window. Please click 'Try again' to open the login window or change your browser settings.",
                rejectedMessage: 'Login request was cancelled.',
                defaultMessage:
                    'There was an unexpected issue logging in with VeChain. Please try again or contact support.',
            });
        }
    };

    return { login };
};
````

## Source: `packages/vechain-kit/src/hooks/signing/useSignMessage.ts`

````typescript
'use client';

import { useCallback, useState } from 'react';
import { usePrivyWalletProvider } from '@/providers';
import { useWallet } from '@/hooks';
import { useWallet as useDappKitWallet } from '@vechain/dapp-kit-react';

type UseSignMessageReturnValue = {
    signMessage: (message: string) => Promise<string>;
    isSigningPending: boolean;
    signature: string | null;
    error: Error | null;
    reset: () => void;
};

/**
 * Hook to sign messages using the connected wallet.
 * Supports both Privy and VeChain wallets.
 *
 * @returns {UseSignMessageReturnValue} Object containing the signing function and status
 */
export const useSignMessage = (): UseSignMessageReturnValue => {
    const [isSigningPending, setIsSigningPending] = useState(false);
    const [signature, setSignature] = useState<string | null>(null);
    const [error, setError] = useState<Error | null>(null);

    const { connection, account } = useWallet();
    const { requestCertificate } = useDappKitWallet();
    const privyWalletProvider = usePrivyWalletProvider();

    const signMessage = useCallback(
        async (message: string): Promise<string> => {
            if (!account) throw new Error('Account not found');

            setIsSigningPending(true);
            setError(null);
            setSignature(null);

            try {
                let sig: string | null = null;

                if (connection.isConnectedWithDappKit) {
                    const certResponse = await requestCertificate(
                        {
                            purpose: 'agreement',
                            payload: {
                                type: 'text',
                                content: message,
                            },
                        },
                        {
                            signer: account.address,
                        },
                    );

                    sig = certResponse.signature;
                } else {
                    sig = await privyWalletProvider.signMessage(message);
                }

                setSignature(sig);
                return sig;
            } catch (err) {
                const error =
                    err instanceof Error ? err : new Error(String(err));
                setError(error);
                throw error;
            } finally {
                setIsSigningPending(false);
            }
        },
        [connection, privyWalletProvider, account?.address],
    );

    const reset = useCallback(() => {
        setIsSigningPending(false);
        setSignature(null);
        setError(null);
    }, []);

    return {
        signMessage,
        isSigningPending,
        signature,
        error,
        reset,
    };
};
````

## Source: `packages/vechain-kit/src/hooks/signing/useSignTypedData.ts`

````typescript
'use client';

// TODO: investigate signTypedData support in VeWorld in-app browser
import { useCallback, useState } from 'react';
import { SignTypedDataParams } from '@privy-io/react-auth';
import { usePrivyWalletProvider } from '@/providers';
import { useWallet, useDAppKitWallet } from '@/hooks';
import { SignTypedDataOptions, TypedDataDomain } from '@vechain/sdk-network';

type UseSignTypedDataReturnValue = {
    signTypedData: (
        data: SignTypedDataParams,
        options?: { signer?: string },
    ) => Promise<string>;
    isSigningPending: boolean;
    signature: string | null;
    error: Error | null;
    reset: () => void;
};

/**
 * Hook to sign typed data using the connected wallet.
 * Supports both Privy and VeChain wallets.
 *
 * @returns {UseSignTypedDataReturnValue} Object containing the signing function and status
 */
export const useSignTypedData = (): UseSignTypedDataReturnValue => {
    const [isSigningPending, setIsSigningPending] = useState(false);
    const [signature, setSignature] = useState<string | null>(null);
    const [error, setError] = useState<Error | null>(null);

    const { signer } = useDAppKitWallet();
    const { connection } = useWallet();
    const privyWalletProvider = usePrivyWalletProvider();

    const signTypedData = useCallback(
        async (
            data: SignTypedDataParams,
            options?: SignTypedDataOptions,
        ): Promise<string> => {
            setIsSigningPending(true);
            setError(null);
            setSignature(null);

            try {
                let sig: string;
                if (connection.isConnectedWithDappKit) {
                    const domain = {
                        ...data.domain,
                        salt: data.domain?.salt
                            ? Buffer.from(data.domain.salt).toString('hex')
                            : undefined,
                    } as TypedDataDomain;

                    sig = await signer.signTypedData(
                        domain,
                        data.types,
                        data.message,
                        undefined,
                        options,
                    );
                } else {
                    sig = await privyWalletProvider.signTypedData(data);
                }

                setSignature(sig);
                return sig;
            } catch (err) {
                // Handle user rejection specifically
                if (
                    err &&
                    typeof err === 'object' &&
                    'statusCode' in err &&
                    (err as any).statusCode === 4001
                ) {
                    const userRejectionError = new Error(
                        'User denied signature request',
                    );
                    setError(userRejectionError);
                    throw userRejectionError;
                }

                // Handle other errors
                const error =
                    err instanceof Error
                        ? err
                        : new Error(
                              typeof err === 'object'
                                  ? JSON.stringify(err)
                                  : String(err),
                          );
                console.error(error);
                setError(error);
                throw error;
            } finally {
                setIsSigningPending(false);
            }
        },
        [connection, privyWalletProvider],
    );

    const reset = useCallback(() => {
        setIsSigningPending(false);
        setSignature(null);
        setError(null);
    }, []);

    return {
        signTypedData,
        isSigningPending,
        signature,
        error,
        reset,
    };
};
````

## Source: `packages/vechain-kit/src/providers/CrossAppErrorRecovery.tsx`

````tsx
'use client';

import { useEffect, useRef } from 'react';
import { useWallet } from '@/hooks/api/wallet/useWallet';
import { useModal } from './ModalProvider';

/**
 * Listens for `vk:cross-app-no-connection` postMessages from the cross-app
 * popup host. When the host can't decrypt an incoming request because Privy
 * has no matching connection record (TTL expired, or the user/account never
 * connected), it notifies the opener via this message. The kit responds by
 * disconnecting the stale session and opening the connect modal so the user
 * can re-establish a fresh connection in one tap — the retry would otherwise
 * keep failing with the same dead keys.
 *
 * Mounts as a render-less child of ModalProvider so it has access to both
 * `useWallet().disconnect` and `useModal().openConnectModal`. Uses a ref to
 * keep the listener installed for the lifetime of the component instead of
 * tearing it down on every render of `useWallet` (whose returned callbacks
 * lose identity frequently as auth state shifts) — that would risk losing
 * the popup's message during a remove/install gap.
 */
export function CrossAppErrorRecovery() {
    const { disconnect } = useWallet();
    const { openConnectModal } = useModal();

    const handlerRef = useRef<(event: MessageEvent) => void>(() => {});
    handlerRef.current = (event) => {
        // Trust only same-origin messages. The kit dispatches the recovery
        // event to itself from PrivyCrossAppProvider's signTypedData /
        // signMessage catch when Privy's SDK has already routed the popup's
        // PRIVY_CROSS_APP_ACTION_ERROR through the normal channel — so the
        // happy path always goes through self-origin. Cross-origin frames
        // (e.g. an embedded ad or a hostile iframe) can't fake this to
        // force a logout + modal reopen on the user.
        if (
            typeof window !== 'undefined' &&
            event.origin !== window.location.origin
        ) {
            return;
        }
        const type = (event.data as { type?: unknown } | null)?.type;
        if (type !== 'vk:cross-app-no-connection') return;
        void (async () => {
            try {
                await disconnect();
            } catch {
                /* disconnect best-effort; modal still opens */
            }
            openConnectModal();
        })();
    };

    useEffect(() => {
        function bridge(event: MessageEvent) {
            handlerRef.current(event);
        }
        window.addEventListener('message', bridge);
        return () => window.removeEventListener('message', bridge);
    }, []);

    return null;
}
````

## Source: `packages/vechain-kit/src/providers/PrivyCrossAppProvider.tsx`

````tsx
import React, { useCallback, useRef, useState } from 'react';
import { toPrivyWalletConnector } from '@privy-io/cross-app-connect/rainbow-kit';
import { createPrivyCrossAppClient } from '@privy-io/cross-app-connect';
import {
    useConnect,
    useDisconnect,
    createConfig,
    useSignMessage,
    useSignTypedData,
    WagmiProvider,
    http,
    useAccount,
} from 'wagmi';
import { SignTypedDataParameters } from '@wagmi/core';
import { VECHAIN_PRIVY_APP_ID } from '../utils';
import { defineChain } from 'viem';
import { handlePopupError } from '@/utils/handlePopupError';
import { isBrowser } from '@/utils/ssrUtils';
import {
    VECHAIN_EXPLORER_BASE_URL,
    VECHAIN_MAINNET_NODE_BASE_URL,
    VECHAINSTATS_BASE_URL,
} from '@/constants';

/**
 * Login methods that requester apps can pre-select on the whitelabel
 * cross-app-connect host. When passed, the host skips its provider picker
 * and jumps straight into the matching flow.
 *
 * Matches the providers enabled in VeChain's Privy dashboard. Email is
 * intentionally excluded -- VeChain has email disabled, so the host
 * doesn't surface it. Farcaster is included but currently shows a
 * "coming soon" placeholder on the host (SIWF flow not yet wired).
 */
export type CrossAppLoginIntent =
    | 'google'
    | 'apple'
    | 'twitter'
    | 'discord'
    | 'github'
    | 'tiktok'
    | 'line'
    | 'phone'
    | 'farcaster';

export type LoginWithCrossAppOptions = {
    /** Pre-select a login method on the provider's connect page. */
    intent?: CrossAppLoginIntent;
};

// Stale-connection errors bubble up from the cross-app popup via Privy's
// PRIVY_CROSS_APP_ACTION_ERROR channel: error.message contains the raw
// SDK string. Recover by notifying the recovery listener so it can
// disconnect + reopen the connect modal — same path the popup uses when
// it can post directly to the opener. Going through a self-window event
// means we don't need a separate hook reference here (this provider
// sits above ModalProvider and can't call useModal directly).
const STALE_CONNECTION_PATTERN =
    /no connection|connection has expired|user id mismatch/i;

const appendIntent = (url: string, intent: CrossAppLoginIntent) => {
    const parsed = new URL(url);
    parsed.searchParams.set('intent', intent);
    return parsed.toString();
};

const resolveProviderConnectUrl = async (appID: string) => {
    const client = createPrivyCrossAppClient({
        providerAppId: appID,
        chains: [vechain],
    });
    return client.getProviderConnectUrl();
};

export const vechain = defineChain({
    id: '1176455790972829965191905223412607679856028701100105089447013101863' as unknown as number,
    name: 'Vechain',
    nativeCurrency: { name: 'VeChain', symbol: 'VET', decimals: 18 },
    rpcUrls: {
        default: {
            http: [VECHAIN_MAINNET_NODE_BASE_URL],
        },
    },
    blockExplorers: {
        default: {
            name: 'Vechain Explorer',
            url: VECHAIN_EXPLORER_BASE_URL,
        },
        vechainStats: {
            name: 'Vechain Stats',
            url: VECHAINSTATS_BASE_URL,
        },
    },
});

export const vechainConnector = () => {
    return toPrivyWalletConnector({
        id: VECHAIN_PRIVY_APP_ID,
        name: 'VeChain',
        iconUrl:
            'https://imagedelivery.net/oHBRUd2clqykxgDWmeAyLg/661dd77c-2f9d-40e7-baa1-f4e24fd7bf00/icon',
        smartWalletMode: false,
    });
};

interface PrivyCrossAppProviderProps {
    privyEcosystemAppIDS: string[];
    children: React.ReactNode;
}

export const PrivyCrossAppProvider = ({
    privyEcosystemAppIDS,
    children,
}: PrivyCrossAppProviderProps) => {
    // Use useRef to store the config to prevent recreation on re-renders
    const wagmiConfigRef = useRef(
        createConfig({
            chains: [vechain],
            ssr: true,
            connectors: [
                vechainConnector(),
                ...privyEcosystemAppIDS.map((appId) =>
                    toPrivyWalletConnector({
                        id: appId,
                        name: '',
                        iconUrl: '',
                    }),
                ),
            ],
            transports: { [vechain.id]: http() },
            multiInjectedProviderDiscovery: false,
        }),
    );

    return (
        <WagmiProvider config={wagmiConfigRef.current}>
            {children}
        </WagmiProvider>
    );
};

export const usePrivyCrossAppSdk = () => {
    const { connectAsync, connectors } = useConnect();
    const { signTypedDataAsync } = useSignTypedData();
    const { signMessageAsync } = useSignMessage();
    const { disconnectAsync } = useDisconnect();
    const { isConnected } = useAccount();

    // Add local state to track connection
    const [isConnecting, setIsConnecting] = useState(false);
    const [connectionError, setConnectionError] = useState<Error | null>(null);

    const logout = useCallback(async () => {
        try {
            if (isConnected) {
                await disconnectAsync();
                // Force a state update after disconnect
                if (isBrowser()) {
                    window.dispatchEvent(new Event('wallet_disconnected'));
                }
            }
        } catch (error) {
            console.error('Error during logout:', error);
            throw error;
        }
    }, [disconnectAsync, isConnected]);

    const login = useCallback(
        async (appID: string, options?: LoginWithCrossAppOptions) => {
            try {
                setIsConnecting(true);
                setConnectionError(null);

                const resolvedAppId = appID || VECHAIN_PRIVY_APP_ID;

                if (options?.intent) {
                    // Resolve the registered whitelabel connect URL via the
                    // Privy backend and append intent. This avoids hardcoding
                    // the whitelabel domain in the kit.
                    const baseUrl = await resolveProviderConnectUrl(
                        resolvedAppId,
                    );
                    const overrideConnectUrl = appendIntent(
                        baseUrl,
                        options.intent,
                    );
                    const customConnector = toPrivyWalletConnector({
                        id: resolvedAppId,
                        name:
                            resolvedAppId === VECHAIN_PRIVY_APP_ID
                                ? 'VeChain'
                                : '',
                        iconUrl: '',
                        overrideConnectUrl,
                    });
                    return await connectAsync({ connector: customConnector });
                }

                const connector = connectors.find(
                    (c) => c.id === resolvedAppId,
                );
                if (!connector) {
                    throw new Error('Connector not found');
                }

                return await connectAsync({ connector });
            } catch (error) {
                setConnectionError(error as Error);
                throw error;
            } finally {
                setIsConnecting(false);
            }
        },
        [connectAsync, connectors],
    );

    const signMessage = useCallback(
        async (message: string) => {
            try {
                return await signMessageAsync({ message });
            } catch (error) {
                if (
                    error instanceof Error &&
                    STALE_CONNECTION_PATTERN.test(error.message) &&
                    typeof window !== 'undefined'
                ) {
                    window.postMessage(
                        { type: 'vk:cross-app-no-connection' },
                        window.location.origin,
                    );
                }
                throw handlePopupError({
                    error,
                    mobileBrowserPopupMessage:
                        "Your mobile browser blocked the signing window. Please click 'Try again' to open the signing window or change your browser settings.",
                    rejectedMessage: 'Signing request was cancelled.',
                    defaultMessage:
                        'An unexpected issue occurred while signing a message. Please try again or contact support.',
                });
            }
        },
        [signMessageAsync],
    );

    const signTypedData = useCallback(
        async (data: SignTypedDataParameters) => {
            try {
                return await signTypedDataAsync(data);
            } catch (error) {
                if (
                    error instanceof Error &&
                    STALE_CONNECTION_PATTERN.test(error.message) &&
                    typeof window !== 'undefined'
                ) {
                    window.postMessage(
                        { type: 'vk:cross-app-no-connection' },
                        window.location.origin,
                    );
                }
                const errorType = handlePopupError({
                    error,
                    mobileBrowserPopupMessage:
                        "Your mobile browser blocked the signing window. Please click 'Try again' to open the signing window or change your browser settings.",
                    rejectedMessage: 'Signing request was cancelled.',
                    defaultMessage:
                        'An unexpected issue occurred while signing typed data. Please try again or contact support.',
                });
                throw errorType;
            }
        },
        [signTypedDataAsync],
    );

    return {
        login,
        logout,
        signMessage,
        signTypedData,
        isConnecting,
        connectionError,
    };
};
````

## Source: `packages/vechain-kit/src/providers/PrivyWalletProvider.tsx`

````tsx
'use client';

import React, { createContext, useContext, useCallback } from 'react';
import { SignTypedDataParams, usePrivy } from '@privy-io/react-auth';
import { TransactionBody, TransactionClause } from '@vechain/sdk-core';
import {
    ThorClient,
    VeChainProvider,
    ProviderInternalBaseWallet,
    signerUtils,
} from '@vechain/sdk-network';
import { getGenericDelegatorUrl, randomTransactionUser } from '../utils';
import {
    GasTokenType,
    TransactionSpeed,
} from '@/types';
import {
    useSmartAccount,
    useWallet,
    useGenericDelegator,
    useHasV1SmartAccount,
    SmartAccountReturnType,
    estimateAndBuildTxBody,
    useBuildClauses,
    useGetAccountVersion,
} from '@/hooks';
import { getConfig } from '@/config';
import { useVeChainKitConfig } from './VeChainKitProvider';
import { usePrivyCrossAppSdk } from './PrivyCrossAppProvider';
import { SignTypedDataParameters } from '@wagmi/core';

export interface PrivyWalletProviderContextType {
    accountFactory: string;
    delegateAllTransactions: boolean;
    sendTransaction: (tx: {
        txClauses: TransactionClause[];
        title?: string;
        description?: string;
        buttonText?: string;
        currentGasToken?: GasTokenType;
        delegationUrl?: string;
    }) => Promise<string>;
    signTypedData: (data: SignTypedDataParams) => Promise<string>;
    signMessage: (message: string) => Promise<string>;
    exportWallet: () => Promise<void>;
}

const PrivyWalletProviderContext =
    createContext<PrivyWalletProviderContextType | null>(null);

/**
 * This provider is responsible for retrieving the smart account address
 * of a Privy wallet and providing the necessary context for the smart account.
 * Upon initialization this provider will execute a few useEffect hooks to:
 * - retrieve the smart account address of the embedded wallet
 * - retrieve the chain id
 * - check if the smart account is deployed
 *
 * It also provides a function to send transactions on vechain by asking the privy wallet
 * to sign the transaction and then forwarding the transaction to the node api.
 * When sending a transaction this provider will check if the smart account is deployed and if not,
 * it will deploy it.
 */
export const PrivyWalletProvider = ({
    children,
    nodeUrl,
    delegatorUrl = getGenericDelegatorUrl(),
    delegateAllTransactions,
    genericDelegator,
}: {
    children: React.ReactNode;
    nodeUrl: string;
    delegatorUrl?: string;
    delegateAllTransactions: boolean;
    genericDelegator?: boolean;
}) => {
    const {
        signTypedData: signTypedDataPrivy,
        exportWallet,
        signMessage: signMessagePrivy,
    } = usePrivy();
    const {
        signTypedData: signTypedDataWithCrossApp,
        signMessage: signMessageWithCrossApp,
    } = usePrivyCrossAppSdk();
    const { connection, connectedWallet } = useWallet();
    const { network } = useVeChainKitConfig();
    const { data: smartAccount } = useSmartAccount(
        connectedWallet?.address ?? '',
    );
    const { data: smartAccountVersion } = useGetAccountVersion(
        smartAccount?.address ?? '',
        connectedWallet?.address ?? '',
    );
    const { data: hasV1SmartAccount } = useHasV1SmartAccount(
        connectedWallet?.address ?? '',
    );
    const { buildClausesWithAuth } = useBuildClauses();
    const { sendTransactionUsingGenericDelegator } = useGenericDelegator();

    const thor = ThorClient.at(nodeUrl);

    // Helper to sign and send transaction for regular fee delegation transactions
    const signAndSend = async (
        txBody: TransactionBody,
        delegationUrl?: string,
        walletOverride?: any,
        signerOverride?: any
    ) => {
        if (!smartAccount?.address) {
            throw new Error('Smart account address is not set');
        }

        const walletToUse = walletOverride ?? new ProviderInternalBaseWallet(
            [
                {
                    privateKey: Buffer.from(
                        randomTransactionUser.privateKey.slice(2),
                        'hex',
                    ),
                    address: randomTransactionUser.address,
                },
            ],
            { gasPayer: { gasPayerServiceUrl: delegationUrl ?? delegatorUrl } },
        );
        const provider = new VeChainProvider(
            thor,
            walletToUse,
            true
        );
        const signer = signerOverride ?? await provider.getSigner(
            randomTransactionUser.address,
        );
        const txInput = signerUtils.transactionBodyToTransactionRequestInput(
            txBody,
            randomTransactionUser.address,
        );
        const rawDelegateSigned = await signer.signTransaction(txInput);

        // publish the hexlified signed transaction directly on the node api
        const transactionsUrl = new URL('transactions', nodeUrl);
        const { id } = (await fetch(transactionsUrl, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                raw: rawDelegateSigned,
            }),
        }).then((res) => res.json())) as { id: string };

        return id;
    };

    /**
     * Sends a transaction on behalf of a smart account using either feeDelegation or genericDelegator
     * @param txClauses - The clauses to send in the transaction
     * @param title - The title of the transaction (used for the UI)
     * @param description - The description of the transaction
     * @param buttonText - The button text of the transaction (used for the UI)
     * @param currentGasToken - The current gas token for the transaction
     * @param speed - The speed of the transaction
     * @returns The id of the transaction
     **/

    const sendTransaction = useCallback(async ({
        txClauses = [],
        title = 'Sign Transaction',
        description,
        buttonText = 'Sign',
        delegationUrl,
    }: {
        txClauses: TransactionClause[];
        title?: string;
        description?: string;
        buttonText?: string;
        delegationUrl?: string;
        currentGasToken?: GasTokenType;
        speed?: TransactionSpeed;
    }): Promise<string> => {
        if (
            !smartAccount ||
            (smartAccount && !smartAccount.address) ||
            !connectedWallet ||
            (connectedWallet && !connectedWallet.address)
        ) {
            throw new Error('Address or embedded wallet is missing');
        }

        // if using generic delegator, use the useGenericDelegator hook, build the clauses, estimate the gas, build the tx body, sign and send, if dAppSponsored is undefined use the generic delegator
        if (genericDelegator && !delegationUrl) {
            return await sendTransactionUsingGenericDelegator({
                clauses: txClauses,
                genericDelegatorUrl: delegatorUrl ?? '',
            });
        }

        // else send a regular delegated transaction using the feeDelegationUrl, default to v3 if no version is found so we build the executeBatchWithAuthorization clauses, else we build the executeWithAuthorization clauses for v1 smart accounts
        const clauses = await buildClausesWithAuth({
            clauses: txClauses,
            smartAccount: smartAccount as SmartAccountReturnType,
            version: smartAccountVersion?.version ?? (hasV1SmartAccount ? 1 : 3),
            title,
            description,
            buttonText,
        });

        // set the simulated transaction options
        const simulatedTransaction = {
            clauses: clauses,
            simulateTransactionOptions: {
                caller:  randomTransactionUser.address
            }
        };

        const simulatedTx1 = await thor.transactions.simulateTransaction(
            simulatedTransaction.clauses,
            {
                ...simulatedTransaction.simulateTransactionOptions
            }
        );

        // check if the simulated transaction reverted
        for (let i = 0; i < simulatedTx1.length; i++) {
            if (simulatedTx1[i].reverted) {
                console.error(`simulatedTx1[i].vmError: ${simulatedTx1[i].vmError}`);
                return simulatedTx1[i].vmError;
            }
        }

         const txBody = await estimateAndBuildTxBody(
            clauses,
            thor,
            randomTransactionUser,
            true
        );

        return await signAndSend(
            txBody,
            delegationUrl,
        );
    }, [
        sendTransactionUsingGenericDelegator,
        genericDelegator,
        smartAccount,
        connectedWallet,
        delegatorUrl,
        buildClausesWithAuth,
        hasV1SmartAccount,
        smartAccountVersion,
        thor,
    ]);

    /**
     * Sign a message using the VechainKit wallet
     * @param message - The message to sign
     * @returns The signature of the message
     */
    const signMessage = async (message: string): Promise<string> => {
        if (connection.isConnectedWithCrossApp) {
            return await signMessageWithCrossApp(message);
        }

        return (
            await signMessagePrivy({
                message,
            })
        ).signature;
    };

    /**
     * Sign a typed data using the VechainKit wallet
     * @param data - The typed data to sign
     * @returns The signature of the typed data
     */
    const signTypedData = async (
        data: SignTypedDataParams,
    ): Promise<string> => {
        if (connection.isConnectedWithCrossApp) {
            const mutableData = {
                ...data,
                address: connectedWallet?.address as `0x${string}`,
                types: Object.fromEntries(
                    Object.entries(data.types).map(([k, v]) => [k, [...v]]),
                ),
            } as unknown as SignTypedDataParameters & {
                address: `0x${string}`;
            };
            return await signTypedDataWithCrossApp(mutableData);
        }

        return (await signTypedDataPrivy(data)).signature;
    };

    return (
        <PrivyWalletProviderContext.Provider
            value={{
                accountFactory: getConfig(network.type).accountFactoryAddress,
                sendTransaction,
                signMessage,
                signTypedData,
                exportWallet,
                delegateAllTransactions,
            }}
        >
            {children}
        </PrivyWalletProviderContext.Provider>
    );
};

export const usePrivyWalletProvider = () => {
    const context = useContext(PrivyWalletProviderContext);
    if (!context) {
        throw new Error(
            'usePrivyWalletProvider must be used within a PrivyWalletProvider',
        );
    }
    return context;
};
````
