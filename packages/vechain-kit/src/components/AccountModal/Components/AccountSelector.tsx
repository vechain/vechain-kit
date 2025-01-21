'use client';

import { Text, Icon, HStack, Button } from '@chakra-ui/react';
import { humanAddress } from '../../../utils';
import { useState } from 'react';
import { IoCheckmarkOutline, IoCopyOutline } from 'react-icons/io5';
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
    const [copied, setCopied] = useState(false);

    const copyToClipboard = async (textToCopy: string) => {
        await navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };

    return (
        <HStack mt={mt}>
            <Button
                p={2}
                px={4}
                h={9}
                variant="vechainKitSelector"
                onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    copyToClipboard(wallet.address ?? '');
                }}
            >
                <Icon
                    boxSize={5}
                    as={copied ? IoCheckmarkOutline : IoCopyOutline}
                />
            </Button>

            <Button
                w="fit-content"
                p={2}
                pl={4}
                h={9}
                onClick={onClick}
                variant="vechainKitSelector"
            >
                <HStack spacing={2} align="center">
                    <Text fontSize={size} fontWeight="500">
                        {wallet.domain ||
                            humanAddress(wallet.address ?? '', 6, 4)}
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
