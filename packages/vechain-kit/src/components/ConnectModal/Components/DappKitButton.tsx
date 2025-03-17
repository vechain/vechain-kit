import { GridItem, Icon } from '@chakra-ui/react';
import { useDAppKitWalletModal } from '@/hooks';
import { ConnectionButton } from '@/components';
import { useTranslation } from 'react-i18next';
import { IoIosArrowForward } from 'react-icons/io';
import { IoWalletOutline } from 'react-icons/io5';
import { Analytics } from '@/utils/mixpanelClientInstance';
import { VeLoginMethod } from '@/types/mixPanel';
import { useEffect } from 'react';

type Props = {
    isDark: boolean;
    gridColumn?: number;
};

export const DappKitButton = ({ isDark, gridColumn = 2 }: Props) => {
    const { t } = useTranslation();
    const { open: openDappKitModal, onConnectionStatusChange } =
        useDAppKitWalletModal();

    useEffect(() => {
        const handleConnectionChange = (
            address: string | null,
            error?: Error,
        ) => {
            if (!address) {
                if (error?.message) {
                    const errorMsg = error.message.toLowerCase();
                    if (errorMsg.includes('veworld')) {
                        Analytics.auth.trackAuth('drop_off', {
                            dropOffStage: 'dappkit-veworld',
                        });
                        return;
                    }
                    if (errorMsg.includes('sync2')) {
                        Analytics.auth.trackAuth('drop_off', {
                            dropOffStage: 'dappkit-sync2',
                        });
                        return;
                    }
                    if (
                        errorMsg.includes('rejected') ||
                        errorMsg.includes('denied')
                    ) {
                        Analytics.auth.trackAuth('drop_off', {
                            dropOffStage: 'dappkit-wallet-connect',
                        });
                        return;
                    }
                }
                Analytics.auth.trackAuth('drop_off', {
                    dropOffStage: 'dappkit-view',
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
        Analytics.auth.flowStarted();
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
