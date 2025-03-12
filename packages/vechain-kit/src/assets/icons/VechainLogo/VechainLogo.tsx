import { IconProps } from '@chakra-ui/react';
import React from 'react';
import { VechainLogoHorizontalDark, VechainLogoHorizontalLight } from './';

type Props = {
    isDark?: boolean;
} & Omit<IconProps, 'dangerouslySetInnerHTML'>;

export const VechainLogo: React.FC<Props> = ({ isDark = false, ...props }) => {
    return isDark ? (
        <VechainLogoHorizontalDark {...props} />
    ) : (
        <VechainLogoHorizontalLight {...props} />
    );
};
