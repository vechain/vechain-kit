import { Icon, IconProps } from '@chakra-ui/react';
import React from 'react';

type Props = Omit<IconProps, 'dangerouslySetInnerHTML'>;

export const VTHOLogo: React.FC<Props> = ({ ...props }) => {
    return (
        <Icon viewBox="0 0 1578.5 1578.5" {...props}>
            <g id="VeTHOR">
                <rect
                    fill="#eef3f7"
                    width="1578.5"
                    height="1578.5"
                    rx="147.81"
                    ry="147.81"
                />
                <g>
                    <path
                        fill="#6042dd"
                        opacity={0.65}
                        d="M983.34,285.88h146.6l-275.54,358.45h247.27l-614.18,682.1,214.6-483.78h-215.8l217.59-556.77h279.47Z"
                    />
                    <path
                        fill="#6042dd"
                        d="M992.16,285.88l-247.66,411.81h226.46l-483.49,628.74,214.6-483.78h-215.8l217.59-556.77"
                    />
                </g>
            </g>
        </Icon>
    );
};
