import { GridItem } from '@chakra-ui/react';
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
 * Primary CTA — VeWorld brand-locked surface. Always inverted contrast
 * against the modal: dark in light mode, white in dark mode.
 *
 * Intentionally does NOT consume `theme.buttons.primaryButton.{bg,color}`
 * — devs who themed their primary button (e.g. brand blue) shouldn't end
 * up with a blue VeWorld button. The VeWorld logo + label have to stay
 * recognisable.
 */
export const VeWorldButton = ({
    isDark,
    gridColumn = 4,
    setCurrentContent,
}: Props) => {
    const { t } = useTranslation();
    const { connect } = useConnectWithDappKitSource('veworld', setCurrentContent);

    const bg = isDark ? '#ffffff' : '#0E0D18';
    const color = isDark ? '#0E0D18' : '#ffffff';
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
