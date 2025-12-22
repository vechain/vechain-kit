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
} from '@chakra-ui/react';
import { useState } from 'react';
import {
    LuCopy,
    LuCheck,
    LuWallet,
    LuSquareUser,
    LuPencil,
} from 'react-icons/lu';
import { humanAddress } from '@/utils';
import { copyToClipboard as safeCopyToClipboard } from '@/utils/ssrUtils';
import { Wallet } from '@/types';
import { AccountModalContentTypes } from '@/components/AccountModal/Types';
import { useTranslation } from 'react-i18next';

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
    const [copied, setCopied] = useState(false);
    const [copiedDomain, setCopiedDomain] = useState(false);

    const textPrimary = useToken('colors', 'vechain-kit-text-primary');
    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');
    const borderColor = useColorModeValue('#ebebeb', '#ffffff0a');
    const bgColor = useColorModeValue('#ffffff', 'transparent');

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
