import { GridItem } from '@chakra-ui/react';
import { useWalletModal } from '@vechain/dapp-kit-react';
import { HiOutlineWallet } from 'react-icons/hi2';
import { ConnectionButton } from '@/components';
import { useTranslation } from 'react-i18next';

type Props = {
    isDark: boolean;
    privySocialLoginEnabled: boolean;
};

export const DappKitButton = ({ isDark, privySocialLoginEnabled }: Props) => {
    const { t } = useTranslation();
    const { open: openDappKitModal } = useWalletModal();

    return (
        <GridItem colSpan={privySocialLoginEnabled ? 1 : 2} w={'full'}>
            <ConnectionButton
                isDark={isDark}
                onClick={openDappKitModal}
                icon={HiOutlineWallet}
                text={
                    !privySocialLoginEnabled ? t('Connect Wallet') : undefined
                }
            />
        </GridItem>
    );
};
