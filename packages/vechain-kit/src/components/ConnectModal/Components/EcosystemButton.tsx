import { Button, useDisclosure } from '@chakra-ui/react';
import { EcosystemModal } from '@/components';
import { useTranslation } from 'react-i18next';
import { PrivyAppInfo } from '@/types';

type Props = {
    isDark: boolean;
    appsInfo: PrivyAppInfo[];
    isLoading: boolean;
    gridColumn?: number;
};

export const EcosystemButton = ({ appsInfo, isLoading }: Props) => {
    const { t } = useTranslation();
    const ecosystemModal = useDisclosure();

    const handleEcosystemClick = () => {
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
