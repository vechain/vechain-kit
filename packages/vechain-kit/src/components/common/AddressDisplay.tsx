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
import { LuCopy, LuCheck, LuWallet, LuSquareUser } from 'react-icons/lu';
import { humanAddress } from '@/utils';
import { copyToClipboard as safeCopyToClipboard } from '@/utils/ssrUtils';
import { Wallet } from '@/types';

type Props = {
    wallet: Wallet;
    label?: string;
    style?: PropsOf<typeof VStack>;
    showHumanAddress?: boolean;
};

export const AddressDisplay = ({
    wallet,
    label,
    style,
    showHumanAddress = true,
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
                        <InputGroup
                            onClick={() =>
                                copyToClipboard(
                                    wallet.domain || '',
                                    setCopiedDomain,
                                )
                            }
                        >
                            <InputLeftElement>
                                <Icon as={LuSquareUser} color={textSecondary} />
                            </InputLeftElement>
                            <Input
                                cursor="pointer"
                                value={wallet.domain}
                                readOnly
                                fontSize={'sm'}
                                fontWeight={'700'}
                                color={textPrimary}
                                onClick={() =>
                                    copyToClipboard(
                                        wallet.domain || '',
                                        setCopiedDomain,
                                    )
                                }
                            />
                            <InputRightElement>
                                <Icon
                                    color={textSecondary}
                                    cursor="pointer"
                                    as={copiedDomain ? LuCheck : LuCopy}
                                />
                            </InputRightElement>
                        </InputGroup>

                        <InputGroup
                            onClick={() =>
                                copyToClipboard(wallet.address ?? '', setCopied)
                            }
                        >
                            <InputLeftElement>
                                <Icon as={LuWallet} color={textSecondary} />
                            </InputLeftElement>
                            <Input
                                cursor="pointer"
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
                                onClick={() =>
                                    copyToClipboard(
                                        wallet.address ?? '',
                                        setCopied,
                                    )
                                }
                            />
                            <InputRightElement>
                                <Icon
                                    color={textSecondary}
                                    cursor="pointer"
                                    as={copied ? LuCheck : LuCopy}
                                />
                            </InputRightElement>
                        </InputGroup>
                    </VStack>
                ) : (
                    <InputGroup
                        onClick={() =>
                            copyToClipboard(wallet?.address ?? '', setCopied)
                        }
                    >
                        <InputLeftElement>
                            <Icon as={LuWallet} color={textSecondary} />
                        </InputLeftElement>
                        <Input
                            cursor="pointer"
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
                        <InputRightElement>
                            <Icon
                                color={textSecondary}
                                onClick={() =>
                                    copyToClipboard(
                                        wallet?.address ?? '',
                                        setCopied,
                                    )
                                }
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
