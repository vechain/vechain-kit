import { IconButton, IconButtonProps } from '@chakra-ui/react';
import { IoChevronBack } from 'react-icons/io5';

type BackButtonProps = {
    onClick: () => void;
} & Partial<IconButtonProps>;

export const ModalBackButton = ({ onClick, ...props }: BackButtonProps) => {
    return (
        <IconButton
            aria-label="Back"
            icon={<IoChevronBack fontSize={'20px'} />}
            size="sm"
            variant="ghost"
            _hover={{ bg: 'blackAlpha.100' }}
            _dark={{ _hover: { bg: 'whiteAlpha.100' } }}
            position="absolute"
            borderRadius={'50%'}
            left="10px"
            top="10px"
            onClick={onClick}
            {...props}
        />
    );
};
