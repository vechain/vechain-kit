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
