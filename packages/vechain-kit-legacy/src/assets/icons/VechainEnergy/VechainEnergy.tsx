import { Box, BoxProps } from '@chakra-ui/react';
import React from 'react';
import { vechainEnergySvg } from '../../svg';

type Props = {
    isDark?: boolean;
    boxSize?: string | number;
} & Omit<BoxProps, 'dangerouslySetInnerHTML'>;

export const VechainEnergy: React.FC<Props> = ({ isDark, ...props }) => {
    return (
        <Box
            as="span"
            display="inline-block"
            dangerouslySetInnerHTML={{
                __html: isDark ? vechainEnergySvg.dark : vechainEnergySvg.light,
            }}
            {...props}
        />
    );
};
