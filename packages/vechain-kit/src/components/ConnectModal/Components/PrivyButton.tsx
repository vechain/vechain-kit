import { GridItem } from '@chakra-ui/react';
import { CiCircleMore } from 'react-icons/ci';
import { ConnectionButton } from '@/components';
import { useTranslation } from 'react-i18next';

type Props = {
    isDark: boolean;
    onViewMoreLogin: () => void;
    gridColumn: number;
};

export const PrivyButton = ({
    isDark,
    onViewMoreLogin,
    gridColumn = 1,
}: Props) => {
    const { t } = useTranslation();
    return (
        <GridItem colSpan={gridColumn} w={'full'}>
            <ConnectionButton
                isDark={isDark}
                onClick={onViewMoreLogin}
                icon={CiCircleMore}
                text={gridColumn >= 2 ? t('More') : undefined}
            />
        </GridItem>
    );
};
