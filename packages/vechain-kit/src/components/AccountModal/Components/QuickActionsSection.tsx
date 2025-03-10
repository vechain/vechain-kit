import {
    Grid,
    Icon,
    IconButton,
    VStack,
    Text,
    Heading,
} from '@chakra-ui/react';
import { MdSwapHoriz } from 'react-icons/md';
import { FaRegArrowAltCircleDown } from 'react-icons/fa';
import { FiSend } from 'react-icons/fi';
import { AccountModalContentTypes } from '../Types';
import { useBalances, useWallet } from '@/hooks';
import { IoMdApps, IoMdSettings } from 'react-icons/io';
import { useTranslation } from 'react-i18next';
import { PiBridgeThin } from 'react-icons/pi';

type Props = {
    mt?: number;
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
};

export const QuickActionsSection = ({ mt, setCurrentContent }: Props) => {
    const { account } = useWallet();
    const { totalBalance } = useBalances({
        address: account?.address ?? '',
    });
    const { t } = useTranslation();

    return (
        <VStack w={'full'} mt={mt} spacing={4}>
            <Heading size={'xs'} fontWeight={'500'} w={'full'} opacity={0.5}>
                {t('Activities')}
            </Heading>
            <Grid templateColumns="repeat(3, 1fr)" gap={2} w="full">
                <IconButton
                    variant="vechainKitSelector"
                    h="auto"
                    py={3}
                    aria-label="Swap"
                    icon={
                        <VStack spacing={2}>
                            <Icon as={MdSwapHoriz} boxSize={6} opacity={0.9} />
                            <Text fontSize="sm" fontWeight={'400'}>
                                {t('Swap')}
                            </Text>
                        </VStack>
                    }
                    onClick={() => setCurrentContent('swap-token')}
                />
                <IconButton
                    variant="vechainKitSelector"
                    h="auto"
                    py={3}
                    aria-label="Receive"
                    icon={
                        <VStack spacing={2}>
                            <Icon
                                as={FaRegArrowAltCircleDown}
                                boxSize={6}
                                opacity={0.9}
                            />
                            <Text fontSize="sm" fontWeight={'400'}>
                                {t('Receive')}
                            </Text>
                        </VStack>
                    }
                    onClick={() => setCurrentContent('receive-token')}
                />
                <IconButton
                    variant="vechainKitSelector"
                    h="auto"
                    py={3}
                    aria-label="Send"
                    icon={
                        <VStack spacing={2}>
                            <Icon as={FiSend} boxSize={6} opacity={0.9} />
                            <Text fontSize="sm" fontWeight={'400'}>
                                {t('Send')}
                            </Text>
                        </VStack>
                    }
                    isDisabled={totalBalance === 0}
                    onClick={() =>
                        setCurrentContent({
                            type: 'send-token',
                            props: {
                                setCurrentContent,
                                isNavigatingFromMain: true,
                            },
                        })
                    }
                />
                <IconButton
                    variant="vechainKitSelector"
                    h="auto"
                    py={3}
                    fontSize="xs"
                    verticalAlign="middle"
                    aria-label="Bridge"
                    icon={
                        <VStack spacing={2}>
                            <Icon as={PiBridgeThin} boxSize={6} opacity={0.9} />
                            <Text fontSize="sm" fontWeight={'400'}>
                                {t('Bridge')}
                            </Text>
                        </VStack>
                    }
                    onClick={() => setCurrentContent('bridge')}
                />
                <IconButton
                    variant="vechainKitSelector"
                    h="auto"
                    py={3}
                    fontSize="xs"
                    verticalAlign="middle"
                    aria-label="Ecosystem"
                    icon={
                        <VStack spacing={2}>
                            <Icon as={IoMdApps} boxSize={6} opacity={0.9} />
                            <Text fontSize="sm" fontWeight={'400'}>
                                {t('Ecosystem')}
                            </Text>
                        </VStack>
                    }
                    onClick={() => setCurrentContent('ecosystem')}
                />

                <IconButton
                    variant="vechainKitSelector"
                    h="auto"
                    py={3}
                    fontSize="xs"
                    verticalAlign="middle"
                    aria-label="Settings"
                    icon={
                        <VStack spacing={2}>
                            <Icon as={IoMdSettings} boxSize={6} opacity={0.9} />
                            <Text fontSize="sm" fontWeight={'400'}>
                                {t('Settings')}
                            </Text>
                        </VStack>
                    }
                    onClick={() => setCurrentContent('settings')}
                />
            </Grid>
        </VStack>
    );
};
