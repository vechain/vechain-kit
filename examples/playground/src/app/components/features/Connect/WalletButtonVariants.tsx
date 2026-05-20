'use client';

import {
    Box,
    Button,
    SimpleGrid,
    Text,
    useColorMode,
    VStack,
} from '@chakra-ui/react';
import {
    WalletButton,
    useConnectModal,
    useDAppKitWalletModal,
} from '@vechain/vechain-kit';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface VariantCardProps {
    label: string;
    children: ReactNode;
}

function VariantCard({ label, children }: VariantCardProps) {
    const { colorMode } = useColorMode();
    return (
        <VStack
            align="flex-start"
            spacing={3}
            p={4}
            borderRadius="md"
            borderWidth="1px"
            borderColor={
                colorMode === 'light' ? 'gray.200' : 'whiteAlpha.200'
            }
            bg={colorMode === 'light' ? 'gray.50' : 'whiteAlpha.50'}
            minH="120px"
            w="full"
        >
            <Box w="fit-content">{children}</Box>
            <Text
                fontSize="xs"
                fontFamily="mono"
                px={2}
                py={1}
                borderRadius="full"
                bg={colorMode === 'light' ? 'blue.50' : 'whiteAlpha.100'}
                color={colorMode === 'light' ? 'blue.700' : 'blue.200'}
            >
                {label}
            </Text>
        </VStack>
    );
}

export function WalletButtonVariants() {
    const { t } = useTranslation();
    const { open: openConnectModal } = useConnectModal();
    const { open: openDappKitWalletModal } = useDAppKitWalletModal();

    return (
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
            <VariantCard label='variant="modal"'>
                <WalletButton connectionVariant="modal" />
            </VariantCard>

            <VariantCard label='variant="popover" (desktop only)'>
                <WalletButton connectionVariant="popover" />
            </VariantCard>

            <VariantCard label={t('Custom styling (buttonStyle prop)')}>
                <WalletButton
                    connectionVariant="modal"
                    buttonStyle={{
                        border: '2px solid #000000',
                        boxShadow: '-2px 2px 3px 1px #00000038',
                        background: '#f08098',
                        color: 'white',
                        _hover: {
                            background: '#db607a',
                            border: '1px solid #000000',
                            boxShadow: '-3px 2px 3px 1px #00000038',
                        },
                        transition: 'all 0.2s ease',
                    }}
                />
            </VariantCard>

            <VariantCard label="useConnectModal()">
                <Button onClick={() => openConnectModal()}>
                    {t('Open VeChain Kit modal')}
                </Button>
            </VariantCard>

            <VariantCard label="useDAppKitWalletModal()">
                <Button onClick={() => openDappKitWalletModal()}>
                    {t('Open dapp-kit only modal')}
                </Button>
            </VariantCard>
        </SimpleGrid>
    );
}
