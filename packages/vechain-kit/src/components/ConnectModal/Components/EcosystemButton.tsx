import { GridItem, useDisclosure } from '@chakra-ui/react';
import { ConnectionButton, EcosystemModal } from '@/components';
import { useTranslation } from 'react-i18next';
import { PrivyAppInfo } from '@/types';
import { IoMdApps } from 'react-icons/io';

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
                    icon={IoMdApps}
                    text={
                        gridColumn && gridColumn >= 2 ? t('Other') : undefined
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
