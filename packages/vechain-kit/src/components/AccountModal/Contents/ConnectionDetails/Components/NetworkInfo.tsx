import { getConfig } from '@/config';
import {
    useWallet,
    useFetchPrivyStatus,
    useSmartAccountVersion,
} from '@/hooks';
import { useVeChainKitConfig } from '@/providers';
import { HStack, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import packageJson from '../../../../../../package.json';

export const NetworkInfo = () => {
    const { t } = useTranslation();
    const { darkMode: isDark, network } = useVeChainKitConfig();
    const { connection, smartAccount } = useWallet();
    const { data: privyStatus, isLoading: isPrivyStatusLoading } =
        useFetchPrivyStatus();
    const {
        data: smartAccountVersion,
        isLoading: isSmartAccountVersionLoading,
        error: smartAccountVersionError,
    } = useSmartAccountVersion(smartAccount.address);

    const textColor = isDark ? '#dfdfdd' : '#4d4d4d';

    const InfoRow = ({
        label,
        value,
        isLoading = false,
    }: {
        label: string;
        value: string | number;
        isLoading?: boolean;
    }) => (
        <HStack w="full" justifyContent="space-between">
            <Text fontSize="sm" color={textColor}>
                {label}:
            </Text>
            <Text fontSize="sm" color={textColor}>
                {isLoading ? 'Loading...' : value}
            </Text>
        </HStack>
    );

    const getSmartAccountVersionDisplay = () => {
        if (isSmartAccountVersionLoading) return 'Loading...';

        if (smartAccountVersionError || !smartAccountVersion) {
            return `v1 ${smartAccount.isDeployed ? '' : '(not deployed)'}`;
        }

        return `v${smartAccountVersion} ${
            smartAccount.isDeployed ? '' : '(not deployed)'
        }`;
    };

    return (
        <>
            <InfoRow
                label={t('Connection Type')}
                value={connection.source.type}
                isLoading={connection.isLoading}
            />
            <InfoRow label={t('Network')} value={network.type} />
            <InfoRow
                label={t('Node URL')}
                value={network.nodeUrl || getConfig(network.type).nodeUrl}
            />

            {connection.isConnectedWithPrivy ? (
                <>
                    <InfoRow
                        label={t('Smart Account')}
                        value={getSmartAccountVersionDisplay()}
                        isLoading={isSmartAccountVersionLoading}
                    />
                    <InfoRow
                        label={t('Privy Status')}
                        value={privyStatus || ''}
                        isLoading={isPrivyStatusLoading}
                    />
                </>
            ) : (
                smartAccount.isDeployed && (
                    <InfoRow
                        label={t('Smart Account')}
                        value={getSmartAccountVersionDisplay()}
                        isLoading={isSmartAccountVersionLoading}
                    />
                )
            )}

            <InfoRow label={t('VeChain Kit')} value={packageJson.version} />
        </>
    );
};
