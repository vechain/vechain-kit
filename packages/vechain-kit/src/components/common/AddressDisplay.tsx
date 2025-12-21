'use client';

import {
    Text,
    VStack,
    Icon,
    PropsOf,
    Input,
    InputGroup,
    InputRightElement,
    InputLeftElement,
    useToken,
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
    const [copied, setCopied] = useState(false);
    const [copiedDomain, setCopiedDomain] = useState(false);

    const textPrimary = useToken('colors', 'vechain-kit-text-primary');
    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');

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
                {wallet?.domain ? (
                    <VStack spacing={2} w={'full'}>
                        <InputGroup>
                            <InputLeftElement>
                                <Icon as={LuSquareUser} color={textSecondary} />
                            </InputLeftElement>
                            <Input
                                value={wallet.domain}
                                readOnly
                                fontSize={'sm'}
                                fontWeight={'700'}
                                color={textPrimary}
                            />
                            <InputRightElement mr={'40px'}>
                                {setCurrentContent && (
                                    <Icon
                                        color={textSecondary}
                                        cursor="pointer"
                                        as={LuPencil}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDomainEdit();
                                        }}
                                    />
                                )}
                            </InputRightElement>
                            <InputRightElement>
                                <Icon
                                    color={textSecondary}
                                    cursor="pointer"
                                    as={copiedDomain ? LuCheck : LuCopy}
                                    onClick={() =>
                                        copyToClipboard(
                                            wallet.domain || '',
                                            setCopiedDomain,
                                        )
                                    }
                                />
                            </InputRightElement>
                        </InputGroup>

                        <InputGroup>
                            <InputLeftElement>
                                <Icon as={LuWallet} color={textSecondary} />
                            </InputLeftElement>
                            <Input
                                value={
                                    showHumanAddress
                                        ? humanAddress(
                                              wallet.address ?? '',
                                              8,
                                              7,
                                          )
                                        : wallet.address
                                }
                                readOnly
                                fontSize={'sm'}
                                fontWeight={'700'}
                                color={textPrimary}
                            />
                            <InputRightElement
                                onClick={() =>
                                    copyToClipboard(
                                        wallet.address ?? '',
                                        setCopied,
                                    )
                                }
                            >
                                <Icon
                                    color={textSecondary}
                                    cursor="pointer"
                                    as={copied ? LuCheck : LuCopy}
                                />
                            </InputRightElement>
                        </InputGroup>
                    </VStack>
                ) : (
                    <InputGroup>
                        <InputLeftElement>
                            <Icon as={LuWallet} color={textSecondary} />
                        </InputLeftElement>
                        <Input
                            value={
                                showHumanAddress
                                    ? humanAddress(wallet?.address ?? '', 6, 4)
                                    : wallet?.address
                            }
                            readOnly
                            fontSize={'sm'}
                            fontWeight={'700'}
                            color={textPrimary}
                        />
                        <InputRightElement
                            onClick={() =>
                                copyToClipboard(
                                    wallet?.address ?? '',
                                    setCopied,
                                )
                            }
                        >
                            <Icon
                                color={textSecondary}
                                cursor="pointer"
                                as={copied ? LuCheck : LuCopy}
                            />
                        </InputRightElement>
                    </InputGroup>
                )}
            </VStack>
        </VStack>
    );
};
