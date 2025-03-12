import { Icon, IconProps } from '@chakra-ui/react';
import React from 'react';

type Props = Omit<IconProps, 'dangerouslySetInnerHTML'>;

export const VETLogo: React.FC<Props> = ({ ...props }) => {
    return (
        <Icon viewBox="0 0 1578.5 1578.5" {...props}>
            <g id="VET">
                <rect
                    fill="#6042dd"
                    width="1578.5"
                    height="1578.5"
                    rx="147.81"
                    ry="147.81"
                />
                <path
                    fill="#eef3f7"
                    d="M1259.66,354.93h-84.01c-20.51,0-39.26,11.92-48.2,30.66l-220.7,464.61-.22-.52-58.82,123.76.22.52-58.75,123.69L495.39,478.92h83.8c20.51,0,39.26,11.92,48.2,30.66l191.76,401.43,58.82-123.84-154.92-324.11c-31.35-66.07-97.49-108.14-169.94-108.14h-234.18l58.67,123.99h.22l352.54,742.58h117.57l411.73-866.56Z"
                />
            </g>
        </Icon>
    );
};
