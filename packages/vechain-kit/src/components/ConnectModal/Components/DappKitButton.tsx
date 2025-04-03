import { GridItem, Icon } from '@chakra-ui/react';
import { useDAppKitWalletModal, usePrivy } from '@/hooks';
import { ConnectionButton } from '@/components';
import { useTranslation } from 'react-i18next';
import { IoIosArrowForward } from 'react-icons/io';
import { IoWalletOutline } from 'react-icons/io5';
import { Analytics } from '@/utils/mixpanelClientInstance';
import { VeLoginMethod, DappKitSource } from '@/types/mixPanel';
import { useEffect } from 'react';
import { useWallet as useDappKitWallet } from '@vechain/dapp-kit-react';
import { isRejectionError } from '@/utils/StringUtils';
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
    const { user } = usePrivy();
    const { source } = useDappKitWallet();

    // Determine the button text based on the source
    const buttonText = !dappKit?.allowedWallets?.includes('sync2')
        ? 'Connect with VeWorld wallet'
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
                        return Analytics.auth.dropOff('dappkit-veworld', {
                            ...(source && { source }),
                        });
                    }
                    if (errorMsg.includes('sync2')) {
                        return Analytics.auth.dropOff('dappkit-sync2', {
                            ...(source && { source }),
                        });
                    }
                    if (errorMsg.includes('wallet-connect')) {
                        return Analytics.auth.dropOff(
                            'dappkit-wallet-connect',
                            {
                                ...(source && { source }),
                            },
                        );
                    }
                    if (errorMsg && isRejectionError(errorMsg)) {
                        return Analytics.auth.dropOff('dappkit-view', {
                            ...(source && { source }),
                        });
                    }
                }
                return Analytics.auth.dropOff('dappkit-view', {
                    ...(source && { source }),
                });
            } else {
                Analytics.auth.completed({
                    loginMethod: VeLoginMethod.DAPPKIT,
                });
            }
        };

        onConnectionStatusChange(handleConnectionChange);
    }, [onConnectionStatusChange]);

    const handleDappKitClick = () => {
        Analytics.auth.flowStarted(VeLoginMethod.DAPPKIT);
        Analytics.auth.methodSelected(VeLoginMethod.DAPPKIT);
        openDappKitModal();
        if (source) {
            Analytics.auth.completed({
                userId: user?.id,
                loginMethod: VeLoginMethod.DAPPKIT,
                platform: source as DappKitSource,
            });
        }
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
