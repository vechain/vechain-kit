import {
    Box,
    HStack,
    Icon,
    Text,
    useToken,
    useColorModeValue,
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { LuCheck } from 'react-icons/lu';
import { useEffect, useState } from 'react';

type Props = {
    message: string;
    duration?: number;
    onClose?: () => void;
};

const slideIn = keyframes`
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(-100%);
    opacity: 0;
  }
`;

export const InlineFeedback = ({
    message,
    duration = 2000,
    onClose,
}: Props) => {
    const [isVisible, setIsVisible] = useState(true);
    const textPrimary = useToken('colors', 'vechain-kit-text-primary');
    const bgColor = useColorModeValue('#f0f9ff', '#0000009e');
    const borderColor = useColorModeValue('#bfdbfe', '#3b3b3b');
    const iconColor = useToken('colors', 'vechain-kit-primary');

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(() => {
                onClose?.();
            }, 300); // Wait for animation to complete
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <Box
            position="absolute"
            w="fit-content"
            margin="auto"
            animation={`${isVisible ? slideIn : slideOut} 0.3s ease-in-out`}
            zIndex={10}
        >
            <Box
                bg={bgColor}
                borderWidth={1}
                borderColor={borderColor}
                borderRadius="md"
                px={4}
                py={3}
                mx={4}
                mt={2}
            >
                <HStack spacing={3} align="center">
                    <Icon
                        as={LuCheck}
                        boxSize={5}
                        color={iconColor}
                        flexShrink={0}
                    />
                    <Text
                        fontSize="sm"
                        fontWeight="500"
                        color={textPrimary}
                        flex={1}
                    >
                        {message}
                    </Text>
                </HStack>
            </Box>
        </Box>
    );
};
