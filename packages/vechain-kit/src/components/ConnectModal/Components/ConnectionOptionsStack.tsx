import { Grid, Stack } from '@chakra-ui/react';
import { EmailLoginButton } from './EmailLoginButton';
import { LoginWithGoogleButton } from './LoginWithGoogleButton';
import { VeChainWithPrivyLoginButton } from './VeChainWithPrivyLoginButton';
import { VeChainLoginButton } from './VeChainLoginButton';
import { PasskeyLoginButton } from './PasskeyLoginButton';
import { DappKitButton } from './DappKitButton';
import { PrivyButton } from './PrivyButton';
import { useLoginModalContent, usePrivy } from '@/hooks';
import { useVeChainKitConfig } from '@/providers';

export const ConnectionOptionsStack = () => {
    const { loginMethods, darkMode: isDark } = useVeChainKitConfig();

    // View more login
    const { login: viewMoreLogin } = usePrivy();

    const {
        showGoogleLogin,
        showEmailLogin,
        showPasskey,
        showVeChainLogin,
        showDappKit,
        showMoreLogin,
        isOfficialVeChainApp,
    } = useLoginModalContent();

    return (
        <Stack spacing={4} w={'full'} align={'center'}>
            <Grid templateColumns="repeat(4, 1fr)" gap={2} w={'full'}>
                {loginMethods?.map(({ method, gridColumn }) => {
                    switch (method) {
                        case 'email':
                            return (
                                showEmailLogin && (
                                    <EmailLoginButton key="email" />
                                )
                            );
                        case 'google':
                            return (
                                showGoogleLogin && (
                                    <LoginWithGoogleButton
                                        key="google"
                                        isDark={isDark}
                                        gridColumn={gridColumn}
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
                        case 'more':
                            return (
                                showMoreLogin && (
                                    <PrivyButton
                                        key="more"
                                        isDark={isDark}
                                        onViewMoreLogin={viewMoreLogin}
                                        gridColumn={gridColumn}
                                    />
                                )
                            );
                        default:
                            return null;
                    }
                })}
            </Grid>
        </Stack>
    );
};
