import { Divider, GridItem, HStack, Text } from '@chakra-ui/react';
import { FcGoogle } from 'react-icons/fc';
import { ConnectionButton, EmailLoginButton } from '@/components';
import { VechainKitProps } from '@/providers';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLoginWithOAuth } from '@/hooks';

type Props = {
    isDark: boolean;
    loginModalUI: VechainKitProps['loginModalUI'];
};

export const SocialLoginButtons = ({ isDark, loginModalUI }: Props) => {
    const { t } = useTranslation();
    const { initOAuth } = useLoginWithOAuth();

    return (
        <>
            {loginModalUI?.preferredLoginMethods?.map((method, index) => (
                <React.Fragment key={method}>
                    {method === 'email' && (
                        <GridItem colSpan={4} w={'full'}>
                            <EmailLoginButton />
                        </GridItem>
                    )}
                    {method === 'google' && (
                        <GridItem colSpan={4} w={'full'}>
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

                    {index !==
                        (loginModalUI?.preferredLoginMethods?.length ?? 0) -
                            1 && (
                        <GridItem colSpan={4} w={'full'}>
                            <HStack>
                                <Divider />
                                <Text fontSize={'xs'}>or</Text>
                                <Divider />
                            </HStack>
                        </GridItem>
                    )}
                </React.Fragment>
            ))}
        </>
    );
};
