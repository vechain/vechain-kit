import { GridItem } from '@chakra-ui/react';
import { useWalletModal } from '@vechain/dapp-kit-react';
import { HiOutlineWallet } from 'react-icons/hi2';
import { ConnectionButton } from '@/components';

type Props = {
    isDark: boolean;
    privySocialLoginEnabled: boolean;
};

export const DappKitButton = ({ isDark, privySocialLoginEnabled }: Props) => {
    const { open: openDappKitModal } = useWalletModal();

    return (
        <GridItem colSpan={privySocialLoginEnabled ? 1 : 2} w={'full'}>
            <ConnectionButton
                isDark={isDark}
                onClick={openDappKitModal}
                icon={HiOutlineWallet}
                text={!privySocialLoginEnabled ? 'Connect Wallet' : undefined}
            />
        </GridItem>
    );
};
