import { Grid, Icon, IconButton } from '@chakra-ui/react';
import { MdSwapHoriz } from 'react-icons/md';
import { BsLightningCharge } from 'react-icons/bs';
import { FaRegArrowAltCircleDown } from 'react-icons/fa';
import { FiSend } from 'react-icons/fi';
import { AccountModalContentTypes } from '../Types';

type Props = {
    mt?: number;
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
};

export const QuickActionsSection = ({ mt, setCurrentContent }: Props) => {
    return (
        <Grid templateColumns="repeat(4, 1fr)" gap={2} w="full" mt={mt}>
            <IconButton
                disabled
                variant="selector"
                h="auto"
                py={3}
                fontSize="xs"
                verticalAlign="middle"
                aria-label="Buy"
                icon={<Icon as={BsLightningCharge} boxSize={5} opacity={0.5} />}
            />
            <IconButton
                variant="selector"
                h="auto"
                py={3}
                aria-label="Swap"
                icon={<Icon as={MdSwapHoriz} boxSize={5} opacity={0.5} />}
                onClick={() => setCurrentContent('swap-token')}
            />
            <IconButton
                variant="selector"
                h="auto"
                py={3}
                aria-label="Receive"
                icon={
                    <Icon
                        as={FaRegArrowAltCircleDown}
                        boxSize={5}
                        opacity={0.5}
                    />
                }
                onClick={() => setCurrentContent('receive-token')}
            />
            <IconButton
                variant="selector"
                h="auto"
                py={3}
                aria-label="Send"
                icon={<Icon as={FiSend} boxSize={5} opacity={0.5} />}
                onClick={() => setCurrentContent('send-token')}
            />
        </Grid>
    );
};
