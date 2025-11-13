import { GridItem, Icon } from '@chakra-ui/react';
import { useDAppKitWalletModal } from '@/hooks';
import { ConnectionButton } from '@/components';
import { useTranslation } from 'react-i18next';
import { IoIosArrowForward } from 'react-icons/io';
import { IoWalletOutline } from 'react-icons/io5';
import { useEffect } from 'react';
import { useWallet as useDappKitWallet } from '@vechain/dapp-kit-react';
import { isRejectionError } from '@/utils/stringUtils';
import { VeWorldLogoDark, VeWorldLogoLight } from '@/assets';
import { IconType } from 'react-icons';
import { useVeChainKitConfig } from '@/providers';

type Props = {
    isDark: boolean;
    gridColumn?: number;
};

export const DappKitButton = ({ isDark, gridColumn = 2 }: Props) => {
    const { t } = useTranslation();
    const { open: openDappKitModal, onConnectionStatusChange } =
        useDAppKitWalletModal();
    const { dappKit } = useVeChainKitConfig();
    const { source } = useDappKitWallet();

    // Determine the button text based on the source
    const buttonText = !dappKit?.allowedWallets?.includes('sync2')
        ? t('Connect with VeWorld wallet')
        : t('Connect wallet');

    useEffect(() => {
        const handleConnectionChange = (
            address: string | null,
            error?: Error,
        ) => {
            if (!address) {
                if (error?.message) {
                    const errorMsg = error.message.toLowerCase();
                    if (errorMsg.includes('veworld')) {
                        return { ...(source && { source }) };
                    }
                    if (errorMsg.includes('sync2')) {
                        return { ...(source && { source }) };
                    }
                    if (errorMsg.includes('wallet-connect')) {
                        return { ...(source && { source }) };
                    }
                    if (errorMsg && isRejectionError(errorMsg)) {
                        return { ...(source && { source }) };
                    }
                }
                return { ...(source && { source }) };
            }
        };
        onConnectionStatusChange(handleConnectionChange);
    }, [onConnectionStatusChange]);
    const handleDappKitClick = () => {
        openDappKitModal();
    };

    return (
        <GridItem colSpan={gridColumn ? gridColumn : 2} w={'full'}>
            <ConnectionButton
                isDark={isDark}
                onClick={handleDappKitClick}
                icon={
                    !dappKit?.allowedWallets?.includes('sync2')
                        ? ((isDark
                              ? VeWorldLogoLight
                              : VeWorldLogoDark) as IconType)
                        : (IoWalletOutline as IconType)
                }
                iconWidth={'27px'}
                text={gridColumn >= 2 ? buttonText : undefined}
                rightIcon={
                    (dappKit?.allowedWallets?.includes('sync2') && (
                        <Icon as={IoIosArrowForward} />
                    )) ||
                    undefined
                }
            />
        </GridItem>
    );
};
