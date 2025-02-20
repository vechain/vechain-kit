import { GridItem, Icon, useDisclosure } from '@chakra-ui/react';
import { ConnectionButton, EcosystemModal } from '@/components';
import { useTranslation } from 'react-i18next';
import { PrivyAppInfo } from '@/types';
import { AiOutlineUser } from 'react-icons/ai';
import { IoIosArrowForward } from 'react-icons/io';

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
                    icon={AiOutlineUser}
                    text={
                        gridColumn && gridColumn >= 2
                            ? t('Other options')
                            : undefined
                    }
                    rightIcon={<Icon as={IoIosArrowForward} />}
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
