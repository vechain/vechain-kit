import { GridItem, useToken } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import React from 'react';
import { ConnectionButton } from '@/components';
import { useConnectWithDappKitSource } from '@/hooks';
import { VeWorldLogoDark, VeWorldLogoLight } from '@/assets';
import { ConnectModalContentsTypes } from '../ConnectModal';
import { RecommendedDot } from './RecommendedDot';

type Props = {
    isDark: boolean;
    gridColumn?: number;
    setCurrentContent: React.Dispatch<
        React.SetStateAction<ConnectModalContentsTypes>
    >;
};

/**
 * Primary CTA — filled with the theme's primary-button surface.
 * Devs that customise `theme.buttons.primaryButton.{bg,color}` automatically
 * restyle this button too.
 * Recommended-provider green dot in the trailing slot.
 */
export const VeWorldButton = ({
    isDark,
    gridColumn = 4,
    setCurrentContent,
}: Props) => {
    const { t } = useTranslation();
    const { connect } = useConnectWithDappKitSource('veworld', setCurrentContent);

    const [bg, color] = useToken('colors', [
        'vechain-kit-button-primary-bg',
        'vechain-kit-button-primary-color',
    ]);
    // VeWorld uses the inverted-contrast logo. In dark mode the primary
    // surface is light, so we want the dark logo (and vice versa).
    const Logo = isDark ? VeWorldLogoDark : VeWorldLogoLight;

    return (
        <GridItem colSpan={gridColumn} w={'full'}>
            <ConnectionButton
                isDark={isDark}
                onClick={connect}
                customIcon={<Logo w={'24px'} h={'24px'} />}
                text={
                    gridColumn >= 2 ? t('Continue with VeWorld') : undefined
                }
                rightIcon={<RecommendedDot />}
                style={{
                    bg,
                    color,
                    border: 'none',
                    _hover: { bg, opacity: 0.92 },
                }}
            />
        </GridItem>
    );
};
