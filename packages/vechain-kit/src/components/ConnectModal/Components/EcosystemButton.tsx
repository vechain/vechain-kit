import { Button, GridItem, Icon, useDisclosure } from '@chakra-ui/react';
import { ConnectionButton, EcosystemModal } from '@/components';
import { useTranslation } from 'react-i18next';
import { PrivyAppInfo } from '@/types';
import { AiOutlineUser } from 'react-icons/ai';
import { IoIosArrowForward } from 'react-icons/io';
import { Analytics } from '@/utils/mixpanelClientInstance';
import { VeLoginMethod } from '@/types/mixPanel';

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

    const handleEcosystemClick = () => {
        Analytics.auth.flowStarted(VeLoginMethod.ECOSYSTEM);
        Analytics.auth.methodSelected(VeLoginMethod.ECOSYSTEM);
        ecosystemModal.onOpen();
    };

    return (
        <>
            {/* <GridItem colSpan={gridColumn} w={'full'}> */}
            {/* <ConnectionButton
                isDark={isDark}
                onClick={handleEcosystemClick}
                icon={AiOutlineUser}
                text={
                    gridColumn && gridColumn >= 2
                        ? t('Other options')
                        : undefined
                }
                rightIcon={<Icon as={IoIosArrowForward} />}
            /> */}
            {/* </GridItem> */}

            <Button
                fontSize={'sm'}
                variant="link"
                onClick={handleEcosystemClick}
            >
                {t('Already have an x2earn app wallet?')}
            </Button>

            <EcosystemModal
                isOpen={ecosystemModal.isOpen}
                onClose={ecosystemModal.onClose}
                appsInfo={appsInfo}
                isLoading={isLoading}
            />
        </>
    );
};
