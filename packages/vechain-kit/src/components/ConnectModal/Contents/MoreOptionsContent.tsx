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
import { LuChevronRight, LuFingerprint, LuMail, LuQrCode } from 'react-icons/lu';
import { LuWallet } from 'react-icons/lu';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLoginWithEmail } from '@privy-io/react-auth';
import { ModalBackButton, StickyHeaderContainer } from '@/components/common';
import {
    useCrossAppConnectionCache,
    useFetchAppInfo,
    useLoginWithOAuth,
    useLoginWithPasskey,
    usePrivy,
    useConnectWithDappKitSource,
} from '@/hooks';
import { useVeChainKitConfig } from '@/providers';
import { usePrivyCrossAppSdk } from '@/providers/PrivyCrossAppProvider';
import { isRejectionError } from '@/utils/stringUtils';
import { VeWorldLogoLight } from '@/assets';
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
    const { privy, privyEcosystemAppIDS, dappKit, loginMethods } =
        useVeChainKitConfig();
    const { data: appsInfo, isLoading: isEcosystemAppsLoading } =
        useFetchAppInfo(privyEcosystemAppIDS);

    const { login: viewMoreLogin } = usePrivy();
    const { initOAuth } = useLoginWithOAuth();
    const { loginWithPasskey } = useLoginWithPasskey();
    const { setConnectionCache } = useCrossAppConnectionCache();
    const { login: loginWithCrossApp } = usePrivyCrossAppSdk();

    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');

    const onMainGrid = (method: string) =>
        loginMethods?.some((m) => m.method === method) ?? false;

    const allowedWallets = dappKit?.allowedWallets ?? [];
    const privyLoginMethods = (privy?.loginMethods ?? []) as readonly string[];

    const showVeWorldHere =
        allowedWallets.includes('veworld') && !onMainGrid('veworld');
    const showSync2Here =
        allowedWallets.includes('sync2') && !onMainGrid('sync2');
    const showWalletConnectHere =
        allowedWallets.includes('wallet-connect') &&
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
    const showEcosystemSection =
        !!privy && (isEcosystemAppsLoading || ecosystemApps.length > 0);

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

    const [
        stroke,
        accent,
        textPrimary,
        primaryBg,
        primaryColor,
        secondaryBg,
    ] = useToken('colors', [
        'vechain-kit-border-button',
        'vechain-kit-accent',
        'vechain-kit-text-primary',
        'vechain-kit-button-primary-bg',
        'vechain-kit-button-primary-color',
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
                                            <VeWorldLogoLight
                                                w={'20px'}
                                                h={'20px'}
                                                color={primaryColor}
                                            />
                                        }
                                        iconBg={primaryBg}
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
                                        iconBg={primaryBg}
                                        iconColor={primaryColor}
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
                                    <Button
                                        variant={'link'}
                                        size={'sm'}
                                        fontWeight={500}
                                        onClick={viewMoreLogin}
                                        alignSelf={'center'}
                                        mt={2}
                                    >
                                        {t('More options')}
                                    </Button>
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

                    {!showWalletsSection &&
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
