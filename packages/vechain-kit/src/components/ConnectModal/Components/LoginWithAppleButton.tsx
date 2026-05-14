import { GridItem, Icon, useToken } from '@chakra-ui/react';
import { FaApple } from 'react-icons/fa';
import { ConnectionButton } from '@/components';
import { useTranslation } from 'react-i18next';
import { useLoginWithOAuth } from '@/hooks';

type Props = {
    isDark: boolean;
    gridColumn?: number;
};

/** Secondary outline button — theme-driven stroke + row hover. Apple glyph
 *  flips to match the modal's text color so it stays legible across themes. */
export const LoginWithAppleButton = ({ isDark, gridColumn }: Props) => {
    const { t } = useTranslation();
    const { initOAuth } = useLoginWithOAuth();

    const [stroke, strokeStrong, hoverBg, textPrimary] = useToken('colors', [
        'vechain-kit-border-button',
        'vechain-kit-border-hover',
        'vechain-kit-button-secondary-bg',
        'vechain-kit-text-primary',
    ]);

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
                        color={textPrimary}
                    />
                }
                text={t('Continue with Apple')}
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
