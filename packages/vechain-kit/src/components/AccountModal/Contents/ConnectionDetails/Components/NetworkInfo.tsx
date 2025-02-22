import { getConfig } from '@/config';
import { useWallet, useFetchPrivyStatus } from '@/hooks';
import { useVeChainKitConfig } from '@/providers';
import { HStack, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import packageJson from '../../../../../../package.json';

export const NetworkInfo = () => {
    const { t } = useTranslation();
    const { darkMode: isDark, network } = useVeChainKitConfig();
    const { connection, smartAccount } = useWallet();
    const { data: privyStatus } = useFetchPrivyStatus();

    const textColor = isDark ? '#dfdfdd' : '#4d4d4d';

    const InfoRow = ({ label, value }: { label: string; value: string }) => (
        <HStack w="full" justifyContent="space-between">
            <Text fontSize="sm" color={textColor}>
                {label}:
            </Text>
            <Text fontSize="sm" color={textColor}>
                {value}
            </Text>
        </HStack>
    );

    const smartAccountVersion = smartAccount.version 
        ? `v${smartAccount.version}` 
        : 'v1';

    return (
        <>
            <InfoRow 
                label={t('Connection Type')} 
                value={connection.source.type} 
            />
            <InfoRow 
                label={t('Network')} 
                value={network.type} 
            />
            <InfoRow 
                label={t('Node URL')} 
                value={network.nodeUrl || getConfig(network.type).nodeUrl} 
            />

            {connection.isConnectedWithPrivy ? (
                <>
                    <InfoRow 
                        label={t('Smart Account')} 
                        value={smartAccountVersion} 
                    />
                    <InfoRow 
                        label={t('Privy Status')} 
                        value={privyStatus || ''} 
                    />
                </>
            ) : (
                smartAccount.isDeployed && (
                    <InfoRow 
                        label={t('Smart Account')} 
                        value={smartAccountVersion} 
                    />
                )
            )}

            <InfoRow 
                label={t('VeChain Kit')} 
                value={packageJson.version} 
            />
        </>
    );
};
