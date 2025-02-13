import { Grid, Icon, IconButton, VStack, Text } from '@chakra-ui/react';
import { MdSwapHoriz } from 'react-icons/md';
import { FaRegArrowAltCircleDown } from 'react-icons/fa';
import { FiSend } from 'react-icons/fi';
import { AccountModalContentTypes } from '../Types';
import { useBalances, useWallet } from '@/hooks';
import { IoMdApps } from 'react-icons/io';

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
    return (
        <Grid templateColumns="repeat(4, 1fr)" gap={2} w="full" mt={mt}>
            <IconButton
                variant="vechainKitSelector"
                h="auto"
                py={3}
                fontSize="xs"
                verticalAlign="middle"
                aria-label="Apps"
                icon={
                    <VStack spacing={2}>
                        <Icon as={IoMdApps} boxSize={6} opacity={0.9} />
                        <Text fontSize="sm" fontWeight={'400'}>
                            Apps
                        </Text>
                    </VStack>
                }
                onClick={() => setCurrentContent('ecosystem')}
            />
            <IconButton
                variant="vechainKitSelector"
                h="auto"
                py={3}
                aria-label="Swap"
                icon={
                    <VStack spacing={2}>
                        <Icon as={MdSwapHoriz} boxSize={6} opacity={0.9} />
                        <Text fontSize="sm" fontWeight={'400'}>
                            Swap
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
                            Receive
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
                            Send
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
        </Grid>
    );
};
