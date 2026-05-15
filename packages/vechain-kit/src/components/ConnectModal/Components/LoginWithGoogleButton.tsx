import { GridItem, useToken } from '@chakra-ui/react';
import { FcGoogle } from 'react-icons/fc';
import { ConnectionButton } from '@/components';
import { useTranslation } from 'react-i18next';
import { useLoginWithOAuth, useLoginWithVeChain } from '@/hooks';
import { useVeChainKitConfig } from '@/providers';

type Props = {
    isDark: boolean;
    gridColumn?: number;
};

/** Secondary outline button — theme-driven stroke + row hover. */
export const LoginWithGoogleButton = ({ isDark, gridColumn }: Props) => {
    const { t } = useTranslation();
    const { privy } = useVeChainKitConfig();
    const { initOAuth } = useLoginWithOAuth();
    const { login: loginViaCrossApp } = useLoginWithVeChain();

    const [stroke, strokeStrong, hoverBg] = useToken('colors', [
        'vechain-kit-border-button',
        'vechain-kit-border-hover',
        'vechain-kit-button-secondary-bg',
    ]);

    return (
        <GridItem colSpan={gridColumn ?? 4} w={'full'}>
            <ConnectionButton
                isDark={isDark}
                onClick={async () => {
                    if (privy) {
                        await initOAuth({ provider: 'google' });
                    } else {
                        await loginViaCrossApp({ intent: 'google' });
                    }
                }}
                icon={FcGoogle}
                iconWidth={'24px'}
                text={t('Continue with Google')}
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
