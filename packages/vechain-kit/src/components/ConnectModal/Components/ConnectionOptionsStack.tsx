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
