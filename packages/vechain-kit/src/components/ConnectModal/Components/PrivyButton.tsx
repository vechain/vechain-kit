import { GridItem, Icon } from '@chakra-ui/react';
import { CiCircleMore } from 'react-icons/ci';
import { ConnectionButton } from '@/components';
import { useTranslation } from 'react-i18next';
import { IoIosArrowForward } from 'react-icons/io';

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
                icon={CiCircleMore}
                text={gridColumn && gridColumn >= 2 ? t('More') : undefined}
                rightIcon={<Icon as={IoIosArrowForward} />}
            />
        </GridItem>
    );
};
