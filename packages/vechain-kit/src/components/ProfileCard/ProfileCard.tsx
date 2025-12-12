import {
    Box,
    Button,
    HStack,
    Icon,
    Link,
    Text,
    useToken,
    VStack,
} from '@chakra-ui/react';
import { AccountAvatar, AddressDisplay } from '@/components/common';
import { useWallet, useWalletMetadata } from '@/hooks';
import { LuPencil, LuMail, LuGlobe, LuLogOut } from 'react-icons/lu';
import { FaXTwitter } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';
import { getPicassoImage } from '@/utils';
import { useVeChainKitConfig } from '@/providers';
import { useModal } from '@/providers/ModalProvider';

export type ProfileCardProps = {
    address: string;
    onEditClick?: () => void;
    onLogout?: () => void;
    showHeader?: boolean;
    showLinks?: boolean;
    showDescription?: boolean;
    showDisplayName?: boolean;
    showEdit?: boolean;
};

export const ProfileCard = ({
    onEditClick,
    address,
    showHeader = true,
    onLogout,
    showLinks = true,
    showDescription = true,
    showDisplayName = true,
    showEdit = true,
}: ProfileCardProps) => {
    const { t } = useTranslation();
    const { account, disconnect } = useWallet();
    const { network } = useVeChainKitConfig();
    const { openAccountModal, closeAccountModal } = useModal();

    const textPrimary = useToken('colors', 'vechain-kit-text-primary');
    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');

    const metadata = useWalletMetadata(address, network.type);

    const headerImageSvg = getPicassoImage(address);

    const isConnectedAccount = address === account?.address;

    const hasLinks =
        metadata?.records?.url ||
        metadata?.records?.['com.x'] ||
        metadata?.records?.email;

    const safeHttpUrl = (raw: string): string | null => {
        try {
            const u = new URL(raw);
            return u.protocol === 'http:' || u.protocol === 'https:'
                ? u.toString()
                : null;
        } catch {
            return null;
        }
    };

    return (
        <VStack spacing={4} w="full">
            <Box
                p={0}
                backgroundSize="100% !important"
                backgroundPosition="center"
                position="relative"
                // h="80px"
                background={
                    showHeader ? `no-repeat url('${headerImageSvg}')` : 'none'
                }
                w="100%"
                borderRadius="14px 14px 0 0"
            />
            <AccountAvatar
                wallet={{
                    address,
                    domain: metadata?.domain,
                    image: metadata?.image,
                    isLoadingMetadata: metadata?.isLoading,
                    metadata: metadata?.records,
                }}
                props={{
                    width: '120px',
                    height: '120px',
                    // boxShadow: '0px 0px 3px 2px #00000024',
                }}
            />

            <VStack w={'full'} spacing={2}>
                {showDisplayName && metadata?.records?.display && (
                    <Text
                        fontSize="xl"
                        color={textPrimary}
                        fontWeight="bold"
                        w="full"
                        textAlign="center"
                        mt={2}
                        data-testid="display-name-val"
                    >
                        {metadata?.records?.display}
                    </Text>
                )}

                {showDescription && metadata?.records?.description && (
                    <Text
                        fontSize="sm"
                        color={textSecondary}
                        w="full"
                        textAlign="center"
                        data-testid="description-val"
                    >
                        {metadata?.records?.description}
                    </Text>
                )}

                {showLinks && hasLinks && (
                    <HStack w={'full'} justify={'center'} spacing={5} mt={4}>
                        {metadata?.records?.email && (
                            <Link
                                href={`mailto:${metadata?.records?.email}`}
                                target="_blank"
                                data-testid="mail-link"
                            >
                                <Icon as={LuMail} color={textPrimary} />
                            </Link>
                        )}
                        {metadata?.records?.url && (
                            <Link
                                href={
                                    safeHttpUrl(metadata.records.url) ??
                                    undefined
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                data-testid="website-link"
                            >
                                <Icon as={LuGlobe} color={textPrimary} />
                            </Link>
                        )}
                        {metadata?.records?.['com.x'] && (
                            <Link
                                href={`https://x.com/${encodeURIComponent(
                                    String(metadata.records['com.x']),
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                data-testid="twitter-link"
                            >
                                <Icon as={FaXTwitter} color={textPrimary} />
                            </Link>
                        )}
                    </HStack>
                )}

                <AddressDisplay
                    wallet={{
                        address,
                        domain: metadata?.domain,
                        image: metadata?.image,
                        isLoadingMetadata: metadata?.isLoading,
                        metadata: metadata?.records,
                    }}
                    style={{ mt: 4 }}
                />
            </VStack>

            {isConnectedAccount && showEdit && (
                <HStack w="full" justify="space-between" spacing={4} mt={4}>
                    <Button
                        size="md"
                        width="full"
                        height="40px"
                        variant="vechainKitSecondary"
                        leftIcon={<Icon as={LuPencil} />}
                        onClick={
                            onEditClick ??
                            (() => {
                                openAccountModal({
                                    type: 'account-customization',
                                    props: {
                                        setCurrentContent: () =>
                                            closeAccountModal(),
                                    },
                                });
                            })
                        }
                        data-testid="customize-button"
                    >
                        {t('Customize')}
                    </Button>
                    <Button
                        size="md"
                        width="full"
                        height="40px"
                        variant="vechainKitSecondary"
                        leftIcon={<Icon as={LuLogOut} />}
                        colorScheme="red"
                        onClick={
                            onLogout ??
                            (() => {
                                openAccountModal({
                                    type: 'disconnect-confirm',
                                    props: {
                                        onDisconnect: () => {
                                            disconnect();
                                            closeAccountModal();
                                        },
                                        onBack: () => closeAccountModal(),
                                    },
                                });
                            })
                        }
                        data-testid="logout-button"
                    >
                        {t('Logout')}
                    </Button>
                </HStack>
            )}
        </VStack>
    );
};
