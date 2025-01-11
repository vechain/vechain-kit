import { Grid, Icon, IconButton } from '@chakra-ui/react';
import { MdSwapHoriz } from 'react-icons/md';
import { BiPurchaseTag } from 'react-icons/bi';
import { IoReceiptOutline } from 'react-icons/io5';
import { FiSend } from 'react-icons/fi';

export const QuickActionsSection = () => {
    return (
        <Grid templateColumns="repeat(4, 1fr)" gap={2} w="full">
            <IconButton
                disabled
                variant="selector"
                h="auto"
                py={3}
                fontSize="xs"
                verticalAlign="middle"
                aria-label="Buy"
                icon={<Icon as={BiPurchaseTag} boxSize={5} opacity={0.5} />}
            />
            <IconButton
                disabled
                variant="selector"
                h="auto"
                py={3}
                aria-label="Swap"
                icon={<Icon as={MdSwapHoriz} boxSize={5} opacity={0.5} />}
            />
            <IconButton
                disabled
                variant="selector"
                h="auto"
                py={3}
                aria-label="Receive"
                icon={<Icon as={IoReceiptOutline} boxSize={5} opacity={0.5} />}
            />
            <IconButton
                disabled
                variant="selector"
                h="auto"
                py={3}
                aria-label="Send"
                icon={<Icon as={FiSend} boxSize={5} opacity={0.5} />}
            />
        </Grid>
    );
};
