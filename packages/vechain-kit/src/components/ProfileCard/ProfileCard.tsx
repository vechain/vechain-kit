import {
    Box,
    Button,
    Card,
    CardBody,
    CardBodyProps,
    CardFooter,
    CardFooterProps,
    CardProps,
    Divider,
    HStack,
    Icon,
    Link,
    Text,
    VStack,
} from '@chakra-ui/react';
import { AccountAvatar, AddressDisplay } from '@/components/common';
import { useWallet, useWalletMetadata } from '@/hooks';
import { FaEdit, FaEnvelope, FaGlobe } from 'react-icons/fa';
import { RiLogoutBoxLine } from 'react-icons/ri';
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
    style?: {
        card?: CardProps;
        body?: CardBodyProps;
        footer?: CardFooterProps;
    };
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
    style,
}: ProfileCardProps) => {
    const { t } = useTranslation();
    const { account, disconnect } = useWallet();
    const { network } = useVeChainKitConfig();
    const { openAccountModal, closeAccountModal } = useModal();

    const metadata = useWalletMetadata(address, network.type);

    const headerImageSvg = getPicassoImage(address);

    const isConnectedAccount = address === account?.address;

    const hasLinks =
        metadata?.records?.url ||
        metadata?.records?.['com.x'] ||
        metadata?.records?.email;

    return (
        <Card variant="vechainKitBase" {...style?.card}>
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
            </Box>
            <CardBody
                mt={'60px'}
                backgroundColor={'none'}
                border={'none'}
                {...style?.body}
            >
                <VStack w={'full'} spacing={2}>
                    {showDisplayName && metadata?.records?.display && (
                        <Text
                            fontSize="xl"
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
                            opacity={0.7}
                            w="full"
                            textAlign="center"
                            data-testid="description-val"
                        >
                            {metadata?.records?.description}
                        </Text>
                    )}

                    {showLinks && hasLinks && (
                        <HStack
                            w={'full'}
                            justify={'center'}
                            spacing={5}
                            mt={4}
                        >
                            {metadata?.records?.email && (
                                <Link
                                    href={`mailto:${metadata?.records?.email}`}
                                    target="_blank"
                                    data-testid="mail-link"
                                >
                                    <Icon as={FaEnvelope} />
                                </Link>
                            )}
                            {metadata?.records?.url && (
                                <Link
                                    href={metadata?.records?.url}
                                    target="_blank"
                                    data-testid="website-link"
                                >
                                    <Icon as={FaGlobe} />
                                </Link>
                            )}
                            {metadata?.records?.['com.x'] && (
                                <Link
                                    href={`https://x.com/${metadata?.records?.['com.x']}`}
                                    target="_blank"
                                    data-testid="twitter-link"
                                >
                                    <Icon as={FaXTwitter} />
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
            </CardBody>
            {isConnectedAccount && showEdit && (
                <CardFooter justify="space-between" {...style?.footer}>
                    <VStack w="full" justify="space-between" spacing={4}>
                        <Divider />
                        <HStack w="full" justify="space-between">
                            <Button
                                size="md"
                                width="full"
                                height="40px"
                                variant="ghost"
                                leftIcon={<Icon as={FaEdit} />}
                                onClick={onEditClick ?? (() => {
                                    openAccountModal({
                                        type: 'account-customization',
                                        props: {
                                            setCurrentContent: () => closeAccountModal(),
                                        },
                                    });
                                })}
                                data-testid="customize-button"
                            >
                                {t('Customize')}
                            </Button>
                            <Button
                                size="md"
                                width="full"
                                height="40px"
                                variant="ghost"
                                leftIcon={<Icon as={RiLogoutBoxLine} />}
                                colorScheme="red"
                                onClick={onLogout ?? (() => {
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
                                })}
                                data-testid="logout-button"
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
