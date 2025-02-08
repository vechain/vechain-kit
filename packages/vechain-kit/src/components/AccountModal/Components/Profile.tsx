import {
    Box,
    Button,
    Card,
    CardBody,
    CardFooter,
    Icon,
} from '@chakra-ui/react';
import { AccountAvatar, AddressDisplay } from '@/components/common';
import { useWallet } from '@/hooks';
import { useVeChainKitConfig } from '@/providers';
import { FaEdit } from 'react-icons/fa';
import { picasso } from '@vechain/picasso';

type ProfileProps = {
    onEditClick: () => void;
};

export const Profile = ({ onEditClick }: ProfileProps) => {
    const { darkMode: isDark } = useVeChainKitConfig();
    const { account } = useWallet();

    const baseBackgroundColor = isDark ? 'whiteAlpha.100' : '#00000005';

    const headerImageSvg = picasso(account?.address ?? '');

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
                background={`no-repeat url('data:image/svg+xml;utf8,${headerImageSvg}')`}
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
                <AddressDisplay wallet={account} />
            </CardBody>
            <CardFooter pt={0} justify="center">
                <Button
                    size="sm"
                    variant="ghost"
                    leftIcon={<Icon as={FaEdit} />}
                    onClick={onEditClick}
                >
                    Edit
                </Button>
            </CardFooter>
        </Card>
    );
};
