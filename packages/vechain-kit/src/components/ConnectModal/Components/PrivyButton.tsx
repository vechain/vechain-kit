import { GridItem, Icon } from '@chakra-ui/react';
import { LuEllipsis, LuArrowRight } from 'react-icons/lu';
import { ConnectionButton } from '@/components';
import { useTranslation } from 'react-i18next';

type Props = {
    isDark: boolean;
    onViewMoreLogin: () => void;
    gridColumn?: number;
};

export const PrivyButton = ({ isDark, onViewMoreLogin, gridColumn }: Props) => {
    const { t } = useTranslation();
    return (
        <GridItem colSpan={gridColumn} w={'full'}>
            <ConnectionButton
                isDark={isDark}
                onClick={onViewMoreLogin}
                icon={LuEllipsis}
                text={gridColumn && gridColumn >= 2 ? t('More') : undefined}
                rightIcon={<Icon as={LuArrowRight} />}
            />
        </GridItem>
    );
};
