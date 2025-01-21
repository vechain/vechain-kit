import { GridItem } from '@chakra-ui/react';
import { useWalletModal } from '@vechain/dapp-kit-react';
import { HiOutlineWallet } from 'react-icons/hi2';
import { ConnectionButton } from '@/components';
import { useTranslation } from 'react-i18next';

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
                icon={HiOutlineWallet}
                text={gridColumn >= 2 ? t('Connect Wallet') : undefined}
            />
        </GridItem>
    );
};
