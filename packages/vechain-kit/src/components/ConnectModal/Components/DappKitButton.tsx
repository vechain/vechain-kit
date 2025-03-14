import { GridItem, Icon } from '@chakra-ui/react';
import { useDAppKitWalletModal } from '@/hooks';
import { ConnectionButton } from '@/components';
import { useTranslation } from 'react-i18next';
import { IoIosArrowForward } from 'react-icons/io';
import { IoWalletOutline } from 'react-icons/io5';
import { Analytics } from '@/utils/mixpanelClientInstance';
import { VeLoginMethod } from '@/types/mixPanel';

type Props = {
    isDark: boolean;
    gridColumn?: number;
};

export const DappKitButton = ({ isDark, gridColumn = 2 }: Props) => {
    const { t } = useTranslation();
    const { open: openDappKitModal } = useDAppKitWalletModal();

    const handleDappKitClick = () => {
        Analytics.auth.methodSelected(VeLoginMethod.DAPPKIT);
        openDappKitModal();
    };

    return (
        <GridItem colSpan={gridColumn ? gridColumn : 2} w={'full'}>
            <ConnectionButton
                isDark={isDark}
                onClick={handleDappKitClick}
                icon={IoWalletOutline}
                text={gridColumn >= 2 ? t('Connect wallet') : undefined}
                rightIcon={<Icon as={IoIosArrowForward} />}
            />
        </GridItem>
    );
};
