'use client';

import { Text, Icon, HStack, Button, StackProps } from '@chakra-ui/react';
import { humanAddress, humanDomain } from '../../../utils';
import { Wallet } from '@/types';
import { MdOutlineNavigateNext } from 'react-icons/md';
import { AccountAvatar } from '@/components/common';

type Props = {
    wallet: Wallet;
    size?: string;
    onClick?: () => void;
    mt?: number;
    style?: StackProps;
};

export const AccountSelector = ({
    wallet,
    size = 'md',
    onClick,
    mt,
    style,
}: Props) => {
    return (
        <HStack mt={mt} w={'full'} {...style}>
            <Button
                w="fit-content"
                p={2}
                pl={4}
                h={12}
                aria-label="Wallet"
                onClick={onClick}
                variant="vechainKitSelector"
            >
                <HStack spacing={2} align="center">
                    <AccountAvatar
                        wallet={wallet}
                        props={{ width: 7, height: 7 }}
                    />
                    <Text fontSize={size} fontWeight="500">
                        {humanDomain(wallet?.domain ?? '', 20, 0) ||
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
