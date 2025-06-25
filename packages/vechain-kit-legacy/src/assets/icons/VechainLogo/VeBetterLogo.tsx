import { IconProps } from '@chakra-ui/react';
import React from 'react';
import { VeBetterLogoLight } from './VeBetterLogoLight';
import { VeBetterLogoDark } from './VeBetterLogoDark';

type Props = {
    isDark?: boolean;
} & Omit<IconProps, 'dangerouslySetInnerHTML'>;

export const VeBetterLogo: React.FC<Props> = ({ isDark = false, ...props }) => {
    return isDark ? (
        <VeBetterLogoLight {...props} />
    ) : (
        <VeBetterLogoDark {...props} />
    );
};
