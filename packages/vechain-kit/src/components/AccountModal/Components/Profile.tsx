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
import { useWallet } from '@/hooks';
import { useVeChainKitConfig } from '@/providers';
import { FaEdit, FaEnvelope, FaGlobe, FaShare } from 'react-icons/fa';
import { RiLogoutBoxLine } from 'react-icons/ri';
import { picasso } from '@vechain/picasso';
import { AccountModalContentTypes } from '../Types';
import { FaXTwitter } from 'react-icons/fa6';

export type ProfileProps = {
    address: string;
    onEditClick?: () => void;
    showHeader?: boolean;
    setCurrentContent?: (content: AccountModalContentTypes) => void;
    onLogoutSuccess?: () => void;
};

export const Profile = ({
    onEditClick,
    address,
    showHeader = true,
    setCurrentContent,
    onLogoutSuccess,
}: ProfileProps) => {
    const { darkMode: isDark } = useVeChainKitConfig();
    const { account, disconnect } = useWallet();

    const baseBackgroundColor = isDark ? 'whiteAlpha.100' : '#00000005';
    const headerImageSvg = picasso(account?.address ?? '');

    const isConnectedAccount = address === account?.address;

    const hasLinks =
        account?.metadata?.url ||
        account?.metadata?.['com.x'] ||
        account?.metadata?.email;

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
                    showHeader
                        ? `no-repeat url('data:image/svg+xml;utf8,${headerImageSvg}')`
                        : 'none'
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
                    wallet={account}
                    props={{
                        width: '100px',
                        height: '100px',
                        boxShadow: '0px 0px 3px 2px #00000024',
                    }}
                />
            </Box>
            <CardBody pt="14" pb="6" backgroundColor={'none'} border={'none'}>
                <VStack w={'full'} spacing={2}>
                    {account?.metadata?.display && (
                        <Text
                            fontSize="xl"
                            fontWeight="bold"
                            w="full"
                            textAlign="center"
                            mt={2}
                        >
                            {account?.metadata?.display}
                        </Text>
                    )}

                    {account?.metadata?.description && (
                        <Text fontSize="sm" opacity={0.7}>
                            {account?.metadata?.description}
                        </Text>
                    )}

                    {hasLinks && (
                        <HStack
                            w={'full'}
                            justify={'center'}
                            spacing={5}
                            mt={4}
                        >
                            {account?.metadata?.email && (
                                <Link
                                    href={`mailto:${account?.metadata?.email}`}
                                    target="_blank"
                                >
                                    <Icon as={FaEnvelope} />
                                </Link>
                            )}
                            {account?.metadata?.url && (
                                <Link
                                    href={account?.metadata?.url}
                                    target="_blank"
                                >
                                    <Icon as={FaGlobe} />
                                </Link>
                            )}
                            {account?.metadata?.['com.x'] && (
                                <Link
                                    href={`https://twitter.com/${account?.metadata?.['com.x']}`}
                                    target="_blank"
                                >
                                    <Icon as={FaXTwitter} />
                                </Link>
                            )}
                        </HStack>
                    )}

                    <AddressDisplay wallet={account} style={{ mt: 4 }} />
                </VStack>
            </CardBody>
            {isConnectedAccount && (
                <CardFooter pt={0} justify="space-between">
                    <VStack w="full" justify="space-between" spacing={4}>
                        <Divider />
                        <HStack w="full" justify="space-between">
                            <Button
                                size="sm"
                                variant="ghost"
                                leftIcon={<Icon as={FaEdit} />}
                                onClick={onEditClick ?? (() => {})}
                            >
                                Edit
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                leftIcon={<Icon as={FaShare} />}
                            >
                                Share
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                leftIcon={<Icon as={RiLogoutBoxLine} />}
                                colorScheme="red"
                                onClick={() =>
                                    setCurrentContent?.({
                                        type: 'disconnect-confirm',
                                        props: {
                                            onDisconnect: () => {
                                                disconnect();
                                                onLogoutSuccess?.();
                                            },
                                            onBack: () =>
                                                setCurrentContent?.('settings'),
                                        },
                                    })
                                }
                            >
                                Logout
                            </Button>
                        </HStack>
                    </VStack>
                </CardFooter>
            )}
        </Card>
    );
};
