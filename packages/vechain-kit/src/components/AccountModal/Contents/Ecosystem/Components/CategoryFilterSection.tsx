import { Box, Tag, Text, Wrap, WrapItem } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { CategoryLabel } from './CategoryLabel';

export type CategoryFilter = string | null;

type CategoryFilterSectionProps = {
    selectedCategory: CategoryFilter;
    onCategoryChange: (category: CategoryFilter) => void;
    categories: string[];
    darkMode: boolean;
};

export const CategoryFilterSection = ({
    selectedCategory,
    onCategoryChange,
    categories,
    darkMode,
}: CategoryFilterSectionProps) => {
    const { t } = useTranslation();

    return (
        <Box width="full" mb={4}>
            <Text fontSize="sm" fontWeight="500" mb={2}>
                {t('Filter by category')}
            </Text>
            <Wrap spacing={2}>
                <WrapItem>
                    <Tag
                        size="md"
                        borderRadius="full"
                        variant={
                            selectedCategory === null ? 'solid' : 'outline'
                        }
                        colorScheme={darkMode ? 'gray' : 'blackAlpha'}
                        cursor="pointer"
                        onClick={() => onCategoryChange(null)}
                    >
                        {t('All')}
                    </Tag>
                </WrapItem>

                {categories.map((category) => (
                    <WrapItem key={category}>
                        <CategoryLabel
                            category={category}
                            size="md"
                            variant={
                                selectedCategory === category
                                    ? 'solid'
                                    : 'outline'
                            }
                            cursor="pointer"
                            onClick={() => onCategoryChange(category)}
                        />
                    </WrapItem>
                ))}
            </Wrap>
        </Box>
    );
};
