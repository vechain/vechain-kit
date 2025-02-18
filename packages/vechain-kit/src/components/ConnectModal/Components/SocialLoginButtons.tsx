import { GridItem } from '@chakra-ui/react';
import { FcGoogle } from 'react-icons/fc';
import { ConnectionButton, EmailLoginButton } from '@/components';
import { VechainKitProviderProps } from '@/providers';
import { useTranslation } from 'react-i18next';
import { useLoginWithOAuth } from '@/hooks';

type Props = {
    isDark: boolean;
    loginMethods?: VechainKitProviderProps['loginMethods'];
    gridColumn?: number;
};

export const SocialLoginButtons = ({
    isDark,
    loginMethods,
    gridColumn,
}: Props) => {
    const { t } = useTranslation();
    const { initOAuth } = useLoginWithOAuth();

    const selfHostedPrivyLoginMethods = loginMethods?.filter(
        (method) => method.method === 'email' || method.method === 'google',
    );

    return (
        <>
            {selfHostedPrivyLoginMethods?.map((loginMethod) => (
                <>
                    {loginMethod.method === 'email' && (
                        <GridItem colSpan={4} w={'full'}>
                            <EmailLoginButton />
                        </GridItem>
                    )}
                    {loginMethod.method === 'google' && (
                        <GridItem colSpan={gridColumn ?? 4} w={'full'}>
                            <ConnectionButton
                                isDark={isDark}
                                onClick={() =>
                                    initOAuth({
                                        provider: 'google',
                                    })
                                }
                                icon={FcGoogle}
                                text={t('Continue with Google')}
                            />
                        </GridItem>
                    )}
                </>
            ))}
        </>
    );
};
