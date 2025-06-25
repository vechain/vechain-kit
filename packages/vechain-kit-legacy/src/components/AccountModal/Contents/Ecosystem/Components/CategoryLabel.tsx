import { Tag, TagProps } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

export type AllowedCategories =
    | 'defi'
    | 'games'
    | 'collectibles'
    | 'marketplaces'
    | 'utilities'
    | 'vebetter';

type CategoryProps = {
    category: AllowedCategories;
} & Omit<TagProps, 'category'>;

const getCategoryColor = (category: AllowedCategories): string => {
    switch (category) {
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

    const categoryKey = category.toLowerCase() as AllowedCategories;
    const color = getCategoryColor(categoryKey);

    return (
        <Tag
            size="sm"
            colorScheme={color}
            borderRadius="full"
            px={2}
            {...props}
        >
            {t(categoryKey)}
        </Tag>
    );
};
