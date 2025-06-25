import { IconProps } from '@chakra-ui/react';
import React from 'react';
import { VeBetterIconLight } from './VeBetterIconLight';
import { VeBetterIconDark } from './VeBetterIconDark';

type Props = {
    isDark?: boolean;
} & Omit<IconProps, 'dangerouslySetInnerHTML'>;

export const VeBetterIcon: React.FC<Props> = ({ isDark = false, ...props }) => {
    return isDark ? (
        <VeBetterIconLight {...props} />
    ) : (
        <VeBetterIconDark {...props} />
    );
};
