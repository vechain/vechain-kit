import { GridItem, Icon } from '@chakra-ui/react';
import { useWalletModal } from '@vechain/dapp-kit-react';
import { ConnectionButton } from '@/components';
import { useTranslation } from 'react-i18next';
import { IoIosArrowForward } from 'react-icons/io';
import { IoWalletOutline } from 'react-icons/io5';

type Props = {
    isDark: boolean;
    gridColumn?: number;
};

export const DappKitButton = ({ isDark, gridColumn = 2 }: Props) => {
    const { t } = useTranslation();
    const { open: openDappKitModal } = useWalletModal();

    return (
        <GridItem colSpan={gridColumn ? gridColumn : 2} w={'full'}>
            <ConnectionButton
                isDark={isDark}
                onClick={openDappKitModal}
                icon={IoWalletOutline}
                text={gridColumn >= 2 ? t('Connect Wallet') : undefined}
                rightIcon={<Icon as={IoIosArrowForward} />}
            />
        </GridItem>
    );
};
