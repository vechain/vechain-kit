import {
    Box,
    Button,
    Card,
    CardBody,
    CardFooter,
    Divider,
    HStack,
    Icon,
    Link,
    Text,
    VStack,
} from '@chakra-ui/react';
import { AccountAvatar, AddressDisplay } from '@/components/common';
import {
    useGetAvatar,
    useGetTextRecords,
    useVechainDomain,
    useWallet,
} from '@/hooks';
import { useVeChainKitConfig } from '@/providers';
import { FaEdit, FaEnvelope, FaGlobe } from 'react-icons/fa';
import { RiLogoutBoxLine } from 'react-icons/ri';
import { FaXTwitter } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';
import { convertUriToUrl, getPicassoImage } from '@/utils';

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

    const { darkMode: isDark, network } = useVeChainKitConfig();
    const { account } = useWallet();

    const activeAccountDomain = useVechainDomain(address);
    const activeAccountAvatar = useGetAvatar(activeAccountDomain?.data?.domain);
    const activeAccountTextRecords = useGetTextRecords(
        activeAccountDomain?.data?.domain,
    );
    const baseBackgroundColor = isDark ? 'whiteAlpha.100' : '#00000005';
    const headerImageSvg = getPicassoImage(address);

    const isConnectedAccount = address === account?.address;

    const hasLinks =
        activeAccountTextRecords?.data?.url ||
        activeAccountTextRecords?.data?.['com.x'] ||
        activeAccountTextRecords?.data?.email;

    return (
        <Card
            bg={baseBackgroundColor}
            borderRadius="xl"
            width="full"
            position="relative"
            overflow="visible"
        >
            <Box
                p={0}
                backgroundSize="100% !important"
                backgroundPosition="center"
                position="relative"
                h="80px"
                background={
                    showHeader ? `no-repeat url('${headerImageSvg}')` : 'none'
                }
                w="100%"
                borderRadius="14px 14px 0 0"
            />
            <Box
                position="absolute"
                top="30px"
                left="50%"
                transform="translateX(-50%)"
            >
                <AccountAvatar
                    wallet={{
                        address,
                        domain: activeAccountDomain?.data?.domain,
                        image:
                            convertUriToUrl(
                                activeAccountAvatar?.data ?? '',
                                network.type,
                            ) ?? getPicassoImage(address),
                        isLoadingMetadata:
                            activeAccountAvatar?.isLoading ||
                            activeAccountDomain?.isLoading ||
                            activeAccountTextRecords?.isLoading,
                        metadata: activeAccountTextRecords?.data,
                    }}
                    props={{
                        width: '100px',
                        height: '100px',
                        boxShadow: '0px 0px 3px 2px #00000024',
                    }}
                />
            </Box>
            <CardBody pt="14" pb="6" backgroundColor={'none'} border={'none'}>
                <VStack w={'full'} spacing={2}>
                    {showDisplayName &&
                        activeAccountTextRecords?.data?.display && (
                            <Text
                                fontSize="xl"
                                fontWeight="bold"
                                w="full"
                                textAlign="center"
                                mt={2}
                            >
                                {activeAccountTextRecords?.data?.display}
                            </Text>
                        )}

                    {showDescription &&
                        activeAccountTextRecords?.data?.description && (
                            <Text fontSize="sm" opacity={0.7}>
                                {activeAccountTextRecords?.data?.description}
                            </Text>
                        )}

                    {showLinks && hasLinks && (
                        <HStack
                            w={'full'}
                            justify={'center'}
                            spacing={5}
                            mt={4}
                        >
                            {activeAccountTextRecords?.data?.email && (
                                <Link
                                    href={`mailto:${activeAccountTextRecords?.data?.email}`}
                                    target="_blank"
                                >
                                    <Icon as={FaEnvelope} />
                                </Link>
                            )}
                            {activeAccountTextRecords?.data?.url && (
                                <Link
                                    href={activeAccountTextRecords?.data?.url}
                                    target="_blank"
                                >
                                    <Icon as={FaGlobe} />
                                </Link>
                            )}
                            {activeAccountTextRecords?.data?.['com.x'] && (
                                <Link
                                    href={`https://x.com/${activeAccountTextRecords?.data?.['com.x']}`}
                                    target="_blank"
                                >
                                    <Icon as={FaXTwitter} />
                                </Link>
                            )}
                        </HStack>
                    )}

                    <AddressDisplay
                        wallet={{
                            address,
                            domain: activeAccountDomain?.data?.domain,
                            image:
                                convertUriToUrl(
                                    activeAccountAvatar?.data ?? '',
                                    network.type,
                                ) ?? getPicassoImage(address),
                            isLoadingMetadata:
                                activeAccountAvatar?.isLoading ||
                                activeAccountDomain?.isLoading ||
                                activeAccountTextRecords?.isLoading,
                            metadata: activeAccountTextRecords?.data,
                        }}
                        style={{ mt: 4 }}
                    />
                </VStack>
            </CardBody>
            {isConnectedAccount && showEdit && (
                <CardFooter pt={0} justify="space-between">
                    <VStack w="full" justify="space-between" spacing={4}>
                        <Divider />
                        <HStack w="full" justify="space-around">
                            <Button
                                size="sm"
                                variant="ghost"
                                leftIcon={<Icon as={FaEdit} />}
                                onClick={onEditClick ?? (() => {})}
                            >
                                {t('Edit')}
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                leftIcon={<Icon as={RiLogoutBoxLine} />}
                                colorScheme="red"
                                onClick={onLogout}
                            >
                                {t('Logout')}
                            </Button>
                        </HStack>
                    </VStack>
                </CardFooter>
            )}
        </Card>
    );
};
