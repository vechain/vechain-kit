import { IconProps } from '@chakra-ui/react';
import React from 'react';
import { VechainIconLight } from './VechainIconLight';
import { VechainIconDark } from './VechainIconDark';

type Props = {
    isDark?: boolean;
} & Omit<IconProps, 'dangerouslySetInnerHTML'>;

export const VechainIcon: React.FC<Props> = ({ isDark = false, ...props }) => {
    return isDark ? (
        <VechainIconDark {...props} />
    ) : (
        <VechainIconLight {...props} />
    );
};
