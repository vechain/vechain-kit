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
                    ? 'https://mintlify.s3.us-west-1.amazonaws.com/privy-c2af3412/logo/privy-logo-dark.png'
                    : 'https://mintlify.s3.us-west-1.amazonaws.com/privy-c2af3412/logo/privy-logo-light.png'
            }
            alt="Privy Logo"
            {...props}
        />
    );
};
