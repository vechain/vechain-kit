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
import { useState, useEffect } from 'react';
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
    const [debugInfo, setDebugInfo] = useState<string | null>(null);
    // const { disconnect } = useWallet();

    // Debug: Show connection state in UI for mobile debugging
    useEffect(() => {
        if (isBrowser() && window.vechain) {
            const vechainAny = window.vechain as any;
            const info = [
                `isInAppBrowser: ${connection.isInAppBrowser}`,
                `window.vechain exists: ${!!window.vechain}`,
                `window.vechain.isInAppBrowser: ${window.vechain.isInAppBrowser}`,
                `has send method: ${!!vechainAny.send}`,
                `has request method: ${!!vechainAny.request}`,
                `window.vechain keys: ${Object.keys(window.vechain).join(
                    ', ',
                )}`,
            ].join('\n');
            setDebugInfo(info);
        } else {
            setDebugInfo(
                `isBrowser: ${isBrowser()}\nwindow.vechain: ${!!window.vechain}`,
            );
        }
    }, [connection.isInAppBrowser]);

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
        if (!isBrowser()) {
            toast({
                title: 'Error',
                description: 'Not in browser environment',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            return;
        }

        if (!window.vechain) {
            toast({
                title: 'Error',
                description: `VeWorld API not available.\n\nDebug info:\n${
                    debugInfo || 'No debug info available'
                }`,
                status: 'error',
                duration: 10000,
                isClosable: true,
            });
            return;
        }

        // Try to access send method (VeWorld uses 'send' instead of 'request')
        const vechainSend = (window.vechain as any).send;

        if (!vechainSend) {
            toast({
                title: 'Error: send method not found',
                description: `window.vechain.send is not available.\n\nAvailable keys: ${Object.keys(
                    window.vechain,
                ).join(', ')}\n\nDebug info:\n${debugInfo || 'N/A'}`,
                status: 'error',
                duration: 15000,
                isClosable: true,
            });
            return;
        }

        setIsSwitching(true);
        try {
            // Try different formats for the send method
            // The VeWorld API might use different formats, so we try multiple
            const formats = [
                { method: 'thor_switchWallet' }, // Format 1: object with method
                'thor_switchWallet', // Format 2: direct string
                { type: 'thor_switchWallet' }, // Format 3: object with type
            ];

            let newAddress: string | null = null;
            let lastError: Error | null = null;

            for (const format of formats) {
                try {
                    const result = await vechainSend(format);
                    
                    // Extract address from different possible result formats
                    if (typeof result === 'string' && result) {
                        newAddress = result;
                        break; // Success, stop trying other formats
                    } else if (result && typeof result === 'object') {
                        if (result.address) {
                            newAddress = result.address;
                            break;
                        } else if (result.result) {
                            newAddress = result.result;
                            break;
                        } else if (result.data) {
                            newAddress = result.data;
                            break;
                        }
                    }
                } catch (e) {
                    lastError = e instanceof Error ? e : new Error(String(e));
                    // Continue to next format
                }
            }

            if (!newAddress) {
                if (lastError) {
                    throw lastError;
                } else {
                    throw new Error('All formats tried but no address returned');
                }
            }

            if (newAddress) {
                toast({
                    title: 'Wallet switched',
                    description: `Successfully switched to: ${newAddress.slice(
                        0,
                        6,
                    )}...${newAddress.slice(-4)}`,
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            } else {
                toast({
                    title: 'Warning',
                    description:
                        'Switch wallet returned no address. The method completed but returned null/undefined.',
                    status: 'warning',
                    duration: 5000,
                    isClosable: true,
                });
            }
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : String(error) || 'Failed to switch wallet';

            const fullErrorDetails =
                error instanceof Error
                    ? `Message: ${error.message}\nName: ${
                          error.name
                      }\nStack: ${error.stack?.substring(0, 200)}`
                    : `Error: ${String(error)}`;

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
                    title: 'Error switching wallet',
                    description: `${errorMessage}\n\nFull error:\n${fullErrorDetails}`,
                    status: 'error',
                    duration: 15000,
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
                    data-testid="switch-wallet-button"
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
