'use client';

import {
    Text,
    Icon,
    HStack,
    Button,
    StackProps,
    IconButton,
} from '@chakra-ui/react';
import { humanAddress, humanDomain } from '../../../utils';
import { Wallet } from '@/types';
import { MdOutlineNavigateNext } from 'react-icons/md';
import { AccountAvatar } from '@/components/common';
import { useState } from 'react';
import { IoCheckmarkOutline, IoCopyOutline } from 'react-icons/io5';

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
    const [copied, setCopied] = useState(false);

    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(
            wallet?.domain ?? wallet?.address ?? '',
        );
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };
    return (
        <HStack
            mt={mt}
            w={'full'}
            {...style}
            justifyContent={'flex-start'}
            alignItems={'center'}
        >
            <Button
                w="full"
                h={12}
                aria-label="Wallet"
                onClick={onClick}
                variant="mainContentButton"
                data-testid="profile-button"
            >
                <HStack
                    spacing={2}
                    align="center"
                    justifyContent={'space-between'}
                    w={'full'}
                >
                    <HStack spacing={2} justifyContent={'flex-start'}>
                        <AccountAvatar
                            wallet={wallet}
                            props={{ width: 7, height: 7 }}
                        />
                        <Text fontSize={size} fontWeight="500">
                            {humanDomain(wallet?.domain ?? '', 22, 0) ||
                                humanAddress(wallet?.address ?? '', 6, 4)}
                        </Text>
                    </HStack>

                    <Icon
                        boxSize={5}
                        as={MdOutlineNavigateNext}
                        cursor="pointer"
                        opacity={0.5}
                    />
                </HStack>
            </Button>

            <IconButton
                aria-label="Copy address"
                icon={<Icon as={copied ? IoCheckmarkOutline : IoCopyOutline} />}
                onClick={copyToClipboard}
                variant="ghost"
                size="sm"
                opacity={0.5}
                _hover={{ opacity: 0.8 }}
            />
        </HStack>
    );
};
