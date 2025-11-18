import { GridItem, Icon } from '@chakra-ui/react';
import { useDAppKitWalletModal } from '@/hooks';
import { ConnectionButton } from '@/components';
import { useTranslation } from 'react-i18next';
import { LuArrowRight, LuWallet } from 'react-icons/lu';
import { useEffect } from 'react';
import { useWallet as useDappKitWallet } from '@vechain/dapp-kit-react';
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
                    console.error(error?.message);
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
                        : (LuWallet as IconType)
                }
                iconWidth={'27px'}
                text={gridColumn >= 2 ? buttonText : undefined}
                rightIcon={
                    (dappKit?.allowedWallets?.includes('sync2') && (
                        <Icon as={LuArrowRight} />
                    )) ||
                    undefined
                }
            />
        </GridItem>
    );
};
