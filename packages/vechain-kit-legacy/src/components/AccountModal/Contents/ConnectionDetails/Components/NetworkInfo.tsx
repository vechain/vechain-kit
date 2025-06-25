import { getConfig } from '@/config';
import { useWallet, useFetchPrivyStatus, useGetAccountVersion } from '@/hooks';
import { useVeChainKitConfig } from '@/providers';
import { HStack, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import packageJson from '../../../../../../package.json';

export const NetworkInfo = () => {
    const { t } = useTranslation();
    const { darkMode: isDark, network } = useVeChainKitConfig();
    const { connection, smartAccount, connectedWallet } = useWallet();
    const { data: privyStatus, isLoading: isPrivyStatusLoading } =
        useFetchPrivyStatus();

    const { data: accountVersion, isLoading: isAccountVersionLoading } =
        useGetAccountVersion(
            smartAccount.address ?? '',
            connectedWallet?.address ?? '',
        );

    const textColor = isDark ? '#dfdfdd' : '#4d4d4d';

    const InfoRow = ({
        label,
        value,
        isLoading = false,
        href,
    }: {
        label: string;
        value: string | number;
        isLoading?: boolean;
        href?: string;
    }) => (
        <HStack w="full" justifyContent="space-between">
            <Text fontSize="sm" color={textColor}>
                {label}:
            </Text>
            <Text
                fontSize="sm"
                color={textColor}
                as={href ? 'a' : undefined}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: href ? 'underline' : 'none' }}
            >
                {isLoading ? 'Loading...' : value}
            </Text>
        </HStack>
    );

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
                        value={`v${accountVersion?.version ?? ''} ${
                            accountVersion?.isDeployed ? '' : '(not deployed)'
                        }`}
                        isLoading={isAccountVersionLoading}
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
                        value={`v${accountVersion?.version ?? ''}`}
                        isLoading={isAccountVersionLoading}
                    />
                )
            )}

            <InfoRow
                label={t('VeChain Kit')}
                value={packageJson.version}
                href={`https://github.com/vechain/vechain-kit/releases/tag/${packageJson.version}`}
            />
        </>
    );
};
