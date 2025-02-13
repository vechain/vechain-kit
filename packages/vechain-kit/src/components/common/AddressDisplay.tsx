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
} from '@chakra-ui/react';
import { useState } from 'react';
import { IoCopyOutline, IoCheckmarkOutline } from 'react-icons/io5';
import { humanAddress } from '@/utils';
import { Wallet } from '@/types';
import { FaRegAddressCard } from 'react-icons/fa';
import { HiOutlineWallet } from 'react-icons/hi2';

type Props = {
    wallet: Wallet;
    label?: string;
    style?: PropsOf<typeof VStack>;
};

export const AddressDisplay = ({ wallet, label, style }: Props) => {
    const [copied, setCopied] = useState(false);
    const [copiedDomain, setCopiedDomain] = useState(false);

    const copyToClipboard = async (
        textToCopy: string,
        setCopied: (value: boolean) => void,
    ) => {
        await navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };

    return (
        <VStack w={'full'} justifyContent={'center'} {...style}>
            <VStack w={'full'} spacing={4}>
                {label && (
                    <Text fontSize={'sm'} opacity={0.7}>
                        {label}
                    </Text>
                )}
                {wallet?.domain ? (
                    <VStack spacing={2} w={'full'}>
                        <InputGroup>
                            <InputLeftElement>
                                <Icon as={FaRegAddressCard} opacity={0.5} />
                            </InputLeftElement>
                            <Input
                                cursor="pointer"
                                value={wallet.domain}
                                readOnly
                                onClick={() =>
                                    copyToClipboard(
                                        wallet.domain || '',
                                        setCopiedDomain,
                                    )
                                }
                            />
                            <InputRightElement>
                                <Icon
                                    opacity={0.5}
                                    onClick={() =>
                                        copyToClipboard(
                                            wallet.domain || '',
                                            setCopiedDomain,
                                        )
                                    }
                                    cursor="pointer"
                                    as={
                                        copiedDomain
                                            ? IoCheckmarkOutline
                                            : IoCopyOutline
                                    }
                                />
                            </InputRightElement>
                        </InputGroup>

                        <InputGroup>
                            <InputLeftElement>
                                <Icon as={HiOutlineWallet} opacity={0.5} />
                            </InputLeftElement>
                            <Input
                                cursor="pointer"
                                value={humanAddress(wallet.address ?? '', 8, 7)}
                                readOnly
                                onClick={() =>
                                    copyToClipboard(
                                        wallet.address ?? '',
                                        setCopied,
                                    )
                                }
                            />
                            <InputRightElement>
                                <Icon
                                    opacity={0.5}
                                    cursor="pointer"
                                    onClick={() =>
                                        copyToClipboard(
                                            wallet.address ?? '',
                                            setCopied,
                                        )
                                    }
                                    as={
                                        copied
                                            ? IoCheckmarkOutline
                                            : IoCopyOutline
                                    }
                                />
                            </InputRightElement>
                        </InputGroup>
                    </VStack>
                ) : (
                    <InputGroup>
                        <InputLeftElement>
                            <Icon as={HiOutlineWallet} opacity={0.5} />
                        </InputLeftElement>
                        <Input
                            cursor="pointer"
                            value={humanAddress(wallet?.address ?? '', 6, 4)}
                            readOnly
                            onClick={() =>
                                copyToClipboard(
                                    wallet?.address ?? '',
                                    setCopied,
                                )
                            }
                        />
                        <InputRightElement>
                            <Icon
                                opacity={0.5}
                                onClick={() =>
                                    copyToClipboard(
                                        wallet?.address ?? '',
                                        setCopied,
                                    )
                                }
                                cursor="pointer"
                                as={copied ? IoCheckmarkOutline : IoCopyOutline}
                            />
                        </InputRightElement>
                    </InputGroup>
                )}
            </VStack>
        </VStack>
    );
};
