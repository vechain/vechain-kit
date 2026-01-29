import { GridItem, Icon } from '@chakra-ui/react';
// Import directly to avoid circular dependency with components barrel
import { ConnectionButton } from './ConnectionButton';
import { useTranslation } from 'react-i18next';
import { LuArrowRight, LuWallet } from 'react-icons/lu';
import { useEffect } from 'react';
// Use optional hooks to handle missing DAppKitProvider gracefully
import { useOptionalDAppKitWallet } from '../../../hooks/api/dappkit/useOptionalDAppKitWallet';
import { useOptionalDAppKitWalletModal } from '../../../hooks/api/dappkit/useOptionalDAppKitWalletModal';
import { VeWorldLogoDark, VeWorldLogoLight } from '../../../assets';
import { IconType } from 'react-icons';
// Direct import to avoid circular dependency through barrel exports
import { useVeChainKitConfig } from '../../../providers/VeChainKitContext';

type Props = {
    isDark: boolean;
    gridColumn?: number;
};

export const DappKitButton = ({ isDark, gridColumn = 2 }: Props) => {
    const { t } = useTranslation();
    const { open: openDappKitModal, onConnectionStatusChange } =
        useOptionalDAppKitWalletModal();
    const { dappKit } = useVeChainKitConfig();
    const { source } = useOptionalDAppKitWallet();

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
            // Wallet activation is now handled in useWallet.ts
            // When a wallet connects, it will automatically be set as active
        };
        onConnectionStatusChange(handleConnectionChange);
    }, [onConnectionStatusChange, source]);
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
