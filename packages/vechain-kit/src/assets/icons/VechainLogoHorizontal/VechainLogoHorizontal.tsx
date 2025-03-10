import { Image, ImageProps } from '@chakra-ui/react';
import React from 'react';

type Props = {
    isDark?: boolean;
} & Omit<ImageProps, 'dangerouslySetInnerHTML'>;

export const VechainLogoHorizontal: React.FC<Props> = ({
    isDark = false,
    ...props
}) => {
    return (
        <Image
            src={
                isDark
                    ? '../../logo/vechain-logo-quartz.png'
                    : '../../logo/vechain-logo-navy.png'
            }
            alt="VeChain Logo Horizontal"
            {...props}
        />
    );
};
