'use client';

import { Text, Icon, HStack, Button, Image } from '@chakra-ui/react';
import { humanAddress, humanDomain } from '../../../utils';
import { Wallet } from '@/types';
import { MdOutlineNavigateNext } from 'react-icons/md';

type Props = {
    wallet: Wallet;
    size?: string;
    onClick?: () => void;
    mt?: number;
};

export const AccountSelector = ({
    wallet,
    size = 'md',
    onClick,
    mt,
}: Props) => {
    return (
        <HStack mt={mt}>
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
                        {humanDomain(wallet?.domain ?? '', 10, 4) ||
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
