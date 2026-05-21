'use client';

import { Tag, TagLabel } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

export type Status = 'NEW' | 'BETA' | 'ALPHA' | 'STABLE';

interface StatusBadgeProps {
    status: Status;
}

const COLOR_SCHEMES: Record<Status, string> = {
    NEW: 'pink',
    BETA: 'purple',
    ALPHA: 'orange',
    STABLE: 'green',
};

export function StatusBadge({ status }: StatusBadgeProps) {
    const { t } = useTranslation();
    const labels: Record<Status, string> = {
        NEW: t('New'),
        BETA: t('Beta'),
        ALPHA: t('Alpha'),
        STABLE: t('Stable'),
    };

    return (
        <Tag
            size="sm"
            borderRadius="full"
            colorScheme={COLOR_SCHEMES[status]}
            textTransform="uppercase"
            fontWeight="bold"
            letterSpacing="0.05em"
            fontSize="2xs"
        >
            <TagLabel>{labels[status]}</TagLabel>
        </Tag>
    );
}
