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
