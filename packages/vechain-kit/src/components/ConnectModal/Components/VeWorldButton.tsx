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
