import { Icon, Text, VStack, Button } from '@chakra-ui/react';
import { IoWalletOutline } from 'react-icons/io5';
import { motion } from 'framer-motion';

const MotionVStack = motion(VStack);

type Props = {
    onOpenReceiveModal: () => void;
};

export const NFTsTabPanel = ({ onOpenReceiveModal }: Props) => {
    return (
        <MotionVStack
            spacing={4}
            align="center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            mt={8}
        >
            <Icon
                as={IoWalletOutline}
                boxSize={12}
                opacity={0.5}
                p={2}
                bg="whiteAlpha.100"
                borderRadius="xl"
            />
            <VStack spacing={1}>
                <Text fontSize="lg" fontWeight="500">
                    Coming soon
                </Text>
                <Text fontSize="sm" opacity={0.5} textAlign="center">
                    Stay tuned for our upcoming NFT feature
                </Text>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onOpenReceiveModal}
                    mt={2}
                >
                    Receive tokens
                </Button>
            </VStack>
        </MotionVStack>
    );
};
