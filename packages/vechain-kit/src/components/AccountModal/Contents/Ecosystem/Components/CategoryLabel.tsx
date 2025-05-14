import { Tag, TagProps } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

type CategoryProps = {
    category: string;
} & Omit<TagProps, 'category'>;

const getCategoryColor = (category: string): string => {
    switch (category.toLowerCase()) {
        case 'defi':
            return 'blue';
        case 'games':
            return 'green';
        case 'collectibles':
            return 'purple';
        case 'marketplaces':
            return 'orange';
        case 'utilities':
            return 'cyan';
        default:
            return 'gray';
    }
};

export const CategoryLabel = ({ category, ...props }: CategoryProps) => {
    const { t } = useTranslation();

    const color = getCategoryColor(category);

    return (
        <Tag
            size="sm"
            colorScheme={color}
            borderRadius="full"
            px={2}
            {...props}
        >
            {t(category)}
        </Tag>
    );
};
