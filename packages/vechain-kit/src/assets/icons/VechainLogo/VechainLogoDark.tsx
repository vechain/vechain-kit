import { Icon, IconProps } from '@chakra-ui/react';
import React from 'react';

type Props = Omit<IconProps, 'dangerouslySetInnerHTML'>;

export const VechainLogoDark: React.FC<Props> = ({ ...props }) => {
    return (
        <Icon viewBox="0 0 2000 2000" {...props}>
            <path
                d="M1470.89,566h-85.12c-20.78,0-39.78,12.08-48.83,31.07l-223.61,470.74-.22-.52-59.59,125.4.22.53-59.52,125.32-297.68-626.9h84.9c20.78,0,39.78,12.08,48.83,31.07l194.3,406.73,59.6-125.47-156.97-328.39c-31.76-66.94-98.78-109.56-172.18-109.56h-237.27l59.45,125.62h.22l357.2,752.38h119.12l417.16-878Z"
                fill="#eef3f7"
            />
        </Icon>
    );
};
