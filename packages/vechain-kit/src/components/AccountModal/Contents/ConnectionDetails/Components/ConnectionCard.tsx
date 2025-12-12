import { getConfig } from '@/config';
import {
    useFetchAppInfo,
    useWallet,
    useFetchPrivyStatus,
    useGetAccountVersion,
} from '@/hooks';
import { useVeChainKitConfig } from '@/providers';
import {
    VStack,
    Text,
    Spinner,
    HStack,
    useToken,
    useClipboard,
    Icon,
    Divider,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { CrossAppConnectionCache } from '@/types';
import { useWallet as useWalletDappKit } from '@vechain/dapp-kit-react';
import packageJson from '../../../../../../package.json';
import { humanAddress } from '@/utils';
import { LuCheck, LuCopy } from 'react-icons/lu';

// Get DAppKit version from package.json (this is the version constraint, not the installed version)
const dappKitVersion =
    packageJson.dependencies?.['@vechain/dapp-kit-react'] ||
    packageJson.peerDependencies?.['@vechain/dapp-kit-react'] ||
    'unknown';

// Get Privy version from package.json
const privyVersion =
    packageJson.dependencies?.['@privy-io/react-auth'] || 'unknown';

type Props = {
    connectionCache?: CrossAppConnectionCache;
};

export const ConnectionCard = ({ connectionCache }: Props) => {
    const { t } = useTranslation();
    const { connection, smartAccount, connectedWallet } = useWallet();
    const { source: sourceDappKit } = useWalletDappKit();
    const { privy, network } = useVeChainKitConfig();

    const { data: appInfo, isLoading: isPrivyLoading } = useFetchAppInfo(
        privy?.appId ?? '',
    );

    const { onCopy, hasCopied } = useClipboard('');

    const { data: privyStatus, isLoading: isPrivyStatusLoading } =
        useFetchPrivyStatus();

    const { data: accountVersion, isLoading: isAccountVersionLoading } =
        useGetAccountVersion(
            smartAccount.address ?? '',
            connectedWallet?.address ?? '',
        );

    const cardBg = useToken('colors', 'vechain-kit-card');
    const textColorSecondary = useToken('colors', 'vechain-kit-text-secondary');
    const textPrimary = useToken('colors', 'vechain-kit-text-primary');

    const getConnectionName = (): string | null => {
        if (
            connection.isConnectedWithCrossApp &&
            connectionCache?.ecosystemApp
        ) {
            return connectionCache.ecosystemApp.name;
        }
        if (connection.isConnectedWithSocialLogin && appInfo) {
            return Object.values(appInfo)[0].name;
        }
        if (connection.isConnectedWithDappKit && sourceDappKit) {
            return sourceDappKit;
        }
        return null;
    };

    const connectionName = getConnectionName();
    const isLoading = connection.isConnectedWithSocialLogin && isPrivyLoading;

    const InfoRow = ({
        label,
        value,
        isLoading: isLoadingRow = false,
        href,
    }: {
        label: string;
        value: string | number;
        isLoading?: boolean;
        href?: string;
    }) => (
        <HStack w="full" justifyContent="space-between">
            <Text fontSize="sm" color={textPrimary}>
                {label}:
            </Text>
            <Text
                fontSize="sm"
                as={href ? 'a' : undefined}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: href ? 'underline' : 'none' }}
                color={textColorSecondary}
            >
                {isLoadingRow ? 'Loading...' : value}
            </Text>
        </HStack>
    );

    if (isLoading) {
        return (
            <VStack w="full" h="full" justify="center" align="center">
                <Spinner />
            </VStack>
        );
    }

    if (!connectionName) {
        return null;
    }

    return (
        <VStack
            p={4}
            bg={cardBg}
            borderRadius={'xl'}
            spacing={4}
            w="full"
            justifyContent="space-between"
        >
            <InfoRow label={t('Logged in with')} value={connectionName} />

            {connection.isConnectedWithCrossApp &&
                connectionCache?.timestamp && (
                    <InfoRow
                        label={t('At')}
                        value={new Date(
                            connectionCache.timestamp,
                        ).toLocaleString()}
                    />
                )}

            <InfoRow
                label={t('Connection Type')}
                value={connection.source.type}
                isLoading={connection.isLoading}
            />

            <Divider />

            <InfoRow label={t('Network')} value={network.type} />
            <InfoRow
                label={t('Node URL')}
                value={network.nodeUrl || getConfig(network.type).nodeUrl}
            />

            {connection.isConnectedWithPrivy && <Divider />}

            {connection.isConnectedWithPrivy && (
                <HStack w="full" justifyContent="space-between">
                    <Text fontSize="sm" color={textPrimary}>
                        {t('Embedded wallet')}:
                    </Text>

                    <HStack>
                        <Text fontSize="sm" color={textColorSecondary}>
                            {humanAddress(connectedWallet?.address ?? '', 8, 7)}
                        </Text>

                        <Icon
                            color={textColorSecondary}
                            onClick={() =>
                                onCopy(connectedWallet?.address ?? '')
                            }
                            cursor="pointer"
                            as={hasCopied ? LuCheck : LuCopy}
                        />
                    </HStack>
                </HStack>
            )}

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

            <Divider />

            <InfoRow
                label={t('VeChain Kit')}
                value={packageJson.version}
                href={`https://github.com/vechain/vechain-kit/releases/tag/${packageJson.version}`}
            />

            <InfoRow label={'DAppKit'} value={dappKitVersion} />

            <InfoRow label={'Privy'} value={privyVersion} />
        </VStack>
    );
};
