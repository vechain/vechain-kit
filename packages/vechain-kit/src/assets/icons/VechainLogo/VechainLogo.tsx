import { IconProps } from '@chakra-ui/react';
import React from 'react';
import { VechainLogoDark } from './VechainLogoDark';
import { VechainLogoLight } from './VechainLogoLight';

type Props = {
    isDark?: boolean;
} & Omit<IconProps, 'dangerouslySetInnerHTML'>;

export const VechainLogo: React.FC<Props> = ({ isDark = false, ...props }) => {
    return isDark ? (
        <VechainLogoDark {...props} />
    ) : (
        <VechainLogoLight {...props} />
    );
};
