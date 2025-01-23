import { Grid, Icon, IconButton } from '@chakra-ui/react';
import { MdSwapHoriz } from 'react-icons/md';
import { FaRegArrowAltCircleDown } from 'react-icons/fa';
import { FiSend } from 'react-icons/fi';
import { AccountModalContentTypes } from '../Types';
import { useBalances, useWallet } from '@/hooks';
import { IoPlanet } from 'react-icons/io5';

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
                aria-label="Ecosystem"
                icon={<Icon as={IoPlanet} boxSize={5} opacity={0.9} />}
                onClick={() => setCurrentContent('ecosystem')}
            />
            <IconButton
                variant="vechainKitSelector"
                h="auto"
                py={3}
                aria-label="Swap"
                icon={<Icon as={MdSwapHoriz} boxSize={5} opacity={0.9} />}
                onClick={() => setCurrentContent('swap-token')}
            />
            <IconButton
                variant="vechainKitSelector"
                h="auto"
                py={3}
                aria-label="Receive"
                icon={
                    <Icon
                        as={FaRegArrowAltCircleDown}
                        boxSize={5}
                        opacity={0.9}
                    />
                }
                onClick={() => setCurrentContent('receive-token')}
            />
            <IconButton
                variant="vechainKitSelector"
                h="auto"
                py={3}
                aria-label="Send"
                icon={<Icon as={FiSend} boxSize={5} opacity={0.9} />}
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
