'use client';

import {
    Text,
    Icon,
    HStack,
    Button,
    Image,
    IconButton,
} from '@chakra-ui/react';
import { humanAddress } from '../../../utils';
import { Wallet } from '@/types';
import { MdOutlineNavigateNext } from 'react-icons/md';
import { RiLogoutBoxLine } from 'react-icons/ri';

type Props = {
    wallet: Wallet;
    size?: string;
    onClick?: () => void;
    mt?: number;
    onDisconnect?: () => void;
};

export const AccountSelector = ({
    wallet,
    size = 'md',
    onClick,
    onDisconnect,
    mt,
}: Props) => {
    return (
        <HStack mt={mt}>
            <IconButton
                p={2}
                h={9}
                icon={<Icon boxSize={5} as={RiLogoutBoxLine} />}
                aria-label="Disconnect"
                variant="vechainKitSelector"
                onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onDisconnect?.();
                }}
            />

            <Button
                w="fit-content"
                p={2}
                pl={4}
                h={9}
                aria-label="Wallet"
                onClick={onClick}
                variant="vechainKitSelector"
            >
                <HStack spacing={2} align="center">
                    <Image
                        src={wallet?.image}
                        alt={wallet?.domain}
                        width={5}
                        height={5}
                        rounded="full"
                    />
                    <Text fontSize={size} fontWeight="500">
                        {wallet?.domain ||
                            humanAddress(wallet?.address ?? '', 6, 4)}
                    </Text>

                    <Icon
                        boxSize={5}
                        as={MdOutlineNavigateNext}
                        cursor="pointer"
                        opacity={0.5}
                    />
                </HStack>
            </Button>
        </HStack>
    );
};
