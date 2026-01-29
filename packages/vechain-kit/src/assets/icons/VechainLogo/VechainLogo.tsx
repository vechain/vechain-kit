import { IconProps } from '@chakra-ui/react';
import React from 'react';
// Import directly from sibling files to avoid circular dependency with barrel file
import { VechainLogoHorizontalDark } from './VechainLogoHorizontalDark';
import { VechainLogoHorizontalLight } from './VechainLogoHorizontalLight';

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
