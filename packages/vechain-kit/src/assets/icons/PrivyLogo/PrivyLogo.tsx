import { Image, ImageProps } from '@chakra-ui/react';
import React from 'react';
import { PRIVY_MINTLIFY_ASSETS_S3_BASE_URL } from '../../../constants';

type Props = {
    isDark?: boolean;
} & Omit<ImageProps, 'dangerouslySetInnerHTML'>;

export const PrivyLogo: React.FC<Props> = ({ isDark = false, ...props }) => {
    return (
        <Image
            src={
                isDark
                    ? new URL(
                          '/privy-c2af3412/logo/privy-logo-dark.png',
                          PRIVY_MINTLIFY_ASSETS_S3_BASE_URL,
                      ).toString()
                    : new URL(
                          '/privy-c2af3412/logo/privy-logo-light.png',
                          PRIVY_MINTLIFY_ASSETS_S3_BASE_URL,
                      ).toString()
            }
            alt="Privy Logo"
            {...props}
        />
    );
};
