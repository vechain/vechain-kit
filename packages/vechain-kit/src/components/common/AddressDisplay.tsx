'use client';

import {
    Text,
    VStack,
    Icon,
    PropsOf,
    useToken,
    IconButton,
    HStack,
    useColorModeValue,
    useToast,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import {
    LuCopy,
    LuCheck,
    LuWallet,
    LuSquareUser,
    LuPencil,
    LuArrowLeftRight,
} from 'react-icons/lu';
import { humanAddress } from '@/utils';
import {
    copyToClipboard as safeCopyToClipboard,
    isBrowser,
} from '@/utils/ssrUtils';
import { Wallet } from '@/types';
import { AccountModalContentTypes } from '@/components/AccountModal/Types';
import { useTranslation } from 'react-i18next';
import { useWallet } from '@/hooks';

type Props = {
    wallet: Wallet;
    label?: string;
    style?: PropsOf<typeof VStack>;
    showHumanAddress?: boolean;
    setCurrentContent?: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
};

export const AddressDisplay = ({
    wallet,
    label,
    style,
    showHumanAddress = true,
    setCurrentContent,
}: Props) => {
    const { t } = useTranslation();
    const { connection } = useWallet();
    const toast = useToast();

    const [copied, setCopied] = useState(false);
    const [copiedDomain, setCopiedDomain] = useState(false);
    const [isSwitching, setIsSwitching] = useState(false);
    const [debugInfo, setDebugInfo] = useState<string | null>(null);

    const textPrimary = useToken('colors', 'vechain-kit-text-primary');
    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');
    const borderColor = useColorModeValue('#ebebeb', '#ffffff0a');
    const bgColor = useColorModeValue('#ffffff', 'transparent');

    // Debug: Collect connection state info for mobile debugging
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

    const copyToClipboard = async (
        textToCopy: string,
        setCopied: (value: boolean) => void,
    ) => {
        const success = await safeCopyToClipboard(textToCopy);
        if (success) {
            setCopied(true);
            setTimeout(() => {
                setCopied(false);
            }, 2000);
        }
    };

    const handleDomainEdit = () => {
        if (!setCurrentContent) return;

        if (wallet?.domain) {
            setCurrentContent({
                type: 'choose-name-search',
                props: {
                    name: '',
                    setCurrentContent,
                    initialContentSource: 'profile',
                },
            });
        } else {
            setCurrentContent({
                type: 'choose-name',
                props: {
                    setCurrentContent,
                    initialContentSource: 'profile',
                    onBack: () => setCurrentContent('profile'),
                },
            });
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
            const formats = [
                { method: 'thor_switchWallet' },
                'thor_switchWallet',
                { type: 'thor_switchWallet' },
            ];

            let newAddress: string | null = null;
            let lastError: Error | null = null;

            for (const format of formats) {
                try {
                    const result = await vechainSend(format);

                    if (typeof result === 'string' && result) {
                        newAddress = result;
                        break;
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
                }
            }

            if (!newAddress) {
                if (lastError) {
                    throw lastError;
                } else {
                    throw new Error(
                        'All formats tried but no address returned',
                    );
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

    return (
        <VStack w={'full'} justifyContent={'center'} {...style}>
            <VStack w={'full'} spacing={4}>
                {label && (
                    <Text fontSize={'sm'} color={textSecondary}>
                        {label}
                    </Text>
                )}

                <VStack spacing={2} w={'full'}>
                    {wallet?.domain && (
                        <HStack
                            w={'full'}
                            spacing={3}
                            px={4}
                            py={2}
                            borderWidth={1}
                            borderColor={borderColor}
                            borderRadius="md"
                            bg={bgColor}
                        >
                            <Icon as={LuSquareUser} color={textSecondary} />
                            <Text
                                flex={1}
                                fontSize={'sm'}
                                fontWeight={'700'}
                                color={textPrimary}
                                noOfLines={1}
                            >
                                {copiedDomain ? t('Copied!') : wallet.domain}
                            </Text>
                            <HStack spacing={2}>
                                {setCurrentContent && (
                                    <IconButton
                                        icon={<LuPencil />}
                                        height="30px"
                                        borderRadius="5px"
                                        variant="vechainKitSecondary"
                                        onClick={handleDomainEdit}
                                        aria-label="Edit domain"
                                    />
                                )}
                                <IconButton
                                    icon={
                                        copiedDomain ? <LuCheck /> : <LuCopy />
                                    }
                                    height="30px"
                                    borderRadius="5px"
                                    variant="vechainKitSecondary"
                                    onClick={() =>
                                        copyToClipboard(
                                            wallet.domain || '',
                                            setCopiedDomain,
                                        )
                                    }
                                    aria-label="Copy domain"
                                />
                            </HStack>
                        </HStack>
                    )}

                    <HStack
                        w={'full'}
                        spacing={3}
                        px={4}
                        py={2}
                        borderWidth={1}
                        borderColor={borderColor}
                        borderRadius="md"
                        bg={bgColor}
                    >
                        <Icon as={LuWallet} color={textSecondary} />
                        <Text
                            flex={1}
                            fontSize={'sm'}
                            fontWeight={'700'}
                            color={textPrimary}
                            noOfLines={1}
                        >
                            {copied
                                ? t('Copied!')
                                : showHumanAddress
                                ? humanAddress(wallet?.address ?? '', 8, 7)
                                : wallet?.address}
                        </Text>
                        <HStack spacing={2}>
                            {connection.isInAppBrowser && (
                                <IconButton
                                    icon={<LuArrowLeftRight />}
                                    onClick={handleSwitchWallet}
                                    variant="vechainKitSecondary"
                                    height="30px"
                                    w="30px"
                                    borderRadius="5px"
                                    aria-label="Switch wallet"
                                    isLoading={isSwitching}
                                    isDisabled={isSwitching}
                                />
                            )}
                            <IconButton
                                icon={copied ? <LuCheck /> : <LuCopy />}
                                onClick={() =>
                                    copyToClipboard(
                                        wallet?.address ?? '',
                                        setCopied,
                                    )
                                }
                                variant="vechainKitSecondary"
                                height="30px"
                                w="30px"
                                borderRadius="5px"
                                aria-label="Copy address"
                            />
                        </HStack>
                    </HStack>
                </VStack>
            </VStack>
        </VStack>
    );
};
