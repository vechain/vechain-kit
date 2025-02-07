import { GridItem, useDisclosure } from '@chakra-ui/react';
import { IoPlanet } from 'react-icons/io5';
import { ConnectionButton, EcosystemModal } from '@/components';
import { useTranslation } from 'react-i18next';
import { PrivyAppInfo } from '@/types';

type Props = {
    isDark: boolean;
    appsInfo: PrivyAppInfo[];
    isLoading: boolean;
    gridColumn?: number;
};

export const EcosystemButton = ({
    isDark,
    appsInfo,
    isLoading,
    gridColumn,
}: Props) => {
    const { t } = useTranslation();
    const ecosystemModal = useDisclosure();

    return (
        <>
            <GridItem colSpan={gridColumn} w={'full'}>
                <ConnectionButton
                    isDark={isDark}
                    onClick={ecosystemModal.onOpen}
                    icon={IoPlanet}
                    text={
                        gridColumn && gridColumn >= 2
                            ? t('Ecosystem')
                            : undefined
                    }
                />
            </GridItem>

            <EcosystemModal
                isOpen={ecosystemModal.isOpen}
                onClose={ecosystemModal.onClose}
                appsInfo={appsInfo}
                isLoading={isLoading}
            />
        </>
    );
};
