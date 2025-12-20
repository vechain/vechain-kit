import {
    Box,
    HStack,
    Icon,
    Link,
    Text,
    useToken,
    VStack,
} from '@chakra-ui/react';
import { AccountAvatar, AddressDisplay } from '@/components/common';
import { useWalletMetadata } from '@/hooks';
import { LuMail, LuGlobe } from 'react-icons/lu';
import { FaXTwitter } from 'react-icons/fa6';
import { getPicassoImage } from '@/utils';
import { useVeChainKitConfig } from '@/providers';

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
    address,
    showHeader = true,
    showLinks = true,
    showDescription = true,
    showDisplayName = true,
}: ProfileCardProps) => {
    const { network } = useVeChainKitConfig();

    const textPrimary = useToken('colors', 'vechain-kit-text-primary');
    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');

    const metadata = useWalletMetadata(address, network.type);

    const headerImageSvg = getPicassoImage(address);

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
        <VStack spacing={0} w="full">
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
        </VStack>
    );
};
