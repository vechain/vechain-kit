'use client';

import {
    Text,
    Icon,
    HStack,
    Button,
    StackProps,
    IconButton,
    useToast,
} from '@chakra-ui/react';
import { humanAddress, humanDomain } from '../../../utils';
import { copyToClipboard, isBrowser } from '@/utils/ssrUtils';
import { Wallet } from '@/types';
import {
    LuChevronRight,
    LuCheck,
    LuCopy,
    LuArrowLeftRight,
} from 'react-icons/lu';
import { AccountAvatar } from '@/components/common';
import { useState } from 'react';
import { AccountModalContentTypes } from '../Types/Types';
import { useTranslation } from 'react-i18next';
import { useWallet } from '@/hooks';

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
    const { t } = useTranslation();
    const { connection } = useWallet();
    const toast = useToast();

    const [copied, setCopied] = useState(false);
    const [isSwitching, setIsSwitching] = useState(false);
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

    const handleSwitchWallet = async () => {
        if (!isBrowser() || !window.vechain) {
            return;
        }

        // Type assertion to access request method
        const vechainRequest = (window.vechain as any).request;
        if (!vechainRequest) {
            return;
        }

        setIsSwitching(true);
        try {
            const newAddress = await vechainRequest('thor_switchWallet');
            if (newAddress) {
                toast({
                    title: 'Wallet switched',
                    description: 'Successfully switched to a new wallet',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            }
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : String(error) || 'Failed to switch wallet';

            // Check if error is about "remember me" not being enabled
            if (
                errorMessage.toLowerCase().includes('cannot switch wallet') ||
                errorMessage.toLowerCase().includes('remember me') ||
                errorMessage.toLowerCase().includes('kept signed in') ||
                errorMessage.toLowerCase().includes('user cannot switch')
            ) {
                toast({
                    title: 'Cannot switch wallet',
                    description:
                        'Please enable "Remember me" in VeWorld to switch wallets',
                    status: 'warning',
                    duration: 5000,
                    isClosable: true,
                });
            } else {
                toast({
                    title: 'Error',
                    description: errorMessage,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
        } finally {
            setIsSwitching(false);
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
                            {copied
                                ? t('Copied!')
                                : humanDomain(wallet?.domain ?? '', 22, 0) ||
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

            {connection.isInAppBrowser ? (
                <IconButton
                    aria-label="Switch wallet"
                    icon={<Icon as={LuArrowLeftRight} />}
                    onClick={handleSwitchWallet}
                    w="60px"
                    h={12}
                    variant="vechainKitSecondary"
                    p={3}
                    isLoading={isSwitching}
                    isDisabled={isSwitching}
                />
            ) : (
                <IconButton
                    aria-label="Copy address"
                    icon={<Icon as={copied ? LuCheck : LuCopy} />}
                    onClick={handleCopyToClipboard}
                    w="60px"
                    h={12}
                    variant="vechainKitSecondary"
                    p={3}
                />
            )}

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
