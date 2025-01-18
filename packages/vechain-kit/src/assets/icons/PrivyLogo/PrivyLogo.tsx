import { Image, ImageProps } from '@chakra-ui/react';
import React from 'react';

type Props = {
    isDark?: boolean;
} & Omit<ImageProps, 'dangerouslySetInnerHTML'>;

export const PrivyLogo: React.FC<Props> = ({ isDark = false, ...props }) => {
    return (
        <Image
            src={
                isDark
                    ? 'https://docs.privy.io/privy-logo-dark.png'
                    : 'https://docs.privy.io/privy-logo-light.png'
            }
            alt="Privy Logo"
            {...props}
        />
    );
};
