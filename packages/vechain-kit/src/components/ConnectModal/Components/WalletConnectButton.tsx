import { GridItem } from '@chakra-ui/react';
import { LuQrCode } from 'react-icons/lu';
import { useTranslation } from 'react-i18next';
import React from 'react';
import { ConnectionButton } from '@/components';
import { useConnectWithDappKitSource } from '@/hooks';
import { ConnectModalContentsTypes } from '../ConnectModal';

type Props = {
    isDark: boolean;
    gridColumn?: number;
    setCurrentContent: React.Dispatch<
        React.SetStateAction<ConnectModalContentsTypes>
    >;
};

export const WalletConnectButton = ({
    isDark,
    gridColumn = 4,
    setCurrentContent,
}: Props) => {
    const { t } = useTranslation();
    const { connect } = useConnectWithDappKitSource(
        'wallet-connect',
        setCurrentContent,
    );

    return (
        <GridItem colSpan={gridColumn} w={'full'}>
            <ConnectionButton
                isDark={isDark}
                onClick={connect}
                icon={LuQrCode}
                text={
                    gridColumn >= 2
                        ? t('Continue with WalletConnect')
                        : undefined
                }
            />
        </GridItem>
    );
};
