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
import { copyToClipboard } from '@/utils/ssrUtils';
import { Wallet } from '@/types';
import { LuChevronRight, LuCheck, LuCopy } from 'react-icons/lu';
import { AccountAvatar } from '@/components/common';
import { useState } from 'react';
import { AccountModalContentTypes } from '../Types/Types';
// import { useWallet } from '@/hooks';

type Props = {
    wallet: Wallet;
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
    size?: string;
    onClick?: () => void;
    onClose: () => void;
    mt?: number;
    style?: StackProps;
};

export const AccountSelector = ({
    wallet,
    // setCurrentContent,
    size = 'md',
    onClick,
    // onClose,
    mt,
    style,
}: Props) => {
    const [copied, setCopied] = useState(false);
    // const { disconnect } = useWallet();

    const handleCopyToClipboard = async () => {
        const success = await copyToClipboard(
            wallet?.domain ?? wallet?.address ?? '',
        );
        if (success) {
            setCopied(true);
            setTimeout(() => {
                setCopied(false);
            }, 2000);
        }
    };

    // const handleLogout = () => {
    //     disconnect();
    //     onClose();
    // };

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
                variant="vechainKitSecondary"
                p={3}
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
                        as={LuChevronRight}
                        cursor="pointer"
                        opacity={0.5}
                    />
                </HStack>
            </Button>

            <IconButton
                aria-label="Copy address"
                icon={<Icon as={copied ? LuCheck : LuCopy} />}
                onClick={handleCopyToClipboard}
                variant="ghost"
                size="sm"
                opacity={0.5}
                _hover={{ opacity: 0.8 }}
            />

            {/* <IconButton
                aria-label="Logout"
                icon={<Icon as={LuLogOut} />}
                onClick={() =>
                    setCurrentContent({
                        type: 'disconnect-confirm',
                        props: {
                            onDisconnect: handleLogout,
                            onBack: () => setCurrentContent('main'),
                        },
                    })
                }
                variant="ghost"
                size="sm"
                opacity={0.5}
                _hover={{ opacity: 0.8 }}
                colorScheme="red"
            /> */}
        </HStack>
    );
};
